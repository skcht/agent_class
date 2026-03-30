"""
06 — Session Hook：攔截與修改行為

展示六種 hook 的使用方式，每種都有簡單運行範例。

Hook 觸發順序：
  session_start → (user_prompt_submitted → pre_tool_use → post_tool_use)* → session_end
  error_occurred 可在任何階段觸發
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


# ──────────────────────────────────────────────
# 1. on_session_start — Session 啟動時觸發
#    可回傳 additionalContext 作為全域上下文
# ──────────────────────────────────────────────

async def on_session_start(input_data, invocation):
    source = input_data.get("source", "unknown")
    print(f"  🟢 [on_session_start] Session 啟動 (source={source})")
    return {"additionalContext": "This project uses Python. Always respond concisely."}


# ──────────────────────────────────────────────
# 2. on_user_prompt_submitted — 使用者送出訊息時觸發
#    可回傳 modifiedPrompt 改寫使用者的 prompt
# ──────────────────────────────────────────────

async def on_user_prompt_submitted(input_data, invocation):
    original = input_data["prompt"]
    print(f"  📝 [on_user_prompt_submitted] 原始: {original[:60]}...")
    modified = f"[Context: user is a Python developer] {original}"
    return {"modifiedPrompt": modified}


# ──────────────────────────────────────────────
# 3. on_pre_tool_use — 工具執行「前」觸發
#    可回傳 permissionDecision: "allow" | "deny" | "ask"
# ──────────────────────────────────────────────

async def on_pre_tool_use(input_data, invocation):
    tool_name = input_data.get("toolName", "unknown")
    tool_input = str(input_data.get("toolInput", ""))[:80]
    print(f"  🔧 [on_pre_tool_use] 工具={tool_name}, 輸入={tool_input}")

    # 範例：攔截危險的 shell 指令
    if tool_name == "shell" and "rm " in str(input_data.get("toolInput", "")):
        print(f"  ⛔ [on_pre_tool_use] 拒絕危險指令!")
        return {
            "permissionDecision": "deny",
            "permissionDecisionReason": "Destructive shell commands are blocked.",
        }

    return {"permissionDecision": "allow"}


# ──────────────────────────────────────────────
# 4. on_post_tool_use — 工具執行「後」觸發
#    可回傳 additionalContext 附加上下文給 AI
# ──────────────────────────────────────────────

async def on_post_tool_use(input_data, invocation):
    tool_name = input_data.get("toolName", "unknown")
    print(f"  ✅ [on_post_tool_use] 工具 {tool_name} 執行完成")
    return {"additionalContext": f"Tool '{tool_name}' completed and was logged."}


# ──────────────────────────────────────────────
# 5. on_session_end — Session 結束時觸發
#    僅通知用途，無回傳值
# ──────────────────────────────────────────────

async def on_session_end(input_data, invocation):
    reason = input_data.get("reason", "unknown")
    print(f"  🔴 [on_session_end] Session 結束 (reason={reason})")


# ──────────────────────────────────────────────
# 6. on_error_occurred — 錯誤發生時觸發
#    可回傳 errorHandling: "retry" | "skip" | "abort"
#    retry 可搭配 retryCount 指定重試次數
# ──────────────────────────────────────────────

async def on_error_occurred(input_data, invocation):
    error = input_data.get("error", "unknown")
    print(f"  ❌ [on_error_occurred] 錯誤: {error}")
    return {"errorHandling": "skip"}


# ──────────────────────────────────────────────
# 主程式：三個範例展示不同 hook 觸發情境
# ──────────────────────────────────────────────

ALL_HOOKS = {
    "on_session_start": on_session_start,
    "on_user_prompt_submitted": on_user_prompt_submitted,
    "on_pre_tool_use": on_pre_tool_use,
    "on_post_tool_use": on_post_tool_use,
    "on_session_end": on_session_end,
    "on_error_occurred": on_error_occurred,
}


async def demo_text_qa(client):
    """範例 1：純文字問答
    觸發: on_session_start → on_user_prompt_submitted → on_session_end
    """
    print("\n" + "=" * 55)
    print("範例 1：純文字問答")
    print("預期觸發: session_start → user_prompt_submitted → session_end")
    print("=" * 55)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        hooks=ALL_HOOKS,
    ) as session:
        response = await session.send_and_wait(
            "What is a Python decorator? Answer in one sentence."
        )
        if response:
            print(f"\n  AI: {response.data.content}")


async def demo_tool_use(client):
    """範例 2：觸發工具使用
    觸發: on_session_start → on_user_prompt_submitted
         → on_pre_tool_use → on_post_tool_use → on_session_end
    """
    print("\n" + "=" * 55)
    print("範例 2：觸發工具使用")
    print("預期觸發: session_start → user_prompt_submitted")
    print("        → pre_tool_use → post_tool_use → session_end")
    print("=" * 55)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        hooks=ALL_HOOKS,
    ) as session:
        response = await session.send_and_wait(
            "Use the shell tool to run: echo 'Hello from hook demo'"
        )
        if response:
            print(f"\n  AI: {response.data.content}")


async def demo_tool_deny(client):
    """範例 3：用 on_pre_tool_use 攔截危險指令
    觸發: on_session_start → on_user_prompt_submitted
         → on_pre_tool_use (deny) → on_session_end
    """
    print("\n" + "=" * 55)
    print("範例 3：攔截危險指令（pre_tool_use deny）")
    print("預期觸發: session_start → user_prompt_submitted")
    print("        → pre_tool_use (deny!) → session_end")
    print("=" * 55)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        hooks=ALL_HOOKS,
    ) as session:
        response = await session.send_and_wait(
            "Use the shell tool to run: rm -rf /tmp/test"
        )
        if response:
            print(f"\n  AI: {response.data.content}")


async def main():
    client = CopilotClient()
    await client.start()

    print("Session Hook 完整範例")
    print("展示六種 hook 在不同情境下的觸發行為")

    await demo_text_qa(client)
    await demo_tool_use(client)
    await demo_tool_deny(client)

    print("\n" + "=" * 55)
    print("全部範例執行完成!")
    print("=" * 55)

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
