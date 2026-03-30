"""
02 — 事件驅動訊息模式

send_and_wait 會凍住程式直到 AI 回完。
send() 不會 — 送出後程式繼續跑，AI 回覆透過事件通知你。

本範例證明：送出問題後，程式仍然可以同時做別的事。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
    )

    done = asyncio.Event()
    answer = None
    events_log = []

    def on_event(event):
        nonlocal answer
        event_type = event.type.value
        events_log.append(event_type)

        if event_type == "assistant.message":
            answer = event.data.content
        elif event_type == "session.idle":
            done.set()

    unsubscribe = session.on(on_event)

    # ---- 非阻塞送出 ----
    print(">>> 送出問題（send 立刻返回，不等回覆）\n")
    await session.send("Name 3 Python web frameworks in one sentence.")

    # ---- 程式沒凍住，同時做別的事 ----
    # 如果用 send_and_wait，下面這段完全無法執行，因為程式卡在等 AI
    bg_count = 0
    while not done.is_set():
        bg_count += 1
        print(f"  ⚙️  背景工作 #{bg_count}（AI 還在想...）")
        await asyncio.sleep(0.5)

    # ---- 結果 ----
    print(f"\n💬 AI 回覆:\n{answer}")
    print(f"\n📊 等 AI 的期間，程式同時完成了 {bg_count} 次背景工作")
    print(f"📡 過程中收到的事件: {events_log}")

    unsubscribe()
    await session.disconnect()
    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
