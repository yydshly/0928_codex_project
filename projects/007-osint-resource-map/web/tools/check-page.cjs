const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--allow-file-access-from-files'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(path.resolve(__dirname, '..', 'index.html')).href);
    await page.locator('#record-count').waitFor();
    assert.equal(await page.locator('#record-count').textContent(), '2,807');
    assert.equal(await page.locator('#category-count').textContent(), '122');
    assert.equal(await page.locator('#overview img').evaluate(img => img.naturalWidth), 2560);
    assert.equal(await page.locator('.feature-card').count(), 4);
    assert.equal(await page.locator('.opportunity-card').count(), 6);
    assert.equal(await page.locator('.opportunity-card a.resource-pill').count(), 18);
    assert.equal(await page.locator('.result-card').count(), 36);

    await page.locator('#query').fill('Shodan');
    const resultText = await page.locator('#result-count').textContent();
    assert.match(resultText, /找到 [1-9]/);
    assert((await page.locator('.result-card h3').allTextContents()).some(text => text.toLowerCase().includes('shodan')));
    assert(!resultText.includes('2,807'));

    await page.locator('#reset-filters').click();
    await page.locator('#inventory-source').selectOption('A');
    assert((await page.locator('.result-card .result-meta').allTextContents()).every(text => text.includes('awesome-osint')));

    await page.locator('[data-feature="dark"]').click();
    assert.equal(await page.locator('.feature-card').count(), 4);
    assert.match(await page.locator('#feature-grid').textContent(), /Ahmia/);

    await page.setViewportSize({ width: 390, height: 844 });
    const widths = await page.evaluate(() => ({viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth}));
    assert(widths.content <= widths.viewport + 1, `mobile horizontal overflow: ${JSON.stringify(widths)}`);
    assert.deepEqual(errors, []);
    console.log('Page check passed: inventory, search, source filter, topic tabs, and 390px layout.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
