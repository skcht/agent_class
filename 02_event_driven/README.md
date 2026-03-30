# 02 — 事件驅動訊息模式

## 這課要解決什麼問題？

第 01 課的 `send_and_wait` 有個限制：**程式送出問題後完全凍住，直到 AI 回完才能做下一件事。**

在真實應用中，你不會希望整個程式卡死等 AI — 你可能需要同時更新畫面、處理其他使用者、記錄 log。

## 核心差異

```python
# ❌ send_and_wait — 程式凍住，等 AI 回完才繼續
response = await session.send_and_wait("你的問題")
# ← AI 回完之前，這裡以下的程式碼完全不會執行

# ✅ send — 送出後立刻返回，程式繼續跑
await session.send("你的問題")
# ← 立刻執行到這裡，AI 回覆會透過事件通知你
```

## 本範例做了什麼

1. 用 `session.on()` 註冊事件處理器
2. 用 `send()` 送出問題（非阻塞，立刻返回）
3. **程式繼續跑**，每 0.5 秒做一次背景工作
4. AI 回覆時透過事件通知，程式印出結果

執行後你會看到：背景工作跑了好幾次，證明程式在等 AI 的同時沒有凍住。

## 為什麼開發 Agent 必須用事件驅動？

Agent 會呼叫工具、讀檔案、執行指令，一個 turn 可能跑幾十秒甚至幾分鐘。

**`send_and_wait` — 你是瞎子：**

```
你的程式              AI Agent
   |--- send_and_wait --|
   |    (凍住)          |-- 讀檔案
   |    (凍住)          |-- 呼叫工具 A
   |    (凍住)          |-- 呼叫工具 B  ← 出錯了，你不知道
   |<-- 最終回覆 -------|   (幾分鐘後才看到)
```

**`send` + 事件 — 你掌控全程：**

```
你的程式              AI Agent
   |--- send -----------|
   |<-- tool.executing --|-- 讀檔案       ← 即時看到
   |<-- tool.executing --|-- 呼叫工具 A   ← 即時看到
   |<-- tool.executing --|-- 呼叫工具 B   ← 出錯，馬上知道
   |<-- message_delta ---|-- 組合結果     ← 逐字看到
   |<-- session.idle ----|
```

| | `send_and_wait` | `send` + 事件 |
|---|---|---|
| 看到工具呼叫 | ❌ 只拿到最終結果 | ✅ 即時通知 |
| 中途介入 | ❌ 程式凍住 | ✅ steering（`mode: "immediate"`） |
| 逐字輸出 | ❌ | ✅ `assistant.message_delta` |
| 錯誤即時處理 | ❌ 等到最後才知道 | ✅ 馬上收到 |
| 進度回報 | ❌ 只能顯示「請等待」 | ✅ 即時顯示 AI 在做什麼 |

> **結論：** `send_and_wait` 適合一問一答的簡單腳本。Agent 開發一律用 `send` + 事件。

## 事件處理模式

```python
# 註冊：有事件發生就呼叫 callback
unsubscribe = session.on(callback)

# 用完後取消訂閱
unsubscribe()
```

常用事件：

| 事件 | 何時觸發 |
|------|----------|
| `assistant.message` | AI 回覆完成（包含完整內容） |
| `session.idle` | 所有處理完成，session 閒置 |

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```

## 預期輸出

```
>>> 送出問題（send 立刻返回，不等回覆）

  ⚙️  背景工作 #1（AI 還在想...）
  ⚙️  背景工作 #2（AI 還在想...）
  ⚙️  背景工作 #3（AI 還在想...）

💬 AI 回覆:
Flask, Django, and FastAPI are three popular Python web frameworks.

📊 等 AI 的期間，程式同時完成了 3 次背景工作
📡 過程中收到的事件: ['assistant.message', 'session.idle']
```
