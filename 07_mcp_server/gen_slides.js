const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 07 課：MCP 伺服器整合";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 07 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.blue } });
  s.addText("LESSON 07", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("MCP \u4F3A\u670D\u5668\u6574\u5408", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("Model Context Protocol \u2014 \u8B93 AI \u9023\u63A5\u5916\u90E8\u5DE5\u5177\u670D\u52D9", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "mcp_servers = {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "filesystem"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ": { ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"type": "local"', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ", ... },", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "fetch"', options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":      { ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"type": "remote"', options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ", ... },", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — What is MCP?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4EC0\u9EBC\u662F MCP\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Definition
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.7, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.06, h: 0.7, fill: { color: C.blue } });
  s.addText("Model Context Protocol \u2014 \u4E00\u500B\u6A19\u6E96\u5354\u5B9A\uFF0C\u8B93 AI agent \u9023\u63A5\u5916\u90E8\u5DE5\u5177\u670D\u52D9\u5668", {
    x: 1.1, y: 1.2, w: 7.9, h: 0.7,
    fontSize: 15, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  // Architecture: Agent ↔ MCP Server ↔ Service
  s.addText("\u67B6\u69CB\u6982\u5FF5", { x: 0.8, y: 2.1, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const arch = [
    { label: "\u4F60\u7684 Python\nAgent", color: C.blue, x: 0.5 },
    { label: "Copilot\nSDK", color: C.purple, x: 2.3 },
    { label: "MCP Server\n(\u5DE5\u5177\u670D\u52D9\u5668)", color: C.green, x: 4.3 },
    { label: "\u5916\u90E8\u670D\u52D9\n(API/DB/FS)", color: C.orange, x: 6.8 },
  ];
  arch.forEach((a, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: a.x, y: 2.6, w: 1.6, h: 1.0, fill: { color: C.bgCard }, line: { color: a.color, width: 2 } });
    s.addShape(pres.shapes.RECTANGLE, { x: a.x, y: 2.6, w: 1.6, h: 0.04, fill: { color: a.color } });
    s.addText(a.label, { x: a.x, y: 2.65, w: 1.6, h: 0.9, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < arch.length - 1) {
      s.addText("\u2194", { x: a.x + 1.6, y: 2.6, w: arch[i + 1].x - a.x - 1.6, h: 1.0, fontSize: 16, color: C.gray, align: "center", valign: "middle" });
    }
  });

  // Key benefits
  s.addText("\u70BA\u4EC0\u9EBC\u7528 MCP\uFF1F", { x: 0.8, y: 3.9, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });
  const benefits = [
    { text: "\u6A19\u6E96\u5316\u5354\u5B9A", desc: "\u4E0D\u540C AI \u53EF\u5171\u7528\u540C\u4E00\u500B\u5DE5\u5177\u670D\u52D9\u5668", color: C.blue },
    { text: "\u751F\u614B\u7CFB\u8C50\u5BCC", desc: "NPM \u4E0A\u6709\u5927\u91CF\u73FE\u6210 MCP Server", color: C.green },
    { text: "\u672C\u5730\u6216\u96F2\u7AEF", desc: "stdio \u672C\u5730\u6216 HTTP \u9060\u7AEF\u7686\u53EF", color: C.orange },
  ];
  benefits.forEach((b, i) => {
    const bx = 0.8 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 4.35, w: 2.7, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: bx, y: 4.35, w: 2.7, h: 0.04, fill: { color: b.color } });
    s.addText(b.text, { x: bx + 0.1, y: 4.38, w: 2.5, h: 0.3, fontSize: 12, fontFace: FB, color: b.color, bold: true, align: "left", valign: "middle" });
    s.addText(b.desc, { x: bx + 0.1, y: 4.65, w: 2.5, h: 0.3, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Two types
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5169\u7A2E MCP \u985E\u578B", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Left — Local (stdio)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.blue } });
  s.addText('type: "local" (stdio)', { x: 0.7, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.blue, bold: true, align: "left", valign: "middle" });

  s.addText("\u904B\u4F5C\u65B9\u5F0F", { x: 0.7, y: 1.9, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText("\u555F\u52D5\u672C\u5730\u5B50\u7A0B\u5E8F\uFF0C\u900F\u904E stdin/stdout \u901A\u8A0A", {
    x: 0.7, y: 2.15, w: 3.9, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  s.addText("\u9069\u7528\u5834\u666F", { x: 0.7, y: 2.6, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText("\u672C\u5730\u5DE5\u5177\uFF0C\u5982\u6A94\u6848\u7CFB\u7D71\u3001Git", {
    x: 0.7, y: 2.85, w: 3.9, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  s.addText("\u8A2D\u5B9A\u6B04\u4F4D", { x: 0.7, y: 3.3, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText([
    { text: "command", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "args", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "tools", options: { color: C.blue, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 3.6, w: 3.9, h: 0.8, valign: "top" });

  s.addText('\u4F8B\uFF1Anpx @modelcontextprotocol/\n     server-filesystem', {
    x: 0.7, y: 4.3, w: 3.9, h: 0.4, fontSize: 10, fontFace: FC, color: C.grayDim, align: "left", valign: "middle",
  });

  // Right — Remote (HTTP)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.orange } });
  s.addText('type: "remote" (HTTP)', { x: 5.4, y: 1.4, w: 3.9, h: 0.4, fontSize: 15, fontFace: FC, color: C.orange, bold: true, align: "left", valign: "middle" });

  s.addText("\u904B\u4F5C\u65B9\u5F0F", { x: 5.4, y: 1.9, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText("\u900F\u904E HTTP/SSE \u9023\u63A5\u9060\u7AEF\u670D\u52D9\u5668", {
    x: 5.4, y: 2.15, w: 3.9, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  s.addText("\u9069\u7528\u5834\u666F", { x: 5.4, y: 2.6, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText("\u96F2\u7AEF\u670D\u52D9\uFF0C\u5982 API Gateway\u3001SaaS", {
    x: 5.4, y: 2.85, w: 3.9, h: 0.35, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  s.addText("\u8A2D\u5B9A\u6B04\u4F4D", { x: 5.4, y: 3.3, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left" });
  s.addText([
    { text: "url", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "headers", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "tools", options: { color: C.orange, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.6, w: 3.9, h: 0.8, valign: "top" });

  s.addText('\u4F8B\uFF1Ahttps://router.mcp.so/sse/fetch', {
    x: 5.4, y: 4.3, w: 3.9, h: 0.4, fontSize: 10, fontFace: FC, color: C.grayDim, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Code: Local MCP
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Local MCP \u2014 \u6A94\u6848\u7CFB\u7D71\u670D\u52D9\u5668", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 3.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "async with ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    model="claude-sonnet-4.6",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    on_permission_request=PermissionHandler.approve_all,", options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    mcp_servers={", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        "filesystem"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "type": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"local"', options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "command": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"npx"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "args": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '["-y", "@modelcontextprotocol/server-filesystem", work_dir]', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "tools": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '["*"]', options: { color: C.orange, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",              ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "# \u66B4\u9732\u6240\u6709\u5DE5\u5177", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        },", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: ") ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "as ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "session:", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 3.0, valign: "top" });

  // Annotations
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.4, w: 9.0, h: 0.55, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.4, w: 0.06, h: 0.55, fill: { color: C.blue } });
  s.addText("npx -y \u81EA\u52D5\u5B89\u88DD\u4E26\u57F7\u884C MCP server\u3002\u5DE5\u5177\u540D\u7A31\u7531 server \u63D0\u4F9B\uFF0CAI \u81EA\u52D5\u767C\u73FE\u53EF\u7528\u5DE5\u5177\u3002", {
    x: 0.8, y: 4.4, w: 8.5, h: 0.55,
    fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Code: Remote MCP
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Remote MCP \u2014 \u9060\u7AEF\u670D\u52D9\u5668", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "mcp_servers={", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "fetch"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "type": ', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"remote"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "url": ', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"https://router.mcp.so/sse/fetch"', options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "tools": ', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '["*"]', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    },", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 2.3, valign: "top" });

  // Comparison with local
  s.addText("\u8207 Local \u7684\u5DEE\u7570", { x: 0.8, y: 3.8, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const diffs = [
    { field: "type", local: '"local"', remote: '"remote"', color: C.purple },
    { field: "\u9023\u63A5", local: "command + args", remote: "url + headers", color: C.blue },
    { field: "\u4F9D\u8CF4", local: "\u9700\u8981 Node.js/npx", remote: "\u50C5\u9700\u7DB2\u8DEF", color: C.green },
  ];
  diffs.forEach((d, i) => {
    const dy = 4.2 + i * 0.32;
    s.addText(d.field, { x: 0.8, y: dy, w: 1.5, h: 0.28, fontSize: 11, fontFace: FB, color: d.color, bold: true, align: "left", valign: "middle" });
    s.addText(d.local, { x: 2.5, y: dy, w: 3.0, h: 0.28, fontSize: 10, fontFace: FC, color: C.grayLight, align: "center", valign: "middle" });
    s.addText(d.remote, { x: 6.0, y: dy, w: 3.0, h: 0.28, fontSize: 10, fontFace: FC, color: C.grayLight, align: "center", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Configuration reference
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u8A2D\u5B9A\u53C3\u8003", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 3.5, fill: { color: C.bgCard } });
  s.addText([
    { text: '"mcp_servers"', options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "server_name"', options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": {", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "type"', options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ':    "local" | "remote",', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "        # local \u5C08\u7528", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "command"', options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ': "npx",', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "args"', options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ':    ["..."],', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "        # remote \u5C08\u7528", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "url"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ':     "https://...",', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "headers"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ': {...},', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "        # \u5171\u7528", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '        "tools"', options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ':   ["*"],', options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    }", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 3.3, valign: "top" });

  s.addText('tools: ["*"] \u66B4\u9732\u6240\u6709\u5DE5\u5177\uFF0C\u6216\u6307\u5B9A ["read_file", "list_dir"] \u9650\u5236\u5DE5\u5177', {
    x: 0.8, y: 4.8, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 6);
})();

// ==========================================
// SLIDE 7 — Prerequisites & tips
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u524D\u7F6E\u9700\u6C42\u8207\u6CE8\u610F\u4E8B\u9805", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Prerequisites
  s.addText("\u524D\u7F6E\u9700\u6C42", { x: 0.8, y: 1.2, w: 3, h: 0.35, fontSize: 16, fontFace: FB, color: C.blue, bold: true, align: "left" });

  const prereqs = [
    { text: "pip install github-copilot-sdk", desc: "Python SDK", color: C.green },
    { text: "npm --version", desc: "Node.js + npx\uFF08local MCP \u9700\u8981\uFF09", color: C.orange },
  ];
  prereqs.forEach((p, i) => {
    const py = 1.65 + i * 0.7;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 8.4, h: 0.55, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 0.05, h: 0.55, fill: { color: p.color } });
    s.addText(p.text, { x: 1.1, y: py, w: 4.5, h: 0.55, fontSize: 12, fontFace: FC, color: p.color, align: "left", valign: "middle" });
    s.addText(p.desc, { x: 5.8, y: py, w: 3.2, h: 0.55, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Tips
  s.addText("\u6CE8\u610F\u4E8B\u9805", { x: 0.8, y: 3.2, w: 3, h: 0.35, fontSize: 16, fontFace: FB, color: C.yellow, bold: true, align: "left" });

  const tips = [
    "npx -y \u65D7\u6A19\u53EF\u81EA\u52D5\u5B89\u88DD\u5957\u4EF6\uFF0C\u7701\u53BB\u624B\u52D5\u5B89\u88DD\u6B65\u9A5F",
    "MCP server \u7684\u5DE5\u5177\u540D\u7A31\u7531 server \u5B9A\u7FA9\uFF0CAI \u6703\u81EA\u52D5\u767C\u73FE",
    "\u53EF\u540C\u6642\u9023\u63A5\u591A\u500B MCP server\uFF0C\u5404\u7D66\u4E0D\u540C\u540D\u7A31",
    'tools: ["*"] \u66B4\u9732\u6240\u6709\u5DE5\u5177\uFF0C\u6216\u6307\u5B9A\u7279\u5B9A\u5DE5\u5177\u540D\u7A31\u9650\u5236\u7BC4\u570D',
  ];
  tips.forEach((t, i) => {
    s.addText(t, {
      x: 1.1, y: 3.65 + i * 0.4, w: 8.0, h: 0.35,
      fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
      bullet: true,
    });
  });

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

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText([
    { text: "MCP \u662F AI \u5DE5\u5177\u670D\u52D9\u5668\u7684\u6A19\u6E96\u5354\u5B9A", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "local (stdio) vs remote (HTTP)", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "mcp_servers dict \u50B3\u5165 session", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "NPM \u751F\u614B\u7CFB\u6709\u5927\u91CF\u73FE\u6210 server", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.orange } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left" });
  s.addText("\u7B2C 08 \u8AB2\uFF1A\u81EA\u5E36 API Key", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u63DB\u6210 OpenAI / Azure /\nOllama \u7684\u6A21\u578B", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.orange, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300CMCP \u8B93 AI \u7684\u80FD\u529B\u4E0D\u518D\u53D7\u9650\u65BC\u5167\u5EFA\u5DE5\u5177\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.blue, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/07_mcp_server/slides.pptx" })
  .then(() => console.log("07_mcp_server/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
