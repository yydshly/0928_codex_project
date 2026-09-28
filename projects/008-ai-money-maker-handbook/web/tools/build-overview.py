"""Build the editable SVG overview. All diagram copy is authored for project 008."""
from pathlib import Path
from html import escape
P=Path(__file__).resolve().parents[1]/"assets"/"idea-map.svg"
W,H=1800,2800
C={"ink":"#17243e","muted":"#62718a","blue":"#3153ed","navy":"#141f38","line":"#dce3ef","pale":"#edf2ff","orange":"#ff976e"}
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">',
'<title id="title">AI Money Maker Handbook：AI 创业思路整理、案例收集与持续产品化</title>',
'<desc id="desc">以痛点、人群、最小产品、获客、收费、留存为六要素，整理图片、文案、音频、直播、绘本、视频、工具自动化和知识数据咨询八类内容，并提出个人思路库持续迭代的产品方向。</desc>',
'<style>text{font-family:"Microsoft YaHei","Noto Sans SC","Segoe UI",sans-serif} .body{font-weight:400} </style>']
def rect(x,y,w,h,fill,stroke=None,r=0):
    out.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"'+(f' stroke="{stroke}"' if stroke else '')+'/>')
def text(x,y,s,size=28,fill=None,weight=400,maxw=None):
    out.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill or C["ink"]}" font-weight="{weight}"'+(f' data-max-width="{maxw}"' if maxw else '')+f'>{escape(s)}</text>')
