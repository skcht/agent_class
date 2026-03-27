# Acceptance Criteria: copilot-sdk (Python)

## Client Creation & Quick Start

### Correct
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

    response = await session.send_and_wait({"prompt": "Hello!"})
    print(response.data.content)

    await client.stop()

asyncio.run(main())
```

### Incorrect
```python
# WRONG — Missing on_permission_request (it's required)
session = await client.create_session(model="gpt-4.1")
```

```python
# WRONG — send_and_wait takes a dict with "prompt" key
response = await session.send_and_wait("Hello")
```

```python
# WRONG — CopilotClient doesn't take cli_path as a direct kwarg
client = CopilotClient(cli_path="/usr/bin/copilot")
# Correct: CopilotClient(SubprocessConfig(cli_path="/usr/bin/copilot"))
```

```python
# WRONG — Wrong import path
import copilot_sdk
```

```python
# WRONG — Hardcoded API key
client = CopilotClient(SubprocessConfig(github_token="ghp_abc123"))
```

```python
# WRONG — Using old event string comparison instead of enum
if event.type.value == "assistant.message_delta":  # Works but prefer enum
# Better:
if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
```

## Context Manager

### Correct
```python
async with await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
) as session:
    await session.send({"prompt": "Hello"})
    # session.disconnect() called automatically
```

## Streaming

### Correct
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
    elif event.type == SessionEventType.SESSION_IDLE:
        print()

session.on(handle_event)
await session.send_and_wait({"prompt": "Write a haiku"})
```

### Incorrect
```python
# WRONG — Missing on_permission_request
session = await client.create_session(model="gpt-4.1", streaming=True)
```

## Custom Tools

### Correct
```python
from pydantic import BaseModel, Field
from copilot.tools import define_tool

class MyParams(BaseModel):
    value: str = Field(description="Input value")

@define_tool(description="Process a value")
async def process_value(params: MyParams) -> str:
    return f"Processed: {params.value}"

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    tools=[process_value],
)
```

### Also Correct (low-level API without Pydantic)
```python
from copilot.tools import Tool

async def my_handler(invocation):
    return {"textResultForLlm": "result", "resultType": "success"}

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    tools=[Tool(name="my_tool", description="...", parameters={...}, handler=my_handler)],
)
```

### Incorrect
```python
# WRONG — Using **kwargs instead of typed parameters
@define_tool(description="Bad tool")
def bad_tool(**kwargs):
    return kwargs
```

```python
# WRONG — Missing Pydantic model for parameters
@define_tool(description="Bad tool")
async def bad_tool(city: str) -> dict:
    return {"city": city}
```

## Permission Handling

### Correct
```python
from copilot.session import PermissionRequestResult

def on_permission_request(request, invocation):
    if request.kind.value == "shell":
        return PermissionRequestResult(kind="denied-interactively-by-user")
    return PermissionRequestResult(kind="approved")

session = await client.create_session(
    on_permission_request=on_permission_request,
    model="gpt-4.1",
)
```

### Also Correct (lambda shorthand)
```python
session = await client.create_session(
    on_permission_request=lambda req, inv: PermissionRequestResult(kind="approved"),
    model="gpt-4.1",
)
```

### Incorrect
```python
# WRONG — Omitting on_permission_request entirely
session = await client.create_session(model="gpt-4.1")
```

## Hooks

### Correct
```python
async def on_pre_tool_use(input_data, invocation):
    if input_data["toolName"] in ["shell", "bash"]:
        return {"permissionDecision": "deny", "permissionDecisionReason": "Shell blocked"}
    return {"permissionDecision": "allow"}

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    hooks={"on_pre_tool_use": on_pre_tool_use},
)
```

## MCP Server Integration

### Correct
```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    mcp_servers={
        "github": {
            "type": "http",
            "url": "https://api.githubcopilot.com/mcp/",
            "tools": ["*"],
        },
        "filesystem": {
            "type": "local",
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"],
            "tools": ["*"],
        },
    },
)
```

