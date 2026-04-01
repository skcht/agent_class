const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 02 課：事件驅動訊息 — send() + session.on()";

// --- Design Tokens ---
const C = {
  bgDark: "0D1117",
  bgCard: "161B22",
  bgCardLight: "1C2333",
  blue: "58A6FF",
  green: "3FB950",
  orange: "F0883E",
  purple: "BC8CFF",
  red: "FF7B72",
  yellow: "E3B341",
  white: "FFFFFF",
  gray: "8B949E",
  grayLight: "C9D1D9",
  grayDim: "484F58",
};

const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 02 \u8AB2";
const FT = "Arial Black";
const FB = "Calibri";
const FC = "Consolas";
const TOTAL = 8;

function addFooter(slide) {
  slide.addText(FOOTER, {
    x: 4.5, y: 5.15, w: 5.2, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.grayDim,
    align: "right", valign: "bottom",
  });
}
function addPageNum(slide, n) {
  slide.addText(`${n} / ${TOTAL}`, {
    x: 0.3, y: 5.15, w: 1, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.grayDim,
    align: "left", valign: "bottom",
  });
}

// ==========================================
// SLIDE 1 — Title
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.green } });
  s.addText("LESSON 02", {
    x: 0.8, y: 1.2, w: 1.1, h: 0.45,
    fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle",
  });

  s.addText("\u4E8B\u4EF6\u9A45\u52D5\u8A0A\u606F", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addText("send() + session.on() \u2014 \u975E\u963B\u585E\u5F0F AI \u5C0D\u8A71", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  // Decorative code snippet
  s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.8, w: 4.2, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "session.send(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"..."', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "session.on(on_event)", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "# \u7A0B\u5F0F\u7E7C\u7E8C\u8DD1\uFF0C\u4E0D\u7B49 AI", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 5.7, y: 3.9, w: 3.8, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4,
    fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });

  addPageNum(s, 1);
})();

