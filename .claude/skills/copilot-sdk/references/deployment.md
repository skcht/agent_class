# Copilot SDK Python — Deployment Patterns

## Local CLI (Default)

SDK auto-spawns CLI as subprocess. Zero configuration.

```python
from copilot import CopilotClient
client = CopilotClient()  # Auto-manages CLI process
```

## External CLI Server (Backend Services)

Run CLI in headless mode, connect SDK over TCP:

```bash
copilot --headless --port 4321
```

```python
from copilot import CopilotClient, ExternalServerConfig
client = CopilotClient(ExternalServerConfig(url="localhost:4321"))
```

Multiple SDK clients can share one CLI server.

## Bundled CLI (Desktop Apps)

Ship CLI binary with your app:

```python
import os
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient(SubprocessConfig(
    cli_path=os.path.join(os.path.dirname(__file__), "vendor", "copilot")
))
```

## Docker Compose

```yaml
services:
  copilot-cli:
    image: ghcr.io/github/copilot-cli:latest
    command: ["--headless", "--port", "4321"]
    environment:
      - COPILOT_GITHUB_TOKEN=${COPILOT_GITHUB_TOKEN}
    volumes:
      - session-data:/root/.copilot/session-state
  api:
    build: .
    environment:
      - CLI_URL=copilot-cli:4321
    depends_on: [copilot-cli]
volumes:
  session-data:
```

## Session Isolation Patterns

| Pattern | Isolation | Resources | Best For |
|---------|-----------|-----------|----------|
| **CLI per user** | Complete | High | Multi-tenant SaaS, compliance |
| **Shared CLI + session IDs** | Logical | Low | Internal tools |
| **Shared sessions** | None | Low | Team collaboration (requires locking) |

## Authentication Methods (Priority Order)

1. **Explicit token** — `github_token` in SubprocessConfig
2. **HMAC key** — `CAPI_HMAC_KEY` or `COPILOT_HMAC_KEY` env vars
3. **Direct API token** — `GITHUB_COPILOT_API_TOKEN` with `COPILOT_API_URL`
4. **Environment variables** — `COPILOT_GITHUB_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN`
5. **Stored OAuth** — From `copilot auth login`
6. **GitHub CLI** — `gh auth` credentials

### OAuth GitHub App

For multi-user apps where users sign in with GitHub:

```python
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient(SubprocessConfig(
    github_token=user_access_token,    # gho_ or ghu_ token from OAuth flow
    use_logged_in_user=False,          # Don't use stored CLI credentials
))
```

**Supported token types:** `gho_` (OAuth), `ghu_` (GitHub App), `github_pat_` (fine-grained PAT).
**Not supported:** `ghp_` (classic PAT — deprecated).

## Production Checklist

- **Session cleanup:** Periodic deletion of expired sessions
- **Health checks:** Ping CLI server, restart if unresponsive
- **Persistent storage:** Mount `~/.copilot/session-state/` for containers
- **Secret management:** Use Vault/K8s Secrets for tokens
- **Session locking:** Redis or similar for shared session access
- **Graceful shutdown:** Drain active sessions before stopping CLI
- **Telemetry:** Configure OpenTelemetry for observability

## SDK vs CLI Feature Comparison

### Available in SDK

Session management, messaging (`send`/`send_and_wait`/`abort`), message history (`get_messages`), custom tools, tool permission handlers, MCP servers (local + HTTP), streaming, model selection, BYOK providers, custom agents, system message, skills, infinite sessions, permission handlers, 40+ event types.

### CLI-Only Features

Session export (`--share`), slash commands, interactive UI, terminal rendering, YOLO mode, login/logout flows, `/compact`, `/usage`, `/review`, `/delegate`.

**Workarounds:**
- Session export → Collect events with `session.on()` + `session.get_messages()`
- Permission control → Use `on_permission_request` handler
- Context compaction → Use `infinite_sessions` config
- Usage tracking → Subscribe to usage events via `session.on()`
