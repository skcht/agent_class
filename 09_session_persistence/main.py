"""
09 — Session 持久化

展示 session 建立、斷線、恢復的完整流程。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler

SESSION_ID = "tutorial-persistence-demo"


async def main():
    client = CopilotClient()
    await client.start()

    # === 階段一：建立 session 並記住資訊 ===
    print("=== 階段一：建立 session ===\n")

    session = await client.create_session(
        session_id=SESSION_ID,
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
    )

    response = await session.send_and_wait(
        "Remember this: my favorite color is blue and my name is Alice. "
        "Just confirm you got it."
    )
    if response:
        print(f"AI 回覆: {response.data.content}")

    # 中斷 session（資料保留在磁碟）
    await session.disconnect()
    print("\n[Session 已中斷]\n")

    # === 列出 sessions ===
    sessions = await client.list_sessions()
    print(f"目前 session 數量: {len(sessions)}")

    last_id = await client.get_last_session_id()
    print(f"最近 session ID: {last_id}\n")

    # === 階段二：恢復 session 並驗證上下文 ===
    print("=== 階段二：恢復 session ===\n")

    resumed = await client.resume_session(
        SESSION_ID,
        on_permission_request=PermissionHandler.approve_all,
    )

    response = await resumed.send_and_wait(
        "What is my favorite color and what is my name?"
    )
    if response:
        print(f"AI 回覆: {response.data.content}")

    await resumed.disconnect()

    # === 清理 ===
    await client.delete_session(SESSION_ID)
    print(f"\n[Session '{SESSION_ID}' 已刪除]")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
