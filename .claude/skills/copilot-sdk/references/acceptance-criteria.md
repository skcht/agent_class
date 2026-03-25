# Acceptance Criteria: copilot-sdk (Python)

## Client Creation & Quick Start

### Correct
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
    await session.send("Hello!")
    await done.wait()

    await session.disconnect()
    await client.stop()

asyncio.run(main())
```

### Also Correct (v0.2.0 keyword-only syntax)
```python
session = await client.create_session(
    model="gpt-5",
    on_permission_request=PermissionHandler.approve_all,
)
response = await session.send_and_wait("Hello!")
```

### Incorrect
```python
# WRONG — Missing on_permission_request (it's required)
session = await client.create_session({"model": "gpt-5"})
```

```python
# WRONG — send_and_wait takes a string, not a dict
response = await session.send_and_wait({"prompt": "Hello"})
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

## Context Manager

### Correct
```python
async with await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
}) as session:
    await session.send("Hello")
    # session.disconnect() called automatically
```

## Streaming

### Correct
```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "streaming": True,
    "on_permission_request": PermissionHandler.approve_all,
})

done = asyncio.Event()

def handle_event(event):
    if event.type.value == "assistant.message_delta":
        print(event.data.delta_content or "", end="", flush=True)
    elif event.type.value == "session.idle":
        done.set()

session.on(handle_event)
await session.send("Write a haiku")
await done.wait()
```

### Incorrect
```python
# WRONG — Missing on_permission_request
session = await client.create_session({"model": "claude-sonnet-4.6", "streaming": True})
```

## Custom Tools

### Correct
```python
from pydantic import BaseModel, Field
from copilot import define_tool

class MyParams(BaseModel):
    value: str = Field(description="Input value")

@define_tool(description="Process a value")
async def process_value(params: MyParams) -> str:
    return f"Processed: {params.value}"

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "tools": [process_value],
    "on_permission_request": PermissionHandler.approve_all,
})
```

### Also Correct (low-level API without Pydantic)
```python
from copilot.tools import Tool

async def my_handler(invocation):
    return {"textResultForLlm": "result", "resultType": "success"}

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "tools": [Tool(name="my_tool", description="...", parameters={...}, handler=my_handler)],
    "on_permission_request": PermissionHandler.approve_all,
})
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
from copilot import PermissionRequest, PermissionRequestResult

def on_permission_request(request: PermissionRequest, invocation: dict) -> PermissionRequestResult:
    if request.kind.value == "shell":
        return PermissionRequestResult(kind="denied-interactively-by-user")
    return PermissionRequestResult(kind="approved")

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": on_permission_request,
})
```

### Incorrect
```python
# WRONG — Omitting on_permission_request entirely
session = await client.create_session({"model": "gpt-5"})
```

## Hooks — Pre Tool Use

### Correct
```python
async def on_pre_tool_use(input_data, invocation):
    if input_data["toolName"] in ["shell", "bash"]:
        return {
            "permissionDecision": "deny",
            "permissionDecisionReason": "Shell access not permitted",
        }
    return {"permissionDecision": "allow"}

session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "hooks": {"on_pre_tool_use": on_pre_tool_use},
})
```

## MCP Server Integration

### Correct
```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "mcp_servers": {
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
})
```

## BYOK (Bring Your Own Key)

### Correct
```python
import os

session = await client.create_session({
    "model": "gpt-4",
    "on_permission_request": PermissionHandler.approve_all,
    "provider": {
        "type": "openai",
        "base_url": "https://api.openai.com/v1",
        "api_key": os.environ["OPENAI_API_KEY"],
    },
})
```

### Also Correct (Azure — must use type: "azure")
```python
session = await client.create_session({
    "model": "gpt-4",
    "on_permission_request": PermissionHandler.approve_all,
    "provider": {
        "type": "azure",
        "base_url": "https://my-resource.openai.azure.com",
        "api_key": os.environ["AZURE_OPENAI_KEY"],
        "azure": {"api_version": "2024-10-21"},
    },
})
```

### Incorrect
```python
# WRONG — Hardcoded API key in source code
session = await client.create_session({
    "provider": {"api_key": "sk-abc123def456"},
})
```

```python
# WRONG — Using type: "openai" for Azure endpoint
session = await client.create_session({
    "provider": {
        "type": "openai",  # Should be "azure" for *.openai.azure.com
        "base_url": "https://my-resource.openai.azure.com",
    },
})
```

## Session Persistence

### Correct
```python
# Create resumable session
session = await client.create_session({
    "session_id": "project-alpha-task-1",
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
})
await session.send("Remember this context")

# Resume later
resumed = await client.resume_session("project-alpha-task-1", {
    "on_permission_request": PermissionHandler.approve_all,
})
```

### Incorrect
```python
# WRONG — Missing on_permission_request in resume_session
resumed = await client.resume_session("project-alpha-task-1")
```

## Custom Agents

### Correct
```python
session = await client.create_session({
    "model": "claude-sonnet-4.6",
    "on_permission_request": PermissionHandler.approve_all,
    "custom_agents": [
        {
            "name": "code-reviewer",
            "display_name": "Code Reviewer",
            "description": "Reviews code for bugs and best practices",
            "prompt": "You are an expert code reviewer...",
        },
    ],
})
```

## Image Support

### Correct
```python
# File attachment
await session.send("What's in this image?", attachments=[
    {"type": "file", "path": "/path/to/image.jpg"},
])

# Blob attachment
await session.send("Describe this", attachments=[
    {"type": "blob", "data": base64_data, "mimeType": "image/png"},
])
```
