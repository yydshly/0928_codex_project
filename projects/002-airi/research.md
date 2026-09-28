# AIRI 研究记录

## 阶段性结论与投入决定

截至 2026-09-28，已形成基本理解并完成展示归档。AIRI 是面向虚拟陪伴的 Agent 应用工程；感知、语音、角色与执行能力按具体需求扩展，最终体验依赖整套系统的配合。对桌面女友项目具有后续参考价值，目前暂不深入研究、不启动原版复现或额外集成实验。后续出现具体模块需求时，再核对版本与适配成本。

**库的能力：**把角色对话、语音、Live2D / VRM 表现、屏幕理解与外部工具组织在一起；提供 Minecraft、Factorio、Discord、Telegram 等专用集成。功能分布在主应用、独立服务和实验模块中，需分别配置。

**技术本质：**面向虚拟陪伴的 Agent 应用工程。模型结合人设与上下文作出决策，按需接入感知和执行能力，再以声音、表情和动作呈现结果。陪伴是产品目标，操作是可扩展能力。

**可沉淀技术：**模型与服务适配、语音输入输出流水线、角色动画与口型协调、工具调用与执行反馈、游戏状态读取与技能调度，以及多端共享模块的组织方式。实际复用仍需适配。

**使用场景：**配置后的角色聊天与语音交流、桌面虚拟角色展示；接入视觉后的屏幕相关对话；运行专用服务后的游戏互动与社群聊天；多模态 Agent 原型验证。

**可扩展方向：**桌面陪伴助手、游戏陪伴角色、角色化办公助手、虚拟主播与社群角色。需要按目标补齐长期记忆、主动交互、平台执行器、游戏接口或直播流程，并非全部现成产品。

**对我的意义：**现阶段具有参考价值，保留为后期技术选型与实现参考，暂不继续深入研究或复现。待桌面女友出现明确的视觉、工具执行、游戏或角色表现需求时，再按模块查阅与验证。

## 研究范围与版本

- 原仓库：https://github.com/moeru-ai/airi
- 固定提交：`49c15a6df2a1595dfd0ef2771abfc1229504d075`
- 提交时间：2026-09-27T17:27:10Z。
- 提交标题：`feat(stage-tamagotchi): add a floating chat window beside the character (#2663)`。
- 查阅日期：2026-09-28。
- GitHub latest release 查询返回 `v0.12.0-beta.5`，发布时间 2026-08-29T18:40:52Z。发布包与研究用 main 快照不是同一版本。
- 在线使用手册声明对应 AIRI 0.11.3。网页将源码证据与文档描述分别标明，避免把旧手册状态当作新代码的绝对结论。

本次研究回答：AIRI 提供了哪些能力、如何连接这些能力、3D 角色已经实现什么、哪些效果尚需验证，以及对桌面女友产品的参考价值。未安装或运行原版 AIRI，没有做性能、语音质量、游戏任务成功率或记忆准确性测试。

## 能力与证据

