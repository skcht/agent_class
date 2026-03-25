"""
11 — Agent 工具範圍控制

展示 tools、infer、agent 屬性的使用：
- tools: 限制每個 agent 可用的工具
- infer: 控制是否允許自動選擇
- agent: 在建立 session 時預先指定 agent
"""

import asyncio
from copilot import CopilotClient, PermissionHandler


SAMPLE_CODE = '''
def fetch_users(db, role=None):
    if role:
        return db.query(f"SELECT * FROM users WHERE role = '{role}'")
    return db.query("SELECT * FROM users")

def delete_temp_files(path):
    import os, shutil
    shutil.rmtree(path)
'''


async def demo_tool_scoping(client: CopilotClient):
    """示範 tools 與 infer 屬性"""
    print("=== Demo 1: 工具範圍控制 + infer ===\n")

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        custom_agents=[
            {
                "name": "researcher",
                "display_name": "程式碼研究員",
                "description": "分析程式碼結構與安全問題，僅使用唯讀工具",
                "tools": ["grep", "glob", "view"],  # 唯讀工具
                "prompt": (
                    "你是一位程式碼分析專家，請使用繁體中文回覆。"
                    "你只能閱讀和分析程式碼，不可修改任何檔案。"
                    "專注於找出安全漏洞和架構問題。"
                ),
            },
            {
                "name": "editor",
                "display_name": "程式碼編輯員",
                "description": "修改程式碼以修復問題",
                "tools": ["view", "edit", "bash"],  # 可寫入工具
                "prompt": (
                    "你是一位程式碼編輯專家，請使用繁體中文回覆。"
                    "根據分析結果進行最小幅度的程式碼修改。"
                ),
            },
            {
                "name": "cleanup",
                "display_name": "清理工具",
                "description": "刪除未使用的檔案和死碼",
                "tools": ["bash", "edit", "view"],
                "infer": False,  # 不自動選擇，僅明確要求時啟用
                "prompt": (
                    "你是清理專家，移除死碼和未使用的檔案。"
                    "請使用繁體中文回覆，執行前務必確認。"
                ),
            },
        ],
    ) as session:
        # runtime 根據意圖自動選擇 researcher（分析任務）
        print(">>> 送出分析請求（預期自動委派給 researcher）...\n")
        response = await session.send_and_wait(
            f"請分析以下程式碼的安全問題：\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)

        # cleanup agent 不會被自動選擇（infer=False）
        # 但可以明確要求使用
        print("\n>>> 送出修改請求（預期自動委派給 editor）...\n")
        response = await session.send_and_wait(
            "請修復上述 fetch_users 中的 SQL Injection 漏洞，改用參數化查詢。"
        )
        if response:
            print(response.data.content)


async def demo_agent_preselect(client: CopilotClient):
    """示範 agent 預先選擇"""
    print("\n=== Demo 2: 預先選擇 Agent ===\n")

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        custom_agents=[
            {
                "name": "researcher",
                "display_name": "程式碼研究員",
                "description": "分析程式碼",
                "tools": ["grep", "glob", "view"],
                "prompt": "你是程式碼分析專家，請使用繁體中文回覆。",
            },
            {
                "name": "editor",
                "display_name": "程式碼編輯員",
                "description": "修改程式碼",
                "tools": ["view", "edit", "bash"],
                "prompt": "你是程式碼編輯專家，請使用繁體中文回覆。",
            },
        ],
        agent="researcher",  # 預先選擇 researcher
    ) as session:
        print(">>> agent='researcher' 已預先選定\n")
        response = await session.send_and_wait(
            f"這段程式碼有哪些潛在風險？請列出前三項。\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)


async def main():
    client = CopilotClient()
    await client.start()

    await demo_tool_scoping(client)
    await demo_agent_preselect(client)

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
