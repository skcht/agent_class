# 10 — 自訂 Agent 角色

## 觀念

你可以在一個 session 中定義多個 agent 角色，每個角色有各自的名稱、描述和系統 prompt。同時可用 `system_message` 設定全域指令。

### 設定方式

```python
"custom_agents": [
    {
        "name": "agent-id",              # 唯一識別碼
        "display_name": "顯示名稱",
        "description": "角色描述",
        "prompt": "系統 prompt 指令",
    },
],
"system_message": {
    "content": "全域系統訊息（適用於所有 agent）"
},
```

### system_message vs custom_agents

| 項目 | 用途 |
|------|------|
| `system_message` | 全域指令，影響整個 session |
| `custom_agents` | 可切換的專業角色 |

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
