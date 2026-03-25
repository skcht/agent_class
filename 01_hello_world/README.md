# 01 — Hello World：最小可運行範例

## 觀念

這是 Copilot SDK 的最基礎範例，展示完整的生命週期：

```
你的程式 → SDK Client → Copilot CLI → AI 模型
```

### 核心流程

1. `CopilotClient()` — 建立客戶端
2. `client.start()` — 啟動 CLI 子程序
3. `client.create_session()` — 建立對話 session
4. `session.send_and_wait()` — 送出訊息並等待回覆（阻塞式）
5. `session.disconnect()` — 中斷 session
6. `client.stop()` — 停止 CLI

### 重要觀念

- **`on_permission_request` 是必填的**：每次建立 session 都必須提供權限處理器
- **`PermissionHandler.approve_all`**：最簡單的處理器，允許所有操作
- **`async with`**：使用 context manager 自動處理 `disconnect()`
- **Import 路徑**：一律 `from copilot import ...`（不是 `copilot_sdk`）

## 前置需求

```bash
copilot --version          # 確認 CLI 已安裝
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```
