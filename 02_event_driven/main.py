"""
02 — 事件驅動訊息模式

展示非阻塞 send() + session.on() 事件處理器。

若 dict 語法報 TypeError，請改用 keyword 語法。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
    })

    done = asyncio.Event()
    message_count = 0

    def on_event(event):
        nonlocal message_count
        event_type = event.type.value

        if event_type == "assistant.message":
            message_count += 1
            print(f"\n[訊息 #{message_count}] {event.data.content}")
        elif event_type == "session.idle":
            done.set()

    # 註冊事件處理器（返回 unsubscribe 函式）
    unsubscribe = session.on(on_event)

    # 第一輪對話
    print(">>> 送出第一個問題...")
    await session.send("My name is Alice. Remember it.")
    await done.wait()

    # 重置，進行第二輪
    done.clear()
    print("\n>>> 送出第二個問題...")
    await session.send("What is my name?")
    await done.wait()

    # 取消訂閱並清理
    unsubscribe()
    await session.disconnect()
    await client.stop()

    print(f"\n共收到 {message_count} 則回覆")


if __name__ == "__main__":
    asyncio.run(main())
