'use strict';

const commit = '49c15a6df2a1595dfd0ef2771abfc1229504d075';
const base = `https://github.com/moeru-ai/airi/blob/${commit}/`;
const sources = {
  commit: `https://github.com/moeru-ai/airi/tree/${commit}`,
  readme: `${base}README.md`, agentGuide: `${base}AGENTS.md`,
  vrm: `https://github.com/moeru-ai/airi/tree/${commit}/packages/stage-ui-three/src/composables/vrm`,
  animation: `${base}packages/stage-ui-three/src/composables/vrm/animation.ts`,
  expression: `${base}packages/stage-ui-three/src/composables/vrm/expression.ts`,
  lipsync: `${base}packages/stage-ui-three/src/composables/vrm/lip-sync.ts`,
  interaction: `${base}packages/stage-ui-three/src/composables/vrm/interaction.ts`,
  minecraft: `${base}integrations/minecraft/README.md`,
  gameActions: `${base}integrations/minecraft/src/cognitive/action/llm-actions.ts`,
  computer: `${base}services/computer-use-mcp/README.md`,
  computerTools: `${base}services/computer-use-mcp/src/server/register-tools.ts`,
  computerRuntime: `${base}services/computer-use-mcp/src/server/runtime.ts`,
  browserExtension: `${base}services/computer-use-mcp/chrome-extension/README.md`,
  desktopTools: `${base}services/computer-use-mcp/src/server/tool-descriptors/desktop.ts`,
  macExecutor: `${base}services/computer-use-mcp/src/executors/macos-local.ts`,
  plugin: `${base}packages/plugin-sdk/docs/design/architecture.md`,
  license: `${base}LICENSE`,
  llm: 'https://airi.moeru.ai/docs/en/docs/manual/config/llm',
  audio: 'https://airi.moeru.ai/docs/en/docs/manual/config/audio',
  vision: 'https://airi.moeru.ai/docs/en/docs/manual/config/vision',
  manual: 'https://airi.moeru.ai/docs/en/docs/manual/tamagotchi/setup-and-use/',
  web: 'https://airi.moeru.ai/docs/en/docs/manual/web/',
  factorio: 'https://airi.moeru.ai/docs/en/docs/integrations/factorio',
  local: 'https://airi.moeru.ai/docs/en/docs/manual/config/providers/consciousness/lm-studio',
};

