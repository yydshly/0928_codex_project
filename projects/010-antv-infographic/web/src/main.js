import { Infographic } from '@antv/infographic';
import './style.css';
import { mountCatalog } from './catalog.js';

const samples = [
  {
    id: 'sequence', number: '01', label: '步骤与流程', kind: 'SEQUENCE',
    description: '按先后顺序组织一组动作。示例使用上游内置的 sequence-steps-simple 模板，将五个产品阶段直接渲染为信息图。',
    syntax: `infographic sequence-steps-simple
data
  title 从想法到发布
  desc 一条清晰的产品交付路径
  sequences
    - label 发现问题
      desc 观察真实需求
    - label 提出方案
      desc 收敛核心假设
    - label 制作原型
      desc 尽早验证体验
    - label 小范围测试
      desc 收集反馈
    - label 发布迭代
      desc 持续改进`,
  },
  {
    id: 'list', number: '02', label: '列表与卡片', kind: 'LIST',
    description: '把并列信息排成卡片网格，适合功能、服务或要点概览。此处直接调用 list-grid-compact-card 模板。',
    syntax: `infographic list-grid-compact-card
data
  title 内容工作台
  desc 将复杂任务拆成容易理解的模块
  lists
    - label 收集
      desc 统一汇入素材
    - label 整理
      desc 建立内容结构
    - label 创作
      desc 写作与视觉表达
    - label 审核
      desc 检查事实和格式
    - label 发布
      desc 输出多种渠道
    - label 复盘
      desc 从反馈中改进`,
  },
  {
    id: 'chart', number: '03', label: '数值与图表', kind: 'CHART',
    description: '给每个数据项填写 value，内置图表模板会把数值编码为可比较的视觉长度。',
    syntax: `infographic chart-column-simple
data
  title 各渠道访问量
  desc 示例数据，仅用于演示图表生成
  values
    - label 搜索
      value 1280
    - label 社群
      value 960
    - label 邮件
      value 720
    - label 直接访问
      value 540`,
  },
  {
    id: 'compare', number: '04', label: '方案对比', kind: 'COMPARISON',
    description: '用 compares 与 children 描述方案及其特点。原库负责把结构化文本映射成对照版式。',
    syntax: `infographic compare-swot
data
  title 两种发布方式
  desc 示例比较，不代表方案优劣结论
  compares
    - label 静态发布
      children
        - label 部署简单
        - label 访问成本低
        - label 适合展示内容
    - label 动态应用
      children
        - label 支持用户数据
        - label 交互能力丰富
        - label 需要服务维护`,
  },
  {
    id: 'hierarchy', number: '05', label: '层级结构', kind: 'HIERARCHY',
    description: '通过 root 与递归 children 表示树形关系。适合组织架构、知识分类与产品模块。',
    syntax: `infographic hierarchy-structure
data
  title 产品能力结构
  root
    label 内容平台
    children
      - label 内容管理
        children
          - label 创建
          - label 审核
      - label 分发触达
        children
          - label 网站
          - label 邮件
      - label 效果分析
        children
          - label 访问
          - label 转化`,
  },
  {
    id: 'relation', number: '06', label: '节点关系', kind: 'RELATION',
    description: 'nodes 定义对象，relations 定义连接。这里使用原库内置的关系布局与连线渲染。',
    syntax: `infographic relation-dagre-flow-tb-simple-circle-node
data
  title 内容发布流程
  nodes
    - id draft
      label 草稿
    - id review
      label 审核
    - id publish
      label 发布
    - id archive
      label 归档
  relations
    - from draft
      to review
    - from review
      to publish
    - from publish
      to archive`,
  },
];

samples.push({
  id: 'quadrant', number: '07', label: '四象限', kind: 'QUADRANT',
  description: '用四个区域整理两维判断。这里展示投入与价值的四种组合，内容为人工分类的示例。',
  syntax: `infographic quadrant-quarter-simple-card
data
  title 按投入与价值整理任务
  desc 四种组合示例，不包含自动评分
  compares
    - label 高价值 · 低投入
      desc 优先尝试
    - label 高价值 · 高投入
      desc 拆分验证
    - label 低价值 · 低投入
      desc 按需处理
    - label 低价值 · 高投入
      desc 重新评估`,
});

