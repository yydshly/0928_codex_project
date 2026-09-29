// Original research infographic for Buzz; content follows understanding.md.
// Generate vector source; render the SVG with a browser to export the PNG.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const C={bg:'#f4f3e9',ink:'#162e35',muted:'#52696c',line:'#d6dfd5',paper:'#ffffff',teal:'#1c6662',light:'#e6f1eb',gold:'#f2cb69',amber:'#865b1b',warm:'#fff3d9',navy:'#17363d'};
const chunks=[];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function rect(x,y,w,h,fill=C.paper,r=22,stroke){chunks.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke?` stroke="${stroke}"`:''}/>`);}
function text(x,y,s,size=27,color=C.ink,weight=400){chunks.push(`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`);}
function lines(x,y,arr,size=27,color=C.muted,gap=40){arr.forEach((s,i)=>text(x,y+i*gap,s,size,color));}
function line(x1,y1,x2,y2,color=C.line){chunks.push(`<path d="M${x1} ${y1}H${x2}" stroke="${color}" stroke-width="2"/>`);}
function arrow(x1,y,x2){chunks.push(`<path d="M${x1} ${y}H${x2}" stroke="${C.teal}" stroke-width="3" marker-end="url(#arrow)"/>`);}
function heading(x,y,num,title,sub){text(x,y,num,24,C.teal,700);text(x+55,y,title,34,C.ink,700);if(sub)text(x,y+40,sub,24,C.muted);}
function row(x,y,title,detail){text(x,y,title,28,C.ink,700);text(x,y+39,detail,25,C.muted);}
chunks.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="2180" viewBox="0 0 1920 2180" role="img" aria-labelledby="title desc"><title id="title">Buzz 一图完整理解：能力、效果、原理、场景与个人价值</title><desc id="desc">通信底座是房间管理、身份权限、消息存储和订阅推送。Agent 接入层决定是否响应，模型和工具执行业务。图中区分本机实测、源码或上游能力，以及尚需接入验证的场景与产出。</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${C.teal}"/></marker></defs><g font-family="Microsoft YaHei, PingFang SC, Noto Sans CJK SC, sans-serif">`);
rect(0,0,1920,2180,C.bg,0);
rect(0,0,1920,235,C.navy,0);
text(64,58,'PROJECT 012  /  BLOCK · BUZZ',24,C.gold,700);
text(64,129,'Buzz：人与 Agent 共用的协作工作区',55,'#ffffff',700);
text(64,187,'房间管理 + 身份权限 + 消息推送 → 接入 Agent → 连接真实业务',30,'#dceae5');
text(1440,58,'固定研究版本 · ebe99a46',23,'#b8d1ca');
// 01 + 02
rect(64,267,880,434);rect(976,267,880,434);
heading(94,318,'01','能力是什么','产品与源码能力范围；不代表已逐项实测');
const capabilities=[['组织对话','开放 / 私密频道、连续群聊、主题帖、讨论串、私信'],['管理身份','人与 Agent 独立身份；成员角色、访问范围与签名'],['接入 Agent','角色指令、模型、Skills / MCP、触发规则与执行进程'],['扩展协作','媒体评论、画布、搜索、Git 活动与部分工作流']];
capabilities.forEach(([a,b],i)=>row(94,401+i*77,a,b));
heading(1006,318,'02','现在实际实现了什么','本机已验证 · Windows 原版与中文修改版');
const results=[['可进入的真实工作区','服务端与客户端已运行，频道与消息可持续保存'],['有访问边界的房间','第二身份加入私密频道前不可读，加入后可读写'],['身份明确的聊天记录','两种身份签名收发消息，可围绕消息建立讨论串'],['可操作的中文界面','频道、身份、Agent 配置与常用设置；支持中英切换']];
results.forEach(([a,b],i)=>row(1006,401+i*77,a,b));
// 03 architecture
rect(64,729,1792,601);
heading(94,782,'03','底层原理是什么','三个职责层：通信底座 → Agent 接入 → 模型与工具执行');
rect(94,858,370,190,C.warm,16);rect(522,858,672,190,C.navy,16);rect(1252,858,574,190,C.light,16);
text(117,903,'人 / Agent 发出事件',29,C.ink,700);lines(117,947,['作者公钥 + 数字签名','频道标记 + 成员引用','正文 + 事件 / 回复关系'],25,C.muted,35);
text(548,903,'Buzz Relay · 通信服务端',29,'#ffffff',700);lines(548,947,['认证 / 验签 → 频道权限检查','存储事件 → 向符合条件的订阅者推送','服务端负责送达；业务理解由 Agent 完成'],25,'#dceae5',35);
text(1278,903,'各自接收，各自决定',29,C.ink,700);lines(1278,947,['人的客户端：显示消息，等待人操作','Agent A / B：分别检查授权与触发条件','收到消息，不代表所有 Agent 都要回答'],25,C.muted,35);
arrow(472,953,510);arrow(1202,953,1240);
text(96,1092,'Agent 的响应链',25,C.teal,700);
const flow=[['发送者授权 + 订阅规则',94,465],['会话 / 队列 → 模型 + 工具',611,614],['以 Agent 身份回复 → Relay',1277,549]];
flow.forEach(([t,x,w])=>{rect(x,1111,w,65,'#edf2ee',13);text(x+20,1154,t,26,C.ink,600);});arrow(568,1144,599);arrow(1234,1144,1265);
text(96,1222,'存储支撑',25,C.teal,700);text(252,1222,'PostgreSQL：事件 / 搜索    ·    Redis：分发 / 在线状态    ·    S3 / MinIO：媒体',25,C.muted);
line(94,1247,1826,1247);text(96,1290,'控制边界：默认按频道组织会话，可选讨论串；有排队与取消。频道权限、工具权限、业务授权分别检查。',25,C.ink);
// 04 / 05 / 06
const colx=[64,672,1280];for(const x of colx)rect(x,1358,576,459);
heading(94,1412,'04','使用场景','接入方向 · 需验证实际业务');
row(94,1500,'研发协作','围绕需求、代码、评审组织讨论');
row(94,1583,'故障与项目知识','检索历史，整理线索和处理依据');
row(94,1666,'运营与业务助手','查询订单、汇总信息、事件触发流程');
row(94,1749,'内容与媒体反馈','按主题、视频时间点保留修改意见');
heading(702,1412,'05','可以呈现哪些效果','前两项已实测；后两项需接入验证');
row(702,1500,'成员与权限清楚的群聊','频道列表、独立头像身份、私密空间');
row(702,1583,'可追溯的话题记录','实时消息、回复关系、讨论串与历史');
row(702,1666,'Agent 在频道中交付结果','摘要、查询结果、方案、代码评审建议');
row(702,1749,'有执行结果的业务流程','工具返回、处理状态、通知与任务接力');
heading(1310,1412,'06','对你的价值','结合本次研究与后续开发方向');
row(1310,1500,'现在：获得可体验的样本','源码 + 中文客户端 + 真实身份实测');
row(1310,1583,'设计：拆清系统职责','分开通信、身份、触发和业务执行');
row(1310,1666,'开发：参考协作工作台底座','复用思路：事件、权限、上下文和 ACP');
row(1310,1749,'决策：知道下一步验证什么','接一个模型和工具，跑通最小业务闭环');
// value takeaway and boundary
rect(64,1845,1792,108,C.navy,18);text(94,1891,'最值得参考的，是“把 Agent 当作有身份、有权限的成员接入业务”的整套机制。',32,'#ffffff',700);text(94,1930,'你可以据此评估自己的 Agent 协作或研发工作台；业务能力仍需模型、工具、授权与调度规则共同完成。',26,'#dceae5');
rect(64,1981,1792,125,C.warm,18);text(94,2026,'读图边界',27,C.amber,700);text(260,2026,'测试 Bot 回复由 CLI 手动发送；模型自动回复、工具执行、多 Agent 接力尚未实测。',26,C.ink);text(94,2069,'私密频道 ≠ 端到端加密；入群 ≠ 自动分工。部分工作流与审批有缺口，部署和长期运行仍需验收。',26,C.ink);
text(64,2145,'本仓库原创研究图 · 2026-09-29 · 非官方宣传图 / 非运行截图',22,C.muted);
text(1130,2145,'依据：understanding.md / research.md / runtime.md',22,C.muted);
chunks.push('</g></svg>');
fs.writeFileSync(path.join(root,'assets/buzz-overview.svg'),chunks.join('\n'));
console.log('Created assets/buzz-overview.svg (1920 × 2180)');
