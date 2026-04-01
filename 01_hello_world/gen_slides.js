const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 01 課：Hello World — Copilot SDK 最小可運行範例";

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
  white: "FFFFFF",
  gray: "8B949E",
  grayLight: "C9D1D9",
  grayDim: "484F58",
};

const FOOTER_TEXT = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 01 \u8AB2";
const FONT_TITLE = "Arial Black";
const FONT_BODY = "Calibri";
const FONT_CODE = "Consolas";

function addFooter(slide) {
  slide.addText(FOOTER_TEXT, {
    x: 4.5, y: 5.15, w: 5.2, h: 0.35,
    fontSize: 9, fontFace: FONT_BODY, color: C.grayDim,
    align: "right", valign: "bottom",
  });
}

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 0.3, y: 5.15, w: 1, h: 0.35,
    fontSize: 9, fontFace: FONT_BODY, color: C.grayDim,
    align: "left", valign: "bottom",
  });
}

const TOTAL_SLIDES = 8;

// ==========================================
// SLIDE 1 — Title
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  // Decorative top bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue },
  });

  // Lesson number badge
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.blue },
    rectRadius: 0.05,
  });
  slide.addText("LESSON 01", {
    x: 0.8, y: 1.2, w: 1.1, h: 0.45,
    fontSize: 13, fontFace: FONT_BODY, color: C.bgDark,
    bold: true, align: "center", valign: "middle",
  });

  // Title
  slide.addText("Hello World", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", valign: "middle", margin: 0,
  });

  // Subtitle
  slide.addText("\u6700\u5C0F\u53EF\u904B\u884C\u7BC4\u4F8B \u2014 Client \u751F\u547D\u9031\u671F\u8207 send_and_wait", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FONT_BODY, color: C.grayLight,
    align: "left", valign: "middle",
  });

  // Decorative code snippet (faded)
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 3.8, w: 4.2, h: 1.2, fill: { color: C.bgCard },
  });
  slide.addText([
    { text: "from ", options: { color: C.purple, fontFace: FONT_CODE, fontSize: 11, breakLine: false } },
    { text: "copilot ", options: { color: C.white, fontFace: FONT_CODE, fontSize: 11, breakLine: false } },
    { text: "import ", options: { color: C.purple, fontFace: FONT_CODE, fontSize: 11, breakLine: false } },
    { text: "CopilotClient", options: { color: C.green, fontFace: FONT_CODE, fontSize: 11, breakLine: true } },
    { text: "client = CopilotClient()", options: { color: C.grayLight, fontFace: FONT_CODE, fontSize: 11, breakLine: true } },
    { text: 'await session.send_and_wait("...")', options: { color: C.blue, fontFace: FONT_CODE, fontSize: 11 } },
  ], {
    x: 5.7, y: 3.9, w: 3.8, h: 1.0,
    valign: "top",
  });

  // Series label
  slide.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4,
    fontSize: 12, fontFace: FONT_BODY, color: C.gray,
    align: "left",
  });

  addSlideNumber(slide, 1, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 2 — 為什麼需要 SDK？
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u5F9E CLI \u5230\u7A0B\u5F0F\u5316\u63A7\u5236", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  // Flow diagram — 4 boxes with arrows
  const boxes = [
    { label: "\u4F60\u7684 Python \u7A0B\u5F0F", color: C.blue, x: 0.4 },
    { label: "SDK Client", color: C.green, x: 2.75 },
    { label: "Copilot CLI", color: C.purple, x: 5.1 },
    { label: "AI \u6A21\u578B", color: C.orange, x: 7.45 },
  ];

  const boxY = 2.0;
  const boxW = 2.0;
  const boxH = 1.1;

  boxes.forEach((b) => {
    // Box background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: boxY, w: boxW, h: boxH,
      fill: { color: C.bgCard },
      line: { color: b.color, width: 2 },
    });
    // Top accent stripe
    slide.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: boxY, w: boxW, h: 0.06,
      fill: { color: b.color },
    });
    // Label
    slide.addText(b.label, {
      x: b.x, y: boxY + 0.15, w: boxW, h: boxH - 0.15,
      fontSize: 14, fontFace: FONT_BODY, color: C.white,
      bold: true, align: "center", valign: "middle",
    });
  });

  // Arrows between boxes
  for (let i = 0; i < 3; i++) {
    const ax = boxes[i].x + boxW + 0.05;
    const aw = boxes[i + 1].x - ax - 0.05;
    slide.addText("\u25B6", {
      x: ax, y: boxY, w: aw, h: boxH,
      fontSize: 20, fontFace: FONT_BODY, color: C.gray,
      align: "center", valign: "middle",
    });
  }

  // Description text
  slide.addText("SDK \u8B93\u4F60\u7528 Python \u7A0B\u5F0F\u78BC\u63A7\u5236 GitHub Copilot\uFF0C\u4E0D\u518D\u53EA\u80FD\u624B\u52D5\u64CD\u4F5C CLI", {
    x: 0.8, y: 3.6, w: 8.4, h: 0.5,
    fontSize: 16, fontFace: FONT_BODY, color: C.grayLight,
    align: "center", valign: "middle",
  });

  // Key benefit cards
  const benefits = [
    { icon: "\uD83D\uDD04", text: "\u81EA\u52D5\u5316\u6D41\u7A0B", desc: "\u7528\u7A0B\u5F0F\u63A7\u5236 AI \u5C0D\u8A71" },
    { icon: "\uD83D\uDCE6", text: "\u53EF\u7D44\u5408\u6027", desc: "\u8207\u73FE\u6709\u7CFB\u7D71\u6574\u5408" },
    { icon: "\u26A1", text: "\u5373\u6642\u56DE\u61C9", desc: "\u4E32\u6D41\u3001\u4E8B\u4EF6\u3001\u56DE\u547C" },
  ];

  benefits.forEach((b, i) => {
    const bx = 0.8 + i * 3.0;
    slide.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 4.15, w: 2.6, h: 0.85,
      fill: { color: C.bgCard },
    });
    slide.addText(`${b.icon}  ${b.text}`, {
      x: bx + 0.15, y: 4.18, w: 2.3, h: 0.4,
      fontSize: 13, fontFace: FONT_BODY, color: C.white, bold: true,
      align: "left", valign: "middle",
    });
    slide.addText(b.desc, {
      x: bx + 0.15, y: 4.55, w: 2.3, h: 0.35,
      fontSize: 11, fontFace: FONT_BODY, color: C.gray,
      align: "left", valign: "top",
    });
  });

  addFooter(slide);
  addSlideNumber(slide, 2, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 3 — 核心生命週期
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u516D\u6B65\u5B8C\u6574\u751F\u547D\u9031\u671F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  const steps = [
    { code: "CopilotClient()", desc: "\u5EFA\u7ACB\u5BA2\u6236\u7AEF", color: C.blue },
    { code: "client.start()", desc: "\u555F\u52D5 CLI \u5B50\u7A0B\u5E8F", color: C.blue },
    { code: "client.create_session()", desc: "\u5EFA\u7ACB\u5C0D\u8A71 Session", color: C.green },
    { code: "session.send_and_wait()", desc: "\u9001\u51FA\u8A0A\u606F\uFF0C\u7B49\u5F85\u56DE\u8986", color: C.green },
    { code: "session.disconnect()", desc: "\u4E2D\u65B7 Session", color: C.green },
    { code: "client.stop()", desc: "\u505C\u6B62 CLI", color: C.orange },
  ];

  const startY = 1.2;
  const stepH = 0.5;
  const stepGap = 0.08;

  steps.forEach((s, i) => {
    const sy = startY + i * (stepH + stepGap);

    // Number circle
    slide.addShape(pres.shapes.OVAL, {
      x: 0.8, y: sy + 0.05, w: 0.45, h: 0.45,
      fill: { color: s.color },
    });
    slide.addText(`${i + 1}`, {
      x: 0.8, y: sy + 0.05, w: 0.45, h: 0.45,
      fontSize: 16, fontFace: FONT_BODY, color: C.bgDark,
      bold: true, align: "center", valign: "middle",
    });

    // Code name
    slide.addText(s.code, {
      x: 1.5, y: sy, w: 3.5, h: stepH,
      fontSize: 15, fontFace: FONT_CODE, color: s.color,
      align: "left", valign: "middle", margin: 0,
    });

    // Description
    slide.addText(s.desc, {
      x: 5.2, y: sy, w: 3.5, h: stepH,
      fontSize: 14, fontFace: FONT_BODY, color: C.grayLight,
      align: "left", valign: "middle",
    });
  });

  // Session bracket (right side) for steps 3-5
  const bracketX = 8.7;
  const bracketTop = startY + 2 * (stepH + stepGap);
  const bracketBot = startY + 4 * (stepH + stepGap) + stepH;
  const bracketMid = (bracketTop + bracketBot) / 2;

  // Vertical line
  slide.addShape(pres.shapes.LINE, {
    x: bracketX, y: bracketTop + 0.1, w: 0, h: bracketBot - bracketTop - 0.2,
    line: { color: C.green, width: 2 },
  });
  // Top tick
  slide.addShape(pres.shapes.LINE, {
    x: bracketX - 0.15, y: bracketTop + 0.1, w: 0.15, h: 0,
    line: { color: C.green, width: 2 },
  });
  // Bottom tick
  slide.addShape(pres.shapes.LINE, {
    x: bracketX - 0.15, y: bracketBot - 0.1, w: 0.15, h: 0,
    line: { color: C.green, width: 2 },
  });

  // Bracket label — rotated text not supported well, use horizontal
  slide.addText("async with\n\u81EA\u52D5\u7BA1\u7406", {
    x: 8.3, y: bracketMid - 0.45, w: 1.5, h: 0.9,
    fontSize: 10, fontFace: FONT_BODY, color: C.green,
    align: "center", valign: "middle",
  });

  // Bottom note
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.7, w: 8.4, h: 0.5,
    fill: { color: C.bgCard },
  });
  slide.addText("\uD83D\uDCA1 \u4F7F\u7528 async with \u53EF\u81EA\u52D5\u8655\u7406 disconnect()\uFF0C\u4E0D\u9700\u624B\u52D5\u547C\u53EB", {
    x: 1.0, y: 4.7, w: 8.0, h: 0.5,
    fontSize: 13, fontFace: FONT_BODY, color: C.grayLight,
    align: "left", valign: "middle",
  });

  addFooter(slide);
  addSlideNumber(slide, 3, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 4 — 前置需求
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u958B\u59CB\u4E4B\u524D", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  // Left card — Install CLI
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 4.0, h: 2.5,
    fill: { color: C.bgCard },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 4.0, h: 0.06,
    fill: { color: C.blue },
  });
  slide.addText("\u2460 \u78BA\u8A8D CLI \u5DF2\u5B89\u88DD", {
    x: 1.1, y: 1.7, w: 3.4, h: 0.4,
    fontSize: 18, fontFace: FONT_BODY, color: C.blue,
    bold: true, align: "left", valign: "middle",
  });
  // Code box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 1.1, y: 2.3, w: 3.4, h: 0.8,
    fill: { color: C.bgDark },
  });
  slide.addText([
    { text: "$ ", options: { color: C.gray, fontFace: FONT_CODE, fontSize: 14 } },
    { text: "copilot --version", options: { color: C.green, fontFace: FONT_CODE, fontSize: 14 } },
  ], {
    x: 1.3, y: 2.3, w: 3.0, h: 0.8,
    valign: "middle",
  });
  slide.addText("GitHub Copilot CLI \u5FC5\u9808\u5148\u5B89\u88DD\u5728\u7CFB\u7D71\u4E0A", {
    x: 1.1, y: 3.3, w: 3.4, h: 0.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.gray,
    align: "left", valign: "middle",
  });

  // Right card — Install SDK
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.5, w: 4.0, h: 2.5,
    fill: { color: C.bgCard },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: 1.5, w: 4.0, h: 0.06,
    fill: { color: C.green },
  });
  slide.addText("\u2461 \u5B89\u88DD Python SDK", {
    x: 5.5, y: 1.7, w: 3.4, h: 0.4,
    fontSize: 18, fontFace: FONT_BODY, color: C.green,
    bold: true, align: "left", valign: "middle",
  });
  // Code box
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 2.3, w: 3.4, h: 0.8,
    fill: { color: C.bgDark },
  });
  slide.addText([
    { text: "$ ", options: { color: C.gray, fontFace: FONT_CODE, fontSize: 14 } },
    { text: "pip install github-copilot-sdk", options: { color: C.green, fontFace: FONT_CODE, fontSize: 14 } },
  ], {
    x: 5.7, y: 2.3, w: 3.0, h: 0.8,
    valign: "middle",
  });
  slide.addText("\u652F\u63F4 Python 3.10+", {
    x: 5.5, y: 3.3, w: 3.4, h: 0.4,
    fontSize: 11, fontFace: FONT_BODY, color: C.gray,
    align: "left", valign: "middle",
  });

  // Run section
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.3, w: 8.4, h: 0.8,
    fill: { color: C.bgCard },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.3, w: 0.06, h: 0.8,
    fill: { color: C.orange },
  });
  slide.addText([
    { text: "\u22B3 \u57F7\u884C\u7BC4\u4F8B\uFF1A  ", options: { color: C.grayLight, fontFace: FONT_BODY, fontSize: 15 } },
    { text: "python main.py", options: { color: C.orange, fontFace: FONT_CODE, fontSize: 15, bold: true } },
  ], {
    x: 1.1, y: 4.3, w: 7.8, h: 0.8,
    valign: "middle",
  });

  addFooter(slide);
  addSlideNumber(slide, 4, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 5 — 完整程式碼
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u5B8C\u6574\u7BC4\u4F8B \u2014 main.py", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 30, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  // Code background
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.0, w: 9.0, h: 4.2,
    fill: { color: C.bgCard },
  });

  // Line numbers
  const lines = [
    " 1", " 2", " 3", " 4", " 5", " 6", " 7", " 8",
    " 9", "10", "11", "12", "13", "14", "15", "16",
    "17", "18", "19", "20", "21", "22", "23",
  ];
  slide.addText(lines.map((l, i) => ({
    text: l, options: { breakLine: i < lines.length - 1, color: C.grayDim, fontFace: FONT_CODE, fontSize: 10.5 },
  })), {
    x: 0.6, y: 1.1, w: 0.45, h: 3.9,
    valign: "top", align: "right",
  });

  // Separator line
  slide.addShape(pres.shapes.LINE, {
    x: 1.15, y: 1.1, w: 0, h: 3.9,
    line: { color: C.grayDim, width: 0.5 },
  });

  // Code content
  const codeLines = [
    [{ text: "import ", color: C.purple }, { text: "asyncio", color: C.white }],
    [{ text: "from ", color: C.purple }, { text: "copilot ", color: C.white }, { text: "import ", color: C.purple }, { text: "CopilotClient, PermissionHandler", color: C.blue }],
    [],
    [{ text: "async def ", color: C.purple }, { text: "main", color: C.blue }, { text: "():", color: C.white }],
    [{ text: "    # 1. \u5EFA\u7ACB\u5BA2\u6236\u7AEF", color: C.gray }],
    [{ text: "    client = ", color: C.white }, { text: "CopilotClient", color: C.blue }, { text: "()", color: C.white }],
    [{ text: "    ", color: C.white }, { text: "await ", color: C.purple }, { text: "client.start()", color: C.white }],
    [],
    [{ text: "    # 2. \u5EFA\u7ACB session", color: C.gray }],
    [{ text: "    ", color: C.white }, { text: "async with ", color: C.purple }, { text: "await ", color: C.purple }, { text: "client.create_session(", color: C.white }],
    [{ text: '        model=', color: C.white }, { text: '"claude-sonnet-4.6"', color: C.green }, { text: ",", color: C.white }],
    [{ text: "        on_permission_request=", color: C.white }, { text: "PermissionHandler.approve_all", color: C.blue }, { text: ",", color: C.white }],
    [{ text: "    ) ", color: C.white }, { text: "as ", color: C.purple }, { text: "session:", color: C.white }],
    [{ text: "        # 3. \u9001\u51FA\u8A0A\u606F\u4E26\u7B49\u5F85\u56DE\u8986", color: C.gray }],
    [{ text: "        response = ", color: C.white }, { text: "await ", color: C.purple }, { text: "session.send_and_wait(", color: C.white }],
    [{ text: '            ', color: C.white }, { text: '"What is 2+2? Reply in one sentence."', color: C.green }],
    [{ text: "        )", color: C.white }],
    [{ text: "        ", color: C.white }, { text: "if ", color: C.purple }, { text: "response:", color: C.white }],
    [{ text: "            ", color: C.white }, { text: "print", color: C.blue }, { text: '(f"AI \u56DE\u8986: {response.data.content}")', color: C.green }],
    [],
    [{ text: "    # 4. \u505C\u6B62\u5BA2\u6236\u7AEF", color: C.gray }],
    [{ text: "    ", color: C.white }, { text: "await ", color: C.purple }, { text: "client.stop()", color: C.white }],
    [],
  ];

  // Build text runs for all code lines
  const codeRuns = [];
  codeLines.forEach((line, i) => {
    if (line.length === 0) {
      codeRuns.push({ text: " ", options: { breakLine: true, fontFace: FONT_CODE, fontSize: 10.5, color: C.white } });
    } else {
      line.forEach((token, j) => {
        const isLast = j === line.length - 1;
        codeRuns.push({
          text: token.text,
          options: {
            color: token.color,
            fontFace: FONT_CODE,
            fontSize: 10.5,
            breakLine: isLast,
          },
        });
      });
    }
  });

  slide.addText(codeRuns, {
    x: 1.3, y: 1.1, w: 8.0, h: 3.9,
    valign: "top",
    margin: 0,
  });

  addFooter(slide);
  addSlideNumber(slide, 5, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 6 — 程式碼拆解
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u9010\u6BB5\u89E3\u6790", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  const panels = [
    {
      title: "\u5EFA\u7ACB\u8207\u555F\u52D5",
      color: C.blue,
      code: "client = CopilotClient()\nawait client.start()",
      desc: "\u5EFA\u7ACB SDK \u5BA2\u6236\u7AEF\n\u555F\u52D5 Copilot CLI \u5B50\u7A0B\u5E8F",
    },
    {
      title: "Session \u5C0D\u8A71",
      color: C.green,
      code: "async with await client.create_session(\n    on_permission_request=...\n) as session:\n    await session.send_and_wait(...)",
      desc: "create_session \u5EFA\u7ACB\u5C0D\u8A71\nsend_and_wait \u963B\u585E\u7B49\u5F85\u56DE\u8986\nasync with \u78BA\u4FDD\u81EA\u52D5 disconnect",
    },
    {
      title: "\u6536\u5C3E",
      color: C.orange,
      code: "await client.stop()",
      desc: "\u91CB\u653E\u6240\u6709\u8CC7\u6E90\n\u505C\u6B62 CLI \u5B50\u7A0B\u5E8F",
    },
  ];

  const panelX = 0.8;
  const panelW = 8.4;
  let panelY = 1.2;

  panels.forEach((p) => {
    const codeLineCount = p.code.split("\n").length;
    const codeH = Math.max(0.6, codeLineCount * 0.2 + 0.25);
    const panelH = 0.4 + codeH + 0.2;

    // Panel background
    slide.addShape(pres.shapes.RECTANGLE, {
      x: panelX, y: panelY, w: panelW, h: panelH,
      fill: { color: C.bgCard },
    });
    // Left accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: panelX, y: panelY, w: 0.06, h: panelH,
      fill: { color: p.color },
    });

    // Code block (left column — ends at x=5.2)
    slide.addShape(pres.shapes.RECTANGLE, {
      x: panelX + 0.3, y: panelY + 0.1, w: 4.1, h: panelH - 0.2,
      fill: { color: C.bgDark },
    });
    slide.addText(p.code, {
      x: panelX + 0.45, y: panelY + 0.1, w: 3.8, h: panelH - 0.2,
      fontSize: 10.5, fontFace: FONT_CODE, color: C.grayLight,
      align: "left", valign: "middle",
    });

    // Title + Description (right column — starts at x=5.6)
    slide.addText(p.title, {
      x: 5.6, y: panelY + 0.08, w: 3.4, h: 0.35,
      fontSize: 15, fontFace: FONT_BODY, color: p.color,
      bold: true, align: "left", valign: "middle",
    });
    slide.addText(p.desc, {
      x: 5.6, y: panelY + 0.43, w: 3.4, h: panelH - 0.53,
      fontSize: 12, fontFace: FONT_BODY, color: C.grayLight,
      align: "left", valign: "top",
    });

    panelY += panelH + 0.12;
  });

  addFooter(slide);
  addSlideNumber(slide, 6, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 7 — 關鍵觀念
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u56DB\u500B\u5FC5\u8A18\u91CD\u9EDE", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  const cards = [
    {
      icon: "\uD83D\uDD11",
      title: "on_permission_request \u662F\u5FC5\u586B",
      desc: "\u6BCF\u500B session \u90FD\u5FC5\u9808\u63D0\u4F9B\u6B0A\u9650\u8655\u7406\u5668\uFF0C\u6C92\u6709\u9810\u8A2D\u503C",
      color: C.red,
    },
    {
      icon: "\u2705",
      title: "PermissionHandler.approve_all",
      desc: "\u6700\u7C21\u55AE\u7684\u9078\u64C7\uFF1A\u5141\u8A31\u6240\u6709\u64CD\u4F5C\uFF0C\u9069\u5408\u958B\u767C\u6E2C\u8A66",
      color: C.green,
    },
    {
      icon: "\uD83D\uDD04",
      title: "async with \u81EA\u52D5\u7BA1\u7406",
      desc: "\u81EA\u52D5\u547C\u53EB disconnect()\uFF0C\u5373\u4F7F\u767C\u751F\u4F8B\u5916\u4E5F\u80FD\u6B63\u78BA\u6E05\u7406",
      color: C.blue,
    },
    {
      icon: "\uD83D\uDCE6",
      title: "Import \u8DEF\u5F91\u662F copilot",
      desc: "from copilot import ...\n\u4E0D\u662F copilot_sdk\uFF0C\u5225\u5BEB\u932F\uFF01",
      color: C.purple,
    },
  ];

  // 2x2 grid
  const gridX = [0.8, 5.15];
  const gridY = [1.35, 3.3];
  const cardW = 4.0;
  const cardH = 1.6;

  cards.forEach((c, i) => {
    const cx = gridX[i % 2];
    const cy = gridY[Math.floor(i / 2)];

    // Card bg
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.bgCard },
    });
    // Top accent
    slide.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: 0.05,
      fill: { color: c.color },
    });

    // Icon + Title
    slide.addText(`${c.icon}  ${c.title}`, {
      x: cx + 0.25, y: cy + 0.15, w: cardW - 0.5, h: 0.45,
      fontSize: 15, fontFace: FONT_BODY, color: C.white,
      bold: true, align: "left", valign: "middle",
    });

    // Description
    slide.addText(c.desc, {
      x: cx + 0.25, y: cy + 0.65, w: cardW - 0.5, h: 0.8,
      fontSize: 12, fontFace: FONT_BODY, color: C.grayLight,
      align: "left", valign: "top",
    });
  });

  addFooter(slide);
  addSlideNumber(slide, 7, TOTAL_SLIDES);
})();