const $ = (selector) => document.querySelector(selector);
const nav = $('#sample-nav');
const syntaxInput = $('#syntax-input');
const themeSelect = $('#theme-select');
const editToggle = $('#edit-toggle');
const status = $('#render-status');
let active = samples[0];
let graphic;
let streamToken = 0;

function fullSyntax() {
  return `${syntaxInput.value.trim()}\ntheme ${themeSelect.value}`;
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function createGraphic() {
  graphic?.destroy();
  $('#infographic').replaceChildren();
  graphic = new Infographic({
    container: '#infographic',
    width: '100%',
    height: '100%',
    padding: 24,
    editable: editToggle.checked,
  });
  graphic.on('error', (error) => setStatus(`渲染出错：${String(error).slice(0, 110)}`, true));
  graphic.on('warning', () => setStatus('语法尚未完整，正在等待后续内容'));
  graphic.on('rendered', () => setStatus(editToggle.checked ? '已渲染 · 可在画布中编辑' : '已渲染 · SVG'));
}

function renderCurrent() {
  streamToken++;
  try {
    createGraphic();
    setStatus('正在渲染…');
    graphic.render(fullSyntax());
  } catch (error) {
    setStatus(`渲染出错：${error.message}`, true);
  }
}

function selectSample(sample) {
  active = sample;
  syntaxInput.value = sample.syntax;
  $('#sample-title').textContent = sample.label;
  $('#sample-description').textContent = sample.description;
  $('#sample-kind').textContent = sample.kind;
  nav.querySelectorAll('button').forEach((button) => {
    const selected = button.dataset.id === sample.id;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-current', selected ? 'true' : 'false');
  });
  renderCurrent();
}

function renderNavigation() {
  for (const sample of samples) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.id = sample.id;
    button.innerHTML = `<small>${sample.number}</small><span>${sample.label}</span><b aria-hidden="true">↗</b>`;
    button.addEventListener('click', () => selectSample(sample));
    nav.append(button);
  }
}

async function streamCurrent() {
  const token = ++streamToken;
  const lines = fullSyntax().split('\n');
  createGraphic();
  let buffer = '';
  for (const [index, line] of lines.entries()) {
    if (token !== streamToken) return;
    buffer += `${line}\n`;
    try {
      graphic.render(buffer);
      setStatus(`流式渲染 ${index + 1} / ${lines.length} 行`);
    } catch (error) {
      if (index === lines.length - 1) setStatus(`渲染出错：${error.message}`, true);
    }
    await new Promise((resolve) => setTimeout(resolve, 170));
  }
  if (token === streamToken) setStatus('流式渲染完成');
}

async function download(type) {
  try {
    const url = await graphic.toDataURL(type === 'svg' ? { type: 'svg', embedResources: true } : { type: 'png', dpr: 2 });
    const link = document.createElement('a');
    link.href = url;
    link.download = `antv-infographic-${active.id}.${type}`;
    document.body.append(link);
    link.click();
    link.remove();
    setStatus(`${type.toUpperCase()} 已生成`);
  } catch (error) {
    setStatus(`导出失败：${error.message}`, true);
  }
}

renderNavigation();
mountCatalog((id) => {
  selectSample(samples.find((sample) => sample.id === id));
  document.querySelector('.intro').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
selectSample(active);
$('#render-button').addEventListener('click', renderCurrent);
$('#stream-button').addEventListener('click', streamCurrent);
$('#reset-button').addEventListener('click', () => selectSample(active));
$('#svg-button').addEventListener('click', () => download('svg'));
$('#png-button').addEventListener('click', () => download('png'));
$('#copy-button').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(fullSyntax());
    setStatus('完整语法已复制');
  } catch {
    setStatus('复制失败，请直接选中语法文本', true);
  }
});
themeSelect.addEventListener('change', renderCurrent);
editToggle.addEventListener('change', renderCurrent);
