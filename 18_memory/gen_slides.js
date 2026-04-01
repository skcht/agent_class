const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 18 課：Agent 記憶 — Hooks + Events";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 18 \u8AB2";
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const TOTAL = 8;

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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.purple } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.purple } });
  s.addText("LESSON 18", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("Agent \u8A18\u61B6", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u8DE8 Session \u4FDD\u7559\u4E0A\u4E0B\u6587 \u2014 Hooks + Events", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u8B80\u8A18\u61B6 \u2192 system_message", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "# \u8FFD\u8E64\u5C0D\u8A71 \u2192 session.on()", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "# AI \u7E3D\u7D50 \u2192 \u5BEB\u5165 memory.json", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — The problem
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u554F\u984C\uFF1AAgent \u6BCF\u6B21\u90FD\u5931\u61B6", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Session 1
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 1.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("Session 1", { x: 0.7, y: 1.4, w: 3.9, h: 0.3, fontSize: 13, fontFace: FC, color: C.green, bold: true, align: "left" });
  s.addText([
    { text: '\u4F7F\u7528\u8005: "\u6211\u7684\u5C08\u6848\u7528 FastAPI + PostgreSQL"', options: { color: C.grayLight, fontFace: FB, fontSize: 12, breakLine: true } },
    { text: 'Agent: "\u597D\u7684\uFF0C\u6211\u8A18\u4F4F\u4E86"', options: { color: C.blue, fontFace: FB, fontSize: 12 } },
  ], { x: 0.7, y: 1.8, w: 3.9, h: 0.9, valign: "top", paraSpaceAfter: 6 });

  // Session 2
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 1.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("Session 2", { x: 5.4, y: 1.4, w: 3.9, h: 0.3, fontSize: 13, fontFace: FC, color: C.red, bold: true, align: "left" });
  s.addText([
    { text: '\u4F7F\u7528\u8005: "\u5E6B\u6211\u52A0\u4E00\u500B API endpoint"', options: { color: C.grayLight, fontFace: FB, fontSize: 12, breakLine: true } },
    { text: 'Agent: "\u4F60\u7528\u4EC0\u9EBC\u6846\u67B6\uFF1F"', options: { color: C.red, fontFace: FB, fontSize: 12, breakLine: false } },
    { text: "  \u2190 \u5B8C\u5168\u5FD8\u4E86\uFF01", options: { color: C.red, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.4, y: 1.8, w: 3.9, h: 0.9, valign: "top", paraSpaceAfter: 6 });

  // Solution
  s.addText("\u89E3\u6CD5\uFF1A\u6A94\u6848\u8A18\u61B6 + system_message + Events", { x: 0.8, y: 3.2, w: 8.4, h: 0.4, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });

  // Flow
  const flow = [
    { label: "\u5EFA\u7ACB Session\n\u8B80\u8A18\u61B6\u6A94\u6848\n\u2192 system_message", color: C.blue },
    { label: "\u5C0D\u8A71\u4E2D\nEvents \u8FFD\u8E64\nAI \u56DE\u8986", color: C.green },
    { label: "\u7D50\u675F\u524D\n\u9001\u300C\u8ACB\u7E3D\u7D50\u300D\nAI \u7522\u751F\u6458\u8981", color: C.orange },
    { label: "\u5BEB\u5165\nmemory.json\n\u4E0B\u6B21\u8B80\u53D6", color: C.purple },
  ];
  flow.forEach((f, i) => {
    const fx = 0.3 + i * 2.4;
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 3.75, w: 2.1, h: 1.0, fill: { color: C.bgCard }, line: { color: f.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 3.75, w: 2.1, h: 0.04, fill: { color: f.color } });
    s.addText(f.label, { x: fx, y: 3.8, w: 2.1, h: 0.9, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < flow.length - 1) {
      s.addText("\u25B6", { x: fx + 2.1, y: 3.75, w: 0.3, h: 1.0, fontSize: 12, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Three mechanisms
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E09\u500B\u95DC\u9375\u6A5F\u5236", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const mechanisms = [
    { num: "1", title: "\u8B80\u53D6\u8A18\u61B6\uFF1Asystem_message", desc: "\u5EFA Session \u524D\u8B80\u53D6\u8A18\u61B6\u6A94\u6848\uFF0C\u7D44\u6210 system_message \u6CE8\u5165\u3002\nAI \u5728\u6574\u500B session \u4E2D\u90FD\u80FD\u770B\u5230\u3002", color: C.blue },
    { num: "2", title: "\u8FFD\u8E64\u5C0D\u8A71\uFF1AEvents", desc: "session.on(ASSISTANT_MESSAGE) \u8FFD\u8E64\u6240\u6709 AI \u56DE\u8986\u3002\non_session_end \u62FF\u4E0D\u5230\u5C0D\u8A71\u5167\u5BB9\uFF0C\u5FC5\u9808\u7528 Events\u3002", color: C.green },
    { num: "3", title: "\u5BEB\u5165\u8A18\u61B6\uFF1AAI \u7E3D\u7D50", desc: "\u7D50\u675F\u524D\u9001\u300C\u8ACB\u7E3D\u7D50\u300D prompt\uFF0C\u8B93 AI \u81EA\u5DF1\u505A\u6458\u8981\u3002\n\u6458\u8981\u5BEB\u5165 memory.json\uFF0C\u4E0B\u6B21 session \u8B80\u53D6\u3002", color: C.orange },
  ];

  mechanisms.forEach((m, i) => {
    const my = 1.15 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: my, w: 8.4, h: 0.95, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: my, w: 0.06, h: 0.95, fill: { color: m.color } });
    s.addShape(pres.shapes.OVAL, { x: 1.1, y: my + 0.22, w: 0.45, h: 0.45, fill: { color: m.color } });
    s.addText(m.num, { x: 1.1, y: my + 0.22, w: 0.45, h: 0.45, fontSize: 16, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
    s.addText(m.title, { x: 1.8, y: my, w: 4.0, h: 0.4, fontSize: 14, fontFace: FB, color: m.color, bold: true, align: "left", valign: "middle" });
    s.addText(m.desc, { x: 1.8, y: my + 0.4, w: 7.2, h: 0.5, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  // Why not on_session_end
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 0.06, h: 0.5, fill: { color: C.yellow } });
  s.addText("on_session_end \u62FF\u4E0D\u5230\u5C0D\u8A71\u5167\u5BB9\uFF08\u53EA\u6709 reason\uFF09\uFF0C\u7E3D\u7D50\u8981\u5728\u7D50\u675F\u524D\u505A", {
    x: 1.1, y: 4.55, w: 7.9, h: 0.5, fontSize: 12, fontFace: FB, color: C.yellow, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Code: read memory
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u2460 \u8B80\u53D6\u8A18\u61B6 \u2192 system_message", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 2.8, fill: { color: C.bgCard } });
  s.addText([
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "build_memory_system_message", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "():", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    memory = load_memory()  ", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "# \u8B80 memory.json", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    summaries = memory.get("summaries", [])', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "summaries:", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        memory_text = "=== \u5148\u524D\u7684\u5C0D\u8A71\u8A18\u61B6 ===\\n"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "for ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "i, s ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "in ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "enumerate(summaries, 1):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            memory_text += f"\u7B2C {i} \u6B21\u5C0D\u8A71: {s}\\n"', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '{"content": memory_text}', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u5EFA session \u6642\u50B3\u5165", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "session = client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    system_message=", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "build_memory_system_message()", options: { color: C.blue, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: ", ...)", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 2.6, valign: "top" });

  // system_message modes
  s.addText("system_message \u4E09\u7A2E\u6A21\u5F0F", { x: 0.8, y: 4.0, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const modes = [
    { mode: '{"content": "..."}', desc: "append\uFF08\u9810\u8A2D\uFF09\u2014 \u8FFD\u52A0", color: C.green },
    { mode: '{"mode": "replace", ...}', desc: "\u5B8C\u5168\u53D6\u4EE3", color: C.red },
    { mode: '{"mode": "customize", ...}', desc: "\u9010\u5340\u6BB5\u63A7\u5236", color: C.orange },
  ];
  modes.forEach((m, i) => {
    const mx = 0.8 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 4.35, w: 2.7, h: 0.6, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 4.35, w: 0.05, h: 0.6, fill: { color: m.color } });
    s.addText(m.mode, { x: mx + 0.15, y: 4.35, w: 2.4, h: 0.3, fontSize: 9, fontFace: FC, color: m.color, align: "left", valign: "bottom" });
    s.addText(m.desc, { x: mx + 0.15, y: 4.65, w: 2.4, h: 0.25, fontSize: 9, fontFace: FB, color: C.gray, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: track + summarize
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u2461\u2462 \u8FFD\u8E64 + \u7E3D\u7D50 + \u5BEB\u5165", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u2461 Events \u8FFD\u8E64\u5C0D\u8A71", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "conversation_log = []", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "handle_event", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(event):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "event.type == ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "SessionEventType.ASSISTANT_MESSAGE", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        conversation_log.append(event.data.content)", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "session.on(handle_event)", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# ... \u591A\u8F2A\u5C0D\u8A71 ...", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u2462 \u7D50\u675F\u524D\u8ACB AI \u7E3D\u7D50", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "summary = ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "session.send_and_wait(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "\u8ACB\u7528 2-3 \u53E5\u8A71\u7E3D\u7D50\u6211\u5011\u7684\u5C0D\u8A71\u3002"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u5BEB\u5165\u8A18\u61B6\u6A94\u6848", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "memory = load_memory()", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: 'memory["summaries"].append(summary.data.content)', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "save_memory(memory)  ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "# \u2192 memory.json", options: { color: C.orange, fontFace: FC, fontSize: 11, bold: true } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Memory file format
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u8A18\u61B6\u6A94\u6848\u683C\u5F0F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText("memory.json", { x: 0.7, y: 1.25, w: 3, h: 0.3, fontSize: 12, fontFace: FC, color: C.orange, bold: true, align: "left" });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '  "summaries": [', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "\u7B2C 1 \u6B21\u5C0D\u8A71: \u8A0E\u8AD6\u4E86 FastAPI \u5C08\u6848\u67B6\u69CB\uFF0C', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '     \u6C7A\u5B9A\u7528 PostgreSQL...",', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "\u7B2C 2 \u6B21\u5C0D\u8A71: \u65B0\u589E\u4E86 /users endpoint\uFF0C', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '     \u52A0\u5165\u4E86 JWT \u8A8D\u8B49..."', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "  ],", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '  "updated_at": "2025-01-15T10:30:00"', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.6, w: 8.6, h: 2.0, valign: "top" });

  // Injection comparison
  s.addText("\u6CE8\u5165\u8A18\u61B6\u7684\u4E09\u7A2E\u65B9\u5F0F", { x: 0.8, y: 3.95, w: 4, h: 0.3, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const methods = [
    { method: "system_message", reliability: "\u6700\u9AD8", note: "\u63A8\u85A6", color: C.green },
    { method: "on_user_prompt\n\u2192 modifiedPrompt", reliability: "\u9AD8", note: "\u52D5\u614B\u8A18\u61B6", color: C.blue },
    { method: "on_session_start\n\u2192 additionalContext", reliability: "\u4E0D\u7A69\u5B9A", note: "SDK preview", color: C.red },
  ];
  methods.forEach((m, i) => {
    const mx = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 4.3, w: 2.8, h: 0.7, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: 4.3, w: 0.05, h: 0.7, fill: { color: m.color } });
    s.addText(m.method, { x: mx + 0.15, y: 4.3, w: 1.8, h: 0.7, fontSize: 10, fontFace: FC, color: m.color, align: "left", valign: "middle" });
    s.addText(`${m.reliability}\n${m.note}`, { x: mx + 1.9, y: 4.3, w: 0.8, h: 0.7, fontSize: 9, fontFace: FB, color: C.gray, align: "right", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Two demos
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5169\u500B\u7BC4\u4F8B\u60C5\u5883", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Demo 1
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("Demo 1: \u5EFA\u7ACB\u8A18\u61B6", { x: 0.7, y: 1.3, w: 3.9, h: 0.35, fontSize: 15, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "\u2460 \u591A\u8F2A\u5C0D\u8A71\uFF08FastAPI + PostgreSQL\uFF09", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2461 Events \u8FFD\u8E64\u6240\u6709 AI \u56DE\u8986", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2462 \u7D50\u675F\u524D\u8ACB AI \u7E3D\u7D50", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2463 \u6458\u8981\u5BEB\u5165 memory.json", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.75, w: 3.7, h: 1.7, valign: "top", paraSpaceAfter: 6 });
  s.addText("\u9A57\u8B49\uFF1Amemory.json \u88AB\u5EFA\u7ACB", { x: 0.7, y: 3.4, w: 3.9, h: 0.25, fontSize: 10, fontFace: FB, color: C.green, align: "left" });

  // Demo 2
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.blue } });
  s.addText("Demo 2: \u9A57\u8B49\u8A18\u61B6", { x: 5.4, y: 1.3, w: 3.9, h: 0.35, fontSize: 15, fontFace: FB, color: C.blue, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "\u2460 \u65B0 session \u8B80\u53D6 memory.json", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2461 \u6458\u8981\u6CE8\u5165 system_message", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: '\u2462 \u554F\u300C\u4E0A\u6B21\u804A\u4E86\u4EC0\u9EBC\uFF1F\u300D', options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2463 Agent \u80FD\u56DE\u7B54\uFF01", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.6, y: 1.75, w: 3.7, h: 1.7, valign: "top", paraSpaceAfter: 6 });
  s.addText("\u9A57\u8B49\uFF1AAgent \u8A18\u5F97\u4E0A\u6B21\u5167\u5BB9", { x: 5.4, y: 3.4, w: 3.9, h: 0.25, fontSize: 10, fontFace: FB, color: C.blue, align: "left" });

  // Why not on_session_end table
  s.addText("on_session_end vs \u7D50\u675F\u524D prompt", { x: 0.8, y: 3.9, w: 4, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const compare = [
    { aspect: "\u62FF\u5230\u5C0D\u8A71\u5167\u5BB9", end: "\u4E0D\u80FD", before: "\u80FD", cEnd: C.red, cBefore: C.green },
    { aspect: "\u547C\u53EB AI \u505A\u6458\u8981", end: "\u4E0D\u80FD", before: "\u80FD", cEnd: C.red, cBefore: C.green },
    { aspect: "\u5BEB\u6A94\u6848", end: "\u80FD", before: "\u80FD", cEnd: C.green, cBefore: C.green },
  ];
  compare.forEach((c, i) => {
    const cy = 4.25 + i * 0.3;
    s.addText(c.aspect, { x: 0.8, y: cy, w: 2.5, h: 0.28, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(c.end, { x: 3.5, y: cy, w: 2.0, h: 0.28, fontSize: 10, fontFace: FB, color: c.cEnd, align: "center", valign: "middle" });
    s.addText(c.before, { x: 6.0, y: cy, w: 3.0, h: 0.28, fontSize: 10, fontFace: FB, color: c.cBefore, align: "center", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 7);
})();

// SLIDE 8 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText([
    { text: "system_message \u6CE8\u5165\u8A18\u61B6\uFF08\u6700\u53EF\u9760\uFF09", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Events \u8FFD\u8E64 AI \u56DE\u8986\u5167\u5BB9", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u7D50\u675F\u524D\u8ACB AI \u7E3D\u7D50\uFF0C\u5BEB\u5165\u6A94\u6848", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "on_session_end \u4E0D\u9069\u5408\u505A\u8A18\u61B6", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.cyan } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "left" });
  s.addText("\u7B2C 19 \u8AB2\uFF1A\u7D50\u69CB\u5316\u8A18\u61B6\u58D3\u7E2E", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u7528 Compact Prompt\n\u58D3\u7E2E\u548C\u7D50\u69CB\u5316\u8A18\u61B6", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.cyan, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300CAgent \u4E0D\u8A18\u5F97\u4E0A\u6B21 \u2014 \u9664\u975E\u4F60\u8B93\u5B83\u8A18\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.purple, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/18_memory/slides.pptx" })
  .then(() => console.log("18_memory/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
