# 06 — Session Hook：攔截與修改行為

## 觀念

Hook 讓你在 session 的關鍵時刻插入自訂邏輯，例如記錄日誌、修改 prompt、控制工具執行。

### 六種 Hook

| Hook | 觸發時機 | 可控制 |
|------|----------|--------|
| `on_pre_tool_use` | 工具執行前 | `permissionDecision`: allow/deny/ask |
| `on_post_tool_use` | 工具執行後 | `additionalContext`: 附加上下文 |
| `on_user_prompt_submitted` | 使用者送出訊息時 | `modifiedPrompt`: 修改後的 prompt |
| `on_session_start` | Session 啟動時 | `additionalContext`: 初始上下文 |
| `on_session_end` | Session 結束時 | （僅通知） |
| `on_error_occurred` | 錯誤發生時 | `errorHandling`: retry/skip/abort |

### 注意事項

- 所有 hook 都是 `async` 函式
- hook 接收 `(input_data, invocation)` 兩個參數
- 回傳 `dict` 控制行為，或 `None` 不做任何干預

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
