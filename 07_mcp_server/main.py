"""
07 — MCP 伺服器整合

展示連接 MCP (Model Context Protocol) 伺服器擴充 agent 能力。
本範例使用 filesystem MCP server，需要 Node.js + npx。

若 dict 語法報 TypeError，請改用 keyword 語法。
"""

import asyncio
import os
import shutil
from copilot import CopilotClient, PermissionHandler


async def main():
    # 檢查 npx 是否可用
    if not shutil.which("npx"):
        print("Error: npx not found. Please install Node.js first.")
        print("  https://nodejs.org/")
        return

    client = CopilotClient()
    await client.start()

    # 使用當前目錄作為 filesystem server 的根目錄
    work_dir = os.getcwd()
    print(f"工作目錄: {work_dir}\n")

    async with await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
        "mcp_servers": {
            "filesystem": {
                "type": "local",
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-filesystem", work_dir],
                "tools": ["*"],
            },
        },
    }) as session:
        print(">>> 透過 MCP filesystem server 列出檔案...\n")
        response = await session.send_and_wait(
            f"List the files in {work_dir} and briefly describe what you see."
        )
        if response:
            print(f"AI 回覆: {response.data.content}")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
