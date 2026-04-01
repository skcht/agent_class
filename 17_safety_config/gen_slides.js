const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 17 課：安全設定 — working_directory";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 17 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.red } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.red } });
  s.addText("LESSON 17", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("\u5B89\u5168\u8A2D\u5B9A", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u628A Agent \u95DC\u5728\u8CC7\u6599\u593E\u88E1 \u2014 \u4E09\u5C64\u9632\u8B77", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "working_directory=", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"/sandbox"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "on_pre_tool_use: ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "path check", options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "on_permission_request: ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "deny shell", options: { color: C.orange, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — The problem
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("approve_all \u7684\u98A8\u96AA", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.06, h: 0.6, fill: { color: C.red } });
  s.addText("approve_all = \u628A\u4E3B\u6A5F\u7684\u9470\u5319\u5168\u4EA4\u7D66 AI\uFF0C\u5B83\u53EF\u4EE5\u8B80\u5BEB\u6574\u53F0\u6A5F\u5668\u7684\u4EFB\u4F55\u6A94\u6848", {
    x: 1.1, y: 1.2, w: 7.9, h: 0.6, fontSize: 14, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  // What agent could do
  const actions = [
    { path: "/home/user/my-project/src/app.py", allowed: true, desc: "\u4F60\u671F\u671B\u7684" },
    { path: "/home/user/.ssh/id_rsa", allowed: false, desc: "\u5077\u770B SSH Key" },
    { path: "/etc/nginx/nginx.conf", allowed: false, desc: "\u6539\u58DE\u7CFB\u7D71\u8A2D\u5B9A" },
    { path: "rm -rf /home/user/another-project/", allowed: false, desc: "\u522A\u6389\u5225\u7684\u5C08\u6848" },
  ];
  actions.forEach((a, i) => {
    const ay = 2.05 + i * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ay, w: 8.4, h: 0.45, fill: { color: C.bgCard } });
    s.addText(a.allowed ? "\u2713" : "\u2717", {
      x: 0.9, y: ay, w: 0.4, h: 0.45,
      fontSize: 14, fontFace: FB, color: a.allowed ? C.green : C.red, bold: true, align: "center", valign: "middle",
    });
    s.addText(a.path, { x: 1.4, y: ay, w: 5.5, h: 0.45, fontSize: 11, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(a.desc, { x: 7.2, y: ay, w: 1.8, h: 0.45, fontSize: 11, fontFace: FB, color: a.allowed ? C.green : C.red, align: "right", valign: "middle" });
  });

  // Core question
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.4, w: 0.06, h: 0.6, fill: { color: C.yellow } });
  s.addText("\u6838\u5FC3\u554F\u984C\uFF1A\u5982\u4F55\u8B93 Agent \u53EA\u80FD\u5728\u6307\u5B9A\u7684\u8CC7\u6599\u593E\u5167\u64CD\u4F5C\uFF1F", {
    x: 1.1, y: 4.4, w: 7.9, h: 0.6, fontSize: 15, fontFace: FB, color: C.yellow, bold: true, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Three layers
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E09\u5C64\u9632\u8B77", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const layers = [
    { num: "1", title: "working_directory", desc: "\u8A2D\u5B9A Agent \u7684\u5DE5\u4F5C\u76EE\u9304\uFF08\u8EDF\u9650\u5236\uFF09", detail: "\u50C5\u8A2D CWD\uFF0C\u7121\u6CD5\u963B\u64CB\u7D55\u5C0D\u8DEF\u5F91", color: C.blue },
    { num: "2", title: "on_pre_tool_use hook", desc: "\u5F37\u5236\u6AA2\u67E5\u8DEF\u5F91\uFF0C\u62D2\u7D55\u8D8A\u754C\u64CD\u4F5C\uFF08\u786C\u9650\u5236\uFF09", detail: "\u6838\u5FC3\u9632\u8B77\uFF0C\u7528 abspath \u9632\u6B62 ../ \u7A7F\u8D8A", color: C.red },
    { num: "3", title: "permission + system_message", desc: "\u4F9D\u64CD\u4F5C\u985E\u578B\u904E\u6FFE + \u8EDF\u6027\u908A\u754C", detail: "\u7981\u6B62 shell\u3001\u544A\u8A34 AI \u908A\u754C\u5728\u54EA", color: C.orange },
  ];

  layers.forEach((l, i) => {
    const ly = 1.2 + i * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ly, w: 8.4, h: 0.95, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ly, w: 0.06, h: 0.95, fill: { color: l.color } });
    s.addShape(pres.shapes.OVAL, { x: 1.1, y: ly + 0.22, w: 0.45, h: 0.45, fill: { color: l.color } });
    s.addText(l.num, { x: 1.1, y: ly + 0.22, w: 0.45, h: 0.45, fontSize: 16, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
    s.addText(l.title, { x: 1.8, y: ly, w: 3.5, h: 0.5, fontSize: 14, fontFace: FC, color: l.color, bold: true, align: "left", valign: "middle" });
    s.addText(l.desc, { x: 5.5, y: ly, w: 3.5, h: 0.5, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(l.detail, { x: 1.8, y: ly + 0.52, w: 7.2, h: 0.35, fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.6, w: 8.4, h: 0.45, fill: { color: C.bgCard } });
  s.addText("\u591A\u5C64\u7D44\u5408 \u2014 \u5373\u4F7F\u55AE\u4E00\u5C64\u88AB\u7A81\u7834\uFF0C\u5176\u4ED6\u5C64\u4ECD\u7136\u6709\u6548", {
    x: 1.0, y: 4.6, w: 8.0, h: 0.45, fontSize: 13, fontFace: FB, color: C.yellow, bold: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Layer 1: working_directory
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7B2C 1 \u5C64\uFF1Aworking_directory", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 1.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "session = ", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    working_directory=", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: '"/home/user/my-project"', options: { color: C.green, fontFace: FC, fontSize: 13, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    ...", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 1.1, valign: "top" });

  // Warning
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.8, w: 8.4, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.8, w: 0.06, h: 0.6, fill: { color: C.red } });
  s.addText("working_directory \u53EA\u662F\u8A2D CWD\uFF0C\u5B83\u4E0D\u6703\u963B\u6B62 Agent \u7528\u7D55\u5C0D\u8DEF\u5F91\u8DE8\u5230\u5916\u9762\uFF01", {
    x: 1.1, y: 2.8, w: 7.9, h: 0.6, fontSize: 13, fontFace: FB, color: C.red, bold: true, align: "left", valign: "middle",
  });

  // Comparison
  s.addText("working_directory vs hook \u8DEF\u5F91\u6AA2\u67E5", { x: 0.8, y: 3.65, w: 5, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });

  const rows = [
    { aspect: "\u7D55\u5C0D\u8DEF\u5F91", wd: "\u7121\u6CD5\u963B\u64CB", hook: "\u4E00\u5F8B\u6AA2\u67E5", cWd: C.red, cHook: C.green },
    { aspect: "../ \u7A7F\u8D8A", wd: "\u7121\u6CD5\u963B\u64CB", hook: "abspath \u89E3\u6790", cWd: C.red, cHook: C.green },
    { aspect: "shell \u6307\u4EE4", wd: "\u5728\u8A72\u76EE\u9304\u57F7\u884C", hook: "\u53EF\u6AA2\u67E5\u5167\u5BB9", cWd: C.orange, cHook: C.green },
  ];
  rows.forEach((r, i) => {
    const ry = 4.05 + i * 0.35;
    s.addText(r.aspect, { x: 0.8, y: ry, w: 2.0, h: 0.3, fontSize: 11, fontFace: FB, color: C.grayLight, bold: true, align: "left", valign: "middle" });
    s.addText(r.wd, { x: 3.0, y: ry, w: 2.5, h: 0.3, fontSize: 10, fontFace: FB, color: r.cWd, align: "center", valign: "middle" });
    s.addText(r.hook, { x: 6.0, y: ry, w: 3.0, h: 0.3, fontSize: 10, fontFace: FB, color: r.cHook, align: "center", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Layer 2: path checking hook
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7B2C 2 \u5C64\uFF1A\u8DEF\u5F91\u6AA2\u67E5 Hook", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 3.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "ALLOWED_DIR = os.path.abspath(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"/home/user/my-project"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "is_path_allowed", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(path):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    resolved = os.path.", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "abspath", options: { color: C.red, fontFace: FC, fontSize: 11, bold: true, breakLine: false } },
    { text: "(path)", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "resolved.startswith(ALLOWED_DIR + os.sep)", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "async def ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "on_pre_tool_use", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "(input_data, invocation):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    tool_name = input_data.get("toolName")', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'tool_name ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "in ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '("read", "write", "edit"):', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "if not ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "is_path_allowed(tool_input):", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "            ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '{"permissionDecision": ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"deny"', options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.1, valign: "top" });

  // Path examples
  s.addText("\u8DEF\u5F91\u89E3\u6790\u7BC4\u4F8B", { x: 0.8, y: 4.4, w: 3, h: 0.3, fontSize: 12, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText([
    { text: "/my-project/src/app.py ", options: { color: C.green, fontFace: FC, fontSize: 10, breakLine: false } },
    { text: "\u2713    ", options: { color: C.green, fontFace: FC, fontSize: 10, breakLine: false } },
    { text: "/my-project/../.ssh/id_rsa \u2192 /home/.ssh/id_rsa ", options: { color: C.red, fontFace: FC, fontSize: 10, breakLine: false } },
    { text: "\u2717    ", options: { color: C.red, fontFace: FC, fontSize: 10, breakLine: false } },
    { text: "/etc/passwd ", options: { color: C.red, fontFace: FC, fontSize: 10, breakLine: false } },
    { text: "\u2717", options: { color: C.red, fontFace: FC, fontSize: 10 } },
  ], { x: 0.8, y: 4.7, w: 8.4, h: 0.3, valign: "middle" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Layer 3
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u7B2C 3 \u5C64\uFF1A\u6B0A\u9650 + \u7CFB\u7D71\u8A0A\u606F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 32, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Permission handler
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 0.05, h: 2.0, fill: { color: C.orange } });
  s.addText("on_permission_request", { x: 0.7, y: 1.25, w: 3.9, h: 0.35, fontSize: 13, fontFace: FC, color: C.orange, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'kind == "shell":', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "denied-by-rules", options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: "# \u5B8C\u5168\u7981\u6B62 shell = \u6700\u5B89\u5168", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.7, w: 3.9, h: 1.3, valign: "top" });

  // System message
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 4.3, h: 2.0, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.2, w: 0.05, h: 2.0, fill: { color: C.yellow } });
  s.addText("system_message", { x: 5.4, y: 1.25, w: 3.9, h: 0.35, fontSize: 13, fontFace: FC, color: C.yellow, bold: true, align: "left", valign: "middle" });
  s.addText([
    { text: '"\u4F60\u53EA\u80FD\u64CD\u4F5C /sandbox \u5167\u7684\u6A94\u6848\u3002', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " \u4E0D\u8981\u5617\u8A66\u5B58\u53D6\u6B64\u76EE\u9304\u4EE5\u5916\u3002", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " \u4E0D\u8981\u522A\u9664\u6A94\u6848\u3002", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: ' \u4FEE\u6539\u524D\u5148\u8B80\u53D6\u78BA\u8A8D\u3002"', options: { color: C.green, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 1.7, w: 3.9, h: 1.3, valign: "top" });

  // Combined effect
  s.addText("\u7D44\u5408\u6548\u679C", { x: 0.8, y: 3.5, w: 2, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const effects = [
    { layer: "working_directory", effect: "\u8A2D CWD \u2192 \u76F8\u5C0D\u8DEF\u5F91\u57FA\u6E96", color: C.blue },
    { layer: "on_pre_tool_use", effect: "abspath \u6AA2\u67E5 \u2192 \u963B\u64CB\u7D55\u5C0D\u8DEF\u5F91 + ../", color: C.red },
    { layer: "permission", effect: "\u7981 shell \u2192 \u963B\u64CB\u4EFB\u610F\u6307\u4EE4", color: C.orange },
    { layer: "system_message", effect: "\u964D\u4F4E AI \u4E3B\u52D5\u8D8A\u754C\u6A5F\u7387", color: C.yellow },
  ];
  effects.forEach((e, i) => {
    const ey = 3.9 + i * 0.32;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 0.05, h: 0.28, fill: { color: e.color } });
    s.addText(e.layer, { x: 1.0, y: ey, w: 2.8, h: 0.28, fontSize: 10, fontFace: FC, color: e.color, align: "left", valign: "middle" });
    s.addText(e.effect, { x: 4.0, y: ey, w: 5.2, h: 0.28, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Dangerous patterns
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u5371\u96AA\u6307\u4EE4\u651E\u622A", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 1.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "DANGEROUS_PATTERNS = [", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "rm -rf", "rm -r ", "rmdir", "del /s",', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "format ", "mkfs", "dd if=", "> /dev/",', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    "DROP TABLE", "DROP DATABASE",', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    ":(){",  # fork bomb', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "]", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 1.3, valign: "top" });

  s.addText("\u5728 on_pre_tool_use hook \u4E2D\uFF0C\u6AA2\u67E5 shell \u6307\u4EE4\u662F\u5426\u5305\u542B\u9019\u4E9B pattern\uFF0C\u6709\u5247\u7ACB\u5373 deny", {
    x: 0.8, y: 2.9, w: 8.4, h: 0.4, fontSize: 13, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  // Three demos
  s.addText("\u4E09\u500B\u7BC4\u4F8B\u60C5\u5883", { x: 0.8, y: 3.5, w: 3, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const demos = [
    { title: "Demo 1: \u57FA\u672C Sandbox", desc: "sandbox \u5167\u8B80\u5BEB\u2713\uFF0C\u8D8A\u754C\u88AB\u651E\u622A\u2717", color: C.green },
    { title: "Demo 2: \u8DEF\u5F91\u7A7F\u8D8A", desc: "../ \u5617\u8A66\u96E2\u958B\u88AB abspath \u651E\u622A", color: C.orange },
    { title: "Demo 3: \u5B8C\u6574\u9632\u8B77", desc: "\u4E09\u5C64\u5168\u958B\uFF0C\u6700\u5B89\u5168\u8A2D\u5B9A", color: C.red },
  ];
  demos.forEach((d, i) => {
    const dx = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x: dx, y: 3.95, w: 2.8, h: 0.9, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: dx, y: 3.95, w: 2.8, h: 0.04, fill: { color: d.color } });
    s.addText(d.title, { x: dx + 0.1, y: 3.99, w: 2.6, h: 0.35, fontSize: 12, fontFace: FB, color: d.color, bold: true, align: "left", valign: "middle" });
    s.addText(d.desc, { x: dx + 0.1, y: 4.35, w: 2.6, h: 0.4, fontSize: 10, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 7);
})();

// SLIDE 8 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.red, bold: true, align: "left" });
  s.addText([
    { text: "working_directory \u55AE\u7368\u4E0D\u5920\u5B89\u5168", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "on_pre_tool_use + abspath = \u6838\u5FC3\u9632\u8B77", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "permission \u53EF\u5B8C\u5168\u7981\u6B62 shell", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u591A\u5C64\u9632\u8B77 = \u7E31\u6DF1\u9632\u79A6", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.green } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.green, bold: true, align: "left" });
  s.addText("\u7B2C 18 \u8AB2\uFF1AAgent \u8A18\u61B6", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u7528 Hooks + Events\n\u5BE6\u4F5C\u8DE8 Session \u8A18\u61B6", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.green, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u4FE1\u4EFB AI\uFF0C\u4F46\u8981\u628A\u5B83\u95DC\u5728\u7C60\u5B50\u88E1\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.red, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/17_safety_config/slides.pptx" })
  .then(() => console.log("17_safety_config/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
