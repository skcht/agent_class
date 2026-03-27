# GitHub Copilot SDK (Python) 教學系列

一個觀念一個資料夾，每個範例獨立可運行。

## 前置需求

1. **Python 3.11+**
2. **GitHub Copilot CLI** 已安裝並認證
   ```bash
   copilot --version
   copilot auth login
   ```
3. **安裝依賴**
   ```bash
   pip install -r requirements.txt
   ```

## 教學目錄

| # | 資料夾 | 觀念 |
|---|--------|------|
| 01 | [01_hello_world](01_hello_world/) | 最小可運行範例 — Client 生命週期 + `send_and_wait` |
| 02 | [02_event_driven](02_event_driven/) | 事件驅動訊息 — `send()` + `session.on()` |
| 03 | [03_streaming](03_streaming/) | 即時串流輸出 — 逐 token 顯示 |
| 04 | [04_permission_handling](04_permission_handling/) | 自訂權限處理器 — 選擇性允許/拒絕 |
| 05 | [05_custom_tools](05_custom_tools/) | 自訂工具 — `@define_tool` + Pydantic |
| 06 | [06_session_hooks](06_session_hooks/) | Session Hook — 攔截與修改行為 |
| 07 | [07_mcp_server](07_mcp_server/) | MCP 伺服器整合（需 Node.js） |
| 08 | [08_byok](08_byok/) | 自帶 API Key — OpenAI / Azure / Ollama |
| 09 | [09_session_persistence](09_session_persistence/) | Session 持久化 — 斷線後恢復 |
| 10 | [10_custom_agents](10_custom_agents/) | 自訂 Agent 角色 |
| 11 | [11_agent_tool_scoping](11_agent_tool_scoping/) | Agent 工具範圍控制 — `tools`、`infer`、`agent` 屬性 |
| 12 | [12_agent_mcp_servers](12_agent_mcp_servers/) | Agent 專屬 MCP 伺服器 — 每個 agent 掛載獨立 MCP |
| 13 | [13_subagent_events](13_subagent_events/) | Sub-Agent 事件監控 — 生命週期事件與活動追蹤 |
| 14 | [14_openlit_observability](14_openlit_observability/) | OpenLIT LLM 可觀測性 — TelemetryConfig + 視覺化 Dashboard |

## 執行方式

```bash
cd 01_hello_world
python main.py
```

## API 語法

本教學使用 v0.2.0 keyword 參數語法：

```python
session = await client.create_session(
    model="claude-sonnet-4.6",
    on_permission_request=PermissionHandler.approve_all,
)
```
