# 08 — BYOK：自帶 API Key

## 觀念

BYOK（Bring Your Own Key）讓你不需要 GitHub Copilot 訂閱，直接使用自己的 API Key 連接 OpenAI、Azure OpenAI 或本地 Ollama。Copilot CLI 僅作為 agent 執行引擎。

### Provider 設定

| Provider | `type` | 說明 |
|----------|--------|------|
| OpenAI | `"openai"` | 標準 OpenAI API |
| Azure OpenAI | `"azure"` | **必須**用 `"azure"`，不能用 `"openai"` |
| Ollama（本地） | `"openai"` | 使用 OpenAI 相容 API |
| Anthropic | `"anthropic"` | Claude 系列 |

### 環境變數

```bash
# OpenAI
export OPENAI_API_KEY=sk-...

# Azure OpenAI
export AZURE_OPENAI_KEY=...
export AZURE_OPENAI_ENDPOINT=https://my-resource.openai.azure.com

# Ollama（不需 key）
# 確保 ollama 已啟動: ollama serve
```

### 重要注意

- API Key **永遠不要寫死在程式碼中**，一律從環境變數讀取
- Azure 端點只需 host，不含路徑
- `model` 在使用自訂 provider 時是**必填**的

## 前置需求

```bash
pip install github-copilot-sdk
# 設定對應的環境變數
```

## 執行

```bash
# 使用 OpenAI
OPENAI_API_KEY=sk-... python main.py

# 使用 Ollama（需先啟動 ollama serve）
python main.py
```
