# Copilot SDK Python — Session Events Reference

## Table of Contents
- Event Envelope
- Subscribing to Events
- Assistant Events
- Tool Execution Events
- Session Lifecycle Events
- Permission & User Input Events
- Sub-Agent & Skill Events
- Other Events
- Quick Reference

---

## Event Envelope

Every session event shares these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | str (UUID) | Unique event identifier |
| `timestamp` | str (ISO 8601) | When the event was created |
| `parent_id` | str / None | ID of the previous event in the chain |
| `ephemeral` | bool | `True` for transient events not persisted to disk |
| `type` | SessionEventType | Event type discriminator |
| `data` | object | Event-specific payload |

## Subscribing to Events

```python
from copilot.generated.session_events import SessionEventType

def handle(event):
    if event.type == SessionEventType.ASSISTANT_MESSAGE_DELTA:
        print(event.data.delta_content, end="", flush=True)
    elif event.type == SessionEventType.SESSION_IDLE:
        print("Ready for next message")

unsubscribe = session.on(handle)
# Later: unsubscribe()
```

> Python uses a single `Data` class with all possible fields as optional. Only the fields listed below are populated for each event type.

---

## Assistant Events

### `assistant.turn_start`
Agent begins processing a turn.

| Data Field | Type | Description |
|------------|------|-------------|
| `turn_id` | str | Turn identifier |
| `interaction_id` | str | Telemetry correlation ID |

### `assistant.intent`
Ephemeral. Short description of what the agent is currently doing.

| Data Field | Type | Description |
|------------|------|-------------|
| `intent` | str | Human-readable intent (e.g., "Exploring codebase") |

### `assistant.reasoning`
Complete extended thinking block.

| Data Field | Type | Description |
|------------|------|-------------|
| `reasoning_id` | str | Unique identifier |
| `content` | str | Complete thinking text |

### `assistant.reasoning_delta`
Ephemeral. Incremental chunk of model's thinking.

| Data Field | Type | Description |
|------------|------|-------------|
| `reasoning_id` | str | Matches `assistant.reasoning` |
| `delta_content` | str | Text chunk to append |

### `assistant.message`
Complete assistant response. May include tool invocation requests.

| Data Field | Type | Description |
|------------|------|-------------|
| `message_id` | str | Unique identifier |
| `content` | str | The assistant's text response |
| `tool_requests` | list | Tool calls the assistant wants to make |
| `reasoning_text` | str | Readable reasoning text |
| `output_tokens` | int | Output token count |
| `phase` | str | `"thinking"` vs `"response"` |
| `parent_tool_call_id` | str | Set when from a sub-agent |

**ToolRequest fields:** `tool_call_id`, `name`, `arguments`, `type` ("function"/"custom")

### `assistant.message_delta`
Ephemeral. Incremental chunk of assistant's response.

| Data Field | Type | Description |
|------------|------|-------------|
| `message_id` | str | Matches `assistant.message` |
| `delta_content` | str | Text chunk to append |
| `parent_tool_call_id` | str | Set when from sub-agent |

### `assistant.turn_end`
Agent finishes a turn.

| Data Field | Type | Description |
|------------|------|-------------|
| `turn_id` | str | Matches `assistant.turn_start` |

### `assistant.usage`
Ephemeral. Token usage and cost information.

| Data Field | Type | Description |
|------------|------|-------------|
| `model` | str | Model identifier |
| `input_tokens` | int | Input tokens consumed |
| `output_tokens` | int | Output tokens produced |
| `cache_read_tokens` | int | Tokens read from cache |
| `cache_write_tokens` | int | Tokens written to cache |
| `cost` | float | Model multiplier cost |
| `duration` | int | API call duration (ms) |

### `assistant.streaming_delta`
Ephemeral. Low-level network progress.

| Data Field | Type | Description |
|------------|------|-------------|
| `total_response_size_bytes` | int | Cumulative bytes received |

---

## Tool Execution Events

### `tool.execution_start`
Tool begins executing.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Unique identifier |
| `tool_name` | str | Tool name (e.g., "bash", "edit") |
| `arguments` | dict | Arguments passed to tool |
| `mcp_server_name` | str | MCP server name if applicable |
| `parent_tool_call_id` | str | Set when invoked by sub-agent |

### `tool.execution_partial_result`
Ephemeral. Incremental output from running tool.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Matches `tool.execution_start` |
| `partial_output` | str | Incremental output chunk |

### `tool.execution_progress`
Ephemeral. Progress status from running tool.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Matches `tool.execution_start` |
| `progress_message` | str | Progress status message |

