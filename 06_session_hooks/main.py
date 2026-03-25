"""
06 — Session Hook：攔截與修改行為

展示六種 hook 的使用方式。

若 dict 語法報 TypeError，請改用 keyword 語法。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


# --- Hook 定義 ---

async def on_session_start(input_data, invocation):
    source = input_data.get("source", "unknown")
    print(f"[Hook] Session 啟動 (source={source})")
    return {"additionalContext": "This project uses Python. Always respond concisely."}


async def on_user_prompt_submitted(input_data, invocation):
    original = input_data["prompt"]
    modified = f"[Context: user is a Python developer] {original}"
    print(f"[Hook] Prompt 已修改: 加入使用者上下文")
    return {"modifiedPrompt": modified}


async def on_pre_tool_use(input_data, invocation):
    tool_name = input_data.get("toolName", "unknown")
    print(f"[Hook] 準備執行工具: {tool_name}")
    # 允許所有工具執行（也可回傳 "deny" 或 "ask"）
    return {"permissionDecision": "allow"}


async def on_post_tool_use(input_data, invocation):
    print(f"[Hook] 工具執行完成")
    return {"additionalContext": "Tool execution was logged."}


async def on_session_end(input_data, invocation):
    reason = input_data.get("reason", "unknown")
    print(f"[Hook] Session 結束 (reason={reason})")


async def on_error_occurred(input_data, invocation):
    print(f"[Hook] 發生錯誤，選擇跳過")
    return {"errorHandling": "skip"}


# --- 主程式 ---

async def main():
    client = CopilotClient()
    await client.start()

    async with await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
        "hooks": {
            "on_session_start": on_session_start,
            "on_user_prompt_submitted": on_user_prompt_submitted,
            "on_pre_tool_use": on_pre_tool_use,
            "on_post_tool_use": on_post_tool_use,
            "on_session_end": on_session_end,
            "on_error_occurred": on_error_occurred,
        },
    }) as session:
        print("\n>>> 送出請求...\n")
        response = await session.send_and_wait(
            "Explain what a Python decorator is in 2 sentences."
        )
        if response:
            print(f"\nAI 回覆: {response.data.content}")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
