"""Generate the independently authored overview diagram; standard library only."""
from pathlib import Path
from html import escape
import unicodedata
import re

W, H = 1800, 3600
OUT = Path(__file__).resolve().parents[1] / 'assets' / 'personal-edge-proxy-overview.svg'
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="title desc">', '<title id="title">Personal Edge Proxy 完整理解总览</title>', '<desc id="desc">个人代理的能力、使用端与 VPS 及目标端交互、代理协议与传输层原理、出站路径、加密和路由细节、个人价值、能力边界与扩展方向。</desc>', '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#168c85"/></marker></defs>', f'<rect width="{W}" height="{H}" fill="#f0f5f9"/>']

def rect(x,y,w,h,fill='#ffffff',stroke='none',r=16):
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')

def text(x,y,s,size=24,color='#173348',weight=400):
    parts.append(f'<text x="{x}" y="{y}" font-family="Microsoft YaHei, Noto Sans CJK SC, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(s)}</text>')

def wrapped(x,y,s,width,size=24,color='#4d6577',line=37,weight=400):
    current=''; used=0; lines=[]
    for char in re.findall(r'[A-Za-z0-9]+(?:[-./][A-Za-z0-9]+)*|\n|.', s):
        advance = sum(size * (1 if unicodedata.east_asian_width(c) in 'WF' else .57) for c in char)
        closing = char in '，。；：！？、）】》'
        if char=='\n' or (used+advance>width and current and not closing):
            lines.append(current); current=''; used=0
            if char=='\n': continue
        current+=char; used+=advance
    if current: lines.append(current)
    for i,sline in enumerate(lines): text(x,y+i*line,sline,size,color,weight)
    return y+len(lines)*line

def heading(y,n,title,subtitle=None):
    text(60,y,n,21,'#087d77',700); text(110,y,title,31,'#173348',700)
    if subtitle: text(110,y+36,subtitle,21,'#536c7e')

def card(x,y,w,h,label,title,body,fill='#ffffff'):
    rect(x,y,w,h,fill)
    text(x+26,y+37,label,19,'#087d77',700)
    text(x+26,y+80,title,28,'#173348',700)
    wrapped(x+26,y+120,body,w-52,23,line=35)

def arrow(x1,y1,x2,y2,color='#168c85',both=False,dash=False):
    parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="4" marker-end="url(#arrow)"'+(' marker-start="url(#arrow)"' if both else '')+(' stroke-dasharray="8 7"' if dash else '')+'/>')

rect(0,0,1800,215,'#0d2438',r=0)
text(60,48,'006 / OPEN SOURCE FIELD NOTES',21,'#50e1d1',700)
text(60,109,'Personal Edge Proxy · 完整理解总览',48,'#ffffff',700)
text(60,156,'你的设备 → 加密代理入口 → VPS 按规则转发 → 最终出口 → 目标服务',28,'#d6e9f3')
text(60,191,'入口解决“怎么到达 VPS”；出口决定“目标从哪个公网 IP 看到连接”。',23,'#a8c9da')

card(60,245,540,224,'定位 / WHAT IT IS','个人代理的搭建参考','可实现类似个人 VPN 的出网体验；核心资产是架构、文档与脱敏配置范例。')
card(630,245,540,224,'能力 / WHAT IT DOES','多入口 + 按目标选出口','HY2（UDP/QUIC/TLS）主入口，REALITY（TCP）备用；Xray 选择三类出口。')
card(1200,245,540,224,'交付 / WHAT YOU GET','现有组件的组合方法','需要自己准备 VPS 和客户端并配置验证；没有独立 VPN 内核或一键安装成品。')

