# 12 — Agent 專屬 MCP 伺服器

## 觀念

除了 session 層級的 MCP 設定（第 07 課），你可以在每個 custom agent 上掛載專屬的 MCP 伺服器，讓不同 agent 存取不同的外部資料來源。

### session 層級 vs agent 層級 MCP

| 層級 | 設定位置 | 影響範圍 |
|------|----------|----------|
| Session | `create_session(mcp_servers={...})` | 所有 agent 共享 |
| Agent | `custom_agents[i]["mcp_servers"]` | 僅該 agent 可用 |

### 設定方式

```python
{
    "name": "db-analyst",
    "description": "分析資料庫結構與查詢",
    "prompt": "你是資料庫專家...",
    "mcp_servers": {
        "database": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-postgres", "..."],
            "tools": ["*"],
        },
    },
}
```

### 使用場景

- 研究員 agent 掛載 filesystem MCP（唯讀瀏覽檔案）
- 資料分析 agent 掛載 database MCP（查詢資料庫）
- 文件撰寫 agent 掛載 fetch MCP（抓取線上文件）

## 前置需求

```bash
pip install github-copilot-sdk
npm --version    # 需要 Node.js 和 npx
```

## 執行

```bash
python main.py
```
