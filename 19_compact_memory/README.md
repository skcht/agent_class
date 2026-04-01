# 19 — 結構化記憶壓縮：借鏡 Claude Code 的 Compact Prompt

## 觀念

第 18 課用「請用 2-3 句話總結」做記憶，簡單但粗糙——自由格式摘要容易丟掉檔名、錯誤修復步驟。本課借鏡 Claude Code 的 compact prompt 設計，用**結構化摘要**取代自由格式。

Claude Code 原版用 9 段（含使用者訊息列表、檔案片段等），適合全功能 IDE 助手。
本課精簡成 **4 段**，適合 Copilot SDK 的任務型 agent。

進階設計：摘要改用**獨立 session + 便宜模型**（`gpt-5.4-mini`）+ **`send()` 非阻塞**，不佔主對話資源，也避免 `send_and_wait()` 預設 60 秒 timeout 的問題。

### Claude Code 怎麼做 Compact？

Claude Code 的對話也會遇到上下文爆滿的問題。它的解法在 `src/services/compact/prompt.ts` 裡：

```
上下文快滿了
    ↓
送出 Compact Prompt（結構化摘要指令）
    ↓
AI 輸出 <analysis> + <summary>
    ↓
formatCompactSummary() 剝除 analysis、提取 summary
    ↓
摘要取代舊的對話歷史 → 釋放上下文空間
```

