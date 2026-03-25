"""
04 — 自訂權限處理器

展示選擇性允許/拒絕工具呼叫。
"""

import asyncio
from copilot import CopilotClient, PermissionRequest, PermissionRequestResult


def on_permission_request(request: PermissionRequest, invocation: dict) -> PermissionRequestResult:
    """自訂權限處理器：允許讀取，拒絕寫入和 shell 指令"""
    kind = request.kind.value

    print(f"  [權限請求] 類型={kind}")

    if kind == "read":
        print(f"    ✓ 允許讀取")
        return PermissionRequestResult(kind="approved")

    if kind == "shell":
        print(f"    ✗ 拒絕 shell 指令")
        return PermissionRequestResult(kind="denied-interactively-by-user")

    if kind == "write":
        print(f"    ✗ 拒絕寫入")
        return PermissionRequestResult(kind="denied-interactively-by-user")

    # 其他類型預設允許
    print(f"    ✓ 允許（預設）")
    return PermissionRequestResult(kind="approved")


async def main():
    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=on_permission_request,
    ) as session:
        # 這個請求可能觸發 shell 或 write 操作，會被攔截
        print(">>> 送出請求（可能觸發被拒絕的操作）...\n")
        response = await session.send_and_wait(
            "Create a file called test.txt with the content 'hello world'"
        )
        if response:
            print(f"\nAI 回覆: {response.data.content}")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
