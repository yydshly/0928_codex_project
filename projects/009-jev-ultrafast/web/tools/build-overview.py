"""Generate this research project's original, editable overview diagram."""
from pathlib import Path
from xml.sax.saxutils import escape

parts = ['''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2320" viewBox="0 0 1600 2320" role="img" aria-labelledby="title desc">
<title id="title">Jev Ultrafast 完整理解：网页、编号、模型选择与执行</title>
<desc id="desc">库读取可见网页并建立节点、动作和模型序号的映射。任务、页面上下文和选择题发送给 Jev，返回操作和目标选择。点击直接交给程序执行；输入先请文本模型生成文字；完成选择需独立验收。附使用场景、上游证据和当前边界。</desc>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#8d603d"/></marker></defs>
<style>text{font-family:"Segoe UI","Microsoft YaHei",sans-serif}.mono{font-family:Consolas,"Microsoft YaHei",monospace}</style>
<rect width="1600" height="2320" fill="#edf2ee"/>
<rect width="1600" height="185" fill="#102a3a"/>
''']

def rect(x, y, w, h, fill='#ffffff', stroke='#ccdcd5', radius=14):
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>')

def text(x, y, value, size=23, color='#284955', weight=400, mono=False):
    klass = ' class="mono"' if mono else ''
    parts.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}"{klass}>{escape(value)}</text>')

def lines(x, y, values, size=23, color='#55707a', gap=34, weight=400, mono=False):
    for index, value in enumerate(values):
        text(x, y + index * gap, value, size, color, weight, mono)

def section(y, number, title, note=''):
    text(64, y, number, 19, '#a16b3c', 800, True)
    text(111, y, title, 29, '#153847', 800)
    if note:
        text(900, y, note, 18, '#617c82')

def arrow(x1, y1, x2, y2):
    parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="#8d603d" stroke-width="2.5" fill="none" marker-end="url(#arrow)"/>')

text(64, 44, 'OPEN SOURCE RESEARCH / 009 · browser-use/jev-ultrafast', 17, '#ffbd70', 800, True)
text(64, 102, '把网页变成选择题，再把选择变回真实操作', 46, '#f5faf5', 800)
text(64, 149, '库负责观察、编号和执行；Jev 负责决策；文本模型仅在需要输入文字时参与。', 25, '#c3dce2')

section(225, '01', '这个库的能力与三个角色', '现有实现：Chrome 网页中的普通 DOM 控件')
for x, title, body, tag in [
    (64, '网页适配与执行代码', ['读可见文字和控件 → 编号选项', '保留真实节点 → 复核并操作网页'], '本库实现 · snapshot / model / browser'),
    (562, 'TypeSafe Jev 决策模型', ['接收目标、状态和候选选择题', '返回操作选择与目标编号'], '外部模型服务 · 已经在进行决策'),
    (1060, '可配置文本模型', ['只在 TYPE_TEXT 时生成字段值', '接收目标、字段和页面上下文'], '外部模型服务 · 输出 {"text":"…"}')
]:
    rect(x, 246, 476, 146)
    text(x+22, 279, title, 26, '#173c4b', 800)
    lines(x+22, 314, body, 22, gap=31)
    text(x+22, 374, tag, 16, '#a06234')

section(447, '02', '编号由库生成，程序始终保留“编号 → 节点”的映射', '以下 ID 均为解释用示例')
for x, title, subtitle, body in [
    (64, '真实 DOM 节点', 'snapshot.js / 节点身份', ['出发地输入框', '内部 node = 42', 'WeakMap + Map 保留节点引用']),
    (562, '快照中的具体动作', 'snapshot.js / 动作标识', ['e2：填写 node 42', 'e3：点击 node 42', '同一输入框可有多个操作']),
    (1060, '发给模型的元素序号', 'model.py / action_space()', ['[2] 出发地 · 值为空', '操作：TYPE_TEXT / CLICK', '同一节点合并成一个元素选项'])
]:
    rect(x, 471, 476, 201)
    text(x+22, 507, title, 26, '#173c4b', 800)
    text(x+22, 538, subtitle, 17, '#a06234', mono=True)
    lines(x+22, 574, body, 22, gap=33)
arrow(541, 576, 558, 576)
arrow(1039, 576, 1056, 576)
rect(64, 685, 1472, 62, '#dce9e2', '#dce9e2', 9)
text(88, 724, '返回后的映射：TYPE_TEXT + "2" → 动作 e2 → node 42 → 出发地输入框。每轮重建选项，旧编号不可跨轮使用。', 23, '#214e56', 600)

section(798, '03', '发给 Jev 的是问题与候选项，拿回的是它选中的答案', '一次请求，同时询问操作和各类目标')
rect(64, 821, 711, 282)
text(90, 858, '库 → Jev：目标 + 页面状态 + 选择题', 27, '#173c4b', 800)
lines(90, 899, [
    '目标：搜索从苏黎世到伦敦的航班',
    '状态：[1] 搜索按钮；[2] 出发地空；[3] 目的地空',
    '问题 A：做什么？CLICK / TYPE_TEXT / WAIT / …',
    '问题 B：如果点击，选哪个？[1] / [2] / [3]',
    '问题 C：如果输入，选哪个？[2] / [3]',
], 22, gap=35)
rect(809, 821, 727, 282, '#153b4c', '#153b4c')
text(835, 858, 'Jev → 库：选择结果（简化）', 27, '#f5faf5', 800)
lines(835, 904, [
    'answers.operation.choice = "TYPE_TEXT"',
    'answers.type_text_target.choice = "2"',
], 23, '#ffc581', 38, mono=True)
lines(835, 1000, ['真实响应还带概率、置信度等字段。', '程序只用所选操作对应的目标答案；', '其余目标答案不会触发动作。'], 22, '#c2dbe2', 34)
arrow(777, 963, 805, 963)
text(64, 1140, 'HTTP POST api.typesafe.ai/v1/systemone  ·  state = 页面 + 元素 + 近期操作  ·  questions = 操作题 + 目标题', 20, '#5c7880', mono=True)

