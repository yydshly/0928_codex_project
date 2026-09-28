const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.resolve(__dirname, '..');
const { getTemplates } = require(path.join(root, 'web/node_modules/@antv/infographic/lib/templates'));
const names = getTemplates().sort();
const version = require(path.join(root, 'web/node_modules/@antv/infographic/package.json')).version;
const palette = { bg:'#f6f4ed', ink:'#173b36', muted:'#536e64', green:'#c9ef89', line:'#d3dfcf', white:'#fffefb' };
const cats = [
  ['hierarchy','层级','看清归属与组成','知识分类、产品模块、组织架构','tree:层级树,mindmap:思维导图,structure:组织结构','#3e775f'],
  ['sequence','序列','看清先后与阶段','操作步骤、项目计划、发布路线','ascending:上升阶梯,circle:箭头环,circular:循环,color:彩色蛇形,cylinders:立体柱体,filter:筛选网格,funnel:漏斗,horizontal:横向折返,interaction:交互时序,mountain:山峰,pyramid:金字塔,roadmap:路线图,snake:蛇形,stairs:阶梯,steps:步骤,timeline:时间线,zigzag:折返','#427b83'],
  ['list','列表','看清并列要点','功能清单、会议结论、服务概览','column:竖排,grid:网格,pyramid:金字塔,row:横排,sector:扇形,waterfall:瀑布排列,zigzag:折返','#718540'],
  ['compare','对比','看清对象之间的差别','工具选型、套餐对比、SWOT 梳理','binary:双对象对照,hierarchy:层级对照,quadrant:象限对比,swot:SWOT','#987449'],
  ['relation','关系','看清连接与依赖','系统依赖、模块调用、流程连线','circle:环形关系,dagre:有向分层流程,network:网络关系','#6c668d'],
  ['chart','图表','看清数量、趋势与构成','访问量、支出比较、占比和词项概览','bar:条形,column:柱状,line:折线,pie:饼图与环图,wordcloud:词云','#487ca0'],
  ['quadrant','象限','按两个维度整理对象','价值与投入、重要与紧急的分类','quarter:四分区,simple:简洁象限','#997366'],
];
const expected = {hierarchy:112,sequence:83,list:29,compare:20,relation:18,chart:11,quadrant:3};
for (const [id] of cats) if (names.filter(n=>n.startsWith(id+'-')).length !== expected[id]) throw Error('Count changed: '+id);
if (names.length !== 276 || new Set(names).size !== 276) throw Error('Unexpected template inventory');
const groups = {};
for (const name of names) { const key=name.split('-').slice(0,2).join('-'); groups[key]=(groups[key]||0)+1; }
const out = path.join(root,'web/public/assets');
fs.mkdirSync(out,{recursive:true});
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let parts = [];
function rect(x,y,w,h,fill=palette.white,r=24,stroke=palette.line) { parts.push('<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+fill+'" stroke="'+stroke+'"/>'); }
function text(x,y,value,size=28,color=palette.ink,weight=400,mono=false) { parts.push('<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" fill="'+color+'"'+(mono?' font-family="Consolas,monospace"':'')+'>'+esc(value)+'</text>'); }
function lines(value,width,size) {
  const result=[]; let line='',used=0;
  for(const token of value.match(/[A-Za-z0-9_-]+|[^\n]|\n/g)||[]) {
    const cost=Array.from(token).reduce((sum,ch)=>sum+(/[\u0000-\u00ff]/.test(ch)?size*.57:size),0);
    if(token==='\n'||(used+cost>width&&!/^[，。、；：！？）]$/.test(token))){result.push(line.trimEnd());line='';used=0;if(token==='\n')continue;}
    if(!line&&token===' ')continue;
    line+=token;used+=cost;
  }
  if(line)result.push(line);
  return result;
}
function para(x,y,value,width,size=27,color=palette.muted,step=41,weight=400) {
  for(const line of lines(value,width,size)){ text(x,y,line,size,color,weight); y+=step; } return y;
}
function heading(y,num,title,subtitle) { text(80,y,num+' / '+title,42,palette.ink,700); if(subtitle)text(80,y+49,subtitle,25,palette.muted); }
function bullet(x,y,title,body,width) { text(x,y,title,29,palette.ink,700); return para(x,y+44,body,width,25,palette.muted,38)+22; }

(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
    await page.goto(process.env.DEMO_URL||'http://127.0.0.1:4173/',{waitUntil:'networkidle'});
    const shots={};
    for(const [id] of cats){
      await page.locator('#sample-nav button[data-id="'+id+'"]').click();
      await page.locator('#infographic svg').waitFor();
      const status=await page.locator('#render-status').innerText();
      if(status.includes('出错'))throw Error(status);
      shots[id]=(await page.locator('#infographic').screenshot()).toString('base64');
    }

    text(80,95,'OPENLAB  /  PROJECT 010  /  2026-09-28',25,palette.muted,700);
    text(80,194,'AntV Infographic',90,palette.ink,700);
    text(80,263,'把整理好的内容，按模板与布局规则转换成图。',43,palette.ink,600);
    rect(1780,60,540,224,palette.ink,24,palette.ink);
    text(1814,125,'276 模板  ·  7 大类',39,palette.green,700);
    text(1814,176,'41 个模板家族',32,'#ffffff',600);
    text(1814,226,'固定版本 v'+version+'  /  MIT',25,'#c5d9cb');

    heading(365,'01','这个库交付什么','文字要点、步骤、层级、关系和数值都可以成为输入；内容需先结构化。');
    const blocks=[
      ['内容描述','用简短语法或配置对象表达标题、说明、数据项及关系。'],
      ['视觉资产','内置模板、结构、标题与数据项组件，搭配主题、色板和资源。'],
      ['绘制与编辑','布局并渲染 SVG；浏览器内选择、移动和编辑文字，导出 SVG / PNG。'],
      ['接入与扩展','网页嵌入、服务端 SVG 输出、流式重渲染，以及自定义组件和插件。']
    ];
    blocks.forEach(([title,body],i)=>{const x=80+i*568;rect(x,443,544,240);text(x+26,492,title,32,palette.ink,700);para(x+26,544,body,490,26,palette.muted,40);});

    heading(778,'02','原理：规划内容 → 选模板 → 填数据 → 规则布局 → 输出','通常直接复用已有模板；有特殊版式需求时再定制。');
    const steps=[
      ['规划','人或外部 AI 提取重点，判断顺序、归属、对比或数量关系。'],
      ['描述','选择模板，把内容写入 lists、sequences、root、compares 等字段。'],
      ['组合','解析配置；模板预设结构、标题和数据项组件，主题控制视觉风格。'],
      ['绘制','JSX 设计组件与布局引擎生成 SVG；流式输入不断追加并重渲染。'],
      ['交付','检查内容和排版，必要时编辑画布，再导出 SVG 或 PNG。']
    ];
    steps.forEach(([title,body],i)=>{const x=80+i*455;rect(x,856,430,270,palette.ink,20,palette.ink);text(x+24,908,'0'+(i+1)+'  '+title,32,palette.green,700);para(x+24,960,body,382,25,'#d4e2d7',40);if(i<4)text(x+431,1006,'→',28,'#6b925b',700);});
    rect(80,1150,2240,90,'#e8efdF',16);
    text(109,1207,'AI 可负责理解与选型；库负责绘制。改变内容关系时，需要同时调整数据结构。',29,palette.ink,600);

    heading(1330,'03','支持哪些图：七类效果与全部模板家族','数量来自原库 getTemplates()；缩略图为本页七个代表模板的实际渲染，内容为演示数据。');
    const cardY=1410, cardW=1104, cardH=680, gap=32;
    cats.forEach(([id,title,question,scene,families,color],i)=>{
      const x=80+(i%2)*(cardW+gap),y=cardY+Math.floor(i/2)*(cardH+gap);
      rect(x,y,cardW,cardH);
      text(x+28,y+58,title,43,color,700);
      text(x+cardW-250,y+58,expected[id]+' 个模板',32,color,700);
      text(x+28,y+105,question+'  /  '+scene,25,palette.muted);
      parts.push('<image x="'+(x+28)+'" y="'+(y+128)+'" width="1048" height="235" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,'+shots[id]+'"/>');
      text(x+28,y+397,'模板家族（英文名为模板 ID 的第二段）',24,color,700);
      const entries=families.split(',').map(pair=>{const [key,label]=pair.split(':');return label+' '+key+' ×'+groups[id+'-'+key];});
      const end=para(x+28,y+444,entries.join('  ·  '),1048,23,palette.muted,36);
      if(end>y+cardH-25)throw Error('Family text overflow: '+id);
      if(id==='hierarchy')para(x+28,y+557,'树形 100 = 4 个方向 × 5 类连线 × 5 种节点；思维导图 10；组织结构 2。',1048,25,palette.muted,38);
      if(id==='relation')para(x+28,y+557,'Dagre 流程包含上下 / 左右方向及部分动画变体；模板名称并不代表新的布局算法。',1048,25,palette.muted,38);
      if(id==='chart')para(x+28,y+557,'饼图家族包含环图；词云表达词项权重或概览。用数值图时需保持单位和比较口径一致。',1048,25,palette.muted,38);
      if(id==='compare')para(x+28,y+557,'compare-quadrant 与 quadrant 有分别注册的模板名；这里按原库清单计数，语义类型有重叠。',1048,25,palette.muted,38);
    });
    const lastX=1216,lastY=cardY+3*(cardH+gap);
    rect(lastX,lastY,cardW,cardH,'#e7efdD');
    text(lastX+30,lastY+60,'模板多，日常用法可以很简单。',37,palette.ink,700);
    let by=lastY+122;
    by=bullet(lastX+30,by,'276 是注册模板数','同一类表达可以有方向、卡片、节点、连线或动画变体。完整名称见图底部。',1038);
    by=bullet(lastX+30,by,'三种内置主题','default 默认 · dark 深色 · hand-drawn 手绘；还可自定义色板、字体和图案。',1038);
    by=bullet(lastX+30,by,'按需求选关系，再选外观','要点用列表，先后用序列，归属用层级，差异用对比，连接用关系，数值用图表，两维分类用象限。',1038);
    bullet(lastX+30,by,'不必学完所有模板','能更快帮助读者理解或作出决定，就是使用价值；短通知用文字、参数查询用表格也合适。',1038);

    const lifeY=cardY+4*(cardH+gap)+70;
    heading(lifeY,'04','使用场景与对我的意义','把它作为按需取用的可视化工具，当前可归档参考，有实际表达需求时再打开。');
    rect(80,lifeY+80,1104,435);
    rect(1216,lifeY+80,1104,435,palette.ink,24,palette.ink);
    text(110,lifeY+139,'场景：让内容更易读、更易比较',33,palette.ink,700);
    let ly=lifeY+195;
    ly=para(110,ly,'研究与文档：能力清单、实现流程、模块关系、选型对照。',1038,27,palette.muted,43)+14;
    ly=para(110,ly,'工作与汇报：会议要点、项目计划、业务指标、组织结构。',1038,27,palette.muted,43)+14;
    ly=para(110,ly,'内容与产品：知识摘要、产品说明、教程插图、AI 回答中的视觉段落。',1038,27,palette.muted,43)+14;
    para(110,ly,'批量输出：将业务数据映射到固定模板，生成报告或配图。',1038,27,palette.muted,43);
    text(1246,lifeY+139,'个人价值：少花时间排版，按需复用',33,palette.green,700);
    para(1246,lifeY+195,'优先用熟：能力列表、步骤流程、模块关系、方案对比。',1038,28,'#e0eddf',44);
    para(1246,lifeY+301,'使用路线：遇到需求 → 整理内容 → 找模板 → 填数据 → 核对与调整 → 导出。',1038,28,'#e0eddf',44);
    para(1246,lifeY+409,'当前已具备分类索引和可运行示例；无需逐个研究所有模板。',1038,27,'#c4d9c7',42);

    const entryY=lifeY+612;
    heading(entryY,'05','从哪里使用，后续怎样扩展');
    rect(80,entryY+44,2240,300);
    const entries=[
      ['直接体验','官方 Gallery 选效果；官方 AI 页配置模型服务后输入内容；本页可试用七类代表模板。'],
      ['开发接入','HTML / React / Vue 等网页传入语法或配置；服务端 renderToString 输出 SVG 字符串。'],
      ['扩展方向','自定义结构、数据项、模板、主题、资源和编辑器插件；品牌模板、业务映射与审核流程需自行实现。']
    ];
    entries.forEach(([title,body],i)=>{const x=110+i*740;text(x,entryY+105,title,31,palette.ink,700);para(x,entryY+160,body,670,26,palette.muted,42);});

    const appendixY=entryY+445;
    heading(appendixY,'06','完整模板索引 · 276 / 276','以下保留原库完整注册名称，可按名称到网页分类区搜索；此清单完整，不表示逐一验证了全部效果。');
    const listY=appendixY+94, rows=92,rowH=29,colW=752;
    const ordered=cats.flatMap(([id])=>names.filter(n=>n.startsWith(id+'-')));
    ordered.forEach((name,i)=>{
      const col=Math.floor(i/rows),row=i%rows,x=80+col*colW,y=listY+row*rowH;
      const category=cats.find(([id])=>name.startsWith(id+'-'));
      if(row%2===0)rect(x,y-20,728,29,'#eaf0e4',0,'none');
      text(x+8,y,String(i+1).padStart(3,'0'),16,'#7b8f7b',400,true);
      text(x+52,y,name,17,category[5],400,true);
    });
    const footY=listY+rows*rowH+52;
    text(80,footY,'资料：antvis/Infographic · infographic.antv.vision/learn · 当前安装包 @antv/infographic@'+version,23,palette.muted);
    text(80,footY+40,'本图由本仓库独立编排；七张缩略图来自原库实际运行。原库采用 MIT 许可，示例数据为本仓库编写。',23,palette.muted);
    text(80,footY+80,'验证范围：七个代表模板及基础交互。原库不自动保证事实正确；内容、数据关系与最终排版仍需核对。',23,palette.muted);
    const height=footY+130;
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="'+height+'" viewBox="0 0 2400 '+height+'" font-family="Microsoft YaHei, PingFang SC, sans-serif"><title>AntV Infographic 完整能力总览与 276 个模板索引</title><desc>库的内容、原理、七类图形与所有模板名称、场景、个人价值和接入扩展。固定版本 '+version+'。</desc><rect width="2400" height="'+height+'" fill="'+palette.bg+'"/>'+parts.join('')+'</svg>';
    const svgPath=path.join(out,'infographic-overview.svg');
    fs.writeFileSync(svgPath,svg);
    fs.writeFileSync(path.join(root,'assets/template-inventory.json'),JSON.stringify({version,total:names.length,families:groups,templates:ordered},null,2)+'\n');
    await page.setViewportSize({width:2400,height:1000});
    await page.goto(pathToFileURL(svgPath).href);
    await page.evaluate(()=>document.fonts.ready);
    const pngPath=path.join(out,'infographic-overview.png');
    const textOverflow=await page.evaluate(()=>Array.from(document.querySelectorAll('text')).filter(el=>{const b=el.getBBox();return b.x<0||b.x+b.width>2400||b.y+b.height>document.documentElement.height.baseVal.value;}).map(el=>el.textContent));
    if(textOverflow.length)throw Error('Out of bounds text: '+textOverflow.join(' / '));
    await page.goto('about:blank');
    await page.setContent('<style>html,body{margin:0;padding:0}img{display:block;width:2400px;height:'+height+'px}</style><img src="data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64')+'">');
    await page.locator('img').evaluate(img=>img.decode());
    console.log('SVG complete; rendering PNG '+2400+' × '+height);
    await page.screenshot({path:pngPath,fullPage:true,timeout:120000});
    // Keep review crops with the tools, outside the published artifact directory.
    for(const [name,y,h] of [['top',0,1330],['families',1410,1392],['families2',2834,1392],['value',lifeY-40,1000],['index',appendixY-40,700]]){
      await page.setViewportSize({width:2400,height:h});
      await page.evaluate(offset=>{document.querySelector('img').style.transform='translateY(-'+offset+'px)';document.body.style.overflow='hidden';},y);
      await page.screenshot({path:path.join(__dirname,'review-'+name+'.png')});
    }
    console.log(JSON.stringify({svg:svgPath,png:pngPath,width:2400,height,templates:ordered.length,families:Object.keys(groups).length,textOverflow},null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exit(1);});
