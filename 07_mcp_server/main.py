"""
07 — MCP 伺服器整合

展示連接 MCP (Model Context Protocol) 伺服器擴充 agent 能力。
- Local MCP: filesystem server（需要 Node.js + npx）
- Remote MCP: fetch server（透過 SSE 連線遠端 MCP 伺服器）
"""

import asyncio
import os
import shutil
from copilot import CopilotClient, PermissionHandler


async def demo_local_mcp(client: CopilotClient):
    """示範 local MCP server — filesystem"""
    work_dir = os.getcwd()
    print(f"=== Local MCP: filesystem server ===")
    print(f"工作目錄: {work_dir}\n")

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        mcp_servers={
            "filesystem": {
                "type": "local",
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-filesystem", work_dir],
                "tools": ["*"],
            },
        },
    ) as session:
        print(">>> 透過 MCP filesystem server 列出檔案...\n")
        response = await session.send_and_wait(
            f"List the files in {work_dir} and briefly describe what you see."
        )
        if response:
            print(f"AI 回覆: {response.data.content}\n")


async def demo_remote_mcp(client: CopilotClient):
    """示範 remote MCP server — fetch (透過 SSE 連線)"""
    print("=== Remote MCP: fetch server ===\n")

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        mcp_servers={
            "fetch": {
                "type": "remote",
                "url": "https://router.mcp.so/sse/fetch",
                "tools": ["*"],
            },
        },
    ) as session:
        print(">>> 透過遠端 fetch MCP server 抓取網頁內容...\n")
        # response = await session.send_and_wait(
        #     "Use the fetch tool to get the content of https://httpbin.org/get "
        #     "and summarize the response."
        # )
        response = await session.send_and_wait(
            "用 context7 mcp 查看 copilot-sdk 如何設定 MCP"
        )        

        if response:
            print(f"AI 回覆: {response.data.content}\n")


async def main():
    # 檢查 npx 是否可用
    if not shutil.which("npx"):
        print("Error: npx not found. Please install Node.js first.")
        print("  https://nodejs.org/")
        return

    client = CopilotClient()
    await client.start()

    # 1) Local MCP server 示範
    await demo_local_mcp(client)

    # 2) Remote MCP server 示範
    await demo_remote_mcp(client)

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
