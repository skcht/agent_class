"""
18 — Agent 記憶：跨 Session 保留上下文

展示如何用 system_message + Events 實作跨 session 的記憶機制：
- system_message → 建 session 前讀取記憶檔案，直接塞進 system prompt
- session.on(ASSISTANT_MESSAGE) → 追蹤對話內容
- 結束前送「請總結」prompt → AI 自己做摘要
- 摘要寫入記憶檔案 → 下次 session 讀取

注入記憶的方式比較：
  1. system_message（本課使用）— 最可靠，直接成為 system prompt 的一部分
  2. on_session_start + additionalContext — SDK preview 行為不穩定，不建議
  3. on_user_prompt_submitted + modifiedPrompt — 每次都注入，適合動態記憶

參考:
  https://github.com/github/copilot-sdk
  https://github.com/github/copilot-sdk/blob/main/docs/hooks/session-lifecycle.md
  https://github.com/github/copilot-sdk/blob/main/docs/events/index.md
"""

import asyncio
import json
import os
import sys
from datetime import datetime, timezone

from copilot import CopilotClient, PermissionHandler
from copilot.generated.session_events import SessionEventType

# 修正 Windows 終端機的編碼問題
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ──────────────────────────────────────────────
# 記憶檔案管理
# ──────────────────────────────────────────────

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "memory.json")


def load_memory() -> dict:
    """讀取記憶檔案。不存在則回傳空結構。"""
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {"summaries": [], "updated_at": None}


def save_memory(memory: dict):
    """寫入記憶檔案。"""
    memory["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, ensure_ascii=False, indent=2)
    print(f"  [記憶] 已寫入 {MEMORY_FILE}")


def build_memory_system_message() -> dict:
    """讀取記憶檔案，組成 system_message。

    這是最可靠的記憶注入方式：直接寫進 system prompt，
    AI 在整個 session 中都能看到。
    """
    memory = load_memory()
    summaries = memory.get("summaries", [])

    if summaries:
        memory_text = "=== 先前的對話記憶 ===\n"
        memory_text += "以下是過去對話的摘要，請利用這些資訊維持對話的連貫性。\n\n"
        for i, s in enumerate(summaries, 1):
            memory_text += f"第 {i} 次對話: {s}\n"
        print(f"  [記憶] 載入 {len(summaries)} 筆歷史摘要到 system_message")
        return {"content": memory_text}

    print("  [記憶] 無歷史記憶（首次對話）")
    return {"content": "這是第一次對話，尚無歷史記憶。"}


# ──────────────────────────────────────────────
# Demo 1: 第一次對話 — 建立記憶
# ──────────────────────────────────────────────

async def demo_first_session(client: CopilotClient):
    """第一次對話：聊天 → 追蹤 → 總結 → 寫入記憶。"""
    print("=" * 60)
    print("Demo 1: 第一次對話（建立記憶）")
    print("=" * 60)

    # 建 session 前讀取記憶，組成 system_message
    system_msg = build_memory_system_message()

    # 用來累積 AI 回覆的 list
    conversation_log: list[str] = []

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        system_message=system_msg,
    ) as session:

        # 註冊事件監聽：追蹤所有 AI 回覆
        def handle_event(event):
            if event.type == SessionEventType.ASSISTANT_MESSAGE:
                if event.data.content:
                    conversation_log.append(event.data.content)

        session.on(handle_event)

        # --- 多輪對話 ---
        questions = [
            "我正在用 FastAPI 和 PostgreSQL 建一個網頁應用程式，請記住這件事。",
            "請列出 3 個 FastAPI 專案結構的最佳實踐，簡短回答。",
            "PostgreSQL 哪個擴充套件最適合做全文搜尋？",
        ]

        for i, q in enumerate(questions, 1):
            print(f"\n--- 第 {i} 輪 ---")
            print(f"  問: {q}")
            response = await session.send_and_wait(q)
            if response:
                content = response.data.content
                if len(content) > 300:
                    content = content[:300] + "..."
                print(f"  答: {content}")

        print(f"\n  [追蹤] 累積了 {len(conversation_log)} 則 AI 回覆")

        # --- 結束前請 AI 總結 ---
        print("\n--- 請 AI 總結對話 ---")
        summary_response = await session.send_and_wait(
            "請用 2-3 句話總結我們的對話。"
            "重點放在：使用什麼技術棧、討論了哪些主題、"
            "以及做了什麼決定或建議。請簡潔扼要。"
        )

        if summary_response:
            summary = summary_response.data.content
            print(f"  摘要: {summary}")

            # 寫入記憶
            memory = load_memory()
            memory["summaries"].append(summary)
            save_memory(memory)

    print(f"\n  [結果] 記憶已建立，共 {len(conversation_log)} 則對話被追蹤\n")