### `tool.execution_complete`
Tool finishes executing.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Matches `tool.execution_start` |
| `success` | bool | Whether execution succeeded |
| `result` | dict | `content` (str), `detailed_content` (str) |
| `error` | dict | `message` (str), `code` (str) |

### `tool.user_requested`
User explicitly requests a tool invocation.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Unique identifier |
| `tool_name` | str | Tool name |
| `arguments` | dict | Arguments |

---

## Session Lifecycle Events

### `session.idle`
Ephemeral. Agent finished all processing, ready for next message.

| Data Field | Type | Description |
|------------|------|-------------|
| `background_tasks` | dict | Background agents/shells still running |

### `session.error`
Error during session processing.

| Data Field | Type | Description |
|------------|------|-------------|
| `error_type` | str | `"authentication"`, `"quota"`, `"rate_limit"` |
| `message` | str | Human-readable error message |
| `status_code` | int | HTTP status code |

### `session.compaction_start`
Context window compaction begun. Empty data payload.

### `session.compaction_complete`
Compaction finished.

| Data Field | Type | Description |
|------------|------|-------------|
| `success` | bool | Whether compaction succeeded |
| `pre_compaction_tokens` | int | Tokens before |
| `post_compaction_tokens` | int | Tokens after |
| `summary_content` | str | LLM-generated summary |

### `session.title_changed`
Ephemeral. Session title updated.

| Data Field | Type | Description |
|------------|------|-------------|
| `title` | str | New session title |

### `session.context_changed`
Working directory or repository context changed.

| Data Field | Type | Description |
|------------|------|-------------|
| `cwd` | str | Current working directory |
| `git_root` | str | Git repository root |
| `repository` | str | `"owner/name"` format |
| `branch` | str | Current git branch |

### `session.usage_info`
Ephemeral. Context window utilization snapshot.

| Data Field | Type | Description |
|------------|------|-------------|
| `token_limit` | int | Maximum context tokens |
| `current_tokens` | int | Current tokens used |
| `messages_length` | int | Current message count |

### `session.task_complete`
Agent completed its assigned task.

| Data Field | Type | Description |
|------------|------|-------------|
| `summary` | str | Task completion summary |

### `session.shutdown`
Session ended.

| Data Field | Type | Description |
|------------|------|-------------|
| `shutdown_type` | str | `"routine"` or `"error"` |
| `total_premium_requests` | int | Total premium API requests |
| `total_api_duration_ms` | int | Cumulative API time (ms) |
| `code_changes` | dict | `lines_added`, `lines_removed`, `files_modified` |
| `model_metrics` | dict | Per-model usage breakdown |

---

## Permission & User Input Events

### `permission.requested`
Ephemeral. Agent needs permission for an action.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding via `session.respond_to_permission()` |
| `permission_request` | dict | Discriminated on `kind`: `"shell"`, `"write"`, `"read"`, `"mcp"`, `"url"`, `"memory"`, `"custom-tool"` |

### `permission.completed`
Ephemeral. Permission request resolved.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | Matches `permission.requested` |
| `result.kind` | str | `"approved"`, `"denied-by-rules"`, `"denied-interactively-by-user"`, etc. |

### `user_input.requested`
Ephemeral. Agent asking user a question.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding |
| `question` | str | The question |
| `choices` | list[str] | Predefined choices |
| `allow_freeform` | bool | Free-form text allowed |

### `user_input.completed`
Ephemeral. User input resolved.

### `elicitation.requested`
Ephemeral. Agent needs structured form input (MCP elicitation).

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding |
| `message` | str | What information is needed |
| `requested_schema` | dict | JSON Schema for form fields |

### `elicitation.completed`
Ephemeral. Elicitation resolved.

---

## Sub-Agent & Skill Events

### `subagent.started`
Custom agent invoked as sub-agent.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Parent tool call |
| `agent_name` | str | Internal name |
| `agent_display_name` | str | Display name |
| `agent_description` | str | Description |

### `subagent.completed`
Sub-agent finished successfully.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Matches `subagent.started` |
| `agent_name` | str | Internal name |
| `agent_display_name` | str | Display name |

### `subagent.failed`
Sub-agent encountered an error.

| Data Field | Type | Description |
|------------|------|-------------|
| `tool_call_id` | str | Matches `subagent.started` |
| `agent_name` | str | Internal name |
| `error` | str | Error message |

### `subagent.selected`
Custom agent auto-selected for the request.

| Data Field | Type | Description |
|------------|------|-------------|
| `agent_name` | str | Internal name |
| `agent_display_name` | str | Display name |
| `tools` | list[str] / None | Available tools |

### `subagent.deselected`
Agent deselected, returning to default. Empty data payload.

