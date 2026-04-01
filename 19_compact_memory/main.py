"""
19 — 結構化記憶壓縮：借鏡 Claude Code 的 Compact Prompt

第 18 課教了基本記憶：「請用 2-3 句話總結」→ 寫入 memory.json。
問題是：自由格式摘要容易丟掉關鍵細節（檔名、錯誤修復步驟、待辦事項）。

本課從 Claude Code 的 compact prompt 設計中提取核心概念，
簡化成適合 Copilot SDK 任務型 agent 的 4 段式摘要：
- <analysis> → AI 先整理思路（草稿，不存入記憶）
- <summary> → 4 段結構：做了什麼、關鍵事實、錯誤修復、下一步
- format_compact_summary() → 剝除 analysis、提取 summary
- build_continuation_message() → 包裝成下次 session 的 system_message

進階設計（生產級做法）：
- 摘要用獨立 session + 便宜模型（gpt-5.4-mini），不佔主對話資源
- 用 send()（非阻塞）+ 事件監聽取代 send_and_wait()，避免 timeout

Claude Code 原版用 9 段（含使用者訊息列表、檔案片段等），
適合全功能 IDE 助手。Copilot SDK 的任務型 agent 用 4 段就夠。

設計靈感來源：
  https://github.com/hangsman/claude-code-source/blob/main/src/services/compact/prompt.ts

參考:
  https://github.com/github/copilot-sdk
"""

import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone

from copilot import CopilotClient, PermissionHandler
from copilot.generated.session_events import SessionEventType

# 修正 Windows 終端機的編碼問題
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ──────────────────────────────────────────────
# Compact Prompt 設計（移植自 Claude Code prompt.ts）
# ──────────────────────────────────────────────

# ── Claude Code 原版用的禁止工具前綴（參考） ──
# 原版需要這段是因為 compact 請求沿用父對話的完整工具集，
# 模型可能「手癢」呼叫工具。Copilot SDK 的 session 中
# 我們直接在對話裡送 prompt，不需要這麼強的約束，
# 但保留簡化版作為最佳實踐。
NO_TOOLS_PREAMBLE = "Respond with TEXT ONLY. Do NOT call any tools.\n\n"

# ── 簡化版 Compact Prompt（4 段，適合任務型 agent）──
# Claude Code 原版有 9 段，這裡精簡成任務型 agent 最需要的 4 段。
COMPACT_PROMPT = """Summarize the following conversation.
First, think step-by-step inside <analysis> tags.
Then, write your final summary inside <summary> tags with these 4 sections:

1. What was accomplished: What did the user ask for and what did we do?
2. Key facts: Technologies, file names, decisions, and important details.
3. Errors and fixes: Any errors encountered and how they were resolved.
4. Next step: Suggest a simple follow-up the user might want to do next.

Rules:
- Use the SAME LANGUAGE as the user for all content (if user speaks Chinese, write in Chinese).
- Do NOT mention implementation details such as databases, tables, storage format, or file paths. Only summarize what the user sees and cares about.
- For "Next step", always give a brief, helpful suggestion even if the conversation seems complete. Never write just "None".

<analysis>
[Your thought process here]
</analysis>

<summary>
1. What was accomplished:
   [Description]

2. Key facts:
   - [Fact 1]
   - [Fact 2]

3. Errors and fixes:
   - [Error → Fix]

4. Next step:
   [A helpful suggestion for what to do next]
</summary>
"""

# ── 摘要用的模型 ──
# 摘要不需要強模型，用便宜快速的模型即可
SUMMARY_MODEL = "gpt-5.4-mini"


# ──────────────────────────────────────────────
# 建構摘要 prompt
# ──────────────────────────────────────────────

def get_compact_prompt(
    transcript: str,
    custom_instructions: str | None = None,
) -> str:
    """組合 compact prompt（含對話紀錄，給獨立 session 用）。

    Args:
        transcript: 對話紀錄文字（使用者問 + AI 答）
        custom_instructions: 可加自訂指令控制摘要方向
    """
    prompt = NO_TOOLS_PREAMBLE
    prompt += f"對話紀錄：\n\n{transcript}\n\n"
    prompt += COMPACT_PROMPT

    if custom_instructions and custom_instructions.strip():
        prompt += f"\nAdditional Instructions:\n{custom_instructions}"

    return prompt


# ──────────────────────────────────────────────
# 格式化摘要（移植自 formatCompactSummary）
# ──────────────────────────────────────────────

