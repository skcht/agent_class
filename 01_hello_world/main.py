"""
01 — Hello World：Copilot SDK 最小可運行範例

展示 CopilotClient 生命週期與 send_and_wait 阻塞式呼叫。

若 dict 語法報 TypeError，請改用 keyword 語法：
    session = await client.create_session(
        model="gpt-5",
        on_permission_request=PermissionHandler.approve_all,
    )
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


async def main():
    # 1. 建立客戶端
    client = CopilotClient()
    await client.start()

    # 2. 建立 session（async with 自動處理 disconnect）
    async with await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
    }) as session:
        # 3. 送出訊息並等待回覆
        response = await session.send_and_wait("What is 2+2? Reply in one sentence.")
        if response:
            print(f"AI 回覆: {response.data.content}")
        else:
            print("未收到回覆")

    # 4. 停止客戶端
    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