### `skill.invoked`
Skill activated for the conversation.

| Data Field | Type | Description |
|------------|------|-------------|
| `name` | str | Skill name |
| `path` | str | File path to SKILL.md |
| `content` | str | Full skill content injected |
| `allowed_tools` | list[str] | Auto-approved tools |

---

## Other Events

### `abort`
Current turn aborted.

| Data Field | Type | Description |
|------------|------|-------------|
| `reason` | str | e.g., "user initiated" |

### `user.message`
User sent a message.

| Data Field | Type | Description |
|------------|------|-------------|
| `content` | str | User's message text |
| `attachments` | list | Attachments |
| `agent_mode` | str | `"interactive"`, `"plan"`, `"autopilot"`, `"shell"` |

### `system.message`
System prompt injected.

| Data Field | Type | Description |
|------------|------|-------------|
| `content` | str | Prompt text |
| `role` | str | `"system"` or `"developer"` |

### `external_tool.requested`
Ephemeral. Agent wants to invoke an SDK-provided external tool.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding |
| `tool_name` | str | External tool name |
| `arguments` | dict | Arguments |

### `exit_plan_mode.requested`
Ephemeral. Agent wants to exit plan mode.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding |
| `summary` | str | Plan summary |
| `plan_content` | str | Full plan content |

### `command.queued`
Ephemeral. Slash command queued.

| Data Field | Type | Description |
|------------|------|-------------|
| `request_id` | str | For responding |
| `command` | str | Command text |

---

## Quick Reference: Agentic Turn Flow

```
assistant.turn_start          → Turn begins
├── assistant.intent          → What the agent plans to do (ephemeral)
├── assistant.reasoning_delta → Streaming thinking (ephemeral, repeated)
├── assistant.reasoning       → Complete thinking block
├── assistant.message_delta   → Streaming response (ephemeral, repeated)
├── assistant.message         → Complete response (may include tool_requests)
├── assistant.usage           → Token usage (ephemeral)
│
├── [If tools requested:]
│   ├── permission.requested  → Needs approval (ephemeral)
│   ├── permission.completed  → Approval result (ephemeral)
│   ├── tool.execution_start  → Tool begins
│   ├── tool.execution_partial_result  → Streaming output (ephemeral)
│   ├── tool.execution_complete        → Tool finished
│   └── [Agent loops: more reasoning → message → tool calls...]
│
assistant.turn_end            → Turn complete
session.idle                  → Ready for next message (ephemeral)
```

## All Event Types at a Glance

| Event Type | Ephemeral | Category |
|------------|-----------|----------|
| `assistant.turn_start` | | Assistant |
| `assistant.intent` | Yes | Assistant |
| `assistant.reasoning` | | Assistant |
| `assistant.reasoning_delta` | Yes | Assistant |
| `assistant.streaming_delta` | Yes | Assistant |
| `assistant.message` | | Assistant |
| `assistant.message_delta` | Yes | Assistant |
| `assistant.turn_end` | | Assistant |
| `assistant.usage` | Yes | Assistant |
| `tool.user_requested` | | Tool |
| `tool.execution_start` | | Tool |
| `tool.execution_partial_result` | Yes | Tool |
| `tool.execution_progress` | Yes | Tool |
| `tool.execution_complete` | | Tool |
| `session.idle` | Yes | Session |
| `session.error` | | Session |
| `session.compaction_start` | | Session |
| `session.compaction_complete` | | Session |
| `session.title_changed` | Yes | Session |
| `session.context_changed` | | Session |
| `session.usage_info` | Yes | Session |
| `session.task_complete` | | Session |
| `session.shutdown` | | Session |
| `permission.requested` | Yes | Permission |
| `permission.completed` | Yes | Permission |
| `user_input.requested` | Yes | User Input |
| `user_input.completed` | Yes | User Input |
| `elicitation.requested` | Yes | User Input |
| `elicitation.completed` | Yes | User Input |
| `subagent.started` | | Sub-Agent |
| `subagent.completed` | | Sub-Agent |
| `subagent.failed` | | Sub-Agent |
| `subagent.selected` | | Sub-Agent |
| `subagent.deselected` | | Sub-Agent |
| `skill.invoked` | | Skill |
| `abort` | | Control |
| `user.message` | | User |
| `system.message` | | System |
| `external_tool.requested` | Yes | External Tool |
| `external_tool.completed` | Yes | External Tool |
| `command.queued` | Yes | Command |
| `command.completed` | Yes | Command |
| `exit_plan_mode.requested` | Yes | Plan Mode |
| `exit_plan_mode.completed` | Yes | Plan Mode |
