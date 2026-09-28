# 开源项目研究索引

这里记录对开源项目的源码研究、原版复现与独立演示。每个子项目都注明研究版本、图片来源、实际验证结果和仍存在的限制。

## 子项目索引

编号按加入顺序分配，从 `001` 开始。编号一经使用便保持不变，后续研究更新原条目即可。

| 编号 | 当前研究 | 摘要描述 | 源库 | 关联网页 | 进度 |
| :---: | --- | --- | --- | --- | --- |
| 001 | [Storm-Breaker 能力与原理研究](projects/001-storm-breaker/README.md) | 主题网页读取部分环境信息，在授权后请求位置与音视频；PHP 回传并由面板展示。扩展场景需另行开发。 | [ultrasecurity/Storm-Breaker](https://github.com/ultrasecurity/Storm-Breaker) | [在线研究网页](https://yydshly.github.io/0928_codex_project/001-storm-breaker/) | 已发布；原版已复现；音频落盘未证实 |
| 002 | [AIRI 能力与角色交互研究](projects/002-airi/README.md) | 面向虚拟陪伴的 Agent 应用工程；按需组合对话、语音、角色、视觉及执行工具。沉淀接入、表现和执行反馈思路，后期按需参考。 | [moeru-ai/airi](https://github.com/moeru-ai/airi) | [在线研究网页](https://yydshly.github.io/0928_codex_project/002-airi/) | 已发布；归档参考；暂不深入；原版未运行 |
| 003 | [Grok Bot Field Notes 工程经验与使用参考](projects/003-grokbot-field-notes/README.md) | Agent 工程案例与模板资料库：以规则、职责与验证反馈组织工作，可转化为验证工具、任务约定和技能；适用开发、研究与业务流程。有经验者新增价值有限，归档后按需参考。 | [unicodef1wn/grokbot-field-notes](https://github.com/unicodef1wn/grokbot-field-notes) | [本地研究网页](projects/003-grokbot-field-notes/web/index.html) | 网页源码已建立；公网未发布；原平台未运行 |

### 001 · Storm-Breaker

[![Storm-Breaker 一图看懂：模块与数据流、环境信息和位置及音视频能力、权限边界、场景探索与产品价值](projects/001-storm-breaker/assets/storm-breaker-understanding.svg)](projects/001-storm-breaker/assets/storm-breaker-understanding.svg)

图：本仓库根据[所研究的原仓库提交](https://github.com/ultrasecurity/Storm-Breaker/tree/4d7235104870ec0224f445fd905c98f22a105426)与本机虚拟设备测试独立绘制；不是原项目截图。点击图片可放大查看。

#### 基础能力与原理

Storm-Breaker 以五套主题网页引导访问，读取部分浏览器环境信息；在浏览器授权后请求精确位置、摄像头或麦克风。前端将结果提交给 PHP 接收脚本，再由管理面板呈现。它没有附近的人匹配、访客间位置共享或实时协作功能。

#### 场景探索与研究价值

授权环境中的安全教育可以直接演示权限边界。现场记录、限时位置共享和远程协作只是基于位置与音视频的扩展方向，需按具体需求设计同意、时效、撤销、访问控制和可靠保存。研究这个库的价值是看懂浏览器权限与前后端数据流，并用源码和实测判断产品设想是否有依据。

本机原版复现已验证文本、模拟位置和虚拟摄像头图片的回传；音频仅出现面板通知，文件落盘未证实。原版代码与名称归原作者及贡献者所有，所研究版本未见明确 LICENSE；图片来源及使用限制见[子项目说明](projects/001-storm-breaker/README.md#图片参考与许可)。

[原仓库](https://github.com/ultrasecurity/Storm-Breaker) · [详细研究](projects/001-storm-breaker/research.md) · [原版运行说明](projects/001-storm-breaker/README.md#原版效果) · [在线研究网页](https://yydshly.github.io/0928_codex_project/001-storm-breaker/)

### 002 · AIRI

[![AIRI 能力总览：技术本质、支持能力、可沉淀技术、产品方向和参考价值](projects/002-airi/assets/airi-capability-overview.png)](projects/002-airi/assets/airi-capability-overview.png)

图：本仓库依据 [AIRI 固定研究提交](https://github.com/moeru-ai/airi/tree/49c15a6df2a1595dfd0ef2771abfc1229504d075) 整理，使用内置 imagegen 生成并核对，非官方宣传或原版运行截图。扩展产品是后续开发方向。

**库的能力：**把角色对话、语音、Live2D / VRM 表现、屏幕理解与外部工具组织在一起；提供 Minecraft、Factorio、Discord、Telegram 等专用集成。功能分布在主应用、独立服务和实验模块中，需分别配置。

**技术本质：**面向虚拟陪伴的 Agent 应用工程。模型结合人设与上下文作出决策，按需接入感知和执行能力，再以声音、表情和动作呈现结果。陪伴是产品目标，操作是可扩展能力。

**可沉淀技术：**模型与服务适配、语音输入输出流水线、角色动画与口型协调、工具调用与执行反馈、游戏状态读取与技能调度，以及多端共享模块的组织方式。实际复用仍需适配。

**使用场景：**配置后的角色聊天与语音交流、桌面虚拟角色展示；接入视觉后的屏幕相关对话；运行专用服务后的游戏互动与社群聊天；多模态 Agent 原型验证。

**可扩展方向：**桌面陪伴助手、游戏陪伴角色、角色化办公助手、虚拟主播与社群角色。需要按目标补齐长期记忆、主动交互、平台执行器、游戏接口或直播流程，并非全部现成产品。

**对我的意义：**现阶段具有参考价值，保留为后期技术选型与实现参考，暂不继续深入研究或复现。待桌面女友出现明确的视觉、工具执行、游戏或角色表现需求时，再按模块查阅与验证。

当前电脑操作服务主要面向 macOS，不能从 Windows 客户端支持推定 Windows 执行器已就绪；游戏需逐款接入，长期记忆与陪伴质量未实测。原项目代码采用 MIT 许可，角色模型、声音与其他素材需单独核查。

[原仓库](https://github.com/moeru-ai/airi) · [详细研究](projects/002-airi/research.md) · [在线研究网页](https://yydshly.github.io/0928_codex_project/002-airi/) · [运行与发布说明](projects/002-airi/web/README.md)

### 003 · Grok Bot Field Notes

[![Grok Bot Field Notes 全量理解引导图：能力、范围、产品、沉淀、个人价值与使用路线](projects/003-grokbot-field-notes/web/assets/understanding-guide.svg)](projects/003-grokbot-field-notes/web/assets/understanding-guide.svg)

图：本仓库依据[固定研究提交](https://github.com/unicodef1wn/grokbot-field-notes/tree/02780c04ef5f412b28573bce6f82afd15d195d1f)及本次讨论独立绘制；覆盖范围、成果与价值判断，非官方图片或产品截图。

**库的能力：**提供三天产品开发笔记、失败案例、Agent 工作规则、验证与编排指南、岗位模板、业务流程和成本观察，帮助理解开发过程、设计协作与验收。它交付的是第三方资料与配置素材，不能直接运行 Grok Bot 或复现游戏。

**技术本质：**把工程经验写成 Agent 与人共享的目标、职责、事实来源、工具使用和完成标准；由现有 Agent 平台执行，由项目自己的检查器验证，再将反馈更新到规则。核心是工作约定与反馈机制，未提供新模型、推理算法或运行平台。

**可沉淀技术：**可转化为项目规则与任务输入输出约定、验证命令与证据采集、角色交接与异常升级、PR 验收记录、例行任务成本审查，以及经验证的技能封装。原库主要提供原则和样例；具体工具、程序、权限及测试需要自行适配实现。

**使用场景：**适用于 Agent 辅助编码与缺陷修复、开源项目研究和网页交付、产品原型与上线验收、小规模多 Agent 协作，以及客服、销售、营销等重复工作流程的设计。业务演示需重新接入真实资料和工具，不能直接视为已验证经营效果。

**可扩展方向：**可进一步做成项目验证工具包、开源研究助手技能、带状态记录与人工门槛的协作流程，或工程事故与评估知识库。需要分别补齐检查器、数据接入、执行与重试机制、权限控制及持续评估；这些是我们的迁移方向，尚未实现。

**对我的意义：**对已有工程经验的你，新增方法有限；价值主要在具体案例、模板整理和遗漏检查。当前适合归档参考，降低持续深入优先级。以后遇到研究、Agent 协作或交付验证的问题，再按需查阅、适配并验证，无需整体照搬。

**案例与验证边界：**Grok Bot 是团队使用的工具，Thursday Arena 是直播中做出的自动对战游戏，本库是第三方对开发直播与岗位演示的整理。原库采用 MIT 许可；引导图为本仓库自绘。未运行原平台，直播数字未独立复算，尚未安装技能或实现扩展方向。

[原仓库](https://github.com/unicodef1wn/grokbot-field-notes) · [详细研究](projects/003-grokbot-field-notes/research.md) · [本地研究网页](projects/003-grokbot-field-notes/web/index.html) · [运行与部署约定](projects/003-grokbot-field-notes/web/README.md)

## 仓库结构

```text
projects/
  001-storm-breaker/
    README.md          # 项目概览与来源
    research.md        # 研究记录、复现和结论
    assets/            # 自制图片或注明来源的研究截图
    web/               # 可选：独立网页的源码
  002-airi/            # AIRI 能力地图、角色表现与交互研究
  003-grokbot-field-notes/ # Thursday Arena 产品与直播问题、Agent 工作方法研究
templates/project/     # 新子项目模板
docs/                  # 索引与网页发布约定
```

子项目可以采用不同技术栈，彼此独立。多个网页使用各自的部署子路径；目录命名、图片使用和发布约定见[项目维护说明](docs/CONVENTIONS.md)。

## 添加研究项目

1. 取下一个未使用的三位编号，并为目录取简短的英文名称，例如 `projects/002-example/`。
2. 复制 [子项目模板](templates/project/README.md) 和 [研究记录模板](templates/project/research.md)，填写真实来源与研究内容。
3. 将图片放在该项目的 `assets/` 中，写明图片来源或制作方式。
4. 在上方索引按编号增加一行，并在索引后添加对应图文摘要；有演示时补上链接。
