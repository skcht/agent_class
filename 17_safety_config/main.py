"""
17 — 安全設定：把 Agent 關在資料夾裡

展示如何用 working_directory + on_pre_tool_use 限制 agent 只能在指定資料夾內操作：
- working_directory — 設定 agent 的工作目錄
- on_pre_tool_use — 強制檢查路徑，拒絕越界
- on_permission_request — 依操作類型過濾
- system_message — 軟性安全邊界

參考:
  https://github.com/github/copilot-sdk
  https://github.com/github/copilot-sdk/blob/main/docs/hooks/pre-tool-use.md
"""

import asyncio
import os
import shutil
import sys

from copilot import CopilotClient, PermissionHandler, PermissionRequest, PermissionRequestResult

# 修正 Windows 終端機的編碼問題
sys.stdout.reconfigure(encoding="utf-8", errors="replace")


# ──────────────────────────────────────────────
# Sandbox 設定
# ──────────────────────────────────────────────

# 建立 sandbox 資料夾作為 agent 的活動範圍
SANDBOX_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "sandbox"))


def setup_sandbox():
    """建立測試用的 sandbox 環境。"""
    os.makedirs(SANDBOX_DIR, exist_ok=True)
    # 建立測試檔案
    with open(os.path.join(SANDBOX_DIR, "hello.txt"), "w") as f:
        f.write("Hello from sandbox!\n")
    with open(os.path.join(SANDBOX_DIR, "data.csv"), "w") as f:
        f.write("name,age\nAlice,30\nBob,25\n")
    print(f"Sandbox 建立完成: {SANDBOX_DIR}")
    print(f"  檔案: hello.txt, data.csv\n")


# def cleanup_sandbox():
#     """清理 sandbox。"""
#     if os.path.exists(SANDBOX_DIR):
#         shutil.rmtree(SANDBOX_DIR)
#         print(f"\nSandbox 已清理: {SANDBOX_DIR}")


# ──────────────────────────────────────────────
# 安全元件：路徑檢查
# ──────────────────────────────────────────────

def is_path_allowed(path: str) -> bool:
    """檢查路徑是否在 SANDBOX_DIR 內。用 abspath 防止 ../ 穿越。"""
    resolved = os.path.abspath(path)
    return resolved.startswith(SANDBOX_DIR + os.sep) or resolved == SANDBOX_DIR


# 危險指令 pattern
DANGEROUS_PATTERNS = [
    "rm -rf",
    "rm -r ",
    "rmdir",
    "del /s",
    "format ",
    "mkfs",
    "dd if=",
    "> /dev/",
    "DROP TABLE",
    "DROP DATABASE",
    ":(){",  # fork bomb
]


async def sandbox_pre_tool_hook(input_data, invocation):
    """on_pre_tool_use: 強制所有檔案操作都在 sandbox 內。"""
    tool_name = input_data.get("toolName", "")
    tool_input = str(input_data.get("toolInput", ""))

    # 讀寫工具 — 檢查路徑是否在 sandbox 內
    if tool_name in ("read", "write", "edit", "view"):
        if not is_path_allowed(tool_input):
            print(f"  [攔截] {tool_name} 嘗試存取 sandbox 外的路徑")
            print(f"         路徑: {tool_input}")
            print(f"         允許: {SANDBOX_DIR}")
            return {
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"Access denied. Only paths inside {SANDBOX_DIR} are allowed. "
                    f"Attempted: {os.path.abspath(tool_input)}"
                ),
            }
        print(f"  [放行] {tool_name}: {tool_input}")

    # Shell 指令 — 攔截危險 pattern
    if tool_name in ("shell", "bash"):
        for pattern in DANGEROUS_PATTERNS:
            if pattern.lower() in tool_input.lower():
                print(f"  [攔截] 危險指令: 包含 '{pattern}'")
                return {
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"Dangerous command blocked: '{pattern}'",
                }
        print(f"  [放行] {tool_name}: {tool_input[:60]}")

    return {"permissionDecision": "allow"}


def sandbox_permission_handler(request: PermissionRequest, invocation: dict) -> PermissionRequestResult:
    """on_permission_request: 允許讀寫，拒絕 shell（最安全）。"""
    kind = request.kind.value
    if kind == "shell":
        print(f"  [權限] 拒絕 shell 操作")
        return PermissionRequestResult(kind="denied-by-rules")
    return PermissionRequestResult(kind="approved")


# ──────────────────────────────────────────────
# Demo 1: working_directory + 路徑檢查
# ──────────────────────────────────────────────

