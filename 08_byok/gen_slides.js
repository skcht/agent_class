const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 08 課：BYOK — 自帶 API Key";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 08 \u8AB2";
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const TOTAL = 7;

function addFooter(s) {
  s.addText(FOOTER, { x: 4.5, y: 5.15, w: 5.2, h: 0.35, fontSize: 9, fontFace: FB, color: C.grayDim, align: "right", valign: "bottom" });
}
function addNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 0.3, y: 5.15, w: 1, h: 0.35, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left", valign: "bottom" });
}

// ==========================================
// SLIDE 1 — Title
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.orange } });
  s.addText("LESSON 08", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("BYOK\uFF1A\u81EA\u5E36 API Key", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("Bring Your Own Key \u2014 OpenAI / Azure / Ollama / Anthropic", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "provider = {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "type": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"openai"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "api_key": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "os.environ[", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"OPENAI_API_KEY"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "]", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — What is BYOK?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4EC0\u9EBC\u662F BYOK\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.7, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.06, h: 0.7, fill: { color: C.orange } });
  s.addText("\u4E0D\u9700\u8981 GitHub Copilot \u8A02\u95B1\uFF0C\u76F4\u63A5\u7528\u81EA\u5DF1\u7684 API Key \u9023\u63A5\u4EFB\u4F55\u6A21\u578B", {
    x: 1.1, y: 1.2, w: 7.9, h: 0.7,
    fontSize: 15, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  // Architecture
  const arch = [
    { label: "\u4F60\u7684 API Key\n(OpenAI/Azure/\u2026)", color: C.orange, x: 0.5 },
    { label: "Copilot SDK\n(\u57F7\u884C\u5F15\u64CE)", color: C.purple, x: 3.0 },
    { label: "\u4F60\u9078\u7684\u6A21\u578B\n(GPT-4/Llama/\u2026)", color: C.green, x: 5.5 },
    { label: "AI \u56DE\u8986", color: C.blue, x: 8.0 },
  ];
  arch.forEach((a, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: a.x, y: 2.3, w: 1.8, h: 0.9, fill: { color: C.bgCard }, line: { color: a.color, width: 2 } });
    s.addShape(pres.shapes.RECTANGLE, { x: a.x, y: 2.3, w: 1.8, h: 0.04, fill: { color: a.color } });
    s.addText(a.label, { x: a.x, y: 2.35, w: 1.8, h: 0.8, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < arch.length - 1) {
      s.addText("\u25B6", { x: a.x + 1.8, y: 2.3, w: arch[i + 1].x - a.x - 1.8, h: 0.9, fontSize: 14, color: C.gray, align: "center", valign: "middle" });
    }
  });

  // Benefits
  s.addText("\u512A\u52E2", { x: 0.8, y: 3.5, w: 2, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });
  const benefits = [
    { text: "\u7121\u9700 Copilot \u8A02\u95B1", color: C.green },
    { text: "\u81EA\u7531\u9078\u64C7\u6A21\u578B", color: C.blue },
    { text: "\u652F\u63F4\u672C\u5730 Ollama", color: C.orange },
    { text: "SDK \u5168\u529F\u80FD\u7167\u7528", color: C.purple },
  ];
  benefits.forEach((b, i) => {
    const bx = 0.8 + i * 2.2;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 3.95, w: 2.0, h: 0.45, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 3.95, w: 2.0, h: 0.04, fill: { color: b.color } });
    s.addText(b.text, { x: bx, y: 3.99, w: 2.0, h: 0.4, fontSize: 11, fontFace: FB, color: b.color, bold: true, align: "center", valign: "middle" });
  });

  // Key point
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.4, fill: { color: C.bgCard } });
  s.addText("Copilot CLI \u50C5\u4F5C\u70BA agent \u57F7\u884C\u5F15\u64CE\uFF0C\u6A21\u578B\u7531\u4F60\u7684 API Key \u6C7A\u5B9A", {
    x: 1.0, y: 4.6, w: 8.0, h: 0.4,
    fontSize: 12, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Provider types
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Provider \u985E\u578B\u4E00\u89BD", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const providers = [
    { name: "OpenAI", type: '"openai"', model: "gpt-4", url: "api.openai.com/v1", color: C.green, note: "\u6A19\u6E96 OpenAI API" },
    { name: "Azure OpenAI", type: '"azure"', model: "gpt-4", url: "my-resource.openai.azure.com", color: C.blue, note: "\u5FC5\u9808\u7528 azure\uFF0C\u4E0D\u80FD\u7528 openai" },
    { name: "Ollama", type: '"openai"', model: "llama3.2", url: "localhost:11434/v1", color: C.orange, note: "\u672C\u5730\u57F7\u884C\uFF0C\u4E0D\u9700 API Key" },
    { name: "Anthropic", type: '"anthropic"', model: "claude-*", url: "api.anthropic.com", color: C.purple, note: "Claude \u7CFB\u5217\u6A21\u578B" },
  ];

  providers.forEach((p, i) => {
    const py = 1.2 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 8.4, h: 0.75, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 0.06, h: 0.75, fill: { color: p.color } });

    s.addText(p.name, { x: 1.1, y: py, w: 1.8, h: 0.4, fontSize: 14, fontFace: FB, color: p.color, bold: true, align: "left", valign: "middle" });
    s.addText(`type: ${p.type}`, { x: 3.0, y: py, w: 1.8, h: 0.4, fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(`model: ${p.model}`, { x: 5.0, y: py, w: 1.8, h: 0.4, fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(p.note, { x: 1.1, y: py + 0.38, w: 8.0, h: 0.32, fontSize: 10, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  // Warning
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.3, fill: { color: C.bgCard } });
  s.addText("Azure \u5FC5\u9808\u7528 type: \"azure\" \u2014 \u7528 \"openai\" \u6703\u5931\u6557\uFF01", {
    x: 1.0, y: 4.85, w: 8.0, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.red, bold: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Code: Provider configs
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E09\u7A2E Provider \u8A2D\u5B9A", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // OpenAI config
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 4.3, h: 1.75, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 0.05, h: 1.75, fill: { color: C.green } });
  s.addText("OpenAI", { x: 0.7, y: 1.05, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "type": "openai",', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "base_url": "https://api.openai.com/v1",', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "api_key": os.environ["OPENAI_API_KEY"],', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 10.5 } },
  ], { x: 0.7, y: 1.35, w: 3.9, h: 1.3, valign: "top" });

  // Azure config
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 4.3, h: 1.75, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 0.05, h: 1.75, fill: { color: C.blue } });
  s.addText("Azure OpenAI", { x: 5.4, y: 1.05, w: 2.5, h: 0.3, fontSize: 13, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "type": ', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: '"azure"', options: { color: C.blue, fontFace: FC, fontSize: 10.5, bold: true, breakLine: false } },
    { text: ",", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "base_url": AZURE_ENDPOINT,', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "api_key": AZURE_KEY,', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "azure": {"api_version": "..."},', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 10.5 } },
  ], { x: 5.4, y: 1.35, w: 3.9, h: 1.3, valign: "top" });

  // Ollama config
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 4.3, h: 1.55, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 0.05, h: 1.55, fill: { color: C.orange } });
  s.addText("Ollama (\u672C\u5730)", { x: 0.7, y: 3.05, w: 2.5, h: 0.3, fontSize: 13, fontFace: FB, color: C.orange, bold: true, align: "left" });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "type": "openai",', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '  "base_url": "http://localhost:11434/v1",', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "} ", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: "# \u4E0D\u9700\u8981 api_key", options: { color: C.gray, fontFace: FC, fontSize: 10.5 } },
  ], { x: 0.7, y: 3.35, w: 3.9, h: 1.1, valign: "top" });

  // How to use
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.0, w: 4.3, h: 1.55, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.0, w: 0.05, h: 1.55, fill: { color: C.purple } });
  s.addText("\u5957\u7528\u65B9\u5F0F", { x: 5.4, y: 3.05, w: 2.5, h: 0.3, fontSize: 13, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText([
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "    model=", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: '"gpt-4"', options: { color: C.green, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "    provider=", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: "provider", options: { color: C.orange, fontFace: FC, fontSize: 10.5, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 10.5 } },
  ], { x: 5.4, y: 3.35, w: 3.9, h: 1.1, valign: "top" });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Environment variables
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u74B0\u5883\u8B8A\u6578\u8207\u5B89\u5168", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Warning
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.06, h: 0.6, fill: { color: C.red } });
  s.addText("API Key \u6C38\u9060\u4E0D\u8981\u5BEB\u6B7B\u5728\u7A0B\u5F0F\u78BC\u4E2D \u2014 \u4E00\u5F8B\u5F9E\u74B0\u5883\u8B8A\u6578\u8B80\u53D6", {
    x: 1.1, y: 1.2, w: 7.9, h: 0.6,
    fontSize: 15, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  // Env vars
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 2.1, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "# OpenAI", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "export ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "OPENAI_API_KEY", options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "=sk-...", options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "# Azure OpenAI", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "export ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "AZURE_OPENAI_KEY", options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "=...", options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "export ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "AZURE_OPENAI_ENDPOINT", options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "=https://my-resource.openai.azure.com", options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "# Ollama\uFF08\u4E0D\u9700 Key\uFF09", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "ollama serve && ollama pull llama3.2", options: { color: C.orange, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 2.2, w: 8.6, h: 2.3, valign: "top" });

  // Tips
  s.addText("\u6CE8\u610F\uFF1AAzure \u7AEF\u9EDE\u53EA\u9700 host\uFF0C\u4E0D\u542B\u8DEF\u5F91\u3002model \u5728\u4F7F\u7528\u81EA\u8A02 provider \u6642\u662F\u5FC5\u586B\u7684\u3002", {
    x: 0.8, y: 4.75, w: 8.4, h: 0.35,
    fontSize: 11, fontFace: FB, color: C.yellow, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Auto-detect pattern
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u81EA\u52D5\u5075\u6E2C\u6A21\u5F0F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 3.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "detect_provider", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "():", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    # \u512A\u5148\uFF1AOpenAI", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'os.environ.get("OPENAI_API_KEY"):', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{...openai config...}, "gpt-4"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # Azure", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'os.environ.get("AZURE_OPENAI_KEY"):', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{...azure config...}, "gpt-4"', options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # Fallback: Ollama", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{...ollama config...}, "llama3.2"', options: { color: C.orange, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "provider, model = detect_provider()", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "client.create_session(model=model, provider=provider)", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 3.3, valign: "top" });

  s.addText("\u6839\u64DA\u74B0\u5883\u8B8A\u6578\u81EA\u52D5\u9078\u64C7 provider\uFF0C\u4E00\u5957\u7A0B\u5F0F\u652F\u63F4\u591A\u7A2E\u6A21\u578B", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 6);
})();

// ==========================================
// SLIDE 7 — Summary
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left" });
  s.addText([
    { text: "provider dict \u50B3\u5165 create_session", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "OpenAI / Azure / Ollama / Anthropic", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Azure \u5FC5\u9808\u7528 type: \"azure\"", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "API Key \u5F9E\u74B0\u5883\u8B8A\u6578\u8B80\u53D6", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.green } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText("\u7B2C 09 \u8AB2\uFF1ASession \u6301\u4E45\u5316", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u65B7\u7DDA\u5F8C\u6062\u5FA9 Session\n\u4FDD\u7559\u5C0D\u8A71\u4E0A\u4E0B\u6587", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u4E00\u5957 SDK\uFF0C\u4EFB\u4F60\u9078\u64C7\u6A21\u578B \u2014 \u81EA\u7531\u5728\u4F60\u624B\u4E2D\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.orange, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/08_byok/slides.pptx" })
  .then(() => console.log("08_byok/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
