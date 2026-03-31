# 18 — Agent 記憶：跨 Session 保留上下文

## 觀念

每個 session 都是全新的開始——agent 不記得上一次對話聊了什麼。如果你希望 agent 在多次對話之間保留「記憶」，需要自己實作。

### 問題場景

```
Session 1:
  使用者: "我的專案用 FastAPI + PostgreSQL"
  Agent:  "好的，我記住了"

Session 2:
  使用者: "幫我加一個 API endpoint"
  Agent:  "你用什麼框架？"  ← 完全忘了
```

### 解法：檔案記憶 + system_message + Events

```
┌─────────────────────────────────────────────────────┐
│                    Session 生命週期                    │
│                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐    │
│  │ 建立 session│  │ 對話中    │    │ 結束前        │    │
│  │           │    │           │    │               │    │
│  │ 讀記憶檔案 │───▶│ Events   │───▶│ 送「請總結」  │    │
│  │ 塞進       │    │ 追蹤回覆  │    │ 寫入記憶檔案  │    │
│  │ system_msg │    │           │    │               │    │
│  └──────────┘    └──────────┘    └──────────────┘    │
│       ↑                                    │          │
│       │          memory.json               │          │
│       └────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

### 三個關鍵機制

#### 1. 讀取記憶：`system_message` 注入

在 `create_session` **之前**讀取記憶檔案，組成 `system_message`。這是最可靠的注入方式——直接成為 system prompt 的一部分，AI 在整個 session 中都能看到：

```python
def build_memory_system_message() -> dict:
    memory = load_memory()
    summaries = memory.get("summaries", [])
    if summaries:
        memory_text = "=== 先前的對話記憶 ===\n"
        for i, s in enumerate(summaries, 1):
            memory_text += f"第 {i} 次對話: {s}\n"
        return {"content": memory_text}
    return {"content": "這是第一次對話，尚無歷史記憶。"}

# 建 session 時傳入
session = await client.create_session(
    model="gpt-4.1",
    system_message=build_memory_system_message(),
    ...
)
```

> **`system_message` 不會蓋掉預設的 system prompt。** `{"content": "..."}` 等同於 `{"mode": "append", "content": "..."}`——你的內容會**追加**在預設 system prompt（identity、tone、safety、tool instructions 等）的後面，預設的所有區段都會保留。
>
> SDK 提供三種模式：
>
> | 模式 | 行為 | 預設 prompt |
> |------|------|------------|
> | `{"content": "..."}` | **append**（預設）— 追加在後面 | 完整保留 |
> | `{"mode": "replace", "content": "..."}` | 完全取代 | 全部消失 |
> | `{"mode": "customize", "sections": {...}}` | 逐區段控制（replace / remove / append / prepend） | 你選擇改哪些 |
>
> 記憶功能用預設的 append 就好，不需要動到其他區段。

#### 2. 追蹤對話：Events 監聽 `ASSISTANT_MESSAGE`

`on_session_end` hook **拿不到對話內容**（只有 `reason` 和 `timestamp`）。所以需要用 Events 在對話過程中追蹤：

```python
conversation_log = []

def handle_event(event):
    if event.type == SessionEventType.ASSISTANT_MESSAGE:
        conversation_log.append(event.data.content)

session.on(handle_event)
```

這樣對話結束時，`conversation_log` 裡就有所有 AI 回覆。

#### 3. 寫入記憶：結束前請 AI 總結

與其自己做摘要，不如讓 AI 自己總結——它最清楚對話的重點：

```python
# Session 結束前，送最後一個 prompt
summary = await session.send_and_wait(
    "請用 2-3 句話總結我們的對話，重點放在關鍵事實和決定。"
)

# 寫入記憶檔案
memory = load_memory()
memory["summaries"].append(summary.data.content)
save_memory(memory)
```

### 為什麼不在 `on_session_end` 做總結？

| 面向 | `on_session_end` | Events + 結束前 prompt |
|------|------------------|----------------------|
| 能拿到對話內容 | 不能（只有 reason） | 能（Events 追蹤） |
| 能呼叫 AI 做摘要 | 不能（session 已結束）| 能（session 還活著）|
| 能寫檔案 | 能 | 能 |
| 適合做什麼 | 日誌記錄、清理資源 | **記憶寫入** |

### 為什麼不用 `on_session_start` + `additionalContext`？

SDK 文件中 `on_session_start` hook 回傳的 `additionalContext` 理論上會注入上下文，但在 SDK preview 階段行為不穩定，實測中 AI 不一定能讀到注入的內容。

`system_message` 直接寫進 system prompt，是最可靠的方式。

### 注入記憶的三種方式比較

| 方式 | 可靠度 | 時機 | 適用場景 |
|------|--------|------|---------|
| **`system_message`（推薦）** | 最高 | `create_session` 時 | 靜態記憶，每次 session 開頭載入 |
| `on_user_prompt_submitted` → `modifiedPrompt` | 高 | 每次使用者送訊息 | 動態記憶（session 中途會更新） |
| `on_session_start` → `additionalContext` | 不穩定 | Session 啟動時 | SDK 穩定後可考慮 |

本課使用 `system_message`，因為記憶在 session 開始時載入一次就夠了，而且保證 AI 看得到。

### 記憶檔案格式

```json
{
  "summaries": [
    "第 1 次對話: 討論了 FastAPI 專案架構，決定用 PostgreSQL...",
    "第 2 次對話: 新增了 /users endpoint，加入了 JWT 認證..."
  ],
  "updated_at": "2025-01-15T10:30:00"
}
```

### 程式碼重點

本課範例展示完整的記憶循環：

| Demo | 情境 | 驗證 |
|------|------|------|
| 1 | 第一次對話：聊天 → 追蹤 → 總結 → 寫入記憶 | `memory.json` 被建立 |
| 2 | 第二次對話：讀取記憶 → agent 記得上次內容 | agent 能回答「上次聊了什麼」 |

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```

執行後會在同目錄產生 `memory.json`，可以打開查看記憶內容。

## 參考連結

- [GitHub Copilot SDK — Python](https://github.com/github/copilot-sdk) — SDK 原始碼與文件
- [SDK Hooks](https://github.com/github/copilot-sdk/blob/main/docs/hooks/index.md) — Hook 完整文件
  - [Session Lifecycle Hooks](https://github.com/github/copilot-sdk/blob/main/docs/hooks/session-lifecycle.md) — `on_session_start` / `on_session_end` 詳細欄位
  - [User Prompt Submitted Hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/user-prompt-submitted.md) — `on_user_prompt_submitted` 詳細欄位
- [SDK Events](https://github.com/github/copilot-sdk/blob/main/docs/events/index.md) — 事件系統說明
- [SDK Session Configuration](https://github.com/github/copilot-sdk/blob/main/docs/configuration/session.md) — Session 參數（含 `system_message`）
- [Python SDK Cookbook](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk/python/README.md) — 更多實用範例
