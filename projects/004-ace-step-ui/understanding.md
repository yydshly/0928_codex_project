# ACE-Step UI：完整理解总览

更新：2026-09-28。原库：[fspecii/ace-step-ui](https://github.com/fspecii/ace-step-ui)。UI 研究提交：`a1fdf91829ec6f7b98844f80e323529cd155dbf2`；底层模型研究提交：`ca1e85fe9430179831e6bc6be790c332190a3866`。以下是固定源码、模型文档与本仓库分析的汇总，不代表这两个版本已配套实测。

[![ACE-Step UI 完整理解总览](assets/understanding-overview.png)](assets/understanding-overview.svg)

图由本仓库根据文中固定来源独立绘制；SVG 与 PNG 为同一张图的两种格式。非官方架构图、原版截图或模型运行结果。[网页总览](web/overview.html) · [原尺寸 PNG](assets/understanding-overview.png) · [可缩放 SVG](assets/understanding-overview.svg)。

## 一、这个库到底是什么？

它是一个以 ACE-Step 1.5 为生成引擎的音乐创作 Web 应用，把输入、生成、修改、试听与作品管理放到一个工作台中。

- **应用层贡献**：收集创作意图、组织参数、上传和选择音频、提交/排队/跟踪任务、获取音频文件、管理歌曲和播放，以及连接辅助工具。
- **模型层贡献**：根据条件生成音乐，以及参考引导、Cover、Repaint 等生成式处理。音乐质量和控制上限主要取决于模型、输入、参数及用户的筛选修改。
- **默认部署**：浏览器 + 本地 Node 应用服务 + 独立的 Python ACE-Step 服务，默认模型服务地址为 localhost:8001。可配置模型服务地址，但文件交接、接口版本和模型加载须兼容。
- **不是通用供应商接口**：该版本针对 ACE-Step 的 Gradio / REST 与 Python 后备路径适配。MiniMax 等云模型需要新的接口映射，不能靠更换 URL 自动继承全部操作。
- **当前本仓库状态**：已研究源码、制作交互说明和公开样例试听；没有安装运行原版模型、训练 LoRA 或生成本机音乐。

依据：[配置与安装说明](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/README.md)、[模型适配服务](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts)。

## 二、核心能力：用户能做什么？

| 能力 | 用户目的 | 主要操作 | 结果及约束 |
| --- | --- | --- | --- |
| 从零生成 | 把概念变成可听候选 | Simple 描述主题、风格、情绪；选择纯音乐/人声及语言 | 新音乐候选，具体细节由模型补足 |
| 歌词与风格控制 | 把已有歌词唱出来，细化方向 | Custom 的 Lyrics / Style，配合音乐参数 | 带歌词演唱或纯音乐；需要检查漏唱、断句、编排与贴合度 |
| 参考引导 | 借鉴音色、氛围、编制 | Reference 音频 + 文字描述 | 新作品受参考条件影响；不是精确复制或声音克隆保证 |
| 音频改编 | 沿已有音乐线索改变声音 | Source / Cover + 新风格 + strength | 改编版本；保留与改变的程度需要对照试听 |
| 局部重绘 | 保留大部分并修订局部 | Repaint + 源音频 + 起止秒数 + 目标条件 | 局部重生成版本；边界衔接仍需检查 |
| 候选探索 | 找到更合适的旋律与听感 | Batch size、Bulk generate、seed | 多个候选；数量更多不等于质量更好 |
| 继续创作 | 从已有结果开始下一轮 | Reuse prompt、Use as reference、Cover song | 复用输入或源音频；Reuse 只回填部分字段 |
| 辅助完善 | 整理输入或完成后期 | 格式辅助、Enhance、Thinking、编辑、分轨、视频入口 | 各阶段分别依赖模型或第三方工具 |
| 作品管理 | 保存、挑选、找回、交付 | 播放、收藏、歌单、查询和下载 | 歌曲记录、文件及可继续使用的创作资料 |

依据：[创作面板](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/CreatePanel.tsx)、[作品菜单](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/SongDropdownMenu.tsx)。详细操作和试听标准见 [creation-guide.md](creation-guide.md)。

## 三、底层有哪些模型？“支持”分为不同层次

### 3.1 UI 明确列出的 DiT 模型选项

后端 `/api/generate/models` 有六个已知名称，前端断网/未取到列表时也使用对应后备选项：

| 模型名称 | 理解方式 | 证据与边界 |
| --- | --- | --- |
| acestep-v15-base | 基础模型 | 模型团队列有更广的任务范围；不等于 UI 暴露全部任务 |
| acestep-v15-sft | 经监督微调的模型 | 与 Base 的训练目标及能力表不同 |
| acestep-v15-turbo | 少步数蒸馏模型 | 模型文档常用 8 步配置；不作为本机性能承诺 |
| acestep-v15-turbo-shift1 | Turbo 的 shift 变体选项 | UI 注册名称，加载依赖对应模型服务和文件 |
| acestep-v15-turbo-shift3 | Turbo 的 shift 变体选项 | 无历史选择时该前端状态默认选此项 |
| acestep-v15-turbo-continuous | Turbo continuous 变体选项 | 仅确认注册/选择路径，未实测具体效果 |

模型列表还会扫描本地 checkpoints 下以 `acestep-v15-` 开头的目录；“被列出”不自动证明文件完整、架构兼容或推理成功。服务通过 `/v1/models` 查询加载状态，并在需要时请求 `/v1/init` 切换 DiT。

注意：UI 显示简称如 `1.5B` 对应 Base、`1.5S` 对应 SFT，不能把这里的字母简称误读为参数量。

依据：[后端注册与扫描](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts#L599)、[前端默认与后备列表](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/CreatePanel.tsx#L231)、[模型切换](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L390)。

### 3.2 可选的音乐语言模型 LM

| UI 选项 | 模型团队所列基础模型 | 职责 |
| --- | --- | --- |
| acestep-5Hz-lm-0.6B | Qwen3-0.6B | 元数据、描述/结构规划和音乐 codes |
| acestep-5Hz-lm-1.7B | Qwen3-1.7B | 同类规划任务，规模不同 |
| acestep-5Hz-lm-4B | Qwen3-4B | 同类规划任务，规模不同 |

LM 是可选规划层；DiT + 音频解码仍承担声音生成。Qwen3 是这些专用音乐 LM 的基础，不意味着可任意接入一个普通 Qwen 聊天接口替换。

界面列有 PT / vLLM 运行后端，这些是执行方式，不是新的音乐模型品牌。**LM 下拉菜单不等于主生成链路已经按该选择重新加载 LM**：固定版本的 Gradio 位置参数没有传入 lmModel / lmBackend；格式辅助的 REST 主路径也未传这两个字段，其 Python 后备路径才接收它们。实际使用哪个 LM 必须结合模型服务当前初始化状态核实。

依据：[LM 界面选项](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/CreatePanel.tsx#L2026)、[参数桥](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L133)、[格式服务主/后备路径](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts#L774)、[模型团队模型表](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/README.md#-model-zoo)。

### 3.3 底层模型仓库另外列出的系列和任务

模型团队快照还列有：

- `acestep-v15-xl-base`
- `acestep-v15-xl-sft`
- `acestep-v15-xl-turbo`

XL 使用更大的 DiT；它们不在该 UI 的六项固定注册表里。目录扫描可能让本地模型出现在列表中，但该 UI 与 XL 的完整兼容性未验证。

模型文档将 Extract、Lego、Complete 列为 Base / XL Base 的能力，而 SFT / Turbo 对应栏未标支持；当前 UI 的 Task type 下拉只提供 text2music、audio2audio、cover、repaint。因此：

- 不能把底层文档的所有任务都宣称为 UI 可直接操作。
- UI 的 Demucs 分轨工具与 ACE-Step Base 的模型 Extract 是不同实现途径。
- LoRA 是加载在兼容模型上的适配权重，不是另一个通用音乐云服务。
- MiniMax、Suno 等不是该库已经接入的通用模型选项；如需接入，须另做适配与能力验证。

依据：[底层模型能力表](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/README.md#-model-zoo)、[UI 任务选项](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/CreatePanel.tsx#L2223)。

### 3.4 其他必要组件与底层变体

完整模型管线还包括以下组件，不能只看 DiT 与 LM 两个选择框：

| 组件 | 固定模型仓库中的名称 | 职责与边界 |
| --- | --- | --- |
| 文本编码器 | Qwen3-Embedding-0.6B | 将文字转换成条件表示；与 Qwen3 派生的音乐 LM 职责不同 |
| 官方音频编解码器 | vae，默认 variant 为 official | 音频与连续潜变量互转；最终还原波形 |
| 可选社区 VAE | scragvae → scragnog/Ace-Step-1.5-ScragVAE | 底层下载器有注册；当前 UI 选择/使用链路与效果未验证 |

底层代码同步表另外识别 `acestep-v15-base-sft-fix-inst`、`acestep-v15-turbo-fix-inst-shift3`、`acestep-v15-turbo-fix-inst-shift-continuous`、`acestep-v15-turbo-fix-inst-shift-dynamic`、`acestep-v15-turbo-rl` 等名称。它们属于模型仓库的实现线索，不能计入该 UI 已确认可用的模型清单，也不据名称推断效果。

模型主包列出的默认 LM 为 1.7B，与 UI 的 LM 字段初值 0.6B 不同；这进一步说明应检查实际服务加载状态，而不是只读界面默认值。

依据：[固定模型下载器中的组件清单、变体映射与 VAE 注册](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/model_downloader.py)。

## 四、入口与控制项清单

| 层次 | 已查到的入口 / 控件 | 怎么理解 |
| --- | --- | --- |
| 起点 | Simple、Custom | 模糊想法与明确素材两类输入 |
| 内容 | 歌曲描述、歌词、Style、纯音乐、人声语言、人声性别提示 | 内容与声音方向；性别是文字提示，不是声音克隆 |
| 音乐约束 | 时长、BPM、调性、拍号 | 条件约束，不等于逐音符或精确时间轴编辑 |
| 音频输入 | 上传/选择参考或源音频；Reference / Cover；已有作品继续使用 | 区分声音参考和源音乐结构约束 |
| 编辑任务 | text2music、audio2audio、cover、repaint；重绘起止与 instruction | audio2audio 在参数桥映射为 cover |
| 源约束 | audioCoverStrength、audio codes | 前者影响源条件参与；后者为模型特定的结构表示 |
| 探索控制 | 随机/固定 seed、Batch size、Bulk generate | 探索候选、组织实验；不构成质量保证 |
| 推理设置 | DiT 模型、步数、guidance、shift、ODE/SDE、CFG 区间、自定义时间步、ADG 等 | 进阶选项；随模型与执行路径生效情况不同 |
| LM 辅助 | 格式整理、Enhance、Thinking、温度、Top-K / Top-P、CoT 项、负面条件、LM 模型/后端选择 | 规划与输入辅助；检查实际服务状态及参数是否传递 |
| 个性化 | LoRA 路径、加载/卸载、启用、scale | 需要兼容的适配权重和模型环境 |
| 参数与结果 | 参数 JSON 导入、Reuse prompt、MP3 / FLAC、评分和 LRC 请求开关 | 配置可见不等于每个结果都完整保存与展示 |
| 作品后续 | 播放、收藏、歌单、音频编辑、分轨、配视频、下载 | 从模型候选走向作品整理和交付 |

这些是按源码归纳的入口，不是全部成功实测。原型或商业产品应按用户目标分组，把不相关、未支持或未验证的控制隐藏或说明。

## 五、内部原理：一条应用链路、两路模型条件

### 先从产品角度：可以把整套模型看作黑盒

做音乐产品时，先关注“输入什么 → 能控制什么 → 输出什么 → 效果、耗时和成本如何”。DiT、VAE 等属于 ACE-Step 模型内部组件，日常创作不需要直接操作它们。ACE-Step UI 的价值在于把模型能力组织成可用的创作入口、任务、试听、修改与作品管理。

只有涉及本地部署、显存优化、训练、替换组件或深度排障时，才需要进一步研究模型内部。

### 澄清概念：模型和模型处理的数据不同

| 概念 | 类型 | 作用 |
| --- | --- | --- |
| DiT（Diffusion Transformer） | 负责生成的模型 | 读取条件，多轮更新潜变量，得到音乐的内部表示 |
| 潜变量（latent） | 模型处理的数据 | 用多维数字数组承载声音特征，接近“模型内部的向量表示”；不是音频编号、乐谱或 MIDI |
| VAE（变分自编码器） | 负责表示转换的模型 | 编码器把声音转成潜变量，解码器把潜变量还原为声音波形 |

**DiT 本身就是模型，输入和输出都不叫 DiT。** 生成后的内部数据叫潜变量；VAE 解码后才是能播放的声音波形，再编码成 MP3 / FLAC 文件。VAE 的表示转换也不同于普通文件格式压缩。

- 从零生成的简化路径：文字等条件 + 随机潜变量 → DiT 多轮生成 → 音乐潜变量 → VAE 解码 → 声音波形 → 文件。
- 修改已有音乐的简化路径：已有音频 → VAE 编码 → 源音频潜变量 → DiT 结合新条件生成 → VAE 解码 → 修改后的声音。
- 实际流程还包括可选 LM 规划、条件编码、随机采样和 mask 等；Reference、Cover、Repaint 使用的条件通路不同，不能把示意流程当作所有任务的逐函数执行顺序。

对我们而言，最值得迁移的是输入输出契约与创作流程。如果接 MiniMax 等服务，应重新核对它开放的控制能力，不需要先复刻 ACE-Step 的内部架构。

### 应用链路

1. React 收集输入；音频先上传/选取，再提交参数。
2. Express 创建 SQLite 任务记录，在 Node 内存 Map / 队列中串行执行。
3. `buildGradioArgs` 转换为 51 个位置参数，调用 Gradio `/generation_wrapper`；异常时尝试 Python 后备路径。
4. 模型完成后返回文件信息，应用复制或下载音频。
5. 浏览器每 2 秒查询状态；状态接口检测成功后保存音频和 songs 记录。
6. 前端刷新作品库，提供播放与继续操作。

代码中状态更新、文件保存、歌曲入库不是跨存储的原子操作。队列也未持久化；这影响断线、重启、失败重试与长期服务可靠性。

### 模型链路

- **可选 LM**：把输入进一步规划为音乐元数据、描述和约 5 Hz 的离散 codes。
- **语义条件通路**：文本、歌词、参考音色被编码为向量，经交叉注意力影响 DiT。
- **结构条件通路**：LM codes 或源音频形成结构提示，与 mask 一起作为上下文约束。
- **DiT**：在音频潜变量空间，从噪声迭代得到声音表示；Flow Matching / 采样循环完成更新。
- **VAE**：把约 25 Hz、64 维潜变量解码为 48 kHz 双声道波形，再按输出设置编码文件。

文本编码器与可选生成式 LM 是不同模块。Reference、Cover、Repaint 通过不同条件位置和 mask 配置发挥作用。模型结构依据[技术报告](https://arxiv.org/html/2602.00744v1#S3)及[固定模型实现](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py)；详细源码链路见 [research.md](research.md)。

## 六、最终产出究竟是什么？

| 产出层次 | 可以得到什么 | 不应混淆的地方 |
| --- | --- | --- |
| 核心媒体 | 带人声歌曲或纯音乐、多个候选、参考条件生成结果、Cover/重绘版本；UI 明确选择 MP3 / FLAC | 仍以生成的混合音频为核心；默认不是 MIDI、乐谱、可逐音符编辑的工程或独立乐器轨 |
| 应用记录 | 歌曲标题、歌词/风格、音频地址、时长与音乐元数据、提交参数、用户关联、收藏和歌单 | 元数据可来自输入/模型返回，不等于逐项音频测量；提交参数不一定包含全部实际执行状态 |
| 后期结果 | 音频编辑后的文件、分轨工具输出、配视频工具结果 | 需要相应工具与依赖；不是一次音乐推理必然产生 |
| 条件性结果 | LRC、评分等请求开关 | 主 Gradio 结果解析聚焦音频、详情、状态；完整字幕/评分产物的保存与展示未确认 |
| 创作价值 | 可试听、挑选、修改与交付的候选作品 | 模型生成成功不等于作品达到了用户用途与质量要求 |

依据：[格式选项](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/components/CreatePanel.tsx#L1988)、[生成结果解析](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L536)、[歌曲入库](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts#L367)。本仓库展示的公开音频并非这些流程在本机的新运行结果，媒体出处见 [MEDIA-SOURCES.md](assets/MEDIA-SOURCES.md)。

## 七、从可操作入口到好音乐的路径

以下是本仓库的创作方法建议，没有宣称固定参数配方：

**明确用途 → 选择起点 → 少量候选 → 选基准 → 描述具体问题 → 选择对应修改 → 对照试听 → 达标交付。**

- 只有想法：Simple 探索方向，再进入 Custom 细化。
- 已有歌词：Custom 检查内容、语言、断句与段落，先把演唱做成立。
- 有参考歌：先决定要借声音方向（Reference），还是沿音乐结构改编（Cover）。
- 整体满意：定位问题后选择 Repaint 或后期编辑，保留原版供比较。
- 全局不满意：回到内容、风格、参考或模型选择；不必用局部编辑修补错误方向。

歌曲重点听旋律、记忆点、歌词准确与结构；口播配乐重点听是否抢人声、时长与画面配合；Cover 看保留与改变是否匹配；Repaint 检查局部改善及边界连续性。种子、步数、强度是试验控制，不是“好听”本身。

## 八、对我们做产品的参考价值

最值得借鉴的是把音乐模型控制转译成用户能理解的创作决策。

| 原库提供的起点 | 我们可以进一步设计的体验 |
| --- | --- |
| 输入模式与音频入口 | 按“想法/歌词/参考/已有作品”分流 |
| 参数、源音频、任务类型 | 先问“保留什么、改变什么”，再映射模型字段 |
| 候选作品、播放器、收藏 | 基准版、对照试听、修改理由和时间点批注 |
| Reuse / Cover / Repaint | 完整参数快照、版本关系、回退和针对性修改 |
| 队列、歌曲、文件存储 | 稳定任务恢复、幂等完成落库、成本与等待反馈 |
| 导出和后期工具 | 按真实场景验收，从“生成成功”走到“作品可用” |

若以后使用 MiniMax 等云模型，意图收集、候选筛选、版本管理和交付流程可继续参考；Reference / Cover / Repaint 等能力必须逐项对照目标接口。ACE-Step 的 audio codes、LoRA、DiT / LM 参数不直接移植。本次不对 MiniMax 当前 API 支持作断言。

## 九、证据、许可与尚未完成的验证

- 固定源码能证明入口、参数和处理逻辑存在，不能代替安装与生成效果测试。
- 原库 UI 与底层模型独立演进；目录可发现、选项可见、接口成功、音频满意是不同验证层次。
- UI README 声称 MIT，但研究提交未见独立 LICENSE；模型仓库有 [MIT LICENSE](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/LICENSE)。公开音频、上游动图和第三方工具的权利分别记录，不视为本仓库原创。
- 总览图、网页及分析文字由本仓库独立制作；图中文字依据固定来源归纳，产品建议明确标记。
- 尚未验证：原版安装、模型组合兼容、参数控制准确度、生成音质、实际耗时/显存、参考/Cover/Repaint 效果、辅助工具输出。
