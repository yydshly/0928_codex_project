import { getTemplates } from '@antv/infographic';

const categories = [
  { id: 'hierarchy', title: '层级', question: '它由哪些部分组成？', shapes: '层级树、组织架构、思维导图', example: '整理知识分类、产品模块与组织分工。' },
  { id: 'sequence', title: '序列', question: '先后顺序是什么？', shapes: '步骤、时间线、路线图、阶梯、漏斗、循环', example: '描述项目计划、操作指南与版本迭代。' },
  { id: 'list', title: '列表', question: '主要有哪几件事？', shapes: '横排、竖排、卡片网格、金字塔、扇形', example: '展示功能要点、会议结论与行动清单。' },
  { id: 'compare', title: '对比', question: '几个方案差在哪里？', shapes: '双方案对照、SWOT、分组对比', example: '比较工具、套餐或技术方案。' },
  { id: 'relation', title: '关系', question: '这些对象怎样关联？', shapes: '节点网络、流程连接、环形关系', example: '解释模块调用、系统依赖与协作关系。' },
  { id: 'chart', title: '图表', question: '数值差多少、如何变化？', shapes: '柱状、条形、折线、饼图、环图、词云', example: '比较支出、访问量和变化趋势；词云用于词项概览。' },
  { id: 'quadrant', title: '象限', question: '按两个维度怎么分组？', shapes: '四象限布局', example: '按价值与投入整理任务或产品机会。' },
];

export function mountCatalog(onTry) {
  const names = getTemplates();
  const host = document.querySelector('#catalog-grid');
  const search = document.querySelector('#template-search');
  const entries = [];
  document.querySelector('#template-total').textContent = names.length;

  for (const category of categories) {
    const templates = names.filter((name) => name.startsWith(category.id + '-')).sort();
    const card = document.createElement('article');
    card.className = 'catalog-card';
    card.dataset.category = category.id;
    card.innerHTML = `<div class="catalog-heading"><h4>${category.title}</h4><span><b>${templates.length}</b> 个模板</span></div>
      <p class="catalog-question">${category.question}</p><p>${category.shapes}</p><p class="catalog-example">${category.example}</p>
      <button type="button" class="catalog-try" data-try="${category.id}">试用一个代表模板 ↗</button>
      <details><summary>查看模板名称 <span class="match-count">${templates.length}</span></summary><ul class="template-names"></ul></details>`;
    const list = card.querySelector('ul');
    const items = templates.map((name) => {
      const li = document.createElement('li');
      li.textContent = name;
      list.append(li);
      return { name, li };
    });
    card.querySelector('button').addEventListener('click', () => onTry(category.id));
    host.append(card);
    entries.push({ category, card, items });
  }
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    for (const { category, card, items } of entries) {
      const categoryMatch = `${category.title} ${category.question} ${category.shapes}`.toLowerCase().includes(query);
      let count = 0;
      for (const { name, li } of items) {
        const visible = !query || categoryMatch || name.toLowerCase().includes(query);
        li.hidden = !visible;
        if (visible) count++;
      }
      card.hidden = count === 0;
      card.querySelector('.match-count').textContent = count;
      card.querySelector('details').open = Boolean(query && count);
      matches += count;
    }
    document.querySelector('#catalog-result').textContent = query ? `找到 ${matches} 个模板` : '按模板名称或中文类别搜索';
  });
}