const capabilities = {
  computer: { index:'09', category:'COMPUTER USE / EXPERIMENTAL', symbol:'>_', title:'给 Agent 接上实际执行层', summary:'独立的 computer-use-mcp 服务提供桌面观察、键鼠输入、浏览器桥接与终端工具。Agent 通过工具调用选择动作，执行器负责真正操作。', how:'观察窗口 / DOM / 截图 → 模型选择工具与参数 → 本地执行器 → 返回结果并复查。', needs:'单独连接 MCP 服务，选择真实执行后端并满足系统权限；浏览器工具还需匹配的桥接能力。', limit:'当前主要面向 macOS，默认 dry-run 不注入键鼠；Linux X11 为旧实验后端。所研究的执行器注册没有 Windows 原生后端，不能从 Windows 客户端支持推导出 Windows 电脑控制。', refs:[['computer','服务与运行条件'],['computerRuntime','执行器注册']] },
  chat: { index:'01', category:'CONSCIOUSNESS', symbol:'Aa', title:'把模型装进一个角色', summary:'通过模型提供商生成回复，角色卡定义名称、性格、场景与开场白。模型负责推理，AIRI 组织角色与交互体验。', how:'角色设定与会话上下文 → 选定的 LLM → 回复文本。', needs:'一个可用的聊天模型：云端账户 / API，或已启动的本地模型服务。', limit:'回答质量取决于接入的模型。角色设定不等于持久记忆，也不能保证长期人格一致。', refs:[['llm','聊天配置'],['web','角色卡说明']] },
  voice: { index:'02', category:'HEARING + SPEECH', symbol:'~∿', title:'把文字往返变成语音交互', summary:'语音识别将麦克风声音转成文字，语音合成把回复读出来。输入、输出可以独立选择服务和启用。', how:'麦克风 → 语音识别（ASR / STT）→ 对话模型 → 语音合成（TTS）→ 播放。', needs:'分别配置识别与合成提供商，选择模型、声音和麦克风，并允许录音。', limit:'延迟与自然度取决于模型、服务和网络。本次未验证实时打断、全双工体验或端到端延迟。', refs:[['audio','语音配置'],['lipsync','VRM 口型源码']] },
  avatar: { index:'03', category:'BODY + EXPRESSION', symbol:'◉', title:'角色有形象，也有表现层', summary:'支持 Live2D、VRM 等模型。VRM 代码包含眨眼、眼球运动、口型、表情和动画加载，组合出可见的角色反馈。', how:'渲染器加载角色素材；表情、音频口型与动画逻辑分别更新角色状态。', needs:'兼容的模型及必要的表情、骨骼和动画素材。不同模型能呈现的效果不同。', limit:'存在接口不等于已有成熟互动。画质、动作衔接与语义表现需要在具体素材上实测。', refs:[['vrm','VRM 源码'],['expression','情绪与表情']] },
  vision: { index:'04', category:'VISION / DEVELOPMENT', symbol:'[ ]', title:'把屏幕内容变成上下文', summary:'桌面版可选择窗口或显示器，将捕获的画面交给支持图像输入的模型理解，再按配置发布给当前角色。', how:'窗口 / 屏幕截图 → 视觉模型 → 画面描述或上下文 → 当前角色。', needs:'单独配置视觉提供商与模型；在开发工具的 Vision Capture 中选来源、启动捕获并开启 Publish to character。', limit:'文档将它描述为桌面开发调试流程，离开该页面会停止捕获。视觉理解不自动等于鼠标键盘操作。', refs:[['vision','视觉配置与限制']] },
  game: { index:'05', category:'GAME AGENT / INTEGRATION', symbol:'↔', title:'进入游戏，要接上执行环境', summary:'Minecraft 服务将游戏事件交给感知、反射、推理和行动层处理。Factorio 通过外部游戏服务交换上下文与操作。', how:'游戏事件 → 决策与任务规划 → 专用动作接口 → 游戏状态反馈。', needs:'Minecraft 需从源码运行服务并连接服务器；Factorio 需提供兼容的服务端集成。', limit:'固定提交说明 Mineflayer 服务处于迁移淘汰路径，计划改为 Fabric mod。Factorio 桌面版不附带可直接部署的 bot 服务。本次未验证游戏成功率。', refs:[['minecraft','Minecraft 与迁移说明'],['factorio','Factorio 条件']] },
  platform: { index:'06', category:'CHANNELS + EXTENSIONS', symbol:'{ }', title:'连接社区和更多外部能力', summary:'仓库包含 Discord、Telegram 等集成，通过服务通道交换消息与上下文；插件平台也在探索跨设备能力编排。', how:'外部平台服务 ↔ server-sdk / server-runtime ↔ 角色应用。', needs:'目标平台账户、必要凭据和单独运行的集成服务。插件需按当前协议与接口开发。', limit:'Discord 需要源码启动 bot。插件架构文档标注为 Active design，不能把全部设计目标当作现成产品功能。', refs:[['readme','通道与集成结构'],['manual','Discord 使用条件'],['plugin','插件设计状态']] },
  memory: { index:'07', category:'MEMORY / WORK IN PROGRESS', symbol:'···', title:'长期陪伴，仍有关键空缺', summary:'项目讨论过记忆系统与相关实验，但在线使用手册对短期记忆和长期记忆功能仍标记为尚未提供。', how:'保存会话、检索过去信息、形成可更新的长期记忆，是需要分开核对的能力。', needs:'后续需检查具体发布版本、可用入口，以及记忆写入、召回、修正和删除是否真正贯通。', limit:'手册自述适用于 0.11.3，不能据此断言所有新版本都没有记忆实现；本次未证实可用的完整长期记忆流程。', refs:[['manual','手册的记忆状态'],['readme','研究方向与路线图']] },
  runtime: { index:'08', category:'RUNTIMES + PROVIDERS', symbol:'⌘', title:'共享能力，运行在不同终端', summary:'网页、Electron 桌面和移动应用共享部分产品模块。模型既能来自云端，也能来自 Ollama、LM Studio 等本地服务。', how:'不同终端界面 → 共享角色、语音与渲染模块 → 所选的模型服务和外部连接。', needs:'选择合适的客户端；如需本地推理，先启动模型服务并确认可从该客户端访问。', limit:'自己部署 AIRI 不保证所有推理离线，也不保证各端功能一致。本地模型的速度和资源消耗仍取决于设备与模型。', refs:[['agentGuide','各端技术栈'],['local','本地模型配置']] },
};

