/**
 * 合併 19 課投影片為完整教學簡報
 *
 * 動態讀取每課的 gen_slides.js，提取投影片建立邏輯，
 * 在同一份 pptxgenjs 簡報中重新執行，實現無縫合併。
 *
 * Usage: node gen_combined_slides.js
 * Output: combined_slides.pptx
 */

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "GitHub Copilot SDK Python 教學系列 — 完整版";

// --- Design Tokens (superset of all lessons) ---
const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const SERIES_NAME = "GitHub Copilot SDK Python 教學系列";

// --- Curriculum ---
const PARTS = [
  {
    title: "核心基礎", color: C.blue,
    lessons: [
      { num: "01", dir: "01_hello_world", title: "Hello World" },
      { num: "02", dir: "02_event_driven", title: "事件驅動訊息" },
      { num: "03", dir: "03_streaming", title: "即時串流輸出" },
      { num: "04", dir: "04_permission_handling", title: "自訂權限處理器" },
    ],
  },
  {
    title: "工具與擴充", color: C.purple,
    lessons: [
      { num: "05", dir: "05_custom_tools", title: "自訂工具" },
      { num: "06", dir: "06_session_hooks", title: "Session Hook" },
      { num: "07", dir: "07_mcp_server", title: "MCP 伺服器整合" },
    ],
  },
  {
    title: "進階設定", color: C.orange,
    lessons: [
      { num: "08", dir: "08_byok", title: "BYOK" },
      { num: "09", dir: "09_session_persistence", title: "Session 持久化" },
    ],
  },
  {
    title: "Agent 框架", color: C.green,
    lessons: [
      { num: "10", dir: "10_custom_agents", title: "自訂 Agent 角色" },
      { num: "11", dir: "11_agent_tool_scoping", title: "Agent 工具範圍控制" },
      { num: "12", dir: "12_agent_mcp_servers", title: "Agent 專屬 MCP" },
      { num: "13", dir: "13_subagent_events", title: "Sub-Agent 事件監控" },
    ],
  },
  {
    title: "可觀測性", color: C.yellow,
    lessons: [
      { num: "14", dir: "14_openlit_observability", title: "OpenLIT 可觀測性" },
      { num: "15", dir: "15_langfuse_observability", title: "Langfuse 可觀測性" },
    ],
  },
  {
    title: "安全與上下文", color: C.red,
    lessons: [
      { num: "16", dir: "16_context_management", title: "上下文管理" },
      { num: "17", dir: "17_safety_config", title: "安全設定" },
    ],
  },
  {
    title: "記憶系統", color: C.purple,
    lessons: [
      { num: "18", dir: "18_memory", title: "Agent 記憶" },
      { num: "19", dir: "19_compact_memory", title: "結構化記憶壓縮" },
    ],
  },
];

// --- Pre-compute slide counts ---
let totalLessonSlides = 0;
for (const part of PARTS) {
  for (const lesson of part.lessons) {
    const code = fs.readFileSync(path.join(__dirname, lesson.dir, "gen_slides.js"), "utf8");
    const m = code.match(/const (?:TOTAL|TOTAL_SLIDES)\s*=\s*(\d+)/);
    lesson.slideCount = m ? parseInt(m[1]) : 0;
    totalLessonSlides += lesson.slideCount;
  }
}

// 1 cover + 1 TOC + 7 dividers + lesson slides + 1 closing
const GRAND_TOTAL = 1 + 1 + PARTS.length + totalLessonSlides + 1;
let slideCounter = 0;

// --- Shared Helpers ---
function addFooterG(s, text) {
  s.addText(text, {
    x: 4.5, y: 5.15, w: 5.2, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.grayDim,
    align: "right", valign: "bottom",
  });
}

function addNumG(s) {
  slideCounter++;
  s.addText(`${slideCounter} / ${GRAND_TOTAL}`, {
    x: 0.3, y: 5.15, w: 1, h: 0.35,
    fontSize: 9, fontFace: FB, color: C.grayDim,
    align: "left", valign: "bottom",
  });
}

// ==========================================
// STRUCTURAL SLIDES
// ==========================================