# ──────────────────────────────────────────────
# Demo 2: 第二次對話 — 驗證記憶延續
# ──────────────────────────────────────────────

async def demo_second_session(client: CopilotClient):
    """第二次對話：讀取記憶 → agent 記得上次內容。"""
    print("=" * 60)
    print("Demo 2: 第二次對話（驗證記憶延續）")
    print("=" * 60)

    # 建 session 前讀取記憶 — 這次會讀到 Demo 1 的摘要
    system_msg = build_memory_system_message()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        system_message=system_msg,
    ) as session:

        # 問 agent 上次聊了什麼 — 它應該能回答
        print("\n--- 測試記憶延續 ---")
        response = await session.send_and_wait(
            "我上次對話中用的是什麼技術棧？我們討論了哪些主題？"
        )
        if response:
            content = response.data.content
            if len(content) > 400:
                content = content[:400] + "..."
            print(f"  問: 我們上次聊了什麼？")
            print(f"  答: {content}")

        # 繼續基於記憶的對話
        print("\n--- 基於記憶繼續對話 ---")
        response = await session.send_and_wait(
            "根據你記得的內容，幫我的專案建議一個部署策略，簡短回答。"
        )
        if response:
            content = response.data.content
            if len(content) > 400:
                content = content[:400] + "..."
            print(f"  問: 根據記憶建議部署策略")
            print(f"  答: {content}")

        # 這次也做總結，追加到記憶
        print("\n--- 第二次對話總結 ---")
        summary_response = await session.send_and_wait(
            "請用 1-2 句話總結這次對話，聚焦在新的資訊上。"
        )
        if summary_response:
            summary = summary_response.data.content
            print(f"  摘要: {summary}")

            memory = load_memory()
            memory["summaries"].append(summary)
            save_memory(memory)


# ──────────────────────────────────────────────
# 主程式
# ──────────────────────────────────────────────

async def main():
    print("Agent 記憶範例：跨 Session 保留上下文\n")

    # 清除舊的記憶檔案，確保 demo 從頭開始
    if os.path.exists(MEMORY_FILE):
        os.remove(MEMORY_FILE)
        print(f"[清理] 移除舊的 {MEMORY_FILE}\n")

    client = CopilotClient()
    await client.start()

    # Demo 1: 第一次對話 — 建立記憶
    await demo_first_session(client)

    # Demo 2: 第二次對話 — 驗證記憶延續
    await demo_second_session(client)

    await client.stop()

    # 顯示最終記憶內容
    print("\n" + "=" * 60)
    print("最終記憶檔案內容：")
    print("=" * 60)
    memory = load_memory()
    print(json.dumps(memory, ensure_ascii=False, indent=2))

    print("\n" + "=" * 60)
    print("重點回顧：")
    print("  1. system_message — 建 session 前讀記憶，塞進 system prompt（最可靠）")
    print("  2. session.on(ASSISTANT_MESSAGE) — Events 追蹤對話內容")
    print("  3. on_session_end 拿不到對話內容 — 總結要在結束前做")
    print("  4. 結束前送「請總結」prompt — 讓 AI 自己做摘要")
    print("  5. 記憶存在 JSON 檔案 — 跨 session 持久化")


if __name__ == "__main__":
    asyncio.run(main())
