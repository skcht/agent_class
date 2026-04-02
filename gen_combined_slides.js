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

// 1 cover + 3 intro + 1 TOC + 7 dividers + lesson slides + 3 closing
const GRAND_TOTAL = 1 + 3 + 1 + PARTS.length + totalLessonSlides + 3;
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

// --- Intro Slide 1: Why Copilot SDK? ---
function addIntroWhy() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue } });

  s.addText("為什麼要學 Copilot SDK？", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  // Problem statement
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.red } });
  s.addText("自己打造 AI Agent 的痛點", {
    x: 0.7, y: 1.3, w: 3.9, h: 0.4,
    fontSize: 13, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });
  s.addText([
    { text: "自建 Prompt 編排邏輯複雜", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "Tool calling 與權限管理難以維護", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "檔案操作、Git 整合需自行實作", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "Context window 管理容易出錯", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "可觀測性和安全性被忽略", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 0.9, y: 1.8, w: 3.7, h: 1.8, valign: "top", paraSpaceAfter: 4 });

  // Solution
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 2.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("Copilot SDK 替你解決", {
    x: 5.4, y: 1.3, w: 3.9, h: 0.4,
    fontSize: 13, fontFace: FB, color: C.green, bold: true, align: "left", valign: "middle",
  });
  s.addText([
    { text: "同一套 Copilot CLI 引擎，經過生產驗證", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "內建 Planning · Tool Invocation · File Edit", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "定義行為即可，不需自建編排", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "支援 BYOK — 無需 Copilot 訂閱也能用", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 12 } },
    { text: "Python / TS / Go / .NET / Java 五種 SDK", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 12, bold: true } },
  ], { x: 5.6, y: 1.8, w: 3.7, h: 1.8, valign: "top", paraSpaceAfter: 4 });

  // Bottom highlight
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.0, w: 9.0, h: 0.7, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.0, w: 0.08, h: 0.7, fill: { color: C.blue } });
  s.addText("「你定義 Agent 的行為，Copilot 處理 Planning、Tool invocation、File edits 等其餘一切。」", {
    x: 0.8, y: 4.0, w: 8.5, h: 0.7,
    fontSize: 13, fontFace: FB, color: C.grayLight, italic: true,
    align: "left", valign: "middle",
  });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

// --- Intro Slide 2: Architecture ---
function addIntroArch() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.cyan } });

  s.addText("Copilot SDK 架構總覽", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  // Architecture diagram — horizontal flow
  const boxes = [
    { label: "Your App\n(Python)", color: C.blue, x: 0.5 },
    { label: "SDK Client\n(JSON-RPC)", color: C.cyan, x: 2.6 },
    { label: "Copilot CLI\n(Server Mode)", color: C.green, x: 4.7 },
    { label: "Model\nProvider", color: C.purple, x: 6.8 },
  ];
  boxes.forEach((b) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: 1.3, w: 1.8, h: 0.9,
      fill: { color: C.bgCard },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: 1.3, w: 1.8, h: 0.04,
      fill: { color: b.color },
    });
    s.addText(b.label, {
      x: b.x, y: 1.38, w: 1.8, h: 0.78,
      fontSize: 11, fontFace: FB, color: C.white,
      align: "center", valign: "middle", bold: true,
    });
  });
  // Arrows between boxes
  const arrows = [
    { x: 2.35, label: "async" },
    { x: 4.45, label: "stdio/TCP" },
    { x: 6.55, label: "API" },
  ];
  arrows.forEach((a) => {
    s.addText("\u2192", {
      x: a.x, y: 1.3, w: 0.25, h: 0.9,
      fontSize: 18, fontFace: FB, color: C.grayDim,
      align: "center", valign: "middle",
    });
    s.addText(a.label, {
      x: a.x - 0.15, y: 2.2, w: 0.55, h: 0.3,
      fontSize: 8, fontFace: FC, color: C.grayDim,
      align: "center", valign: "top",
    });
  });
  // MCP Server branch
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.8, y: 1.3, w: 0.9, h: 0.9,
    fill: { color: C.bgCard },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.8, y: 1.3, w: 0.9, h: 0.04,
    fill: { color: C.orange },
  });
  s.addText("MCP\nServers", {
    x: 8.8, y: 1.38, w: 0.9, h: 0.78,
    fontSize: 10, fontFace: FB, color: C.white,
    align: "center", valign: "middle", bold: true,
  });
  s.addText("\u2191", {
    x: 7.3, y: 1.3, w: 1.5, h: 0.9,
    fontSize: 14, fontFace: FB, color: C.grayDim,
    align: "right", valign: "middle",
  });

  // Key capabilities — 2 rows × 3 columns
  const caps = [
    { icon: "\u26A1", name: "Events & Streaming", desc: "40+ 事件類型，即時串流", color: C.blue },
    { icon: "\uD83D\uDD27", name: "Custom Tools", desc: "@define_tool + Pydantic", color: C.purple },
    { icon: "\uD83E\uDD16", name: "Custom Agents", desc: "角色 · 工具範圍 · Sub-agent", color: C.green },
    { icon: "\uD83D\uDD12", name: "Permissions", desc: "逐工具批准 / 拒絕", color: C.orange },
    { icon: "\uD83D\uDCC8", name: "Observability", desc: "OpenTelemetry · Langfuse", color: C.yellow },
    { icon: "\uD83D\uDCBE", name: "Persistence", desc: "Session 恢復 · 記憶", color: C.cyan },
  ];
  caps.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 0.5 + col * 3.1;
    const cy = 2.8 + row * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 2.9, h: 0.9,
      fill: { color: C.bgCard },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.06, h: 0.9,
      fill: { color: c.color },
    });
    s.addText(c.name, {
      x: cx + 0.2, y: cy + 0.05, w: 2.5, h: 0.4,
      fontSize: 12, fontFace: FB, color: c.color, bold: true,
      align: "left", valign: "middle",
    });
    s.addText(c.desc, {
      x: cx + 0.2, y: cy + 0.45, w: 2.5, h: 0.35,
      fontSize: 10, fontFace: FB, color: C.grayLight,
      align: "left", valign: "top",
    });
  });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