heading(520,'01','一次请求怎样往返','图中四列是逻辑职责：使用 Direct 时，“出口”就是 VPS 自己的出站动作。')
rect(60,578,1680,457)
xs=[86,516,946,1376]
node_width=338
nodes=[('A / 使用端','你的设备','应用 → 本机代理核心','代理端口或 TUN 接管；\n规则决定直连还是代理。'),('B / 接入与分流','VPS · Xray','验证身份 → 读取目标','终止代理接入通道；\n按域名 / IP 选择出站。'),('C / 出口','最终出网路径','Direct / WARP / SOCKS5','由选定出口连接目标；\n决定目标看到的源 IP。'),('D / 目的端','目标网站 / API','接收请求 → 返回内容','处理登录、页面与数据；\n看到最终出口的公网 IP。')]
for x,(label,title,sub,body) in zip(xs,nodes):
    rect(x,610,node_width,240,'#e8f3f4' if x==86 else '#edf3f8')
    text(x+22,648,label,20,'#087d77',700)
    text(x+22,696,title,29,'#173348',700)
    text(x+22,734,sub,21,'#173348',600)
    wrapped(x+22,778,body,node_width-44,21,line=33)
for x in [424,854,1284]: arrow(x+9,733,x+78,733)
text(427,641,'HY2 或',18,'#526b7d'); text(427,667,'REALITY',18,'#526b7d')
text(863,661,'出站选择',18,'#526b7d'); text(1294,661,'访问目标',18,'#526b7d')
arrow(1650,876,154,876)
text(486,916,'响应沿同一逻辑链返回：目标 → 出口 → VPS → 客户端 → 应用',23,'#087d77',700)
text(88,965,'Direct：目标看到 VPS IP',23,'#173348',700)
text(628,965,'WARP：目标看到 WARP IP',23,'#173348',700)
text(1170,965,'固定 SOCKS5：看到上游出口 IP',23,'#173348',700)
text(88,1005,'客户端判定为直连的流量，不进入本图的 VPS 链路。接入与出网两段都必须实际可达。',23,'#536c7e')

heading(1085,'02','协议原理：代理指令、传输安全与出口服务各有分工')
card(60,1120,540,280,'代理协议 / 主入口','Hysteria2 · HY2','在 QUIC / UDP 上建立加密连接，认证后发送目标地址。TCP 数据走可靠的 QUIC 流；UDP 数据走 QUIC 数据报。')
card(630,1120,540,280,'代理协议 / 备用入口的一层','VLESS','携带用户标识、目标地址与转发指令。研究配置未启用 VLESS 额外加密，由 REALITY 保护接入；搭配 Vision 优化。')
card(1200,1120,540,280,'传输安全 / 配合 VLESS','REALITY','修改 TLS 握手与验证，结合密钥识别连接，借用 target 的 TLS 外观。target 是外观与回落目标，不是每次访问的网站。')
card(60,1430,540,280,'流控优化 / 配合 VLESS','XTLS Vision','早期握手做随机填充；对满足条件的 TLS 1.3 流量，直接搬运已有密文，减少重复处理。它不解密网站内容。')
card(630,1430,540,280,'代理协议 / 接上游出口','SOCKS5','先协商认证，再发送目标地址，成功后转发。TCP 用 CONNECT；UDP 需专门支持。自身不加密，固定 IP 取决于上游。')
card(1200,1430,540,280,'出口服务 / HTTP 隧道体系','WARP + MASQUE','Xray 先接本地 SOCKS5，warp-svc 再经 MASQUE 到 Cloudflare。MASQUE 用 HTTP 机制承载隧道；WARP 是出口服务。')
rect(60,1740,1680,154,'#e1eeef')
text(88,1783,'主入口：应用 → HY2 → QUIC / TLS 1.3 / UDP → VPS',25,'#173348',700)
text(88,1822,'备用：应用 → VLESS + Vision → REALITY / TCP → VPS',25,'#173348',700)
text(88,1861,'辅助层：TCP / UDP 负责运输，TLS 负责保护；可选 WebSocket / Tunnel 承载应急入口。TUN 是虚拟网卡接口。',23,'#4d6577')