// ==========================================
// SLIDE 8 — 總結與下一步
// ==========================================
(() => {
  const slide = pres.addSlide();
  slide.background = { color: C.bgDark };

  slide.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FONT_TITLE, color: C.white,
    bold: true, align: "left", margin: 0,
  });

  // Left section — Summary
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.35, w: 4.8, h: 2.8,
    fill: { color: C.bgCard },
  });
  slide.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", {
    x: 1.05, y: 1.45, w: 4.3, h: 0.4,
    fontSize: 18, fontFace: FONT_BODY, color: C.blue,
    bold: true, align: "left", valign: "middle",
  });

  const summaryItems = [
    { text: "CopilotClient \u662F\u4E00\u5207\u7684\u8D77\u9EDE", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FONT_BODY, fontSize: 14 } },
    { text: "send_and_wait() \u662F\u6700\u7C21\u55AE\u7684\u4E92\u52D5\u65B9\u5F0F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FONT_BODY, fontSize: 14 } },
    { text: "async with \u81EA\u52D5\u7BA1\u7406 session \u751F\u547D\u9031\u671F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FONT_BODY, fontSize: 14 } },
    { text: "on_permission_request \u662F\u5FC5\u586B\u53C3\u6578", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FONT_BODY, fontSize: 14 } },
    { text: "\u53EA\u8981 30 \u884C\u7A0B\u5F0F\u78BC\uFF0C\u5C31\u80FD\u63A7\u5236 AI", options: { bullet: true, color: C.white, fontFace: FONT_BODY, fontSize: 14, bold: true } },
  ];
  slide.addText(summaryItems, {
    x: 1.05, y: 1.95, w: 4.3, h: 2.0,
    valign: "top",
    paraSpaceAfter: 6,
  });

  // Right section — Next lesson
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 1.35, w: 3.5, h: 2.8,
    fill: { color: C.bgCard },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 6.0, y: 1.35, w: 3.5, h: 0.05,
    fill: { color: C.orange },
  });

  slide.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", {
    x: 6.25, y: 1.5, w: 3.0, h: 0.4,
    fontSize: 18, fontFace: FONT_BODY, color: C.orange,
    bold: true, align: "left", valign: "middle",
  });
  slide.addText("\u7B2C 02 \u8AB2\uFF1A\u4E8B\u4EF6\u9A45\u52D5\u8A0A\u606F", {
    x: 6.25, y: 2.1, w: 3.0, h: 0.35,
    fontSize: 16, fontFace: FONT_BODY, color: C.white,
    bold: true, align: "left", valign: "middle",
  });
  slide.addText("\u5F9E\u963B\u585E\u5F0F send_and_wait\n\u9032\u5316\u5230\u975E\u540C\u6B65\n send() + on()", {
    x: 6.25, y: 2.55, w: 3.0, h: 0.9,
    fontSize: 13, fontFace: FONT_BODY, color: C.grayLight,
    align: "left", valign: "top",
  });

  // Arrow icon
  slide.addText("\u27A1", {
    x: 6.25, y: 3.5, w: 3.0, h: 0.4,
    fontSize: 24, color: C.orange,
    align: "center", valign: "middle",
  });

  // Bottom motivational bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.55, w: 10, h: 0.55,
    fill: { color: C.bgCard },
  });
  slide.addText("\u300C\u53EA\u8981 30 \u884C\u7A0B\u5F0F\u78BC\uFF0C\u5C31\u80FD\u8B93 AI \u70BA\u4F60\u5DE5\u4F5C\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FONT_BODY, color: C.blue,
    italic: true, align: "center", valign: "middle",
  });

  addFooter(slide);
  addSlideNumber(slide, 8, TOTAL_SLIDES);
})();

// ==========================================
// Generate
// ==========================================
pres.writeFile({ fileName: "/home/sk/workl/agent_class/01_hello_world/slides.pptx" })
  .then(() => console.log("slides.pptx generated successfully!"))
  .catch((err) => console.error("Error:", err));
