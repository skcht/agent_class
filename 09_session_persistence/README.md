# 09 — Session 持久化

## 觀念

Session 可以透過自訂 ID 建立、中斷後恢復，讓長時間任務或使用者稍後回來繼續對話。

### 核心 API

| 方法 | 說明 |
|------|------|
| `create_session({"session_id": "my-id", ...})` | 建立具名 session |
| `session.disconnect()` | 中斷但保留磁碟資料 |
| `client.resume_session("my-id", {...})` | 恢復 session（需再次提供 `on_permission_request`） |
| `client.list_sessions()` | 列出所有 session |
| `client.get_last_session_id()` | 取得最近的 session ID |
| `client.delete_session("my-id")` | 永久刪除 session |

### 重點

- `disconnect()` 保留 session 資料，可稍後恢復
- `resume_session()` 的第二個參數**必須包含 `on_permission_request`**
- Session 恢復後會保留先前的對話上下文

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