// --- Intro Slide 3: SDK Ecosystem & Setup ---
function addIntroSetup() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.green } });

  s.addText("SDK 生態系與開發環境", {
    x: 0.8, y: 0.3, w: 8.4, h: 0.7,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  // SDK table
  const sdks = [
    { lang: "Python", pkg: "pip install github-copilot-sdk", note: "本課程使用", highlight: true },
    { lang: "Node.js / TS", pkg: "npm install @github/copilot-sdk", note: "", highlight: false },
    { lang: "Go", pkg: "go get github.com/github/copilot-sdk/go", note: "", highlight: false },
    { lang: ".NET", pkg: "dotnet add package GitHub.Copilot.SDK", note: "", highlight: false },
    { lang: "Java", pkg: "com.github:copilot-sdk-java (Maven)", note: "", highlight: false },
  ];

  // Table header
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 0.4, fill: { color: C.bgCardLight } });
  s.addText("Language", { x: 0.7, y: 1.2, w: 1.8, h: 0.4, fontSize: 11, fontFace: FB, color: C.gray, bold: true, align: "left", valign: "middle" });
  s.addText("Installation", { x: 2.5, y: 1.2, w: 5.5, h: 0.4, fontSize: 11, fontFace: FB, color: C.gray, bold: true, align: "left", valign: "middle" });

  sdks.forEach((sdk, i) => {
    const ry = 1.6 + i * 0.42;
    const bg = sdk.highlight ? C.bgCardLight : (i % 2 === 0 ? C.bgCard : C.bgDark);
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: ry, w: 9.0, h: 0.4, fill: { color: bg } });
    if (sdk.highlight) {
      s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: ry, w: 0.06, h: 0.4, fill: { color: C.green } });
    }
    s.addText(sdk.lang, {
      x: 0.7, y: ry, w: 1.8, h: 0.4,
      fontSize: 11, fontFace: FB, color: sdk.highlight ? C.white : C.grayLight,
      bold: sdk.highlight, align: "left", valign: "middle",
    });
    s.addText(sdk.pkg, {
      x: 2.5, y: ry, w: 5.5, h: 0.4,
      fontSize: 10, fontFace: FC, color: sdk.highlight ? C.green : C.grayLight,
      align: "left", valign: "middle",
    });
    if (sdk.note) {
      s.addText(sdk.note, {
        x: 8.2, y: ry, w: 1.2, h: 0.4,
        fontSize: 9, fontFace: FB, color: C.green, bold: true,
        align: "right", valign: "middle",
      });
    }
  });

  // Prerequisites card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.8, w: 4.3, h: 1.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.8, w: 4.3, h: 0.04, fill: { color: C.orange } });
  s.addText("前置需求", {
    x: 0.7, y: 3.85, w: 3.9, h: 0.35,
    fontSize: 12, fontFace: FB, color: C.orange, bold: true,
    align: "left", valign: "middle",
  });
  s.addText([
    { text: "Python 3.11+ (async/await)", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 11 } },
    { text: "Copilot CLI 已安裝 (copilot --version)", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 11 } },
    { text: "GitHub Copilot 訂閱 或 BYOK", options: { bullet: true, color: C.grayLight, fontFace: FB, fontSize: 11 } },
  ], { x: 0.9, y: 4.2, w: 3.7, h: 0.7, valign: "top", paraSpaceAfter: 2 });

  // Links card
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.3, h: 1.2, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.3, h: 0.04, fill: { color: C.blue } });
  s.addText("官方資源連結", {
    x: 5.4, y: 3.85, w: 3.9, h: 0.35,
    fontSize: 12, fontFace: FB, color: C.blue, bold: true,
    align: "left", valign: "middle",
  });
  s.addText([
    { text: "github.com/github/copilot-sdk", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FC, fontSize: 10 } },
    { text: "pypi.org/project/github-copilot-sdk", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FC, fontSize: 10 } },
    { text: "github.com/github/awesome-copilot", options: { bullet: true, color: C.grayLight, fontFace: FC, fontSize: 10 } },
  ], { x: 5.6, y: 4.2, w: 3.7, h: 0.7, valign: "top", paraSpaceAfter: 2 });

  addFooterG(s, SERIES_NAME);
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

