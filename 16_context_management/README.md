# 16 — 上下文管理

## 觀念

當對話越來越長，LLM 的上下文視窗（context window）終究會被填滿。Copilot SDK 提供 `infinite_sessions` 機制，透過背景壓縮（compaction）自動管理上下文長度，讓 session 可以無限對話下去。

但「能無限對話」不代表「應該把什麼都塞進去」。本課除了介紹 `infinite_sessions`，也會探討實務中管理上下文的策略。

### 為什麼上下文會爆？

```
送出 prompt → LLM 回覆 → 工具呼叫 → 工具結果 → LLM 再回覆 → ...
              ↑                        ↑
              每次都累積               工具輸出往往很長
```

一個看似簡單的任務，經過幾輪工具呼叫後，context 就可能膨脹到數萬 tokens。常見的爆量來源：

| 來源 | 範例 | Token 影響 |
|------|------|-----------|
| 工具輸出 | `bash` 印出整個檔案、`grep` 掃描大量匹配 | 數千～數萬 |
| 長對話歷史 | 多輪問答累積 | 線性增長 |
| 大型 system message | 塞入整份文件當背景 | 固定成本，每次都付 |
| 重複資訊 | 每輪都重新提供相同上下文 | 浪費 |

### Infinite Sessions

`infinite_sessions` 是 SDK 內建的上下文管理機制。啟用後，當上下文接近限制時，SDK 會自動在背景壓縮舊的對話內容，保留關鍵資訊並釋放空間。

```python
session = await client.create_session(
    model="gpt-4.1",
    on_permission_request=PermissionHandler.approve_all,
    infinite_sessions={
        "enabled": True,
        "background_compaction_threshold": 0.80,
        "buffer_exhaustion_threshold": 0.95,
    },
)
```

#### 參數說明

| 參數 | 預設 | 說明 |
|------|------|------|
| `enabled` | `False` | 是否啟用 infinite sessions |
| `background_compaction_threshold` | `0.80` | 上下文使用率達此比例時，**背景**開始壓縮 |
| `buffer_exhaustion_threshold` | `0.95` | 上下文使用率達此比例時，**阻塞式**壓縮（確保不溢出） |

#### 運作原理

```
上下文使用率:  0%                    80%              95%         100%
               |─── 正常對話 ────────|── 背景壓縮 ────|── 阻塞壓縮 ─|
                                     ↑                ↑
                          不影響回應速度      會暫停等壓縮完成
```

1. **0% ~ 80%**：正常運作，不做任何壓縮
2. **80% ~ 95%**：背景壓縮啟動，SDK 在不影響回應的情況下壓縮舊對話
3. **95% ~ 100%**：阻塞壓縮，必須等壓縮完成才能繼續（避免溢出）

壓縮的本質是讓 LLM **摘要**舊的對話內容，保留重要資訊但大幅減少 token 數。

#### 壓縮事件

啟用後可以監聽壓縮相關事件：

```python
from copilot.generated.session_events import SessionEventType

def handle_event(event):
    if event.type == SessionEventType.CONTEXT_COMPACTION_STARTED:
        print("壓縮開始...")
    elif event.type == SessionEventType.CONTEXT_COMPACTION_COMPLETED:
        print("壓縮完成！")

session.on(handle_event)
```

#### Resume 時啟用

已存在的 session 也可以在 resume 時啟用或調整 infinite sessions：

```python
resumed = await client.resume_session(
    "my-session-id",
    on_permission_request=PermissionHandler.approve_all,
    infinite_sessions={"enabled": True},
)
```

### 上下文管理策略

`infinite_sessions` 解決了「上下文爆掉程式就掛了」的問題，但壓縮有代價——摘要必然會丟失細節。以下策略能讓你更有效地使用上下文空間：

#### 策略 1：精簡 System Message

System message 每一輪都會被送入，是固定成本。

```python
# ❌ 把整份文件塞進去
system_message={"content": open("full_api_docs.md").read()}  # 可能 5000+ tokens

# ✅ 只放關鍵規則，細節讓 agent 用工具查
system_message={"content": """你是一個 Python 後端工程師。
規則：
- 使用 FastAPI + SQLAlchemy
- 所有 API 回傳 JSON
- 需要查文件時使用 read_file 工具
"""}
```

#### 策略 2：分段處理長任務

與其在一個 session 裡做完所有事，不如把大任務拆成小段：

```python
# ❌ 一個 session 做完所有事
session = await client.create_session(...)
await session.send_and_wait("重構整個專案的錯誤處理")  # 上下文爆炸

# ✅ 按模組拆成多個 session
for module in ["auth", "api", "database"]:
    async with await client.create_session(
        model="gpt-4.1",
        on_permission_request=PermissionHandler.approve_all,
    ) as session:
        await session.send_and_wait(f"重構 {module} 模組的錯誤處理")
```

每個 session 都有乾淨的上下文，不會被前一個模組的工具輸出汙染。

#### 策略 3：用工具代替內嵌資料

讓 agent 在需要時才去讀資料，而不是一開始就塞進 prompt：

```python
# ❌ 把資料塞進 prompt
data = read_all_logs()  # 可能幾千行
await session.send_and_wait(f"分析這些 logs：{data}")

# ✅ 讓 agent 自己用工具讀
await session.send_and_wait(
    "分析 /var/log/app.log 中最近 50 行的錯誤，用 read_file 工具讀取"
)
```


#### 策略 4：調整 Compaction 閾值

根據任務特性調整閾值：

| 場景 | 建議閾值 | 原因 |
|------|---------|------|
| 長對話、多輪問答 | `0.70` / `0.85` | 提早壓縮，保持回應速度 |
| 短任務、精確操作 | `0.90` / `0.98` | 延後壓縮，保留完整上下文 |
| 大量工具輸出 | `0.60` / `0.80` | 工具輸出膨脹快，需更早介入 |

### 有壓縮 vs 無壓縮 vs 手動分段

| 面向 | 無壓縮（預設） | infinite_sessions | 手動分段 |
|------|---------------|-------------------|---------|
| 上下文限制 | 硬上限，超過就失敗 | 自動壓縮，理論上無限 | 每段都有完整空間 |
| 資訊保留 | 100%（但空間有限） | 壓縮後會丟失細節 | 每段獨立，跨段資訊需自行傳遞 |
| 適用場景 | 短任務、明確指令 | 長對話、探索式任務 | 批次處理、模組化任務 |
| 實作成本 | 無 | 一行設定 | 需設計任務拆分邏輯 |
| 壓縮成本 | 無 | 壓縮本身消耗 tokens | 無 |

### 程式碼重點

```python
# 建立啟用 infinite sessions 的 session
session = await client.create_session(
    model="gpt-4.1",
    on_permission_request=PermissionHandler.approve_all,
    infinite_sessions={
        "enabled": True,
        "background_compaction_threshold": 0.80,
        "buffer_exhaustion_threshold": 0.95,
    },
)

# 監聽壓縮事件
def handle_event(event):
    if event.type == SessionEventType.CONTEXT_COMPACTION_STARTED:
        print("[壓縮] 開始壓縮舊對話...")
    elif event.type == SessionEventType.CONTEXT_COMPACTION_COMPLETED:
        print("[壓縮] 壓縮完成")

session.on(handle_event)

# 連續對話，不怕上下文爆掉
for i, question in enumerate(questions):
    response = await session.send_and_wait(question)
```

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
