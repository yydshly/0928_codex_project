const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

(async () => {
  const baseURL = process.env.DEMO_URL || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, acceptDownloads: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await page.locator('#overview').scrollIntoViewIfNeeded();
  const poster = page.locator('#overview img');
  await poster.evaluate(img => img.decode());
  const size = await poster.evaluate(img => [img.naturalWidth, img.naturalHeight]);
  if (size[0] !== 2400 || size[1] !== 8329) throw new Error('Incorrect overview poster size: ' + size);
  const vectorResponse = await page.request.get(new URL('assets/infographic-overview.svg', baseURL).href);
  if (!vectorResponse.ok()) throw new Error('Overview SVG unavailable');
  const vector = await vectorResponse.text();
  const inventory = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/template-inventory.json'), 'utf8'));
  if (inventory.templates.length !== 276 || inventory.templates.some(name => !vector.includes('>' + name + '</text>'))) throw new Error('Incomplete overview template index');
  console.log('Overview: 2400 × 8329, SVG available, 276 template names present');
  const summary = page.locator('#summary');
  await summary.waitFor();
  for (const heading of ['它能做什么', '会得到什么效果', '实现原理', '适合放在哪里', '还能怎样扩展']) {
    if (!(await summary.getByRole('heading', { name: heading }).isVisible())) throw new Error(`Missing summary section: ${heading}`);
  }
  await summary.screenshot({ path: path.resolve(__dirname, '../assets/web-summary.png') });

  const counts = { hierarchy:112, sequence:83, list:29, compare:20, relation:18, chart:11, quadrant:3 };
  if (await page.locator('#template-total').innerText() !== '276') throw new Error('Incorrect template total');
  for (const [category, count] of Object.entries(counts)) {
    if (await page.locator(`[data-category="${category}"] .template-names li`).count() !== count) throw new Error(`Incorrect category count: ${category}`);
  }
  await page.locator('#template-search').fill('donut');
  if (await page.locator('#catalog-result').innerText() !== '找到 3 个模板') throw new Error('Template search failed');
  await page.locator('#template-search').fill('');
  await page.locator('#templates').screenshot({ path: path.resolve(__dirname, '../assets/template-catalog.png') });
  await page.locator('[data-try="quadrant"]').click();
  await page.locator('#infographic svg').getByText('按投入与价值整理任务').waitFor();

  for (const id of ['sequence', 'list', 'chart', 'compare', 'hierarchy', 'relation', 'quadrant']) {
    await page.locator(`#sample-nav button[data-id="${id}"]`).click();
    await page.locator('#infographic svg').waitFor({ timeout: 15000 });
    const elementCount = await page.locator('#infographic svg *').count();
    if (elementCount < 5) throw new Error(`${id}: SVG has only ${elementCount} elements`);
    const message = await page.locator('#render-status').innerText();
    if (message.includes('出错')) throw new Error(`${id}: ${message}`);
    console.log(`${id}: ${elementCount} SVG elements`);
  }

  await page.locator('#sample-nav button[data-id="sequence"]').click();
  await page.locator('#infographic svg').waitFor();
  const output = path.resolve(__dirname, '../assets/native-render.png');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await page.locator('.stage-panel').screenshot({ path: output });

  await page.locator('#theme-select').selectOption('dark');
  await page.locator('#infographic svg').waitFor();
  await page.locator('#theme-select').selectOption('hand-drawn');
  await page.locator('#infographic svg').waitFor();
  await page.locator('#theme-select').selectOption('default');

  await page.locator('#edit-toggle').check();
  await page.locator('#infographic svg').waitFor();
  await page.locator('#edit-toggle').uncheck();

  const syntax = await page.locator('#syntax-input').inputValue();
  await page.locator('#syntax-input').fill(syntax.replace('从想法到发布', '修改后的标题'));
  await page.locator('#render-button').click();
  await page.locator('#infographic svg').getByText('修改后的标题').waitFor({ timeout: 15000 });

  await page.locator('#reset-button').click();
  await page.locator('#stream-button').click();
  await page.getByText('流式渲染完成').waitFor({ timeout: 15000 });

  for (const type of ['svg', 'png']) {
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      page.locator(`#${type}-button`).click(),
    ]);
    if (!download.suggestedFilename().endsWith(`.${type}`)) throw new Error(`${type}: bad download name`);
    console.log(`${type}: download OK`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#infographic svg').waitFor();
  await page.locator('.topbar-links a[href="#summary"]').click();
  if (!(await page.locator('#summary-title').isVisible())) throw new Error('Summary anchor does not work on mobile');
  await page.locator('#summary').screenshot({ path: path.resolve(__dirname, '../assets/web-summary-mobile.png') });
  await page.locator('#templates').screenshot({ path: path.resolve(__dirname, '../assets/template-catalog-mobile.png') });
  await page.locator('#template-search').fill('不存在的模板');
  if (await page.locator('#catalog-result').innerText() !== '找到 0 个模板') throw new Error('No-results feedback failed');
  await page.locator('#template-search').fill('象限');
  await page.locator('[data-try="quadrant"]').click();
  await page.locator('#infographic svg').getByText('按投入与价值整理任务').waitFor();
  const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (mobileOverflow) throw new Error('Mobile layout overflows horizontally');
  console.log('mobile: no horizontal overflow');

  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  console.log(`Screenshot: ${output}`);
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
