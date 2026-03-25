# 05 — 自訂工具

## 觀念

透過 `@define_tool` 裝飾器和 Pydantic `BaseModel`，你可以定義讓 AI 呼叫的自訂函式，擴充 agent 的能力。

### 定義工具的步驟

1. 用 `BaseModel` 定義參數結構（含 `Field(description=...)` 描述）
2. 用 `@define_tool(description=...)` 裝飾 async 函式
3. 函式接收 params（BaseModel 實例），回傳 `str`
4. 在 `create_session` 中傳入 `tools=[...]`

### 工具選項

| 選項 | 說明 |
|------|------|
| `skip_permission=True` | 執行時不觸發權限提示 |
| `overrides_built_in_tool=True` | 覆蓋內建工具 |

### 注意事項

- Pydantic 模型必須定義在**模組層級**（使用 `from __future__ import annotations` 時尤其重要）
- 也可用低階 `Tool` 類別定義工具（不需 Pydantic）

## 前置需求

```bash
pip install github-copilot-sdk pydantic
```

## 執行

```bash
python main.py
```
