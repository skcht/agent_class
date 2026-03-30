# 14 — OpenLIT LLM 可觀測性

## 觀念

Copilot SDK 內建 OpenTelemetry 支援，透過 `TelemetryConfig` 將 traces 與 metrics 送往任何 OTLP 端點。搭配 OpenLIT 平台，可以一站式收集、儲存並視覺化 LLM 呼叫的完整觀測資料。

https://github.com/github/copilot-sdk/blob/main/docs/observability/opentelemetry.md

### 架構

```
Python App ──openlit.init()──→ ┌──────────────────────┐
                                │  OpenLIT Collector    │ :4318 (OTLP)
Copilot CLI ──TelemetryConfig─→ │  OpenLIT Dashboard    │ :3000 (Web UI)
                                └──────────────────────┘
```

- **TelemetryConfig**：SDK 層遙測，捕捉 Copilot CLI 子進程的內部操作
- **openlit.init()**：應用層 auto-instrumentation，自動捕捉 Python 進程中的 LLM 呼叫

### TelemetryConfig 欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `otlp_endpoint` | `str` | OTLP HTTP 端點 URL |
| `file_path` | `str` | JSON-lines 追蹤輸出檔案路徑 |
| `exporter_type` | `str` | `"otlp-http"` 或 `"file"` |
| `source_name` | `str` | Instrumentation scope 名稱 |
| `capture_content` | `bool` | 是否擷取訊息內容（prompt / response） |

### Dashboard 可觀察的指標

- **Traces** — 每次 LLM 呼叫的完整 span 鏈
- **Token 用量** — prompt tokens / completion tokens / 總計
- **延遲** — 請求到回覆的時間
- **成本** — 依據模型定價估算的 API 費用
- **錯誤率** — 失敗請求的比例與堆疊追蹤

### 程式碼重點

```python
from copilot import CopilotClient, SubprocessConfig

client = CopilotClient(SubprocessConfig(
    telemetry={
        "otlp_endpoint": "http://127.0.0.1:4318",
        "capture_content": True,
        "source_name": "my-app",
    },
))
```

## 前置需求

1. **Docker**（執行 OpenLIT 平台）
   ```bash
   docker run -d -p 3000:3000 -p 4318:4318 openlit/openlit
   ```

2. **安裝依賴**
   ```bash
   pip install "github-copilot-sdk[telemetry]" openlit
   ```

## 執行

```bash
# 1. 啟動 OpenLIT（如果尚未啟動）
docker run -d -p 3000:3000 -p 4318:4318 openlit/openlit

# 2. 執行範例
python main.py

# 3. 開啟 Dashboard 查看結果
#    http://localhost:3000
```

> Traces 可能需要數秒後才會出現在 Dashboard 上。