parts.append('<g transform="translate(0 900)">')
heading(1085,'03','两层保护：在 VPS 解除外层，不等于解密网站内容')
rect(60,1120,830,243,'#0d2438')
text(88,1162,'内层 HTTPS：浏览器 ⇄ 目标网站',28,'#50e1d1',700)
wrapped(88,1205,'正常验证且无中间人解密时，HTTPS 内容由浏览器和网站处理，VPS 不自动获得正文。两层表示保护范围；Vision 可优化转发，并非所有字节重复加密两次。',773,23,'#d1e2eb',36)
rect(920,1120,820,243)
text(948,1162,'外层代理通道：本机核心 ⇄ VPS',28,'#173348',700)
wrapped(948,1205,'HY2 / REALITY 保护接入段；VPS 能处理目标地址及连接信息。远程 SOCKS5 自身不加密，需另行考虑上游链路保护；换 IP 也不会消除账号与 Cookie 身份。',764,23,line=36)

heading(1411,'04','内部细节：谁接管、怎么运输、怎样选路')
card(60,1445,540,258,'接管与封装','应用协议 ≠ 隧道协议','v2rayN 管理配置，核心实际转发。TCP 字节流可由 HY2 的 QUIC 流承载；HY2 需要密码与证书，REALITY 依配置认证。')
card(630,1445,540,258,'目标信息','DNS 与嗅探服务于选路','域名由客户端携带或从可见信息识别。嗅探不等于解密；DNS 位置依配置而定，TUN 本身不保证无泄漏。')
card(1200,1445,540,258,'服务端规则','从上到下，首个命中','先阻断私网，再匹配固定出口与 WARP；未命中走 Direct。WARP 示例仅含 TCP，不能推定覆盖全部 UDP。')

heading(1754,'05','对我的意义：个人网络出口参考 + 分层排障方法')
card(60,1788,540,233,'场景一 / 访问与开发','自己管理远程访问通道','验证 HY2 → VPS Direct 的最小路径；按需让开发工具或应用使用代理，并承担服务器与维护成本。')
card(630,1788,540,233,'场景二 / 出口策略','不同目标，使用不同出口','指定流量走 WARP，真正需要固定 IP 时再接受控上游。切换入口与维护出口可以分开处理。')
card(1200,1788,540,233,'场景三 / 排障与复用','知道问题发生在哪一层','依次查本机接管、入口可达、认证、DNS、路由和上游；沉淀成以后可复用的配置与诊断工具。')

heading(2071,'06','当前边界与研究判断')
rect(60,2105,830,245)
text(88,2149,'已有范例，也有需要另做的能力',27,'#173348',700)
wrapped(88,2193,'已提供 HY2、REALITY、Direct、WARP 与固定 SOCKS5 配置参考。Cloudflare Tunnel 仅是可选应急思路。自动切换、监控面板、多人管理和多 VPS 容灾需要额外实现。',774,23,line=36)
rect(920,2105,820,245,'#fff2e9')
text(948,2149,'没有性能、匿名性或服务可用性保证',27,'#95451d',700)
wrapped(948,2193,'多入口可能仍依赖同一台 VPS。WARP 不等于住宅或固定 IP；最终体验取决于线路与目标服务。固定上游失效时应按预定策略失败，不能默默换出口。',764,23,'#704f3d',36)

heading(2400,'07','扩展路线：先验证最小路径，再增加组件')
rect(60,2434,1680,145)
text(88,2477,'配置生成与校验  →  出口 IP / 连通观测  →  域名与 DNS 规则测试  →  多 VPS 容灾  →  凭据与证书维护',25,'#173348',700)
wrapped(88,2521,'这些是我们的后续开发方向，尚未实现。对个人的当前价值在于读懂并按需复用架构；真正部署前，应先验证自己的网络、组件版本和目标服务。',1618,23,line=34)

rect(0,2610,1800,90,'#0d2438',r=0)
text(60,2646,'独立研究图 · 非运行截图 · 原方案未部署 / 未测速 · 上游 MIT，其他组件许可与条款分别适用',22,'#d3e5ee')
text(60,2679,'依据：yding-git/personal-edge-proxy @ ff55bdf0429e927c97e304e03ee4b322f12d32e2；HY2 / Xray 官方文档 · 2026-09-28',18,'#9dc0d2')
parts.append('</g></svg>')
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text('\n'.join(parts),encoding='utf-8')
print(OUT)
