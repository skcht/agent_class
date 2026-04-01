const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 06 課：Session Hook — 攔截與修改行為";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 06 \u8AB2";
const FT = "Arial Black", FB = "Calibri", FC = "Consolas";
const TOTAL = 9;

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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.yellow } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.yellow } });
  s.addText("LESSON 06", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("Session Hook", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("\u651E\u622A\u8207\u4FEE\u6539 AI \u884C\u70BA \u2014 \u5728\u95DC\u9375\u6642\u523B\u63D2\u5165\u81EA\u8A02\u908F\u8F2F", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "hooks = {", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "on_pre_tool_use"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ": guard,", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '    "on_session_start"', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ": init,", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// ==========================================
// SLIDE 2 — Why hooks?
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u9700\u8981 Hook\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const useCases = [
    { icon: "\uD83D\uDCDD", title: "\u8A18\u9304\u65E5\u8A8C", desc: "\u6BCF\u6B21\u5DE5\u5177\u57F7\u884C\u524D\u5F8C\u81EA\u52D5 log", color: C.blue },
    { icon: "\u2702\uFE0F", title: "\u4FEE\u6539 Prompt", desc: "\u6CE8\u5165\u4E0A\u4E0B\u6587\u3001\u6539\u5BEB\u4F7F\u7528\u8005\u8F38\u5165", color: C.green },
    { icon: "\uD83D\uDEE1\uFE0F", title: "\u5B89\u5168\u651E\u622A", desc: "\u5DE5\u5177\u57F7\u884C\u524D\u6AA2\u67E5\uFF0C\u62D2\u7D55\u5371\u96AA\u64CD\u4F5C", color: C.red },
    { icon: "\uD83D\uDD04", title: "\u932F\u8AA4\u8655\u7406", desc: "\u81EA\u52D5\u91CD\u8A66\u3001\u8DF3\u904E\u6216\u7D42\u6B62", color: C.orange },
    { icon: "\uD83D\uDCCA", title: "\u7D71\u8A08\u5206\u6790", desc: "Session \u7D50\u675F\u6642\u7522\u751F\u6458\u8981", color: C.purple },
    { icon: "\u2699\uFE0F", title: "\u52D5\u614B\u8A2D\u5B9A", desc: "Session \u555F\u52D5\u6642\u6CE8\u5165\u5168\u57DF\u4E0A\u4E0B\u6587", color: C.cyan },
  ];

  // 2x3 grid
  useCases.forEach((uc, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const ux = 0.5 + col * 3.1;
    const uy = 1.3 + row * 1.55;

    s.addShape(pres.shapes.RECTANGLE, { x: ux, y: uy, w: 2.8, h: 1.3, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: ux, y: uy, w: 2.8, h: 0.04, fill: { color: uc.color } });
    s.addText(`${uc.icon}  ${uc.title}`, {
      x: ux + 0.15, y: uy + 0.1, w: 2.5, h: 0.4,
      fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left", valign: "middle",
    });
    s.addText(uc.desc, {
      x: ux + 0.15, y: uy + 0.55, w: 2.5, h: 0.6,
      fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "top",
    });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.5, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addText("Hook \u8B93\u4F60\u5728\u4E0D\u4FEE\u6539 AI \u908F\u8F2F\u7684\u60C5\u6CC1\u4E0B\uFF0C\u63D2\u5165\u81EA\u8A02\u884C\u70BA", {
    x: 1.0, y: 4.5, w: 8.0, h: 0.5,
    fontSize: 13, fontFace: FB, color: C.grayLight, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 2);
})();

// ==========================================
// SLIDE 3 — Six hooks overview
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u516D\u7A2E Hook \u7E3D\u89BD", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const hooks = [
    { name: "on_session_start", trigger: "Session \u555F\u52D5\u6642", control: "additionalContext", color: C.green },
    { name: "on_user_prompt_submitted", trigger: "\u4F7F\u7528\u8005\u9001\u51FA\u8A0A\u606F", control: "modifiedPrompt", color: C.blue },
    { name: "on_pre_tool_use", trigger: "\u5DE5\u5177\u57F7\u884C\u524D", control: "allow / deny / ask", color: C.orange },
    { name: "on_post_tool_use", trigger: "\u5DE5\u5177\u57F7\u884C\u5F8C", control: "additionalContext", color: C.cyan },
    { name: "on_session_end", trigger: "Session \u7D50\u675F\u6642", control: "sessionSummary", color: C.red },
    { name: "on_error_occurred", trigger: "\u932F\u8AA4\u767C\u751F\u6642", control: "retry / skip / abort", color: C.yellow },
  ];

  hooks.forEach((h, i) => {
    const hy = 1.2 + i * 0.62;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: hy, w: 8.4, h: 0.52, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: hy, w: 0.05, h: 0.52, fill: { color: h.color } });

    s.addText(h.name, {
      x: 1.1, y: hy, w: 3.5, h: 0.52,
      fontSize: 12, fontFace: FC, color: h.color, bold: true, align: "left", valign: "middle",
    });
    s.addText(h.trigger, {
      x: 4.7, y: hy, w: 2.5, h: 0.52,
      fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
    });
    s.addText(h.control, {
      x: 7.3, y: hy, w: 1.7, h: 0.52,
      fontSize: 10, fontFace: FC, color: C.gray, align: "right", valign: "middle",
    });
  });

  // Column headers (subtle)
  s.addText("Hook \u540D\u7A31", { x: 1.1, y: 1.0, w: 3.5, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });
  s.addText("\u89F8\u767C\u6642\u6A5F", { x: 4.7, y: 1.0, w: 2.5, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });
  s.addText("\u53EF\u63A7\u5236", { x: 7.3, y: 1.0, w: 1.7, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "right" });

  // Note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.3, fill: { color: C.bgCard } });
  s.addText("\u6240\u6709 hook \u90FD\u662F async \u51FD\u5F0F\uFF0C\u63A5\u6536 (input_data, invocation)\uFF0C\u56DE\u50B3 dict \u6216 None", {
    x: 1.0, y: 4.85, w: 8.0, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.gray, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// ==========================================
// SLIDE 4 — Execution order
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Hook \u89F8\u767C\u9806\u5E8F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  // Flow boxes
  const flow = [
    { label: "session\n_start", color: C.green, x: 0.3, y: 1.8 },
    { label: "user_prompt\n_submitted", color: C.blue, x: 2.0, y: 1.8 },
    { label: "pre_tool\n_use", color: C.orange, x: 3.95, y: 1.8 },
    { label: "post_tool\n_use", color: C.cyan, x: 5.9, y: 1.8 },
    { label: "session\n_end", color: C.red, x: 8.1, y: 1.8 },
  ];

  flow.forEach((f, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: f.y, w: 1.5, h: 0.9, fill: { color: C.bgCard }, line: { color: f.color, width: 2 } });
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: f.y, w: 1.5, h: 0.04, fill: { color: f.color } });
    s.addText(f.label, { x: f.x, y: f.y + 0.05, w: 1.5, h: 0.8, fontSize: 10, fontFace: FC, color: C.white, align: "center", valign: "middle" });

    if (i < flow.length - 1 && i !== 3) {
      s.addText("\u25B6", { x: f.x + 1.5, y: f.y, w: flow[i + 1].x - f.x - 1.5, h: 0.9, fontSize: 14, color: C.gray, align: "center", valign: "middle" });
    }
  });

  // Arrow from post_tool back to user_prompt (loop)
  // Arrow space (no fill needed)
  s.addText("\u25B6", { x: 5.9 + 1.5, y: 1.8, w: 8.1 - 5.9 - 1.5, h: 0.9, fontSize: 14, color: C.gray, align: "center", valign: "middle" });

  // Loop bracket
  s.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: 2.85, w: 5.4, h: 0.04, fill: { color: C.grayDim } });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.0, y: 2.75, w: 0.04, h: 0.14, fill: { color: C.grayDim } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.36, y: 2.75, w: 0.04, h: 0.14, fill: { color: C.grayDim } });
  s.addText("\u53EF\u91CD\u8907\u591A\u6B21", { x: 3.5, y: 2.9, w: 2.5, h: 0.3, fontSize: 10, fontFace: FB, color: C.grayDim, align: "center" });

  // Error box (can happen anytime)
  s.addShape(pres.shapes.RECTANGLE, { x: 3.5, y: 3.5, w: 3.0, h: 0.7, fill: { color: C.bgCard }, line: { color: C.yellow, width: 1.5, dashType: "dash" } });
  s.addText("on_error_occurred", { x: 3.5, y: 3.5, w: 3.0, h: 0.35, fontSize: 11, fontFace: FC, color: C.yellow, bold: true, align: "center", valign: "bottom" });
  s.addText("\u53EF\u5728\u4EFB\u4F55\u968E\u6BB5\u89F8\u767C", { x: 3.5, y: 3.85, w: 3.0, h: 0.3, fontSize: 10, fontFace: FB, color: C.gray, align: "center", valign: "top" });

  // Three scenarios
  s.addText("\u4E09\u7A2E\u60C5\u5883\u7BC4\u4F8B", { x: 0.8, y: 4.35, w: 3, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const scenarios = [
    { label: "\u7D14\u6587\u5B57\u554F\u7B54", flow: "start \u2192 prompt \u2192 end", color: C.blue },
    { label: "\u5DE5\u5177\u4F7F\u7528", flow: "start \u2192 prompt \u2192 pre \u2192 post \u2192 end", color: C.green },
    { label: "\u5371\u96AA\u651E\u622A", flow: "start \u2192 prompt \u2192 pre(deny!) \u2192 end", color: C.red },
  ];
  scenarios.forEach((sc, i) => {
    const sx = 0.8 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 4.65, w: 2.8, h: 0.4, fill: { color: C.bgCard } });
    s.addText(`${sc.label}: `, { x: sx + 0.1, y: 4.65, w: 1.2, h: 0.4, fontSize: 10, fontFace: FB, color: sc.color, bold: true, align: "left", valign: "middle" });
    s.addText(sc.flow, { x: sx + 1.2, y: 4.65, w: 1.5, h: 0.4, fontSize: 8, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 4);
})();

// ==========================================
// SLIDE 5 — Key hook: on_user_prompt_submitted
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u91CD\u9EDE\uFF1A\u4FEE\u6539 Prompt", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("on_user_prompt_submitted", { x: 0.8, y: 0.8, w: 5, h: 0.3, fontSize: 13, fontFace: FC, color: C.blue, align: "left" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 2.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "async def ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "on_user_prompt_submitted", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(input_data, invocation):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    original = input_data["prompt"]', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # \u5728 prompt \u524D\u9762\u52A0\u4E0A\u4E0A\u4E0B\u6587", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    modified = ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'f"[Context: Python dev] {original}"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{"modifiedPrompt": modified}', options: { color: C.grayLight, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 2.1, valign: "top" });

  // Input/Output cards
  s.addText("Input \u6B04\u4F4D", { x: 0.8, y: 3.7, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.blue, bold: true, align: "left" });
  const inputs = ["prompt", "cwd", "timestamp"];
  inputs.forEach((inp, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 1.3, y: 4.05, w: 1.15, h: 0.35, fill: { color: C.bgCard } });
    s.addText(inp, { x: 0.8 + i * 1.3, y: 4.05, w: 1.15, h: 0.35, fontSize: 10, fontFace: FC, color: C.blue, align: "center", valign: "middle" });
  });

  s.addText("Output \u6B04\u4F4D", { x: 5.5, y: 3.7, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.green, bold: true, align: "left" });
  const outputs = ["modifiedPrompt", "additionalContext", "suppressOutput"];
  outputs.forEach((out, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 5.5 + i * 1.5, y: 4.05, w: 1.35, h: 0.35, fill: { color: C.bgCard } });
    s.addText(out, { x: 5.5 + i * 1.5, y: 4.05, w: 1.35, h: 0.35, fontSize: 9, fontFace: FC, color: C.green, align: "center", valign: "middle" });
  });

  // Note
  s.addText("\u56DE\u50B3 None \u8868\u793A\u4E0D\u505A\u4EFB\u4F55\u5E72\u9810", {
    x: 0.8, y: 4.6, w: 8.4, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.gray, align: "center",
  });

  addFooter(s);
  addNum(s, 5);
})();

