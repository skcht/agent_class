const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 19 課：結構化記憶壓縮 — Compact Prompt";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 19 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.cyan } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.cyan } });
  s.addText("LESSON 19", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("\u7D50\u69CB\u5316\u8A18\u61B6\u58D3\u7E2E", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 42, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u501F\u93E1 Claude Code \u7684 Compact Prompt \u8A2D\u8A08", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "<analysis> AI \u601D\u8003\u904E\u7A0B </analysis>", options: { color: C.gray, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "<summary>", options: { color: C.cyan, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "  1. \u505A\u4E86\u4EC0\u9EBC  2. \u95DC\u9375\u4E8B\u5BE6", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "  3. \u932F\u8AA4\u4FEE\u5FA9  4. \u4E0B\u4E00\u6B65", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "</summary>", options: { color: C.cyan, fontFace: FC, fontSize: 10.5 } },
  ], { x: 5.4, y: 3.85, w: 4.1, h: 1.1, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Problem: free-form vs structured
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u81EA\u7531\u683C\u5F0F vs \u7D50\u69CB\u5316\u6458\u8981", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Free-form (lesson 18)
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("\u7B2C 18 \u8AB2\uFF1A\u300C\u8ACB\u7528 2-3 \u53E5\u8A71\u7E3D\u7D50\u300D", { x: 0.7, y: 1.4, w: 3.9, h: 0.4, fontSize: 13, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "\u2717 \u932F\u8AA4\u4FEE\u5FA9\u5E38\u88AB\u7701\u7565", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2717 \u5F85\u8FA6\u4E8B\u9805\u901A\u5E38\u4E0D\u63D0", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2717 \u54C1\u8CEA\u4E0D\u7A69\u5B9A\uFF0C\u6BCF\u6B21\u4E0D\u540C", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2717 \u6A94\u540D\u3001\u6280\u8853\u7D30\u7BC0\u5E38\u4E1F\u5931", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.9, w: 3.7, h: 1.6, valign: "top", paraSpaceAfter: 4 });

  // Structured (this lesson)
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u672C\u8AB2\uFF1ACompact Prompt \u7D50\u69CB\u5316 4 \u6BB5", { x: 5.4, y: 1.4, w: 3.9, h: 0.4, fontSize: 13, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "\u2713 \u932F\u8AA4\u4FEE\u5FA9\u5C08\u5C6C\u6BB5\u843D\u8A18\u9304", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2713 \u4E0B\u4E00\u6B65\u6C38\u9060\u6709\u5EFA\u8B70", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2713 \u7D50\u69CB\u5316\u7D04\u675F\uFF0C\u54C1\u8CEA\u7A69\u5B9A", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u2713 \u95DC\u9375\u4E8B\u5BE6\u5FC5\u5B9A\u88AB\u4FDD\u7559", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.6, y: 1.9, w: 3.7, h: 1.6, valign: "top", paraSpaceAfter: 4 });

  // Four sections preview
  s.addText("\u56DB\u6BB5\u5F0F\u6458\u8981\u7D50\u69CB", { x: 0.8, y: 4.0, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const sections = [
    { num: "1", name: "\u505A\u4E86\u4EC0\u9EBC", color: C.blue },
    { num: "2", name: "\u95DC\u9375\u4E8B\u5BE6", color: C.green },
    { num: "3", name: "\u932F\u8AA4\u4FEE\u5FA9", color: C.orange },
    { num: "4", name: "\u4E0B\u4E00\u6B65", color: C.purple },
  ];
  sections.forEach((sec, i) => {
    const sx = 0.5 + i * 2.35;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 4.35, w: 2.15, h: 0.6, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 4.35, w: 2.15, h: 0.04, fill: { color: sec.color } });
    s.addText(`${sec.num}. ${sec.name}`, { x: sx, y: 4.39, w: 2.15, h: 0.55, fontSize: 12, fontFace: FB, color: sec.color, bold: true, align: "center", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Analysis + Summary two-phase
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("<analysis> + <summary>", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u5148\u601D\u8003\u518D\u56DE\u7B54 \u2014 \u63D0\u5347\u6458\u8981\u54C1\u8CEA", { x: 0.8, y: 1.0, w: 8.4, h: 0.3, fontSize: 14, fontFace: FB, color: C.grayLight, align: "left" });

  // Analysis block
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 4.3, h: 1.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 0.06, h: 1.8, fill: { color: C.gray } });
  s.addText("<analysis>", { x: 0.7, y: 1.55, w: 3.9, h: 0.3, fontSize: 14, fontFace: FC, color: C.gray, bold: true, align: "left" });
  s.addText("\u8349\u7A3F\u5340 \u2014 AI \u6574\u7406\u601D\u8DEF", { x: 0.7, y: 1.85, w: 3.9, h: 0.3, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left" });
  s.addText([
    { text: "User asked about FastAPI...", options: { color: C.grayDim, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "422 error was due to missing...", options: { color: C.grayDim, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "We used PostgreSQL with...", options: { color: C.grayDim, fontFace: FC, fontSize: 10 } },
  ], { x: 0.7, y: 2.2, w: 3.9, h: 0.9, valign: "top" });
  s.addText("\u4E0D\u5B58\u5165\u8A18\u61B6", { x: 2.0, y: 3.05, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.red, bold: true, align: "center" });

  // Summary block
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.5, w: 4.3, h: 1.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.5, w: 0.06, h: 1.8, fill: { color: C.cyan } });
  s.addText("<summary>", { x: 5.4, y: 1.55, w: 3.9, h: 0.3, fontSize: 14, fontFace: FC, color: C.cyan, bold: true, align: "left" });
  s.addText("\u6B63\u5F0F\u5831\u544A \u2014 \u7D50\u69CB\u5316 4 \u6BB5", { x: 5.4, y: 1.85, w: 3.9, h: 0.3, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left" });
  s.addText([
    { text: "1. \u505A\u4E86\u4EC0\u9EBC: ...", options: { color: C.blue, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "2. \u95DC\u9375\u4E8B\u5BE6: FastAPI, PostgreSQL", options: { color: C.green, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "3. \u932F\u8AA4\u4FEE\u5FA9: 422 \u2192 \u52A0 response_model", options: { color: C.orange, fontFace: FC, fontSize: 10, breakLine: true } },
    { text: "4. \u4E0B\u4E00\u6B65: \u52A0\u5165\u8A8D\u8B49", options: { color: C.purple, fontFace: FC, fontSize: 10 } },
  ], { x: 5.4, y: 2.2, w: 3.9, h: 0.9, valign: "top" });
  s.addText("\u5B58\u5165\u8A18\u61B6", { x: 6.6, y: 3.05, w: 1.5, h: 0.25, fontSize: 11, fontFace: FB, color: C.green, bold: true, align: "center" });

  // Pipeline
  s.addText("\u8655\u7406\u6D41\u7A0B", { x: 0.8, y: 3.5, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const pipe = [
    { label: "Compact\nPrompt", color: C.blue },
    { label: "AI \u8F38\u51FA\nanalysis\n+ summary", color: C.purple },
    { label: "format()\n\u5265\u9664 analysis\n\u63D0\u53D6 summary", color: C.orange },
    { label: "\u5B58\u5165\nmemory.json", color: C.green },
  ];
  pipe.forEach((p, i) => {
    const px = 0.3 + i * 2.4;
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: 3.9, w: 2.1, h: 0.9, fill: { color: C.bgCard }, line: { color: p.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: 3.9, w: 2.1, h: 0.04, fill: { color: p.color } });
    s.addText(p.label, { x: px, y: 3.95, w: 2.1, h: 0.8, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < pipe.length - 1) {
      s.addText("\u25B6", { x: px + 2.1, y: 3.9, w: 0.3, h: 0.9, fontSize: 12, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Claude Code 9 vs our 4 sections
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Claude Code 9 \u6BB5 vs \u672C\u8AB2 4 \u6BB5", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Our 4 sections
  const our = [
    { num: "1", name: "What was accomplished", merged: "\u5408\u4F75\u539F\u7248 1, 5", color: C.blue },
    { num: "2", name: "Key facts", merged: "\u5408\u4F75\u539F\u7248 2, 3, 6", color: C.green },
    { num: "3", name: "Errors and fixes", merged: "\u4FDD\u7559\u539F\u7248 4", color: C.orange },
    { num: "4", name: "Next step", merged: "\u5408\u4F75\u539F\u7248 7, 8, 9", color: C.purple },
  ];

  our.forEach((o, i) => {
    const oy = 1.2 + i * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 8.4, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 0.06, h: 0.65, fill: { color: o.color } });
    s.addShape(pres.shapes.OVAL, { x: 1.1, y: oy + 0.1, w: 0.4, h: 0.4, fill: { color: o.color } });
    s.addText(o.num, { x: 1.1, y: oy + 0.1, w: 0.4, h: 0.4, fontSize: 14, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
    s.addText(o.name, { x: 1.7, y: oy, w: 4.0, h: 0.65, fontSize: 14, fontFace: FB, color: o.color, bold: true, align: "left", valign: "middle" });
    s.addText(o.merged, { x: 6.0, y: oy, w: 3.0, h: 0.65, fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  // Why 4 is enough
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addText("\u4EFB\u52D9\u578B Agent \u4E0D\u9700\u8981\u8A18\u4F4F\u300C\u4F7F\u7528\u8005\u7684\u6BCF\u53E5\u8A71\u300D\u2014 \u53EA\u9700\u77E5\u9053\u505A\u4E86\u4EC0\u9EBC\u3001\u4EC0\u9EBC\u91CD\u8981\u3001\u63A5\u4E0B\u4F86\u505A\u4EC0\u9EBC", {
    x: 1.0, y: 4.5, w: 8.0, h: 0.5, fontSize: 12, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Advanced: separate session + cheap model
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u9032\u968E\uFF1A\u7368\u7ACB Session + \u4FBF\u5B9C\u6A21\u578B", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 30, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Architecture diagram
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.3, w: 3.5, h: 1.5, fill: { color: C.bgCard }, line: { color: C.blue, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.3, y: 1.3, w: 3.5, h: 0.04, fill: { color: C.blue } });
  s.addText("\u4E3B\u5C0D\u8A71 Session\nclaude-sonnet-4.6\n(\u5F37\u6A21\u578B)", { x: 0.3, y: 1.35, w: 3.5, h: 1.4, fontSize: 12, fontFace: FB, color: C.blue, align: "center", valign: "middle" });

  s.addText("\u6536\u96C6\u5C0D\u8A71\n\u7D00\u9304", { x: 3.8, y: 1.5, w: 1.0, h: 1.0, fontSize: 10, fontFace: FB, color: C.gray, align: "center", valign: "middle" });
  s.addText("\u25B6", { x: 4.6, y: 1.5, w: 0.5, h: 1.0, fontSize: 14, color: C.grayDim, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 1.5, fill: { color: C.bgCard }, line: { color: C.green, width: 2 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.04, fill: { color: C.green } });
  s.addText("\u6458\u8981 Session\ngpt-5.4-mini\n(\u4FBF\u5B9C\u3001\u5FEB\u901F)", { x: 5.2, y: 1.35, w: 4.3, h: 1.4, fontSize: 12, fontFace: FB, color: C.green, align: "center", valign: "middle" });

  // Three reasons
  s.addText("\u70BA\u4EC0\u9EBC\u7528\u7368\u7ACB Session\uFF1F", { x: 0.8, y: 3.1, w: 4, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const reasons = [
    { title: "\u6A21\u578B\u6210\u672C", desc: "\u6458\u8981\u4E0D\u9700\u8981\u5F37\u6A21\u578B\uFF0C\u7528\u4FBF\u5B9C\u7684\u5C31\u5920", color: C.green },
    { title: "Timeout \u98A8\u96AA", desc: "send_and_wait \u9810\u8A2D 60 \u79D2\uFF0C\u6458\u8981\u53EF\u80FD\u8D85\u6642", color: C.orange },
    { title: "\u975E\u963B\u585E", desc: "send() + \u4E8B\u4EF6\u76E3\u807D\uFF0C\u4E0D\u5361\u4F4F\u4E3B\u6D41\u7A0B", color: C.blue },
  ];
  reasons.forEach((r, i) => {
    const rx = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 3.55, w: 2.8, h: 0.75, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: rx, y: 3.55, w: 2.8, h: 0.04, fill: { color: r.color } });
    s.addText(r.title, { x: rx + 0.1, y: 3.6, w: 2.6, h: 0.3, fontSize: 12, fontFace: FB, color: r.color, bold: true, align: "left", valign: "middle" });
    s.addText(r.desc, { x: rx + 0.1, y: 3.9, w: 2.6, h: 0.35, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  // Key code
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.45, w: 9.0, h: 0.55, fill: { color: C.bgCard } });
  s.addText([
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "session.", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "send", options: { color: C.green, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: "(prompt)  ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "# \u975E\u963B\u585E\u9001\u51FA\uFF0C\u4E8B\u4EF6\u76E3\u807D\u7B49\u7D50\u679C", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 4.45, w: 8.6, h: 0.55, valign: "middle" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Key functions
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u6838\u5FC3\u51FD\u5F0F\u5C0D\u7167", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const funcs = [
    { py: "get_compact_prompt()", ts: "getCompactPrompt()", desc: "\u7D44\u5408 compact prompt\uFF08\u542B\u5C0D\u8A71\u7D00\u9304\uFF09", color: C.blue },
    { py: "format_compact_summary()", ts: "formatCompactSummary()", desc: "\u5265\u9664 analysis\u3001\u63D0\u53D6 summary", color: C.orange },
    { py: "build_continuation_message()", ts: "getCompactUserSummaryMessage()", desc: "\u5305\u88DD\u6210\u4E0B\u6B21 session \u7684\u4E0A\u4E0B\u6587", color: C.green },
    { py: "summarize_conversation()", ts: "\u2014", desc: "\u7368\u7ACB session + \u4FBF\u5B9C\u6A21\u578B\u505A\u6458\u8981", color: C.purple },
  ];

  // Headers
  s.addText("Python (\u672C\u8AB2)", { x: 0.8, y: 1.1, w: 3.5, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });
  s.addText("Claude Code (TS)", { x: 4.5, y: 1.1, w: 3.0, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });

  funcs.forEach((f, i) => {
    const fy = 1.35 + i * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 8.4, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 0.06, h: 0.65, fill: { color: f.color } });
    s.addText(f.py, { x: 1.1, y: fy, w: 3.2, h: 0.33, fontSize: 11, fontFace: FC, color: f.color, bold: true, align: "left", valign: "middle" });
    s.addText(f.ts, { x: 4.5, y: fy, w: 3.0, h: 0.33, fontSize: 10, fontFace: FC, color: C.gray, align: "left", valign: "middle" });
    s.addText(f.desc, { x: 1.1, y: fy + 0.33, w: 8.0, h: 0.28, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Custom instructions
  s.addText("Custom Instructions", { x: 0.8, y: 4.55, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText([
    { text: '\u9664\u932F\u5C0E\u5411: "\u91CD\u9EDE\u8A18\u9304\u932F\u8AA4\u8A0A\u606F\u548C\u4FEE\u5FA9\u6B65\u9A5F"   ', options: { color: C.orange, fontFace: FC, fontSize: 10 } },
    { text: '\u500B\u4EBA\u5316: "\u91CD\u9EDE\u8A18\u9304\u4F7F\u7528\u8005\u7684\u500B\u4EBA\u8CC7\u8A0A\u548C\u504F\u597D"', options: { color: C.blue, fontFace: FC, fontSize: 10 } },
  ], { x: 0.8, y: 4.85, w: 8.4, h: 0.25, valign: "middle" });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — format_compact_summary code
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("format_compact_summary()", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 26, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "format_compact_summary", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(raw_summary):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    result = raw_summary", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "    # 1. \u5265\u9664 analysis\uFF08\u8349\u7A3F\u4E0D\u4FDD\u7559\uFF09", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    result = re.sub(r"<analysis>[\\s\\S]*?</analysis>", "", result)', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "    # 2. \u63D0\u53D6 summary \u5167\u5BB9", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    match = re.search(r"<summary>([\\s\\S]*?)</summary>", result)', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "match:", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '        result = f"Summary:\\n{match.group(1).strip()}"', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "    # 3. \u6E05\u7406\u591A\u9918\u7A7A\u884C", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 're.sub(r"\\n\\n+", "\\n\\n", result).strip()', options: { color: C.grayLight, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 2.3, valign: "top" });

  // build_continuation_message
  s.addText("build_continuation_message()", { x: 0.8, y: 3.65, w: 5, h: 0.3, fontSize: 13, fontFace: FC, color: C.green, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.0, w: 9.0, h: 1.0, fill: { color: C.bgCard } });
  s.addText([
    { text: '"This session is being continued from a previous', options: { color: C.green, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: ' conversation that ran out of context...\\n"', options: { color: C.green, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "f\"{formatted}\\n\"", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '"Continue the conversation from where it left off."', options: { color: C.green, fontFace: FC, fontSize: 10.5 } },
  ], { x: 0.7, y: 4.05, w: 8.6, h: 0.9, valign: "top" });

  addFooter(s);
  addNum(s, 7);
})();

// SLIDE 8 — Summary (final lesson!)
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "left" });
  s.addText([
    { text: "Compact Prompt \u7D50\u69CB\u5316 4 \u6BB5\u6458\u8981", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "<analysis> \u601D\u8003 + <summary> \u8F38\u51FA", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "format \u5265\u9664\u8349\u7A3F\u3001\u63D0\u53D6\u7CBE\u83EF", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u7368\u7ACB session + \u4FBF\u5B9C\u6A21\u578B\u7701\u6210\u672C", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  // Series complete!
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.yellow } });
  s.addText("\u7CFB\u5217\u5B8C\u6210\uFF01", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.yellow, bold: true, align: "left" });
  s.addText("\u5168 19 \u8AB2\u5B8C\u6574\u6DB5\u84CB", { x: 6.25, y: 2.0, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("Copilot SDK Python\n\u5F9E\u5165\u9580\u5230\u9032\u968E", { x: 6.25, y: 2.45, w: 3.0, h: 0.6, fontSize: 14, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText([
    { text: "\u57FA\u790E (1-4) \u2192 \u5DE5\u5177 (5-8)", options: { color: C.grayLight, fontFace: FB, fontSize: 11, breakLine: true } },
    { text: "Agent (9-13) \u2192 \u53EF\u89C0\u6E2C (14-15)", options: { color: C.grayLight, fontFace: FB, fontSize: 11, breakLine: true } },
    { text: "\u9032\u968E (16-19)", options: { color: C.grayLight, fontFace: FB, fontSize: 11 } },
  ], { x: 6.25, y: 3.1, w: 3.0, h: 0.9, valign: "top" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u7D50\u69CB\u5316\u7684\u8A18\u61B6 = \u66F4\u806F\u660E\u7684 Agent\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.cyan, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/19_compact_memory/slides.pptx" })
  .then(() => console.log("19_compact_memory/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
