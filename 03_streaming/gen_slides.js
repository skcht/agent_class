const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 03 課：即時串流輸出 — 逐 token 顯示";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 03 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.cyan } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.cyan } });
  s.addText("LESSON 03", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("\u5373\u6642\u4E32\u6D41\u8F38\u51FA", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("streaming: True \u2014 \u9010 token \u5373\u6642\u986F\u793A AI \u56DE\u8986", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  // Streaming animation concept
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  const streamText = "The robot picked up a whisk and...";
  const chars = streamText.split("");
  const runs = [];
  chars.forEach((ch, i) => {
    const opacity = Math.min(1, 0.3 + (i / chars.length) * 0.7);
    const colorHex = opacity > 0.7 ? C.white : (opacity > 0.5 ? C.grayLight : C.grayDim);
    runs.push({ text: ch, options: { color: colorHex, fontFace: FC, fontSize: 12 } });
  });
  runs.push({ text: "\u2588", options: { color: C.cyan, fontFace: FC, fontSize: 12 } });
  s.addText(runs, { x: 5.4, y: 4.05, w: 4.1, h: 0.7, valign: "middle" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — Why streaming?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u9700\u8981\u4E32\u6D41\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Without streaming
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("\u7121\u4E32\u6D41 \u2014 \u7B49\u5B8C\u624D\u770B\u5230", {
    x: 0.7, y: 1.4, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  // Timeline bars
  const barY = 2.0;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: barY, w: 3.5, h: 0.35, fill: { color: C.grayDim } });
  s.addText("\u7B49\u5F85\u4E2D...", { x: 0.9, y: barY, w: 3.5, h: 0.35, fontSize: 11, fontFace: FB, color: C.gray, align: "center", valign: "middle" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: barY + 0.5, w: 3.5, h: 0.35, fill: { color: C.grayDim } });
  s.addText("\u7B49\u5F85\u4E2D...", { x: 0.9, y: barY + 0.5, w: 3.5, h: 0.35, fontSize: 11, fontFace: FB, color: C.gray, align: "center", valign: "middle" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: barY + 1.0, w: 3.5, h: 0.35, fill: { color: C.blue } });
  s.addText("\u5B8C\u6574\u56DE\u8986\u4E00\u6B21\u5230\u4F4D\uFF01", { x: 0.9, y: barY + 1.0, w: 3.5, h: 0.35, fontSize: 11, fontFace: FB, color: C.white, align: "center", valign: "middle" });
  // Time label
  s.addText("\u2190 3\u79D2 \u2192", { x: 0.9, y: barY + 1.5, w: 3.5, h: 0.25, fontSize: 10, fontFace: FB, color: C.grayDim, align: "center" });

  // With streaming
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u6709\u4E32\u6D41 \u2014 \u9010\u5B57\u51FA\u73FE", {
    x: 5.4, y: 1.4, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });

  // Progressive bars
  const colors = [C.green, C.green, C.green, C.green];
  const widths = [1.0, 2.0, 3.0, 3.5];
  const labels = ["The robot...", "The robot picked up a...", "The robot picked up a whisk and...", "\u5B8C\u6210\uFF01"];
  for (let i = 0; i < 4; i++) {
    const by = barY + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.6, y: by, w: widths[i], h: 0.3, fill: { color: colors[i], transparency: 70 - i * 15 } });
    s.addText(labels[i], { x: 5.7, y: by, w: widths[i] - 0.1, h: 0.3, fontSize: 9.5, fontFace: FC, color: C.white, align: "left", valign: "middle" });
  }
  s.addText("\u2190 \u7ACB\u523B\u958B\u59CB\u770B\u5230 \u2192", { x: 5.6, y: barY + 1.8, w: 3.5, h: 0.25, fontSize: 10, fontFace: FB, color: C.grayDim, align: "center" });

  // Bottom insight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 0.06, h: 0.6, fill: { color: C.cyan } });
  s.addText("\u4F7F\u7528\u8005\u9AD4\u9A57\u5DEE\u7570\u5DE8\u5927\uFF1A\u4E32\u6D41\u8B93\u7B2C\u4E00\u500B\u5B57\u5728 0.1 \u79D2\u5167\u51FA\u73FE\uFF0C\u800C\u4E0D\u662F\u7B49 3 \u79D2\u624D\u770B\u5230\u5168\u90E8", {
    x: 1.1, y: 4.2, w: 7.9, h: 0.6,
    fontSize: 14, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — How to enable
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5982\u4F55\u555F\u7528\u4E32\u6D41\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Big callout — just one parameter
  s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: 1.4, w: 7.0, h: 1.2, fill: { color: C.bgCard } });
  s.addText("\u53EA\u9700\u8981\u4E00\u500B\u53C3\u6578", {
    x: 1.5, y: 1.4, w: 7.0, h: 0.45,
    fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "center", valign: "middle",
  });
  s.addText("streaming=True", {
    x: 1.5, y: 1.85, w: 7.0, h: 0.6,
    fontSize: 32, fontFace: FC, color: C.green, bold: true, align: "center", valign: "middle",
  });

  // Code block
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.9, w: 8.4, h: 1.8, fill: { color: C.bgCard } });

  s.addText([
    { text: "session = ", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    model=', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"claude-sonnet-4.6"', options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    streaming=", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "True", options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",              ", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "# \u2190 \u5C31\u9019\u884C\uFF01", options: { color: C.cyan, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    on_permission_request=", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "PermissionHandler.approve_all", options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 1.0, y: 3.0, w: 8.0, h: 1.6, valign: "top" });

  // Note
  s.addText("\u5176\u4ED6\u90E8\u5206\u8207\u7B2C 02 \u8AB2\u5B8C\u5168\u76F8\u540C \u2014 \u4E00\u6A23\u7528 session.on() \u8655\u7406\u4E8B\u4EF6", {
    x: 0.8, y: 4.85, w: 8.4, h: 0.3,
    fontSize: 12, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Streaming events table
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E32\u6D41\u76F8\u95DC\u4E8B\u4EF6", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const events = [
    {
      name: "assistant.message_delta",
      desc: "\u6BCF\u7522\u751F\u4E00\u5C0F\u6BB5\u6587\u5B57\u5C31\u89F8\u767C",
      data: "event.data.delta_content",
      color: C.cyan,
      freq: "\u9AD8\u983B\u7387\uFF08\u6BCF\u500B token\uFF09",
    },
    {
      name: "assistant.reasoning_delta",
      desc: "\u6A21\u578B\u601D\u8003\u904E\u7A0B\u7684\u589E\u91CF\u7247\u6BB5",
      data: "event.data.delta_content",
      color: C.purple,
      freq: "\u90E8\u5206\u6A21\u578B\u652F\u63F4",
    },
    {
      name: "assistant.message",
      desc: "\u5B8C\u6574\u6700\u7D42\u56DE\u8986\uFF08\u7121\u8AD6\u662F\u5426\u4E32\u6D41\uFF09",
      data: "event.data.content",
      color: C.blue,
      freq: "\u6BCF\u6B21\u56DE\u8986\u7D50\u675F",
    },
  ];

  events.forEach((ev, i) => {
    const ey = 1.3 + i * 1.25;
    // Card
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 8.4, h: 1.05, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 0.06, h: 1.05, fill: { color: ev.color } });

    // Event name
    s.addText(ev.name, {
      x: 1.1, y: ey + 0.05, w: 4.0, h: 0.35,
      fontSize: 15, fontFace: FC, color: ev.color, bold: true, align: "left", valign: "middle",
    });
    // Frequency badge
    s.addText(ev.freq, {
      x: 5.5, y: ey + 0.05, w: 3.5, h: 0.35,
      fontSize: 11, fontFace: FB, color: C.gray, align: "right", valign: "middle",
    });
    // Description
    s.addText(ev.desc, {
      x: 1.1, y: ey + 0.38, w: 4.5, h: 0.3,
      fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
    });
    // Data accessor
    s.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: ey + 0.7, w: 3.8, h: 0.28, fill: { color: C.bgDark } });
    s.addText(ev.data, {
      x: 1.2, y: ey + 0.7, w: 3.6, h: 0.28,
      fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle",
    });
  });

  // Key insight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addText("delta_content \u662F\u589E\u91CF\u7247\u6BB5\uFF0Ccontent \u662F\u5B8C\u6574\u56DE\u8986 \u2014 \u5169\u8005\u90FD\u6703\u6536\u5230", {
    x: 1.0, y: 4.55, w: 8.0, h: 0.5,
    fontSize: 13, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Code walkthrough
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E8B\u4EF6\u8655\u7406\u5668 \u2014 \u6838\u5FC3\u7A0B\u5F0F\u78BC", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 4.2, fill: { color: C.bgCard } });

  const codeLines = [
    [{ text: "def ", color: C.purple }, { text: "on_event", color: C.blue }, { text: "(event):", color: C.white }],
    [{ text: "    event_type = event.type.value", color: C.grayLight }],
    [],
    [{ text: "    ", color: C.white }, { text: "if ", color: C.purple }, { text: 'event_type == ', color: C.white }, { text: '"assistant.message_delta"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        # \u9010 token \u5373\u6642\u8F38\u51FA", color: C.gray }],
    [{ text: "        ", color: C.white }, { text: "print", color: C.blue }, { text: "(event.data.delta_content ", color: C.white }, { text: "or ", color: C.purple }, { text: '""', color: C.green }, { text: ",", color: C.white }],
    [{ text: '              end="", flush=True)', color: C.white }],
    [],
    [{ text: "    ", color: C.white }, { text: "elif ", color: C.purple }, { text: 'event_type == ', color: C.white }, { text: '"assistant.reasoning_delta"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        # \u601D\u8003\u904E\u7A0B\uFF08\u90E8\u5206\u6A21\u578B\u652F\u63F4\uFF09", color: C.gray }],
    [{ text: "        ", color: C.white }, { text: "print", color: C.blue }, { text: '(f"[\u601D\u8003] {event.data.delta_content}"', color: C.white }, { text: ",", color: C.white }],
    [{ text: '              end="", flush=True)', color: C.white }],
    [],
    [{ text: "    ", color: C.white }, { text: "elif ", color: C.purple }, { text: 'event_type == ', color: C.white }, { text: '"assistant.message"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        # \u6700\u7D42\u5B8C\u6574\u56DE\u8986", color: C.gray }],
    [{ text: "        ", color: C.white }, { text: "print", color: C.blue }, { text: "(event.data.content)", color: C.white }],
  ];

  const runs = [];
  codeLines.forEach((line) => {
    if (line.length === 0) {
      runs.push({ text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } });
    } else {
      line.forEach((t, j) => {
        runs.push({ text: t.text, options: { color: t.color, fontFace: FC, fontSize: 11, breakLine: j === line.length - 1 } });
      });
    }
  });

  s.addText(runs, { x: 0.8, y: 1.1, w: 7.0, h: 4.0, valign: "top", margin: 0 });

  // Right-side annotations
  const annotations = [
    { y: 1.5, text: "\u9010\u5B57\u986F\u793A", color: C.cyan },
    { y: 2.8, text: "\u601D\u8003\u904E\u7A0B", color: C.purple },
    { y: 4.0, text: "\u5B8C\u6574\u56DE\u8986", color: C.blue },
  ];
  annotations.forEach((a) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 8.0, y: a.y, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
    s.addText(a.text, { x: 8.0, y: a.y, w: 1.5, h: 0.4, fontSize: 11, fontFace: FB, color: a.color, bold: true, align: "center", valign: "middle" });
  });

  // Key: print technique
  s.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 1.95, w: 2.2, h: 0.55, fill: { color: C.bgDark } });
  s.addText([
    { text: 'end=""', options: { color: C.orange, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "flush=True", options: { color: C.orange, fontFace: FC, fontSize: 10 } },
  ], { x: 7.6, y: 1.95, w: 2.0, h: 0.55, valign: "middle", align: "center" });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Streaming experience
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E32\u6D41\u9AD4\u9A57\u793A\u610F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Terminal window
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 3.6, fill: { color: "000000" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.35, fill: { color: "2D2D2D" } });
  s.addShape(pres.shapes.OVAL, { x: 1.0, y: 1.28, w: 0.15, h: 0.15, fill: { color: C.red } });
  s.addShape(pres.shapes.OVAL, { x: 1.25, y: 1.28, w: 0.15, h: 0.15, fill: { color: C.yellow } });
  s.addShape(pres.shapes.OVAL, { x: 1.5, y: 1.28, w: 0.15, h: 0.15, fill: { color: C.green } });
  s.addText("python main.py", { x: 1.8, y: 1.2, w: 3, h: 0.35, fontSize: 10, fontFace: FC, color: C.gray, align: "left", valign: "middle" });

  // Simulated streaming output
  const termLines = [
    { text: ">>> \u4E32\u6D41\u8F38\u51FA\u4E2D...", color: C.white },
    { text: "", color: C.white },
    { text: "The", color: C.cyan },
    { text: "The robot", color: C.cyan },
    { text: "The robot picked up", color: C.cyan },
    { text: "The robot picked up a whisk", color: C.cyan },
    { text: "The robot picked up a whisk and began", color: C.cyan },
    { text: "The robot picked up a whisk and began to stir...", color: C.grayLight },
    { text: "", color: C.white },
    { text: "--- \u5B8C\u6574\u56DE\u8986 ---", color: C.gray },
    { text: "The robot picked up a whisk and began to stir the", color: C.grayLight },
    { text: "batter with surprising precision...", color: C.grayLight },
  ];

  s.addText(termLines.map((l, i) => ({
    text: l.text || " ",
    options: { breakLine: i < termLines.length - 1, color: l.color, fontFace: FC, fontSize: 10.5 },
  })), { x: 1.0, y: 1.65, w: 7.8, h: 3.0, valign: "top" });

  // Time annotations on right
  s.addText("0.1s", { x: 8.0, y: 2.1, w: 0.8, h: 0.25, fontSize: 9, fontFace: FC, color: C.green, align: "center" });
  s.addText("0.3s", { x: 8.0, y: 2.35, w: 0.8, h: 0.25, fontSize: 9, fontFace: FC, color: C.green, align: "center" });
  s.addText("0.5s", { x: 8.0, y: 2.6, w: 0.8, h: 0.25, fontSize: 9, fontFace: FC, color: C.green, align: "center" });
  s.addText("0.8s", { x: 8.0, y: 2.85, w: 0.8, h: 0.25, fontSize: 9, fontFace: FC, color: C.yellow, align: "center" });
  s.addText("1.2s", { x: 8.0, y: 3.1, w: 0.8, h: 0.25, fontSize: 9, fontFace: FC, color: C.yellow, align: "center" });

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

  // Left — summary
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", {
    x: 1.05, y: 1.45, w: 4.3, h: 0.4,
    fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "left",
  });
  s.addText([
    { text: "streaming=True \u555F\u7528\u4E32\u6D41\u6A21\u5F0F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "message_delta \u63D0\u4F9B\u9010 token \u589E\u91CF", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "reasoning_delta \u986F\u793A\u601D\u8003\u904E\u7A0B", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: 'print(end="", flush=True) \u5373\u6642\u986F\u793A', options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u4F7F\u7528\u8005\u7684\u7B2C\u4E00\u500B\u5B57 0.1 \u79D2\u5167\u51FA\u73FE", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  // Right — next lesson
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.orange } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", {
    x: 6.25, y: 1.5, w: 3.0, h: 0.4,
    fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left",
  });
  s.addText("\u7B2C 04 \u8AB2\uFF1A\u81EA\u8A02\u6B0A\u9650\u8655\u7406\u5668", {
    x: 6.25, y: 2.1, w: 3.0, h: 0.35,
    fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left",
  });
  s.addText("\u5F9E approve_all \u9032\u5316\u5230\n\u9078\u64C7\u6027\u5141\u8A31/\u62D2\u7D55\u64CD\u4F5C", {
    x: 6.25, y: 2.55, w: 3.0, h: 0.8,
    fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top",
  });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.orange, align: "center", valign: "middle" });

  // Bottom
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u7B2C\u4E00\u500B\u5B57\u5728 0.1 \u79D2\u5167\u51FA\u73FE \u2014 \u9019\u5C31\u662F\u4E32\u6D41\u7684\u9B54\u529B\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.cyan, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/03_streaming/slides.pptx" })
  .then(() => console.log("03_streaming/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
