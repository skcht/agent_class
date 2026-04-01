const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 04 課：自訂權限處理器 — 選擇性允許/拒絕";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 04 \u8AB2";
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const TOTAL = 8;

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
  s.addText("LESSON 04", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("\u81EA\u8A02\u6B0A\u9650\u8655\u7406\u5668", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("\u9078\u64C7\u6027\u5141\u8A31/\u62D2\u7D55 \u2014 \u5F9E approve_all \u9032\u5316\u5230\u7D30\u7C92\u5EA6\u63A7\u7BA1", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  // Shield icon concept
  s.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.8, w: 4.2, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'kind == "read"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":  ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "approved", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'kind == "shell"', options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ": ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "denied", options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'kind == "write"', options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ": ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "denied", options: { color: C.red, fontFace: FC, fontSize: 11 } },
  ], { x: 5.7, y: 3.9, w: 3.8, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — Why not approve_all?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u4E0D\u80FD\u4E00\u76F4\u7528 approve_all\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Left — approve_all risks
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("PermissionHandler.approve_all", {
    x: 0.7, y: 1.4, w: 3.9, h: 0.4,
    fontSize: 13, fontFace: FC, color: C.red, bold: true, align: "left", valign: "middle",
  });
  s.addText("\u2014 \u6559\u5B78\u548C\u6E2C\u8A66\u7528", {
    x: 0.7, y: 1.8, w: 3.9, h: 0.3,
    fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });

  const risks = [
    "AI \u53EF\u4EE5\u57F7\u884C\u4EFB\u4F55 shell \u6307\u4EE4",
    "AI \u53EF\u4EE5\u5BEB\u5165/\u522A\u9664\u4EFB\u4F55\u6A94\u6848",
    "AI \u53EF\u4EE5\u5B58\u53D6\u4EFB\u4F55 URL",
    "\u96F6\u5B89\u5168\u63A7\u5236 = \u96F6\u4FE1\u4EFB",
  ];
  risks.forEach((r, i) => {
    s.addText(`\u26A0\uFE0F  ${r}`, {
      x: 0.9, y: 2.2 + i * 0.45, w: 3.7, h: 0.4,
      fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
    });
  });

  // Right — custom handler
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u81EA\u8A02\u6B0A\u9650\u8655\u7406\u5668", {
    x: 5.4, y: 1.4, w: 3.9, h: 0.4,
    fontSize: 15, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });
  s.addText("\u2014 \u6B63\u5F0F\u74B0\u5883\u5FC5\u7528", {
    x: 5.4, y: 1.8, w: 3.9, h: 0.3,
    fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });

  const benefits = [
    "\u8B80\u53D6 \u2192 \u5141\u8A31",
    "\u5BEB\u5165 \u2192 \u62D2\u7D55\u6216\u5BE9\u6838",
    "Shell \u2192 \u62D2\u7D55\u6216\u767D\u540D\u55AE",
    "\u7D30\u7C92\u5EA6\u63A7\u5236 = \u5B89\u5168\u7B2C\u4E00",
  ];
  const bColors = [C.green, C.orange, C.red, C.blue];
  benefits.forEach((b, i) => {
    s.addText(b, {
      x: 5.6, y: 2.2 + i * 0.45, w: 3.7, h: 0.4,
      fontSize: 12, fontFace: FB, color: bColors[i], align: "left", valign: "middle",
    });
  });

  // Bottom
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.7, w: 8.4, h: 0.4, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.7, w: 0.06, h: 0.4, fill: { color: C.orange } });
  s.addText("on_permission_request \u662F\u6BCF\u500B session \u7684\u5FC5\u586B\u53C3\u6578 \u2014 \u6C92\u6709\u9810\u8A2D\u503C", {
    x: 1.1, y: 4.7, w: 7.9, h: 0.4,
    fontSize: 13, fontFace: FB, color: C.grayLight, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Permission request types
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u6B0A\u9650\u8ACB\u6C42\u985E\u578B", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addText("request.kind.value", {
    x: 0.8, y: 1.0, w: 4, h: 0.3,
    fontSize: 13, fontFace: FC, color: C.blue, align: "left",
  });

  const types = [
    { kind: '"shell"', desc: "\u57F7\u884C shell \u6307\u4EE4", risk: "\u9AD8", color: C.red },
    { kind: '"write"', desc: "\u5BEB\u5165\u6A94\u6848", risk: "\u9AD8", color: C.red },
    { kind: '"read"', desc: "\u8B80\u53D6\u6A94\u6848", risk: "\u4F4E", color: C.green },
    { kind: '"mcp"', desc: "\u547C\u53EB MCP \u5DE5\u5177", risk: "\u4E2D", color: C.yellow },
    { kind: '"custom-tool"', desc: "\u547C\u53EB\u81EA\u8A02\u5DE5\u5177", risk: "\u4E2D", color: C.yellow },
    { kind: '"url"', desc: "\u5B58\u53D6 URL", risk: "\u4E2D", color: C.yellow },
    { kind: '"memory"', desc: "\u5B58\u53D6\u8A18\u61B6\u9AD4", risk: "\u4F4E", color: C.green },
    { kind: '"hook"', desc: "\u57F7\u884C hook", risk: "\u4F4E", color: C.green },
  ];

  // 2-column layout: 4 items each
  types.forEach((t, i) => {
    const col = i < 4 ? 0 : 1;
    const row = i % 4;
    const bx = 0.8 + col * 4.5;
    const by = 1.45 + row * 0.8;

    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: by, w: 4.1, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: by, w: 0.05, h: 0.65, fill: { color: t.color } });

    s.addText(t.kind, {
      x: bx + 0.2, y: by + 0.02, w: 2.2, h: 0.32,
      fontSize: 12, fontFace: FC, color: t.color, bold: true, align: "left", valign: "middle",
    });
    s.addText(`\u98A8\u96AA: ${t.risk}`, {
      x: bx + 2.8, y: by + 0.02, w: 1.1, h: 0.32,
      fontSize: 10, fontFace: FB, color: t.color, align: "right", valign: "middle",
    });
    s.addText(t.desc, {
      x: bx + 0.2, y: by + 0.32, w: 3.7, h: 0.28,
      fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
    });
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Return values
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u56DE\u50B3\u503C \u2014 \u4E09\u7A2E\u6C7A\u5B9A", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addText("PermissionRequestResult(kind=...)", {
    x: 0.8, y: 1.0, w: 6, h: 0.3,
    fontSize: 13, fontFace: FC, color: C.blue, align: "left",
  });

  const results = [
    {
      kind: '"approved"',
      meaning: "\u5141\u8A31\u57F7\u884C",
      desc: "AI \u53EF\u4EE5\u57F7\u884C\u8A72\u64CD\u4F5C",
      color: C.green,
      example: "\u8B80\u53D6\u6A94\u6848\u3001\u5B89\u5168\u7684\u5DE5\u5177\u547C\u53EB",
    },
    {
      kind: '"denied-interactively-by-user"',
      meaning: "\u4F7F\u7528\u8005\u660E\u78BA\u62D2\u7D55",
      desc: "AI \u6703\u5617\u8A66\u5176\u4ED6\u65B9\u6CD5\u6216\u544A\u77E5\u7121\u6CD5\u57F7\u884C",
      color: C.orange,
      example: "\u4F7F\u7528\u8005\u4E0D\u5141\u8A31\u7684\u6A94\u6848\u5BEB\u5165",
    },
    {
      kind: '"denied-by-rules"',
      meaning: "\u88AB\u898F\u5247\u62D2\u7D55",
      desc: "AI \u6703\u77E5\u9053\u9019\u662F\u7CFB\u7D71\u9650\u5236\uFF0C\u4E0D\u6703\u91CD\u8A66",
      color: C.red,
      example: "\u5B89\u5168\u653F\u7B56\u7981\u6B62\u7684 shell \u6307\u4EE4",
    },
  ];

  results.forEach((r, i) => {
    const ry = 1.5 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ry, w: 8.4, h: 1.0, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ry, w: 0.06, h: 1.0, fill: { color: r.color } });

    s.addText(r.kind, {
      x: 1.1, y: ry + 0.05, w: 5.0, h: 0.3,
      fontSize: 13, fontFace: FC, color: r.color, bold: true, align: "left", valign: "middle",
    });
    s.addText(r.meaning, {
      x: 6.5, y: ry + 0.05, w: 2.5, h: 0.3,
      fontSize: 13, fontFace: FB, color: r.color, bold: true, align: "right", valign: "middle",
    });
    s.addText(r.desc, {
      x: 1.1, y: ry + 0.38, w: 8.0, h: 0.28,
      fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
    });
    s.addText(`\u4F8B\uFF1A${r.example}`, {
      x: 1.1, y: ry + 0.68, w: 8.0, h: 0.25,
      fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle",
    });
  });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Flow diagram
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u6B0A\u9650\u8655\u7406\u6D41\u7A0B", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Flow: AI wants to act → permission request → handler → approve/deny → result
  const flowY = 1.8;
  const boxes = [
    { label: "AI \u8981\u57F7\u884C\n\u5DE5\u5177", x: 0.5, color: C.blue },
    { label: "\u6B0A\u9650\u8ACB\u6C42\n\u9001\u51FA", x: 2.4, color: C.purple },
    { label: "\u4F60\u7684\n\u8655\u7406\u5668", x: 4.3, color: C.orange },
  ];

  boxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: flowY, w: 1.6, h: 1.0, fill: { color: C.bgCard }, line: { color: b.color, width: 2 } });
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: flowY, w: 1.6, h: 0.05, fill: { color: b.color } });
    s.addText(b.label, { x: b.x, y: flowY + 0.1, w: 1.6, h: 0.85, fontSize: 12, fontFace: FB, color: C.white, bold: true, align: "center", valign: "middle" });
  });

  // Arrows
  s.addText("\u25B6", { x: 2.1, y: flowY, w: 0.3, h: 1.0, fontSize: 16, color: C.gray, align: "center", valign: "middle" });
  s.addText("\u25B6", { x: 4.0, y: flowY, w: 0.3, h: 1.0, fontSize: 16, color: C.gray, align: "center", valign: "middle" });

  // Branch: approve / deny
  // Approve path
  s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 1.4, w: 2.5, h: 0.8, fill: { color: C.bgCard }, line: { color: C.green, width: 2 } });
  s.addText('approved\n\u2192 AI \u57F7\u884C\u64CD\u4F5C', { x: 6.5, y: 1.4, w: 2.5, h: 0.8, fontSize: 12, fontFace: FB, color: C.green, bold: true, align: "center", valign: "middle" });

  // Deny path
  s.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 2.5, w: 2.5, h: 0.8, fill: { color: C.bgCard }, line: { color: C.red, width: 2 } });
  s.addText('denied\n\u2192 AI \u5617\u8A66\u5176\u4ED6\u65B9\u6CD5', { x: 6.5, y: 2.5, w: 2.5, h: 0.8, fontSize: 12, fontFace: FB, color: C.red, bold: true, align: "center", valign: "middle" });

  // Arrows from handler to approve/deny
  s.addText("\u2197", { x: 5.9, y: 1.5, w: 0.6, h: 0.6, fontSize: 20, color: C.green, align: "center", valign: "middle" });
  s.addText("\u2198", { x: 5.9, y: 2.4, w: 0.6, h: 0.6, fontSize: 20, color: C.red, align: "center", valign: "middle" });

  // Example scenario
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.6, w: 8.4, h: 1.3, fill: { color: C.bgCard } });
  s.addText("\u5BE6\u969B\u60C5\u5883", {
    x: 1.0, y: 3.65, w: 2, h: 0.35,
    fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "left", valign: "middle",
  });
  s.addText([
    { text: 'AI: "\u6211\u8981\u5EFA\u7ACB test.txt"', options: { color: C.grayLight, fontFace: FB, fontSize: 12, breakLine: true } },
    { text: '\u8655\u7406\u5668: kind="write" \u2192 ', options: { color: C.grayLight, fontFace: FB, fontSize: 12, breakLine: false } },
    { text: "denied", options: { color: C.red, fontFace: FC, fontSize: 12, bold: true, breakLine: true } },
    { text: 'AI: "\u62B1\u6B49\uFF0C\u6211\u7121\u6CD5\u5EFA\u7ACB\u6A94\u6848\uFF0C\u6B0A\u9650\u4E0D\u8DB3\u3002"', options: { color: C.gray, fontFace: FB, fontSize: 12 } },
  ], { x: 1.0, y: 4.0, w: 8.0, h: 0.8, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Code: permission handler
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7A0B\u5F0F\u78BC \u2014 \u81EA\u8A02\u8655\u7406\u5668", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 4.2, fill: { color: C.bgCard } });

  const codeLines = [
    [{ text: "def ", color: C.purple }, { text: "on_permission_request", color: C.blue }, { text: "(request, invocation):", color: C.white }],
    [{ text: "    kind = request.kind.value", color: C.grayLight }],
    [],
    [{ text: "    ", color: C.white }, { text: "if ", color: C.purple }, { text: "kind == ", color: C.white }, { text: '"read"', color: C.green }, { text: ":", color: C.white }],
    [{ text: "        ", color: C.white }, { text: "return ", color: C.purple }, { text: "PermissionRequestResult(", color: C.white }],
    [{ text: '            kind=', color: C.white }, { text: '"approved"', color: C.green }, { text: ")", color: C.white }],
    [],
    [{ text: "    ", color: C.white }, { text: "if ", color: C.purple }, { text: "kind == ", color: C.white }, { text: '"shell"', color: C.red }, { text: ":", color: C.white }],
    [{ text: "        ", color: C.white }, { text: "return ", color: C.purple }, { text: "PermissionRequestResult(", color: C.white }],
    [{ text: '            kind=', color: C.white }, { text: '"denied-interactively-by-user"', color: C.red }, { text: ")", color: C.white }],
    [],
    [{ text: "    ", color: C.white }, { text: "if ", color: C.purple }, { text: "kind == ", color: C.white }, { text: '"write"', color: C.red }, { text: ":", color: C.white }],
    [{ text: "        ", color: C.white }, { text: "return ", color: C.purple }, { text: "PermissionRequestResult(", color: C.white }],
    [{ text: '            kind=', color: C.white }, { text: '"denied-interactively-by-user"', color: C.red }, { text: ")", color: C.white }],
    [],
    [{ text: "    # \u5176\u4ED6\u985E\u578B\u9810\u8A2D\u5141\u8A31", color: C.gray }],
    [{ text: "    ", color: C.white }, { text: "return ", color: C.purple }, { text: "PermissionRequestResult(", color: C.white }, { text: 'kind=', color: C.white }, { text: '"approved"', color: C.green }, { text: ")", color: C.white }],
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

  s.addText(runs, { x: 0.8, y: 1.1, w: 7.5, h: 4.0, valign: "top", margin: 0 });

  // Right annotations
  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.6, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 \u5141\u8A31\u8B80\u53D6", { x: 7.8, y: 1.6, w: 1.5, h: 0.4, fontSize: 10, fontFace: FB, color: C.green, bold: true, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 2.6, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 \u62D2\u7D55 shell", { x: 7.8, y: 2.6, w: 1.5, h: 0.4, fontSize: 10, fontFace: FB, color: C.red, bold: true, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 3.55, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 \u62D2\u7D55\u5BEB\u5165", { x: 7.8, y: 3.55, w: 1.5, h: 0.4, fontSize: 10, fontFace: FB, color: C.red, bold: true, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 4.55, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 \u9810\u8A2D\u5141\u8A31", { x: 7.8, y: 4.55, w: 1.5, h: 0.4, fontSize: 10, fontFace: FB, color: C.blue, bold: true, align: "center", valign: "middle" });

  addFooter(s);
  addNum(s, 6);
})();

// ==========================================
// SLIDE 7 — Code: using the handler
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5957\u7528\u81EA\u8A02\u8655\u7406\u5668", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 8.4, h: 2.0, fill: { color: C.bgCard } });
  s.addText([
    { text: "async with ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: '    model=', options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: '"claude-sonnet-4.6"', options: { color: C.green, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: "    on_permission_request=", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "on_permission_request", options: { color: C.orange, fontFace: FC, fontSize: 14, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: ") ", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "as ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "session:", options: { color: C.white, fontFace: FC, fontSize: 14 } },
  ], { x: 1.0, y: 1.4, w: 8.0, h: 1.8, valign: "top" });

  // Highlight arrow
  s.addText("\u2191 \u50B3\u5165\u4F60\u7684\u51FD\u5F0F\uFF0C\u4E0D\u662F approve_all", {
    x: 2.5, y: 3.35, w: 5.0, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "center", valign: "middle",
  });

  // Import reminder
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.0, w: 8.4, h: 0.8, fill: { color: C.bgCard } });
  s.addText("\u5FC5\u8981 Import", {
    x: 1.0, y: 4.05, w: 2, h: 0.3,
    fontSize: 13, fontFace: FB, color: C.blue, bold: true, align: "left",
  });
  s.addText([
    { text: "from ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "copilot ", options: { color: C.white, fontFace: FC, fontSize: 12 } },
    { text: "import ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "CopilotClient, PermissionRequest, PermissionRequestResult", options: { color: C.blue, fontFace: FC, fontSize: 12 } },
  ], { x: 1.0, y: 4.4, w: 8.0, h: 0.3, valign: "middle" });

  addFooter(s);
  addNum(s, 7);
})();

