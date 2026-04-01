const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 14 課：OpenLIT LLM 可觀測性";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 14 \u8AB2";
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const TOTAL = 7;

function addFooter(s) {
  s.addText(FOOTER, { x: 4.5, y: 5.15, w: 5.2, h: 0.35, fontSize: 9, fontFace: FB, color: C.grayDim, align: "right", valign: "bottom" });
}
function addNum(s, n) {
  s.addText(`${n} / ${TOTAL}`, { x: 0.3, y: 5.15, w: 1, h: 0.35, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left", valign: "bottom" });
}

// SLIDE 1 — Title
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.yellow } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.yellow } });
  s.addText("LESSON 14", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("OpenLIT \u53EF\u89C0\u6E2C\u6027", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("LLM \u8A08\u91CF\u3001\u6210\u672C\u8FFD\u8E64\u3001\u6548\u80FD\u76E3\u63A7 \u2014 \u4E00\u7AD9\u5F0F\u5100\u8868\u677F", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "openlit.init(otlp_endpoint=...)", options: { color: C.yellow, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "CopilotClient(SubprocessConfig(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    telemetry={...}", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "))", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Architecture
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u67B6\u69CB\u6982\u89BD", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Two sources
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.5, w: 2.5, h: 1.0, fill: { color: C.bgCard }, line: { color: C.yellow, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.5, w: 2.5, h: 0.04, fill: { color: C.yellow } });
  s.addText("Python App\nopenlit.init()", { x: 0.3, y: 1.55, w: 2.5, h: 0.9, fontSize: 11, fontFace: FC, color: C.yellow, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.8, w: 2.5, h: 1.0, fill: { color: C.bgCard }, line: { color: C.green, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 2.8, w: 2.5, h: 0.04, fill: { color: C.green } });
  s.addText("Copilot CLI\nTelemetryConfig", { x: 0.3, y: 2.85, w: 2.5, h: 0.9, fontSize: 11, fontFace: FC, color: C.green, align: "center", valign: "middle" });

  // Arrows
  s.addText("\u25B6", { x: 2.8, y: 1.5, w: 0.6, h: 1.0, fontSize: 14, color: C.gray, align: "center", valign: "middle" });
  s.addText("\u25B6", { x: 2.8, y: 2.8, w: 0.6, h: 1.0, fontSize: 14, color: C.gray, align: "center", valign: "middle" });

  // Collector
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 1.8, w: 2.8, h: 1.7, fill: { color: C.bgCard }, line: { color: C.orange, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 1.8, w: 2.8, h: 0.04, fill: { color: C.orange } });
  s.addText("OpenLIT\nCollector\n:4318 (OTLP)", { x: 3.5, y: 1.85, w: 2.8, h: 1.6, fontSize: 12, fontFace: FB, color: C.orange, align: "center", valign: "middle" });

  s.addText("\u25B6", { x: 6.3, y: 1.8, w: 0.6, h: 1.7, fontSize: 14, color: C.gray, align: "center", valign: "middle" });

  // Dashboard
  s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 1.8, w: 2.5, h: 1.7, fill: { color: C.bgCard }, line: { color: C.blue, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 1.8, w: 2.5, h: 0.04, fill: { color: C.blue } });
  s.addText("OpenLIT\nDashboard\n:3000 (Web UI)", { x: 7.0, y: 1.85, w: 2.5, h: 1.6, fontSize: 12, fontFace: FB, color: C.blue, align: "center", valign: "middle" });

  // Two layers explanation
  s.addText("\u96D9\u5C64\u9060\u6E2C", { x: 0.8, y: 4.05, w: 2, h: 0.3, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 4.0, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 0.05, h: 0.5, fill: { color: C.yellow } });
  s.addText("openlit.init() \u2014 \u61C9\u7528\u5C64 auto-instrumentation", { x: 1.0, y: 4.4, w: 3.6, h: 0.5, fontSize: 11, fontFace: FB, color: C.yellow, align: "left", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.4, w: 4.0, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.4, w: 0.05, h: 0.5, fill: { color: C.green } });
  s.addText("TelemetryConfig \u2014 SDK \u5C64 CLI \u5B50\u7A0B\u5E8F\u9060\u6E2C", { x: 5.4, y: 4.4, w: 3.6, h: 0.5, fontSize: 11, fontFace: FB, color: C.green, align: "left", valign: "middle" });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — TelemetryConfig
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("TelemetryConfig \u6B04\u4F4D", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const fields = [
    { name: "otlp_endpoint", type: "str", desc: "OTLP HTTP \u7AEF\u9EDE URL", color: C.green },
    { name: "file_path", type: "str", desc: "JSON-lines \u8FFD\u8E64\u8F38\u51FA\u6A94\u6848", color: C.blue },
    { name: "exporter_type", type: "str", desc: '"otlp-http" \u6216 "file"', color: C.orange },
    { name: "source_name", type: "str", desc: "Instrumentation scope \u540D\u7A31", color: C.purple },
    { name: "capture_content", type: "bool", desc: "\u662F\u5426\u64F7\u53D6 prompt / response \u5167\u5BB9", color: C.yellow },
  ];

  fields.forEach((f, i) => {
    const fy = 1.2 + i * 0.65;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 8.4, h: 0.55, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 0.05, h: 0.55, fill: { color: f.color } });
    s.addText(f.name, { x: 1.1, y: fy, w: 2.8, h: 0.55, fontSize: 12, fontFace: FC, color: f.color, bold: true, align: "left", valign: "middle" });
    s.addText(f.type, { x: 4.0, y: fy, w: 0.8, h: 0.55, fontSize: 10, fontFace: FC, color: C.gray, align: "center", valign: "middle" });
    s.addText(f.desc, { x: 5.0, y: fy, w: 4.0, h: 0.55, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Dashboard metrics
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Dashboard \u53EF\u89C0\u5BDF\u6307\u6A19", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const metrics = [
    { name: "Traces", desc: "\u6BCF\u6B21 LLM \u547C\u53EB\u7684\u5B8C\u6574 span \u93C8", color: C.blue },
    { name: "Token \u7528\u91CF", desc: "prompt / completion / \u7E3D\u8A08 tokens", color: C.green },
    { name: "\u5EF6\u9072", desc: "\u8ACB\u6C42\u5230\u56DE\u8986\u7684\u6642\u9593", color: C.orange },
    { name: "\u6210\u672C", desc: "\u4F9D\u64DA\u6A21\u578B\u5B9A\u50F9\u4F30\u7B97\u7684 API \u8CBB\u7528", color: C.yellow },
    { name: "\u932F\u8AA4\u7387", desc: "\u5931\u6557\u8ACB\u6C42\u7684\u6BD4\u4F8B\u8207\u5806\u758A\u8FFD\u8E64", color: C.red },
  ];

  // 2+3 layout
  metrics.forEach((m, i) => {
    const col = i < 3 ? i : i - 3;
    const row = i < 3 ? 0 : 1;
    const mx = 0.5 + col * 3.1;
    const my = 1.2 + row * 1.6;
    const mw = i < 3 ? 2.8 : 4.1;

    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: my, w: 2.8, h: 1.3, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: my, w: 2.8, h: 0.04, fill: { color: m.color } });
    s.addText(m.name, { x: mx + 0.15, y: my + 0.1, w: 2.5, h: 0.4, fontSize: 16, fontFace: FB, color: m.color, bold: true, align: "left", valign: "middle" });
    s.addText(m.desc, { x: mx + 0.15, y: my + 0.55, w: 2.5, h: 0.6, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  s.addText("\u958B\u555F http://localhost:3000 \u67E5\u770B Dashboard", {
    x: 0.8, y: 4.6, w: 8.4, h: 0.4, fontSize: 13, fontFace: FB, color: C.blue, bold: true, align: "center",
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5B8C\u6574\u7BC4\u4F8B", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "import ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "openlit", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "from ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "copilot ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "import ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "CopilotClient, SubprocessConfig, PermissionHandler", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "ENDPOINT = ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"http://127.0.0.1:4318"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u2460 \u61C9\u7528\u5C64 auto-instrumentation", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "openlit.", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "init", options: { color: C.yellow, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: "(otlp_endpoint=ENDPOINT)", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u2461 SDK \u5C64\u9060\u6E2C", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "client = CopilotClient(SubprocessConfig(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    telemetry", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "={", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "otlp_endpoint": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "ENDPOINT", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "capture_content": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "True", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "source_name": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"my-app"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "))", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u7167\u5E38\u4F7F\u7528 session\uFF0Ctraces \u81EA\u52D5\u9001\u5F80 OpenLIT", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Setup
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5FEB\u901F\u8A2D\u5B9A", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const steps = [
    { num: "1", title: "\u555F\u52D5 OpenLIT (Docker)", code: "docker run -d -p 3000:3000 -p 4318:4318 openlit/openlit", color: C.blue },
    { num: "2", title: "\u5B89\u88DD\u4F9D\u8CF4", code: 'pip install "github-copilot-sdk[telemetry]" openlit', color: C.green },
    { num: "3", title: "\u57F7\u884C\u7BC4\u4F8B", code: "python main.py", color: C.orange },
    { num: "4", title: "\u958B\u555F Dashboard", code: "http://localhost:3000", color: C.purple },
  ];

  steps.forEach((st, i) => {
    const sy = 1.2 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: sy + 0.1, w: 0.45, h: 0.45, fill: { color: st.color } });
    s.addText(st.num, { x: 0.8, y: sy + 0.1, w: 0.45, h: 0.45, fontSize: 16, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
    s.addText(st.title, { x: 1.5, y: sy, w: 3.0, h: 0.35, fontSize: 14, fontFace: FB, color: st.color, bold: true, align: "left", valign: "middle" });
    s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy + 0.38, w: 7.7, h: 0.4, fill: { color: C.bgCard } });
    s.addText(st.code, { x: 1.7, y: sy + 0.38, w: 7.3, h: 0.4, fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
  });

  s.addText("Traces \u53EF\u80FD\u9700\u8981\u6578\u79D2\u5F8C\u624D\u6703\u51FA\u73FE\u5728 Dashboard \u4E0A", {
    x: 0.8, y: 4.7, w: 8.4, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.yellow, bold: true, align: "left" });
  s.addText([
    { text: "\u96D9\u5C64\u9060\u6E2C\uFF1Aopenlit + TelemetryConfig", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "OpenLIT Dashboard \u4E00\u7AD9\u5F0F\u76E3\u63A7", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Traces / Tokens / \u5EF6\u9072 / \u6210\u672C", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Docker \u4E00\u884C\u6307\u4EE4\u5373\u53EF\u555F\u52D5", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.green } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText("\u7B2C 15 \u8AB2\uFF1ALangfuse \u53EF\u89C0\u6E2C\u6027", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u53E6\u4E00\u500B\u71B1\u9580\u7684 LLM\n\u53EF\u89C0\u6E2C\u6027\u5E73\u53F0", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u770B\u4E0D\u898B\u7684 AI \u64CD\u4F5C\uFF0C\u73FE\u5728\u770B\u5F97\u898B\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.yellow, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/14_openlit_observability/slides.pptx" })
  .then(() => console.log("14_openlit_observability/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
