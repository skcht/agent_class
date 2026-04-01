const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Claude";
pres.title = "第 09 課：Session 持久化 — 斷線後恢復";

const C = {
  bgDark: "0D1117", bgCard: "161B22", bgCardLight: "1C2333",
  blue: "58A6FF", green: "3FB950", orange: "F0883E", purple: "BC8CFF",
  red: "FF7B72", yellow: "E3B341", cyan: "39D2C0",
  white: "FFFFFF", gray: "8B949E", grayLight: "C9D1D9", grayDim: "484F58",
};
const FOOTER = "GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217 \u2014 \u7B2C 09 \u8AB2";
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
  s.addText("LESSON 09", { x: 0.8, y: 1.2, w: 1.1, h: 0.45, fontSize: 13, fontFace: FB, color: C.bgDark, bold: true, align: "center", valign: "middle" });

  s.addText("Session \u6301\u4E45\u5316", {
    x: 0.8, y: 1.85, w: 8.4, h: 1.0,
    fontSize: 44, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });
  s.addText("\u65B7\u7DDA\u5F8C\u6062\u5FA9 \u2014 \u4FDD\u7559\u5C0D\u8A71\u4E0A\u4E0B\u6587", {
    x: 0.8, y: 2.85, w: 8.4, h: 0.5,
    fontSize: 18, fontFace: FB, color: C.grayLight, align: "left",
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 3.8, w: 4.5, h: 1.2, fill: { color: C.bgCard } });
  s.addText([
    { text: "session = create_session(", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: 'session_id="my-id"', options: { color: C.green, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: "session.disconnect()  ", options: { color: C.grayLight, fontFace: FC, fontSize: 11, breakLine: false } },
    { text: "# \u4FDD\u7559\u8CC7\u6599", options: { color: C.gray, fontFace: FC, fontSize: 11, breakLine: true } },
    { text: 'resumed = resume_session("my-id")', options: { color: C.cyan, fontFace: FC, fontSize: 11 } },
  ], { x: 5.4, y: 3.9, w: 4.1, h: 1.0, valign: "top" });

  s.addText("GitHub Copilot SDK Python \u6559\u5B78\u7CFB\u5217", {
    x: 0.8, y: 4.7, w: 4, h: 0.4, fontSize: 12, fontFace: FB, color: C.gray, align: "left",
  });
  addNum(s, 1);
})();

// SLIDE 2 — Why persistence?
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u70BA\u4EC0\u9EBC\u9700\u8981\u6301\u4E45\u5316\uFF1F", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const scenarios = [
    { icon: "\u23F1\uFE0F", title: "\u9577\u6642\u9593\u4EFB\u52D9", desc: "\u4EFB\u52D9\u57F7\u884C\u5230\u4E00\u534A\uFF0C\u4F7F\u7528\u8005\u9700\u8981\u96E2\u958B\n\u7A0D\u5F8C\u56DE\u4F86\u7E7C\u7E8C", color: C.blue },
    { icon: "\uD83D\uDD04", title: "\u7A0B\u5F0F\u91CD\u555F", desc: "\u7A0B\u5F0F crash \u6216\u91CD\u65B0\u90E8\u7F72\n\u6062\u5FA9\u5148\u524D\u7684\u5C0D\u8A71\u72C0\u614B", color: C.green },
    { icon: "\uD83D\uDCBE", title: "\u4FDD\u7559\u4E0A\u4E0B\u6587", desc: "AI \u8A18\u5F97\u4E4B\u524D\u8AAA\u904E\u7684\u5167\u5BB9\n\u4E0D\u9700\u8981\u91CD\u65B0\u63D0\u4F9B\u80CC\u666F", color: C.orange },
  ];

  scenarios.forEach((sc, i) => {
    const sx = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 1.3, w: 2.8, h: 1.8, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 1.3, w: 2.8, h: 0.04, fill: { color: sc.color } });
    s.addText(`${sc.icon}  ${sc.title}`, {
      x: sx + 0.15, y: 1.4, w: 2.5, h: 0.4,
      fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left", valign: "middle",
    });
    s.addText(sc.desc, {
      x: sx + 0.15, y: 1.85, w: 2.5, h: 1.0,
      fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "top",
    });
  });

  // Flow: create → use → disconnect → ... → resume → continue
  s.addText("\u6301\u4E45\u5316\u6D41\u7A0B", { x: 0.8, y: 3.4, w: 3, h: 0.35, fontSize: 15, fontFace: FB, color: C.white, bold: true, align: "left" });

  const flow = [
    { label: "\u5EFA\u7ACB\nSession", color: C.blue },
    { label: "\u5C0D\u8A71", color: C.green },
    { label: "disconnect\n(\u4FDD\u7559\u8CC7\u6599)", color: C.orange },
    { label: "...\u7A0D\u5F8C...", color: C.grayDim },
    { label: "resume\n(\u6062\u5FA9)", color: C.cyan },
    { label: "\u7E7C\u7E8C\u5C0D\u8A71", color: C.green },
  ];
  flow.forEach((f, i) => {
    const fx = 0.3 + i * 1.6;
    s.addShape(pres.shapes.RECTANGLE, { x: fx, y: 3.9, w: 1.3, h: 0.75, fill: { color: C.bgCard }, line: { color: f.color, width: 1.5 } });
    s.addText(f.label, { x: fx, y: 3.9, w: 1.3, h: 0.75, fontSize: 9.5, fontFace: FB, color: f.color, align: "center", valign: "middle" });
    if (i < flow.length - 1) {
      s.addText("\u25B6", { x: fx + 1.3, y: 3.9, w: 0.3, h: 0.75, fontSize: 10, color: C.grayDim, align: "center", valign: "middle" });
    }
  });

  addFooter(s);
  addNum(s, 2);
})();