def format_compact_summary(raw_summary: str) -> str:
    """處理 AI 產出的原始摘要：
    1. 剝除 <analysis> 草稿區塊（只是 AI 的思考過程，不需要存）
    2. 提取 <summary> 內容並加上標題
    3. 清理多餘空行
    """
    result = raw_summary

    # 剝除 analysis（草稿用途，提升摘要品質但不保留）
    result = re.sub(r"<analysis>[\s\S]*?</analysis>", "", result)

    # 提取 summary 內容
    match = re.search(r"<summary>([\s\S]*?)</summary>", result)
    if match:
        content = match.group(1).strip()
        result = f"Summary:\n{content}"

    # 清理多餘空行
    result = re.sub(r"\n\n+", "\n\n", result)
    return result.strip()


# ──────────────────────────────────────────────
# 組合「下次 session 載入用」的記憶訊息
# ──────────────────────────────────────────────

def build_continuation_message(summary: str) -> str:
    """把摘要包裝成下次 session 的 system_message 內容。

    對應 Claude Code 的 getCompactUserSummaryMessage()：
    告訴 AI 這是接續上一次對話，並提供結構化的上下文。
    """
    formatted = format_compact_summary(summary)
    return (
        "This session is being continued from a previous conversation "
        "that ran out of context. The summary below covers the earlier "
        "portion of the conversation.\n\n"
        f"{formatted}\n\n"
        "Continue the conversation from where it left off. "
        "Resume directly — do not acknowledge the summary, "
        "do not recap what was happening."
    )


# ──────────────────────────────────────────────
# 記憶檔案管理（進化版：存結構化摘要）
# ──────────────────────────────────────────────

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "memory.json")


def load_memory() -> dict:
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE, encoding="utf-8") as f:
            return json.load(f)
    return {"summaries": [], "updated_at": None}


def save_memory(memory: dict):
    memory["updated_at"] = datetime.now(timezone.utc).isoformat()
    with open(MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, ensure_ascii=False, indent=2)
    print(f"  [記憶] 已寫入 {MEMORY_FILE}")


def build_memory_system_message() -> dict:
    """讀取記憶檔案，組成 system_message。
    使用 build_continuation_message 格式化，
    讓 AI 自然地接續上次對話。
    """
    memory = load_memory()
    summaries = memory.get("summaries", [])

    if summaries:
        # 只載入最近一筆結構化摘要（最新的最有價值）
        latest = summaries[-1]
        content = build_continuation_message(latest)
        print(f"  [記憶] 載入最近一筆結構化摘要到 system_message")
        return {"content": content}

    print("  [記憶] 無歷史記憶（首次對話）")
    return {"content": "這是第一次對話，尚無歷史記憶。"}


# ──────────────────────────────────────────────
# 用便宜模型 + 獨立 session 產出結構化摘要
# ──────────────────────────────────────────────

async def summarize_conversation(
    client: CopilotClient,
    conversation_log: list[str],
    custom_instructions: str | None = None,
) -> str | None:
    """用獨立 session + 便宜模型，非同步產出結構化摘要。

    為什麼不在主對話的 session 裡做摘要？
    1. 主對話用的是強模型（貴），摘要不需要那麼聰明
    2. send_and_wait 預設 60 秒 timeout，摘要可能超時
    3. 獨立 session 用 send()（非阻塞）+ 事件監聽，更靈活
    """
    transcript = "\n".join(conversation_log)
    prompt = get_compact_prompt(transcript, custom_instructions)

    result = None
    done = asyncio.Event()

    async with await client.create_session(
        model=SUMMARY_MODEL,
        on_permission_request=PermissionHandler.approve_all,
    ) as session:

        def on_event(event):
            nonlocal result
            if event.type == SessionEventType.ASSISTANT_MESSAGE:
                result = event.data.content
            elif event.type == SessionEventType.SESSION_IDLE:
                done.set()

        session.on(on_event)

        print(f"  [摘要] 使用模型: {SUMMARY_MODEL}（便宜、快速）")
        print(f"  [摘要] 送出對話紀錄（{len(transcript)} 字元）...")
        await session.send(prompt)

        try:
            await asyncio.wait_for(done.wait(), timeout=120)
        except TimeoutError:
            print("  [摘要] 逾時（120 秒），放棄本次摘要")
            return None

    return result


# ──────────────────────────────────────────────
# Demo 1: 結構化摘要 — 建立記憶
# ──────────────────────────────────────────────

