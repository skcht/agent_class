# 11 — Agent 工具範圍控制

## 觀念

每個 custom agent 可以限定能使用的工具，實現「最小權限原則」。搭配 `infer` 和 `agent` 屬性，可精確控制 agent 的選擇與啟動行為。

### 新增屬性（相對於第 10 課）

| 屬性 | 型別 | 說明 |
|------|------|------|
| `tools` | `list[str]` 或 `None` | 該 agent 可使用的工具名稱清單。`None` 或省略 = 所有工具 |
| `infer` | `bool` | 是否允許 runtime 自動選擇此 agent（預設 `True`） |
| `agent` | `str`（session 層級） | 在建立 session 時預先指定啟用的 agent |

### tools 屬性範例

```python
# 唯讀 agent — 只能查看，不能修改
{"tools": ["grep", "glob", "view"]}

# 編輯 agent — 可以修改檔案
{"tools": ["view", "edit", "bash"]}

# 全權限 agent — 可使用所有工具
{"tools": None}  # 或不設定
```

### infer 控制自動選擇

| infer 值 | 行為 |
|----------|------|
| `True`（預設） | runtime 根據使用者意圖自動委派給此 agent |
| `False` | 僅在使用者明確要求時才啟用 |

### agent 預先選擇

在 `create_session` 中設定 `agent="agent-name"`，可在第一個 prompt 前就啟用特定 agent，等同於自動呼叫 `session.rpc.agent.select()`。

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