// SLIDE 3 — Core API
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u6838\u5FC3 API", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const apis = [
    { method: 'create_session(session_id="...")', desc: "\u5EFA\u7ACB\u5177\u540D Session", color: C.blue },
    { method: "session.disconnect()", desc: "\u4E2D\u65B7\u4F46\u4FDD\u7559\u78C1\u789F\u8CC7\u6599", color: C.orange },
    { method: 'client.resume_session("my-id", ...)', desc: "\u6062\u5FA9 Session\uFF08\u9700\u518D\u6B21\u63D0\u4F9B on_permission_request\uFF09", color: C.cyan },
    { method: "client.list_sessions()", desc: "\u5217\u51FA\u6240\u6709 Session", color: C.green },
    { method: "client.get_last_session_id()", desc: "\u53D6\u5F97\u6700\u8FD1\u7684 Session ID", color: C.purple },
    { method: 'client.delete_session("my-id")', desc: "\u6C38\u4E45\u522A\u9664 Session", color: C.red },
  ];

  apis.forEach((a, i) => {
    const ay = 1.2 + i * 0.62;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ay, w: 8.4, h: 0.52, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ay, w: 0.05, h: 0.52, fill: { color: a.color } });
    s.addText(a.method, { x: 1.1, y: ay, w: 5.0, h: 0.52, fontSize: 11, fontFace: FC, color: a.color, align: "left", valign: "middle" });
    s.addText(a.desc, { x: 6.3, y: ay, w: 2.7, h: 0.52, fontSize: 11, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  // Key note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.3, fill: { color: C.bgCard } });
  s.addText("resume_session \u7684\u7B2C\u4E8C\u500B\u53C3\u6578\u5FC5\u9808\u5305\u542B on_permission_request", {
    x: 1.0, y: 4.85, w: 8.0, h: 0.3,
    fontSize: 11, fontFace: FB, color: C.yellow, bold: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 3);
})();

// SLIDE 4 — Code: Phase 1
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u968E\u6BB5\u4E00\uFF1A\u5EFA\u7ACB\u8207\u4E2D\u65B7", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 3.0, fill: { color: C.bgCard } });
  s.addText([
    { text: 'SESSION_ID = ', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: '"tutorial-persistence-demo"', options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "# \u5EFA\u7ACB\u5177\u540D session", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "session = ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "client.create_session(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    session_id=", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "SESSION_ID", options: { color: C.cyan, fontFace: FC, fontSize: 12, bold: true, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: '    model="claude-sonnet-4.6",', options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    on_permission_request=PermissionHandler.approve_all,", options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "# \u5C0D\u8A71\uFF1A\u8B93 AI \u8A18\u4F4F\u8CC7\u8A0A", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'session.send_and_wait("Remember: my name is Alice")', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "# \u4E2D\u65B7\uFF08\u8CC7\u6599\u4FDD\u7559\u5728\u78C1\u789F\uFF09", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "session.", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "disconnect", options: { color: C.orange, fontFace: FC, fontSize: 12, bold: true, breakLine: false } },
    { text: "()", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 2.8, valign: "top" });

  // Note
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 9.0, h: 0.6, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.2, w: 0.06, h: 0.6, fill: { color: C.orange } });
  s.addText("disconnect() \u2260 \u522A\u9664\u3002\u8CC7\u6599\u4FDD\u7559\u5728\u78C1\u789F\uFF0C\u53EF\u4EE5\u7A0D\u5F8C resume\u3002\u50C5 delete_session() \u624D\u6703\u6C38\u4E45\u522A\u9664\u3002", {
    x: 0.8, y: 4.2, w: 8.5, h: 0.6,
    fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle",
  });

  addFooter(s);
  addNum(s, 4);
})();

