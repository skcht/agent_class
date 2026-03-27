"""
14 — OpenLIT LLM 可觀測性

展示如何整合 OpenLIT 觀測平台與 Copilot SDK：
- 使用 TelemetryConfig 啟用 SDK 內建遙測
- 透過 OpenLIT Dashboard 查看 traces、metrics、成本分析
"""

import asyncio

import openlit
from copilot import CopilotClient, SubprocessConfig, PermissionHandler

OPENLIT_ENDPOINT = "http://127.0.0.1:4318"


async def main():
    # 初始化 OpenLIT（應用層 auto-instrumentation）
    openlit.init(otlp_endpoint=OPENLIT_ENDPOINT)
    print("[OpenLIT] 應用層 auto-instrumentation 已啟動")

    # 建立帶有 telemetry 的 CopilotClient
    client = CopilotClient(SubprocessConfig(
        telemetry={
            "otlp_endpoint": OPENLIT_ENDPOINT,
            "capture_content": True,
            "source_name": "copilot-sdk-lesson-14",
        },
    ))
    await client.start()
    print("[Copilot SDK] 遙測已連線至 OpenLIT\n")

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
    ) as session:

        # 任務 1：簡單問答 — 產生基本 trace
        print("=== 任務 1: 基本問答 ===\n")
        response = await session.send_and_wait(
            "用一句話解釋什麼是 OpenTelemetry。"
        )
        if response:
            print(f"回覆: {response.data.content}\n")

        # 任務 2：程式碼生成 — 產生多步驟 trace
        print("=== 任務 2: 程式碼生成 ===\n")
        response = await session.send_and_wait(
            "寫一個 Python 函數，接受一個列表並回傳前 3 大的數字。"
        )
        if response:
            print(f"回覆: {response.data.content}\n")

        # 任務 3：長回覆 — 觀察 token 用量差異
        print("=== 任務 3: 詳細解釋 ===\n")
        response = await session.send_and_wait(
            "請詳細解釋 Python 的 GIL（Global Interpreter Lock），"
            "包含它的運作原理、優缺點，以及 Python 3.13 的改進。"
        )
        if response:
            print(f"回覆: {response.data.content[:200]}...\n")

    await client.stop()

    print("=" * 50)
    print("開啟 http://localhost:3000 查看 OpenLIT Dashboard")
    print("可觀察：Traces、Token 用量、延遲、成本分析")


if __name__ == "__main__":
    asyncio.run(main())