document.querySelectorAll('[data-source]').forEach(link => {
  link.href = sources[link.dataset.source];
  link.target = '_blank'; link.rel = 'noopener noreferrer';
});

const tabs = Array.from(document.querySelectorAll('[data-capability]'));
function selectCapability(key) {
  const data = capabilities[key];
  tabs.forEach(tab => {
    const active = tab.dataset.capability === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.getElementById('capability-panel').setAttribute('aria-labelledby', `tab-${key}`);
  for (const field of ['category','symbol','title','summary','how','needs','limit']) {
    document.getElementById(`detail-${field}`).textContent = data[field];
  }
  document.getElementById('detail-index').textContent = `${data.index} / ${String(tabs.length).padStart(2, '0')}`;
  const selectedStatus = tabs.find(tab => tab.dataset.capability === key).querySelector('.status');
  const detailStatus = document.getElementById('detail-state');
  detailStatus.textContent = selectedStatus.textContent;
  detailStatus.className = `${selectedStatus.className} detail-state`;
  const links = data.refs.map(([source, label]) => {
    const link = document.createElement('a');
    link.href = sources[source]; link.textContent = `${label} ↗`;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; return link;
  });
  document.getElementById('detail-sources').replaceChildren(...links);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCapability(tab.dataset.capability));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectCapability(tabs[next].dataset.capability); }
  });
});

