"""
03 — 即時串流輸出

啟用 streaming=True，逐 token 即時顯示 AI 回覆。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session(
        model="claude-sonnet-4.6",
        streaming=True,
        on_permission_request=PermissionHandler.approve_all,
    )

    done = asyncio.Event()

    def on_event(event):
        event_type = event.type.value

        if event_type == "assistant.message_delta":
            # 逐 token 即時輸出
            print(event.data.delta_content or "", end="", flush=True)

        elif event_type == "assistant.reasoning_delta":
            # 思考過程（部分模型支援）
            print(f"[思考] {event.data.delta_content or ''}", end="", flush=True)

        elif event_type == "assistant.message":
            # 最終完整回覆
            print("\n\n--- 完整回覆 ---")
            print(event.data.content)

        elif event_type == "session.idle":
            done.set()

    session.on(on_event)

    print(">>> 串流輸出中...\n")
    await session.send("Tell me a short story about a robot learning to cook. Keep it under 100 words.")
    await done.wait()

    await session.disconnect()
    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
