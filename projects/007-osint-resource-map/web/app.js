(() => {
  'use strict';
  const data = window.OSINT_CATALOG;
  const inventory = window.OSINT_INVENTORY;
  if (!data || !Array.isArray(inventory)) {
    document.getElementById('result-count').textContent = '索引未加载，请检查页面文件是否完整。';
    return;
  }
  const families = data.families;
  const byFamily = Object.fromEntries(families.map(f => [f.id, f]));
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const validUrl = value => /^https?:\/\//i.test(value || '') ? value : '';
  const anchor = (url, label, className = '') => validUrl(url) ? `<a class="${className}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : '';
  const normalize = text => String(text || '').toLocaleLowerCase('zh-CN').normalize('NFKC').trim();
  const unique = arr => [...new Set(arr)];
  const sourceName = source => source === 'A' ? 'A · awesome-osint' : 'B · arsenal';

  function infoFor(item) {
    if (item.source === 'A') {
      const direct = data.a[item.section];
      const base = item.section.split(' / ')[0];
      const info = direct || data.a[base] || ['learning','其他资料','从原始分类寻找相关资源，具体能力以原站为准。'];
      const suffix = !direct && item.section !== base ? ` · ${item.section.slice(base.length + 3)}` : '';
      return {family: info[0], title: info[1] + suffix, effect: info[2]};
    }
    const number = Number.parseInt(item.section, 10);
    const info = data.b[number] || ['learning','其他资料','从原始分类寻找相关资源，具体能力以原站为准。'];
    return {family: info[0], title: info[1], effect: info[2]};
  }

  inventory.forEach(item => Object.assign(item, infoFor(item)));
  const categories = new Map();
  for (const item of inventory) {
    const key = `${item.source}|${item.section}`;
    if (!categories.has(key)) categories.set(key, {key, source:item.source, section:item.section, title:item.title, effect:item.effect, family:item.family, count:0, sourceUrl:item.sourceUrl});
    categories.get(key).count++;
  }
  if (!categories.has('B|40 · One-Click Install Scripts')) {
    const info = data.b[40];
    categories.set('B|40 · One-Click Install Scripts', {key:'B|40 · One-Click Install Scripts',source:'B',section:'40 · One-Click Install Scripts',title:info[1],effect:info[2],family:info[0],count:0,sourceUrl:'https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/README.md'});
  }
  const categoryList = [...categories.values()];
  $('record-count').textContent = inventory.length.toLocaleString('zh-CN');
  $('category-count').textContent = categoryList.length.toLocaleString('zh-CN');

  function countForFamily(id) { return inventory.filter(item => item.family === id).length; }
  $('topic-grid').innerHTML = families.map(f => `<button class="topic-card" type="button" data-topic="${esc(f.id)}"><span class="topic-top"><span class="topic-num">${esc(f.mark)} / ${esc(f.name)}</span><span class="topic-arrow">↗</span></span><h3>${esc(f.name)}</h3><p>${esc(f.intro)}</p><span class="topic-count">${countForFamily(f.id).toLocaleString('zh-CN')} 条上游记录 · 查看重点资源</span></button>`).join('');
  $('topic-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    selectFeature(button.dataset.topic);
    $('featured').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });

  const highlightItems = data.highlights.map(row => {
    const [source,name,family,effect,caution] = row;
    const item = inventory.find(x => x.source === source && normalize(x.name) === normalize(name));
    return item ? {source,name,family,effect,caution,url:item.url,sourceUrl:item.sourceUrl} : null;
  }).filter(Boolean);
  const tabRoot = $('feature-tabs');
  tabRoot.innerHTML = families.map((f,i) => `<button type="button" aria-pressed="${i===0?'true':'false'}" data-feature="${esc(f.id)}">${esc(f.name)}</button>`).join('');
  tabRoot.addEventListener('click', event => {
    const button = event.target.closest('[data-feature]');
    if (button) selectFeature(button.dataset.feature);
  });
  function selectFeature(id) {
    tabRoot.querySelectorAll('[data-feature]').forEach(button => button.setAttribute('aria-pressed', button.dataset.feature === id ? 'true' : 'false'));
    $('feature-grid').innerHTML = highlightItems.filter(item => item.family === id).map(item => `<article class="feature-card"><div class="feature-meta"><span>${esc(sourceName(item.source))}</span><span>${esc(byFamily[id].mark)}</span></div><h3>${esc(item.name)}</h3><p class="feature-effect">${esc(item.effect)}</p><p class="feature-caution">核验提醒：${esc(item.caution)}</p><div class="feature-links">${anchor(item.sourceUrl,'上游条目 ↗')}${anchor(item.url,'上游所列网址 ↗')}</div></article>`).join('');
  }
  selectFeature(families[0].id);

  $('opportunity-grid').innerHTML = data.opportunities.map(op => {
    const resourceLinks = op.resources.map(([source,name]) => {
      const found = inventory.find(item => item.source===source && normalize(item.name)===normalize(name));
      return found ? anchor(found.sourceUrl,`${source} · ${name} ↗`,'resource-pill') : `<span class="resource-pill">${esc(source)} · ${esc(name)}</span>`;
    }).join('');
    return `<article class="opportunity-card"><div class="opportunity-top"><span class="opportunity-num">${esc(op.number)}</span><span class="priority">${esc(op.priority)}</span></div><h3>${esc(op.title)}</h3><p class="opportunity-reason">${esc(op.reason)}</p><div class="opportunity-detail"><strong>可能形成</strong><p>${esc(op.outcome)}</p><strong>适合什么时候看</strong><p>${esc(op.moment)}</p></div><p class="opportunity-limit"><b>核验边界</b> ${esc(op.limit)}</p><div class="opportunity-links"><span>清单里的入口</span><div>${resourceLinks}</div>${anchor(op.official[1],`${op.official[0]} ↗`,'official-link')}</div></article>`;
  }).join('');

  function fillFamilyOptions(select) { select.insertAdjacentHTML('beforeend', families.map(f => `<option value="${esc(f.id)}">${esc(f.name)}</option>`).join('')); }
  fillFamilyOptions($('category-family'));
  fillFamilyOptions($('inventory-family'));

  let categoryExpanded = false;
  function renderCategories() {
    const family = $('category-family').value;
    const source = $('category-source').value;
    const filtered = categoryList.filter(c => (family === 'all' || c.family === family) && (source === 'all' || c.source === source));
    $('section-count').textContent = `${filtered.length} 个分类`;
    const visible = categoryExpanded ? filtered : filtered.slice(0,18);
    $('category-grid').innerHTML = visible.map(c => `<article class="category-card"><div class="category-top"><span>${esc(sourceName(c.source))}</span><span>${c.count ? c.count.toLocaleString('zh-CN')+' 条记录' : '命令示例'}</span></div><h3>${esc(c.title)}</h3><p class="original-name">${esc(c.section)}</p><p class="category-effect">${esc(c.effect)}</p>${anchor(c.sourceUrl,'查看上游原分类 ↗')}</article>`).join('') || '<p class="empty-state">此筛选下没有分类。</p>';
    $('category-more').hidden = filtered.length <= 18;
    $('category-more').innerHTML = categoryExpanded ? '收起分类 ↑' : `展开其余 ${filtered.length-18} 个分类 ↓`;
  }
  ['category-family','category-source'].forEach(id => $(id).addEventListener('change', () => { categoryExpanded=false; renderCategories(); }));
  $('category-more').addEventListener('click', () => {categoryExpanded=!categoryExpanded;renderCategories();});
  renderCategories();

  const PAGE_SIZE = 36;
  let page = 1;
  let filtered = inventory;
  function updateSectionOptions() {
    const old = $('inventory-section').value;
    const family = $('inventory-family').value;
    const source = $('inventory-source').value;
    const sections = categoryList.filter(c => (family==='all'||c.family===family) && (source==='all'||c.source===source));
    $('inventory-section').innerHTML = '<option value="all">全部分类</option>' + sections.map(c => `<option value="${esc(c.key)}">${esc(c.source)} · ${esc(c.title)} (${c.count})</option>`).join('');
    $('inventory-section').value = sections.some(c => c.key === old) ? old : 'all';
  }
  function renderResults() {
    const query = normalize($('query').value);
    const family = $('inventory-family').value;
    const source = $('inventory-source').value;
    const section = $('inventory-section').value;
    filtered = inventory.filter(item =>
      (family==='all'||item.family===family) &&
      (source==='all'||item.source===source) &&
      (section==='all'||`${item.source}|${item.section}`===section) &&
      (!query || normalize(`${item.name} ${item.section} ${item.title} ${item.url}`).includes(query))
    );
    const pages = Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
    page = Math.min(page,pages);
    const slice = filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
    $('result-count').textContent = `找到 ${filtered.length.toLocaleString('zh-CN')} 条记录（含跨分类重复）`;
    $('result-grid').innerHTML = slice.map(item => `<article class="result-card"><div class="result-meta"><span>${esc(sourceName(item.source))}</span><span>·</span><span>${esc(byFamily[item.family]?.name || '其他资料')}</span></div><h3>${esc(item.name)}</h3><p>${esc(item.effect)} <strong>这是类别用途，单项能力待核实。</strong></p><div class="result-cat">原分类：${esc(item.section)}</div><div class="feature-links">${anchor(item.sourceUrl,'原始条目 ↗')}${anchor(item.url,'上游所列网址 ↗')}</div></article>`).join('') || '<p class="empty-state">没有找到匹配条目。试试更短的关键词，或重置筛选。</p>';
    $('page-info').textContent = `${page} / ${pages} 页`;
    $('prev-page').disabled = page <= 1;
    $('next-page').disabled = page >= pages;
  }
  $('query').addEventListener('input', () => {page=1;renderResults();});
  $('clear-query').addEventListener('click', () => {$('query').value='';page=1;renderResults();$('query').focus();});
  ['inventory-family','inventory-source'].forEach(id => $(id).addEventListener('change', () => {page=1;updateSectionOptions();renderResults();}));
  $('inventory-section').addEventListener('change', () => {page=1;renderResults();});
  $('reset-filters').addEventListener('click', () => {$('query').value='';$('inventory-family').value='all';$('inventory-source').value='all';updateSectionOptions();$('inventory-section').value='all';page=1;renderResults();});
  $('prev-page').addEventListener('click', () => {if(page>1){page--;renderResults();$('inventory').scrollIntoView();}});
  $('next-page').addEventListener('click', () => {if(page<Math.ceil(filtered.length/PAGE_SIZE)){page++;renderResults();$('inventory').scrollIntoView();}});
  updateSectionOptions();
  renderResults();
})();
