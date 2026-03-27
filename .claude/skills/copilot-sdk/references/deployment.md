# Copilot SDK Python — Deployment & Scaling Patterns

## Table of Contents
- Setup Patterns
- Session Isolation Patterns
- Horizontal & Vertical Scaling
- Container Deployments
- Authentication Methods
- Production Checklist

---

## Setup Patterns

### Local CLI (Default)

SDK auto-spawns CLI as subprocess. Zero configuration.

```python
from copilot import CopilotClient
client = CopilotClient()  # Auto-manages CLI process
```

### External CLI Server (Backend Services)

Run CLI in headless mode, connect SDK over TCP:

```bash
copilot --headless --port 4321
```

```python
client = CopilotClient({"cli_url": "localhost:4321"})
```

Multiple SDK clients can share one CLI server.

### Bundled CLI (Desktop Apps)

Ship CLI binary with your app:

```python
import os
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient(SubprocessConfig(
    cli_path=os.path.join(os.path.dirname(__file__), "vendor", "copilot")
))
```

---

## Session Isolation Patterns

### Pattern 1: CLI Per User (Strongest Isolation)

Each user gets their own CLI server. Best for multi-tenant SaaS and compliance.

```python
class CLIPool:
    def __init__(self):
        self.instances = {}
        self.next_port = 5000

    async def get_client_for_user(self, user_id, token=None):
        if user_id in self.instances:
            return self.instances[user_id]["client"]

        port = self.next_port
        self.next_port += 1

        # Spawn a dedicated CLI for this user
        await spawn_cli(port, token)

        client = CopilotClient({"cli_url": f"localhost:{port}"})
        self.instances[user_id] = {"client": client, "port": port}
        return client

    async def release_user(self, user_id):
        if user_id in self.instances:
            await self.instances[user_id]["client"].stop()
            del self.instances[user_id]
```

### Pattern 2: Shared CLI + Session Isolation

Multiple users share one CLI but have isolated sessions via unique session IDs. Lighter on resources.

```python
shared_client = CopilotClient({"cli_url": "localhost:4321"})

def get_session_id(user_id, purpose):
    return f"{user_id}-{purpose}-{int(time.time())}"

async def resume_with_auth(session_id, current_user_id):
    session_user_id = session_id.split("-")[0]
    if session_user_id != current_user_id:
        raise PermissionError("Access denied: session belongs to another user")
    return await shared_client.resume_session(
        session_id,
        on_permission_request=PermissionHandler.approve_all,
    )
```

### Pattern 3: Shared Sessions (Collaborative)

Multiple users interact with the same session. Requires application-level locking.

```python
import redis.asyncio as redis

redis_client = redis.Redis()

async def with_session_lock(session_id, fn, timeout_sec=300):
    lock_key = f"session-lock:{session_id}"
    acquired = await redis_client.set(lock_key, "locked", nx=True, ex=timeout_sec)
    if not acquired:
        raise RuntimeError("Session is in use by another user")
    try:
        return await fn()
    finally:
        await redis_client.delete(lock_key)
```

### Comparison

| | Isolated CLI Per User | Shared CLI + Session IDs | Shared Sessions |
|---|---|---|---|
| **Isolation** | Complete | Logical | Shared |
| **Resource usage** | High | Low | Low |
| **Auth flexibility** | Per-user tokens | Service token | Service token |
| **Best for** | Multi-tenant SaaS | Internal tools | Team collaboration |

---

## Horizontal & Vertical Scaling

### Multiple CLI Servers

Session state must be on shared storage so any CLI can resume any session.

**Sticky sessions** — Pin users to specific CLIs. No shared storage needed.
**Shared storage** — Any CLI handles any session. Better load distribution, requires networked `~/.copilot/session-state/`.

### Vertical Scaling

Limit concurrent active sessions per CLI:

```python
class SessionManager:
    def __init__(self, client, max_concurrent=50):
        self.client = client
        self.active = {}
        self.max_concurrent = max_concurrent

    async def get_session(self, session_id, **kwargs):
        if session_id in self.active:
            return self.active[session_id]
        if len(self.active) >= self.max_concurrent:
            await self._evict_oldest()
        session = await self.client.create_session(session_id=session_id, **kwargs)
        self.active[session_id] = session
        return session

    async def _evict_oldest(self):
        oldest_id = next(iter(self.active))
        await self.active[oldest_id].disconnect()
        del self.active[oldest_id]
```