// ==========================================
// SLIDE 2 — 問題：send_and_wait 的限制
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("send_and_wait \u7684\u9650\u5236", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Problem statement
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.06, h: 0.6, fill: { color: C.red } });
  s.addText("\u7A0B\u5F0F\u9001\u51FA\u554F\u984C\u5F8C\u5B8C\u5168\u51CD\u4F4F\uFF0C\u76F4\u5230 AI \u56DE\u5B8C\u624D\u80FD\u505A\u4E0B\u4E00\u4EF6\u4E8B", {
    x: 1.1, y: 1.3, w: 7.9, h: 0.6,
    fontSize: 15, fontFace: FB, color: C.red, align: "left", valign: "middle",
  });

  // Code comparison — send_and_wait (blocked)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.15, w: 8.4, h: 1.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u274C send_and_wait \u2014 \u7A0B\u5F0F\u51CD\u4F4F", options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "response = ", options: { color: C.white, fontFace: FC, fontSize: 12 } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: 'session.send_and_wait("...")', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "# \u2190 AI \u56DE\u5B8C\u4E4B\u524D\uFF0C\u4EE5\u4E0B\u7A0B\u5F0F\u78BC\u5B8C\u5168\u4E0D\u6703\u57F7\u884C", options: { color: C.gray, fontFace: FC, fontSize: 12 } },
  ], { x: 1.0, y: 2.25, w: 8.0, h: 1.1, valign: "top" });

  // Code comparison — send (non-blocking)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.65, w: 8.4, h: 1.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u2705 send \u2014 \u9001\u51FA\u5F8C\u7ACB\u523B\u8FD4\u56DE", options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: 'session.send("...")', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "# \u2190 \u7ACB\u523B\u57F7\u884C\u5230\u9019\u88E1\uFF0CAI \u56DE\u8986\u6703\u900F\u904E\u4E8B\u4EF6\u901A\u77E5\u4F60", options: { color: C.gray, fontFace: FC, fontSize: 12 } },
  ], { x: 1.0, y: 3.75, w: 8.0, h: 1.1, valign: "top" });

  addFooter(s);
  addPageNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Sequence Diagram: send_and_wait vs send
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("\u5169\u7A2E\u6A21\u5F0F\u7684\u5DEE\u7570", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.6,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // LEFT panel — send_and_wait (bad)
  const lx = 0.5, ly = 1.1, lw = 4.3, lh = 3.8;
  s.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: lw, h: lh, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: lx, y: ly, w: lw, h: 0.05, fill: { color: C.red } });

  s.addText("send_and_wait \u2014 \u4F60\u662F\u7787\u5B50", {
    x: lx + 0.2, y: ly + 0.1, w: lw - 0.4, h: 0.35,
    fontSize: 14, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  // Timeline labels
  s.addText("\u4F60\u7684\u7A0B\u5F0F", {
    x: lx + 0.2, y: ly + 0.5, w: 1.5, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.blue, bold: true, align: "center",
  });
  s.addText("AI Agent", {
    x: lx + 2.5, y: ly + 0.5, w: 1.5, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.orange, bold: true, align: "center",
  });

  const steps_left = [
    { y: ly + 0.9, left: "send_and_wait", right: "", arrow: true },
    { y: ly + 1.25, left: "(\u51CD\u4F4F)", right: "\u8B80\u6A94\u6848", arrow: false },
    { y: ly + 1.6, left: "(\u51CD\u4F4F)", right: "\u547C\u53EB\u5DE5\u5177 A", arrow: false },
    { y: ly + 1.95, left: "(\u51CD\u4F4F)", right: "\u5DE5\u5177 B \u51FA\u932F", arrow: false },
    { y: ly + 2.55, left: "\u6700\u7D42\u56DE\u8986", right: "", arrow: true },
  ];

  steps_left.forEach((st) => {
    s.addText(st.left, {
      x: lx + 0.15, y: st.y, w: 1.6, h: 0.3,
      fontSize: 9.5, fontFace: FC, color: st.left.includes("\u51CD") ? C.grayDim : C.grayLight, align: "center", valign: "middle",
    });
    if (st.right) {
      s.addText(st.right, {
        x: lx + 2.45, y: st.y, w: 1.6, h: 0.3,
        fontSize: 9.5, fontFace: FC, color: C.grayLight, align: "center", valign: "middle",
      });
    }
    if (st.arrow) {
      s.addText("\u2192", {
        x: lx + 1.75, y: st.y, w: 0.7, h: 0.3,
        fontSize: 12, color: C.gray, align: "center", valign: "middle",
      });
    }
  });

  // Verdict
  s.addText("\u274C \u5E7E\u5206\u9418\u5F8C\u624D\u770B\u5230\u7D50\u679C", {
    x: lx + 0.2, y: ly + 3.1, w: lw - 0.4, h: 0.35,
    fontSize: 11, fontFace: FB, color: C.red, align: "center", valign: "middle",
  });

  // RIGHT panel — send + events (good)
  const rx = 5.2, ry = 1.1, rw = 4.3, rh = 3.8;
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry, w: rw, h: rh, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: rx, y: ry, w: rw, h: 0.05, fill: { color: C.green } });

  s.addText("send + \u4E8B\u4EF6 \u2014 \u638C\u63A7\u5168\u7A0B", {
    x: rx + 0.2, y: ry + 0.1, w: rw - 0.4, h: 0.35,
    fontSize: 14, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });

  s.addText("\u4F60\u7684\u7A0B\u5F0F", {
    x: rx + 0.2, y: ry + 0.5, w: 1.5, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.blue, bold: true, align: "center",
  });
  s.addText("AI Agent", {
    x: rx + 2.5, y: ry + 0.5, w: 1.5, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.orange, bold: true, align: "center",
  });

  const steps_right = [
    { y: ry + 0.9, left: "send", right: "", arrow: true },
    { y: ry + 1.25, left: "\u2190 tool.executing", right: "\u8B80\u6A94\u6848", arrow: false, leftColor: C.green },
    { y: ry + 1.6, left: "\u2190 tool.executing", right: "\u547C\u53EB\u5DE5\u5177 A", arrow: false, leftColor: C.green },
    { y: ry + 1.95, left: "\u2190 tool.executing", right: "\u5DE5\u5177 B \u51FA\u932F", arrow: false, leftColor: C.yellow },
    { y: ry + 2.3, left: "\u2190 message_delta", right: "\u7D44\u5408\u7D50\u679C", arrow: false, leftColor: C.blue },
    { y: ry + 2.65, left: "\u2190 session.idle", right: "", arrow: false, leftColor: C.purple },
  ];

  steps_right.forEach((st) => {
    s.addText(st.left, {
      x: rx + 0.15, y: st.y, w: 1.6, h: 0.3,
      fontSize: 9.5, fontFace: FC, color: st.leftColor || C.grayLight, align: "center", valign: "middle",
    });
    if (st.right) {
      s.addText(st.right, {
        x: rx + 2.45, y: st.y, w: 1.6, h: 0.3,
        fontSize: 9.5, fontFace: FC, color: C.grayLight, align: "center", valign: "middle",
      });
    }
    if (st.arrow) {
      s.addText("\u2192", {
        x: rx + 1.75, y: st.y, w: 0.7, h: 0.3,
        fontSize: 12, color: C.gray, align: "center", valign: "middle",
      });
    }
  });

  s.addText("\u2705 \u5373\u6642\u770B\u5230\u6BCF\u4E00\u6B65", {
    x: rx + 0.2, y: ry + 3.1, w: rw - 0.4, h: 0.35,
    fontSize: 11, fontFace: FB, color: C.green, align: "center", valign: "middle",
  });

  addFooter(s);
  addPageNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Comparison Table
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("\u529F\u80FD\u5C0D\u7167\u8868", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const headers = ["", "send_and_wait", "send + \u4E8B\u4EF6"];
  const rows = [
    ["\u770B\u5230\u5DE5\u5177\u547C\u53EB", "\u274C \u53EA\u62FF\u5230\u6700\u7D42\u7D50\u679C", "\u2705 \u5373\u6642\u901A\u77E5"],
    ["\u4E2D\u9014\u4ECB\u5165", "\u274C \u7A0B\u5F0F\u51CD\u4F4F", "\u2705 steering"],
    ["\u9010\u5B57\u8F38\u51FA", "\u274C", "\u2705 message_delta"],
    ["\u932F\u8AA4\u5373\u6642\u8655\u7406", "\u274C \u7B49\u5230\u6700\u5F8C\u624D\u77E5\u9053", "\u2705 \u99AC\u4E0A\u6536\u5230"],
    ["\u9032\u5EA6\u56DE\u5831", "\u274C \u53EA\u80FD\u986F\u793A\u300C\u8ACB\u7B49\u5F85\u300D", "\u2705 \u5373\u6642\u986F\u793A"],
  ];

  const colW = [2.2, 3.0, 3.0];
  const tableX = 0.9;
  const tableY = 1.35;
  const rowH = 0.55;
  const headerH = 0.5;

  // Header row
  let cx = tableX;
  headers.forEach((h, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: tableY, w: colW[i], h: headerH,
      fill: { color: C.bgCardLight },
    });
    s.addText(h, {
      x: cx, y: tableY, w: colW[i], h: headerH,
      fontSize: 13, fontFace: FC, color: i === 2 ? C.green : (i === 1 ? C.red : C.white),
      bold: true, align: "center", valign: "middle",
    });
    cx += colW[i] + 0.05;
  });

  // Data rows
  rows.forEach((row, ri) => {
    cx = tableX;
    const ry = tableY + headerH + 0.05 + ri * (rowH + 0.04);
    row.forEach((cell, ci) => {
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx, y: ry, w: colW[ci], h: rowH,
        fill: { color: C.bgCard },
      });
      const cellColor = ci === 0 ? C.grayLight : (cell.startsWith("\u274C") ? C.red : (cell.startsWith("\u2705") ? C.green : C.grayLight));
      s.addText(cell, {
        x: cx + 0.15, y: ry, w: colW[ci] - 0.3, h: rowH,
        fontSize: 12, fontFace: FB, color: cellColor,
        align: ci === 0 ? "left" : "center", valign: "middle",
      });
      cx += colW[ci] + 0.05;
    });
  });

  // Conclusion
  const concY = tableY + headerH + 0.05 + rows.length * (rowH + 0.04) + 0.2;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: concY, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: concY, w: 0.06, h: 0.5, fill: { color: C.green } });
  s.addText("send_and_wait \u9069\u5408\u4E00\u554F\u4E00\u7B54\u7684\u7C21\u55AE\u8173\u672C\u3002Agent \u958B\u767C\u4E00\u5F8B\u7528 send + \u4E8B\u4EF6\u3002", {
    x: 1.1, y: concY, w: 7.9, h: 0.5,
    fontSize: 14, fontFace: FB, color: C.grayLight, bold: true,
    align: "left", valign: "middle",
  });

  addFooter(s);
  addPageNum(s, 4);
})();

