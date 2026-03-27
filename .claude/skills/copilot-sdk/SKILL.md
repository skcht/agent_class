---
name: copilot-sdk
description: Build Python applications powered by GitHub Copilot using the Copilot SDK. Use when creating programmatic integrations with Copilot in Python. Covers session management, custom tools, streaming, hooks, MCP servers, BYOK providers, session persistence, custom agents, sub-agent orchestration, skills, steering & queueing, and deployment patterns. Requires GitHub Copilot CLI installed and a GitHub Copilot subscription (unless using BYOK). TRIGGER this skill whenever the user imports `copilot`, `CopilotClient`, `github-copilot-sdk`, mentions "Copilot SDK", or wants to build agents/automations using the GitHub Copilot platform programmatically — even if they don't say "SDK" explicitly.
---

# GitHub Copilot SDK (Python)

Build Python applications that programmatically interact with GitHub Copilot. The SDK wraps the Copilot CLI via JSON-RPC, providing session management, custom tools, hooks, MCP server integration, sub-agent orchestration, and streaming.

> **Note:** This SDK is in technical preview and may change in breaking ways.

## Prerequisites

- **GitHub Copilot CLI** installed and authenticated (`copilot --version`)
- **GitHub Copilot subscription** (Individual, Business, or Enterprise) — not required for BYOK
- **Python 3.8+**

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
from copilot import CopilotClient
from copilot.session import PermissionHandler

async def main():
    client = CopilotClient()
    await client.start()

    session = await client.create_session(
        on_permission_request=PermissionHandler.approve_all,
        model="gpt-4.1",
    )

    response = await session.send_and_wait({"prompt": "What is 2+2?"})
    print(response.data.content)

    await client.stop()

asyncio.run(main())
```

Sessions support the `async with` context manager for automatic cleanup:

```python
async with await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
) as session:
    response = await session.send_and_wait({"prompt": "What is 2+2?"})
    print(response.data.content)
```

---

## Permission Handling

`on_permission_request` is **required** for every `create_session` and `resume_session` call.

### Approve All (simplest)

```python
from copilot.session import PermissionHandler

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
)
```

### Custom Permission Handler

```python
from copilot.session import PermissionRequestResult

def on_permission_request(request, invocation):
    # request.kind.value: "shell"|"write"|"read"|"mcp"|"custom-tool"|"url"|"memory"|"hook"
    if request.kind.value == "shell":
        return PermissionRequestResult(kind="denied-interactively-by-user")
    return PermissionRequestResult(kind="approved")

session = await client.create_session(
    on_permission_request=on_permission_request,
    model="gpt-4.1",
)
```

| `kind` value | Meaning |
|---|---------|
| `"approved"` | Allow the tool to run |
| `"denied-interactively-by-user"` | User explicitly denied |
| `"denied-by-rules"` | Denied by a policy rule |

---

## Streaming

```python
import sys
from copilot.generated.session_events import SessionEventType

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    streaming=True,
)

def handle_event(event):
    if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
        sys.stdout.write(event.data.delta_content or "")
        sys.stdout.flush()
    elif event.type == SessionEventType.ASSISTANT_MESSAGE:
        print("\n--- Final ---")
        print(event.data.content)
    elif event.type == SessionEventType.SESSION_IDLE:
        print()

session.on(handle_event)
await session.send({"prompt": "Tell me a short story"})
```

When `streaming=True`:
- `ASSISTANT_MESSAGE_DELTA` events contain incremental `delta_content`
- `ASSISTANT_REASONING_DELTA` events for chain-of-thought (model-dependent)
- `ASSISTANT_MESSAGE` (final) is always sent regardless of streaming setting

For the full list of 40+ event types, read `references/events-reference.md`.

---

## Custom Tools

Define tools with `@define_tool` and Pydantic models:

```python
from pydantic import BaseModel, Field
from copilot.tools import define_tool

class LookupIssueParams(BaseModel):
    id: str = Field(description="Issue identifier")

@define_tool(description="Fetch issue details from our tracker")
async def lookup_issue(params: LookupIssueParams) -> str:
    issue = await fetch_issue(params.id)
    return issue.summary

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    tools=[lookup_issue],
)
```

> When using `from __future__ import annotations`, define Pydantic models at module level (not inside functions).

### Low-level Tool API (without Pydantic)

```python
from copilot.tools import Tool

async def lookup_issue(invocation):
    issue_id = invocation["arguments"]["id"]
    issue = await fetch_issue(issue_id)
    return {"textResultForLlm": issue.summary, "resultType": "success"}

tool = Tool(
    name="lookup_issue",
    description="Fetch issue details",
    parameters={"type": "object", "properties": {"id": {"type": "string"}}, "required": ["id"]},
    handler=lookup_issue,
)
```

### Tool Options

- `overrides_built_in_tool=True` — Replace a built-in CLI tool
- `skip_permission=True` — Execute without triggering permission prompt

---

## Image Support

```python
# File attachment
await session.send({"prompt": "What's in this image?"}, attachments=[
    {"type": "file", "path": "/path/to/image.jpg"},
])