## BYOK (Bring Your Own Key)

### Correct
```python
import os

session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4",
    provider={
        "type": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": os.environ["OPENAI_API_KEY"],
    },
)
```

### Also Correct (Azure — must use type: "azure")
```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4",
    provider={
        "type": "azure",
        "base_url": "https://my-resource.openai.azure.com",
        "api_key": os.environ["AZURE_OPENAI_KEY"],
        "azure": {"api_version": "2024-10-21"},
    },
)
```

### Also Correct (Azure AI Foundry — OpenAI-compatible endpoint)
```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-5.2-codex",
    provider={
        "type": "openai",
        "base_url": "https://your-resource.openai.azure.com/openai/v1/",
        "wire_api": "responses",
        "api_key": os.environ["FOUNDRY_API_KEY"],
    },
)
```

### Incorrect
```python
# WRONG — Hardcoded API key in source code
session = await client.create_session(
    provider={"api_key": "sk-abc123def456"},
)
```

```python
# WRONG — Using type: "openai" for native Azure endpoint
session = await client.create_session(
    provider={
        "type": "openai",  # Should be "azure" for *.openai.azure.com
        "base_url": "https://my-resource.openai.azure.com",
    },
)
```

```python
# WRONG — Missing model with BYOK provider
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    provider={"type": "openai", "base_url": "..."},
)
# model is REQUIRED when using a custom provider
```

## Session Persistence

### Correct
```python
# Create resumable session
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    session_id="project-alpha-task-1",
)

# Resume later — on_permission_request required again
resumed = await client.resume_session(
    "project-alpha-task-1",
    on_permission_request=PermissionHandler.approve_all,
)
```

### Incorrect
```python
# WRONG — Missing on_permission_request in resume_session
resumed = await client.resume_session("project-alpha-task-1")
```

## Steering & Queueing

### Correct
```python
# Start a task
await session.send({"prompt": "Refactor the auth module"})

# Steer the current turn
await session.send({"prompt": "Use JWT instead", "mode": "immediate"})

# Queue for after current turn
await session.send({"prompt": "Then update docs", "mode": "enqueue"})
```

### Incorrect
```python
# WRONG — mode is part of the options dict, not a kwarg
await session.send({"prompt": "..."}, mode="immediate")
```

## Custom Agents

### Correct
```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    custom_agents=[
        {
            "name": "code-reviewer",
            "display_name": "Code Reviewer",
            "description": "Reviews code for bugs and best practices",
            "prompt": "You are an expert code reviewer...",
            "tools": ["grep", "glob", "view"],
        },
    ],
    agent="code-reviewer",  # Pre-select this agent
)
```

## Skills

### Correct
```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    skill_directories=["./skills"],
    disabled_skills=["unused-skill"],
)
```

## Client Configuration

### Correct
```python
# External CLI server
client = CopilotClient({"cli_url": "localhost:4321"})

# Custom subprocess config
from copilot import SubprocessConfig
client = CopilotClient(SubprocessConfig(
    cli_path="/path/to/copilot",
    log_level="debug",
))
```

### Incorrect
```python
# WRONG — ExternalServerConfig is not the dict syntax
from copilot import ExternalServerConfig
client = CopilotClient(ExternalServerConfig(url="localhost:4321"))
# Use dict syntax instead: CopilotClient({"cli_url": "localhost:4321"})
```

## Image Support

### Correct
```python
# File attachment
await session.send({"prompt": "What's in this image?"}, attachments=[
    {"type": "file", "path": "/path/to/image.jpg"},
])

# Blob attachment
await session.send({"prompt": "Describe this"}, attachments=[
    {"type": "blob", "data": base64_data, "mimeType": "image/png"},
])
```

## System Message

### Correct
```python
# Simple append
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    system_message={"content": "Always be concise."},
)

# Per-section customization
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    system_message={
        "mode": "customize",
        "sections": {
            "identity": {"action": "replace", "content": "You are a security auditor."},
            "tone": {"action": "remove"},
        },
    },
)
```