// ==========================================
// SLIDE 8 — Summary
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
    fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left",
  });
  s.addText([
    { text: "on_permission_request \u662F\u5FC5\u586B\u53C3\u6578", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "8 \u7A2E\u6B0A\u9650\u8ACB\u6C42\u985E\u578B", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "3 \u7A2E\u56DE\u50B3\u7D50\u679C\uFF08approve / deny\uFF09", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u6B63\u5F0F\u74B0\u5883\u5FC5\u9808\u81EA\u8A02\u8655\u7406\u5668", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  // Right — next lesson
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.purple } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", {
    x: 6.25, y: 1.5, w: 3.0, h: 0.4,
    fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left",
  });
  s.addText("\u7B2C 05 \u8AB2\uFF1A\u81EA\u8A02\u5DE5\u5177", {
    x: 6.25, y: 2.1, w: 3.0, h: 0.35,
    fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left",
  });
  s.addText("\u7528 @define_tool \u8B93 AI\n\u547C\u53EB\u4F60\u5BEB\u7684 Python \u51FD\u5F0F", {
    x: 6.25, y: 2.55, w: 3.0, h: 0.8,
    fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top",
  });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.purple, align: "center", valign: "middle" });

  // Bottom
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u4FE1\u4EFB\u4F46\u8981\u9A57\u8B49 \u2014 \u8B93\u6BCF\u500B AI \u64CD\u4F5C\u90FD\u7D93\u904E\u4F60\u7684\u5BE9\u6838\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.orange, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/04_permission_handling/slides.pptx" })
  .then(() => console.log("04_permission_handling/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
