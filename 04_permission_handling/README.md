# 04 — 自訂權限處理器

## 觀念

`on_permission_request` 是每次建立 session 的必填參數。它在 agent 執行工具（寫入檔案、執行指令等）之前被呼叫，讓你決定是否允許。

### 權限請求類型 (`request.kind.value`)

| 類型 | 說明 |
|------|------|
| `"shell"` | 執行 shell 指令 |
| `"write"` | 寫入檔案 |
| `"read"` | 讀取檔案 |
| `"mcp"` | 呼叫 MCP 工具 |
| `"custom-tool"` | 呼叫自訂工具 |
| `"url"` | 存取 URL |
| `"memory"` | 存取記憶體 |
| `"hook"` | 執行 hook |

### 回傳值 (`PermissionRequestResult.kind`)

| 值 | 意義 |
|----|------|
| `"approved"` | 允許執行 |
| `"denied-interactively-by-user"` | 使用者明確拒絕 |
| `"denied-by-rules"` | 被規則拒絕 |

### 與 `PermissionHandler.approve_all` 的差異

`approve_all` 允許所有操作，適合教學和測試。正式環境應使用自訂處理器，依據操作類型做細粒度控管。

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
