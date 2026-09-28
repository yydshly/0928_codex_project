"use strict";

// Teaching states assembled from the upstream tasks, not a replay of recorded actions.
const scenarios = {
  flights: {
    name: "航班搜索 · 从目标到可见结果",
    goal: "目标：找到 2026 年 9 月 20 日苏黎世至伦敦的单程经济舱航班；匹配选项出现时停止。",
    steps: [
      {
        url: "google.com/travel/flights", site: "Google Flights", view: "搜索首页", heading: "先设定行程类型", help: "页面当前显示往返行程。",
        controls: [["[01] 行程类型 · 往返", "button", true], ["[02] 出发地 · 空", "combobox"], ["[03] 目的地 · 空", "combobox"]],
        action: "CLICK → [01]", reason: "目标要求单程。先打开行程类型，再在可见选项中选择单程。", textLabel: "这一阶段", text: "Jev 选择操作和页面目标；不需要生成文字。", check: "独立检查页面行程类型是否变为单程。", outcome: "模拟进度：行程类型待确认"
      },
      {
        url: "google.com/travel/flights", site: "Google Flights", view: "出发地", heading: "填写出发城市", help: "行程类型已是单程，出发地仍为空。",
        controls: [["[01] 单程", "button"], ["[02] 出发地 · 空", "combobox", true], ["[03] 目的地 · 空", "combobox"]],
        action: "TYPE_TEXT → [02]", reason: "Jev 选中出发地输入框；小模型根据原目标生成 Zurich。", textLabel: "文本模型输出", text: "Zurich。真实网页还需选择匹配的自动补全建议，不能只看输入框已有文字。", check: "检查出发地是否实际选为 Zürich / Zurich，而非仅输入了字符串。", outcome: "模拟进度：出发地正在填写"
      },
      {
        url: "google.com/travel/flights", site: "Google Flights", view: "目的地", heading: "填写目的城市", help: "出发地已选择；目的地仍为空。",
        controls: [["[01] 出发地 · Zurich", "combobox"], ["[02] 目的地 · 空", "combobox", true], ["[03] 出发日期 · 空", "textbox"]],
        action: "TYPE_TEXT → [02]", reason: "目标城市由第二次文本模型调用生成。", textLabel: "文本模型输出", text: "London。输入后需要选中匹配建议；项目会短暂等待建议控件出现。", check: "检查目的地最终选为 London。", outcome: "模拟进度：城市选择完成"
      },
      {
        url: "google.com/travel/flights", site: "Google Flights", view: "日期与搜索", heading: "选择日期并提交", help: "城市与单程状态已确定，继续选目标日期。",
        controls: [["[01] 出发日期 · 空", "textbox", true], ["[02] 9 月 20 日", "calendar day"], ["[03] 搜索", "button"]],
        action: "CLICK → 日期控件", reason: "日期选择通常包含打开日历、选日期和确认；之后需提交搜索。", textLabel: "页面变化", text: "每次观察都会重建动作编号，因此示意编号只对应当前一步。", check: "检查年份、日期以及搜索提交后的页面状态。", outcome: "模拟进度：等待搜索结果"
      },
      {
        url: "google.com/travel/flights", site: "Google Flights", view: "结果列表", heading: "停止在匹配结果", help: "匹配行程的航班选项可见。",
        controls: [["[01] 航班选项列表", "result"], ["[02] 选择航班", "button"]],
        action: "DONE", reason: "任务只要求看到匹配选项，不要求选择或订票。", textLabel: "作者公开结果", text: "一次录制耗时 7.073 秒；该数字不是本页模拟的计时。", check: "独立核验：单程、苏黎世、伦敦、2026-09-20、经济舱和可见航班。", outcome: "作者报告：匹配航班可见；未订票"
      }
    ]
  },
  wiki: {
    name: "百科导航 · 找到并打开文章",
    goal: "目标：从 Wikipedia 首页找到并打开“哥德尔不完备定理”条目。",
    steps: [
      {
        url: "en.wikipedia.org/wiki/Main_Page", site: "Wikipedia", view: "首页", heading: "识别搜索入口", help: "当前页面提供搜索框和导航链接。",
        controls: [["[01] 搜索 Wikipedia", "searchbox", true], ["[02] 热门条目", "link"]],
        action: "TYPE_TEXT → [01]", reason: "当前页最直接的路径是搜索指定文章标题。", textLabel: "输入示意", text: "Gödel’s incompleteness theorems。文字由输入模型按目标生成。", check: "输入后仍要打开正确结果；搜索框有文字不等于完成。", outcome: "模拟进度：已定位搜索入口"
      },
      {
        url: "en.wikipedia.org", site: "Wikipedia", view: "搜索建议", heading: "选择匹配条目", help: "与查询匹配的建议或结果链接已出现。",
        controls: [["[01] Gödel's incompleteness theorems", "link", true], ["[02] 其他结果", "link"]],
        action: "CLICK → [01]", reason: "选择名称匹配的可见条目，而不是凭模型生成 URL。", textLabel: "页面变化", text: "模型只选观察到的编号，执行器对应实际 DOM 节点。", check: "检查是否真的进入文章页面。", outcome: "模拟进度：准备打开文章"
      },
      {
        url: "en.wikipedia.org/wiki/Gödel's_incompleteness_theorems", site: "Wikipedia", view: "文章页面", heading: "核对最终文章", help: "页面标题与目标文章对应。",
        controls: [["[01] 文章标题", "heading"], ["[02] 目录", "navigation"]],
        action: "DONE", reason: "需要打开指定文章，结果列表中存在同名链接尚不足以完成。", textLabel: "作者公开结果", text: "该任务单次检查为 2.798 秒；本页没有重新运行。", check: "上游使用精确文章 URL 作为独立验收条件。", outcome: "作者报告：准确文章 URL 已打开"
      }
    ]
  },
  hotel: {
    name: "酒店筛选 · 多条件都要落地",
    goal: "目标：在本地酒店测试页搜索 Lisbon，应用 Design 和 Free cancellation 筛选，再打开 Casa Flora。",
    steps: [
      {
        url: "local hotel fixture", site: "本地测试页", view: "搜索", heading: "先输入目的地", help: "搜索城市为空，筛选尚未应用。",
        controls: [["[01] 城市 · 空", "textbox", true], ["[02] 搜索", "button"], ["[03] 设计酒店", "checkbox"]],
        action: "TYPE_TEXT → [01]", reason: "先把目标城市写入正确字段，再提交搜索。", textLabel: "输入示意", text: "Lisbon。该场景使用上游本地测试页，不代表真实酒店网站的通用表现。", check: "城市应作为搜索条件实际提交。", outcome: "模拟进度：准备搜索 Lisbon"
      },
      {
        url: "local hotel fixture", site: "本地测试页", view: "筛选", heading: "应用全部要求的筛选", help: "Lisbon 结果已出现，Design 和 Free cancellation 尚未全部选中。",
        controls: [["[01] Design", "checkbox", true], ["[02] Free cancellation", "checkbox"], ["[03] Casa Flora", "result"]],
        action: "CLICK → 筛选控件", reason: "逐一选中要求的条件；只看到符合条件的酒店并不能证明筛选真正生效。", textLabel: "避免重复操作", text: "当前值已满足时不再切换复选框，防止把条件取消。", check: "独立检查搜索城市和两个筛选状态。", outcome: "模拟进度：正在应用筛选"
      },
      {
        url: "local hotel fixture", site: "本地测试页", view: "结果列表", heading: "打开指定酒店", help: "Lisbon、Design 和 Free cancellation 均已应用。",
        controls: [["[01] Casa Flora", "link", true], ["[02] 其他酒店", "link"]],
        action: "CLICK → [01]", reason: "打开目标酒店；仅在列表中看见名称尚未满足“打开”要求。", textLabel: "下一状态", text: "页面应进入 Casa Flora 的详情，而不只是停留在筛选结果。", check: "核对页面对象及已应用的全部条件。", outcome: "模拟进度：准备打开 Casa Flora"
      },
      {
        url: "local hotel fixture / casa-flora", site: "本地测试页", view: "酒店详情", heading: "检查完整目标", help: "目标酒店详情已打开。",
        controls: [["[01] Casa Flora", "heading"], ["[02] 返回结果", "link"]],
        action: "DONE", reason: "搜索对象、筛选状态和详情页三类条件全部可检查。", textLabel: "作者公开结果", text: "本地测试任务单次检查耗时 1.896 秒；没有与旧版配对比较。", check: "上游独立检查目标酒店和三个已应用条件。", outcome: "作者报告：目标酒店与全部筛选通过检查"
      }
    ]
  }
};

