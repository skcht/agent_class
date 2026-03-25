# 13 — Sub-Agent 事件監控

## 觀念

當 runtime 將任務委派給 sub-agent 時，parent session 會發出生命週期事件。透過 `session.on()` 訂閱這些事件，可以建構 agent 活動的即時監控。

### Sub-Agent 生命週期

```
使用者 prompt → runtime 分析意圖 → subagent.selected
  → subagent.started → （agent 執行中）→ subagent.completed / subagent.failed
  → subagent.deselected → 回到 parent agent
```

### 事件類型

| 事件 | 觸發時機 | 資料欄位 |
|------|----------|----------|
| `subagent.selected` | runtime 選定 agent | `agent_name`, `agent_display_name`, `tools` |
| `subagent.started` | sub-agent 開始執行 | `tool_call_id`, `agent_name`, `agent_display_name`, `agent_description` |
| `subagent.completed` | sub-agent 成功完成 | `tool_call_id`, `agent_name`, `agent_display_name` |
| `subagent.failed` | sub-agent 發生錯誤 | `tool_call_id`, `agent_name`, `agent_display_name`, `error` |
| `subagent.deselected` | runtime 切換離開 agent | — |

### 搭配第 02 課的事件處理模式

```python
unsubscribe = session.on(handle_event)  # 訂閱
# ... 送出請求 ...
unsubscribe()                            # 取消訂閱
```

### 應用場景

- 即時 UI 顯示「哪個 agent 正在工作」
- 記錄 agent 執行時間與成功/失敗率
- 錯誤處理與重試邏輯

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