// SLIDE 5 — Code: Phase 2
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u968E\u6BB5\u4E8C\uFF1A\u6062\u5FA9\u8207\u9A57\u8B49", {
    x: 0.8, y: 0.25, w: 8.4, h: 0.6,
    fontSize: 28, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.0, w: 9.0, h: 2.8, fill: { color: C.bgCard } });
  s.addText([
    { text: "# \u6062\u5FA9 session", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "resumed = ", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "client.", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "resume_session", options: { color: C.cyan, fontFace: FC, fontSize: 12, bold: true, breakLine: false } },
    { text: "(", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    SESSION_ID,", options: { color: C.grayLight, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "    on_permission_request=", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "PermissionHandler.approve_all", options: { color: C.blue, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: ",", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: ")", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "# \u9A57\u8B49\uFF1AAI \u8A18\u5F97\u4E4B\u524D\u7684\u5167\u5BB9\uFF01", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: 'resumed.send_and_wait("What is my name?")', options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "# AI \u56DE\u8986\uFF1A\u300CYour name is Alice\u300D \u2192 \u4E0A\u4E0B\u6587\u5DF2\u6062\u5FA9\uFF01", options: { color: C.green, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: " ", options: { breakLine: true, fontFace: FC, fontSize: 12, color: C.white } },
    { text: "# \u6E05\u7406", options: { color: C.gray, fontFace: FC, fontSize: 12, breakLine: true } },
    { text: "await ", options: { color: C.purple, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "client.", options: { color: C.white, fontFace: FC, fontSize: 12, breakLine: false } },
    { text: "delete_session", options: { color: C.red, fontFace: FC, fontSize: 12, bold: true, breakLine: false } },
    { text: "(SESSION_ID)", options: { color: C.white, fontFace: FC, fontSize: 12 } },
  ], { x: 0.7, y: 1.1, w: 8.6, h: 2.6, valign: "top" });

  // Utility APIs
  s.addText("\u8F14\u52A9 API", { x: 0.8, y: 4.1, w: 2, h: 0.3, fontSize: 14, fontFace: FB, color: C.white, bold: true, align: "left" });
  const utils = [
    { api: "list_sessions()", desc: "\u5217\u51FA\u6240\u6709 session", color: C.green },
    { api: "get_last_session_id()", desc: "\u6700\u8FD1\u7684 ID", color: C.purple },
    { api: "delete_session(id)", desc: "\u6C38\u4E45\u522A\u9664", color: C.red },
  ];
  utils.forEach((u, i) => {
    const ux = 0.8 + i * 3.0;
    s.addShape(pres.shapes.RECTANGLE, { x: ux, y: 4.45, w: 2.7, h: 0.5, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: ux, y: 4.45, w: 0.05, h: 0.5, fill: { color: u.color } });
    s.addText(u.api, { x: ux + 0.15, y: 4.45, w: 2.4, h: 0.25, fontSize: 10, fontFace: FC, color: u.color, align: "left", valign: "bottom" });
    s.addText(u.desc, { x: ux + 0.15, y: 4.7, w: 2.4, h: 0.2, fontSize: 10, fontFace: FB, color: C.gray, align: "left", valign: "top" });
  });

  addFooter(s);
  addNum(s, 5);
})();