// --- Closing Slide 1: Course Review ---
function addClosingReview() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };

  const colors = PARTS.map((p) => p.color);
  const segW = 10 / colors.length;
  colors.forEach((color, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: segW * i, y: 0, w: segW + 0.01, h: 0.08,
      fill: { color },
    });
  });

  s.addText("課程回顧", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  // 7 part summary — compact list
  const reviews = [
    { part: "Part 1", title: "核心基礎", detail: "Client 生命週期 · send / send_and_wait · Events · Streaming · 權限處理", color: C.blue },
    { part: "Part 2", title: "工具與擴充", detail: "@define_tool + Pydantic · 6 種 Session Hook · MCP Server 整合", color: C.purple },
    { part: "Part 3", title: "進階設定", detail: "BYOK (OpenAI / Azure / Ollama) · Session 斷線恢復 · ID 持久化", color: C.orange },
    { part: "Part 4", title: "Agent 框架", detail: "自訂角色 · 工具範圍控制 · Agent 專屬 MCP · Sub-agent 事件追蹤", color: C.green },
    { part: "Part 5", title: "可觀測性", detail: "OpenLIT 一站式儀表板 · Langfuse Trace 分析 · 成本與延遲監控", color: C.yellow },
    { part: "Part 6", title: "安全與上下文", detail: "infinite_sessions 自動壓縮 · working_directory 沙箱 · 三層防護", color: C.red },
    { part: "Part 7", title: "記憶系統", detail: "Hooks + Events 跨 Session 記憶 · Compact Prompt 結構化壓縮", color: C.purple },
  ];

  reviews.forEach((r, i) => {
    const ry = 1.05 + i * 0.57;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: ry, w: 9.0, h: 0.5,
      fill: { color: i % 2 === 0 ? C.bgCard : C.bgCardLight },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: ry, w: 0.08, h: 0.5,
      fill: { color: r.color },
    });
    s.addText(r.part, {
      x: 0.7, y: ry, w: 0.8, h: 0.5,
      fontSize: 11, fontFace: FB, color: r.color, bold: true,
      align: "left", valign: "middle",
    });
    s.addText(r.title, {
      x: 1.55, y: ry, w: 1.6, h: 0.5,
      fontSize: 12, fontFace: FB, color: C.white, bold: true,
      align: "left", valign: "middle",
    });
    s.addText(r.detail, {
      x: 3.2, y: ry, w: 6.2, h: 0.5,
      fontSize: 10, fontFace: FB, color: C.grayLight,
      align: "left", valign: "middle",
    });
  });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