// ==========================================
// SLIDE 5 — 事件處理模式
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("\u4E8B\u4EF6\u8655\u7406\u6A21\u5F0F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Pattern: register → callback → unsubscribe
  // Step 1: Register
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 5.0, h: 0.9, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 0.06, h: 0.9, fill: { color: C.blue } });
  s.addText("\u2460 \u8A3B\u518A\u4E8B\u4EF6\u8655\u7406\u5668", {
    x: 1.1, y: 1.3, w: 2.5, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.blue, bold: true, align: "left", valign: "middle",
  });
  s.addText("unsubscribe = session.on(callback)", {
    x: 1.1, y: 1.7, w: 4.5, h: 0.4,
    fontSize: 13, fontFace: FC, color: C.grayLight, align: "left", valign: "middle",
  });

  // Step 2: Callback fires
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.4, w: 5.0, h: 0.9, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.4, w: 0.06, h: 0.9, fill: { color: C.green } });
  s.addText("\u2461 \u4E8B\u4EF6\u767C\u751F\u6642\u81EA\u52D5\u547C\u53EB", {
    x: 1.1, y: 2.4, w: 3.0, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });
  s.addText('if event.type.value == "assistant.message":', {
    x: 1.1, y: 2.8, w: 4.5, h: 0.4,
    fontSize: 13, fontFace: FC, color: C.grayLight, align: "left", valign: "middle",
  });

  // Step 3: Unsubscribe
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.5, w: 5.0, h: 0.9, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.5, w: 0.06, h: 0.9, fill: { color: C.orange } });
  s.addText("\u2462 \u7528\u5B8C\u5F8C\u53D6\u6D88\u8A02\u95B1", {
    x: 1.1, y: 3.5, w: 2.5, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "left", valign: "middle",
  });
  s.addText("unsubscribe()", {
    x: 1.1, y: 3.9, w: 4.5, h: 0.4,
    fontSize: 13, fontFace: FC, color: C.grayLight, align: "left", valign: "middle",
  });

  // Right side — event table
  s.addText("\u5E38\u7528\u4E8B\u4EF6", {
    x: 6.2, y: 1.3, w: 3.3, h: 0.35,
    fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left",
  });

  const events = [
    { name: "assistant.message", desc: "AI \u56DE\u8986\u5B8C\u6210", color: C.blue },
    { name: "session.idle", desc: "\u6240\u6709\u8655\u7406\u5B8C\u6210", color: C.green },
    { name: "assistant.message_delta", desc: "\u9010\u5B57\u8F38\u51FA", color: C.purple },
    { name: "tool.executing", desc: "\u5DE5\u5177\u57F7\u884C\u4E2D", color: C.orange },
  ];

  events.forEach((ev, i) => {
    const ey = 1.8 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: ey, w: 3.3, h: 0.55, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: ey, w: 0.05, h: 0.55, fill: { color: ev.color } });
    s.addText(ev.name, {
      x: 6.4, y: ey, w: 3.0, h: 0.28,
      fontSize: 10, fontFace: FC, color: ev.color, align: "left", valign: "bottom",
    });
    s.addText(ev.desc, {
      x: 6.4, y: ey + 0.28, w: 3.0, h: 0.22,
      fontSize: 10, fontFace: FB, color: C.gray, align: "left", valign: "top",
    });
  });

  addFooter(s);
  addPageNum(s, 5);
})();