# Blob attachment (base64)
await session.send({"prompt": "What's in this image?"}, attachments=[
    {"type": "blob", "data": base64_data, "mimeType": "image/png"},
])
```

---

## Session Hooks

Hooks plug custom logic into session lifecycle — permissions, auditing, prompt enrichment, error handling. All hooks are optional async functions receiving `(input_data, invocation)`.

```python
async def on_pre_tool_use(input_data, invocation):
    if input_data["toolName"] in ["shell", "bash"]:
        return {"permissionDecision": "deny", "permissionDecisionReason": "Shell blocked"}
    return {"permissionDecision": "allow"}

async def on_post_tool_use(input_data, invocation):
    return {"additionalContext": "Post-execution notes"}

async def on_user_prompt_submitted(input_data, invocation):
    return {"modifiedPrompt": f"[Context] {input_data['prompt']}"}

async def on_session_start(input_data, invocation):
    return {"additionalContext": "Project uses Python and FastAPI."}

async def on_session_end(input_data, invocation):
    print(f"Session ended: {input_data['reason']}")

async def on_error_occurred(input_data, invocation):
    return {"errorHandling": "retry", "retryCount": 3}

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    hooks={
        "on_pre_tool_use": on_pre_tool_use,
        "on_post_tool_use": on_post_tool_use,
        "on_user_prompt_submitted": on_user_prompt_submitted,
        "on_session_start": on_session_start,
        "on_session_end": on_session_end,
        "on_error_occurred": on_error_occurred,
    },
)
```

For full hook input/output field details, see `references/api-reference.md` (Hook Types section).

---

## MCP Server Integration

### Local Stdio Server

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    mcp_servers={
        "filesystem": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
            "tools": ["*"],
        },
    },
)
```

### Remote HTTP Server

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    mcp_servers={
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
            "headers": {"Authorization": f"Bearer {TOKEN}"},
            "tools": ["*"],
        },
    },
)
```

---

## BYOK (Bring Your Own Key)

No Copilot subscription required. The CLI acts as agent runtime only.

```python
import os

# OpenAI
provider={"type": "openai", "base_url": "https://api.openai.com/v1", "api_key": os.environ["OPENAI_API_KEY"]}

# Azure AI Foundry (OpenAI-compatible) — use "responses" wire_api for GPT-5 series
provider={"type": "openai", "base_url": "https://your-resource.openai.azure.com/openai/v1/",
          "wire_api": "responses", "api_key": os.environ["FOUNDRY_API_KEY"]}

# Azure OpenAI (native endpoint) — MUST use type: "azure"
provider={"type": "azure", "base_url": "https://my-resource.openai.azure.com",
          "api_key": os.environ["AZURE_OPENAI_KEY"], "azure": {"api_version": "2024-10-21"}}

# Anthropic
provider={"type": "anthropic", "base_url": "https://api.anthropic.com",
          "api_key": os.environ["ANTHROPIC_API_KEY"]}

# Ollama (local) — no api_key needed
provider={"type": "openai", "base_url": "http://localhost:11434/v1"}

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",   # model is REQUIRED with BYOK
    provider=provider,
)
```

| Field | Type | Description |
|-------|------|-------------|
| `type` | `"openai"` / `"azure"` / `"anthropic"` | Provider type |
| `base_url` | str | **Required.** API endpoint |
| `api_key` | str | API key (optional for local) |
| `bearer_token` | str | Bearer token (takes precedence) |
| `wire_api` | `"completions"` / `"responses"` | Default: `"completions"` |

> For native Azure endpoints (`*.openai.azure.com`), you **must** use `type: "azure"`. For Azure AI Foundry with `/openai/v1/`, use `type: "openai"`.

---

## Session Management

### Persistence

```python
# Create with explicit ID
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    session_id="user-123-task-456",
)

# Resume later (on_permission_request required)
resumed = await client.resume_session(
    "user-123-task-456",
    on_permission_request=PermissionHandler.approve_all,
)
```

Resume supports reconfiguring: `model`, `system_message`, `available_tools`, `excluded_tools`, `provider`, `reasoning_effort`, `streaming`, `working_directory`, `mcp_servers`, `custom_agents`, `agent`, `skill_directories`, `disabled_skills`, `infinite_sessions`.

### Lifecycle

```python
sessions = await client.list_sessions()
last_id = await client.get_last_session_id()
await session.disconnect()                    # Preserves session data on disk
await client.delete_session("user-123-task-456")  # Permanently removes all data
```

### Infinite Sessions

Automatically manages context window limits through background compaction.

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    infinite_sessions={"enabled": True, "background_compaction_threshold": 0.80,
                       "buffer_exhaustion_threshold": 0.95},
)
```

---

## Steering & Queueing

Control in-flight sessions with two message delivery modes:

| Mode | Behavior | Use Case |
|------|----------|----------|
| `"immediate"` (steering) | Injected into the **current** LLM turn | "Actually, use a different approach" |
| `"enqueue"` (queueing) | Queued for **after** the current turn | "After this, also fix the tests" |

