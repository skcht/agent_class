"""
13 — Sub-Agent 事件監控

展示 sub-agent 生命週期事件的監聽：
- subagent.selected / deselected
- subagent.started / completed / failed
建構即時 agent 活動監控日誌。
"""

import asyncio
import time
from copilot import CopilotClient, PermissionHandler


# --- Agent 活動追蹤器 ---


class AgentTracker:
    """追蹤 sub-agent 的活動與執行時間"""

    def __init__(self):
        self.active_agents = {}  # tool_call_id -> {name, start_time}
        self.history = []        # 完成的記錄

    def handle_event(self, event):
        event_type = event.type
        if hasattr(event_type, "value"):
            event_type = event_type.value

        if event_type == "subagent.selected":
            name = event.data.agent_display_name
            tools = getattr(event.data, "tools", None) or "all"
            print(f"  [選定] Agent: {name} (工具: {tools})")

        elif event_type == "subagent.started":
            call_id = event.data.tool_call_id
            name = event.data.agent_display_name
            desc = getattr(event.data, "agent_description", "")
            self.active_agents[call_id] = {
                "name": name,
                "start_time": time.time(),
            }
            print(f"  [啟動] {name}")
            if desc:
                print(f"         說明: {desc}")

        elif event_type == "subagent.completed":
            call_id = event.data.tool_call_id
            name = event.data.agent_display_name
            if call_id in self.active_agents:
                elapsed = time.time() - self.active_agents[call_id]["start_time"]
                self.history.append(
                    {"name": name, "status": "completed", "time": elapsed}
                )
                del self.active_agents[call_id]
                print(f"  [完成] {name} ({elapsed:.1f}s)")
            else:
                print(f"  [完成] {name}")

        elif event_type == "subagent.failed":
            call_id = event.data.tool_call_id
            name = event.data.agent_display_name
            error = getattr(event.data, "error", "unknown")
            if call_id in self.active_agents:
                elapsed = time.time() - self.active_agents[call_id]["start_time"]
                self.history.append(
                    {"name": name, "status": "failed", "time": elapsed}
                )
                del self.active_agents[call_id]
            print(f"  [失敗] {name}: {error}")

        elif event_type == "subagent.deselected":
            print("  [取消選定] 回到 parent agent")

    def print_summary(self):
        if not self.history:
            print("（無 sub-agent 活動記錄）")
            return
        print(f"共 {len(self.history)} 次 sub-agent 呼叫:\n")
        for entry in self.history:
            status = "OK" if entry["status"] == "completed" else "FAIL"
            print(f"  - {entry['name']}: {status} ({entry['time']:.1f}s)")


# --- 主程式 ---

SAMPLE_CODE = '''
import os

def read_config(path):
    with open(path) as f:
        return eval(f.read())  # 安全隱患

def save_log(message):
    with open("/tmp/app.log", "a") as f:
        f.write(message + "\\n")
'''


async def main():
    client = CopilotClient()
    await client.start()

    tracker = AgentTracker()

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        custom_agents=[
            {
                "name": "researcher",
                "display_name": "程式碼研究員",
                "description": "分析程式碼中的安全漏洞與架構問題",
                "tools": ["grep", "glob", "view"],
                "prompt": (
                    "你是程式碼安全分析專家，請使用繁體中文回覆。"
                    "專注於找出安全漏洞、效能問題和最佳實踐違規。"
                ),
            },
            {
                "name": "editor",
                "display_name": "程式碼編輯員",
                "description": "根據分析結果修改程式碼",
                "tools": ["view", "edit", "bash"],
                "prompt": (
                    "你是程式碼修復專家，請使用繁體中文回覆。"
                    "進行最小幅度的修改來修復已知問題。"
                ),
            },
        ],
    ) as session:
        # 訂閱所有事件
        session.on(tracker.handle_event)

        # 任務 1：分析程式碼（預期 -> researcher）
        print("=== 任務 1: 分析程式碼 ===\n")
        response = await session.send_and_wait(
            f"請分析以下程式碼的安全問題：\n```python{SAMPLE_CODE}```"
        )
        if response:
            print(f"\n回覆: {response.data.content}")

        # 任務 2：修復問題（預期 -> editor）
        print("\n=== 任務 2: 修復問題 ===\n")
        response = await session.send_and_wait(
            "請修復上述程式碼中 read_config 的 eval 安全問題，改用 json.loads。"
        )
        if response:
            print(f"\n回覆: {response.data.content}")

        # 印出活動摘要
        print("\n=== Agent 活動摘要 ===\n")
        tracker.print_summary()

    await client.stop()


if __name__ == "__main__":
    asyncio.run(main())