// --- Closing Slide 2: Resources & Next Steps ---
function addClosingResources() {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.blue } });

  s.addText("進階資源與下一步", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left",
  });

  // Official resources
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 4.3, h: 2.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.1, w: 4.3, h: 0.05, fill: { color: C.blue } });
  s.addText("官方資源", {
    x: 0.7, y: 1.2, w: 3.9, h: 0.35,
    fontSize: 13, fontFace: FB, color: C.blue, bold: true,
    align: "left", valign: "middle",
  });
  const links = [
    { label: "SDK Repository", url: "github.com/github/copilot-sdk" },
    { label: "Python SDK (PyPI)", url: "pypi.org/project/github-copilot-sdk" },
    { label: "Cookbook & Recipes", url: "github.com/github/awesome-copilot" },
    { label: "Getting Started Guide", url: "copilot-sdk/docs/getting-started.md" },
    { label: "Features & API Docs", url: "copilot-sdk/docs/features/index.md" },
    { label: "BYOK Setup", url: "copilot-sdk/docs/auth/byok.md" },
  ];
  links.forEach((link, i) => {
    const ly = 1.6 + i * 0.33;
    s.addText(link.label, {
      x: 0.7, y: ly, w: 1.8, h: 0.3,
      fontSize: 10, fontFace: FB, color: C.white,
      align: "left", valign: "middle",
    });
    s.addText(link.url, {
      x: 2.5, y: ly, w: 2.1, h: 0.3,
      fontSize: 9, fontFace: FC, color: C.gray,
      align: "left", valign: "middle",
    });
  });

  // Next steps
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 4.3, h: 2.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 4.3, h: 0.05, fill: { color: C.green } });
  s.addText("建議下一步", {
    x: 5.4, y: 1.2, w: 3.9, h: 0.35,
    fontSize: 13, fontFace: FB, color: C.green, bold: true,
    align: "left", valign: "middle",
  });
  s.addText([
    { text: "1. 跑過所有課程範例 (main.py)", options: { breakLine: true, color: C.white, fontFace: FB, fontSize: 11, bold: true } },
    { text: "   熟悉每個 API 的實際行為", options: { breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 10 } },
    { text: "", options: { fontSize: 5, breakLine: true } },
    { text: "2. 打造你自己的 Agent", options: { breakLine: true, color: C.white, fontFace: FB, fontSize: 11, bold: true } },
    { text: "   結合 Custom Tools + Hooks + MCP", options: { breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 10 } },
    { text: "", options: { fontSize: 5, breakLine: true } },
    { text: "3. 加入可觀測性與安全防護", options: { breakLine: true, color: C.white, fontFace: FB, fontSize: 11, bold: true } },
    { text: "   上線前的必備功課", options: { breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 10 } },
    { text: "", options: { fontSize: 5, breakLine: true } },
    { text: "4. 部署到生產環境", options: { breakLine: true, color: C.white, fontFace: FB, fontSize: 11, bold: true } },
    { text: "   參考 docs/setup/scaling.md", options: { color: C.grayLight, fontFace: FC, fontSize: 10 } },
  ], { x: 5.4, y: 1.6, w: 3.9, h: 2.0, valign: "top" });

  // SDK version info
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.0, w: 9.0, h: 0.7, fill: { color: C.bgCard } });
  s.addText([
    { text: "SDK 版本: ", options: { color: C.gray, fontFace: FB, fontSize: 11 } },
    { text: "github-copilot-sdk >= 0.2.0", options: { color: C.cyan, fontFace: FC, fontSize: 11 } },
    { text: "  |  License: ", options: { color: C.gray, fontFace: FB, fontSize: 11 } },
    { text: "MIT", options: { color: C.green, fontFace: FC, fontSize: 11 } },
    { text: "  |  Status: ", options: { color: C.gray, fontFace: FB, fontSize: 11 } },
    { text: "Technical Preview", options: { color: C.yellow, fontFace: FC, fontSize: 11 } },
    { text: "  |  ", options: { color: C.grayDim, fontFace: FB, fontSize: 11 } },
    { text: "8,099 stars", options: { color: C.white, fontFace: FB, fontSize: 11 } },
  ], { x: 0.7, y: 4.0, w: 8.6, h: 0.7, valign: "middle" });

  addFooterG(s, SERIES_NAME);
  addNumG(s);
}

// --- Closing Slide 3: Final ---
function addClosingFinal() {
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

addIntroWhy();
console.log("  + Intro: Why Copilot SDK?");
addIntroArch();
console.log("  + Intro: Architecture");
addIntroSetup();
console.log("  + Intro: Ecosystem & Setup");

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

addClosingReview();
console.log("  + Closing: Course review");
addClosingResources();
console.log("  + Closing: Resources & next steps");
addClosingFinal();
console.log("  + Closing: Final");
console.log(`\n  Total: ${slideCounter} / ${GRAND_TOTAL} slides`);

pres
  .writeFile({ fileName: path.join(__dirname, "combined_slides.pptx") })
  .then(() => console.log(`\n=== combined_slides.pptx generated successfully! ===\n`))
  .catch((err) => console.error("\nError writing file:", err));
