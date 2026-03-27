# Copilot SDK Python — API Reference

## Table of Contents
- CopilotClient
- CopilotSession
- Configuration Types
- Tool Types
- Permission Types
- Hook Types
- System Message Types
- Attachment Types
- Response Types

---

## CopilotClient

```python
from copilot import CopilotClient, SubprocessConfig

CopilotClient(
    config: SubprocessConfig | dict | None = None,
    *,
    auto_start: bool = True,
    on_list_models: Callable | None = None,
)
```

When passing a dict, use `{"cli_url": "localhost:4321"}` to connect to an external CLI server.

### Connection Methods

```python
await client.start() -> None
await client.stop() -> None
await client.force_stop() -> None
client.get_state() -> ConnectionState  # "disconnected"|"connecting"|"connected"|"error"
```

### Session Methods

```python
await client.create_session(**kwargs) -> CopilotSession
await client.resume_session(session_id, **kwargs) -> CopilotSession
await client.delete_session(session_id) -> None
await client.list_sessions(filter=None) -> list[SessionMetadata]
await client.get_last_session_id() -> str | None
await client.get_foreground_session_id() -> str | None
await client.set_foreground_session_id(session_id) -> None
```

### Server Queries

```python
await client.ping(message=None) -> PingResponse
await client.get_status() -> GetStatusResponse
await client.get_auth_status() -> GetAuthStatusResponse
await client.list_models() -> list[ModelInfo]
```

### Event Subscription

```python
unsubscribe = client.on(handler)
unsubscribe = client.on("session.created", handler)
```

**Lifecycle Event Types:** `session.created`, `session.deleted`, `session.updated`, `session.foreground`, `session.background`

---

## CopilotSession

### Messaging

```python
# Non-blocking — returns message ID
msg_id = await session.send(options: dict, *, attachments=None) -> str
# options: {"prompt": str, "mode": "enqueue"|"immediate"}

# Blocking — waits for session.idle, returns final assistant message
event = await session.send_and_wait(options: dict, *, attachments=None, timeout=60.0) -> SessionEvent | None
```

### Event Subscription

```python
unsubscribe = session.on(handler: Callable[[SessionEvent], None]) -> Callable[[], None]
```

### Session State

```python
messages = await session.get_messages() -> list[SessionEvent]
await session.abort() -> None
```

### Lifecycle

```python
await session.disconnect() -> None      # Preserves data on disk for later resume
await session.destroy() -> None          # Deprecated — use disconnect()
session.session_id -> str
session.workspace_path -> str | None
```

### Model & Logging

```python
await session.set_model(model: str, *, reasoning_effort=None) -> None
await session.log(message: str, *, level=None, ephemeral=None) -> None
```

### Context Manager

```python
async with await client.create_session(**kwargs) as session:
    await session.send({"prompt": "Hello"})
    # session.disconnect() called automatically
```

---

## Configuration Types

### SubprocessConfig

```python
from copilot import SubprocessConfig

SubprocessConfig(
    cli_path: str | None = None,
    cli_args: list[str] = [],
    cwd: str | None = None,
    use_stdio: bool = True,
    port: int = 0,
    log_level: str = "info",  # "none"|"error"|"warning"|"info"|"debug"|"all"
    env: dict[str, str] | None = None,
    github_token: str | None = None,
    use_logged_in_user: bool | None = None,
    telemetry: TelemetryConfig | None = None,
)
```

### create_session keyword arguments

| Key | Type | Description |
|-----|------|-------------|
| `model` | str | Model ID (e.g., `"gpt-4.1"`, `"claude-sonnet-4"`) |
| `on_permission_request` | callable | **Required.** Permission handler |
| `session_id` | str | Custom ID for resumable sessions |
| `streaming` | bool | Enable streaming delta events |
| `tools` | list[Tool] | Custom tools |
| `system_message` | dict | System message configuration |
| `provider` | dict | BYOK provider config |
| `mcp_servers` | dict | MCP server configurations |
| `hooks` | dict | Session hooks |
| `on_user_input_request` | callable | User input handler |
| `custom_agents` | list[dict] | Custom agent definitions |
| `agent` | str | Pre-select a custom agent by name |
| `reasoning_effort` | str | `"low"` / `"medium"` / `"high"` / `"xhigh"` |
| `skill_directories` | list[str] | Skill directories to load |
| `disabled_skills` | list[str] | Skills to disable |
| `available_tools` | list[str] | Restrict available tools |
| `excluded_tools` | list[str] | Exclude specific tools |
| `infinite_sessions` | dict | Auto-compaction config |
| `working_directory` | str | Working directory |
| `config_dir` | str | Config directory |

### ProviderConfig (dict)

```python
{
    "type": "openai" | "azure" | "anthropic",
    "base_url": str,         # Required
    "api_key": str,           # Optional for local providers
    "bearer_token": str,      # Takes precedence over api_key
    "wire_api": "completions" | "responses",  # Default: "completions"
    "azure": {"api_version": str},            # Default: "2024-10-21"
}
```

### InfiniteSessionConfig (dict)

```python
{
    "enabled": True,
    "background_compaction_threshold": 0.80,  # 0.0-1.0
    "buffer_exhaustion_threshold": 0.95,
}
```

### TelemetryConfig (dict)

```python
{
    "otlp_endpoint": str,
    "file_path": str,
    "exporter_type": "otlp-http" | "file",
    "source_name": str,
    "capture_content": bool,
}
```

