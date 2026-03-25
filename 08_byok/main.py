"""
08 — BYOK：自帶 API Key

展示不需 Copilot 訂閱，使用 OpenAI / Azure / Ollama。
根據環境變數自動偵測可用的 provider。
"""

import asyncio
import os
from copilot import CopilotClient, PermissionHandler


def detect_provider():
    """根據環境變數自動偵測 provider 設定"""

    # 優先：OpenAI
    if os.environ.get("OPENAI_API_KEY"):
        print("[Provider] 使用 OpenAI")
        return {
            "type": "openai",
            "base_url": "https://api.openai.com/v1",
            "api_key": os.environ["OPENAI_API_KEY"],
        }, "gpt-4"

    # Azure OpenAI
    if os.environ.get("AZURE_OPENAI_KEY") and os.environ.get("AZURE_OPENAI_ENDPOINT"):
        print("[Provider] 使用 Azure OpenAI")
        return {
            "type": "azure",  # 注意：Azure 必須用 "azure"，不能用 "openai"
            "base_url": os.environ["AZURE_OPENAI_ENDPOINT"],
            "api_key": os.environ["AZURE_OPENAI_KEY"],
            "azure": {"api_version": "2024-10-21"},
        }, "gpt-4"

    # Ollama（本地，不需 key）
    # 需先執行: ollama serve && ollama pull llama3.2
    print("[Provider] 未偵測到 API Key，嘗試本地 Ollama")
    print("  確保已執行: ollama serve && ollama pull llama3.2")
    return {
        "type": "openai",
        "base_url": "http://localhost:11434/v1",
    }, "llama3.2"


async def main():
    provider, model = detect_provider()
    print(f"[Model] {model}\n")

    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model=model,
        on_permission_request=PermissionHandler.approve_all,
        provider=provider,
    ) as session:
        response = await session.send_and_wait(
            "What is the capital of Taiwan? Reply in one sentence."
        )
        if response:
            print(f"AI 回覆: {response.data.content}")
        else:
            print("未收到回覆。請確認 provider 設定正確。")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
