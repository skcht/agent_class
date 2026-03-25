# 03 — 即時串流輸出

## 觀念

啟用 `streaming: True` 後，AI 的回覆會以逐 token 的方式即時傳送，而非等待完整回覆後才一次送出。

### 串流相關事件

| 事件 | 說明 | 何時觸發 |
|------|------|----------|
| `assistant.message_delta` | 增量文字片段 | 每產生一小段文字 |
| `assistant.reasoning_delta` | 思考過程片段 | 模型支援時 |
| `assistant.message` | 完整最終回覆 | 無論是否串流，都會觸發 |

### 重點

- `event.data.delta_content` — 每次的增量文字
- `event.data.content` — 最終完整回覆（在 `assistant.message` 事件中）
- 使用 `print(..., end="", flush=True)` 實現即時顯示效果

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
