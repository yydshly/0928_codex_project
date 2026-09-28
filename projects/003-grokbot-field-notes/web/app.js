const scenarios = {
  bug: {
    tag: '工程 / BUG FIX',
    title: '先看到错误，再谈修复',
    intro: 'Agent 先运行页面并重现用户报告的行为，确认问题属于哪个流程，再决定修改范围。',
    steps: [
      ['输入', '用户报告、复现步骤与目标行为。'],
      ['动作', '运行应用，定位原因，完成小范围修复。'],
      ['证据', '同样步骤在修改前失败、修改后通过；UI 附截图。'],
      ['门槛', '影响生产发布、数据或权限时交给人处理。']
    ],
    foot: '本示例不会运行代码、调用模型或提交 PR。'
  },
  research: {
    tag: '研究 / OPEN SOURCE',
    title: '让每个重要判断都能回到来源',
    intro: '研究员固定原仓库版本，区分作者说明、源码、实际运行和个人推断，再制作网页摘要。',
    steps: [
      ['输入', '原仓库、固定提交、许可和研究问题。'],
      ['动作', '核对目录与原文，整理能力、条件和限制。'],
      ['证据', '关键结论链接到固定版本；展示页真实打开并检查。'],
      ['门槛', '未实测的效果和未发布的链接不写成既成事实。']
    ],
    foot: '此场景结合本研究仓库的维护规范设计，是方法迁移示例。'
  },
  support: {
    tag: '服务 / SUPPORT',
    title: '先分流，再扩大自动化',
    intro: '把常见、低风险的问题归类，用可靠资料起草回复；复杂或敏感问题保留人工审核。',
    steps: [
      ['输入', '客户请求、可用知识库与处理权限。'],
      ['动作', '判断类别，查证事实，形成处理草稿。'],
      ['证据', '记录引用的知识来源、步骤与处理结果。'],
      ['门槛', '对外发送、退款或涉及账户数据时按权限审批。']
    ],
    foot: '此处展示的是资料库工作坊中的流程思想，并未接入工单系统。'
  }
};

const scenarioButtons = [...document.querySelectorAll('.scenario-option')];
const scenarioTag = document.getElementById('scenario-tag');
const scenarioTitle = document.getElementById('scenario-title');
const scenarioIntro = document.getElementById('scenario-intro');
const scenarioSteps = document.getElementById('scenario-steps');
const scenarioFoot = document.getElementById('scenario-foot');

function showScenario(key) {
  const scenario = scenarios[key];
  if (!scenario) return;
  for (const button of scenarioButtons) {
    const active = button.dataset.scenario === key;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  scenarioTag.textContent = scenario.tag;
  scenarioTitle.textContent = scenario.title;
  scenarioIntro.textContent = scenario.intro;
  scenarioFoot.textContent = scenario.foot;
  scenarioSteps.replaceChildren(...scenario.steps.map(([label, copy]) => {
    const box = document.createElement('div');
    const heading = document.createElement('b');
    const paragraph = document.createElement('p');
    heading.textContent = label;
    paragraph.textContent = copy;
    box.append(heading, paragraph);
    return box;
  }));
}

for (const button of scenarioButtons) {
  button.addEventListener('click', () => showScenario(button.dataset.scenario));
}