function addCoverSlide() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  // Multi-color top bar (7 segments)
  const colors = PARTS.map((p) => p.color);
  const segW = 10 / colors.length;
  colors.forEach((color, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: segW * i, y: 0, w: segW + 0.01, h: 0.08,
      fill: { color },
    });
  });

  // Decorative code block (right side)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 0.8, w: 4.2, h: 2.2, fill: { color: C.bgCard },
  });
  s.addText(
    [
      { text: "from", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: true } },
      { text: " copilot_sdk ", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: "import", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: true } },
      { text: "  CopilotClient", options: { color: C.cyan, fontFace: FC, fontSize: 11, breakLine: true } },
      { text: "", options: { fontSize: 6, breakLine: true } },
      { text: "async with", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: " CopilotClient() ", options: { color: C.cyan, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: "as", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: " client:", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
      { text: "    session = ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: "await", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: " client.create_session()", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
      { text: "    result = ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: "await", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: " session.send_and_wait(", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
      { text: "...)", options: { color: C.grayLight, fontFace: FC, fontSize: 11 } },
    ],
    { x: 5.7, y: 0.9, w: 3.8, h: 2.0, valign: "top" }
  );

  // Title
  s.addText("GitHub Copilot SDK", {
    x: 0.8, y: 1.5, w: 4.5, h: 0.9,
    fontSize: 40, fontFace: FT, color: C.white,
    bold: true, align: "left", valign: "middle",
  });
  s.addText("Python 教學系列", {
    x: 0.8, y: 2.4, w: 4.5, h: 0.7,
    fontSize: 30, fontFace: FT, color: C.blue,
    bold: true, align: "left", valign: "middle",
  });

  // Info line
  const totalLessons = PARTS.reduce((n, p) => n + p.lessons.length, 0);
  s.addText(`${totalLessons} 堂課 · ${PARTS.length} 大單元 · 從基礎到實戰`, {
    x: 0.8, y: 3.5, w: 4.5, h: 0.5,
    fontSize: 16, fontFace: FB, color: C.grayLight,
    align: "left", valign: "middle",
  });

  // Part overview badges
  PARTS.forEach((p, i) => {
    const bx = 0.8 + i * 1.25;
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 4.2, w: 1.15, h: 0.55,
      fill: { color: C.bgCard },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: 4.2, w: 1.15, h: 0.04,
      fill: { color: p.color },
    });
    s.addText(p.title, {
      x: bx, y: 4.28, w: 1.15, h: 0.47,
      fontSize: 9, fontFace: FB, color: C.grayLight,
      align: "center", valign: "middle",
    });
  });

  addNumG(s);
}

function addTocSlide() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue } });

  s.addText("課程總覽", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  const rowH = 0.62;
  const startY = 1.05;

  PARTS.forEach((part, i) => {
    const y = startY + i * rowH;

    // Row background
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9.0, h: rowH - 0.06,
      fill: { color: i % 2 === 0 ? C.bgCard : C.bgCardLight },
    });
    // Color stripe
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.08, h: rowH - 0.06,
      fill: { color: part.color },
    });
    // Part badge
    s.addText(`Part ${i + 1}`, {
      x: 0.75, y, w: 0.85, h: rowH - 0.06,
      fontSize: 12, fontFace: FB, color: part.color, bold: true,
      align: "left", valign: "middle",
    });
    // Part title
    s.addText(part.title, {
      x: 1.7, y, w: 2.0, h: rowH - 0.06,
      fontSize: 14, fontFace: FB, color: C.white, bold: true,
      align: "left", valign: "middle",
    });
    // Lesson list
    const items = part.lessons.map((l) => `第${l.num}課 ${l.title}`).join("  ·  ");
    s.addText(items, {
      x: 3.8, y, w: 5.6, h: rowH - 0.06,
      fontSize: 10, fontFace: FB, color: C.grayLight,
      align: "left", valign: "middle",
    });
  });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

function addSectionDivider(part, partIndex) {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  // Top bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06, fill: { color: part.color },
  });

  // Part badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 1.5, w: 1.4, h: 0.5,
    fill: { color: part.color }, rectRadius: 0.05,
  });
  s.addText(`PART ${partIndex + 1}`, {
    x: 0.8, y: 1.5, w: 1.4, h: 0.5,
    fontSize: 15, fontFace: FB, color: C.bgDark,
    bold: true, align: "center", valign: "middle",
  });

  // Part title
  s.addText(part.title, {
    x: 0.8, y: 2.2, w: 8.4, h: 0.9,
    fontSize: 42, fontFace: FT, color: C.white,
    bold: true, align: "left", valign: "middle",
  });

  // Lesson cards
  const cardW = 8.4 / Math.min(part.lessons.length, 4);
  part.lessons.forEach((l, i) => {
    const cx = 0.8 + i * cardW;
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 3.4, w: cardW - 0.15, h: 1.1,
      fill: { color: C.bgCard },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: 3.4, w: cardW - 0.15, h: 0.04,
      fill: { color: part.color },
    });
    s.addText(`第 ${l.num} 課`, {
      x: cx + 0.1, y: 3.5, w: cardW - 0.35, h: 0.35,
      fontSize: 11, fontFace: FB, color: part.color,
      bold: true, align: "left", valign: "middle",
    });
    s.addText(l.title, {
      x: cx + 0.1, y: 3.85, w: cardW - 0.35, h: 0.5,
      fontSize: 14, fontFace: FB, color: C.white,
      align: "left", valign: "top",
    });
  });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