async def demo_structured_summary(client: CopilotClient):
    """多輪對話後，用便宜模型在獨立 session 產出結構化摘要。"""
    print("=" * 60)
    print("Demo 1: 結構化摘要（建立記憶）")
    print("=" * 60)

    system_msg = build_memory_system_message()
    conversation_log = []  # 收集對話紀錄，給摘要用

    # ── 第一階段：主對話（強模型） ──
    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        system_message=system_msg,
    ) as session:

        questions = [
            "我叫小明，我最喜歡的程式語言是 Python。請記住。",
            "我養了一隻叫做「咪咪」的橘貓，今年 3 歲。",
            "我下週要去東京旅行，幫我推薦一個景點就好。",
        ]

        for i, q in enumerate(questions, 1):
            print(f"\n--- 第 {i} 輪 ---")
            print(f"  問: {q[:80]}...")
            conversation_log.append(f"使用者：{q}")
            try:
                response = await session.send_and_wait(q, timeout=120)
            except TimeoutError:
                print("  [逾時] AI 回應超過 120 秒，跳過此輪")
                conversation_log.append("AI：（逾時無回應）")
                continue
            if response:
                content = response.data.content
                conversation_log.append(f"AI：{content}")
                if len(content) > 300:
                    content = content[:300] + "..."
                print(f"  答: {content}")

    # ── 第二階段：用便宜模型做摘要（獨立 session） ──
    print("\n--- 用獨立 session + 便宜模型產出結構化摘要 ---")
    raw_summary = await summarize_conversation(
        client,
        conversation_log,
        custom_instructions="重點記錄使用者的個人資訊和偏好。",
    )

    if raw_summary:
        print(f"\n  [原始回覆長度] {len(raw_summary)} 字元")

        # 格式化：剝除 analysis、提取 summary
        formatted = format_compact_summary(raw_summary)
        print(f"  [格式化後長度] {len(formatted)} 字元")
        print(f"\n  --- 格式化後的摘要 ---")
        preview = formatted[:600] + "..." if len(formatted) > 600 else formatted
        print(f"  {preview}")

        # 寫入記憶
        memory = load_memory()
        memory["summaries"].append(formatted)
        save_memory(memory)

    print()


# ──────────────────────────────────────────────
# Demo 2: 載入記憶 — 驗證延續性
# ──────────────────────────────────────────────

async def demo_continue_with_memory(client: CopilotClient):
    """第二次對話：載入結構化摘要，驗證 AI 能接續。"""
    print("=" * 60)
    print("Demo 2: 載入結構化記憶（驗證延續性）")
    print("=" * 60)

    system_msg = build_memory_system_message()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        system_message=system_msg,
    ) as session:

        test_questions = [
            "我叫什麼名字？我最喜歡的程式語言是什麼？",
            "我的貓叫什麼？幾歲？",
            "我下週要去哪裡旅行？",
        ]

        for i, q in enumerate(test_questions, 1):
            print(f"\n--- 測試 {i} ---")
            print(f"  問: {q}")
            try:
                response = await session.send_and_wait(q, timeout=120)
            except TimeoutError:
                print("  [逾時] AI 回應超過 120 秒，跳過此輪")
                continue
            if response:
                content = response.data.content
                if len(content) > 400:
                    content = content[:400] + "..."
                print(f"  答: {content}")



# ──────────────────────────────────────────────
# 主程式
# ──────────────────────────────────────────────

async def main():
    print("結構化記憶壓縮：用 Compact Prompt 做智慧摘要\n")

    # 清除舊記憶
    if os.path.exists(MEMORY_FILE):
        os.remove(MEMORY_FILE)
        print(f"[清理] 移除舊的 {MEMORY_FILE}\n")


    client = CopilotClient()
    await client.start()

    # Demo 1: 結構化摘要
    await demo_structured_summary(client)

    # Demo 2: 載入記憶，驗證延續性
    await demo_continue_with_memory(client)

    await client.stop()

    # 顯示最終記憶
    print("\n" + "=" * 60)
    print("最終記憶檔案內容（截取前 500 字元）：")
    print("=" * 60)
    memory = load_memory()
    content = json.dumps(memory, ensure_ascii=False, indent=2)
    print(content[:500] + "..." if len(content) > 500 else content)

    print("\n" + "=" * 60)
    print("重點回顧：")
    print("  1. Compact Prompt — 用結構化 prompt 取代「請總結」")
    print("  2. <analysis> + <summary> — AI 先思考再輸出，品質更高")
    print("  3. format_compact_summary() — 剝除草稿、提取精華")
    print("  4. 4 段結構 — 做了什麼、關鍵事實、錯誤修復、下一步")
    print("  5. 獨立 session + 便宜模型 — 摘要不佔主對話的資源和預算")
    print("  6. send() 非阻塞 — 用事件監聽取代 send_and_wait，避免 timeout")
    print("  7. build_continuation_message() — 包裝成下次 session 的上下文")


if __name__ == "__main__":
    asyncio.run(main())
