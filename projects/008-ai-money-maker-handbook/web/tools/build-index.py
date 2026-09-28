"""Extract metadata only from the exact upstream snapshot (not document bodies).
Usage: python build-index.py PATH_TO_EXTRACTED_SNAPSHOT
"""
from pathlib import Path
import sys, re, json, hashlib
from urllib.parse import quote
BASE = Path(__file__).resolve().parents[2]
SHA = "74100dd291cbcec4438e1ca3eb5219c47a92a7d3"
UPSTREAM = "https://github.com/XiaomingX/ai-money-maker-handbook"
RULES = [
("开发与自动化", r"API|Agent|CLI|自动化|工具链|数据库|SDK|后端|运维|云服务|云基础|编程|软件|SaaS|SAAS|建站|部署|插件"),
("数据与信息服务", r"数据|资讯|信息差|情报|监控|比价|舆情|报告|知识库"),
("内容与创作", r"内容|创作|文案|图文|视频|直播|播客|音乐|图片|绘本|写作|小说|摄影|自媒体"),
("电商与交易", r"电商|进口|出口|出海|跨境|交易|分销|货运|物流|代购|团购|供应|回收|外贸|销售"),
("教育与知识服务", r"教育|课程|培训|知识|陪跑|求职|面试|留学|论文"),
("营销与获客", r"广告|营销|获客|流量|SEO|推广|增长|投流|运营|品牌"),
("生活与本地服务", r"宠物|家政|婚|租房|装修|健康|旅游|旅行|餐|养老|洗护|礼物|桌游|剧本杀|同城|线下"),
("金融与其他行业", r"金融|证券|贷款|保险|理财|Web3|代币|区块链|博彩|加密|股票|基金|投资")
]
reviews = {"ch0025.md","ch0072.md","ch0145.md","ch0146.md","ch0190.md","ch0443.md","ch0444.md","ch0447.md","ch0448.md"}
src = Path(sys.argv[1])
assert src.is_dir(), "Source snapshot directory is required"
records=[]
for series in ["程序员的副业赚钱宝典","创业者早期的烦恼树洞"]:
    for p in sorted((src/series).glob("ch*.md")):
        text=p.read_text(encoding="utf-8-sig")
        lines=[x.strip() for x in text.splitlines() if x.strip()]
        title=lines[0].lstrip("#").strip()
        if title in ("标题：","标题:"):
            title=lines[1].lstrip("#").strip()
        title=re.sub(r"\s*\(ch\d+\.md\)\s*$","",title)
        category="创业问答" if series.startswith("创业") else next((c for c,pat in RULES if re.search(pat,title,re.I)),"其他思路")
        rel=series+"/"+p.name
        records.append({"id":("business" if series.startswith("程序") else "startup")+"-"+p.stem,
          "series":series,"file":p.name,"title":title,"category":category,"path":rel,
          "url":UPSTREAM+"/blob/"+SHA+"/"+quote(rel,safe="/"),
          "hasSimulation":bool(re.search(r"模拟实战|模拟案例",text)),
          "featured":series.startswith("程序") and p.name in reviews,
          "sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
manifest={"repository":UPSTREAM,"commit":SHA,"snapshotDate":"2026-09-28",
          "method":"Enumerated all ch*.md files, extracted titles and simulation markers; categories are our title-based heuristic; read representative chapters separately.",
          "counts":{"businessChapters":sum(r["series"].startswith("程序") for r in records),"startupQuestions":sum(r["series"].startswith("创业") for r in records),"indexedDocuments":len(records)},
          "license":"Apache-2.0 (root and programmer series LICENSE)",
          "readmeExternalStartupLinks":31,
          "limitations":["Counts are files, not unique or proven business ideas.","No external article links, income figures, or customer acquisition results have been independently validated."]}
(BASE/"sources/chapter-index.json").write_text(json.dumps(records,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(BASE/"sources/manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(BASE/"web/catalog.js").write_text("RESEARCH.chapters = "+json.dumps(records,ensure_ascii=False,separators=(",",":"))+";\n",encoding="utf-8")
print(json.dumps(manifest["counts"],ensure_ascii=False))
print("Simulation markers:",sum(r["hasSimulation"] for r in records))
print("Unique titles:",len(set(r["title"] for r in records)))
print("Startup examples:",[r["title"] for r in records if r["series"].startswith("创业")][:4])