async def demo_sandbox_basic(client: CopilotClient):
    """Agent 只能讀寫 sandbox 內的檔案，越界操作被攔截。"""
    print("=" * 60)
    print("Demo 1: 基本 Sandbox（working_directory + 路徑檢查）")
    print(f"  允許目錄: {SANDBOX_DIR}")
    print("=" * 60)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        # 第 1 層：設定工作目錄
        working_directory=SANDBOX_DIR,
        # 第 2 層：hook 強制檢查路徑
        hooks={
            "on_pre_tool_use": sandbox_pre_tool_hook,
        },
    ) as session:
        # 測試 1: 讀取 sandbox 內的檔案 — 應該成功
        print("\n--- 測試: 讀取 sandbox 內的檔案 ---")
        response = await session.send_and_wait(
            f"Read the file at {SANDBOX_DIR}/hello.txt and tell me what it says."
        )
        if response:
            content = response.data.content
            if len(content) > 300:
                content = content[:300] + "..."
            print(f"  AI: {content}\n")

        # 測試 2: 嘗試讀取 sandbox 外的檔案 — 應該被攔截
        print("--- 測試: 讀取 sandbox 外的檔案 ---")
        response = await session.send_and_wait(
            "Read the file at /etc/passwd (or C:\\Windows\\System32\\drivers\\etc\\hosts on Windows). "
            "If blocked, explain what happened."
        )
        if response:
            content = response.data.content
            if len(content) > 300:
                content = content[:300] + "..."
            print(f"  AI: {content}\n")


# ──────────────────────────────────────────────
# Demo 2: 路徑穿越防護
# ──────────────────────────────────────────────

async def demo_path_traversal(client: CopilotClient):
    """測試 ../ 路徑穿越是否被正確攔截。"""
    print("=" * 60)
    print("Demo 2: 路徑穿越防護（../ 攻擊）")
    print("=" * 60)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        on_permission_request=PermissionHandler.approve_all,
        working_directory=SANDBOX_DIR,
        hooks={
            "on_pre_tool_use": sandbox_pre_tool_hook,
        },
    ) as session:
        # 嘗試用 ../ 逃出 sandbox
        print("\n--- 測試: 用 ../ 嘗試讀取 sandbox 外的檔案 ---")
        escape_path = os.path.join(SANDBOX_DIR, "..", "..", ".ssh", "id_rsa")
        response = await session.send_and_wait(
            f"Read the file at {escape_path}. "
            "If blocked, explain what restriction prevented it."
        )
        if response:
            content = response.data.content
            if len(content) > 300:
                content = content[:300] + "..."
            print(f"  AI: {content}\n")


# ──────────────────────────────────────────────
# Demo 3: 完整防護（三層全開）
# ──────────────────────────────────────────────

async def demo_full_sandbox(client: CopilotClient):
    """三層防護全開：working_directory + hook + permission + system_message。"""
    print("=" * 60)
    print("Demo 3: 完整防護（三層全開）")
    print("  working_directory + hook + permission + system_message")
    print("=" * 60)

    async with await client.create_session(
        model="claude-sonnet-4.6",
        # 第 1 層：工作目錄
        working_directory=SANDBOX_DIR,
        # 第 2 層：hook 路徑檢查 + 危險指令攔截
        hooks={
            "on_pre_tool_use": sandbox_pre_tool_hook,
        },
        # 第 3 層：禁止 shell
        on_permission_request=sandbox_permission_handler,
        # 軟性邊界
        system_message={
            "content": (
                f"You can ONLY access files inside {SANDBOX_DIR}. "
                "Do not attempt to access any path outside this directory. "
                "Do not delete any files. "
                "If asked to do something outside your allowed scope, explain the restriction."
            ),
        },
    ) as session:
        # 要求 agent 在 sandbox 內建立新檔案
        print("\n--- 測試: 在 sandbox 內建立檔案 ---")
        response = await session.send_and_wait(
            f"Create a file called {SANDBOX_DIR}/notes.txt with the content "
            "'This file was created safely inside the sandbox.' "
            "Then read it back to confirm."
        )
        if response:
            content = response.data.content
            if len(content) > 300:
                content = content[:300] + "..."
            print(f"  AI: {content}\n")

        # 驗證檔案是否真的建立了
        notes_path = os.path.join(SANDBOX_DIR, "notes.txt")
        if os.path.exists(notes_path):
            with open(notes_path) as f:
                print(f"  [驗證] notes.txt 內容: {f.read().strip()}")
        else:
            print("  [驗證] notes.txt 未建立（可能被攔截或 agent 未嘗試）")


# ──────────────────────────────────────────────
# 主程式
# ──────────────────────────────────────────────

async def main():
    print("安全設定範例：把 Agent 關在資料夾裡\n")

    setup_sandbox()

    client = CopilotClient()
    await client.start()

    try:
        # Demo 1: 基本 sandbox — 越界被攔截
        await demo_sandbox_basic(client)

        # Demo 2: 路徑穿越防護
        await demo_path_traversal(client)

        # Demo 3: 三層全開
        await demo_full_sandbox(client)
    finally:
        await client.stop()
        # cleanup_sandbox()

    print("\n" + "=" * 60)
    print("重點回顧：")
    print("  1. working_directory 設定 CWD，但單獨使用不夠安全")
    print("  2. on_pre_tool_use hook 是核心 — 用 abspath 解析路徑，防止 ../ 穿越")
    print("  3. on_permission_request 可以完全禁止 shell 等操作類型")
    print("  4. system_message 是軟防護，降低 AI 主動越界的機率")
    print("  5. 多層組合使用，確保即使單一層被突破也有其他防線")


if __name__ == "__main__":
    asyncio.run(main())
