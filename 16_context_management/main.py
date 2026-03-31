"""
16 — 上下文管理

展示 infinite_sessions 的使用方式：
- 啟用自動壓縮，讓長對話不會因為上下文溢出而中斷
- 監聽壓縮事件，觀察壓縮何時發生
- 對比：分段處理 vs 單一長 session
"""

import asyncio
import sys

from copilot import CopilotClient, PermissionHandler
from copilot.generated.session_events import SessionEventType

# 修正 Windows 終端機的編碼問題
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


async def demo_infinite_session(client: CopilotClient):
    """展示啟用 infinite_sessions 的長對話。"""

    print("=== Demo 1: Infinite Session（自動壓縮）===\n")

    compaction_count = 0

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        infinite_sessions={
            "enabled": True,
            "background_compaction_threshold": 0.10,
            "buffer_exhaustion_threshold": 0.20,
        },
    ) as session:

        def handle_event(event):
            nonlocal compaction_count
            if event.type == SessionEventType.CONTEXT_COMPACTION_STARTED:
                print("\n  [壓縮] 上下文接近上限，開始壓縮舊對話...")
            elif event.type == SessionEventType.CONTEXT_COMPACTION_COMPLETED:
                compaction_count += 1
                print(f"  [壓縮] 壓縮完成（第 {compaction_count} 次）\n")

        session.on(handle_event)

        # 多輪對話，模擬漸進累積上下文的情境
        questions = [
            "用一句話解釋什麼是 context window。",
            "那 tokenizer 是如何把文字轉成 tokens 的？舉一個具體的例子。",
            "為什麼不同語言（如中文 vs 英文）的 token 數量差異很大？",
            "如果上下文快滿了，有哪些策略可以處理？列出 5 種方法。",
            "請根據我們剛才的對話，寫一份 200 字的摘要。",
        ]

        for i, question in enumerate(questions):
            print(f"--- 第 {i + 1} 輪 ---")
            print(f"問: {question}")

            response = await session.send_and_wait(question)
            if response:
                content = response.data.content
                # 截斷過長的回覆以保持輸出整潔
                if len(content) > 300:
                    content = content[:300] + "..."
                print(f"答: {content}\n")

    print(f"[結果] 共 {len(questions)} 輪對話，壓縮了 {compaction_count} 次\n")


async def demo_segmented_sessions(client: CopilotClient):
    """展示分段處理策略：每個子任務用獨立 session。"""

    print("=== Demo 2: 分段處理（每個任務獨立 session）===\n")

    modules = [
        ("auth", "列出 Python 中常見的身份驗證方式，用條列式回答。"),
        ("database", "列出 Python 中常見的 ORM 框架，用條列式回答。"),
        ("api", "列出設計 REST API 時的 5 個最佳實踐。"),
    ]

    results = {}

    for module_name, task in modules:
        print(f"--- 模組: {module_name} ---")

        async with await client.create_session(
            model="claude-sonnet-4.6",
            on_permission_request=PermissionHandler.approve_all,
        ) as session:
            response = await session.send_and_wait(task)
            if response:
                content = response.data.content
                if len(content) > 200:
                    content = content[:200] + "..."
                print(f"結果: {content}\n")
                results[module_name] = response.data.content

    print(f"[結果] 完成 {len(results)} 個模組，每個都有乾淨的上下文\n")


async def main():
    client = CopilotClient()
    await client.start()

    # Demo 1: 用 infinite_sessions 跑多輪長對話
    await demo_infinite_session(client)

    # Demo 2: 分段處理，每個子任務用獨立 session
    await demo_segmented_sessions(client)

    await client.stop()

    print("=" * 50)
    print("重點回顧：")
    print("  1. infinite_sessions 讓長對話自動壓縮，不怕上下文溢出")
    print("  2. 壓縮會丟失細節 — 關鍵資訊應放在 system message 或最近的 prompt")
    print("  3. 對批次任務，分段處理比單一長 session 更可靠")
    print("  4. 可以透過事件監聽壓縮時機，掌握上下文狀態")


if __name__ == "__main__":
    asyncio.run(main())