let currentScenario = "flights";
let currentStep = 0;

const byId = id => document.getElementById(id);

function renderControls(controls) {
  const host = byId("mock-controls");
  host.replaceChildren();
  controls.forEach(([label, kind, selected]) => {
    const row = document.createElement("div");
    row.className = selected ? "mock-control selected" : "mock-control";
    const left = document.createElement("span");
    const marker = document.createElement("i");
    marker.textContent = label.match(/^\[\d+\]/)?.[0] || "";
    left.append(marker, document.createTextNode(label.replace(/^\[\d+\]\s*/, "")));
    const right = document.createElement("b");
    right.textContent = kind.toUpperCase();
    row.append(left, right);
    host.append(row);
  });
}

function render() {
  const scenario = scenarios[currentScenario];
  const step = scenario.steps[currentStep];
  byId("scenario-name").textContent = scenario.name;
  byId("scenario-goal").textContent = scenario.goal;
  byId("mock-url").textContent = step.url;
  byId("mock-site").textContent = step.site;
  byId("mock-view").textContent = step.view;
  byId("mock-heading").textContent = step.heading;
  byId("mock-help").textContent = step.help;
  byId("mock-outcome").textContent = step.outcome;
  byId("step-counter").textContent = `${String(currentStep + 1).padStart(2, "0")} / ${String(scenario.steps.length).padStart(2, "0")}`;
  byId("step-action").textContent = step.action;
  byId("step-reason").textContent = step.reason;
  byId("step-text-label").textContent = step.textLabel;
  byId("step-text").textContent = step.text;
  byId("step-check-content").textContent = step.check;
  renderControls(step.controls);
  const progress = byId("step-progress");
  progress.replaceChildren();
  scenario.steps.forEach((_, index) => {
    const segment = document.createElement("span");
    segment.className = index < currentStep ? "done" : index === currentStep ? "current" : "";
    progress.append(segment);
  });
  byId("prev-step").disabled = currentStep === 0;
  byId("next-step").textContent = currentStep === scenario.steps.length - 1 ? "重新演示 ↺" : "下一步 →";
  document.querySelectorAll(".scenario-tab").forEach(button => {
    const active = button.dataset.scenario === currentScenario;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.querySelectorAll(".scenario-tab").forEach(button => {
  button.addEventListener("click", () => {
    currentScenario = button.dataset.scenario;
    currentStep = 0;
    render();
  });
});
byId("prev-step").addEventListener("click", () => {
  if (currentStep > 0) currentStep -= 1;
  render();
});
byId("next-step").addEventListener("click", () => {
  currentStep = (currentStep + 1) % scenarios[currentScenario].steps.length;
  render();
});
render();

// Simplified examples of the request/response relationship, never live API calls.
const exchangeExamples = {
  type: {
    state: "页面上的出发地尚未填写。元素编号只对应本轮观察。",
    request: '用户目标：搜索从苏黎世到伦敦的航班\n\n当前页面：航班搜索表单\n[1] 搜索按钮\n[2] 出发地输入框 · 值为空\n[3] 目的地输入框 · 值为空\n\n问题 A：下一步做什么？\n选项：CLICK / TYPE_TEXT / WAIT / DONE / BLOCKED\n问题 B：如果点击，选哪个？\n选项：[1] / [2] / [3]\n问题 C：如果输入，选哪个？\n选项：[2] / [3]',
    response: { answers: { operation: { choice: "TYPE_TEXT" }, type_text_target: { choice: "2" } } },
    answer: '程序采用 TYPE_TEXT 的目标答案 "2"。同次请求里的 click_target 答案不会触发点击。',
    helperStatus: "需要调用 · 生成文字", helperDetail: '发送原目标、出发地字段含义、页面与近期操作；文本模型生成 {"text":"Zurich"}。数字 2 本身不会告诉它要写什么。',
    executorStatus: "校验 → 映射 → 输入", executorDetail: '验证文字结构和页面状态，用 TYPE_TEXT + "2" 找到动作 e2，再定位 node 42 对应的真实输入框，由程序填写 Zurich。随后重新观察自动补全。',
    helper: true
  },
  click: {
    state: "所需城市已设置，页面上可见搜索按钮。此例简化了日期等条件。",
    request: '用户目标：让匹配航班结果显示出来\n\n当前页面：搜索条件已填好\n[1] 搜索按钮\n[2] 出发地输入框 · 值为 Zurich\n[3] 目的地输入框 · 值为 London\n\n问题 A：下一步做什么？\n选项：CLICK / TYPE_TEXT / WAIT / DONE / BLOCKED\n问题 B：如果点击，选哪个？\n选项：[1] / [2] / [3]\n问题 C：如果输入，选哪个？\n选项：[2] / [3]',
    response: { answers: { operation: { choice: "CLICK" }, click_target: { choice: "1" } } },
    answer: '程序采用 CLICK 的目标答案 "1"；输入目标问题的答案被忽略。',
    helperStatus: "本步不调用", helperDetail: "点击动作不需要生成字段文字。Jev 返回的操作与目标已经足以让执行器定位按钮。",
    executorStatus: "校验 → 映射 → 点击", executorDetail: '程序通过 CLICK + "1" 查到搜索动作，复核按钮仍有效且未被遮挡，重新取位置后发送浏览器点击事件，再观察加载和结果。',
    helper: false
  },
  done: {
    state: "页面文字与当前条件显示匹配航班已出现。",
    request: '用户目标：匹配选项可见后停止，不订票\n\n当前页面：单程 / Zurich → London\n日期条件满足，匹配航班选项可见\n[1] 第一条航班的选择按钮\n[2] 第二条航班的选择按钮\n\n问题 A：下一步做什么？\n选项：CLICK / WAIT / DONE / BLOCKED\n问题 B：如果点击，选哪个？\n选项：[1] / [2]\n\nDONE 的含义：全部任务要求已可见地满足',
    response: { answers: { operation: { choice: "DONE" } } },
    answer: "DONE 不需要目标编号。模型选择完成后，程序停止循环；这仍然需要独立结果核验。",
    helperStatus: "本步不调用", helperDetail: "没有文字要输入。完成判断由 Jev 选择，文本模型不参与这一步。",
    executorStatus: "停止循环 → 独立核验", executorDetail: "库确认页面仍是所观察的状态后返回 done。外部检查器再核对城市、日期、单程与实际结果；模型说完成不保证业务目标正确。",
    helper: false
  }
};

function renderExchange(kind) {
  const example = exchangeExamples[kind];
  byId("exchange-state").textContent = example.state;
  byId("exchange-request").textContent = example.request;
  byId("exchange-response").textContent = JSON.stringify(example.response, null, 2);
  byId("exchange-answer").textContent = example.answer;
  byId("helper-status").textContent = example.helperStatus;
  byId("helper-detail").textContent = example.helperDetail;
  byId("executor-status").textContent = example.executorStatus;
  byId("executor-detail").textContent = example.executorDetail;
  byId("helper-panel").classList.toggle("inactive", !example.helper);
  document.querySelectorAll("[data-exchange]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.exchange === kind));
  });
}

document.querySelectorAll("[data-exchange]").forEach(button => {
  button.addEventListener("click", () => renderExchange(button.dataset.exchange));
});
renderExchange("type");
