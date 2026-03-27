"""
15 — Langfuse LLM 可觀測性

展示如何整合 Langfuse 觀測平台與 Copilot SDK：
- 透過 session events 手動建立 traces、spans、generations
- 在 Langfuse Dashboard 查看完整的 LLM 呼叫鏈與 token 用量
"""

import asyncio
import os
import sys
from pathlib import Path

# 修正 Windows 終端機的編碼問題（cp950 無法處理 emoji 等字元）
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from dotenv import load_dotenv
from langfuse import Langfuse
from copilot import CopilotClient, PermissionHandler
from copilot.generated.session_events import SessionEventType

# 載入 .env（從本檔案所在目錄讀取）
load_dotenv(Path(__file__).parent / ".env")

LANGFUSE_HOST = os.environ["LANGFUSE_HOST"]
LANGFUSE_PUBLIC_KEY = os.environ["LANGFUSE_PUBLIC_KEY"]
LANGFUSE_SECRET_KEY = os.environ["LANGFUSE_SECRET_KEY"]


class LangfuseTracer:
    """將 Copilot SDK session events 映射到 Langfuse traces。

    一個使用者問題 = 一條 trace，多個 turn 成為子 span：

      user.message   → 建立 trace（root span）
      turn_start     → 建立 turn span（子 span）
      usage          → 暫存 model / tokens / cost
      message        → 建立 generation（掛在 turn span 下）
      tool.start     → 建立 tool span（掛在 root span 下）
      tool.complete  → span.end()
      turn_end       → 結束 turn span
      session.idle   → 結束 root span（整條 trace 完成）
    """

    def __init__(self, langfuse: Langfuse, session_id: str, user_id: str = "anonymous"):
        self.langfuse = langfuse
        self.session_id = session_id
        self.user_id = user_id
        # trace 層級（一個使用者問題一條）
        self.root_span = None
        self.trace_id: str | None = None
        # turn 層級（一個 LLM 呼叫一個）
        self.turn_span = None
        self.turn_count = 0
        # 暫存資料
        self.pending_usage: dict | None = None
        self.pending_input: str | None = None
        self.tool_spans: dict[str, object] = {}

    def handle_event(self, event):
        """統一的事件處理器，根據事件類型分發。"""

        if event.type == SessionEventType.USER_MESSAGE:
            # 使用者發送問題 → 建立一條新的 trace
            self.pending_input = event.data.content
            self.trace_id = Langfuse.create_trace_id()
            self.turn_count = 0
            self.root_span = self.langfuse.start_span(
                name="copilot-request",
                trace_context={"trace_id": self.trace_id},
                input=event.data.content,
            )
            self.root_span.update_trace(
                name=event.data.content[:80],
                session_id=self.session_id,
                user_id=self.user_id,
                input=event.data.content,
            )
            print(f"  [Langfuse] Trace 已建立: {event.data.content[:50]}")

        elif event.type == SessionEventType.ASSISTANT_TURN_START:
            # 每個 turn 成為 trace 下的子 span
            if self.root_span:
                self.turn_span = self.root_span.start_span(
                    name=f"turn-{self.turn_count}",
                    metadata={"turn_id": event.data.turn_id},
                )
                self.turn_count += 1

        elif event.type == SessionEventType.ASSISTANT_USAGE:
            self.pending_usage = {
                "model": event.data.model,
                "input_tokens": event.data.input_tokens or 0,
                "output_tokens": event.data.output_tokens or 0,
                "cache_read_tokens": event.data.cache_read_tokens or 0,
                "cost": event.data.cost or 0,
                "duration_ms": event.data.duration,
            }

        elif event.type == SessionEventType.ASSISTANT_MESSAGE:
            # generation 掛在 turn span 下
            parent = self.turn_span or self.root_span
            if parent:
                usage = self.pending_usage or {}
                gen = parent.start_observation(
                    name="llm-call",
                    as_type="generation",
                    model=usage.get("model"),
                    input=self.pending_input,
                    output=event.data.content,
                    usage_details={
                        "input": usage.get("input_tokens", 0),
                        "output": usage.get("output_tokens", 0),
                    },
                    metadata={
                        "message_id": event.data.message_id,
                        "duration_ms": usage.get("duration_ms"),
                        "cache_read_tokens": usage.get("cache_read_tokens", 0),
                        "cost": usage.get("cost", 0),
                    },
                )
                gen.end()

                if usage:
                    print(
                        f"  [Langfuse] Generation: model={usage.get('model')}, "
                        f"in={usage.get('input_tokens')}, out={usage.get('output_tokens')}, "
                        f"cost={usage.get('cost')}"
                    )
                self.pending_usage = None

        elif event.type == SessionEventType.TOOL_EXECUTION_START:
            # tool span 掛在 root span 下（與 turn span 同層）
            if self.root_span:
                span = self.root_span.start_span(
                    name=f"tool:{event.data.tool_name}",
                    input=event.data.arguments,
                )
                self.tool_spans[event.data.tool_call_id] = span

        elif event.type == SessionEventType.TOOL_EXECUTION_COMPLETE:
            span = self.tool_spans.pop(event.data.tool_call_id, None)
            if span:
                if event.data.success:
                    span.update(output={"success": True})
                else:
                    span.update(
                        output={"success": False},
                        status_message=str(event.data.error),
                        level="ERROR",
                    )
                span.end()

        elif event.type == SessionEventType.ASSISTANT_TURN_END:
            # 結束 turn span（但 trace 還沒結束）
            if self.turn_span:
                self.turn_span.end()
                self.turn_span = None
            self.pending_usage = None

        elif event.type == SessionEventType.SESSION_IDLE:
            # 所有 turn 都完成 → 結束整條 trace
            if self.root_span:
                self.root_span.end()
                self.root_span = None
            print(f"  [Langfuse] Trace 完成（共 {self.turn_count} 個 turn）\n")

        elif event.type == SessionEventType.SESSION_ERROR:
            if self.root_span:
                self.langfuse.create_event(
                    name="error",
                    trace_context={"trace_id": self.trace_id},
                    metadata={
                        "error_type": event.data.error_type,
                        "message": event.data.message,
                    },
                    level="ERROR",
                )


