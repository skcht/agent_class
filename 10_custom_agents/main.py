"""
10 — 自訂 Agent 角色

展示 custom_agents 和 system_message 的使用。
"""

import asyncio
from copilot import CopilotClient, PermissionHandler

# 要被 review 的範例程式碼
SAMPLE_CODE = '''
def get_user(id):
    query = f"SELECT * FROM users WHERE id = {id}"
    return db.execute(query)

def process_data(items):
    result = []
    for i in range(len(items)):
        if items[i] != None:
            result.append(items[i].strip())
    return result
'''


async def main():
    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        custom_agents=[
            {
                "name": "code-reviewer",
                "display_name": "程式碼審查員",
                "description": "審查程式碼中的臭蟲、安全漏洞與最佳實踐",
                "prompt": (
                    "你是一位資深程式碼審查專家，請使用繁體中文回覆。"
                    "審查重點：1) 安全漏洞（如 SQL Injection、XSS 等），"
                    "2) 效能問題，"
                    "3) Python 最佳實踐。"
                    "請具體說明問題並提供修正後的程式碼範例。"
                ),
            },
            {
                "name": "doc-writer",
                "display_name": "技術文件撰寫員",
                "description": "產生清楚的繁體中文技術文件",
                "prompt": (
                    "你是一位技術文件撰寫專家，請使用繁體中文回覆。"
                    "撰寫清楚、簡潔的 docstring 與註解。"
                    "使用 Google 風格的 Python docstring。"
                    "說明部分一律使用繁體中文。"
                ),
            },
        ],
        system_message={
            "content": "請保持簡潔，回覆不超過 200 字。使用繁體中文回覆。"
        },
    ) as session:
        # 使用程式碼審查員角色
        print("=== 程式碼審查員 ===\n")
        response = await session.send_and_wait(
            f"請審查以下 Python 程式碼的問題：\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)

        # 使用技術文件撰寫員角色
        print("\n=== 技術文件撰寫員 ===\n")
        response = await session.send_and_wait(
            f"請為以下函式撰寫 docstring：\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