def line(x1,y1,x2,y2,stroke=None,width=2):
    out.append(f'<path d="M{x1} {y1}H{x2}" stroke="{stroke or C["line"]}" stroke-width="{width}"/>' if y1==y2 else f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{stroke or C["line"]}" stroke-width="{width}"/>')
def arrow(x,y,color=None):
    out.append(f'<path d="M{x} {y}h20m-7-7 7 7-7 7" fill="none" stroke="{color or C["blue"]}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
def section(n,y,title,sub):
    rect(80,y-30,52,42,C["blue"],r=8)
    text(94,y,n,23,"white",700)
    text(150,y+1,title,34,C["ink"],700)
    text(150,y+42,sub,25,C["muted"],400,1530)
rect(0,0,W,H,"#f4f7fc")
rect(0,0,W,286,C["navy"])
rect(80,54,8,40,C["orange"],r=3)
text(108,82,"OPENLAB / 008",25,"#a6b9ff",700)
text(1710,82,"AI MONEY MAKER HANDBOOK",24,"#a6b9ff",600)
# Right-aligned series label.
out[-1]=out[-1].replace('x="1710"','x="1720" text-anchor="end"')
text(80,151,"本质：面向 AI 创业的思路整理与案例收集库",52,"white",700,1630)
text(80,209,"整理 AI 创业方向与案例，围绕需求、产品与商业模式探索创业机会。",30,"#d6def0",400,1640)
text(80,256,"444 篇副业章节  ·  70 篇创业问答  ·  31 条首页创业文章外链",25,"#a8b8d7",400,1640)

section("01",351,"贯穿全库的六个商业问题","每个方向都可以按这六个要素继续追问，把模糊点子拆成可以讨论的方案。")
stages=[
("痛点","什么事情麻烦？","现有做法有何成本？"),
("人群","具体是谁需要？","谁使用、谁决定买？"),
("最小产品","先交付什么结果？","怎样判断做得有用？"),
("获客","去哪里找到他们？","怎样展示并建立信任？"),
("收费","对方为何愿意付费？","按次、订阅还是服务？"),
("留存","为什么继续使用？","如何复购与持续改善？")]
for i,(title,a,b) in enumerate(stages):
    x=80+i*278
    rect(x,415,250,150,"white",C["line"],14)
    text(x+20,449,f"0{i+1}",21,C["blue"],700)
    text(x+20,489,title,31,C["ink"],700,212)
    text(x+20,524,a,22,C["muted"],400,214)
    text(x+20,552,b,21,C["muted"],400,214)
    if i<5:arrow(x+255,490)
text(80,602,"价值来自：省时、省钱、便利、表达、审美、娱乐或陪伴；AI 是实现这些价值的可用能力。",26,C["muted"],400,1640)

section("02",674,"收集了哪些方向？能从中扩展什么？","左列归纳上游内容，右列是我们进一步提出的产品或服务方向；各方向可以交叉组合。")
rect(80,746,1640,66,C["navy"],r=12)
rect(80,785,1640,27,C["navy"])
text(108,790,"内容方向",27,"white",700)
text(388,790,"原库收集的内容",27,"white",700)
text(1080,790,"我们可扩展的方向 · 待验证",27,"#b5c5ff",700)
rows=[
("图片与视觉",["头像、壁纸、模特换装、商品广告","家装效果、LOGO、照片修复"],["垂直场景素材包、电商图片工作台","品牌视觉模板、照片修复服务"]),
("文案与写作",["新媒体推文、小说与剧本","简历改写、图文创作"],["行业文案助手、品牌内容模板","多语种改写、系列故事创作"]),
("音频与音乐",["AI 音乐、声音克隆","音频内容创作方向"],["有授权的配音、有声内容","场景配乐、品牌音频素材"]),
("直播与虚拟人",["无人货架直播、虚拟人直播","虚拟人口播"],["讲解脚本、提词与互动辅助","商品讲解素材、虚拟主播运营工具"]),
("绘本与故事",["图片绘本故事、儿童绘本","AI 辅助出版"],["分龄主题故事、角色与分镜管理","绘本排版、有声绘本、讲读视频"]),
("视频与传播",["小说漫画推文、剧情解说","转场动画、视频翻译与搬运思路"],["长内容拆解、字幕与本地化","图文转视频、授权素材再创作"]),
("工具与自动化",["API 聚合、AI 工作流、插件与模板","垂直 SaaS、模型训练等技术方向"],["行业小工具、批量生产工作台","流程定制、接口集成与部署服务"]),
("知识、数据与咨询",["行业数据包、AI 咨询与顾问","技术服务、创业与经营问答"],["垂直资料研究、机会情报与知识服务","思路整理、选题发现与决策辅助"])
]
for i,(title,src,exp) in enumerate(rows):
    y=812+i*108
    rect(80,y,1640,108,"white" if i%2==0 else "#f0f4fc")
    rect(80,y,7,108,C["orange"] if i==4 else "#bdccff")
    text(110,y+61,title,29,C["ink"],700,250)
    for j,s in enumerate(src):text(388,y+42+j*38,s,27,C["muted"],400,645)
    for j,s in enumerate(exp):text(1080,y+42+j*38,s,27,C["blue"],500,610)
    line(1038,y+16,1038,y+92,"#dde4f2")
rect(80,1700,1640,158,C["pale"],"#c9d5ff",14)
text(110,1745,"跨媒介示例：一份绘本思路，可以长出多种交付",30,C["blue"],700,1580)
text(110,1792,"文案：故事 / 分镜  ＋  图片：角色 / 场景  ＋  音频：旁白 / 配乐",29,C["ink"],500,1580)
text(110,1835,"→ 成册绘本、有声绘本、讲读短视频、直播讲读素材；再按人群与反馈持续修改。",27,C["muted"],400,1580)

section("03",1923,"核心扩展方法：每次换一个维度，再回到六要素","从一个熟悉方向出发，改变服务对象、使用场景或交付形式，就能形成新的探索假设。")
axes=[("换人群","创作者 / 商家 / 家庭"),("换场景","宣传 / 讲解 / 陪伴"),("换媒介","图文 / 声音 / 视频"),("换交付","定制 / 素材 / 工具"),("换渠道","社群 / 内容 / 合作"),("换收费","按次 / 订阅 / 服务")]
for i,(title,a) in enumerate(axes):
    x=80+i*278
    rect(x,1990,250,98,"white",C["line"],12)
    text(x+18,2028,title,29,C["ink"],700,215)
    text(x+18,2065,a,21,C["muted"],400,215)

rect(80,2130,1640,460,C["navy"],r=20)
text(112,2182,"04  /  进一步产品化：把自己的思路持续迭代进去",36,"white",700,1550)
text(112,2227,"将原库材料、自己的观察、新想法与实验反馈，汇入一个持续完善的思路工作台。",26,"#b9c7e2",400,1550)
loop=[("收集","原文 / 自己的观察"),("结构化","填写六个商业要素"),("关联扩展","跨场景与媒介组合"),("做小样","展示具体交付结果"),("记录反馈","需求 / 成本 / 付费"),("迭代版本","修改、合并或暂停")]
for i,(title,sub) in enumerate(loop):
    x=112+i*267
    rect(x,2262,235,96,"#263857",r=10)
    text(x+17,2300,title,29,"white",700,207)
    text(x+17,2337,sub,21,"#b9c7e2",400,207)
    if i<5:arrow(x+241,2306,"#829de9")
out.append('<path d="M1644 2368v22H190v-22m-7 7 7-7 7 7" fill="none" stroke="#ff976e" stroke-width="2.5" stroke-linejoin="round"/>')
rect(657,2370,490,40,C["navy"])
text(680,2398,"把结果写回思路，让下一轮更具体",24,"#ffb897",600,470)
text(112,2450,"已有基础",24,"#a5baff",700)
text(268,2450,"008 已有索引、筛选、收藏、组合草稿、本地试验记录与导出。",25,"#d3ddef",400,1370)
text(112,2496,"后续可做",24,"#ffb897",700)
text(268,2496,"自定义案例入库、六要素分析、思路关联、证据与版本管理、AI 辅助追问。",25,"#d3ddef",400,1370)
text(112,2550,"演进方向：个人思路库  →  自己的探索工作台  →  面向特定人群的产品（验证后）",27,"white",600,1550)

text(80,2654,"来源：XiaomingX/ai-money-maker-handbook · 固定提交 74100dd · 研究日期 2026-09-28",23,C["muted"],400,1640)
text(80,2695,"本图为本仓库独立整理；原库采用 Apache-2.0。八类内容与六要素为研究归纳，扩展与产品化为我们的设想。",22,C["muted"],400,1640)
text(80,2736,"原库包含方案推演与模拟案例；文件数不代表已验证的生意，后续产品能力仍需开发与实践。",22,C["muted"],400,1640)
out.append("</svg>")
P.write_text("\\n".join(out).replace("\\n","\n"),encoding="utf-8")
print(P)