async def main():
    langfuse = Langfuse(
        public_key=LANGFUSE_PUBLIC_KEY,
        secret_key=LANGFUSE_SECRET_KEY,
        host=LANGFUSE_HOST,
    )
    print(f"[Langfuse] 已連線至 {LANGFUSE_HOST}\n")

    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
    ) as session:

        tracer = LangfuseTracer(langfuse, session_id="lesson-15-demo", user_id="kuan6")
        session.on(tracer.handle_event)

        # 任務 1：簡單問答 — 產生基本 trace（1 turn）
        print("=== 任務 1: 基本問答 ===\n")
        response = await session.send_and_wait(
            "用一句話解釋什麼是 Langfuse。"
        )
        if response:
            print(f"回覆: {response.data.content}\n")

        # 任務 2：程式碼生成 — 觀察多步驟 trace
        print("=== 任務 2: 程式碼生成 ===\n")
        response = await session.send_and_wait(
            "寫一個 Python 裝飾器，可以記錄函數的執行時間和傳入參數。"
        )
        if response:
            print(f"回覆: {response.data.content}\n")

        # 任務 3：工具使用 — 觀察工具 span（多 turn）
        print("=== 任務 3: 需要工具的任務 ===\n")
        response = await session.send_and_wait(
            "列出當前目錄下的檔案。"
        )
        if response:
            print(f"回覆: {response.data.content[:200]}...\n")

    await client.stop()

    langfuse.flush()

    print("=" * 50)
    print(f"開啟 {LANGFUSE_HOST} 查看 Langfuse Dashboard")
    print("可觀察：Traces、Generations、Tool Spans、Token 用量、成本")


if __name__ == "__main__":
    asyncio.run(main())
