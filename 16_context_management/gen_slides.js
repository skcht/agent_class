const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 16 課：上下文管理 — infinite_sessions";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 16 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.blue } });
  s.addText("LESSON 16", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("\u4E0A\u4E0B\u6587\u7BA1\u7406", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("infinite_sessions \u2014 \u81EA\u52D5\u58D3\u7E2E\uFF0C\u7121\u9650\u5C0D\u8A71", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "infinite_sessions={", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "enabled": True,', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "background_compaction_threshold": 0.80,', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Why context explodes
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u4E0A\u4E0B\u6587\u6703\u7206\uFF1F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const sources = [
    { source: "\u5DE5\u5177\u8F38\u51FA", example: "bash \u5370\u51FA\u6574\u500B\u6A94\u6848", impact: "\u6578\u5343\uFF5E\u6578\u842C tokens", color: C.red },
    { source: "\u9577\u5C0D\u8A71\u6B77\u53F2", example: "\u591A\u8F2A\u554F\u7B54\u7D2F\u7A4D", impact: "\u7DDA\u6027\u589E\u9577", color: C.orange },
    { source: "\u5927\u578B system message", example: "\u585E\u5165\u6574\u4EFD\u6587\u4EF6", impact: "\u56FA\u5B9A\u6210\u672C\uFF0C\u6BCF\u6B21\u90FD\u4ED8", color: C.yellow },
    { source: "\u91CD\u8907\u8CC7\u8A0A", example: "\u6BCF\u8F2A\u91CD\u65B0\u63D0\u4F9B\u76F8\u540C\u4E0A\u4E0B\u6587", impact: "\u6D6A\u8CBB", color: C.purple },
  ];

  sources.forEach((src, i) => {
    const sy = 1.2 + i * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 8.4, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 0.06, h: 0.65, fill: { color: src.color } });
    s.addText(src.source, { x: 1.1, y: sy, w: 2.0, h: 0.65, fontSize: 13, fontFace: FB, color: src.color, bold: true, align: "left", valign: "middle" });
    s.addText(src.example, { x: 3.3, y: sy, w: 3.5, h: 0.65, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(src.impact, { x: 7.0, y: sy, w: 2.0, h: 0.65, fontSize: 11, fontFace: FB, color: C.gray, align: "right", valign: "middle" });
  });

  // Consequence
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 0.06, h: 0.5, fill: { color: C.red } });
  s.addText("\u4E0A\u4E0B\u6587\u6EFF\u4E86 \u2192 \u7A0B\u5F0F\u5931\u6557\u3001AI \u56DE\u8986\u54C1\u8CEA\u4E0B\u964D\u3001\u8CBB\u7528\u98C6\u5347", {
    x: 1.1, y: 4.5, w: 7.9, h: 0.5, fontSize: 13, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — How infinite_sessions works
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("infinite_sessions \u904B\u4F5C\u539F\u7406", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Progress bar visual
  s.addText("\u4E0A\u4E0B\u6587\u4F7F\u7528\u7387", { x: 0.8, y: 1.2, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });

  // Bar segments
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.6, w: 6.0, h: 0.5, fill: { color: C.green, transparency: 60 } }); // 0-80%
  s.addShape(pres.shapes.RECTANGLE, { x: 6.8, y: 1.6, w: 1.1, h: 0.5, fill: { color: C.yellow, transparency: 40 } }); // 80-95%
  s.addShape(pres.shapes.RECTANGLE, { x: 7.9, y: 1.6, w: 0.4, h: 0.5, fill: { color: C.red, transparency: 40 } }); // 95-100%

  s.addText("0%", { x: 0.5, y: 2.15, w: 0.6, h: 0.25, fontSize: 9, fontFace: FC, color: C.grayDim, align: "center" });
  s.addText("80%", { x: 6.55, y: 2.15, w: 0.6, h: 0.25, fontSize: 9, fontFace: FC, color: C.grayDim, align: "center" });
  s.addText("95%", { x: 7.65, y: 2.15, w: 0.6, h: 0.25, fontSize: 9, fontFace: FC, color: C.grayDim, align: "center" });
  s.addText("100%", { x: 8.0, y: 2.15, w: 0.6, h: 0.25, fontSize: 9, fontFace: FC, color: C.grayDim, align: "center" });

  s.addText("\u6B63\u5E38\u5C0D\u8A71", { x: 0.8, y: 1.6, w: 6.0, h: 0.5, fontSize: 12, fontFace: FB, color: C.white, align: "center", valign: "middle" });
  s.addText("\u80CC\u666F\u58D3\u7E2E", { x: 6.8, y: 1.6, w: 1.1, h: 0.5, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
  s.addText("\u963B\u585E", { x: 7.9, y: 1.6, w: 0.4, h: 0.5, fontSize: 9, fontFace: FB, color: C.white, align: "center", valign: "middle" });

  // Three phases
  const phases = [
    { range: "0% ~ 80%", title: "\u6B63\u5E38\u904B\u4F5C", desc: "\u4E0D\u505A\u4EFB\u4F55\u58D3\u7E2E", color: C.green },
    { range: "80% ~ 95%", title: "\u80CC\u666F\u58D3\u7E2E", desc: "\u4E0D\u5F71\u97FF\u56DE\u61C9\u901F\u5EA6\uFF0C\u81EA\u52D5\u58D3\u7E2E\u820A\u5C0D\u8A71", color: C.yellow },
    { range: "95% ~ 100%", title: "\u963B\u585E\u58D3\u7E2E", desc: "\u5FC5\u9808\u7B49\u58D3\u7E2E\u5B8C\u6210\u624D\u80FD\u7E7C\u7E8C\uFF08\u907F\u514D\u6EA2\u51FA\uFF09", color: C.red },
  ];
  phases.forEach((p, i) => {
    const py = 2.6 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 8.4, h: 0.55, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 0.06, h: 0.55, fill: { color: p.color } });
    s.addText(p.range, { x: 1.1, y: py, w: 1.8, h: 0.55, fontSize: 12, fontFace: FC, color: p.color, bold: true, align: "left", valign: "middle" });
    s.addText(p.title, { x: 3.0, y: py, w: 1.5, h: 0.55, fontSize: 12, fontFace: FB, color: C.white, bold: true, align: "left", valign: "middle" });
    s.addText(p.desc, { x: 4.8, y: py, w: 4.2, h: 0.55, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  s.addText("\u58D3\u7E2E = \u8B93 LLM \u6458\u8981\u820A\u5C0D\u8A71\uFF0C\u4FDD\u7559\u91CD\u8981\u8CC7\u8A0A\u4F46\u5927\u5E45\u6E1B\u5C11 token \u6578", {
    x: 0.8, y: 4.7, w: 8.4, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Code
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7A0B\u5F0F\u78BC\u5BE6\u4F5C", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u555F\u7528 infinite sessions", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "session = ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    model="claude-sonnet-4.6",', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    infinite_sessions", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "={", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "enabled": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "True", options: { color: C.green, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "background_compaction_threshold": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "0.80", options: { color: C.yellow, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "buffer_exhaustion_threshold": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "0.95", options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u76E3\u807D\u58D3\u7E2E\u4E8B\u4EF6", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "handle_event", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(event):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "event.type == ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "CONTEXT_COMPACTION_STARTED", options: { color: C.yellow, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        print("\u58D3\u7E2E\u958B\u59CB...")', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "elif ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "event.type == ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "CONTEXT_COMPACTION_COMPLETED", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        print("\u58D3\u7E2E\u5B8C\u6210\uFF01")', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "session.on(handle_event)", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Context management strategies
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E0A\u4E0B\u6587\u7BA1\u7406\u7B56\u7565", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const strategies = [
    { num: "1", title: "\u7CBE\u7C21 System Message", desc: "\u53EA\u653E\u95DC\u9375\u898F\u5247\uFF0C\u7D30\u7BC0\u8B93 agent \u7528\u5DE5\u5177\u67E5", color: C.blue },
    { num: "2", title: "\u5206\u6BB5\u8655\u7406\u9577\u4EFB\u52D9", desc: "\u6BCF\u500B\u5B50\u4EFB\u52D9\u7528\u7368\u7ACB session\uFF0C\u4E7E\u6DE8\u4E0A\u4E0B\u6587", color: C.green },
    { num: "3", title: "\u7528\u5DE5\u5177\u4EE3\u66FF\u5167\u5D4C\u8CC7\u6599", desc: "\u8B93 agent \u9700\u8981\u6642\u624D\u8B80\uFF0C\u4E0D\u662F\u4E00\u958B\u59CB\u5C31\u585E\u9032 prompt", color: C.orange },
    { num: "4", title: "\u8ABF\u6574 Compaction \u95BE\u503C", desc: "\u6839\u64DA\u4EFB\u52D9\u7279\u6027\u8ABF\u6574\u80CC\u666F/\u963B\u585E\u58D3\u7E2E\u6642\u6A5F", color: C.purple },
  ];

  strategies.forEach((st, i) => {
    const sy = 1.15 + i * 0.85;
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: sy + 0.12, w: 0.45, h: 0.45, fill: { color: st.color } });
    s.addText(st.num, { x: 0.8, y: sy + 0.12, w: 0.45, h: 0.45, fontSize: 16, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
    s.addText(st.title, { x: 1.5, y: sy, w: 3.0, h: 0.35, fontSize: 14, fontFace: FB, color: st.color, bold: true, align: "left", valign: "middle" });
    s.addText(st.desc, { x: 1.5, y: sy + 0.38, w: 7.5, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Threshold tuning table
  s.addText("\u95BE\u503C\u8ABF\u6574\u5EFA\u8B70", { x: 0.8, y: 4.55, w: 2, h: 0.3, fontSize: 12, fontFace: FB, color: C.white, bold: true, align: "left" });
  const tuning = [
    { scene: "\u9577\u5C0D\u8A71", val: "0.70 / 0.85", color: C.green },
    { scene: "\u77ED\u4EFB\u52D9", val: "0.90 / 0.98", color: C.blue },
    { scene: "\u5927\u91CF\u5DE5\u5177", val: "0.60 / 0.80", color: C.orange },
  ];
  tuning.forEach((t, i) => {
    const tx = 3.0 + i * 2.2;
    s.addText(`${t.scene}: `, { x: tx, y: 4.55, w: 1.0, h: 0.3, fontSize: 10, fontFace: FB, color: t.color, bold: true, align: "left", valign: "middle" });
    s.addText(t.val, { x: tx + 1.0, y: 4.55, w: 1.1, h: 0.3, fontSize: 10, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Comparison table
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E09\u7A2E\u65B9\u5F0F\u5C0D\u6BD4", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Headers
  const cols = [
    { label: "", w: 2.2, x: 0.8 },
    { label: "\u7121\u58D3\u7E2E\uFF08\u9810\u8A2D\uFF09", w: 2.5, x: 3.1, color: C.gray },
    { label: "infinite_sessions", w: 2.5, x: 5.7, color: C.green },
    { label: "\u624B\u52D5\u5206\u6BB5", w: 1.5, x: 8.3, color: C.blue },
  ];
  cols.forEach((c) => {
    s.addShape(pres.shapes.RECTANGLE, { x: c.x, y: 1.15, w: c.w, h: 0.4, fill: { color: C.bgCardLight } });
    s.addText(c.label, { x: c.x, y: 1.15, w: c.w, h: 0.4, fontSize: 11, fontFace: FC, color: c.color || C.white, bold: true, align: "center", valign: "middle" });
  });

  const rows = [
    { aspect: "\u4E0A\u4E0B\u6587\u9650\u5236", v1: "\u786C\u4E0A\u9650\uFF0C\u8D85\u904E\u5931\u6557", v2: "\u81EA\u52D5\u58D3\u7E2E\uFF0C\u7121\u9650", v3: "\u6BCF\u6BB5\u5B8C\u6574" },
    { aspect: "\u8CC7\u8A0A\u4FDD\u7559", v1: "100%\uFF08\u4F46\u7A7A\u9593\u6709\u9650\uFF09", v2: "\u58D3\u7E2E\u5F8C\u4E1F\u5931\u7D30\u7BC0", v3: "\u6BCF\u6BB5\u7368\u7ACB" },
    { aspect: "\u9069\u7528\u5834\u666F", v1: "\u77ED\u4EFB\u52D9", v2: "\u9577\u5C0D\u8A71\u3001\u63A2\u7D22", v3: "\u6279\u6B21\u3001\u6A21\u7D44\u5316" },
    { aspect: "\u5BE6\u4F5C\u6210\u672C", v1: "\u7121", v2: "\u4E00\u884C\u8A2D\u5B9A", v3: "\u9700\u8A2D\u8A08\u62C6\u5206" },
  ];

  rows.forEach((r, i) => {
    const ry = 1.6 + i * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ry, w: 2.2, h: 0.45, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.1, y: ry, w: 2.5, h: 0.45, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.7, y: ry, w: 2.5, h: 0.45, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.3, y: ry, w: 1.5, h: 0.45, fill: { color: C.bgCard } });
    s.addText(r.aspect, { x: 0.9, y: ry, w: 2.0, h: 0.45, fontSize: 10.5, fontFace: FB, color: C.grayLight, bold: true, align: "left", valign: "middle" });
    s.addText(r.v1, { x: 3.2, y: ry, w: 2.3, h: 0.45, fontSize: 10, fontFace: FB, color: C.grayLight, align: "center", valign: "middle" });
    s.addText(r.v2, { x: 5.8, y: ry, w: 2.3, h: 0.45, fontSize: 10, fontFace: FB, color: C.grayLight, align: "center", valign: "middle" });
    s.addText(r.v3, { x: 8.4, y: ry, w: 1.3, h: 0.45, fontSize: 10, fontFace: FB, color: C.grayLight, align: "center", valign: "middle" });
  });

  // Segmented code
  s.addText("\u5206\u6BB5\u8655\u7406\u7BC4\u4F8B", { x: 0.8, y: 3.9, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.25, w: 9.0, h: 0.75, fill: { color: C.bgCard } });
  s.addText([
    { text: "for ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "module ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "in ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '["auth", "api", "database"]:', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "async with ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "client.create_session(...) ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "as ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "session:", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: `session.send_and_wait(f"\u91CD\u69CB {module} \u7684\u932F\u8AA4\u8655\u7406")`, options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 4.3, w: 8.6, h: 0.65, valign: "top" });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Parameters
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u53C3\u6578\u8AAA\u660E", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const params = [
    { name: "enabled", type: "bool", default: "False", desc: "\u662F\u5426\u555F\u7528 infinite sessions", color: C.green },
    { name: "background_compaction\n_threshold", type: "float", default: "0.80", desc: "\u4E0A\u4E0B\u6587\u4F7F\u7528\u7387\u9054\u6B64\u6BD4\u4F8B\u6642\uFF0C\u80CC\u666F\u958B\u59CB\u58D3\u7E2E", color: C.yellow },
    { name: "buffer_exhaustion\n_threshold", type: "float", default: "0.95", desc: "\u4E0A\u4E0B\u6587\u4F7F\u7528\u7387\u9054\u6B64\u6BD4\u4F8B\u6642\uFF0C\u963B\u585E\u5F0F\u58D3\u7E2E", color: C.red },
  ];

  params.forEach((p, i) => {
    const py = 1.2 + i * 1.1;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 8.4, h: 0.9, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 0.06, h: 0.9, fill: { color: p.color } });
    s.addText(p.name, { x: 1.1, y: py, w: 3.5, h: 0.45, fontSize: 12, fontFace: FC, color: p.color, bold: true, align: "left", valign: "middle" });
    s.addText(`\u9810\u8A2D: ${p.default}`, { x: 7.0, y: py, w: 2.0, h: 0.45, fontSize: 11, fontFace: FC, color: C.gray, align: "right", valign: "middle" });
    s.addText(p.desc, { x: 1.1, y: py + 0.45, w: 8.0, h: 0.4, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Resume note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addText("resume_session \u6642\u4E5F\u53EF\u4EE5\u555F\u7528\u6216\u8ABF\u6574 infinite_sessions \u53C3\u6578", {
    x: 1.0, y: 4.55, w: 8.0, h: 0.5, fontSize: 12, fontFace: FB, color: C.cyan, bold: true, align: "center", valign: "middle",
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
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText([
    { text: "infinite_sessions \u81EA\u52D5\u58D3\u7E2E\u4E0A\u4E0B\u6587", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u80CC\u666F\u58D3\u7E2E (80%) vs \u963B\u585E\u58D3\u7E2E (95%)", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u56DB\u7A2E\u7BA1\u7406\u7B56\u7565\u6E1B\u5C11\u4E0A\u4E0B\u6587\u58D3\u529B", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u58D3\u7E2E\u6703\u4E1F\u5931\u7D30\u7BC0 \u2014 \u95DC\u9375\u8CC7\u8A0A\u8981\u653E\u5C0D\u5730\u65B9", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.red } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.red, bold: true, align: "left" });
  s.addText("\u7B2C 17 \u8AB2\uFF1A\u5B89\u5168\u8A2D\u5B9A", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("working_directory\n\u9650\u5236 Agent \u5B58\u53D6\u7BC4\u570D", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.red, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u80FD\u7121\u9650\u5C0D\u8A71\u4E0D\u4EE3\u8868\u4EC0\u9EBC\u90FD\u8A72\u585E\u9032\u53BB\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.blue, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/16_context_management/slides.pptx" })
  .then(() => console.log("16_context_management/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