function addClosingSlide() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  // Multi-color top bar
  const colors = PARTS.map((p) => p.color);
  const segW = 10 / colors.length;
  colors.forEach((color, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: segW * i, y: 0, w: segW + 0.01, h: 0.08,
      fill: { color },
    });
  });

  s.addText("課程完結", {
    x: 1.0, y: 1.2, w: 8.0, h: 1.0,
    fontSize: 46, fontFace: FT, color: C.white,
    bold: true, align: "center", valign: "middle",
  });

  const totalLessons = PARTS.reduce((n, p) => n + p.lessons.length, 0);
  s.addText(`恭喜完成全部 ${totalLessons} 堂 Copilot SDK Python 課程！`, {
    x: 1.0, y: 2.3, w: 8.0, h: 0.5,
    fontSize: 20, fontFace: FB, color: C.grayLight,
    align: "center", valign: "middle",
  });

  // Summary cards
  const summaries = [
    { label: "SDK 基礎", detail: "Client · Events\nStreaming · Permissions", color: C.blue },
    { label: "工具擴充", detail: "Tools · Hooks\nMCP · BYOK", color: C.purple },
    { label: "Agent 系統", detail: "Roles · Scoping\nMCP · Sub-agents", color: C.green },
    { label: "生產就緒", detail: "Observability · Safety\nContext · Memory", color: C.yellow },
  ];
  summaries.forEach((item, i) => {
    const x = 0.7 + i * 2.25;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.2, w: 2.05, h: 1.3, fill: { color: C.bgCard },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.2, w: 2.05, h: 0.05, fill: { color: item.color },
    });
    s.addText(item.label, {
      x, y: 3.3, w: 2.05, h: 0.4,
      fontSize: 14, fontFace: FB, color: item.color,
      bold: true, align: "center", valign: "middle",
    });
    s.addText(item.detail, {
      x: x + 0.1, y: 3.7, w: 1.85, h: 0.7,
      fontSize: 11, fontFace: FB, color: C.grayLight,
      align: "center", valign: "top",
    });
  });

  // Bottom motivational text
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.7, w: 10, h: 0.45, fill: { color: C.bgCard },
  });
  s.addText("現在你已掌握完整的 Copilot SDK Python 開發技能，開始打造你的 AI Agent 吧！", {
    x: 0.5, y: 4.7, w: 9.0, h: 0.45,
    fontSize: 13, fontFace: FB, color: C.grayLight,
    align: "center", valign: "middle",
  });

  addNumG(s);
}

// ==========================================
// LESSON PROCESSING (Dynamic Code Extraction)
// ==========================================

function processLesson(lesson) {
  const filePath = path.join(__dirname, lesson.dir, "gen_slides.js");
  const code = fs.readFileSync(filePath, "utf8");

  const footerText = `GitHub Copilot SDK Python 教學系列 — 第 ${lesson.num} 課`;

  // Extract slide creation code: from first IIFE to before pres.writeFile
  const firstIIFE = code.indexOf("(() => {");
  const writeFile = code.lastIndexOf("pres.writeFile");

  if (firstIIFE === -1 || writeFile === -1) {
    console.error(`  ✗ Could not extract slides from ${lesson.dir}`);
    return;
  }

  const slideCode = code.substring(firstIIFE, writeFile).trim();

  // Create a wrapper function that provides all necessary bindings.
  // Each gen_slides.js references module-level vars:
  //   pres, C, FT/FB/FC (or FONT_TITLE/BODY/CODE), addFooter, addNum/addPageNum/addSlideNumber, TOTAL/TOTAL_SLIDES
  // We supply our shared pres and intercept footer/numbering helpers.
  const wrapper = new Function(
    "pres", "C", "FT", "FB", "FC",
    "FONT_TITLE", "FONT_BODY", "FONT_CODE",
    "addFooter", "addNum", "addPageNum", "addSlideNumber",
    "TOTAL", "TOTAL_SLIDES", "FOOTER", "FOOTER_TEXT",
    slideCode
  );

  const numFn = (_s) => addNumG(_s);
  const footerFn = (_s) => addFooterG(_s, footerText);

  wrapper(
    pres, C, FT, FB, FC,
    FT, FB, FC,
    footerFn, numFn, numFn, numFn,
    lesson.slideCount, lesson.slideCount,
    footerText, footerText
  );
}

// ==========================================
// MAIN
// ==========================================

console.log(`\n=== Generating combined_slides.pptx (${GRAND_TOTAL} slides) ===\n`);

addCoverSlide();
console.log("  + Cover slide");

addTocSlide();
console.log("  + TOC slide");

for (let pi = 0; pi < PARTS.length; pi++) {
  const part = PARTS[pi];
  addSectionDivider(part, pi);
  console.log(`  + Part ${pi + 1} divider: ${part.title}`);

  for (const lesson of part.lessons) {
    processLesson(lesson);
    console.log(`    + Lesson ${lesson.num}: ${lesson.title} (${lesson.slideCount} slides)`);
  }
}

addClosingSlide();
console.log("  + Closing slide");
console.log(`\n  Total: ${slideCounter} / ${GRAND_TOTAL} slides`);

pres
  .writeFile({ fileName: path.join(__dirname, "combined_slides.pptx") })
  .then(() => console.log(`\n=== combined_slides.pptx generated successfully! ===\n`))
  .catch((err) => console.error("\nError writing file:", err));