// ==========================================
// SLIDE 6 — 程式碼實戰
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("\u7A0B\u5F0F\u78BC\u5BE6\u6230 \u2014 \u4E8B\u4EF6\u56DE\u547C\u8207\u80CC\u666F\u5DE5\u4F5C", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Code block
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 4.2, fill: { color: C.bgCard } });

  const codeLines = [
    [{ text: "done = asyncio.", color: C.white }, { text: "Event", color: C.blue }, { text: "()", color: C.white }],
    [{ text: "answer = ", color: C.white }, { text: "None", color: C.purple }],
    [],
    [{ text: "def ", color: C.purple }, { text: "on_event", color: C.blue }, { text: "(event):", color: C.white }],
    [{ text: "    event_type = event.type.value", color: C.grayLight }],
    [{ text: "    ", color: C.white }, { text: "if ", color: C.purple }, { text: 'event_type == ', color: C.white }, { text: '"assistant.message"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        answer = event.data.content", color: C.grayLight }],
    [{ text: "    ", color: C.white }, { text: "elif ", color: C.purple }, { text: 'event_type == ', color: C.white }, { text: '"session.idle"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        done.", color: C.white }, { text: "set", color: C.blue }, { text: "()", color: C.white }],
    [],
    [{ text: "unsubscribe = session.", color: C.white }, { text: "on", color: C.blue }, { text: "(on_event)", color: C.white }],
    [],
    [{ text: "# \u975E\u963B\u585E\u9001\u51FA", color: C.gray }],
    [{ text: "await ", color: C.purple }, { text: "session.", color: C.white }, { text: "send", color: C.blue }, { text: '("Name 3 Python web frameworks...")', color: C.green }],
    [],
    [{ text: "# \u7A0B\u5F0F\u6C92\u51CD\u4F4F\uFF0C\u540C\u6642\u505A\u80CC\u666F\u5DE5\u4F5C", color: C.gray }],
    [{ text: "while ", color: C.purple }, { text: "not ", color: C.purple }, { text: "done.is_set():", color: C.white }],
    [{ text: '    print("\u2699\uFE0F  \u80CC\u666F\u5DE5\u4F5C...")', color: C.grayLight }],
    [{ text: "    ", color: C.white }, { text: "await ", color: C.purple }, { text: "asyncio.sleep(0.5)", color: C.white }],
  ];

  const codeRuns = [];
  codeLines.forEach((line) => {
    if (line.length === 0) {
      codeRuns.push({ text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } });
    } else {
      line.forEach((token, j) => {
        codeRuns.push({
          text: token.text,
          options: { color: token.color, fontFace: FC, fontSize: 11, breakLine: j === line.length - 1 },
        });
      });
    }
  });

  s.addText(codeRuns, { x: 0.8, y: 1.1, w: 8.4, h: 4.0, valign: "top", margin: 0 });

  // Annotations on right
  s.addShape(pres.shapes.LINE, { x: 7.8, y: 1.4, w: 0, h: 0.8, line: { color: C.blue, width: 1.5 } });
  s.addText("\u2190 \u4E8B\u4EF6\u8655\u7406\u5668", {
    x: 7.9, y: 1.6, w: 1.5, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.blue, align: "left", valign: "middle",
  });

  s.addShape(pres.shapes.LINE, { x: 7.8, y: 3.3, w: 0, h: 0.4, line: { color: C.green, width: 1.5 } });
  s.addText("\u2190 \u975E\u963B\u585E", {
    x: 7.9, y: 3.35, w: 1.5, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.green, align: "left", valign: "middle",
  });

  s.addShape(pres.shapes.LINE, { x: 7.8, y: 4.1, w: 0, h: 0.5, line: { color: C.orange, width: 1.5 } });
  s.addText("\u2190 \u80CC\u666F\u5DE5\u4F5C", {
    x: 7.9, y: 4.2, w: 1.5, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.orange, align: "left", valign: "middle",
  });

  addFooter(s);
  addPageNum(s, 6);
})();

// ==========================================
// SLIDE 7 — 執行結果
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  s.addText("\u57F7\u884C\u7D50\u679C\u793A\u610F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Terminal output
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 8.4, h: 3.5, fill: { color: "000000" } });

  // Terminal header bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 8.4, h: 0.35, fill: { color: "2D2D2D" } });
  s.addShape(pres.shapes.OVAL, { x: 1.0, y: 1.38, w: 0.15, h: 0.15, fill: { color: C.red } });
  s.addShape(pres.shapes.OVAL, { x: 1.25, y: 1.38, w: 0.15, h: 0.15, fill: { color: C.yellow } });
  s.addShape(pres.shapes.OVAL, { x: 1.5, y: 1.38, w: 0.15, h: 0.15, fill: { color: C.green } });
  s.addText("python main.py", {
    x: 1.8, y: 1.3, w: 3, h: 0.35,
    fontSize: 10, fontFace: FC, color: C.gray, align: "left", valign: "middle",
  });

  const termLines = [
    { text: ">>> \u9001\u51FA\u554F\u984C\uFF08send \u7ACB\u523B\u8FD4\u56DE\uFF0C\u4E0D\u7B49\u56DE\u8986\uFF09", color: C.white },
    { text: "", color: C.white },
    { text: "  \u2699\uFE0F  \u80CC\u666F\u5DE5\u4F5C #1\uFF08AI \u9084\u5728\u60F3...\uFF09", color: C.yellow },
    { text: "  \u2699\uFE0F  \u80CC\u666F\u5DE5\u4F5C #2\uFF08AI \u9084\u5728\u60F3...\uFF09", color: C.yellow },
    { text: "  \u2699\uFE0F  \u80CC\u666F\u5DE5\u4F5C #3\uFF08AI \u9084\u5728\u60F3...\uFF09", color: C.yellow },
    { text: "", color: C.white },
    { text: "\uD83D\uDCAC AI \u56DE\u8986:", color: C.blue },
    { text: "Flask, Django, and FastAPI are three popular...", color: C.grayLight },
    { text: "", color: C.white },
    { text: "\uD83D\uDCCA \u7B49 AI \u7684\u671F\u9593\uFF0C\u7A0B\u5F0F\u540C\u6642\u5B8C\u6210\u4E86 3 \u6B21\u80CC\u666F\u5DE5\u4F5C", color: C.green },
    { text: "\uD83D\uDCE1 \u904E\u7A0B\u4E2D\u6536\u5230\u7684\u4E8B\u4EF6: ['assistant.message', 'session.idle']", color: C.purple },
  ];

  s.addText(termLines.map((l, i) => ({
    text: l.text || " ",
    options: { breakLine: i < termLines.length - 1, color: l.color, fontFace: FC, fontSize: 11 },
  })), {
    x: 1.0, y: 1.75, w: 8.0, h: 2.9,
    valign: "top",
  });

  // Callout
  s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.1, w: 3.5, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u2190 \u8B49\u660E\u7A0B\u5F0F\u6C92\u6709\u51CD\u4F4F", {
    x: 5.6, y: 2.1, w: 3.3, h: 0.55,
    fontSize: 11, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addPageNum(s, 7);
})();

