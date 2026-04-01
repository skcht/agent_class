const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 13 課：Sub-Agent 事件監控";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 13 \u8AB2";
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
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.cyan } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fill: { color: C.cyan } });
  s.addText("LESSON 13", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });
  s.addText("Sub-Agent \u4E8B\u4EF6\u76E3\u63A7", { x: 0.8, y: 1.85, w: 8.4, h: 1.0, fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });
  s.addText("\u5373\u6642\u8FFD\u8E64 Agent \u59D4\u6D3E\u3001\u57F7\u884C\u3001\u5B8C\u6210\u72C0\u614B", { x: 0.8, y: 2.85, w: 8.4, h: 0.5, fontSize: 18, fontFace: FB, color: C.grayLight, align: "left" });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "subagent.selected  ", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "\u2192 Agent \u88AB\u9078\u5B9A", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "subagent.started   ", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "\u2192 \u958B\u59CB\u57F7\u884C", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "subagent.completed ", options: { color: C.cyan, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "\u2192 \u6210\u529F\u5B8C\u6210", options: { color: C.gray, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", { x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left" });
  addNum(s, 1);
})();

// SLIDE 2 — Lifecycle flow
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("Sub-Agent \u751F\u547D\u9031\u671F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const flow = [
    { label: "\u4F7F\u7528\u8005\nprompt", color: C.blue, x: 0.2 },
    { label: "runtime\n\u5206\u6790\u610F\u5716", color: C.purple, x: 1.7 },
    { label: "selected", color: C.green, x: 3.2 },
    { label: "started", color: C.blue, x: 4.7 },
    { label: "completed\n/ failed", color: C.cyan, x: 6.2 },
    { label: "deselected", color: C.orange, x: 7.9 },
  ];
  flow.forEach((f, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 1.6, w: 1.3, h: 0.85, fill: { color: C.bgCard }, line: { color: f.color, width: 1.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: f.x, y: 1.6, w: 1.3, h: 0.04, fill: { color: f.color } });
    s.addText(f.label, { x: f.x, y: 1.65, w: 1.3, h: 0.75, fontSize: 10, fontFace: FC, color: C.white, align: "center", valign: "middle" });
    if (i < flow.length - 1) {
      s.addText("\u25B6", { x: f.x + 1.3, y: 1.6, w: flow[i + 1].x - f.x - 1.3, h: 0.85, fontSize: 10, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  // Events table
  s.addText("\u4E94\u7A2E\u4E8B\u4EF6", { x: 0.8, y: 2.7, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const events = [
    { name: "subagent.selected", desc: "runtime \u9078\u5B9A agent", data: "agent_name, tools", color: C.green },
    { name: "subagent.started", desc: "agent \u958B\u59CB\u57F7\u884C", data: "tool_call_id, agent_name", color: C.blue },
    { name: "subagent.completed", desc: "agent \u6210\u529F\u5B8C\u6210", data: "tool_call_id, agent_name", color: C.cyan },
    { name: "subagent.failed", desc: "agent \u767C\u751F\u932F\u8AA4", data: "tool_call_id, error", color: C.red },
    { name: "subagent.deselected", desc: "\u5207\u63DB\u96E2\u958B agent", data: "\u2014", color: C.orange },
  ];
  events.forEach((e, i) => {
    const ey = 3.1 + i * 0.38;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ey, w: 0.05, h: 0.32, fill: { color: e.color } });
    s.addText(e.name, { x: 1.0, y: ey, w: 3.0, h: 0.32, fontSize: 10.5, fontFace: FC, color: e.color, align: "left", valign: "middle" });
    s.addText(e.desc, { x: 4.2, y: ey, w: 2.5, h: 0.32, fontSize: 10.5, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
    s.addText(e.data, { x: 7.0, y: ey, w: 2.2, h: 0.32, fontSize: 9.5, fontFace: FC, color: C.gray, align: "right", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Use cases
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u61C9\u7528\u5834\u666F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  const cases = [
    { title: "\u5373\u6642 UI \u72C0\u614B", desc: "\u986F\u793A\u300C\u7A0B\u5F0F\u78BC\u7814\u7A76\u54E1\u6B63\u5728\u5DE5\u4F5C...\u300D\n\u8B93\u4F7F\u7528\u8005\u77E5\u9053\u54EA\u500B Agent \u5728\u57F7\u884C", color: C.blue },
    { title: "\u57F7\u884C\u6642\u9593\u8FFD\u8E64", desc: "\u8A18\u9304\u6BCF\u500B Agent \u7684\u57F7\u884C\u6642\u9593\n\u627E\u51FA\u6548\u80FD\u74F6\u9838", color: C.green },
    { title: "\u932F\u8AA4\u8655\u7406\u8207\u91CD\u8A66", desc: "subagent.failed \u89F8\u767C\u6642\n\u81EA\u52D5\u91CD\u8A66\u6216\u901A\u77E5\u4F7F\u7528\u8005", color: C.red },
    { title: "\u6D3B\u52D5\u65E5\u8A8C", desc: "\u8A18\u9304\u6240\u6709 Agent \u7684\u6210\u529F/\u5931\u6557\u7387\n\u7528\u65BC\u5206\u6790\u548C\u6539\u9032", color: C.orange },
  ];

  cases.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = 0.5 + col * 4.7;
    const cy = 1.2 + row * 1.5;
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.3, h: 1.25, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 4.3, h: 0.04, fill: { color: c.color } });
    s.addText(c.title, { x: cx + 0.15, y: cy + 0.08, w: 4.0, h: 0.35, fontSize: 14, fontFace: FB, color: c.color, bold: true, align: "left", valign: "middle" });
    s.addText(c.desc, { x: cx + 0.15, y: cy + 0.45, w: 4.0, h: 0.7, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Code: AgentTracker
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("AgentTracker \u5BE6\u4F5C", { x: 0.8, y: 0.25, w: 8.4, h: 0.6, fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 0.95, w: 9.0, h: 4.1, fill: { color: C.bgCard } });
  s.addText([
    { text: "class ", options: { color: C.purple, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "AgentTracker", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "    def handle_event(self, event):", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "        event_type = event.type.value", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: '        if event_type == ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"subagent.selected"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "            name = event.data.agent_display_name", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: '        elif event_type == ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"subagent.started"', options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "            self.active_agents[call_id] = {", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '                "start_time": time.time()}', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: '        elif event_type == ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"subagent.completed"', options: { color: C.cyan, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "            elapsed = time.time() - start_time", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: '            self.history.append({...})', options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 11, color: C.white } },
    { text: '        elif event_type == ', options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: '"subagent.failed"', options: { color: C.red, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ":", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "            error = event.data.error", options: { color: C.grayLight, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 1.05, w: 8.6, h: 3.9, valign: "top" });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: Usage
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u4F7F\u7528\u65B9\u5F0F", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 2.0, fill: { color: C.bgCard } });
  s.addText([
    { text: "tracker = AgentTracker()", options: { color: C.grayLight, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "# \u8A02\u95B1\u4E8B\u4EF6", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "session.", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: "on", options: { color: C.blue, fontFace: FC, fontSize: 13, bold: true, breakLine: false } },
    { text: "(tracker.handle_event)", options: { color: C.white, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 13, color: C.white } },
    { text: "# \u9001\u51FA\u4EFB\u52D9\uFF0Ctracker \u81EA\u52D5\u8FFD\u8E64 agent \u6D3B\u52D5", options: { color: C.gray, fontFace: FC, fontSize: 13, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 13, breakLine: false } },
    { text: 'session.send_and_wait("\u8ACB\u5206\u6790\u7A0B\u5F0F\u78BC...")', options: { color: C.white, fontFace: FC, fontSize: 13 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 1.8, valign: "top" });

  // Output example
  s.addText("\u8F38\u51FA\u7BC4\u4F8B", { x: 0.8, y: 3.5, w: 2, h: 0.35, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.9, w: 9.0, h: 1.1, fill: { color: "000000" } });
  s.addText([
    { text: "  [\u9078\u5B9A] Agent: \u7A0B\u5F0F\u78BC\u7814\u7A76\u54E1 (\u5DE5\u5177: grep, glob, view)", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "  [\u555F\u52D5] \u7A0B\u5F0F\u78BC\u7814\u7A76\u54E1", options: { color: C.blue, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "  [\u5B8C\u6210] \u7A0B\u5F0F\u78BC\u7814\u7A76\u54E1 (2.3s)", options: { color: C.cyan, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "  [\u53D6\u6D88\u9078\u5B9A] \u56DE\u5230 parent agent", options: { color: C.orange, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 3.95, w: 8.6, h: 1.0, valign: "top" });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Activity summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u6D3B\u52D5\u6458\u8981\u5831\u544A", { x: 0.8, y: 0.4, w: 8.4, h: 0.7, fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 9.0, h: 1.5, fill: { color: C.bgCard } });
  s.addText([
    { text: "def ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "print_summary", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "(self):", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    print(f"\u5171 {len(self.history)} \u6B21 sub-agent \u547C\u53EB")', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "for ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "entry ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "in ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "self.history:", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        status = "OK" ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "if ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'entry["status"] == "completed" ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "else ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"FAIL"', options: { color: C.red, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '        print(f"  - {name}: {status} ({time:.1f}s)")', options: { color: C.grayLight, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.3, w: 8.6, h: 1.3, valign: "top" });

  // Sample output
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 9.0, h: 1.2, fill: { color: "000000" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.0, w: 9.0, h: 0.3, fill: { color: "2D2D2D" } });
  s.addText("Agent \u6D3B\u52D5\u6458\u8981", { x: 0.7, y: 3.0, w: 3, h: 0.3, fontSize: 10, fontFace: FC, color: C.gray, align: "left", valign: "middle" });
  s.addText([
    { text: "\u5171 2 \u6B21 sub-agent \u547C\u53EB:", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "  - \u7A0B\u5F0F\u78BC\u7814\u7A76\u54E1: OK (2.3s)", options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "  - \u7A0B\u5F0F\u78BC\u7DE8\u8F2F\u54E1: OK (1.8s)", options: { color: C.green, fontFace: FC, fontSize: 11 } },
  ], { x: 0.7, y: 3.35, w: 8.6, h: 0.8, valign: "top" });

  // What you can build
  s.addText("\u53EF\u5EF6\u4F38\u61C9\u7528", { x: 0.8, y: 4.4, w: 2, h: 0.3, fontSize: 13, fontFace: FB, color: C.white, bold: true, align: "left" });
  const ext = [
    { text: "\u5373\u6642\u9032\u5EA6\u689D", color: C.blue },
    { text: "\u6548\u80FD\u5100\u8868\u677F", color: C.green },
    { text: "\u5931\u6557\u91CD\u8A66\u6A5F\u5236", color: C.red },
  ];
  ext.forEach((e, i) => {
    const ex = 0.8 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x: ex, y: 4.7, w: 2.7, h: 0.35, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: ex, y: 4.7, w: 0.05, h: 0.35, fill: { color: e.color } });
    s.addText(e.text, { x: ex + 0.15, y: 4.7, w: 2.4, h: 0.35, fontSize: 11, fontFace: FB, color: e.color, bold: true, align: "left", valign: "middle" });
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
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "left" });
  s.addText([
    { text: "5 \u7A2E sub-agent \u751F\u547D\u9031\u671F\u4E8B\u4EF6", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "session.on() \u8A02\u95B1\u5373\u53EF\u76E3\u63A7", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "AgentTracker \u8FFD\u8E64\u57F7\u884C\u6642\u9593", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "\u5EFA\u69CB\u5373\u6642\u76E3\u63A7\u8207\u6D3B\u52D5\u65E5\u8A8C", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.yellow } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.yellow, bold: true, align: "left" });
  s.addText("\u7B2C 14 \u8AB2\uFF1AOpenLIT \u53EF\u89C0\u6E2C\u6027", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("LLM \u8A08\u91CF\u3001\u6210\u672C\u8FFD\u8E64\n\u8207\u6548\u80FD\u76E3\u63A7", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.yellow, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u77E5\u9053 Agent \u5728\u505A\u4EC0\u9EBC \u2014 \u5373\u6642\u76E3\u63A7\u662F\u63A7\u5236\u7684\u7B2C\u4E00\u6B65\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55, fontSize: 16, fontFace: FB, color: C.cyan, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/13_subagent_events/slides.pptx" })
  .then(() => console.log("13_subagent_events/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
