const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 10 課：自訂 Agent 角色";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 10 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.green } });
  s.addText("LESSON 10", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("\u81EA\u8A02 Agent \u89D2\u8272", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("custom_agents + system_message \u2014 \u7D66 AI \u5C08\u696D\u4EBA\u8A2D", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "custom_agents = [", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '  {"name": "code-reviewer", ...},', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '  {"name": "doc-writer", ...},', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "]", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// SLIDE 2 — Why custom agents?
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u9700\u8981\u81EA\u8A02\u89D2\u8272\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Without vs With
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("\u6C92\u6709\u89D2\u8272\u8A2D\u5B9A", { x: 0.7, y: 1.4, w: 3.9, h: 0.35, fontSize: 14, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "AI \u662F\u901A\u624D\uFF0C\u4EC0\u9EBC\u90FD\u61C2\u4E00\u9EDE", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u56DE\u8986\u98A8\u683C\u4E0D\u4E00\u81F4", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u6BCF\u6B21\u90FD\u8981\u91CD\u65B0\u8AAA\u660E\u80CC\u666F", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.85, w: 3.7, h: 1.2, valign: "top", paraSpaceAfter: 4 });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u6709\u89D2\u8272\u8A2D\u5B9A", { x: 5.4, y: 1.4, w: 3.9, h: 0.35, fontSize: 14, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "AI \u662F\u5C08\u5BB6\uFF0C\u5C08\u6CE8\u7279\u5B9A\u9818\u57DF", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u56DE\u8986\u98A8\u683C\u4E00\u81F4\u4E14\u5C08\u696D", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u80CC\u666F\u5DF2\u5167\u5EFA\u5728 prompt \u4E2D", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.6, y: 1.85, w: 3.7, h: 1.2, valign: "top", paraSpaceAfter: 4 });

  // Example agents
  s.addText("\u7BC4\u4F8B\u89D2\u8272", { x: 0.8, y: 3.6, w: 2, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });
  const agents = [
    { name: "\u7A0B\u5F0F\u78BC\u5BE9\u67E5\u54E1", desc: "\u627E\u51FA\u5B89\u5168\u6F0F\u6D1E\u3001\u6548\u80FD\u554F\u984C", color: C.green },
    { name: "\u6280\u8853\u6587\u4EF6\u64B0\u5BEB\u54E1", desc: "\u7522\u751F docstring \u8207\u8A3B\u89E3", color: C.blue },
    { name: "\u6E2C\u8A66\u5C08\u5BB6", desc: "\u7522\u751F\u55AE\u5143\u6E2C\u8A66", color: C.orange },
    { name: "\u7CFB\u7D71\u67B6\u69CB\u5E2B", desc: "\u8A2D\u8A08\u67B6\u69CB\u65B9\u6848", color: C.purple },
  ];
  agents.forEach((a, i) => {
    const ax = 0.5 + i * 2.35;
    s.addShape(pres.shapes.RECTANGLE, { x: ax, y: 4.05, w: 2.15, h: 0.8, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: ax, y: 4.05, w: 2.15, h: 0.04, fill: { color: a.color } });
    s.addText(a.name, { x: ax + 0.1, y: 4.1, w: 1.95, h: 0.35, fontSize: 12, fontFace: FB, color: a.color, bold: true, align: "left", valign: "middle" });
    s.addText(a.desc, { x: ax + 0.1, y: 4.45, w: 1.95, h: 0.35, fontSize: 10, fontFace: FB, color: C.gray, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — system_message vs custom_agents
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5169\u7A2E\u8A2D\u5B9A\u7684\u5DEE\u7570", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // system_message
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.orange } });
  s.addText("system_message", { x: 0.7, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.orange, bold: true, align: "left", valign: "middle" });
  s.addText("\u5168\u57DF\u6307\u4EE4\uFF0C\u5F71\u97FF\u6574\u500B Session", {
    x: 0.7, y: 1.8, w: 3.9, h: 0.3, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left",
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.2, w: 3.9, h: 1.0, fill: { color: C.bgDark } });
  s.addText([
    { text: "system_message = {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "content": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u8ACB\u4FDD\u6301\u7C21\u6F54\uFF0C', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '     \u56DE\u8986\u4E0D\u8D85\u904E 200 \u5B57"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.8, y: 2.3, w: 3.7, h: 0.8, valign: "top" });

  s.addText("\u9069\u7528\uFF1A\u8A9E\u8A00\u3001\u683C\u5F0F\u3001\u9577\u5EA6\u9650\u5236", {
    x: 0.7, y: 3.4, w: 3.9, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "left",
  });

  // custom_agents
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("custom_agents", { x: 5.4, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText("\u53EF\u5207\u63DB\u7684\u5C08\u696D\u89D2\u8272", {
    x: 5.4, y: 1.8, w: 3.9, h: 0.3, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left",
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 2.2, w: 3.9, h: 1.0, fill: { color: C.bgDark } });
  s.addText([
    { text: '[{"name": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"code-reviewer"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '  "prompt": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u4F60\u662F\u8CC7\u6DF1\u5BE9\u67E5\u5C08\u5BB6..."', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}]", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.5, y: 2.3, w: 3.7, h: 0.8, valign: "top" });

  s.addText("\u9069\u7528\uFF1A\u5C08\u696D\u9818\u57DF\u3001\u89D2\u8272\u5207\u63DB", {
    x: 5.4, y: 3.4, w: 3.9, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "left",
  });

  // Can combine
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addText("\u5169\u8005\u53EF\u4EE5\u540C\u6642\u4F7F\u7528 \u2014 system_message \u63D0\u4F9B\u5168\u57DF\u898F\u5247\uFF0Ccustom_agents \u63D0\u4F9B\u5C08\u696D\u4EBA\u8A2D", {
    x: 1.0, y: 4.5, w: 8.0, h: 0.5,
    fontSize: 12, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Agent structure
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Agent \u7D50\u69CB\u5B9A\u7FA9", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const fields = [
    { field: '"name"', desc: "\u552F\u4E00\u8B58\u5225\u78BC\uFF08\u5167\u90E8\u4F7F\u7528\uFF09", example: '"code-reviewer"', color: C.blue },
    { field: '"display_name"', desc: "\u986F\u793A\u540D\u7A31\uFF08\u9078\u586B\uFF09", example: '"\u7A0B\u5F0F\u78BC\u5BE9\u67E5\u54E1"', color: C.green },
    { field: '"description"', desc: "\u89D2\u8272\u63CF\u8FF0\uFF08AI \u53C3\u8003\uFF09", example: '"\u5BE9\u67E5\u7A0B\u5F0F\u78BC\u4E2D\u7684\u81ED\u87F2..."', color: C.orange },
    { field: '"prompt"', desc: "\u7CFB\u7D71 prompt \u6307\u4EE4\uFF08\u6838\u5FC3\uFF09", example: '"\u4F60\u662F\u4E00\u4F4D\u8CC7\u6DF1\u5BE9\u67E5\u5C08\u5BB6..."', color: C.purple },
  ];

  fields.forEach((f, i) => {
    const fy = 1.2 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 8.4, h: 0.75, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 0.06, h: 0.75, fill: { color: f.color } });
    s.addText(f.field, { x: 1.1, y: fy, w: 2.5, h: 0.38, fontSize: 13, fontFace: FC, color: f.color, bold: true, align: "left", valign: "middle" });
    s.addText(f.desc, { x: 3.8, y: fy, w: 5.2, h: 0.38, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(f.example, { x: 1.1, y: fy + 0.38, w: 8.0, h: 0.32, fontSize: 10, fontFace: FC, color: C.gray, align: "left", valign: "middle" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.3, fill: { color: C.bgCard } });
  s.addText("prompt \u662F\u6700\u91CD\u8981\u7684\u6B04\u4F4D \u2014 \u5B83\u6C7A\u5B9A AI \u7684\u5C08\u696D\u884C\u70BA\u548C\u56DE\u8986\u98A8\u683C", {
    x: 1.0, y: 4.85, w: 8.0, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.yellow, bold: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: complete example
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5B8C\u6574\u7BC4\u4F8B", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    custom_agents=[", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            "name": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"code-reviewer"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            "display_name": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u7A0B\u5F0F\u78BC\u5BE9\u67E5\u54E1"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            "description": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u5BE9\u67E5\u7A0B\u5F0F\u78BC\u4E2D\u7684\u81ED\u87F2\u8207\u6F0F\u6D1E"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            "prompt": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u4F60\u662F\u8CC7\u6DF1\u5BE9\u67E5\u5C08\u5BB6\uFF0C\u5BE9\u67E5\u91CD\u9EDE\uFF1A"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '                       "\u5B89\u5168\u6F0F\u6D1E\u3001\u6548\u80FD\u3001\u6700\u4F73\u5BE6\u8E10..."', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            "name": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"doc-writer"', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ", ...", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ],", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    system_message={", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        "content": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"\u8ACB\u4FDD\u6301\u7C21\u6F54\uFF0C\u4F7F\u7528\u7E41\u9AD4\u4E2D\u6587\u56DE\u8986"', options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Practical demo
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5BE6\u969B\u904B\u7528\u7BC4\u4F8B", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Code reviewer
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 3.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u7A0B\u5F0F\u78BC\u5BE9\u67E5\u54E1", { x: 0.7, y: 1.3, w: 3.9, h: 0.4, fontSize: 15, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle" });

  s.addText("\u8F38\u5165\uFF1A", { x: 0.7, y: 1.75, w: 1, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 2.0, w: 3.9, h: 0.8, fill: { color: C.bgDark } });
  s.addText([
    { text: "def get_user(id):", options: { color: C.grayLight, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: '  query = f"SELECT * FROM', options: { color: C.grayLight, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: '           users WHERE id={id}"', options: { color: C.red, fontFace: FC, fontSize: 10 } },
  ], { x: 0.8, y: 2.05, w: 3.7, h: 0.7, valign: "top" });

  s.addText("AI \u56DE\u8986\uFF1A", { x: 0.7, y: 2.9, w: 1.2, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText([
    { text: "SQL Injection \u98A8\u96AA\uFF01", options: { color: C.red, fontFace: FB, fontSize: 11, bold: true, breakLine: true } },
    { text: "\u4F7F\u7528\u53C3\u6578\u5316\u67E5\u8A62\u4EE3\u66FF\n f-string \u62FC\u63A5...", options: { color: C.grayLight, fontFace: FB, fontSize: 11 } },
  ], { x: 0.7, y: 3.15, w: 3.9, h: 1.0, valign: "top" });

  // Doc writer
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 3.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.blue } });
  s.addText("\u6280\u8853\u6587\u4EF6\u64B0\u5BEB\u54E1", { x: 5.4, y: 1.3, w: 3.9, h: 0.4, fontSize: 15, fontFace: FB, color: C.blue, bold: true, align: "left", valign: "middle" });

  s.addText("\u8F38\u5165\uFF1A", { x: 5.4, y: 1.75, w: 1, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 2.0, w: 3.9, h: 0.8, fill: { color: C.bgDark } });
  s.addText("\u540C\u4E00\u6BB5\u7A0B\u5F0F\u78BC", { x: 5.5, y: 2.0, w: 3.7, h: 0.8, fontSize: 11, fontFace: FB, color: C.grayDim, align: "center", valign: "middle" });

  s.addText("AI \u56DE\u8986\uFF1A", { x: 5.4, y: 2.9, w: 1.2, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText([
    { text: 'def get_user(id):', options: { color: C.blue, fontFace: FC, fontSize: 11, bold: true, breakLine: true } },
    { text: '    """\u6839\u64DA ID \u67E5\u8A62\u4F7F\u7528\u8005\u8CC7\u6599\u3002', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    Args:', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        id: \u4F7F\u7528\u8005 ID', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    """', options: { color: C.green, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.15, w: 3.9, h: 1.3, valign: "top" });

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
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText([
    { text: "custom_agents \u5B9A\u7FA9\u5C08\u696D\u89D2\u8272", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "system_message \u8A2D\u5B9A\u5168\u57DF\u6307\u4EE4", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "prompt \u662F\u89D2\u8272\u884C\u70BA\u7684\u6838\u5FC3", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u540C\u4E00\u7A0B\u5F0F\u78BC\uFF0C\u4E0D\u540C\u89D2\u8272\u4E0D\u540C\u7D50\u679C", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.orange } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left" });
  s.addText("\u7B2C 11 \u8AB2\uFF1AAgent \u5DE5\u5177\u7BC4\u570D", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u63A7\u5236\u6BCF\u500B Agent\n\u53EF\u4EE5\u4F7F\u7528\u54EA\u4E9B\u5DE5\u5177", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.orange, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u540C\u4E00\u500B AI\uFF0C\u4E0D\u540C\u7684\u89D2\u8272\uFF0C\u4E0D\u540C\u7684\u5C08\u696D\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.green, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/10_custom_agents/slides.pptx" })
  .then(() => console.log("10_custom_agents/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
