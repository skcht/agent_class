---
name: copilot-sdk
description: Build Python applications powered by GitHub Copilot using the Copilot SDK. Use when creating programmatic integrations with Copilot in Python. Covers session management, custom tools, streaming, hooks, MCP servers, BYOK providers, session persistence, custom agents, skills, and deployment patterns. Requires GitHub Copilot CLI installed and a GitHub Copilot subscription (unless using BYOK). TRIGGER this skill whenever the user imports `copilot`, `CopilotClient`, `github-copilot-sdk`, mentions "Copilot SDK", or wants to build agents/automations using the GitHub Copilot platform programmatically — even if they don't say "SDK" explicitly.
---

# GitHub Copilot SDK (Python)

Build Python applications that programmatically interact with GitHub Copilot. The SDK wraps the Copilot CLI via JSON-RPC, providing session management, custom tools, hooks, MCP server integration, and streaming.

> **Note:** This SDK is in technical preview and may change in breaking ways.

## Prerequisites

- **GitHub Copilot CLI** installed and authenticated (`copilot --version`)
- **GitHub Copilot subscription** (Individual, Business, or Enterprise) — not required for BYOK
- **Python 3.11+**

## Installation

```bash
pip install github-copilot-sdk
```

## Architecture

```
Your App → SDK Client → [stdio/TCP] → Copilot CLI → Model Provider
                                          ↕
                                     MCP Servers
```

| Mode | Description | Use Case |
|------|-------------|----------|
| **Stdio** (default) | CLI as subprocess via pipes | Local dev, single process |
| **TCP** | CLI as network server | Multi-client, backend services |

---

## Quick Start

```python
import asyncio
from copilot import CopilotClient, PermissionHandler

async def main():
    client = CopilotClient()
    await client.start()

    # on_permission_request is REQUIRED
    session = await client.create_session({
        "model": "claude-sonnet-4.6",
        "on_permission_request": PermissionHandler.approve_all,
    })

    done = asyncio.Event()

    def on_event(event):
        if event.type.value == "assistant.message":
            print(event.data.content)
        elif event.type.value == "session.idle":
            done.set()

    session.on(on_event)
    await session.send("What is 2+2?")
    await done.wait()

    await session.disconnect()
    await client.stop()

asyncio.run(main())
```

Sessions support the `async with` context manager for automatic cleanup:

```python
async with await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
}) as session:
    response = await session.send_and_wait("What is 2+2?")
    if response:
        print(response.data.content)
```

> **v0.2.0 Note:** The published PyPI version (v0.2.0) uses keyword-only arguments instead of a config dict:
> ```python
> session = await client.create_session(
>     model="gpt-5",
>     on_permission_request=PermissionHandler.approve_all,
> )
> response = await session.send_and_wait("What is 2+2?")
> ```
> If dict-based syntax raises `TypeError`, switch to keyword arguments.

---

## Permission Handling

`on_permission_request` is **required** for every `create_session` and `resume_session` call. The handler is called before each tool execution (file writes, shell commands, etc.) and must return a decision.

### Approve All (simplest)

```python
from copilot import CopilotClient, PermissionHandler

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
})
```

### Custom Permission Handler

```python
from copilot import PermissionRequest, PermissionRequestResult

def on_permission_request(request: PermissionRequest, invocation: dict) -> PermissionRequestResult:
    # request.kind.value: "shell"|"write"|"read"|"mcp"|"custom-tool"|"url"|"memory"|"hook"
    if request.kind.value == "shell":
        return PermissionRequestResult(kind="denied-interactively-by-user")
    return PermissionRequestResult(kind="approved")

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": on_permission_request,
})
```

| `kind` value | Meaning |
|---|---------|
| `"approved"` | Allow the tool to run |
| `"denied-interactively-by-user"` | User explicitly denied |
| `"denied-by-rules"` | Denied by a policy rule |
| `"denied-no-approval-rule-and-could-not-request-from-user"` | Default when no kind specified |

---

## Streaming

```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "streaming": True,
    "on_permission_request": PermissionHandler.approve_all,
})

done = asyncio.Event()

def on_event(event):
    if event.type.value == "assistant.message_delta":
        print(event.data.delta_content or "", end="", flush=True)
    elif event.type.value == "assistant.message":
        print("\n--- Final ---")
        print(event.data.content)
    elif event.type.value == "session.idle":
        done.set()

session.on(on_event)
await session.send("Tell me a short story")
await done.wait()
```

