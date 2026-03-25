"""
10 — 自訂 Agent 角色

展示 custom_agents 和 system_message 的使用。

若 dict 語法報 TypeError，請改用 keyword 語法。
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

    async with await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
        "custom_agents": [
            {
                "name": "code-reviewer",
                "display_name": "Code Reviewer",
                "description": "Reviews code for bugs, security issues, and best practices",
                "prompt": (
                    "You are an expert code reviewer. "
                    "Focus on: 1) Security vulnerabilities, "
                    "2) Performance issues, "
                    "3) Python best practices. "
                    "Be specific and provide fixed code examples."
                ),
            },
            {
                "name": "doc-writer",
                "display_name": "Documentation Writer",
                "description": "Generates clear technical documentation",
                "prompt": (
                    "You are a technical documentation specialist. "
                    "Write clear, concise docstrings and comments. "
                    "Use Google style docstrings for Python. "
                    "Use Traditional Chinese (繁體中文) for descriptions."
                ),
            },
        ],
        "system_message": {
            "content": "Always be concise. Reply in under 200 words."
        },
    }) as session:
        # 使用 Code Reviewer 角色
        print("=== Code Reviewer ===\n")
        response = await session.send_and_wait(
            f"Review this Python code for issues:\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)

        # 使用 Documentation Writer 角色
        print("\n=== Documentation Writer ===\n")
        response = await session.send_and_wait(
            f"Write docstrings for these functions:\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(response.data.content)

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
