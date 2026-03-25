"""
05 — 自訂工具

展示 @define_tool + Pydantic BaseModel 定義自訂工具。
"""

import asyncio
from pydantic import BaseModel, Field
from copilot import CopilotClient, PermissionHandler, define_tool


# --- 工具定義（Pydantic 模型必須在模組層級） ---

class WeatherParams(BaseModel):
    city: str = Field(description="City name to get weather for")


class CalculatorParams(BaseModel):
    expression: str = Field(description="Math expression to evaluate, e.g. '2 + 3 * 4'")


@define_tool(description="Get current weather for a city (simulated data)")
async def get_weather(params: WeatherParams) -> str:
    """模擬天氣查詢"""
    weather_data = {
        "Taipei": "28°C, 多雲",
        "Tokyo": "22°C, 晴天",
        "New York": "15°C, 陰天",
        "London": "12°C, 小雨",
    }
    result = weather_data.get(params.city, f"查無 {params.city} 的天氣資料")
    print(f"  [工具呼叫] get_weather(city={params.city!r}) -> {result}")
    return result


@define_tool(description="Evaluate a simple math expression safely")
async def calculator(params: CalculatorParams) -> str:
    """安全的計算機"""
    # 只允許數字和基本運算符
    allowed = set("0123456789+-*/.() ")
    if not all(c in allowed for c in params.expression):
        return "Error: expression contains invalid characters"
    try:
        result = eval(params.expression)  # 已過濾字元，安全使用
        print(f"  [工具呼叫] calculator({params.expression!r}) -> {result}")
        return str(result)
    except Exception as e:
        return f"Error: {e}"


# --- 主程式 ---

async def main():
    client = CopilotClient()
    await client.start()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        tools=[get_weather, calculator],
        on_permission_request=PermissionHandler.approve_all,
    ) as session:
        # 測試天氣工具
        print(">>> 查詢天氣...\n")
        response = await session.send_and_wait(
            "What's the weather in Taipei and Tokyo? Compare them."
        )
        if response:
            print(f"\nAI 回覆: {response.data.content}")

        # 測試計算機工具
        print("\n>>> 測試計算機...\n")
        response = await session.send_and_wait(
            "What is (15 + 27) * 3 - 10?"
        )
        if response:
            print(f"\nAI 回覆: {response.data.content}")

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