// ==========================================
// SLIDE 6 — Key hook: on_pre_tool_use
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u91CD\u9EDE\uFF1A\u5DE5\u5177\u5B89\u5168\u9580\u885B", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("on_pre_tool_use", { x: 0.8, y: 0.8, w: 5, h: 0.3, fontSize: 13, fontFace: FC, color: C.orange, align: "left" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 2.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "async def ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "on_pre_tool_use", options: { color: C.orange, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(input_data, invocation):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    tool_name = input_data.get("toolName")', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    tool_input = input_data.get("toolInput", "")', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "    # \u651E\u622A\u5371\u96AA\u7684 shell \u6307\u4EE4", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'tool_name == "shell" ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "and ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"rm " ', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "in ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "tool_input:", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "{", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "permissionDecision": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"deny"', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '            "permissionDecisionReason": ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"Blocked"', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "        }", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 2.3, valign: "top" });

  // Three decisions
  s.addText("\u4E09\u7A2E\u6C7A\u5B9A", { x: 0.8, y: 3.9, w: 2, h: 0.3, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });

  const decisions = [
    { val: '"allow"', desc: "\u5141\u8A31\u57F7\u884C", color: C.green },
    { val: '"deny"', desc: "\u62D2\u7D55\u57F7\u884C", color: C.red },
    { val: '"ask"', desc: "\u8A62\u554F\u4F7F\u7528\u8005", color: C.yellow },
  ];
  decisions.forEach((d, i) => {
    const dx = 0.8 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x: dx, y: 4.3, w: 2.7, h: 0.55, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: dx, y: 4.3, w: 0.05, h: 0.55, fill: { color: d.color } });
    s.addText(d.val, { x: dx + 0.2, y: 4.3, w: 1.3, h: 0.55, fontSize: 12, fontFace: FC, color: d.color, bold: true, align: "left", valign: "middle" });
    s.addText(d.desc, { x: dx + 1.5, y: 4.3, w: 1.0, h: 0.55, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// ==========================================
// SLIDE 7 — Registration
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u8A3B\u518A Hook", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 9.0, h: 3.0, fill: { color: C.bgCard } });
  s.addText([
    { text: "ALL_HOOKS = {", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_session_start"', options: { color: C.green, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_session_start,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_user_prompt_submitted"', options: { color: C.blue, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_user_prompt_submitted,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_pre_tool_use"', options: { color: C.orange, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_pre_tool_use,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_post_tool_use"', options: { color: C.cyan, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_post_tool_use,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_session_end"', options: { color: C.red, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_session_end,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: '    "on_error_occurred"', options: { color: C.yellow, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: ": on_error_occurred,", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "}", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "    hooks=", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "ALL_HOOKS", options: { color: C.orange, fontFace: FC, fontSize: 13, bold: true, breakLine: false } },
    { text: ",  ...", options: { color: C.gray, fontFace: FC, fontSize: 13 } },
  ], { x: 0.8, y: 1.4, w: 8.4, h: 2.8, valign: "top" });

  s.addText("\u2191 \u5C07 hook dict \u50B3\u5165 create_session \u7684 hooks \u53C3\u6578", {
    x: 1.5, y: 4.4, w: 6, h: 0.4,
    fontSize: 14, fontFace: FB, color: C.orange, bold: true, align: "center",
  });

  addFooter(s);
  addNum(s, 7);
})();

// ==========================================
// SLIDE 8 — Error handling hook
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u932F\u8AA4\u8655\u7406 Hook", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("on_error_occurred", { x: 0.8, y: 1.0, w: 5, h: 0.3, fontSize: 13, fontFace: FC, color: C.yellow, align: "left" });

  // Code
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.4, w: 9.0, h: 1.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "async def ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "on_error_occurred", options: { color: C.yellow, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(input_data, invocation):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    error = input_data.get("error")', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    recoverable = input_data.get("recoverable", False)', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "return ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '{"errorHandling": "skip"}', options: { color: C.grayLight, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.5, w: 8.6, h: 1.3, valign: "top" });

  // Three strategies
  s.addText("\u4E09\u7A2E\u932F\u8AA4\u8655\u7406\u7B56\u7565", { x: 0.8, y: 3.2, w: 4, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const strategies = [
    { val: '"retry"', desc: "\u91CD\u8A66\u64CD\u4F5C\uFF08\u53EF\u642D\u914D retryCount\uFF09", color: C.green, extra: "\u9069\u5408\uFF1A\u7DB2\u8DEF\u903E\u6642\u3001\u6682\u6642\u6027\u932F\u8AA4" },
    { val: '"skip"', desc: "\u8DF3\u904E\u932F\u8AA4\uFF0C\u7E7C\u7E8C\u57F7\u884C", color: C.yellow, extra: "\u9069\u5408\uFF1A\u975E\u95DC\u9375\u64CD\u4F5C\u5931\u6557" },
    { val: '"abort"', desc: "\u7D42\u6B62 Session", color: C.red, extra: "\u9069\u5408\uFF1A\u4E0D\u53EF\u6062\u5FA9\u7684\u56B4\u91CD\u932F\u8AA4" },
  ];
  strategies.forEach((st, i) => {
    const sy = 3.7 + i * 0.6;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: sy, w: 0.05, h: 0.5, fill: { color: st.color } });
    s.addText(st.val, { x: 1.1, y: sy, w: 1.2, h: 0.5, fontSize: 12, fontFace: FC, color: st.color, bold: true, align: "left", valign: "middle" });
    s.addText(st.desc, { x: 2.5, y: sy, w: 3.5, h: 0.5, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(st.extra, { x: 6.2, y: sy, w: 2.8, h: 0.5, fontSize: 10, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 8);
})();

// ==========================================
// SLIDE 9 — Summary
// ==========================================
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.yellow, bold: true, align: "left" });
  s.addText([
    { text: "\u516D\u7A2E Hook \u6DB5\u84CB Session \u5168\u751F\u547D\u9031\u671F", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u4FEE\u6539 Prompt\u3001\u651E\u622A\u5DE5\u5177\u3001\u8655\u7406\u932F\u8AA4", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "hooks dict \u50B3\u5165 create_session", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u56DE\u50B3 dict \u63A7\u5236\u884C\u70BA\uFF0CNone \u4E0D\u5E72\u9810", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.blue } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText("\u7B2C 07 \u8AB2\uFF1AMCP \u4F3A\u670D\u5668\u6574\u5408", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u7528 MCP \u5354\u5B9A\u8B93 AI\n\u5B58\u53D6\u5916\u90E8\u670D\u52D9", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.blue, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300CHook \u8B93\u4F60\u5728\u4E0D\u6539 AI \u7684\u60C5\u6CC1\u4E0B\uFF0C\u63A7\u5236 AI \u7684\u884C\u70BA\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.yellow, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 9);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/06_session_hooks/slides.pptx" })
  .then(() => console.log("06_session_hooks/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
