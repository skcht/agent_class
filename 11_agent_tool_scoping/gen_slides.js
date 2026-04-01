const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 11 課：Agent 工具範圍控制";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 11 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.red } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.red } });
  s.addText("LESSON 11", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("Agent \u5DE5\u5177\u7BC4\u570D\u63A7\u5236", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("tools + infer + agent \u2014 \u6700\u5C0F\u6B0A\u9650\u539F\u5247", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: '"tools": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '["grep", "glob", "view"]', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '"infer": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "False", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: 'agent=', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"researcher"', options: { color: C.blue, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Three new attributes
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E09\u500B\u65B0\u5C6C\u6027", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const attrs = [
    {
      name: "tools",
      type: "list[str] | None",
      desc: "\u9650\u5236 Agent \u53EF\u4F7F\u7528\u7684\u5DE5\u5177\u6E05\u55AE",
      detail: "None \u6216\u7701\u7565 = \u6240\u6709\u5DE5\u5177\u3002\u6307\u5B9A\u5217\u8868 = \u50C5\u80FD\u4F7F\u7528\u8A72\u4E9B\u5DE5\u5177\u3002",
      color: C.green,
    },
    {
      name: "infer",
      type: "bool",
      desc: "\u662F\u5426\u5141\u8A31 runtime \u81EA\u52D5\u9078\u64C7\u6B64 Agent",
      detail: "True(\u9810\u8A2D) = \u81EA\u52D5\u59D4\u6D3E\u3002False = \u50C5\u660E\u78BA\u8981\u6C42\u6642\u555F\u7528\u3002",
      color: C.orange,
    },
    {
      name: "agent",
      type: "str (session \u5C64\u7D1A)",
      desc: "\u5EFA\u7ACB Session \u6642\u9810\u5148\u9078\u64C7\u7684 Agent",
      detail: "\u5728\u7B2C\u4E00\u500B prompt \u524D\u5C31\u555F\u7528\u6307\u5B9A Agent\u3002",
      color: C.blue,
    },
  ];

  attrs.forEach((a, i) => {
    const ay = 1.2 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ay, w: 8.4, h: 0.95, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ay, w: 0.06, h: 0.95, fill: { color: a.color } });
    s.addText(a.name, { x: 1.1, y: ay + 0.02, w: 1.8, h: 0.35, fontSize: 16, fontFace: FC, color: a.color, bold: true, align: "left", valign: "middle" });
    s.addText(a.type, { x: 3.0, y: ay + 0.02, w: 2.5, h: 0.35, fontSize: 11, fontFace: FC, color: C.gray, align: "left", valign: "middle" });
    s.addText(a.desc, { x: 5.7, y: ay + 0.02, w: 3.3, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(a.detail, { x: 1.1, y: ay + 0.42, w: 8.0, h: 0.4, fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — tools examples
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("tools \u5BE6\u4F8B\uFF1A\u6700\u5C0F\u6B0A\u9650\u539F\u5247", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const examples = [
    { name: "\u7814\u7A76\u54E1", tools: '["grep", "glob", "view"]', desc: "\u50C5\u80FD\u67E5\u770B\uFF0C\u4E0D\u80FD\u4FEE\u6539", color: C.green, icon: "\uD83D\uDD0D" },
    { name: "\u7DE8\u8F2F\u54E1", tools: '["view", "edit", "bash"]', desc: "\u53EF\u4EE5\u4FEE\u6539\u6A94\u6848\u548C\u57F7\u884C\u6307\u4EE4", color: C.blue, icon: "\u270F\uFE0F" },
    { name: "\u5168\u6B0A\u9650", tools: "None", desc: "\u53EF\u4F7F\u7528\u6240\u6709\u5DE5\u5177", color: C.orange, icon: "\uD83D\uDD13" },
  ];

  examples.forEach((e, i) => {
    const ey = 1.3 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 8.4, h: 0.95, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 0.06, h: 0.95, fill: { color: e.color } });
    s.addText(`${e.icon}  ${e.name}`, { x: 1.1, y: ey, w: 2.5, h: 0.5, fontSize: 15, fontFace: FB, color: e.color, bold: true, align: "left", valign: "middle" });
    s.addText(e.desc, { x: 1.1, y: ey + 0.48, w: 3.5, h: 0.4, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });

    // Code
    s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: ey + 0.15, w: 4.0, h: 0.6, fill: { color: C.bgDark } });
    s.addText(`"tools": ${e.tools}`, { x: 5.1, y: ey + 0.15, w: 3.8, h: 0.6, fontSize: 12, fontFace: FC, color: e.color, align: "left", valign: "middle" });
  });

  // Security insight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.45, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 0.06, h: 0.45, fill: { color: C.red } });
  s.addText("\u5B89\u5168\u539F\u5247\uFF1A\u7D66\u6BCF\u500B Agent \u50C5\u6240\u9700\u7684\u5DE5\u5177\uFF0C\u907F\u514D\u904E\u5EA6\u6388\u6B0A", {
    x: 1.1, y: 4.6, w: 7.9, h: 0.45,
    fontSize: 13, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — infer control
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("infer \u63A7\u5236\u81EA\u52D5\u9078\u64C7", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // True
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("infer: True (\u9810\u8A2D)", { x: 0.7, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "Runtime \u6839\u64DA\u4F7F\u7528\u8005\u610F\u5716", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u81EA\u52D5\u59D4\u6D3E\u7D66\u9069\u5408\u7684 Agent", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u9069\u5408\uFF1A\u5E38\u7528 Agent", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.9, w: 3.7, h: 1.2, valign: "top", paraSpaceAfter: 4 });

  // False
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.orange } });
  s.addText("infer: False", { x: 5.4, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.orange, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "\u50C5\u5728\u4F7F\u7528\u8005\u660E\u78BA\u8981\u6C42\u6642", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u624D\u6703\u555F\u7528\u6B64 Agent", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u9069\u5408\uFF1A\u5371\u96AA\u64CD\u4F5C\u7684 Agent", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 5.6, y: 1.9, w: 3.7, h: 1.2, valign: "top", paraSpaceAfter: 4 });

  // agent preselect
  s.addText("agent \u9810\u5148\u9078\u64C7", { x: 0.8, y: 3.6, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.0, w: 8.4, h: 0.8, fill: { color: C.bgCard } });
  s.addText([
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    agent=", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"researcher"', options: { color: C.blue, fontFace: FC, fontSize: 13, bold: true, breakLine: false } },
    { text: ",  ", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "# \u7B2C\u4E00\u500B prompt \u524D\u5C31\u555F\u7528\u6307\u5B9A Agent", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 1.0, y: 4.05, w: 8.0, h: 0.7, valign: "top" });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code example
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5B8C\u6574\u7BC4\u4F8B", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "custom_agents=[", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "name": "researcher",', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "description": "\u5206\u6790\u7A0B\u5F0F\u78BC\u7D50\u69CB\u8207\u5B89\u5168\u554F\u984C",', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "tools": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '["grep", "glob", "view"]', options: { color: C.green, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "prompt": "\u4F60\u662F\u7A0B\u5F0F\u78BC\u5206\u6790\u5C08\u5BB6...",', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "name": "editor",', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "tools": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '["view", "edit", "bash"]', options: { color: C.blue, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "prompt": "\u4F60\u662F\u7A0B\u5F0F\u78BC\u7DE8\u8F2F\u5C08\u5BB6...",', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "name": "cleanup",', options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "tools": ["bash", "edit", "view"],', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "infer": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "False", options: { color: C.red, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: ",  ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "# \u4E0D\u81EA\u52D5\u9078\u64C7", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "]", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — How it works
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u904B\u4F5C\u6D41\u7A0B", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Flow
  const flow = [
    { label: "\u4F7F\u7528\u8005\n\u63D0\u554F", color: C.blue, x: 0.3 },
    { label: "Runtime\n\u5224\u65B7\u610F\u5716", color: C.purple, x: 2.0 },
    { label: "\u9078\u64C7 Agent\n(infer=True)", color: C.green, x: 3.7 },
    { label: "\u6AA2\u67E5\ntools \u6E05\u55AE", color: C.orange, x: 5.4 },
    { label: "\u57F7\u884C\n(\u50C5\u7528\u5141\u8A31\u5DE5\u5177)", color: C.cyan, x: 7.3 },
  ];
  flow.forEach((f, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 1.5, w: 1.4, h: 0.9, fill: { color: C.bgCard }, line: { color: f.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 1.5, w: 1.4, h: 0.04, fill: { color: f.color } });
    s.addText(f.label, { x: f.x, y: 1.55, w: 1.4, h: 0.8, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < flow.length - 1) {
      s.addText("\u25B6", { x: f.x + 1.4, y: 1.5, w: flow[i + 1].x - f.x - 1.4, h: 0.9, fontSize: 12, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  // Example scenarios
  s.addText("\u5BE6\u969B\u60C5\u5883", { x: 0.8, y: 2.7, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const scenarios = [
    { prompt: '"\u8ACB\u5206\u6790\u9019\u6BB5\u7A0B\u5F0F\u78BC\u7684\u5B89\u5168\u554F\u984C"', agent: "researcher", tools: "grep, glob, view", color: C.green },
    { prompt: '"\u8ACB\u4FEE\u5FA9 SQL Injection \u6F0F\u6D1E"', agent: "editor", tools: "view, edit, bash", color: C.blue },
    { prompt: '"\u8ACB\u6E05\u7406\u672A\u4F7F\u7528\u7684\u6A94\u6848"', agent: "cleanup (infer=False)", tools: "\u4E0D\u6703\u81EA\u52D5\u9078\u64C7", color: C.red },
  ];
  scenarios.forEach((sc, i) => {
    const sy = 3.15 + i * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 8.4, h: 0.45, fill: { color: C.bgCard } });
    s.addText(sc.prompt, { x: 1.0, y: sy, w: 3.5, h: 0.45, fontSize: 10, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(`\u2192 ${sc.agent}`, { x: 4.7, y: sy, w: 2.3, h: 0.45, fontSize: 10, fontFace: FB, color: sc.color, bold: true, align: "left", valign: "middle" });
    s.addText(sc.tools, { x: 7.2, y: sy, w: 1.8, h: 0.45, fontSize: 9, fontFace: FC, color: C.gray, align: "right", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.red, bold: true, align: "left" });
  s.addText([
    { text: "tools \u9650\u5236 Agent \u53EF\u7528\u5DE5\u5177", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "infer \u63A7\u5236\u81EA\u52D5\u59D4\u6D3E\u884C\u70BA", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "agent \u9810\u5148\u9078\u64C7\u555F\u52D5 Agent", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u6700\u5C0F\u6B0A\u9650\u539F\u5247 = \u5B89\u5168\u7B2C\u4E00", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.purple } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText("\u7B2C 12 \u8AB2\uFF1AAgent \u5C08\u5C6C MCP", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u7D66\u6BCF\u500B Agent \u5C08\u5C6C\u7684\nMCP \u5DE5\u5177\u670D\u52D9\u5668", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.purple, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u7D66\u6BCF\u500B Agent \u50C5\u6240\u9700\u7684\u5DE5\u5177 \u2014 \u5B89\u5168\u5F9E\u6B0A\u9650\u958B\u59CB\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.red, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/11_agent_tool_scoping/slides.pptx" })
  .then(() => console.log("11_agent_tool_scoping/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
