# 15 — Langfuse LLM 可觀測性

## 觀念

Langfuse 是一個開源的 LLM 觀測平台，提供 traces、evaluations、prompt management 等功能。與第 14 課的 OpenLIT（基於 OTLP 自動收集）不同，Langfuse 透過自己的 SDK 提供更細緻的手動追蹤控制。

### 架構

```
Copilot SDK ──session.on()──→ LangfuseTracer ──Langfuse SDK──→ ┌──────────────┐
  events:                       映射事件為:                      │   Langfuse    │
  · user.message                · trace (root span + user_id)   │   Dashboard   │
  · turn_start                  · turn span（子 span）          │   :3000       │
  · assistant.usage ──┐         · generation                    └──────────────┘
  · assistant.message ┘           (合併為一個 generation)
  · tool.execution_start        · tool span
  · tool.execution_complete     · span.end()
  · session.idle                · root span.end()（trace 完成）
```

> 一個使用者問題 = 一條 trace。即使 LLM 需要多個 turn（如呼叫工具後再回覆），
> 所有 turn 都會歸在同一條 trace 下，方便在 Dashboard 分析完整呼叫鏈。

### Langfuse 核心物件

| 物件 | 說明 | 在本課的用途 |
|------|------|-------------|
| **Trace** | 一次完整互動的追蹤紀錄，由 `trace_id` 識別 | 每個 Copilot turn 對應一條 trace |
| **Span** | trace 內的一個執行區段，可巢狀 | root span（包裹整個 turn）、tool span（工具執行） |
| **Generation** | 專為 LLM 呼叫設計的 span，記錄 model / tokens / cost | 每次 LLM 回覆一個 generation |
| **Event** | 時間點事件，沒有持續時間 | 記錄錯誤 |

### Langfuse SDK 關鍵 API（v3）

| 方法 | 說明 |
|------|------|
| `Langfuse.create_trace_id()` | 產生唯一 trace ID |
| `langfuse.start_span(name, trace_context)` | 建立 span 並關聯到 trace |
| `span.update_trace(name, session_id)` | 設定 trace 層級的元資料 |
| `span.start_observation(name, as_type="generation")` | 在 span 下建立 generation |
| `span.start_span(name, input)` | 建立巢狀子 span |
| `observation.update(model, usage_details)` | 更新 observation 的欄位 |
| `observation.end()` | 結束並送出 observation |
| `langfuse.create_event(name, trace_context)` | 建立時間點事件 |
| `langfuse.flush()` | 確保所有暫存事件都已送出 |

### 事件 → Langfuse 映射

| Copilot SDK 事件 | Langfuse 物件 | 記錄內容 |
|---|---|---|
| `user.message` | `root span` + `update_trace` | 建立 trace，記錄 input、user_id、session_id |
| `assistant.turn_start` | `turn span`（子 span） | 每個 LLM 呼叫一個 turn span |
| `assistant.usage` → `assistant.message` | `generation`（合併） | 回覆內容 + model + tokens + cost |
| `tool.execution_start` | `tool span` | 工具名稱、傳入參數 |
| `tool.execution_complete` | `span.end()` | 成功/失敗、結果 |
| `session.idle` | `root span.end()` | 整條 trace 完成 |
| `session.error` | `event` | 錯誤類型、訊息 |

> **合併策略**：實際事件順序為 `usage` → `message`（與官方文件描述不同）。`usage` 先暫存 model / tokens / cost，`message` 到達時合併建立完整 generation。一次 LLM 呼叫 = Dashboard 上一個 generation。

### 實際事件順序

透過 debug 觀察，一個使用者問題的完整事件流：

```
user.message                    ← 建立 trace
├── turn_start                  ← turn-0 span
│     ├── usage                 ← 暫存 token 用量
│     ├── message               ← 合併 usage 建立 generation
│     └── turn_end              ← 結束 turn span
├── [tool.start]                ← 工具 span（若有）
├── [tool.complete]
├── [turn_start]                ← turn-1 span（若需要更多 turn）
│     ├── usage
│     ├── message
│     └── turn_end
└── session.idle                ← 結束 trace
```

### LangfuseTracer 類別設計

```python
class LangfuseTracer:
    def __init__(self, langfuse, session_id, user_id="anonymous"):
        self.root_span = None        # 整個問題的 trace（user.message 建立）
        self.trace_id = None         # 當前 trace ID
        self.turn_span = None        # 當前 turn 的子 span
        self.turn_count = 0          # turn 計數器
        self.pending_usage = None    # 暫存 usage（等 message 合併）
        self.pending_input = None    # 暫存使用者輸入
        self.tool_spans = {}         # tool_call_id → span
```