原始碼位置：[prompt.ts](https://github.com/hangsman/claude-code-source/blob/main/src/services/compact/prompt.ts)

### prompt.ts 的核心設計

#### 1. NO_TOOLS_PREAMBLE — 禁止工具呼叫

```typescript
const NO_TOOLS_PREAMBLE = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.
- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- Tool calls will be REJECTED and will waste your only turn — you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.
`
```

**為什麼需要這段？** Compact 請求會沿用父對話的完整工具集（為了 cache key 一致），模型可能「手癢」嘗試呼叫工具。加上 `maxTurns: 1`，一旦工具呼叫被拒絕就沒有文字輸出了。所以用最強語氣阻止。

> Copilot SDK 裡簡化成一行就好——因為我們是在對話中直接送 prompt，不像 Claude Code 有工具集繼承的問題。

#### 2. `<analysis>` + `<summary>` — 兩階段輸出

```
<analysis>                        ← 草稿區：AI 整理思路（不保留）
User asked about FastAPI...
422 error was due to missing response_model...
</analysis>

<summary>                         ← 正式摘要：結構化段落（保留這個）
1. What was accomplished: ...
2. Key facts: ...
3. Errors and fixes: ...
4. Next step: ...
</summary>
```

**為什麼分兩塊？**
- `<analysis>` 是「草稿本」— 讓 AI 先自由思考，提升摘要品質，但**不存入記憶**
- `<summary>` 是「正式報告」— 結構化摘要，這才是要保留的
- `formatCompactSummary()` 負責剝除 analysis、提取 summary

這跟 Claude 的 extended thinking 概念類似：先思考再回答，品質更高。

#### 3. 結構化段落

**Claude Code 原版（9 段）：**

| # | 段落 | 內容 |
|---|------|------|
| 1 | Primary Request and Intent | 使用者要做什麼 |
| 2 | Key Technical Concepts | 技術棧、框架 |
| 3 | Files and Code Sections | 檔名 + 程式碼片段 |
| 4 | Errors and fixes | 錯誤 + 修復步驟 |
| 5 | Problem Solving | 解題過程 |
| 6 | All user messages | 使用者說過的每句話 |
| 7 | Pending Tasks | 還沒做完的事 |
| 8 | Current Work | 壓縮前在做什麼 |
| 9 | Optional Next Step | 下一步 |

9 段適合 Claude Code 這種全功能 IDE 助手——它需要記住使用者的每句話、每個檔案操作、每次除錯嘗試。

**本課簡化版（4 段）：**

| # | 段落 | 為什麼需要 |
|---|------|-----------|
| 1 | What was accomplished | 做了什麼（合併原版 1、5）|
| 2 | Key facts | 關鍵事實（合併原版 2、3、6）|
| 3 | Errors and fixes | 錯誤修復（保留原版 4）|
| 4 | Next step | 下一步（合併原版 7、8、9）|

任務型 agent 不需要記住「使用者的每句話」或「完整程式碼片段」——它只需要知道做了什麼、什麼重要、出了什麼錯、接下來做什麼。

#### 4. 三種 Compact 模式

Claude Code 有三種摘要範圍（本課只用 BASE）：

```
┌────────────────────────────────────────────────┐
│              完整對話歷史                         │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │ 舊訊息  │  │ 舊訊息  │  │ 新訊息  │  │ 新訊息  ││
│  └────────┘  └────────┘  └────────┘  └────────┘│
│  ├── BASE: 全部摘要 ──────────────────────────┤ │
│  ├── UP_TO: 只摘要前半 ┤                        │
│                        ├── FROM: 只摘要後半 ────┤ │
└────────────────────────────────────────────────┘
```

| 模式 | 範圍 | 使用情境 |
|------|------|---------|
| **BASE** | 整段對話 | 首次壓縮（本課使用）|
| **PARTIAL from** | 只看最近的訊息 | 前面已有摘要，只摘新增部分 |
| **PARTIAL up_to** | 只看前半段 | 摘要前綴，新訊息原樣保留 |

#### 5. formatCompactSummary() — 後處理

```typescript
export function formatCompactSummary(summary: string): string {
  // 1. 剝除 <analysis> — 草稿不保留
  formattedSummary = formattedSummary.replace(/<analysis>[\s\S]*?<\/analysis>/, '')

  // 2. 提取 <summary> 內容，加上 "Summary:" 標題
  const match = formattedSummary.match(/<summary>([\s\S]*?)<\/summary>/)
  if (match) { ... }

  // 3. 清理多餘空行
  return formattedSummary.replace(/\n\n+/g, '\n\n').trim()
}
```

為什麼不直接存原始輸出？
- `<analysis>` 佔空間但沒有資訊價值
- XML 標籤會干擾下次 AI 的解讀
- 清理後的純文字更適合當 system_message

#### 6. getCompactUserSummaryMessage() — 包裝接續訊息

```typescript
export function getCompactUserSummaryMessage(summary, ...): string {
  const formattedSummary = formatCompactSummary(summary)
  return `This session is being continued from a previous conversation...
${formattedSummary}
Continue the conversation from where it left off...`
}
```

下次 session 載入時 AI 就知道：這是接續上次的對話，上下文在這裡，直接繼續工作。

#### 7. Custom Instructions — 自訂摘要重點

```typescript
if (customInstructions && customInstructions.trim() !== '') {
  prompt += `\n\nAdditional Instructions:\n${customInstructions}`
}
```

```
# 範例：除錯導向
"重點記錄錯誤訊息和修復步驟"

# 範例：測試導向
"重點記錄測試輸出和程式碼變更"
```

### 對比：自由格式 vs 結構化摘要

| 面向 | 第 18 課（自由格式） | 第 19 課（結構化 4 段） |
|------|---------------------|----------------------|
| Prompt | 「請用 2-3 句話總結」 | Compact Prompt |
| 錯誤修復 | 常被省略 | 第 3 段專門記錄 |
| 待辦事項 | 通常不提 | 第 4 段記錄 |
| Token 成本 | 低 | 中等（但資訊量提升）|
| 品質穩定度 | 不穩定 | 結構化約束，穩定 |

### 在 Copilot SDK 中的實作

| Claude Code (TypeScript) | 本課 (Python) | 功能 |
|--------------------------|---------------|------|
| `getCompactPrompt()` | `get_compact_prompt()` | 組合 compact prompt |
| `formatCompactSummary()` | `format_compact_summary()` | 剝除 analysis、提取 summary |
| `getCompactUserSummaryMessage()` | `build_continuation_message()` | 包裝成下次 session 的上下文 |
| — | `summarize_conversation()` | 獨立 session + 便宜模型做摘要 |

### 進階設計：獨立 session + 便宜模型

為什麼不在主對話的 session 裡做摘要？

1. **模型成本** — 主對話用強模型（`claude-sonnet-4.6`），摘要不需要那麼聰明，用 `gpt-5.4-mini` 就夠
2. **Timeout 風險** — `send_and_wait()` 預設 60 秒 timeout，摘要需要回顧整段對話，容易超時
3. **非阻塞** — 用 `send()` + 事件監聽，不卡住主流程

```
主對話 session（強模型）        摘要 session（便宜模型）
┌──────────────────────┐
│ 第 1 輪：使用者問 + AI 答 │
│ 第 2 輪：使用者問 + AI 答 │  收集對話紀錄
│ 第 3 輪：使用者問 + AI 答 │──────────────┐
└──────────────────────┘              │
                                      ▼
                              ┌──────────────────┐
                              │ gpt-5.4-mini      │
                              │ send() 非阻塞     │
                              │ 事件監聽等結果     │
                              └──────┬───────────┘
                                     │
                                     ▼
                              format + 存入 memory.json
```

```python
# ── 第一階段：主對話（強模型），收集紀錄 ──
conversation_log = []

async with await client.create_session(
    model="claude-sonnet-4.6", ...
) as session:
    for q in questions:
        conversation_log.append(f"使用者：{q}")
        response = await session.send_and_wait(q, timeout=120)
        conversation_log.append(f"AI：{response.data.content}")

# ── 第二階段：獨立 session + 便宜模型做摘要 ──
raw_summary = await summarize_conversation(
    client, conversation_log,
    custom_instructions="重點記錄使用者的個人資訊和偏好。",
)

# ── 格式化 + 存入記憶 ──
formatted = format_compact_summary(raw_summary)
memory["summaries"].append(formatted)
save_memory(memory)

# ── 下次 session 載入 ──
system_msg = {"content": build_continuation_message(formatted)}
session = await client.create_session(system_message=system_msg, ...)
```

#### `summarize_conversation()` — 核心函式

```python
async def summarize_conversation(client, conversation_log, ...):
    transcript = "\n".join(conversation_log)
    prompt = get_compact_prompt(transcript, custom_instructions)

    result = None
    done = asyncio.Event()

    async with await client.create_session(
        model=SUMMARY_MODEL,  # gpt-5.4-mini
        ...
    ) as session:

        def on_event(event):
            nonlocal result
            if event.type == SessionEventType.ASSISTANT_MESSAGE:
                result = event.data.content       # 拿到摘要
            elif event.type == SessionEventType.SESSION_IDLE:
                done.set()                        # 通知完成

        session.on(on_event)
        await session.send(prompt)                # 非阻塞送出
        await asyncio.wait_for(done.wait(), timeout=120)

    return result
```

**重點：** `send()` 立刻返回，不等 AI 回覆。透過事件監聽 `ASSISTANT_MESSAGE` 拿結果、`SESSION_IDLE` 知道完成。這跟第 2 課的非阻塞模式是同一個 pattern。

### 程式碼重點

| Demo | 情境 | 驗證 |
|------|------|------|
| 1 | 主對話（強模型）→ 收集紀錄 → 獨立 session（便宜模型）做摘要 → 寫入記憶 | 摘要包含關鍵事實 |
| 2 | 載入記憶 → AI 記得細節並能接續 | AI 能回答上次的個人資訊 |

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```

## 參考連結

- [Claude Code compact prompt 原始碼](https://github.com/hangsman/claude-code-source/blob/main/src/services/compact/prompt.ts) — 本課設計靈感來源
- [第 18 課 — Agent 記憶](../18_memory/) — 基礎記憶機制
- [第 16 課 — 上下文管理](../16_context_management/) — infinite_sessions 自動壓縮
- [GitHub Copilot SDK](https://github.com/github/copilot-sdk) — SDK 文件
