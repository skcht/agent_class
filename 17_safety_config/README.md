# 17 — 安全設定：把 Agent 關在資料夾裡

## 觀念

當你把 `on_permission_request` 設成 `PermissionHandler.approve_all`，agent 可以讀寫**整台機器**的任何檔案、執行任何 shell 指令。在正式環境中，這等於把主機的鑰匙全交給 AI。

本課的核心問題：**如何讓 agent 只能在指定的資料夾內操作？**

### 問題場景

```
你的專案在 /home/user/my-project/

Agent 可能做的事:
  ✓ 讀寫 /home/user/my-project/src/app.py    ← 你期望的
  ✗ 讀取 /home/user/.ssh/id_rsa              ← 偷看你的 SSH key
  ✗ 修改 /etc/nginx/nginx.conf               ← 改壞系統設定
  ✗ rm -rf /home/user/another-project/       ← 刪掉別的專案
```

解法：用 `working_directory` 設定基礎目錄，再搭配 hook 強制檢查所有路徑。

### 三層防護

```
第 1 層：working_directory          → 設定 agent 的工作目錄（軟限制）
第 2 層：on_pre_tool_use hook       → 強制檢查路徑，拒絕越界操作（硬限制）
第 3 層：on_permission_request      → 依操作類型決定允許/拒絕
      + system_message              → 告訴 AI 邊界在哪
```

#### 第 1 層：`working_directory` — 設定工作目錄

`create_session` 的 `working_directory` 參數會設定 agent 的當前工作目錄。agent 使用的檔案工具（read、write、edit）和 shell 指令都會以此為基礎：

```python
session = await client.create_session(
    model="gpt-4.1",
    on_permission_request=PermissionHandler.approve_all,
    working_directory="/home/user/my-project",
)
```

> **注意：** `working_directory` 只是設定 CWD，它**不會阻止** agent 用絕對路徑跑到外面。所以第 2 層很重要。

#### 第 2 層：`on_pre_tool_use` hook — 強制路徑檢查

這是核心防護。在每個工具執行前，檢查路徑是否在允許的範圍內：

```python
import os

ALLOWED_DIR = os.path.abspath("/home/user/my-project")

def is_path_allowed(path: str) -> bool:
    """檢查路徑是否在允許的目錄內。"""
    resolved = os.path.abspath(path)
    # 確保解析後的路徑以允許目錄開頭
    return resolved.startswith(ALLOWED_DIR + os.sep) or resolved == ALLOWED_DIR

async def on_pre_tool_use(input_data, invocation):
    tool_name = input_data.get("toolName", "")
    tool_input = str(input_data.get("toolInput", ""))

    # 檢查讀寫工具的路徑
    if tool_name in ("read", "write", "edit", "view"):
        if not is_path_allowed(tool_input):
            return {
                "permissionDecision": "deny",
                "permissionDecisionReason": f"Path outside allowed directory: {ALLOWED_DIR}",
            }

    # 檢查 shell 指令 — 攔截危險指令
    if tool_name in ("shell", "bash"):
        dangerous = ["rm -rf", "rm -r ", "> /dev/", "dd if=", "mkfs"]
        for pattern in dangerous:
            if pattern in tool_input.lower():
                return {
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"Dangerous command blocked: {pattern}",
                }

    return {"permissionDecision": "allow"}
```

**關鍵：** 使用 `os.path.abspath()` 解析路徑，防止 `../` 路徑穿越攻擊。例如：

```
ALLOWED_DIR = "/home/user/my-project"

"/home/user/my-project/src/app.py"         → ✓ 允許
"/home/user/my-project/../.ssh/id_rsa"     → 解析為 /home/user/.ssh/id_rsa → ✗ 拒絕
"/etc/passwd"                               → ✗ 拒絕
```

#### 第 3 層：`on_permission_request` + `system_message`

依操作類型做額外控管，加上自然語言告訴 AI 邊界：

```python
def on_permission_request(request, invocation):
    kind = request.kind.value
    # 完全禁止 shell — 最安全的做法
    if kind == "shell":
        return PermissionRequestResult(kind="denied-by-rules")
    return PermissionRequestResult(kind="approved")

system_message = {
    "content": f"""你只能操作 {ALLOWED_DIR} 內的檔案。
- 不要嘗試存取此目錄以外的任何路徑
- 不要刪除檔案或目錄
- 修改前先讀取確認
"""
}
```

### `working_directory` vs `on_pre_tool_use` 路徑檢查

| 面向 | `working_directory` | `on_pre_tool_use` 路徑檢查 |
|------|--------------------|-----------------------------|
| 限制強度 | 軟限制（只設 CWD） | 硬限制（強制拒絕越界） |
| 絕對路徑 | 無法阻擋 | 一律檢查 |
| `../` 穿越 | 無法阻擋 | `abspath` 解析後檢查 |
| shell 指令 | 在該目錄執行 | 可檢查指令內容 |
| 使用方式 | 單獨使用不夠安全 | **必須搭配使用** |

### 程式碼重點

本課範例展示三個情境，都使用 `./sandbox` 作為允許目錄：

| Demo | 設定 | 效果 |
|------|------|------|
| 1 | `working_directory` + `on_pre_tool_use` | Agent 能讀寫 sandbox 內的檔案，越界被攔截 |
| 2 | 路徑穿越防護 | `../` 嘗試離開 sandbox 被 `abspath` 檢查攔截 |
| 3 | 完整防護 | `working_directory` + hook + permission + system_message |

## 前置需求

```bash
pip install github-copilot-sdk
```

## 執行

```bash
python main.py
```

執行時會自動在當前目錄建立 `./sandbox` 資料夾和測試檔案，結束後自動清理。

## 參考連結

- [GitHub Copilot SDK — Python](https://github.com/github/copilot-sdk) — SDK 原始碼與文件
- [Copilot CLI Installation](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) — 安裝 Copilot CLI
- [SDK Permission Handling](https://github.com/github/copilot-sdk/blob/main/docs/permissions/index.md) — 權限機制說明
- [SDK Hooks](https://github.com/github/copilot-sdk/blob/main/docs/hooks/index.md) — Hook 完整文件
  - [Pre Tool Use Hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/pre-tool-use.md) — `on_pre_tool_use` 詳細欄位
  - [Post Tool Use Hook](https://github.com/github/copilot-sdk/blob/main/docs/hooks/post-tool-use.md) — `on_post_tool_use` 詳細欄位
- [SDK Session Configuration](https://github.com/github/copilot-sdk/blob/main/docs/configuration/session.md) — Session 參數（含 `working_directory`、`available_tools`、`excluded_tools`）
- [Python SDK Cookbook](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk/python/README.md) — 更多實用範例
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — LLM 應用常見安全風險