### Ephemeral vs. Persistent Sessions

**Ephemeral** — Created per request, destroyed after use. For stateless APIs.

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
)
try:
    response = await session.send_and_wait({"prompt": prompt})
finally:
    await session.disconnect()
```

**Persistent** — Named session ID, survives restarts, resumable. For multi-turn chat.

```python
session = await client.create_session(
    on_permission_request=PermissionHandler.approve_all,
    model="gpt-4.1",
    session_id=f"user-{user_id}-{int(time.time())}",
    infinite_sessions={"enabled": True, "background_compaction_threshold": 0.80},
)
```

---

## Container Deployments

### Docker Compose

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

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: copilot-cli
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: copilot-cli
          image: ghcr.io/github/copilot-cli:latest
          args: ["--headless", "--port", "4321"]
          env:
            - name: COPILOT_GITHUB_TOKEN
              valueFrom:
                secretKeyRef:
                  name: copilot-secrets
                  key: github-token
          volumeMounts:
            - name: session-state
              mountPath: /root/.copilot/session-state
      volumes:
        - name: session-state
          persistentVolumeClaim:
            claimName: copilot-sessions-pvc
```

### Azure Container Instances

Mount persistent storage for session state:

```yaml
containers:
  - name: copilot-agent
    volumeMounts:
      - name: session-storage
        mountPath: /home/app/.copilot/session-state
volumes:
  - name: session-storage
    azureFile:
      shareName: copilot-sessions
      storageAccountName: myaccount
```

---

## Authentication Methods (Priority Order)

1. **Explicit token** — `github_token` in SubprocessConfig
2. **HMAC key** — `CAPI_HMAC_KEY` or `COPILOT_HMAC_KEY` env vars
3. **Direct API token** — `GITHUB_COPILOT_API_TOKEN` with `COPILOT_API_URL`
4. **Environment variables** — `COPILOT_GITHUB_TOKEN` → `GH_TOKEN` → `GITHUB_TOKEN`
5. **Stored OAuth** — From `copilot auth login`
6. **GitHub CLI** — `gh auth` credentials

### OAuth GitHub App (Multi-User)

```python
client = CopilotClient(SubprocessConfig(
    github_token=user_access_token,    # gho_ or ghu_ token
    use_logged_in_user=False,
))
```

**Supported:** `gho_` (OAuth), `ghu_` (GitHub App), `github_pat_` (fine-grained PAT).
**Not supported:** `ghp_` (classic PAT — deprecated).

---

## Production Checklist

| Concern | Recommendation |
|---------|---------------|
| **Session cleanup** | Periodic deletion of sessions older than TTL |
| **Health checks** | Ping CLI server, restart if unresponsive |
| **Persistent storage** | Mount `~/.copilot/session-state/` for containers |
| **Secret management** | Use Vault/K8s Secrets for tokens |
| **Session locking** | Redis or similar for shared session access |
| **Graceful shutdown** | Drain active sessions before stopping CLI |
| **Telemetry** | Configure OpenTelemetry for observability |
| **30-min idle timeout** | CLI auto-cleans inactive sessions |

---

## SDK vs CLI Feature Comparison

### Available in SDK

Session management, messaging (`send`/`send_and_wait`/`abort`), message history (`get_messages`), custom tools, tool permission handlers, MCP servers (local + HTTP), streaming, model selection, BYOK providers, custom agents, sub-agent orchestration, system message, skills, infinite sessions, steering & queueing, permission handlers, 40+ event types.

### CLI-Only Features

Session export (`--share`), slash commands, interactive UI, terminal rendering, YOLO mode, login/logout flows, `/compact`, `/usage`, `/review`, `/delegate`.

**Workarounds:**
- Session export → Collect events with `session.on()` + `session.get_messages()`
- Permission control → Use `on_permission_request` handler
- Context compaction → Use `infinite_sessions` config
- Usage tracking → Subscribe to `assistant.usage` events