When `streaming=True`:
- `assistant.message_delta` events contain incremental `delta_content`
- `assistant.reasoning_delta` events for chain-of-thought (model-dependent)
- `assistant.message` (final) is always sent regardless of streaming setting

---

## Custom Tools

Define tools with `@define_tool` and Pydantic models:

```python
from pydantic import BaseModel, Field
from copilot import define_tool

class LookupIssueParams(BaseModel):
    id: str = Field(description="Issue identifier")

@define_tool(description="Fetch issue details from our tracker")
async def lookup_issue(params: LookupIssueParams) -> str:
    issue = await fetch_issue(params.id)
    return issue.summary

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "tools": [lookup_issue],
    "on_permission_request": PermissionHandler.approve_all,
})
```

> When using `from __future__ import annotations`, define Pydantic models at module level (not inside functions).

### Low-level Tool API (without Pydantic)

```python
from copilot.tools import Tool

async def lookup_issue(invocation):
    issue_id = invocation["arguments"]["id"]
    issue = await fetch_issue(issue_id)
    return {"textResultForLlm": issue.summary, "resultType": "success"}

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "tools": [
        Tool(
            name="lookup_issue",
            description="Fetch issue details",
            parameters={"type": "object", "properties": {"id": {"type": "string", "description": "Issue ID"}}, "required": ["id"]},
            handler=lookup_issue,
        )
    ],
    "on_permission_request": PermissionHandler.approve_all,
})
```

### Tool Options

- `overrides_built_in_tool=True` — Replace a built-in CLI tool (e.g., `edit_file`)
- `skip_permission=True` — Execute without triggering permission prompt

---

## Image Support

```python
# File attachment
await session.send("What's in this image?", attachments=[
    {"type": "file", "path": "/path/to/image.jpg"},
])

# Blob attachment (base64)
await session.send("What's in this image?", attachments=[
    {"type": "blob", "data": base64_data, "mimeType": "image/png"},
])
```

---

## Session Hooks

```python
async def on_pre_tool_use(input, invocation):
    print(f"About to run: {input['toolName']}")
    return {"permissionDecision": "allow"}  # "allow"|"deny"|"ask"

async def on_post_tool_use(input, invocation):
    return {"additionalContext": "Post-execution notes"}

async def on_user_prompt_submitted(input, invocation):
    return {"modifiedPrompt": f"[Context] {input['prompt']}"}

async def on_session_start(input, invocation):
    # input["source"]: "startup"|"resume"|"new"
    return {"additionalContext": "Project uses Python and FastAPI."}

async def on_session_end(input, invocation):
    print(f"Session ended: {input['reason']}")

async def on_error_occurred(input, invocation):
    return {"errorHandling": "retry"}  # "retry"|"skip"|"abort"

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "hooks": {
        "on_pre_tool_use": on_pre_tool_use,
        "on_post_tool_use": on_post_tool_use,
        "on_user_prompt_submitted": on_user_prompt_submitted,
        "on_session_start": on_session_start,
        "on_session_end": on_session_end,
        "on_error_occurred": on_error_occurred,
    },
})
```

---

## MCP Server Integration

### Local Stdio Server

```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "mcp_servers": {
        "filesystem": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
            "tools": ["*"],
        },
    },
})
```

### Remote HTTP Server

```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "mcp_servers": {
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
            "headers": {"Authorization": f"Bearer {TOKEN}"},
            "tools": ["*"],
        },
    },
})
```

---

## BYOK (Bring Your Own Key)

No Copilot subscription required. The CLI acts as agent runtime only.

```python
# OpenAI
session = await client.create_session({
    "model": "gpt-4",
    "on_permission_request": PermissionHandler.approve_all,
    "provider": {
        "type": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": os.environ["OPENAI_API_KEY"],
    },
})

# Azure OpenAI — MUST use type: "azure", NOT "openai"
session = await client.create_session({
    "model": "gpt-4",
    "on_permission_request": PermissionHandler.approve_all,
    "provider": {
        "type": "azure",
        "base_url": "https://my-resource.openai.azure.com",  # Just the host, no path
        "api_key": os.environ["AZURE_OPENAI_KEY"],
        "azure": {"api_version": "2024-10-21"},
    },
})

# Ollama (local)
session = await client.create_session({
    "model": "deepseek-coder-v2:16b",
    "on_permission_request": PermissionHandler.approve_all,
    "provider": {
        "type": "openai",
        "base_url": "http://localhost:11434/v1",
    },
})
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"openai"` \| `"azure"` \| `"anthropic"` | Provider type |
| `base_url` | string | **Required.** API endpoint URL |
| `api_key` | string | API key (optional for local providers) |
| `bearer_token` | string | Bearer token (takes precedence over api_key) |
| `wire_api` | `"completions"` \| `"responses"` | API format (default: `"completions"`) |
| `azure.api_version` | string | Azure API version (default: `"2024-10-21"`) |