| 狀態 | 用途 |
|------|------|
| `root_span` | 每個使用者問題建立一個，作為整條 trace 的根節點 |
| `turn_span` | 每個 LLM turn 一個子 span，掛在 root_span 下 |
| `pending_usage` | `usage` 事件先到時暫存 `dict`，`message` 到達後消耗並清空 |
| `pending_input` | 暫存使用者 prompt，作為 generation 的 input |
| `tool_spans` | 追蹤進行中的工具 span，`complete` 時取出並結束 |

### 與 OpenLIT 的比較

| 面向 | OpenLIT（第 14 課） | Langfuse（本課） |
|---|---|---|
| 協定 | OTLP / OpenTelemetry | Langfuse 自有 SDK |
| 整合方式 | `TelemetryConfig` 自動收集 | 透過 session events 手動映射 |
| 應用層 | `openlit.init()` auto-instrumentation | `LangfuseTracer` 手動事件處理 |
| 控制粒度 | 自動（CLI 內部操作） | 完全自訂（選擇要追蹤的事件） |
| 額外功能 | metrics、成本分析 | evaluations、prompt management、datasets |
| 部署複雜度 | 單一 Docker 容器 | 需要 PostgreSQL + Langfuse 容器 |

### 程式碼重點

```python
from langfuse import Langfuse

langfuse = Langfuse(public_key="...", secret_key="...", host="...")

# 使用者問題 → 建立 trace（一個問題一條 trace）
trace_id = Langfuse.create_trace_id()
root = langfuse.start_span(
    name="copilot-request",
    trace_context={"trace_id": trace_id},
    input="使用者的問題",
)
root.update_trace(
    name="使用者的問題",
    session_id="my-session",
    user_id="kuan6",           # ← 關聯使用者
    input="使用者的問題",
)

# 每個 turn 一個子 span
turn = root.start_span(name="turn-0")

# LLM 呼叫（usage + message 合併為一個 generation）
gen = turn.start_observation(
    name="llm-call",
    as_type="generation",
    model="claude-sonnet-4.6",
    input="使用者的問題",
    output="回覆內容...",
    usage_details={"input": 100, "output": 50},
)
gen.end()
turn.end()

# 工具執行（與 turn 同層）
tool = root.start_span(name="tool:bash", input={"command": "ls"})
tool.update(output={"success": True})
tool.end()

root.end()
langfuse.flush()  # 程式結束前必須呼叫，確保事件送出
```

### Dashboard 可觀察的指標

- **Traces** — 每個 turn 的完整呼叫鏈（root span → generation + tool spans）
- **Generations** — 每次 LLM 呼叫的 model、回覆內容、token 用量
- **Token 用量** — input / output tokens 統計
- **成本** — 依據 model 計算的 API 費用
- **延遲** — 各 span 的執行時間
- **Sessions** — 依 `session_id` 分群，追蹤同一使用者的多次互動
- **Users** — 依 `user_id` 分群，分析不同使用者的使用行為與成本

## 前置需求

1. **Docker**（執行 Langfuse 平台）
   ```bash
   docker run -d -p 3000:3000 \
     -e DATABASE_URL=postgresql://postgres:postgres@localhost:5432/langfuse \
     -e NEXTAUTH_SECRET=mysecret \
     -e SALT=mysalt \
     langfuse/langfuse
   ```

   > 或使用 Docker Compose（推薦）：
   > ```bash
   > git clone https://github.com/langfuse/langfuse.git
   > cd langfuse
   > docker compose up -d
   > ```

2. **安裝依賴**
   ```bash
   pip install github-copilot-sdk langfuse
   ```

   > 注意：使用 Langfuse v3（`pip install "langfuse<4"`），v4 的 API 有重大變更。

3. **設定環境變數**（使用 Langfuse Cloud 時）
   ```bash
   export LANGFUSE_PUBLIC_KEY=pk-lf-...
   export LANGFUSE_SECRET_KEY=sk-lf-...
   export LANGFUSE_HOST=https://cloud.langfuse.com
   ```

## 執行

```bash
# 1. 啟動 Langfuse（如果使用 self-hosted）
docker compose up -d

# 2. 執行範例
python main.py

# 3. 開啟 Dashboard 查看結果
#    http://localhost:3000
```

> 首次使用 self-hosted Langfuse 需要在 Dashboard 註冊帳號並建立 Project，取得 API keys 後設定環境變數。
> Traces 送出後可能需要幾秒鐘才會出現在 Dashboard 上。
