"""
12 — Agent 專屬 MCP 伺服器

展示在 custom_agents 上掛載 mcp_servers，讓不同 agent 存取不同的外部資料。
- file-explorer: 掛載 filesystem MCP（本地檔案瀏覽）
- web-researcher: 掛載 fetch MCP（網頁抓取）
"""

import asyncio
import os
import shutil
from copilot import CopilotClient, PermissionHandler


async def main():
    if not shutil.which("npx"):
        print("Error: npx not found. Please install Node.js first.")
        print("  https://nodejs.org/")
        return

    work_dir = os.getcwd()
    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        custom_agents=[
            {
                "name": "file-explorer",
                "display_name": "檔案探索員",
                "description": "瀏覽本地檔案系統，列出和讀取檔案內容",
                "tools": ["grep", "glob", "view"],
                "prompt": (
                    "你是檔案系統專家，請使用繁體中文回覆。"
                    "透過 MCP filesystem server 瀏覽和分析檔案。"
                ),
                "mcp_servers": {
                    "filesystem": {
                        "type": "local",
                        "command": "npx",
                        "args": [
                            "-y",
                            "@modelcontextprotocol/server-filesystem",
                            work_dir,
                        ],
                        "tools": ["*"],
                    },
                },
            },
            {
                "name": "web-researcher",
                "display_name": "網路研究員",
                "description": "從網路抓取資料並摘要分析",
                "prompt": (
                    "你是網路研究專家，請使用繁體中文回覆。"
                    "透過 MCP fetch server 取得網頁內容並分析。"
                ),
                "mcp_servers": {
                    "fetch": {
                        "type": "remote",
                        "url": "https://router.mcp.so/sse/fetch",
                        "tools": ["*"],
                    },
                },
            },
        ],
    ) as session:
        # 檔案探索任務 — 預期委派給 file-explorer
        print("=== 檔案探索（file-explorer agent）===\n")
        response = await session.send_and_wait(
            f"請列出 {work_dir} 底下的檔案，並簡要描述專案結構。"
        )
        if response:
            print(f"AI 回覆: {response.data.content}")

        # 網路研究任務 — 預期委派給 web-researcher
        print("\n=== 網路研究（web-researcher agent）===\n")
        response = await session.send_and_wait(
            "請抓取 https://httpbin.org/get 的內容並摘要說明回傳了什麼資料。"
        )
        if response:
            print(f"AI 回覆: {response.data.content}")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