> **Important:** When using a custom provider, `model` is **required**. For Azure endpoints (`*.openai.azure.com`), you **must** use `type: "azure"`.

---

## Session Management

### Persistence

```python
# Create with explicit ID
session = await client.create_session({
    "session_id": "user-123-task-456",
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
})

# Resume later (on_permission_request required here too)
resumed = await client.resume_session("user-123-task-456", {
    "on_permission_request": PermissionHandler.approve_all,
})
```

### Session Lifecycle

```python
sessions = await client.list_sessions()
last_id = await client.get_last_session_id()
await client.delete_session("user-123-task-456")
await session.disconnect()     # Preferred — preserves session data on disk
# await session.destroy()      # Deprecated — use disconnect() instead
```

### Infinite Sessions

Enabled by default. Automatically manages context window limits through background compaction.

```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "infinite_sessions": {
        "enabled": True,
        "background_compaction_threshold": 0.80,
        "buffer_exhaustion_threshold": 0.95,
    },
})
```

---

## Custom Agents & System Message

```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "custom_agents": [{
        "name": "pr-reviewer",
        "display_name": "PR Reviewer",
        "description": "Reviews pull requests for best practices",
        "prompt": "You are an expert code reviewer. Focus on security, performance, and maintainability.",
    }],
    "system_message": {"content": "You are a helpful assistant. Always be concise."},
})
```

---

## User Input Requests

Enable the agent's `ask_user` tool:

```python
async def handle_user_input(request, invocation):
    print(f"Agent asks: {request['question']}")
    return {"answer": "User's answer here", "wasFreeform": True}

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "on_user_input_request": handle_user_input,
})
```

---

## Telemetry

```python
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient(SubprocessConfig(
    telemetry={"otlp_endpoint": "http://localhost:4318"},
))
```

Install with telemetry extras: `pip install github-copilot-sdk[telemetry]`

---

## Client Configuration

```python
from copilot import CopilotClient, SubprocessConfig, ExternalServerConfig

# Spawn local CLI (default)
client = CopilotClient()

# Custom subprocess config
client = CopilotClient(SubprocessConfig(
    cli_path="/path/to/copilot",
    cwd="/workspace",
    log_level="debug",
    github_token=os.environ.get("GITHUB_TOKEN"),
    use_logged_in_user=True,
))

# Connect to external CLI server
client = CopilotClient(ExternalServerConfig(url="localhost:4321"))
```

**SubprocessConfig fields:** `cli_path`, `cli_args`, `cwd`, `use_stdio` (default: True), `port`, `log_level` (default: "info"), `env`, `github_token`, `use_logged_in_user`, `telemetry`

**ExternalServerConfig fields:** `url` (e.g., `"localhost:8080"`, `"http://127.0.0.1:9000"`, or just `"8080"`)

---

## Debugging

```python
client = CopilotClient(SubprocessConfig(log_level="debug"))
```

| Issue | Cause | Solution |
|-------|-------|----------|
| `CLI not found` | CLI not installed or not in PATH | Install CLI or set `cli_path` in SubprocessConfig |
| `Not authenticated` | No valid credentials | Run `copilot auth login` or provide `github_token` |
| `Session not found` | Using session after `disconnect()` | Check `list_sessions()` for valid IDs |
| `Connection refused` | CLI process crashed | Check port conflicts, enable `auto_start=True` |
| MCP tools missing | Server init failure | Set `tools: ["*"]`, test server independently |
| `TypeError` on `create_session` | v0.2.0 API difference | Use keyword args instead of config dict |

---

## References

For detailed API types, deployment patterns, and acceptance criteria, read the reference files in `references/`:

- `references/api-reference.md` — Full type definitions, event types, method signatures
- `references/deployment.md` — Docker, production checklist, session isolation
- `references/acceptance-criteria.md` — Correct/incorrect code patterns

## Links

- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Copilot CLI Installation](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- [Python SDK Cookbook](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk/python/README.md)
- [MCP Protocol](https://modelcontextprotocol.io)