const flows = {
  computer: {label:'操作界面', steps:[
    ['观察界面','窗口 / DOM / 截图','先获得可定位的界面信息','desktop_observe 整合桌面截图、窗口、辅助功能树与可用的 Chrome 语义，形成带目标标识和位置的候选项。','desktopTools'],
    ['选择目标','Agent + 工具参数','把意图转成具体目标和操作','模型根据任务与观察选择点击、输入或其他工具。目标来自观察结果；人物形象本身不承担键鼠执行。','computer'],
    ['检查条件','执行器 / 桥接 / 策略','确认这条操作通道真的可用','检查运行后端、桥接能力与配置策略。默认 dry-run 不注入输入；DOM 工具会检查桥接是否支持所请求动作。','computerTools'],
    ['执行操作','本地输入 / 浏览器通道','让本地执行器实际操作软件','macos-local 通过 Swift / Quartz CGEvent 发送真实键鼠事件。浏览器还有 DOM / CDP 接口，使用条件取决于所连接的桥接。','macExecutor'],
    ['复查结果','新观察 / 返回信息','成功与失败都进入下一轮','读取操作结果并重新观察目标状态，决定继续、重试或报告问题。本页展示结构，不代表这条控制链已在本机跑通。','computer'],
  ]},
  voice: {label:'语音对话', steps:[
    ['接收声音','麦克风输入','麦克风进入听觉模块','选择麦克风并允许录音。这里展示的是处理路径，不会启动你的麦克风。','audio'],
    ['识别文字','ASR / STT','把语音转为可处理的文本','识别服务把音频转换为文本。语言、准确率和响应速度与所选服务、模型及环境相关。','audio'],
    ['组织回复','角色 + LLM','角色设定与上下文参与回复','聊天模型结合角色设定与当前上下文生成回复。AIRI 负责接入模型并组织对话。','llm'],
    ['合成声音','TTS','把回复交给语音合成服务','使用所选声音合成语音并播放。语音服务与聊天模型可独立配置。','audio'],
    ['呈现角色','口型 + 表情','音频与表情驱动角色表现','VRM 口型使用音频分析结果更新元音表情；表情控制还需避免与口型互相覆盖。动画效果需要结合模型实测。','lipsync'],
  ]},
  vision: {label:'理解屏幕', steps:[
    ['选择画面','桌面开发工具','选择窗口或显示器','在桌面 Vision Capture 页面选择画面来源；必要时授予系统录屏权限。','vision'],
    ['捕获图像','Capture ticker','按配置捕获画面','开启捕获循环。官方文档说明离开开发页面会停止这一循环。','vision'],
    ['理解内容','视觉模型','把图片交给支持视觉的模型','必须使用支持图像输入的模型。云端提供商会接收捕获帧，本地服务则取决于你的部署位置。','vision'],
    ['传递上下文','Publish to character','将视觉结果发布给角色','启用 Publish to character 后，视觉结果才能按该流程进入当前角色上下文。','vision'],
    ['生成回应','对话模型','结合画面信息作出回应','本页只解释“看见到回应”的路径；仅配置视觉并不能证明已具备通用桌面操作能力。','vision'],
  ]},
  game: {label:'游戏行动', steps:[
    ['感知环境','游戏事件','把原始事件变成可用信号','Minecraft 集成将游戏运行时事件归一化，再交给规则和后续处理层。','minecraft'],
    ['即时反应','反射 / 状态机','处理需要迅速响应的变化','反射层用状态机处理即时反应，也可以抑制推理层的冗余工作。这些决策不必每次都等待 LLM。','minecraft'],
    ['制定计划','推理 / LLM','处理复杂目标与聊天','推理层负责高层规划与对话，把行动请求交给执行层。它本身不直接完成物理动作。','minecraft'],
    ['执行动作','任务与专用工具','调用实际游戏能力','动作目录包含 goToPlayer、collectBlocks、craftRecipe 等。followPlayer 把玩家名与距离交给反射运行时持续跟随；模型无需逐帧决定按键。','gameActions'],
    ['观察反馈','新状态 / 新事件','行动结果进入下一轮处理','环境变化重新成为输入。此路径解释系统结构，不表示已经在本仓库测得任务成功率。','minecraft'],
  ]},
};
let currentFlow = 'voice';
function selectStep(index) {
  const step = flows[currentFlow].steps[index];
  document.querySelectorAll('.flow-step').forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
  document.getElementById('flow-step-label').textContent = `STEP ${String(index + 1).padStart(2, '0')}`;
  document.getElementById('flow-step-title').textContent = step[2];
  document.getElementById('flow-step-description').textContent = step[3];
  document.getElementById('flow-source').href = sources[step[4]];
}
function selectFlow(key) {
  currentFlow = key;
  document.querySelectorAll('[data-flow]').forEach(button => {
    button.classList.toggle('active', button.dataset.flow === key);
    button.setAttribute('aria-pressed', String(button.dataset.flow === key));
  });
  const track = document.getElementById('flow-track');
  track.setAttribute('aria-label', `${flows[key].label}处理步骤`);
  const buttons = flows[key].steps.map((step, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'flow-step';
    const number = document.createElement('span'); number.className = 'step-number'; number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('strong'); title.textContent = step[0];
    const subtitle = document.createElement('small'); subtitle.textContent = step[1];
    button.append(number, title, subtitle); button.addEventListener('click', () => selectStep(index)); return button;
  });
  track.replaceChildren(...buttons); selectStep(0);
}
document.querySelectorAll('[data-flow]').forEach(button => button.addEventListener('click', () => selectFlow(button.dataset.flow)));
selectFlow('voice');