section(1195, '04', '拿到选择以后，程序分三条路径处理', '只有输入文字这条路径才调用文本模型')
for x in [64, 562, 1060]:
    rect(x, 1218, 476, 245)
text(88, 1256, 'CLICK / SELECT / SCROLL / WAIT', 21, '#a06234', 800, True)
text(88, 1294, '直接交给库执行', 29, '#183c4b', 800)
lines(88, 1334, ['点击与选择：查回对应目标节点', '复核状态、重新定位、排除遮挡', '滚动和等待使用预设的执行逻辑', '本步无需文本生成'], 22, gap=34)
text(586, 1256, 'TYPE_TEXT + "2"', 21, '#a06234', 800, True)
text(586, 1294, '先生成文字，再由库输入', 29, '#183c4b', 800)
lines(586, 1334, ['原目标 + 字段 + 页面 → 文本模型', '返回 {"text":"Zurich"}', '校验文字与页面 → 定位输入框', '程序输入后重新观察'], 22, gap=34)
text(1084, 1256, 'DONE / BLOCKED', 21, '#a06234', 800, True)
text(1084, 1294, '完成或停止推进', 29, '#183c4b', 800)
lines(1084, 1334, ['无需目标编号，也无需生成文字', 'DONE：模型判断目标已满足', 'BLOCKED：无支持的动作能推进', '实际成功仍由独立条件核验'], 22, gap=34)

rect(64, 1494, 1472, 129, '#153b4c', '#153b4c')
text(88, 1530, '执行闭环', 23, '#ffbd70', 800)
text(244, 1530, '观察 → 选择 → 复核 → 执行 → 重新观察', 27, '#f5faf5', 800)
text(88, 1570, '页面变化或控件失效 → 重新观察再决定；结束后 → 独立检查 URL、字段值、筛选状态和结果。', 23, '#bfd9df')
text(88, 1601, '提速手段：一次页面快照 · 合并决策请求 · 默认不传截图 · 按需生成文字 · 减少无效等待', 21, '#bfd9df')
parts.append('<path d="M64 1555 H33 V570 H59" stroke="#8d603d" stroke-width="2.5" stroke-dasharray="7 6" fill="none" marker-end="url(#arrow)"/>')

section(1680, '05', '使用场景：上游验证了什么，我们还能尝试什么？')
for x, title, body in [
    (64, '航班搜索 · 上游实测', ['单程、城市、日期 → 匹配航班可见', '一次录制 7.073 秒；未订票']),
    (562, '百科导航 · 上游实测', ['搜索并打开指定文章 → 核对 URL', '一次检查 2.798 秒']),
    (1060, '酒店筛选 · 上游本地测试', ['城市 + 两个筛选 → 指定酒店详情', '一次检查 1.896 秒'])
]:
    rect(x, 1703, 476, 142)
    text(x+22, 1741, title, 25, '#173c4b', 800)
    lines(x+22, 1781, body, 22, gap=34)
rect(64, 1860, 1472, 60, '#fff2dd', '#e5d6bb', 9)
text(88, 1898, '可扩展：内部网页后台、表单与筛选、网页冒烟检查、个人助手的网页执行环节。均需接入业务验收，尚未实测。', 22, '#875633')

section(1971, '06', '采用前看边界，研究时看可复用的设计')
rect(64, 1994, 711, 206)
text(88, 2032, '当前范围与依赖', 27, '#173c4b', 800)
lines(88, 2073, ['覆盖普通可见 HTML / ARIA 控件；无桌面或手机执行器。', 'iframe、Shadow DOM、Canvas、上传、新标签页等未覆盖。', '需 Chrome / Browser Harness、TypeSafe 与文本模型 API。', 'Jev 的网络架构和训练流程未在此仓库中实现。'], 22, gap=34)
rect(809, 1994, 727, 206)
text(833, 2032, '证据与个人价值', 27, '#173c4b', 800)
lines(833, 2073, ['三对同任务比较中位耗时约降 25%；不是通用成功率。', '7.073 秒不含启动、首次导航及最终独立核验。', '两次文字调用费用不是总费用；完整成本尚不明确。', '可借鉴：环境适配、动作选择、节点映射与独立验收。'], 22, gap=34)
parts.append('<line x1="64" x2="1536" y1="2230" y2="2230" stroke="#bdcec6"/>')
text(64, 2266, '固定研究提交 1231850a0bf1a0c0341fe408ef1668dbbfdfac46 · 2026-09-28 · 上游 MIT · 本仓库独立绘制', 19, '#55717a')
text(64, 2297, '依据上游 README、model.py、snapshot.js、browser.py、agent.py 与 performance.md；示例为教学说明，未在本机运行上游 Agent。', 18, '#55717a')
parts.append('</svg>')
destination = Path(__file__).resolve().parents[1] / 'assets' / 'overview.svg'
destination.write_text('\n'.join(parts), encoding='utf-8')
print(destination)
