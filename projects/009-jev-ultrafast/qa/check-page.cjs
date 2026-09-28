// Run with NODE_PATH pointing to a Node installation that includes Playwright.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const file = path.resolve(__dirname, '../web/index.html');
  const pageUrl = process.env.QA_BASE_URL || pathToFileURL(file).href;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const errors = [];
  try {
    for (const width of [1440, 768, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => {
        if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`);
      });
      await page.goto(pageUrl);
      await assert.equal(await page.title(), 'Jev Ultrafast · 网页智能体研究');
      assert.deepEqual(JSON.parse(await page.locator('#exchange-response').textContent()).answers.operation, { choice: 'TYPE_TEXT' });
      assert.equal(await page.locator('#helper-panel').evaluate(el => el.classList.contains('inactive')), false);
      await page.locator('[data-exchange="click"]').click();
      assert.deepEqual(JSON.parse(await page.locator('#exchange-response').textContent()).answers.click_target, { choice: '1' });
      assert.equal(await page.locator('#helper-panel').evaluate(el => el.classList.contains('inactive')), true);
      await page.locator('[data-exchange="done"]').click();
      assert.deepEqual(JSON.parse(await page.locator('#exchange-response').textContent()).answers, { operation: { choice: 'DONE' } });
      await page.locator('[data-exchange="type"]').click();
      await assert.equal(await page.locator('#scenario-name').textContent(), '航班搜索 · 从目标到可见结果');
      await assert.equal(await page.locator('#step-counter').textContent(), '01 / 05');
      await page.locator('#next-step').click();
      await assert.equal(await page.locator('#step-action').textContent(), 'TYPE_TEXT → [02]');
      await page.locator('[data-scenario="wiki"]').click();
      await assert.equal(await page.locator('#step-counter').textContent(), '01 / 03');
      await page.locator('[data-scenario="hotel"]').click();
      await assert.equal(await page.locator('#step-counter').textContent(), '01 / 04');
      await assert.equal(await page.locator('[data-scenario="hotel"]').getAttribute('aria-pressed'), 'true');
      for (let i = 0; i < 3; i += 1) await page.locator('#next-step').click();
      await assert.equal(await page.locator('#step-action').textContent(), 'DONE');
      await page.locator('#next-step').click();
      await assert.equal(await page.locator('#step-counter').textContent(), '01 / 04');
      await page.locator('.overview-figure img').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const img = document.querySelector('.overview-figure img');
        return img.complete && img.naturalWidth > 0;
      });
      const badAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links
        .filter(link => !document.getElementById(link.getAttribute('href').slice(1)))
        .map(link => link.getAttribute('href')));
      assert.deepEqual(badAnchors, []);
      const duplicateIds = await page.locator('[id]').evaluateAll(nodes => {
        const seen = new Set();
        return nodes.map(node => node.id).filter(id => seen.has(id) || !seen.add(id));
      });
      assert.deepEqual(duplicateIds, []);
      const localAssets = await page.locator('[href^="./"], [src^="./"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href') || node.getAttribute('src')));
      for (const asset of localAssets) assert.ok(fs.existsSync(path.resolve(path.dirname(file), asset)), `Missing asset: ${asset}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(overflow <= 1, `${width}px layout overflows by ${overflow}px`);
      if (process.env.QA_SCREENSHOTS) {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `jev-${width}-top.png`) });
        await page.locator('.scenario-lab').screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `jev-${width}-scenario.png`) });
        await page.locator('.exchange-grid').screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `jev-${width}-exchange.png`) });
      }
      console.log(`${width}px: layout, scenarios, model routing, links and image OK`);
      await page.close();
    }
    assert.deepEqual(errors, []);
    console.log('No browser JavaScript errors');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