### CustomAgentConfig (dict)

```python
{
    "name": str,              # Required
    "display_name": str,
    "description": str,
    "tools": list[str] | None,  # None = all tools
    "prompt": str,            # Required
    "mcp_servers": dict,
    "infer": bool,            # Default: True
}
```

---

## Tool Types

### Tool (dataclass)

```python
from copilot.tools import Tool

Tool(
    name: str,
    description: str,
    handler: ToolHandler,
    parameters: dict | None = None,
    overrides_built_in_tool: bool = False,
    skip_permission: bool = False,
)
```

### define_tool decorator

```python
from copilot.tools import define_tool
from pydantic import BaseModel, Field

class MyParams(BaseModel):
    value: str = Field(description="Input value")

@define_tool(description="Process a value")
async def process_value(params: MyParams) -> str:
    return f"Processed: {params.value}"
```

### ToolResult (dataclass)

```python
ToolResult(
    text_result_for_llm: str = "",
    result_type: str = "success",  # "success"|"failure"|"rejected"|"denied"
    error: str | None = None,
    binary_results_for_llm: list | None = None,
)
```

---

## Permission Types

### PermissionHandler

```python
from copilot.session import PermissionHandler
PermissionHandler.approve_all(request, invocation) -> PermissionRequestResult
```

### PermissionRequest (key fields)

```python
request.kind          # PermissionRequestKind enum
request.kind.value    # "shell"|"write"|"read"|"mcp"|"custom-tool"|"url"|"memory"|"hook"
request.tool_call_id
request.tool_name
request.file_name     # For write operations
request.full_command_text  # For shell operations
request.path
request.url
```

### PermissionRequestResult

```python
from copilot.session import PermissionRequestResult

PermissionRequestResult(
    kind: str,  # "approved"|"denied-interactively-by-user"|"denied-by-rules"|
                # "denied-no-approval-rule-and-could-not-request-from-user"
    feedback: str | None = None,
    message: str | None = None,
)
```

---

## Hook Types

### SessionHooks (dict)

```python
{
    "on_pre_tool_use": async def(input, invocation) -> dict | None,
    "on_post_tool_use": async def(input, invocation) -> dict | None,
    "on_user_prompt_submitted": async def(input, invocation) -> dict | None,
    "on_session_start": async def(input, invocation) -> dict | None,
    "on_session_end": async def(input, invocation) -> None,
    "on_error_occurred": async def(input, invocation) -> dict | None,
}
```

### Hook Input Fields

**on_pre_tool_use input:** `toolName`, `toolArgs`, `timestamp`
**on_post_tool_use input:** `toolName`, `toolResult`, `timestamp`
**on_user_prompt_submitted input:** `prompt`, `timestamp`
**on_session_start input:** `source` ("startup"/"resume"/"new"), `cwd`, `timestamp`
**on_session_end input:** `reason`, `timestamp`
**on_error_occurred input:** `error`, `errorContext` ("model_call"/"tool_execution"/"system"), `recoverable`, `timestamp`

### Hook Return Fields

**on_pre_tool_use:** `permissionDecision` ("allow"/"deny"/"ask"), `permissionDecisionReason`, `modifiedArgs`, `additionalContext`, `suppressOutput`
**on_post_tool_use:** `modifiedResult`, `additionalContext`, `suppressOutput`
**on_user_prompt_submitted:** `modifiedPrompt`, `additionalContext`, `suppressOutput`
**on_session_start:** `additionalContext`
**on_error_occurred:** `errorHandling` ("retry"/"skip"/"abort"), `retryCount`, `userNotification`, `suppressOutput`

---

## System Message Types

### Append (default)

```python
{"content": "Additional instructions"}
# or: {"mode": "append", "content": "Additional instructions"}
```

### Replace

```python
{"mode": "replace", "content": "Complete replacement system message"}
```

### Customize (per-section overrides)

```python
{
    "mode": "customize",
    "sections": {
        "identity": {"action": "replace", "content": "You are a security auditor."},
        "tone": {"action": "remove"},
        "guidelines": {"action": "append", "content": "Always cite sources."},
    },
    "content": "Additional instructions appended after sections.",
}
```

**Available sections:** `identity`, `tone`, `tool_efficiency`, `environment_context`, `code_change_rules`, `guidelines`, `safety`, `tool_instructions`, `custom_instructions`, `last_instructions`

**Actions:** `replace`, `remove`, `append`, `prepend`

---

## Attachment Types

```python
# File
{"type": "file", "path": str, "displayName": str | None}

# Directory
{"type": "directory", "path": str, "displayName": str | None}

# Selection
{"type": "selection", "filePath": str, "displayName": str, "text": str | None}

# Blob (base64)
{"type": "blob", "data": str, "mimeType": str, "displayName": str | None}
```

---

## Response Types

### ModelInfo

```python
model.id                    # e.g., "gpt-4.1"
model.name                  # Display name
model.capabilities.supports.vision  # bool
model.supported_reasoning_efforts   # list[str] | None
```

### SessionMetadata

```python
metadata.sessionId
metadata.startTime      # ISO 8601
metadata.modifiedTime   # ISO 8601
metadata.summary
```

### GetAuthStatusResponse

```python
auth.isAuthenticated    # bool
auth.authType           # str | None
auth.login              # str | None
```

### MessageOptions (dict for send/send_and_wait)

```python
{
    "prompt": str,                          # Required
    "mode": "enqueue" | "immediate",        # Default: "enqueue"
}
```
