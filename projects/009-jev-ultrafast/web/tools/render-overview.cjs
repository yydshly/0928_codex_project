// NODE_PATH should point to an environment that provides Playwright.
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
  const assets = path.resolve(__dirname, '../assets');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 2320 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(path.join(assets, 'overview.svg')).href);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.locator('text').evaluateAll(nodes => nodes.filter(node => {
      const box = node.getBBox();
      return box.x < 0 || box.x + box.width > 1600 || box.y + box.height > 2320;
    }).map(node => node.textContent));
    if (overflow.length) throw new Error(`Diagram text overflows: ${overflow.join('; ')}`);
    await page.screenshot({ path: path.join(assets, 'overview.png') });
    console.log('Rendered overview.png (1600 × 2320)');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