| 能力 | 已核对内容 | 边界 | 一手依据 |
| --- | --- | --- | --- |
| 对话与角色 | 聊天提供商、模型配置；角色卡中的身份、性格、场景与问候语 | 回答质量由模型和上下文影响；角色设定不等于持久记忆 | [聊天文档](https://airi.moeru.ai/docs/en/docs/manual/config/llm)、[Web 手册](https://airi.moeru.ai/docs/en/docs/manual/web/) |
| 语音 | ASR / STT 输入与 TTS 输出可独立配置 | 未验证实时打断、全双工或低延迟指标 | [音频文档](https://airi.moeru.ai/docs/en/docs/manual/config/audio) |
| 虚拟形象 | Live2D、VRM 等模型；眼神、表情、动画与口型相关代码 | 素材质量与最终观感需另外测试 | [VRM 目录](https://github.com/moeru-ai/airi/tree/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/stage-ui-three/src/composables/vrm) |
| 视觉 | 选择窗口 / 显示器，发送捕获帧给视觉模型；可发布给角色 | 当前文档描述为桌面开发调试入口，离开页面停止捕获；不等同于通用电脑操作 | [视觉文档](https://airi.moeru.ai/docs/en/docs/manual/config/vision) |
| Minecraft | 源码服务、Mineflayer 运行时；感知、反射、推理与执行分层 | 固定提交明确处于迁移淘汰路径，计划转为 Fabric mod；没有游戏成功率测试 | [集成 README](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/integrations/minecraft/README.md) |
| Factorio | 外部游戏服务的地址、端口、用户名设置 | 配置保存仅代表字段存在；桌面版不附带可直接部署的 bot 服务 | [Factorio 文档](https://airi.moeru.ai/docs/en/docs/integrations/factorio) |
| 平台与插件 | README 列出 Discord、Telegram 等集成，server-sdk / server-runtime 负责通道；插件设计描述跨设备编排 | Discord bot 需源码运行；插件架构文档状态为 Active design，设计目标不等于完整交付 | [README](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/README.md)、[插件设计](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/plugin-sdk/docs/design/architecture.md) |
| 记忆 | README 提到记忆研究；0.11.3 在线手册标记短期和长期记忆尚未提供 | 未证实新版本完整可用的长期记忆流程；不能将保存会话等同于关系记忆 | [使用手册](https://airi.moeru.ai/docs/en/docs/manual/tamagotchi/setup-and-use/) |
| 多端、本地模型 | Web、Electron 桌面、移动应用与共享模块；Ollama / LM Studio 服务接入 | 各端能力不同；自部署不等于所有服务离线；未测试设备资源消耗 | [开发者说明](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/AGENTS.md)、[LM Studio 配置](https://airi.moeru.ai/docs/en/docs/manual/config/providers/consciousness/lm-studio) |

## 技术本质

项目把输入、角色上下文、模型、语音输出、渲染器与外部服务连接起来。网页、桌面和移动界面共享部分产品逻辑；仓库包含 `core-agent`、`core-character`、`pipelines-audio`、渲染器和服务通道等模块。桌面端为 Electron，Web 端主要使用 Vue / TypeScript。

语音链路可以概括为：声音输入 → 识别文字 → 角色与聊天模型 → 合成声音 → 播放及角色表现。这是原理概括，并非声称所有服务都具有同一种实时协议、延迟或并发行为。

游戏链路可以概括为：环境事件 → 感知归一化 → 反射 / 推理 → 专用行动接口 → 状态反馈。Minecraft 中反射层以状态机处理即时反应，复杂规划再交给推理层；不必让 LLM 决定每一帧的即时动作。

## VRM 源码细查

下列均以固定提交为准，仅确认代码实现，不宣称已完成运行测试：

- [`animation.ts`](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/stage-ui-three/src/composables/vrm/animation.ts)：加载 `.vrma`、转为 VRM 动画片段，包含眨眼和待机眼球运动逻辑。
- [`expression.ts`](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/stage-ui-three/src/composables/vrm/expression.ts)：将情绪映射为表情权重，支持强度、过渡、定时复位，处理表情与语音口型的控制权协调。
- [`lip-sync.ts`](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/stage-ui-three/src/composables/vrm/lip-sync.ts)：VRM 元音表情与音频口型权重之间的映射与更新。
- [`interaction.ts`](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/packages/stage-ui-three/src/composables/vrm/interaction.ts)：建立身体区域交互碰撞体和目标识别。碰撞入口不自动等同于完整的触碰反应产品。

需要实测的体验包括：中文口型匹配、表情是否贴合语义、动作是否连续、倾听和打断时的状态切换，以及资源消耗。人物美术、模型绑定、素材与控制逻辑需要共同评价。

[Issue #1607](https://github.com/moeru-ai/airi/issues/1607) 提出 VRM 动作、表情和状态管理的改进需求。本展示仅把它作为社区需求参考，不视为维护者承诺、已实现功能或正式测评结论。

## 对桌面女友项目的意义

### 补充核查：模型如何真正操作界面和游戏

进一步核对了固定提交中的 `services/computer-use-mcp`。上一版展示主要概括了语音、形象与游戏集成，对电脑操作服务的描述不充分。该服务是独立的 MCP 执行层，需额外运行和连接；MCP 提供工具调用约定，本地执行器才真正发送操作。

| 控制对象 | 具体机制 | 不能直接推定的内容 |
| --- | --- | --- |
| AIRI 自己的角色 | 默认角色提示词约定 ACT 情绪 / 动作指令；渲染层处理表情与动作，音频单独驱动口型 | 输出指令不保证动作素材丰富或观感自然 |
| 浏览器页面 | DOM 工具查询元素、定位、点击和输入；CDP 通道连接 Chrome；不同桥接支持的动作有能力检查 | 随附 Grounding 扩展是只读观察端，不能据此认定所有 DOM 写操作都可用 |
| 桌面软件 | 窗口、截图、辅助功能树 / 浏览器语义供目标定位；macOS 执行器通过 Swift / Quartz CGEvent 发送真实键鼠事件 | 所研究版本的注册器仅内置 dry-run、macos-local、linux-x11，没有 Windows 原生执行器 |
| Minecraft | Mineflayer bot 连接游戏服务器，获得玩家 / 方块 / 背包状态；LLM 选择动作，技能层执行并返回结果 | 这不能证明具有依靠画面和 WASD 操作任意游戏的能力 |

`computer-use-mcp` README 定位为面向 AIRI 的 macOS 桌面编排服务。默认 `dry-run` 不注入输入；`macos-local` 为主后端，`linux-x11` 为旧实验后端。具体动作是否执行取决于后端、权限、策略与连接条件；本次没有运行该服务。AIRI 提供 Windows 客户端，不等于这套执行层已有 Windows 原生控制能力。

浏览器工具的细节值得注意：`register-tools.ts` 中 `browser_dom_click` 会检查桥接连接与 `getClickTarget`、`clickAt` 支持，执行后检查是否有 frame 报告成功。随附 `chrome-extension/README.md` 则明确该扩展只读，Grounding 路径的真实交互走 macOS CGEvent。展示页因此同时说明“工具已存在”和“具体桥接仍需满足条件”，不把两者合并成即装即用的结论。

Minecraft 的 `llm-actions.ts` 存在 `goToPlayer`、`goToCoordinate`、`followPlayer`、`collectBlocks`、`craftRecipe`、`attack` 等动作。以 `followPlayer` 为例，其参数为 `player_name` 和 `follow_dist`，执行体调用 `reflexManager.setFollowTarget`；持续跟随交给反射运行时处理。`goToCoordinate` 使用技能层寻路并返回起止位置、距离、耗时与结果。本页仅展示参数和处理方式，不伪造实际调用或游戏成功案例。

固定提交的一手来源：

- [电脑操作服务 README](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/README.md)
- [执行器注册与平台检查](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/src/server/runtime.ts)
- [macOS 原生键鼠执行器](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/src/executors/macos-local.ts)
- [桌面工具描述](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/src/server/tool-descriptors/desktop.ts)
- [浏览器工具及能力检查](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/src/server/register-tools.ts)
- [CDP 桥接](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/src/browser-dom/cdp-bridge.ts)
- [Grounding 只读扩展](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/services/computer-use-mcp/chrome-extension/README.md)
- [Minecraft 动作清单与执行体](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/integrations/minecraft/src/cognitive/action/llm-actions.ts)
- [角色卡 ACT 约定（在线手册）](https://airi.moeru.ai/docs/en/docs/manual/tamagotchi/setup-and-use/)

### 更具体的投入判断

假设用户已有桌面女友项目完成了聊天、语音与形象，重复组合这些能力的增量较小。这是根据用户描述得出的条件判断，没有声称已审查另一项目源码。

- 若希望提升画质和人物自然度：参考口型、表情与动画控制即可；AIRI 不替代人物美术、动作制作和交互时机设计。
- 若希望角色操作 Windows 软件：学习工具契约、目标定位、执行反馈和记录；需要另做或接入 Windows 执行器，不能直接复用 macOS 后端。
- 若希望角色陪玩 Minecraft：动作目录、反射层和任务反馈具有具体参考价值；Mineflayer 到 Fabric 的迁移会影响实现选型。
- 若希望角色建立长期关系：记忆仍需独立核查，不宜把 AIRI 的研究计划当成已完成产品。

未来如有明确的桌面执行需求，可用“打开指定网页 → 读取标题摘要 → 角色语音反馈”作为最小验证，检查动作是否执行、失败是否回传、角色报告是否与结果相符。此实验尚未实现，也不属于当前阶段的工作计划。

本节为研究判断：

- 借鉴模块组织：模型接入、语音配置、角色管理和外部服务通道。
- 关注体验密度：同一个角色的美术、闲置动作、视线、口型、语气和交互时机，可能比新增多个平台入口更直接影响用户的陪伴感。
- 给 Agent 与角色行为系统明确分工：Agent 输出意图与较高层状态；角色控制负责具体表现、动作协调和即时反馈。
- 将长期记忆视为单独验证的能力：写入、召回、修正、删除和人格连续性均需证据。

没有读取和对照用户另一项目的完整实现，因此不声称桌面女友项目已经优于、等同或落后于 AIRI。

## 本仓库的实验与改动

新增静态研究网页、原创系统结构图、能力切换与链路探索。网页不运行 AIRI，不访问模型、麦克风、摄像头或屏幕；交互内容是基于研究材料的固定说明。没有伪造 AIRI 运行截图或实时数据。

网页验证记录见 [web/QA.md](web/QA.md)。页面的本地验证与原版 AIRI 的能力验证分开记录。

## 素材、代码与许可

原项目根 [LICENSE](https://github.com/moeru-ai/airi/blob/49c15a6df2a1595dfd0ef2771abfc1229504d075/LICENSE) 为 MIT，版权署名为 Neko Ayaka。该许可不能自动覆盖第三方角色、音色等素材。

研究网页代码、中文归纳与 `airi-map.svg` 为本仓库原创；图像为架构示意，不是原项目截图。没有重新分发原仓库代码、模型或人物图片。源码链接固定到所研究提交；在线文档链接可能在研究日期之后更新。

用户选定的引导图 `airi-capability-overview.png` 由内置 imagegen 根据本研究生成，制作提示词保存在 `assets/infographic-prompt.txt`。网页使用本项目内的同图副本；它是独立研究信息图，非官方宣传或原版运行截图。图中的“优先研究”表示未来按需参考的方向，当前投入决定为暂不深入。
