const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 05 課：自訂工具 — @define_tool + Pydantic";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 05 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.purple } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.purple } });
  s.addText("LESSON 05", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("\u81EA\u8A02\u5DE5\u5177", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("@define_tool + Pydantic \u2014 \u8B93 AI \u547C\u53EB\u4F60\u5BEB\u7684 Python \u51FD\u5F0F", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  // Decorative code
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "@define_tool", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '(description="...")', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "async def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "get_weather", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(params):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    return "28\u00B0C, \u591A\u96F2"', options: { color: C.green, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — Why custom tools?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u9700\u8981\u81EA\u8A02\u5DE5\u5177\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Without tools
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 1.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("\u7121\u81EA\u8A02\u5DE5\u5177", { x: 0.7, y: 1.4, w: 3.9, h: 0.35, fontSize: 14, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "AI \u53EA\u80FD\u7528\u5167\u5EFA\u5DE5\u5177", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u7121\u6CD5\u5B58\u53D6\u4F60\u7684 API / \u8CC7\u6599\u5EAB", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u7121\u6CD5\u57F7\u884C\u7279\u5B9A\u696D\u52D9\u908F\u8F2F", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.85, w: 3.7, h: 1.1, valign: "top", paraSpaceAfter: 4 });

  // With tools
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 1.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("\u6709\u81EA\u8A02\u5DE5\u5177", { x: 5.4, y: 1.4, w: 3.9, h: 0.35, fontSize: 14, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "AI \u53EF\u4EE5\u547C\u53EB\u4F60\u5BEB\u7684\u51FD\u5F0F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u67E5\u5929\u6C23\u3001\u67E5\u8CC7\u6599\u5EAB\u3001\u547C\u53EB API", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "\u7121\u9650\u64F4\u5145 Agent \u80FD\u529B", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.6, y: 1.85, w: 3.7, h: 1.1, valign: "top", paraSpaceAfter: 4 });

  // Flow: User asks → AI decides → calls your tool → returns result
  s.addText("\u904B\u4F5C\u6D41\u7A0B", { x: 0.8, y: 3.4, w: 2, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const flow = [
    { label: "\u4F7F\u7528\u8005\u63D0\u554F", color: C.blue, x: 0.5 },
    { label: "AI \u5224\u65B7\n\u9700\u8981\u5DE5\u5177", color: C.purple, x: 2.5 },
    { label: "\u547C\u53EB\u4F60\u7684\n\u81EA\u8A02\u51FD\u5F0F", color: C.green, x: 4.5 },
    { label: "\u51FD\u5F0F\u56DE\u50B3\n\u7D50\u679C", color: C.orange, x: 6.5 },
    { label: "AI \u7D44\u5408\n\u6700\u7D42\u56DE\u8986", color: C.cyan, x: 8.2 },
  ];
  flow.forEach((f, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 3.9, w: 1.5, h: 0.85, fill: { color: C.bgCard }, line: { color: f.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 3.9, w: 1.5, h: 0.04, fill: { color: f.color } });
    s.addText(f.label, { x: f.x, y: 3.95, w: 1.5, h: 0.75, fontSize: 10, fontFace: FB, color: C.white, align: "center", valign: "middle" });
    if (i < flow.length - 1) {
      s.addText("\u25B6", { x: f.x + 1.5, y: 3.9, w: flow[i + 1].x - f.x - 1.5, h: 0.85, fontSize: 14, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Four steps
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5B9A\u7FA9\u5DE5\u5177\u56DB\u6B65\u9A5F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const steps = [
    { num: "1", title: "\u5B9A\u7FA9\u53C3\u6578\u7D50\u69CB", code: "class WeatherParams(BaseModel):\n    city: str = Field(description=\"...\")", color: C.blue },
    { num: "2", title: "\u88DD\u98FE\u5668 + async \u51FD\u5F0F", code: "@define_tool(description=\"...\")\nasync def get_weather(params):", color: C.purple },
    { num: "3", title: "\u51FD\u5F0F\u56DE\u50B3 str", code: "return \"28\u00B0C, \u591A\u96F2\"", color: C.green },
    { num: "4", title: "\u50B3\u5165 create_session", code: "tools=[get_weather, calculator]", color: C.orange },
  ];

  steps.forEach((st, i) => {
    const sy = 1.25 + i * 0.95;

    // Number circle
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: sy + 0.1, w: 0.5, h: 0.5, fill: { color: st.color } });
    s.addText(st.num, { x: 0.8, y: sy + 0.1, w: 0.5, h: 0.5, fontSize: 18, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

    // Title
    s.addText(st.title, { x: 1.5, y: sy, w: 3.0, h: 0.35, fontSize: 15, fontFace: FB, color: st.color, bold: true, align: "left", valign: "middle" });

    // Code
    s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y: sy + 0.35, w: 7.7, h: 0.5, fill: { color: C.bgCard } });
    s.addText(st.code, { x: 1.7, y: sy + 0.35, w: 7.3, h: 0.5, fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Bottom note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.3, fill: { color: C.bgCard } });
  s.addText("Pydantic \u6A21\u578B\u5FC5\u9808\u5B9A\u7FA9\u5728\u6A21\u7D44\u5C64\u7D1A\uFF08\u4E0D\u80FD\u5728\u51FD\u5F0F\u5167\uFF09", {
    x: 1.0, y: 4.85, w: 8.0, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.yellow, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Code: Pydantic model
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Step 1 \u2014 Pydantic \u53C3\u6578\u6A21\u578B", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Weather model
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 4.3, h: 2.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 0.06, h: 2.2, fill: { color: C.blue } });
  s.addText("\u5929\u6C23\u67E5\u8A62\u5DE5\u5177", { x: 0.8, y: 1.15, w: 3.8, h: 0.35, fontSize: 14, fontFace: FB, color: C.blue, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "class ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "WeatherParams", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(BaseModel):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    city: ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "str", options: { color: C.cyan, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: " = Field(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        description=', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"City name"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    )", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.8, y: 1.6, w: 3.8, h: 1.5, valign: "top" });

  // Calculator model
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 4.3, h: 2.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 0.06, h: 2.2, fill: { color: C.orange } });
  s.addText("\u8A08\u7B97\u6A5F\u5DE5\u5177", { x: 5.5, y: 1.15, w: 3.8, h: 0.35, fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "class ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "CalculatorParams", options: { color: C.orange, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(BaseModel):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    expression: ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "str", options: { color: C.cyan, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: " = Field(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        description=', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"Math expression"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    )", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 5.5, y: 1.6, w: 3.8, h: 1.5, valign: "top" });

  // Key points
  s.addText("\u91CD\u9EDE\u89E3\u6790", { x: 0.8, y: 3.6, w: 2, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const points = [
    { text: "BaseModel", desc: "Pydantic \u57FA\u790E\u985E\u5225\uFF0C\u81EA\u52D5\u9A57\u8B49\u578B\u5225", color: C.purple },
    { text: "Field(description=...)", desc: "AI \u770B\u5F97\u5230\u7684\u53C3\u6578\u8AAA\u660E\uFF0C\u6C7A\u5B9A\u5982\u4F55\u50B3\u503C", color: C.green },
    { text: "\u578B\u5225\u6CE8\u89E3 str/int/float", desc: "AI \u77E5\u9053\u8A72\u50B3\u4EC0\u9EBC\u578B\u5225\u7684\u503C", color: C.cyan },
  ];
  points.forEach((p, i) => {
    const py = 4.05 + i * 0.35;
    s.addText(p.text, { x: 0.8, y: py, w: 3.5, h: 0.3, fontSize: 11, fontFace: FC, color: p.color, bold: true, align: "left", valign: "middle" });
    s.addText(p.desc, { x: 4.5, y: py, w: 5.0, h: 0.3, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Code: @define_tool function
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Step 2-3 \u2014 \u88DD\u98FE\u5668 + \u51FD\u5F0F\u5BE6\u4F5C", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 4.0, fill: { color: C.bgCard } });

  const codeLines = [
    [{ text: "@define_tool", color: C.purple }, { text: "(", color: C.white }, { text: 'description=', color: C.white }, { text: '"Get current weather for a city"', color: C.green }, { text: ")", color: C.white }],
    [{ text: "async def ", color: C.purple }, { text: "get_weather", color: C.blue }, { text: "(params: ", color: C.white }, { text: "WeatherParams", color: C.blue }, { text: ") -> ", color: C.white }, { text: "str", color: C.cyan }, { text: ":", color: C.white }],
    [{ text: "    weather_data = {", color: C.grayLight }],
    [{ text: '        "Taipei": "28\u00B0C, \u591A\u96F2",', color: C.grayLight }],
    [{ text: '        "Tokyo":  "22\u00B0C, \u6674\u5929",', color: C.grayLight }],
    [{ text: "    }", color: C.grayLight }],
    [{ text: "    result = weather_data.get(params.city, ", color: C.white }, { text: '"查無資料"', color: C.green }, { text: ")", color: C.white }],
    [{ text: "    ", color: C.white }, { text: "return ", color: C.purple }, { text: "result", color: C.white }],
    [],
    [],
    [{ text: "@define_tool", color: C.purple }, { text: "(", color: C.white }, { text: 'description=', color: C.white }, { text: '"Evaluate a math expression"', color: C.green }, { text: ")", color: C.white }],
    [{ text: "async def ", color: C.purple }, { text: "calculator", color: C.orange }, { text: "(params: ", color: C.white }, { text: "CalculatorParams", color: C.orange }, { text: ") -> ", color: C.white }, { text: "str", color: C.cyan }, { text: ":", color: C.white }],
    [{ text: "    # \u5B89\u5168\u904E\u6FFE\u5B57\u5143\u5F8C\u8A08\u7B97", color: C.gray }],
    [{ text: "    result = ", color: C.white }, { text: "eval", color: C.blue }, { text: "(params.expression)", color: C.white }],
    [{ text: "    ", color: C.white }, { text: "return ", color: C.purple }, { text: "str", color: C.cyan }, { text: "(result)", color: C.white }],
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

  s.addText(runs, { x: 0.8, y: 1.1, w: 7.5, h: 3.8, valign: "top", margin: 0 });

  // Annotations
  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.1, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 AI \u770B\u5230\u7684\u8AAA\u660E", { x: 7.8, y: 1.1, w: 1.5, h: 0.4, fontSize: 9, fontFace: FB, color: C.purple, bold: true, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 7.8, y: 1.55, w: 1.5, h: 0.4, fill: { color: C.bgDark } });
  s.addText("\u2190 \u5FC5\u9808 async\n   \u56DE\u50B3 str", { x: 7.8, y: 1.55, w: 1.5, h: 0.4, fontSize: 9, fontFace: FB, color: C.cyan, bold: true, align: "center", valign: "middle" });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Code: using tools
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Step 4 \u2014 \u50B3\u5165 Session", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.3, w: 8.4, h: 2.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "async with ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: '    model=', options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: '"claude-sonnet-4.6"', options: { color: C.green, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: "    tools=", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "[get_weather, calculator]", options: { color: C.orange, fontFace: FC, fontSize: 14, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: "    on_permission_request=", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "PermissionHandler.approve_all", options: { color: C.blue, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: true } },
    { text: ") ", options: { color: C.white, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "as ", options: { color: C.purple, fontFace: FC, fontSize: 14, breakLine: false } },
    { text: "session:", options: { color: C.white, fontFace: FC, fontSize: 14 } },
  ], { x: 1.0, y: 1.4, w: 8.0, h: 2.0, valign: "top" });

  // Arrow highlight
  s.addText("\u2191 \u50B3\u5165\u4F60\u5B9A\u7FA9\u7684\u5DE5\u5177\u5217\u8868", {
    x: 2.0, y: 3.55, w: 5.0, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "center",
  });

  // Import reminder
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.1, w: 8.4, h: 0.7, fill: { color: C.bgCard } });
  s.addText("\u5FC5\u8981 Import", { x: 1.0, y: 4.15, w: 2, h: 0.25, fontSize: 12, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText([
    { text: "from ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "pydantic ", options: { color: C.white, fontFace: FC, fontSize: 12 } },
    { text: "import ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "BaseModel, Field", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "from ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "copilot ", options: { color: C.white, fontFace: FC, fontSize: 12 } },
    { text: "import ", options: { color: C.purple, fontFace: FC, fontSize: 12 } },
    { text: "CopilotClient, PermissionHandler, define_tool", options: { color: C.blue, fontFace: FC, fontSize: 12 } },
  ], { x: 1.0, y: 4.42, w: 8.0, h: 0.35, valign: "middle" });

  addFooter(s);
  addNum(s, 6);
})();

// ==========================================
// SLIDE 7 — Options & gotchas
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5DE5\u5177\u9078\u9805\u8207\u6CE8\u610F\u4E8B\u9805", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Options
  s.addText("\u5DE5\u5177\u9078\u9805", { x: 0.8, y: 1.2, w: 3, h: 0.35, fontSize: 16, fontFace: FB, color: C.blue, bold: true, align: "left" });

  const opts = [
    { opt: "skip_permission=True", desc: "\u57F7\u884C\u6642\u4E0D\u89F8\u767C\u6B0A\u9650\u63D0\u793A\uFF0C\u9069\u5408\u5B89\u5168\u7684\u5DE5\u5177", color: C.green },
    { opt: "overrides_built_in_tool=True", desc: "\u8986\u84CB\u5167\u5EFA\u5DE5\u5177\uFF0C\u63DB\u6210\u4F60\u7684\u5BE6\u4F5C", color: C.orange },
  ];
  opts.forEach((o, i) => {
    const oy = 1.65 + i * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 8.4, h: 0.65, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 0.05, h: 0.65, fill: { color: o.color } });
    s.addText(o.opt, { x: 1.1, y: oy, w: 5.0, h: 0.32, fontSize: 12, fontFace: FC, color: o.color, bold: true, align: "left", valign: "bottom" });
    s.addText(o.desc, { x: 1.1, y: oy + 0.32, w: 7.9, h: 0.28, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  // Gotchas
  s.addText("\u6CE8\u610F\u4E8B\u9805", { x: 0.8, y: 3.3, w: 3, h: 0.35, fontSize: 16, fontFace: FB, color: C.yellow, bold: true, align: "left" });

  const gotchas = [
    { text: "Pydantic \u6A21\u578B\u5FC5\u9808\u5B9A\u7FA9\u5728\u6A21\u7D44\u5C64\u7D1A", desc: "\u4E0D\u80FD\u653E\u5728 async def \u5167\u90E8\uFF0C\u5426\u5247 SDK \u7121\u6CD5\u8B58\u5225" },
    { text: "\u51FD\u5F0F\u5FC5\u9808\u662F async\uFF0C\u56DE\u50B3\u5FC5\u9808\u662F str", desc: "\u5373\u4F7F\u662F\u6578\u5B57\u7D50\u679C\u4E5F\u8981\u8F49\u6210 str(result)" },
    { text: "description \u6C7A\u5B9A AI \u4F55\u6642\u547C\u53EB\u5DE5\u5177", desc: "\u5BEB\u6E05\u695A\u529F\u80FD\u8AAA\u660E\uFF0CAI \u624D\u6703\u5728\u6B63\u78BA\u6642\u6A5F\u4F7F\u7528" },
  ];
  gotchas.forEach((g, i) => {
    const gy = 3.75 + i * 0.55;
    s.addText(g.text, { x: 1.1, y: gy, w: 8.0, h: 0.28, fontSize: 12, fontFace: FB, color: C.yellow, bold: true, align: "left", valign: "middle" });
    s.addText(g.desc, { x: 1.1, y: gy + 0.25, w: 8.0, h: 0.25, fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
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
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText([
    { text: "BaseModel \u5B9A\u7FA9\u53C3\u6578\u7D50\u69CB", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "@define_tool \u88DD\u98FE async \u51FD\u5F0F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "tools=[...] \u50B3\u5165 session", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "AI \u81EA\u52D5\u5224\u65B7\u4F55\u6642\u547C\u53EB\u5DE5\u5177", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.green } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText("\u7B2C 06 \u8AB2\uFF1ASession Hook", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u5728 AI \u884C\u70BA\u524D\u5F8C\n\u63D2\u5165\u4F60\u7684\u81EA\u8A02\u908F\u8F2F", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u8B93 AI \u547C\u53EB\u4F60\u5BEB\u7684 Python \u51FD\u5F0F \u2014 \u7121\u9650\u64F4\u5145 Agent \u80FD\u529B\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.purple, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/05_custom_tools/slides.pptx" })
  .then(() => console.log("05_custom_tools/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
