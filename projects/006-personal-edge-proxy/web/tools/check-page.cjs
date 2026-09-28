// Local presentation QA and exact SVG-to-PNG export. Pass the Playwright package path.
const { chromium } = require(process.argv[2] || 'playwright');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const page = await browser.newPage({viewport:{width:1800,height:3600},deviceScaleFactor:1});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(path.join(root,'assets/personal-edge-proxy-overview.svg')).href);
  await page.evaluate(()=>document.fonts.ready);
  const textBounds = await page.locator('text').evaluateAll(nodes=>nodes.map(n=>({text:n.textContent,box:n.getBoundingClientRect()})).filter(({box})=>box.x<0||box.y<0||box.x+box.width>1800||box.y+box.height>3600));
  if(textBounds.length) throw new Error('Diagram text exceeds canvas: '+JSON.stringify(textBounds));
  await page.screenshot({path:path.join(root,'assets/personal-edge-proxy-overview.png')});
  await page.setViewportSize({width:1440,height:1100});
  await page.goto(pathToFileURL(path.join(root,'index.html')).href);
  await page.evaluate(()=>document.fonts.ready);
  for(const ingress of ['hy2','reality']) {
    await page.locator(`[data-ingress="${ingress}"]`).click();
    for(const [route,expected] of [['direct','VPS 公网 IP'],['warp','WARP 出口 IP'],['fixed','上游固定公网 IP']]) {
      await page.locator(`[data-route="${route}"]`).click();
      if(await page.locator('#ip-label').textContent()!==expected) throw new Error('Wrong exit identity');
      for(let i=0;i<5;i++) {
        await page.locator(`[data-step="${i}"]`).click();
        if(await page.locator('#step-number').textContent()!==String(i+1).padStart(2,'0')) throw new Error('Wrong stage');
      }
    }
  }
  await page.locator('#next-step').click();
  if(await page.locator('#step-number').textContent()!=='01') throw new Error('Loop control failed');
  await page.locator('[data-ingress="hy2"]').click();
  await page.locator('[data-route="direct"]').click();
  const screenshots=path.resolve(root,'../qa'); fs.mkdirSync(screenshots,{recursive:true});
  await page.locator('#protocols').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(screenshots,'protocols-desktop.png')});
  await page.evaluate(()=>scrollTo(0,0));
  await page.screenshot({path:path.join(screenshots,'desktop.png')});
  const overflow=[];
  for(const width of [1440,900,390,320]){
    await page.setViewportSize({width,height:900});
    const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
    if(sizes.scroll>sizes.client) overflow.push({width,...sizes});
    if(width===390){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(screenshots,'mobile.png')});await page.locator('#protocols').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(screenshots,'protocols-mobile.png')});}
  }
  await page.setViewportSize({width:1440,height:1100});
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  const zoom=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
  if(zoom.scroll>zoom.client) overflow.push({zoom:'200%',...zoom});
  const missing=[];
  for(const ref of await page.locator('[href],[src]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')||n.getAttribute('src')))){
    if(!ref||/^(https?:|data:)/.test(ref)) continue;
    if(ref.startsWith('#')){if(!await page.locator(ref).count()) missing.push(ref);}
    else if(!fs.existsSync(path.resolve(root,ref))) missing.push(ref);
  }
  await browser.close();
  console.log(JSON.stringify({errors,overflow,missing,interactionCases:30,diagram:'1800×3600 PNG + SVG'},null,2));
  if(errors.length||overflow.length||missing.length) process.exitCode=1;
})();
