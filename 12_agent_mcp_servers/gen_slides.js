const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 12 課：Agent 專屬 MCP 伺服器";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 12 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.purple } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.purple } });
  s.addText("LESSON 12", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("Agent \u5C08\u5C6C MCP", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u6BCF\u500B Agent \u639B\u8F09\u5C08\u5C6C\u7684\u5916\u90E8\u5DE5\u5177\u670D\u52D9\u5668", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: '{"name": "file-explorer",', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ' "mcp_servers": {', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '   "filesystem": {...}', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " }}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Session vs Agent level
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Session vs Agent \u5C64\u7D1A MCP", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Session level
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.orange } });
  s.addText("Session \u5C64\u7D1A\uFF08\u7B2C 07 \u8AB2\uFF09", { x: 0.7, y: 1.4, w: 3.9, h: 0.4, fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "create_session(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    mcp_servers={...}", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.9, w: 3.9, h: 0.7, valign: "top" });
  s.addText("\u6240\u6709 Agent \u5171\u4EAB\u540C\u4E00\u7D44 MCP Server", { x: 0.7, y: 2.75, w: 3.9, h: 0.4, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  s.addText("\u9069\u5408\uFF1A\u901A\u7528\u5DE5\u5177\uFF08\u5982 filesystem\uFF09", { x: 0.7, y: 3.15, w: 3.9, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });

  // Agent level
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.purple } });
  s.addText("Agent \u5C64\u7D1A\uFF08\u672C\u8AB2\uFF09", { x: 5.4, y: 1.4, w: 3.9, h: 0.4, fontSize: 14, fontFace: FB, color: C.purple, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "custom_agents=[{", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "mcp_servers": {...}', options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}]", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 1.9, w: 3.9, h: 0.7, valign: "top" });
  s.addText("\u50C5\u8A72 Agent \u53EF\u4F7F\u7528\u5C08\u5C6C MCP Server", { x: 5.4, y: 2.75, w: 3.9, h: 0.4, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  s.addText("\u9069\u5408\uFF1A\u5C08\u696D\u5DE5\u5177\uFF08\u5982 DB Agent \u5C08\u7528\uFF09", { x: 5.4, y: 3.15, w: 3.9, h: 0.3, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });

  // Architecture diagram
  s.addText("\u67B6\u69CB\u6982\u5FF5", { x: 0.8, y: 4.0, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });

  const boxes = [
    { label: "Session MCP\n(\u5171\u4EAB)", x: 0.5, color: C.orange },
    { label: "Agent A\n+ MCP-A", x: 3.0, color: C.green },
    { label: "Agent B\n+ MCP-B", x: 5.5, color: C.blue },
    { label: "Agent C\n(\u7121 MCP)", x: 8.0, color: C.gray },
  ];
  boxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: 4.35, w: 1.8, h: 0.65, fill: { color: C.bgCard }, line: { color: b.color, width: 1.5 } });
    s.addText(b.label, { x: b.x, y: 4.35, w: 1.8, h: 0.65, fontSize: 10, fontFace: FB, color: b.color, align: "center", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Use cases
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4F7F\u7528\u60C5\u5883", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const cases = [
    { agent: "\u6A94\u6848\u63A2\u7D22\u54E1", mcp: "filesystem MCP", desc: "\u700F\u89BD\u548C\u5206\u6790\u672C\u5730\u6A94\u6848", color: C.green },
    { agent: "\u7DB2\u8DEF\u7814\u7A76\u54E1", mcp: "fetch MCP", desc: "\u6293\u53D6\u7DB2\u9801\u5167\u5BB9\u4E26\u6458\u8981", color: C.blue },
    { agent: "\u8CC7\u6599\u5206\u6790\u5E2B", mcp: "postgres MCP", desc: "\u67E5\u8A62\u8CC7\u6599\u5EAB\u7D50\u69CB\u8207\u8CC7\u6599", color: C.orange },
  ];

  cases.forEach((c, i) => {
    const cy = 1.2 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: cy, w: 8.4, h: 1.0, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: cy, w: 0.06, h: 1.0, fill: { color: c.color } });
    s.addText(c.agent, { x: 1.1, y: cy, w: 2.5, h: 0.5, fontSize: 15, fontFace: FB, color: c.color, bold: true, align: "left", valign: "middle" });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.8, y: cy + 0.15, w: 2.5, h: 0.35, fill: { color: C.bgDark } });
    s.addText(c.mcp, { x: 3.8, y: cy + 0.15, w: 2.5, h: 0.35, fontSize: 11, fontFace: FC, color: c.color, align: "center", valign: "middle" });
    s.addText(c.desc, { x: 1.1, y: cy + 0.55, w: 8.0, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.65, w: 8.4, h: 0.4, fill: { color: C.bgCard } });
  s.addText("\u6BCF\u500B Agent \u53EA\u80FD\u5B58\u53D6\u5B83\u9700\u8981\u7684\u5916\u90E8\u8CC7\u6E90 \u2014 \u6700\u5C0F\u6B0A\u9650 + \u5C08\u696D\u5206\u5DE5", {
    x: 1.0, y: 4.65, w: 8.0, h: 0.4, fontSize: 12, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Code: file-explorer
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7BC4\u4F8B\uFF1A\u6A94\u6848\u63A2\u7D22\u54E1", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 3.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "name": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"file-explorer"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "display_name": "\u6A94\u6848\u63A2\u7D22\u54E1",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "tools": ["grep", "glob", "view"],', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "prompt": "\u4F60\u662F\u6A94\u6848\u7CFB\u7D71\u5C08\u5BB6...",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "mcp_servers"', options: { color: C.purple, fontFace: FC, fontSize: 12, bold: true, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        "filesystem": {', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "type": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"local"', options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "command": "npx",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "args": ["-y", "@modelcontextprotocol/', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '                     server-filesystem", work_dir],', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "tools": ["*"],', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        },", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 3.3, valign: "top" });

  s.addText("\u2191 mcp_servers \u5728 agent dict \u5167\u90E8\uFF0C\u4E0D\u662F session \u5C64\u7D1A", {
    x: 1.5, y: 4.6, w: 6, h: 0.4, fontSize: 13, fontFace: FB, color: C.purple, bold: true, align: "center",
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: web-researcher
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7BC4\u4F8B\uFF1A\u7DB2\u8DEF\u7814\u7A76\u54E1", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "name": ', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"web-researcher"', options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "prompt": "\u4F60\u662F\u7DB2\u8DEF\u7814\u7A76\u5C08\u5BB6...",', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "mcp_servers"', options: { color: C.purple, fontFace: FC, fontSize: 13, bold: true, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "fetch": {', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '            "type": ', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"remote"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '            "url": "https://router.mcp.so/sse/fetch",', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '            "tools": ["*"],', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "        },", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 2.3, valign: "top" });

  // Side-by-side comparison
  s.addText("\u5169\u500B Agent\uFF0C\u5404\u81EA\u7684 MCP", { x: 0.8, y: 3.7, w: 4, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.1, w: 4.0, h: 0.7, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.1, w: 0.05, h: 0.7, fill: { color: C.green } });
  s.addText("file-explorer\nfilesystem MCP (local)", { x: 1.0, y: 4.1, w: 3.6, h: 0.7, fontSize: 11, fontFace: FC, color: C.green, align: "left", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.1, w: 4.0, h: 0.7, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 4.1, w: 0.05, h: 0.7, fill: { color: C.blue } });
  s.addText("web-researcher\nfetch MCP (remote)", { x: 5.4, y: 4.1, w: 3.6, h: 0.7, fontSize: 11, fontFace: FC, color: C.blue, align: "left", valign: "middle" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Combining with tools
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7D50\u5408 tools + MCP", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.06, h: 0.6, fill: { color: C.cyan } });
  s.addText("tools \u9650\u5236\u5167\u5EFA\u5DE5\u5177\uFF0Cmcp_servers \u63D0\u4F9B\u5916\u90E8\u670D\u52D9 \u2014 \u5169\u8005\u53EF\u4EE5\u540C\u6642\u4F7F\u7528", {
    x: 1.1, y: 1.2, w: 7.9, h: 0.6, fontSize: 14, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  // Example agent card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 8.4, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "name": "file-explorer",', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # \u5167\u5EFA\u5DE5\u5177\uFF1A\u50C5\u5141\u8A31\u552F\u8B80", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "tools": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '["grep", "glob", "view"]', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # \u5916\u90E8\u670D\u52D9\uFF1A\u639B\u8F09 filesystem MCP", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "mcp_servers": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{"filesystem": {...}}', options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 1.0, y: 2.2, w: 8.0, h: 2.3, valign: "top" });

  // Visual
  s.addText("Agent \u80FD\u529B = \u5167\u5EFA\u5DE5\u5177 (tools) + \u5916\u90E8\u670D\u52D9 (mcp_servers) + prompt", {
    x: 0.8, y: 4.8, w: 8.4, h: 0.3, fontSize: 12, fontFace: FB, color: C.yellow, bold: true, align: "center",
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
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText([
    { text: "Agent \u5C64\u7D1A mcp_servers \u8A2D\u5B9A", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Session \u5171\u4EAB vs Agent \u5C08\u5C6C", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u7D50\u5408 tools + mcp_servers + prompt", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u6BCF\u500B Agent \u53EA\u5B58\u53D6\u6240\u9700\u8CC7\u6E90", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.green } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText("\u7B2C 13 \u8AB2\uFF1ASub-Agent \u4E8B\u4EF6", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u76E3\u63A7 Agent \u5207\u63DB\u548C\n\u57F7\u884C\u72C0\u614B\u7684\u4E8B\u4EF6", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u6BCF\u500B Agent \u6709\u81EA\u5DF1\u7684\u5DE5\u5177\u7BB1 \u2014 \u5167\u5EFA + \u5916\u90E8\uFF0C\u7CBE\u78BA\u63A7\u5236\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.purple, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/12_agent_mcp_servers/slides.pptx" })
  .then(() => console.log("12_agent_mcp_servers/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
