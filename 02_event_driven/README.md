# 02 — 事件驅動訊息模式

## 觀念

與 `send_and_wait`（阻塞式）不同，`send()` 是非阻塞的。你需要透過 `session.on()` 註冊事件處理器來接收回覆。

### send_and_wait vs send

| 方法 | 行為 | 適用場景 |
|------|------|----------|
| `send_and_wait()` | 阻塞，等待最終回覆 | 簡單一問一答 |
| `send()` | 非阻塞，立即返回 | 多輪對話、進度追蹤、即時處理 |

### 核心事件類型

- **`assistant.message`** — AI 回覆完成（包含完整內容）
- **`session.idle`** — Session 閒置，所有處理完成

### 事件處理模式

```python
unsubscribe = session.on(callback)  # 註冊事件處理器
# ... 使用完畢後 ...
unsubscribe()                        # 取消訂閱
```

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
