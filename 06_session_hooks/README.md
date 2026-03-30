# 06 — Session Hook：攔截與修改行為

## 觀念

Hook 讓你在 session 的關鍵時刻插入自訂邏輯，例如記錄日誌、修改 prompt、控制工具執行。

### 六種 Hook

| Hook | 觸發時機 | 可回傳控制 |
|------|----------|-----------|
| `on_session_start` | Session 啟動時 | `additionalContext`: 注入全域上下文 |
| `on_user_prompt_submitted` | 使用者送出訊息時 | `modifiedPrompt`: 改寫 prompt |
| `on_pre_tool_use` | 工具執行前 | `permissionDecision`: allow / deny / ask |
| `on_post_tool_use` | 工具執行後 | `additionalContext`: 附加上下文給 AI |
| `on_session_end` | Session 結束時 | `sessionSummary`、`cleanupActions` |
| `on_error_occurred` | 錯誤發生時 | `errorHandling`: retry / skip / abort |

### Hook 完整 Input / Output 欄位

> 官方文件：[docs/hooks](https://github.com/github/copilot-sdk/blob/main/docs/hooks/index.md)

#### `on_session_start` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/session-lifecycle.md)

| Input 欄位 | 說明 |
|------------|------|
| `source` | `"startup"` / `"resume"` / `"new"` — session 啟動方式 |
| `cwd` | 當前工作目錄 |
| `initialPrompt` | 初始 prompt（可選） |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `additionalContext` | 注入 session 開始時的上下文 |
| `modifiedConfig` | 覆蓋 session 設定 |

#### `on_user_prompt_submitted` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-submitted.md)

| Input 欄位 | 說明 |
|------------|------|
| `prompt` | 使用者送出的訊息 |
| `cwd` | 當前工作目錄 |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `modifiedPrompt` | 替換後的 prompt |
| `additionalContext` | 附加上下文 |
| `suppressOutput` | `true` 時阻止 assistant 回應 |

#### `on_pre_tool_use` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/pre-tool-use.md)

| Input 欄位 | 說明 |
|------------|------|
| `toolName` | 工具名稱 |
| `toolArgs` | 傳入工具的參數 |
| `cwd` | 當前工作目錄 |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `permissionDecision` | `"allow"` / `"deny"` / `"ask"` — 執行權限 |
| `permissionDecisionReason` | deny/ask 時的原因說明 |
| `modifiedArgs` | 修改後的工具參數 |
| `additionalContext` | 附加上下文 |
| `suppressOutput` | 隱藏工具輸出 |

#### `on_post_tool_use` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/post-tool-use.md)

| Input 欄位 | 說明 |
|------------|------|
| `toolName` | 工具名稱 |
| `toolArgs` | 傳入工具的參數 |
| `toolResult` | 工具回傳的結果 |
| `cwd` | 當前工作目錄 |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `modifiedResult` | 替換後的工具結果 |
| `additionalContext` | 附加上下文給 AI |
| `suppressOutput` | 隱藏結果 |

#### `on_session_end` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/session-lifecycle.md)

| Input 欄位 | 說明 |
|------------|------|
| `reason` | `"complete"` / `"error"` / `"abort"` / `"timeout"` / `"user_exit"` |
| `finalMessage` | 最後一則訊息（可選） |
| `error` | 錯誤詳情（可選） |
| `cwd` | 當前工作目錄 |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `suppressOutput` | 隱藏最終輸出 |
| `cleanupActions` | 清理操作列表（`string[]`） |
| `sessionSummary` | 摘要，用於日誌/分析 |

#### `on_error_occurred` — [文件](https://github.com/github/copilot-sdk/blob/main/docs/hooks/error-handling.md)

| Input 欄位 | 說明 |
|------------|------|
| `error` | 錯誤訊息 |
| `errorContext` | `"model_call"` / `"tool_execution"` / `"system"` / `"user_input"` |
| `recoverable` | `boolean` — 是否可恢復 |
| `cwd` | 當前工作目錄 |
| `timestamp` | Unix 時間戳 |

| Output 欄位 | 說明 |
|-------------|------|
| `errorHandling` | `"retry"` / `"skip"` / `"abort"` — 錯誤處理策略 |
| `retryCount` | 重試次數（搭配 `"retry"` 使用） |
| `userNotification` | 自訂的使用者通知訊息 |
| `suppressOutput` | 隱藏錯誤訊息 |

### 觸發順序

```
session_start → (user_prompt_submitted → pre_tool_use → post_tool_use)* → session_end
                                    error_occurred 可在任何階段觸發
```

### 注意事項

- 所有 hook 都是 `async` 函式
- hook 接收 `(input_data, invocation)` 兩個參數
- 回傳 `dict` 控制行為，或 `None` 不做任何干預

## 範例說明

程式包含三個情境，展示不同 hook 的觸發：

| 範例 | 情境 | 觸發的 Hook |
|------|------|------------|
| 1 | 純文字問答 | `session_start` → `user_prompt_submitted` → `session_end` |
| 2 | 要求使用工具 | + `pre_tool_use` → `post_tool_use` |
| 3 | 危險指令攔截 | `pre_tool_use` 回傳 deny，阻止工具執行 |

> `on_error_occurred` 在 AI 執行出錯時自動觸發，程式中已註冊，正常運行時不會出現。

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