// SLIDE 6 — Key points
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u91CD\u9EDE\u6574\u7406", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  const points = [
    { title: "session_id \u662F\u9748\u9B42", desc: "\u6C92\u6709 ID \u5C31\u7121\u6CD5 resume\u3002\u7D66\u6BCF\u500B\u91CD\u8981\u7684 session \u4E00\u500B\u6709\u610F\u7FA9\u7684\u540D\u7A31\u3002", color: C.blue },
    { title: "disconnect \u2260 delete", desc: "disconnect \u4FDD\u7559\u8CC7\u6599\uFF0Cdelete \u6C38\u4E45\u522A\u9664\u3002\u7528\u5B8C\u8A18\u5F97\u6E05\u7406\u3002", color: C.orange },
    { title: "resume \u9700\u8981\u91CD\u65B0\u63D0\u4F9B\u6B0A\u9650", desc: "on_permission_request \u4E0D\u6703\u88AB\u6301\u4E45\u5316\uFF0C\u6BCF\u6B21 resume \u90FD\u8981\u518D\u50B3\u4E00\u6B21\u3002", color: C.yellow },
    { title: "\u4E0A\u4E0B\u6587\u81EA\u52D5\u6062\u5FA9", desc: "AI \u8A18\u5F97\u4E4B\u524D\u7684\u5C0D\u8A71\u5167\u5BB9\uFF0C\u4E0D\u9700\u8981\u91CD\u65B0\u63D0\u4F9B\u80CC\u666F\u8CC7\u8A0A\u3002", color: C.green },
  ];

  points.forEach((p, i) => {
    const py = 1.2 + i * 0.9;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 8.4, h: 0.75, fill: { color: C.bgCard } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: py, w: 0.06, h: 0.75, fill: { color: p.color } });
    s.addText(p.title, { x: 1.1, y: py, w: 3.0, h: 0.75, fontSize: 14, fontFace: FB, color: p.color, bold: true, align: "left", valign: "middle" });
    s.addText(p.desc, { x: 4.3, y: py, w: 4.7, h: 0.75, fontSize: 12, fontFace: FB, color: C.grayLight, align: "left", valign: "middle" });
  });

  addFooter(s);
  addNum(s, 6);
})();

// SLIDE 7 — Summary
(() => {
  const s = pres.addSlide();
  s.background = { color: C.bgDark };
  s.addText("\u672C\u8AB2\u91CD\u9EDE\u56DE\u9867", {
    x: 0.8, y: 0.4, w: 8.4, h: 0.7,
    fontSize: 36, fontFace: FT, color: C.white, bold: true, align: "left", margin: 0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.35, w: 4.8, h: 2.8, fill: { color: C.bgCard } });
  s.addText("\u5B78\u5230\u4E86\u4EC0\u9EBC", { x: 1.05, y: 1.45, w: 4.3, h: 0.4, fontSize: 18, fontFace: FB, color: C.cyan, bold: true, align: "left" });
  s.addText([
    { text: "session_id \u5EFA\u7ACB\u5177\u540D Session", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "disconnect \u4FDD\u7559\u3001resume \u6062\u5FA9", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "list / get_last / delete \u7BA1\u7406", options: { bullet: true, breakLine: true, color: C.grayLight, fontFace: FB, fontSize: 14 } },
    { text: "AI \u81EA\u52D5\u6062\u5FA9\u5C0D\u8A71\u4E0A\u4E0B\u6587", options: { bullet: true, color: C.white, fontFace: FB, fontSize: 14, bold: true } },
  ], { x: 1.05, y: 1.95, w: 4.3, h: 2.0, valign: "top", paraSpaceAfter: 6 });

  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 2.8, fill: { color: C.bgCard } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.0, y: 1.35, w: 3.5, h: 0.05, fill: { color: C.purple } });
  s.addText("\u4E0B\u4E00\u8AB2\u9810\u544A", { x: 6.25, y: 1.5, w: 3.0, h: 0.4, fontSize: 18, fontFace: FB, color: C.purple, bold: true, align: "left" });
  s.addText("\u7B2C 10 \u8AB2\uFF1A\u81EA\u8A02 Agent \u89D2\u8272", { x: 6.25, y: 2.1, w: 3.0, h: 0.35, fontSize: 16, fontFace: FB, color: C.white, bold: true, align: "left" });
  s.addText("\u7D66 AI \u4E0D\u540C\u7684\u4EBA\u8A2D\u548C\u5C08\u6CE8\u9818\u57DF", { x: 6.25, y: 2.55, w: 3.0, h: 0.8, fontSize: 13, fontFace: FB, color: C.grayLight, align: "left", valign: "top" });
  s.addText("\u27A1", { x: 6.25, y: 3.45, w: 3.0, h: 0.4, fontSize: 24, color: C.purple, align: "center", valign: "middle" });

  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.55, w: 10, h: 0.55, fill: { color: C.bgCard } });
  s.addText("\u300C\u96E2\u958B\u518D\u56DE\u4F86\uFF0C\u5C0D\u8A71\u4E0D\u6703\u65B7\u300D", {
    x: 0.5, y: 4.55, w: 9.0, h: 0.55,
    fontSize: 16, fontFace: FB, color: C.cyan, italic: true, align: "center", valign: "middle",
  });

  addFooter(s);
  addNum(s, 7);
})();

pres.writeFile({ fileName: "/home/sk/workl/agent_class/09_session_persistence/slides.pptx" })
  .then(() => console.log("09_session_persistence/slides.pptx generated!"))
  .catch((err) => console.error("Error:", err));
