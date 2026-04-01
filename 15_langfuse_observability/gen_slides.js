const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 15 課：Langfuse LLM 可觀測性";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 15 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.orange } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.orange } });
  s.addText("LESSON 15", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("Langfuse \u53EF\u89C0\u6E2C\u6027", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u624B\u52D5\u4E8B\u4EF6\u6620\u5C04 \u2014 \u5B8C\u5168\u63A7\u5236 LLM \u8FFD\u8E64\u7C92\u5EA6", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "session.on(tracer.handle_event)", options: { color: C.orange, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "# SDK events \u2192 Langfuse traces", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "# generations + tool spans", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });
  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Langfuse core objects
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Langfuse \u6838\u5FC3\u7269\u4EF6", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const objects = [
    { name: "Trace", desc: "\u4E00\u6B21\u5B8C\u6574\u4E92\u52D5\u7684\u8FFD\u8E64\u7D00\u9304", usage: "\u6BCF\u500B\u4F7F\u7528\u8005\u554F\u984C\u4E00\u689D trace", color: C.blue },
    { name: "Span", desc: "trace \u5167\u7684\u57F7\u884C\u5340\u6BB5\uFF0C\u53EF\u5DE2\u72C0", usage: "root span\u3001turn span\u3001tool span", color: C.green },
    { name: "Generation", desc: "LLM \u5C08\u7528 span\uFF0C\u8A18\u9304 model/tokens/cost", usage: "\u6BCF\u6B21 LLM \u56DE\u8986\u4E00\u500B", color: C.orange },
    { name: "Event", desc: "\u6642\u9593\u9EDE\u4E8B\u4EF6\uFF0C\u7121\u6301\u7E8C\u6642\u9593", usage: "\u8A18\u9304\u932F\u8AA4", color: C.red },
  ];

  objects.forEach((o, i) => {
    const oy = 1.2 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 8.4, h: 0.7, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: oy, w: 0.06, h: 0.7, fill: { color: o.color } });
    s.addText(o.name, { x: 1.1, y: oy, w: 1.8, h: 0.7, fontSize: 16, fontFace: FB, color: o.color, bold: true, align: "left", valign: "middle" });
    s.addText(o.desc, { x: 3.0, y: oy, w: 3.0, h: 0.7, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(o.usage, { x: 6.2, y: oy, w: 2.8, h: 0.7, fontSize: 11, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Event mapping
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4E8B\u4EF6 \u2192 Langfuse \u6620\u5C04", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 34, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const mappings = [
    { event: "user.message", obj: "root span + trace", desc: "\u5EFA\u7ACB trace", color: C.blue },
    { event: "turn_start", obj: "turn span (\u5B50 span)", desc: "\u6BCF\u500B LLM turn", color: C.green },
    { event: "usage \u2192 message", obj: "generation (\u5408\u4F75)", desc: "model + tokens + cost", color: C.orange },
    { event: "tool.start", obj: "tool span", desc: "\u5DE5\u5177\u540D\u7A31\u3001\u53C3\u6578", color: C.purple },
    { event: "tool.complete", obj: "span.end()", desc: "\u6210\u529F/\u5931\u6557", color: C.cyan },
    { event: "session.idle", obj: "root span.end()", desc: "trace \u5B8C\u6210", color: C.red },
  ];

  // Column headers
  s.addText("SDK \u4E8B\u4EF6", { x: 0.8, y: 1.1, w: 2.8, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });
  s.addText("Langfuse \u7269\u4EF6", { x: 3.8, y: 1.1, w: 3.0, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });
  s.addText("\u8A18\u9304\u5167\u5BB9", { x: 7.0, y: 1.1, w: 2.2, h: 0.2, fontSize: 9, fontFace: FB, color: C.grayDim, align: "left" });

  mappings.forEach((m, i) => {
    const my = 1.35 + i * 0.52;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: my, w: 8.4, h: 0.42, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: my, w: 0.05, h: 0.42, fill: { color: m.color } });
    s.addText(m.event, { x: 1.0, y: my, w: 2.6, h: 0.42, fontSize: 10.5, fontFace: FC, color: m.color, align: "left", valign: "middle" });
    s.addText(m.obj, { x: 3.8, y: my, w: 3.0, h: 0.42, fontSize: 10.5, fontFace: FC, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(m.desc, { x: 7.0, y: my, w: 2.0, h: 0.42, fontSize: 10.5, fontFace: FB, color: C.gray, align: "left", valign: "middle" });
  });

  // Merge strategy note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 8.4, h: 0.5, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.55, w: 0.06, h: 0.5, fill: { color: C.yellow } });
  s.addText("\u5408\u4F75\u7B56\u7565\uFF1Ausage \u5148\u5230\u6642\u66AB\u5B58 model/tokens/cost\uFF0Cmessage \u5230\u9054\u6642\u5408\u4F75\u5EFA\u7ACB generation", {
    x: 1.1, y: 4.55, w: 7.9, h: 0.5, fontSize: 11, fontFace: FB, color: C.yellow, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Trace structure
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Trace \u7D50\u69CB\u793A\u610F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  // Tree structure
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 3.8, fill: { color: C.bgCard } });

  const tree = [
    { text: "user.message", indent: 0, color: C.blue, note: "\u2190 \u5EFA\u7ACB trace" },
    { text: "\u251C\u2500\u2500 turn-0", indent: 1, color: C.green, note: "turn span" },
    { text: "\u2502     \u251C\u2500\u2500 usage", indent: 2, color: C.gray, note: "\u66AB\u5B58 token \u7528\u91CF" },
    { text: "\u2502     \u251C\u2500\u2500 message", indent: 2, color: C.orange, note: "\u2192 generation" },
    { text: "\u2502     \u2514\u2500\u2500 turn_end", indent: 2, color: C.gray, note: "" },
    { text: "\u251C\u2500\u2500 tool:bash", indent: 1, color: C.purple, note: "tool span" },
    { text: "\u251C\u2500\u2500 tool:bash (complete)", indent: 1, color: C.purple, note: "span.end()" },
    { text: "\u251C\u2500\u2500 turn-1", indent: 1, color: C.green, note: "\u7B2C\u4E8C\u500B turn" },
    { text: "\u2502     \u251C\u2500\u2500 usage \u2192 message", indent: 2, color: C.orange, note: "\u2192 generation" },
    { text: "\u2502     \u2514\u2500\u2500 turn_end", indent: 2, color: C.gray, note: "" },
    { text: "\u2514\u2500\u2500 session.idle", indent: 1, color: C.red, note: "\u2190 trace \u5B8C\u6210" },
  ];

  tree.forEach((t, i) => {
    const ty = 1.35 + i * 0.3;
    const tx = 0.8 + t.indent * 0.5;
    s.addText(t.text, { x: tx, y: ty, w: 5.0, h: 0.28, fontSize: 11, fontFace: FC, color: t.color, align: "left", valign: "middle" });
    if (t.note) {
      s.addText(t.note, { x: 6.5, y: ty, w: 2.8, h: 0.28, fontSize: 10, fontFace: FB, color: C.grayDim, align: "left", valign: "middle" });
    }
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: LangfuseTracer key methods
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("LangfuseTracer \u6838\u5FC3\u7A0B\u5F0F\u78BC", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "# user.message \u2192 \u5EFA\u7ACB trace", options: { color: C.gray, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "trace_id = Langfuse.create_trace_id()", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "root = langfuse.start_span(", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '    name="copilot-request", input=prompt,', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '    trace_context={"trace_id": trace_id})', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "root.update_trace(", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: 'user_id="kuan6"', options: { color: C.blue, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: ", ...)", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 10.5, color: C.white } },
    { text: "# turn_start \u2192 \u5B50 span", options: { color: C.gray, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: 'turn = root.start_span(name="turn-0")', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 10.5, color: C.white } },
    { text: "# usage + message \u2192 generation\uFF08\u5408\u4F75\uFF09", options: { color: C.gray, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "gen = turn.start_observation(", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '    name="llm-call", ', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: 'as_type="generation"', options: { color: C.orange, fontFace: FC, fontSize: 10.5, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: '    model=usage["model"], output=content,', options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "    usage_details={", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: '"input": 100, "output": 50', options: { color: C.green, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: "})", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "gen.end()", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 10.5, color: C.white } },
    { text: "# session.idle \u2192 trace \u5B8C\u6210", options: { color: C.gray, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "root.end()", options: { color: C.grayLight, fontFace: FC, fontSize: 10.5, breakLine: true } },
    { text: "langfuse.", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: "flush", options: { color: C.red, fontFace: FC, fontSize: 10.5, bold: true, breakLine: false } },
    { text: "()  ", options: { color: C.white, fontFace: FC, fontSize: 10.5, breakLine: false } },
    { text: "# \u5FC5\u547C\u53EB\uFF01", options: { color: C.red, fontFace: FC, fontSize: 10.5 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Code: usage
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4F7F\u7528\u65B9\u5F0F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 2.3, fill: { color: C.bgCard } });
  s.addText([
    { text: "langfuse = Langfuse(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    public_key="pk-lf-...", secret_key="sk-lf-...",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    host="https://cloud.langfuse.com"', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "tracer = LangfuseTracer(langfuse, ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'session_id="demo"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ", ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'user_id="kuan6"', options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "session.on(tracer.handle_event)", options: { color: C.orange, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "# \u7167\u5E38\u4F7F\u7528 session\uFF0Ctraces \u81EA\u52D5\u5EFA\u7ACB", options: { color: C.gray, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 2.1, valign: "top" });

  // Dashboard metrics
  s.addText("Dashboard \u53EF\u89C0\u5BDF", { x: 0.8, y: 3.8, w: 3, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const metrics = [
    { name: "Traces", color: C.blue },
    { name: "Generations", color: C.orange },
    { name: "Token \u7528\u91CF", color: C.green },
    { name: "\u6210\u672C", color: C.yellow },
    { name: "Sessions", color: C.purple },
    { name: "Users", color: C.cyan },
  ];
  metrics.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const mx = 0.8 + col * 3.0;
    const my = 4.2 + row * 0.38;
    s.addShape(pres.shapes.RECTANGLE, { x: mx, y: my, w: 0.05, h: 0.3, fill: { color: m.color } });
    s.addText(m.name, { x: mx + 0.15, y: my, w: 2.7, h: 0.3, fontSize: 11, fontFace: FB, color: m.color, bold: true, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — OpenLIT vs Langfuse
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("OpenLIT vs Langfuse", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const rows = [
    { aspect: "\u5354\u5B9A", openlit: "OTLP / OpenTelemetry", langfuse: "Langfuse \u81EA\u6709 SDK" },
    { aspect: "\u6574\u5408\u65B9\u5F0F", openlit: "TelemetryConfig \u81EA\u52D5\u6536\u96C6", langfuse: "session events \u624B\u52D5\u6620\u5C04" },
    { aspect: "\u63A7\u5236\u7C92\u5EA6", openlit: "\u81EA\u52D5\uFF08CLI \u5167\u90E8\u64CD\u4F5C\uFF09", langfuse: "\u5B8C\u5168\u81EA\u8A02" },
    { aspect: "\u984D\u5916\u529F\u80FD", openlit: "metrics\u3001\u6210\u672C\u5206\u6790", langfuse: "evaluations\u3001prompt mgmt" },
    { aspect: "\u90E8\u7F72", openlit: "\u55AE\u4E00 Docker", langfuse: "PostgreSQL + Langfuse" },
  ];

  // Headers
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.15, w: 2.4, h: 0.4, fill: { color: C.bgCardLight } });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.3, y: 1.15, w: 3.0, h: 0.4, fill: { color: C.bgCardLight } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: 1.15, w: 2.8, h: 0.4, fill: { color: C.bgCardLight } });
  s.addText("", { x: 0.8, y: 1.15, w: 2.4, h: 0.4, fontSize: 11, fontFace: FB, color: C.grayDim, align: "center", valign: "middle" });
  s.addText("OpenLIT (\u7B2C 14 \u8AB2)", { x: 3.3, y: 1.15, w: 3.0, h: 0.4, fontSize: 11, fontFace: FC, color: C.yellow, bold: true, align: "center", valign: "middle" });
  s.addText("Langfuse (\u672C\u8AB2)", { x: 6.4, y: 1.15, w: 2.8, h: 0.4, fontSize: 11, fontFace: FC, color: C.orange, bold: true, align: "center", valign: "middle" });

  rows.forEach((r, i) => {
    const ry = 1.6 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ry, w: 2.4, h: 0.42, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.3, y: ry, w: 3.0, h: 0.42, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 6.4, y: ry, w: 2.8, h: 0.42, fill: { color: C.bgCard } });
    s.addText(r.aspect, { x: 0.9, y: ry, w: 2.2, h: 0.42, fontSize: 10.5, fontFace: FB, color: C.grayLight, bold: true, align: "left", valign: "middle" });
    s.addText(r.openlit, { x: 3.4, y: ry, w: 2.8, h: 0.42, fontSize: 10, fontFace: FB, color: C.grayLight, align: "center", valign: "middle" });
    s.addText(r.langfuse, { x: 6.5, y: ry, w: 2.6, h: 0.42, fontSize: 10, fontFace: FB, color: C.grayLight, align: "center", valign: "middle" });
  });

  // Conclusion
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 8.4, h: 0.7, fill: { color: C.bgCard } });
  s.addText([
    { text: "OpenLIT", options: { color: C.yellow, fontFace: FB, fontSize: 12, bold: true, breakLine: false } },
    { text: " = \u5FEB\u901F\u4E0A\u624B\uFF0C\u81EA\u52D5\u6536\u96C6     ", options: { color: C.grayLight, fontFace: FB, fontSize: 12, breakLine: false } },
    { text: "Langfuse", options: { color: C.orange, fontFace: FB, fontSize: 12, bold: true, breakLine: false } },
    { text: " = \u5B8C\u5168\u63A7\u5236\uFF0CLLM \u8A9E\u610F\u5C64\u7D1A\u8FFD\u8E64", options: { color: C.grayLight, fontFace: FB, fontSize: 12 } },
  ], { x: 1.0, y: 4.2, w: 8.0, h: 0.7, valign: "middle", align: "center" });

  addFooter(s);
  addNum(s, 7);
})();

// SLIDE 8 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.orange, bold: true, align: "left" });
  s.addText([
    { text: "SDK events \u2192 Langfuse traces \u6620\u5C04", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "Trace / Span / Generation / Event", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "usage + message \u5408\u4F75\u7B56\u7565", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "flush() \u7A0B\u5F0F\u7D50\u675F\u524D\u5FC5\u547C\u53EB", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.blue } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.blue, bold: true, align: "left" });
  s.addText("\u7B2C 16 \u8AB2\uFF1A\u4E0A\u4E0B\u6587\u7BA1\u7406", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("infinite_sessions\n\u8655\u7406\u9577\u5C0D\u8A71\u7684\u4E0A\u4E0B\u6587", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.blue, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u624B\u52D5\u6620\u5C04 = \u5B8C\u5168\u63A7\u5236 \u2014 \u4F60\u6C7A\u5B9A\u8FFD\u8E64\u4EC0\u9EBC\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.orange, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 8);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/15_langfuse_observability/slides.pptx" })
  .then(() => console.log("15_langfuse_observability/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