```python
# Start a task
await session.send({"prompt": "Refactor the authentication module"})

# Steer the current turn (injected immediately)
await session.send({"prompt": "Use JWT tokens instead", "mode": "immediate"})

# Queue a follow-up (processed after current turn)
await session.send({"prompt": "Then update the docs", "mode": "enqueue"})
```

When `mode` is omitted, the default is `"enqueue"`. When the session is idle, both modes start a new turn immediately.

---

## Custom Agents & Sub-Agent Orchestration

Define specialized agents with scoped tools and prompts. The runtime automatically delegates to sub-agents based on user intent.

```python
from copilot.session import PermissionRequestResult

session = await client.create_session(
    on_permission_request=lambda req, inv: PermissionRequestResult(kind="approved"),
    model="gpt-4.1",
    custom_agents=[
        {
            "name": "researcher",
            "display_name": "Research Agent",
            "description": "Explores codebases using read-only tools",
            "tools": ["grep", "glob", "view"],
            "prompt": "You are a research assistant. Do not modify any files.",
        },
        {
            "name": "editor",
            "display_name": "Editor Agent",
            "description": "Makes targeted code changes",
            "tools": ["view", "edit", "bash"],
            "prompt": "Make minimal, surgical changes as requested.",
            "infer": False,  # Only invoked when explicitly asked
        },
    ],
    agent="researcher",  # Pre-select agent at session start
)
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | str | **Required.** Unique identifier |
| `display_name` | str | Human-readable name |
| `description` | str | Helps runtime match user intent |
| `tools` | list[str] / None | Tool names; `None` = all tools |
| `prompt` | str | **Required.** System prompt |
| `mcp_servers` | dict | Agent-specific MCP servers |
| `infer` | bool | Auto-select by runtime (default: `True`) |

### Sub-Agent Events

```python
def handle_event(event):
    if event.type == SessionEventType.SUBAGENT_STARTED:
        print(f"Sub-agent started: {event.data.agent_display_name}")
    elif event.type == SessionEventType.SUBAGENT_COMPLETED:
        print(f"Sub-agent completed: {event.data.agent_display_name}")
    elif event.type == SessionEventType.SUBAGENT_FAILED:
        print(f"Sub-agent failed: {event.data.error}")

session.on(handle_event)
```

---

## Skills

Load reusable prompt modules from skill directories:

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    skill_directories=["./skills"],
    disabled_skills=["skill-to-disable"],
)
```

Skills are directories containing a `SKILL.md` with YAML frontmatter (`name`, `description`) and markdown instructions.

---

## User Input Requests

Enable the agent's `ask_user` tool:

```python
async def handle_user_input(request, invocation):
    print(f"Agent asks: {request['question']}")
    return {"answer": "User's answer here", "wasFreeform": True}

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    on_user_input_request=handle_user_input,
)
```

---

## System Message

```python
# Append (default)
system_message={"content": "You are a helpful assistant. Always be concise."}

# Customize per-section (replace, remove, append, prepend)
system_message={
    "mode": "customize",
    "sections": {
        "identity": {"action": "replace", "content": "You are a security auditor."},
        "tone": {"action": "remove"},
    },
    "content": "Additional instructions.",
}
```

For full section list and details, see `references/api-reference.md` (System Message Types).

---

## Client Configuration

```python
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient()                                           # Auto-spawn CLI
client = CopilotClient(SubprocessConfig(cli_path="/path/to/copilot", log_level="debug"))
client = CopilotClient({"cli_url": "localhost:4321"})              # External CLI server
```

**Telemetry:** `CopilotClient(SubprocessConfig(telemetry={"otlp_endpoint": "http://localhost:4318"}))`. Install extras: `pip install github-copilot-sdk[telemetry]`

---

## Debugging

```python
client = CopilotClient(SubprocessConfig(log_level="debug"))
```

| Issue | Cause | Solution |
|-------|-------|----------|
| `CLI not found` | CLI not in PATH | Install CLI or set `cli_path` |
| `Not authenticated` | No valid credentials | Run `copilot auth login` or provide `github_token` |
| `Session not found` | Using session after `disconnect()` | Check `list_sessions()` for valid IDs |
| `Connection refused` | CLI process crashed | Check port conflicts |
| MCP tools missing | Server init failure | Set `tools: ["*"]`, test server independently |
| `Model not specified` | BYOK without model | `model` is required with custom `provider` |
| Azure wrong type | Using `"openai"` for `*.openai.azure.com` | Use `type: "azure"` for native Azure endpoints |

---

## References

For detailed API types, event types, deployment patterns, and acceptance criteria, read:

- `references/api-reference.md` — Full type definitions, method signatures, config options
- `references/events-reference.md` — All 40+ session event types with field details
- `references/deployment.md` — Setup patterns, scaling, multi-tenancy, production checklist
- `references/acceptance-criteria.md` — Correct/incorrect code patterns

## Links

- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Copilot CLI Installation](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
- [Python SDK Cookbook](https://github.com/github/awesome-copilot/blob/main/cookbook/copilot-sdk/python/README.md)
- [MCP Protocol](https://modelcontextprotocol.io)
