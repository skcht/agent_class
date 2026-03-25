# 07 — MCP 伺服器整合

## 觀念

MCP（Model Context Protocol）是一個標準協定，讓 AI agent 能連接外部工具伺服器，擴充能力。

### 兩種 MCP 伺服器類型

| 類型 | 連接方式 | 適用場景 |
|------|----------|----------|
| `local` (stdio) | 啟動本地子程序，透過 stdin/stdout 通訊 | 本地工具，如檔案系統 |
| `http` | 透過 HTTP 連接遠端伺服器 | 雲端服務，如 GitHub API |

### 設定方式

```python
"mcp_servers": {
    "server_name": {
        "type": "local",           # 或 "http"
        "command": "npx",          # local 用
        "args": [...],             # local 用
        "url": "https://...",      # http 用
        "headers": {...},          # http 用（選填）
        "tools": ["*"],            # 暴露所有工具
    }
}
```

## 前置需求

```bash
pip install github-copilot-sdk
npm --version    # 需要 Node.js 和 npx
```

## 執行

```bash
python main.py
```