// ==========================================
// SLIDE 8 — 總結
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
    fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });

  s.addText([
    { text: "send() \u975E\u963B\u585E\u9001\u51FA\uFF0C\u7A0B\u5F0F\u7E7C\u7E8C\u8DD1", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "session.on() \u8A3B\u518A\u4E8B\u4EF6\u56DE\u547C", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "unsubscribe() \u7528\u5B8C\u5F8C\u53D6\u6D88\u8A02\u95B1", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Agent \u958B\u767C\u4E00\u5F8B\u7528\u4E8B\u4EF6\u9A45\u52D5", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  // Right — next lesson
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.orange } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", {
    x: 6.25, y: 1.5, w: 3.0, h: 0.4,
    fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left",
  });
  s.addText("\u7B2C 03 \u8AB2\uFF1A\u5373\u6642\u4E32\u6D41\u8F38\u51FA", {
    x: 6.25, y: 2.1, w: 3.0, h: 0.35,
    fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left",
  });
  s.addText("\u5F9E\u4E8B\u4EF6\u9A45\u52D5\u9032\u5316\u5230\n\u9010 token \u5373\u6642\u986F\u793A\u7684\u9AD4\u9A57", {
    x: 6.25, y: 2.55, w: 3.0, h: 0.8,
    fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top",
  });
  s.addText("\u27A1", {
    x: 6.25, y: 3.45, w: 3.0, h: 0.4,
    fontSize: 24, color: C.orange, align: "center", valign: "middle",
  });

  // Bottom bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u7A0B\u5F0F\u4E0D\u8A72\u51CD\u4F4F\u7B49 AI \u2014 \u8B93\u4E8B\u4EF6\u544A\u8A34\u4F60\u7D50\u679C\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.green, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addPageNum(s, 8);
})();

// Generate
pres.writeFile({ fileName: "/home/sk/workl/agent_class/02_event_driven/slides.pptx" })
  .then(() => console.log("02_event_driven/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
