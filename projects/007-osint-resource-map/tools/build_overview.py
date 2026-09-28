"""Draw the one-page, independently authored overview of two pinned OSINT lists."""

from html import escape
from pathlib import Path


OUT = Path(__file__).resolve().parents[1] / "web" / "assets" / "resource-overview.svg"
W, H = 2560, 2190
FONT = "'Microsoft YaHei','Noto Sans CJK SC','PingFang SC',sans-serif"
parts = []


def add(s):
    parts.append(s)


def rect(x, y, w, h, fill, rx=0, stroke="none", sw=1):
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')


def txt(x, y, value, size=28, fill="#183239", weight=400, anchor="start", spacing=None):
    extra = f' letter-spacing="{spacing}"' if spacing is not None else ""
    add(f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}"{extra}>{escape(value)}</text>')


def line(x1, y1, x2, y2, color="#d7e3dc", sw=2):
    add(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{color}" stroke-width="{sw}"/>')


lanes = [
    {
        "name": "01 发现公开线索", "summary": "从网页、账号、记录找到调查起点", "color": "#3c7957", "light": "#e8f2e6",
        "cards": [
            ("01", "搜索与网页资料", "A + B", ["通用／本地／专业搜索引擎", "公开文档、代码、博客与问答", "网页存档、历史页面与变化监测"], ["找到原始页面、旧版本及", "可继续追溯的公开线索"], "Wayback Machine · GitHub Code Search"),
            ("02", "账号与社交线索", "A + B", ["用户名、邮箱、电话号码", "社交平台、论坛、频道与互动", "人物、游戏及音乐平台公开资料"], ["形成候选账号与公开关系，", "再核对是否确属同一主体"], "Sherlock · WhatsMyName"),
            ("06", "公司与公共记录", "A + B", ["企业、财务、招聘与公开登记", "新闻、学术、统计与事实核查", "地区专题资料与公共档案"], ["查到组织或事件的原始记录，", "补足背景与时间线"], "OpenCorporates · Wikidata"),
        ],
    },
    {
        "name": "02 核对内容与资产", "summary": "把线索与地点、媒体、网络事实对齐", "color": "#347a91", "light": "#e4f1f4",
        "cards": [
            ("03", "域名与网络资产", "A + B", ["DNS、证书、域名与 IP 历史", "公开服务、网站技术与设备索引", "网络归属、资产关联与变化"], ["梳理自有或获授权资产的", "公开足迹与异常入口"], "crt.sh · Censys · urlscan.io"),
            ("04", "图片、视频与文件", "A + B", ["反向图片搜索与相似画面", "视频关键帧、文件及元数据", "素材来源、旧版本与取证线索"], ["找到可能的出处和时间线，", "并核对素材许可"], "TinEye · ExifTool · InVID"),
            ("05", "地图与地理核查", "A + B", ["地图、街景、卫星与地形", "地名、坐标、IP 粗定位", "海事、车辆及地区位置资料"], ["交叉核对地点与画面特征；", "留意影像时间和覆盖差异"], "Google Maps · OpenStreetMap"),
        ],
    },
    {
        "name": "03 识别风险与特殊来源", "summary": "处理暴露、威胁与 Tor 隐藏服务线索", "color": "#aa6548", "light": "#f7ede6",
        "cards": [
            ("07", "泄露与暴露检查", "A + B", ["自有邮箱、账号与域名暴露", "公开泄露记录及代码中密钥", "凭据风险与后续处置线索"], ["识别需要核查或轮换的", "账号与秘密信息"], "Have I Been Pwned · gitleaks"),
            ("08", "Tor 与隐藏服务", "A + B", ["隐藏服务索引：Ahmia 等", "Tor 搜索入口与站点目录", "已知站点的技术分析工具"], ["在有限索引中寻找线索；", "目录与镜像仍须验证真伪"], "Ahmia · Dark.fail · OnionScan"),
            ("09", "威胁情报与监测", "A + B", ["恶意样本、IP 信誉与指标", "威胁行为者、活动及研究报告", "网页、品牌与安全事件监测"], ["给安全事件补充上下文，", "形成待复核的关联与趋势"], "VirusTotal · ThreatFox"),
        ],
    },
    {
        "name": "04 组织研究与执行", "summary": "选择环境、工具、方法与练习材料", "color": "#695b91", "light": "#efedf7",
        "cards": [
            ("10", "隐私与研究环境", "A + B", ["研究浏览器、Tor、VPN", "本地隔离、离线保存与加密", "通信、凭据与工作环境管理"], ["减少研究过程中的暴露，", "保留可复核的工作材料"], "Tor Browser · Tails"),
            ("11", "安全测试与取证", "B 为主", ["Web／网络／移动／硬件测试", "漏洞、口令、日志与逆向分析", "红蓝队工具、取证与练习环境"], ["在授权范围验证安全问题，", "分析事件与系统痕迹"], "Nmap · Wireshark · Autopsy"),
            ("12", "方法、开发与学习", "A + B", ["API、框架、浏览器扩展与脚本", "课程、视频、博客、RSS 与案例", "CTF、赏金规则及相关资源库"], ["把零散查询变成可重复的", "检索、记录与核验流程"], "OSINT Framework · Trace Labs"),
        ],
    },
]


add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">')
add('<title id="title">两份 OSINT 资源库分类全景图</title>')
add('<desc id="desc">把 awesome-osint 与 awesome-osint-arsenal 的资源归入四条主线、十二个任务主题；每类列出主要资源类型、可能得到的效果和代表性名称。</desc>')
rect(0, 0, W, H, "#f5f8f4")
rect(0, 0, W, 22, "#17363a")
rect(80, 74, 12, 102, "#bbdf80", 6)
txt(114, 111, "OSINT / RESOURCE LANDSCAPE", 23, "#458268", 800, spacing="3")
txt(114, 180, "两份资源库，一张分类全景图", 66, "#17363a", 850)
txt(115, 228, "按“要解决什么问题”重组两份 README：四条主线 · 十二个主题 · 每类能获得的线索", 27, "#57716e")
rect(80, 275, 1185, 155, "#17363a", 22)
rect(108, 300, 62, 62, "#cbec9b", 13)
txt(139, 342, "A", 31, "#17363a", 900, "middle")
txt(190, 333, "awesome-osint", 36, "#ffffff", 800)
txt(190, 379, "公开来源调查导航：搜索、账号、公司、媒体、地图、历史资料", 25, "#c9dfd6")
txt(190, 409, "以分类链接为主，适合从调查问题找到候选来源", 22, "#9fbdb1")
rect(1295, 275, 1185, 155, "#26464b", 22)
rect(1323, 300, 62, 62, "#efac82", 13)
txt(1354, 342, "B", 31, "#17363a", 900, "middle")
txt(1405, 333, "awesome-osint-arsenal", 36, "#ffffff", 800)
txt(1405, 379, "OSINT + 安全工具箱：泄露、Tor、扫描、取证、练习", 25, "#c9dfd6")
txt(1405, 409, "还包含安装脚本；其中部分工具是主动测试", 22, "#9fbdb1")

card_x = [80, 690, 1300, 1910]
for col, lane in enumerate(lanes):
    x = card_x[col]
    c, pale = lane["color"], lane["light"]
    rect(x, 465, 570, 112, pale, 20)
    rect(x, 465, 10, 112, c, 5)
    txt(x + 34, 513, lane["name"], 32, c, 800)
    txt(x + 34, 548, lane["summary"], 22, "#5d716e")
    for row, card in enumerate(lane["cards"]):
        y = 600 + row * 420
        num, title, source, topics, effects, example = card
        rect(x, y + 8, 570, 393, "#dfe9e2", 20)
        rect(x, y, 570, 393, "#ffffff", 20, "#dce7df", 2)
        rect(x + 26, y + 25, 58, 44, pale, 11)
        txt(x + 55, y + 56, num, 22, c, 850, "middle")
        txt(x + 100, y + 59, title, 34, "#19373b", 800)
        rect(x + 461, y + 29, 83, 35, pale, 16)
        txt(x + 502, y + 53, source, 19, c, 800, "middle")
        line(x + 28, y + 87, x + 542, y + 87)
        txt(x + 28, y + 122, "主要资源", 20, c, 800)
        for i, topic in enumerate(topics):
            rect(x + 30, y + 143 + i * 38, 7, 7, c, 3)
            txt(x + 48, y + 152 + i * 38, topic, 25, "#3e5858")
        line(x + 28, y + 262, x + 542, y + 262)
        txt(x + 28, y + 297, "可得到", 20, c, 800)
        txt(x + 115, y + 297, effects[0], 25, "#234349", 700)
        txt(x + 115, y + 330, effects[1], 25, "#234349", 700)
        rect(x + 24, y + 348, 522, 29, pale, 7)
        txt(x + 34, y + 370, "例  " + example, 20, c, 650)

rect(80, 1880, 2400, 225, "#17363a", 24)
txt(115, 1933, "怎么读这张图", 28, "#d0efa1", 800)
txt(115, 1982, "先定问题 → 选主题 → 去原站核对数据来源与权限 → 用独立证据复核结果", 31, "#ffffff", 700)
line(115, 2010, 2445, 2010, "#456468", 2)
txt(115, 2052, "边界", 22, "#d0efa1", 800)
txt(185, 2052, "清单是入口，不是工具质量认证；Tor 索引覆盖有限；主动扫描、口令测试与取证须有授权。", 23, "#c1d7d0")
txt(80, 2151, "本仓库独立归纳与绘制 · 基于 A: 3ab9cde / B: 2c6475a（2026-09-28）· 示例名称和分类来自固定 README；未逐一实测外部资源", 20, "#667b75")
add("</svg>")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(parts) + "\n", encoding="utf-8")
print(OUT)
