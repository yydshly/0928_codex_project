# ACE-Step UI 研究记录

完整汇总见 [能力、模型、入口、原理与产出总览](understanding.md)，配套 [一张图网页](web/overview.html)。其中新增模型列表分层、文本编码器与 VAE 组件，以及 UI 选项和实际服务生效之间的区别。

当前产品研究重点见 [创作控制入口与分析](creation-guide.md)：从用户素材出发，核对直接生成、歌词、Reference、Cover、Repaint、候选筛选与辅助工具，分析如何组织逐步改善音乐的流程。[交互式创作指南](web/creation.html)。

## 研究问题与版本

问题：这个库相对 ACE-Step 1.5 模型增加了什么？它如何把生成、修改和管理组织成工作流？哪些能力能够直接展示，哪些必须运行模型后才能验证？

- UI：[fspecii/ace-step-ui](https://github.com/fspecii/ace-step-ui)，研究提交 [`a1fdf91829ec6f7b98844f80e323529cd155dbf2`](https://github.com/fspecii/ace-step-ui/tree/a1fdf91829ec6f7b98844f80e323529cd155dbf2)，查阅于 2026-09-28。
- 模型：[ace-step/ACE-Step-1.5](https://github.com/ace-step/ACE-Step-1.5)，文档参考提交 [`ca1e85fe9430179831e6bc6be790c332190a3866`](https://github.com/ace-step/ACE-Step-1.5/tree/ca1e85fe9430179831e6bc6be790c332190a3866)，查阅于 2026-09-28。
- 本次核对 README、包清单、前后端与模型关键源码及技术报告，未安装或运行两套原版程序。

## 能力与证据

| 能力 | 归属与依据 | 本次验证范围 |
| --- | --- | --- |
| 文字或歌词生成歌曲、纯音乐；BPM、调性、时长、种子、批量变体 | [UI README 功能表](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/README.md#-features)；[生成路由参数](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts) | 文档与代码存在入口；音质及参数效果未实测 |
| 参考音频、Cover、Repaint | [生成参数与任务类型](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts)；[UI README](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/README.md) | 未上传音频或执行生成 |
| 歌曲库、收藏、歌单和播放器 | [UI README](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/README.md)；[歌曲与歌单路由](https://github.com/fspecii/ace-step-ui/tree/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes) | 源码与文档核对，未运行界面 |
| 音频剪辑、分轨、配视频 | [UI README 内置工具](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/README.md#-built-in-tools) | 工具入口说明；输出质量未验证 |
| LM 规划与 DiT 音频生成 | [ACE-Step 官方中文教程](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/docs/zh/Tutorial.md) | 属于模型原理，不是 UI 的自研模型 |

## 技术链路

1. 浏览器使用 React/TypeScript 收集创作意图并呈现作品；实际依赖版本见 [前端 package.json](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/package.json)。README 的 React 18 描述与包清单的 React 19 不一致，以固定提交中的代码为准。
2. Express 服务接收生成参数，写入 SQLite 任务记录，再交由进程内队列执行；浏览器通过状态接口查询结果。参见[生成路由](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts)与[队列/模型服务](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts)。
3. 服务优先通过 Gradio `/generation_wrapper` 调用 ACE-Step；代码保留 Python 启动后备路径。Gradio 返回数据按位置解释，可能随上游接口变化而需要适配。参见[模型服务](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts)与[Gradio 客户端](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/gradio-client.ts)。
4. ACE-Step 1.5 的可选 LM 规划音乐元数据、歌词、描述和语义 codes；DiT 执行音频生成。参考音频等输入可承担部分规划约束。此部分由[模型团队的教程](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/docs/zh/Tutorial.md)说明。

## 本仓库的展示实验

- 自制 `assets/capability-map.svg` 和 `web/` 中的中文静态展示页。能力切换、请求追踪和原理解读使用研究文本；重绘范围交互计算示意帧索引。无后端、模型调用和音频素材。
- 展示重点是“能做什么、由哪一层实现、需要什么条件、还有什么未验证”。页面不提供假生成按钮或虚构的播放结果。
- 展示网页与原版 ACE-Step UI 无代码共享，原版运行和生成质量仍待独立测试。

## 使用场景与扩展判断

- 适用：本地歌曲草稿、歌词和曲风探索、视频/游戏配乐初稿、基于参考音频的迭代以及生成作品归档。
- 可扩展：模型 API 适配层、创作版本关系和参数溯源、任务重启恢复、中文化创作模板，以及多人使用前的认证与访问隔离。
- 代码中的队列保存在内存；服务端默认监听所有网卡并有固定的默认 JWT 密钥。若要从本地个人工具扩展为公网服务，应重新设计队列持久化和访问控制。[队列代码](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts)、[服务入口](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/index.ts)、[配置](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/config/index.ts)。

## 限制、许可与后续

- 未运行原版，未验证实际音质、速度、显存占用、各编辑任务成功率和平台兼容性。README 中与商业产品的比较是原作者表述，不作为本仓库实测结论。
- UI README 声称 MIT；固定提交根目录未见独立 LICENSE 文件，README 的 LICENSE 链接也未能取得文件。复用 UI 源码前需核实。ACE-Step 模型仓库的 [LICENSE](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/LICENSE) 是 MIT；第三方素材及音频另行核对。
- 本展示尚未发布公网地址。未来如发布，按仓库约定使用 `/0928_codex_project/004-ace-step-ui/` 子路径；只在实际部署并核验后加入公开链接。
- 如继续深入，先固定 UI/模型兼容组合，在可记录硬件信息的设备上分别验证文字生成、参考音频和局部重绘，并保存真实输出及其权限来源。

## 深入：系统架构与执行顺序

本节在 2026-09-28 补充，依据同一 UI 提交及上述模型提交的源码。两个快照分别用于研究，不代表已经验证兼容的安装组合。模型实现说明以 PyTorch Turbo 路径为主；Base、MLX 和不同采样器存在分支，不能把某一分支等同于全部运行方式。

### 三个运行边界

| 边界 | 主要职责 | 数据 |
| --- | --- | --- |
| 浏览器（React / TypeScript / Vite） | 收集参数、显示临时歌曲卡、查询任务、刷新和播放作品 | 表单状态、用户 token、临时任务引用 |
| Node / Express 应用服务 | 验证输入与任务归属、调度模型、适配接口、保存作品 | SQLite 元数据、进程内队列与 Map、本地音频文件 |
| Python / ACE-Step 1.5 | 规划、条件编码、音频潜变量生成、VAE 解码 | 模型权重、张量、生成音频 |

音频通过文件地址和文件内容在进程之间交接；模型生成不在 React 内执行。应用服务优先调用 Gradio，无法连接或调用报错后尝试 Python 子进程后备路径。具体后备所需的环境仍未实测。

### 从生成请求到歌曲记录

1. **输入与上传**：[生成路由](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts#L212) 接收参数；音频先通过上传接口保存，生成请求携带地址。桥接代码在简单模式使用 songDescription，在自定义模式使用 style；纯音乐会清空歌词。
2. **两种任务 ID**：路由创建本地 UUID，向 generation_jobs 写入用户、参数、queued 状态；generateMusicViaAPI 创建内存执行任务，通过 acestep_task_id 关联。这个字段在本路径中关联 UI 服务的执行 Map，不能只因命名便认定它是远端模型服务器返回的 ID。
3. **串行调度**：[processQueue](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L422) 用 jobQueue 数组及 isProcessingQueue 标志防重入，每个任务 await 完成后再出队。activeJobs 是进程内 Map。任务表存在并不等于执行队列已持久化。路由入队后把数据库状态写为 running，而提交响应仍为 queued；后续查询重新同步内存状态。
4. **接口转换**：[buildGradioArgs](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L133) 实际返回 51 个位置参数，索引为 0–50；相邻注释写 50，不作为实际参数数量。文件通过 Gradio 包装传入。thinking 控制 Think；enhance 或 thinking 开启时才允许 CoT 元数据、描述、语言增强。audio2audio 在桥接中映射为 cover。
5. **模型调用**：[processGenerationViaGradio](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/services/acestep.ts#L509) 调用 predict('/generation_wrapper', args) 并等待完整结果。优先读返回数组索引 8 的文件列表，缺失时扫描 0–7；9、10 按详情与状态处理。音频同机可复制，否则按 URL 下载。该协议依赖参数及结果的位置，升级需要核对。
6. **查询与落库**：[状态路由](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/server/src/routes/generate.ts#L367) 校验任务所有者，从 Map 获取状态，用旧状态作为 UPDATE 条件。首先更新成功的查询请求继续通过 storage provider 保存音频、写入 songs。这里的 GET 会触发写入，而不是纯读取。
7. **前端完成**：[beginPollingJob](https://github.com/fspecii/ace-step-ui/blob/a1fdf91829ec6f7b98844f80e323529cd155dbf2/App.tsx#L699) 每 2 秒查询，成功后清理临时任务并 refreshSongsList。失败或查询异常也会清理；10 分钟超时结束前端等待，不等于取消模型推理。

### 数据一致性与恢复的实际边界

- 乐观更新条件用来避免并发轮询重复创建歌曲；它不使“任务状态更新、音频写入、songs 插入”成为一个原子事务。
- 基于控制流的推断：浏览器不再查询时，模型任务可以继续执行，但该状态接口中的最终歌曲建档可能延后；进程重启时内存执行状态丢失。
- getJobStatus 对不存在的 Map 项返回失败。运行中的 ETA 包含固定 180 秒基准的估算，不应解释成 GPU 实时测量。
- 后备推理在 Gradio 报错后触发；若远端已开始执行但回传失败，是否重复执行需要真实故障测试。扩展时应增加失败分类、任务幂等标识与对账。
- 上述推断来自源码，未注入故障验证。推荐的改进是独立 worker 完成落库、持久化队列、重启恢复与状态查询解耦；本仓库未实施这些改造。

## 深入：音乐模型内部表示与计算

### 两条条件通路

**语义通路**：描述通过文本编码器；歌词先取词嵌入，再经过歌词编码器；参考音频通过 VAE 和音色编码器。AceStepConditionEncoder 投影并打包这些向量，作为 DiT 交叉注意力读取的序列。

**结构通路**：可选 LM 预测音乐 codes，或者源音频潜变量经音频 tokenizer 产生量化表示。prepare_condition 反量化、detokenize 到结构提示，在相应模式替换源潜变量，再与 chunk mask 拼成 context_latents。两路一起约束 DiT 的更新。

依据：[输入嵌入](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/core/generation/handler/conditioning_embed.py)、[AceStepConditionEncoder](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py#L1513)、[prepare_condition](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py#L1654)。

可选生成式 LM 与文本编码器承担不同职责：前者生成规划内容，后者编码已有输入。关闭 thinking 不会删除 DiT 对文字的处理。LM 的 codes 是音乐的离散表示，不是 MP3 字节或直接可播的波形。

### 表示尺度与推理循环

模型团队的[技术报告 §3](https://arxiv.org/html/2602.00744v1#S3)说明：1D VAE 处理 48 kHz 双声道波形，潜变量为 25 Hz、64 维；音频 tokenizer 将连续表示压成 5 Hz 离散 codes，连接语言规划与声音合成。这里的 Hz 分别表示内部时间帧率，不能等同音频采样率。

DiT 在潜变量空间计算。训练通过 Flow Matching 学习噪声与干净数据之间的速度场；推理从噪声开始，依据当前时间与条件预测速度。源码的 Euler / ODE 分支更新可概括为：

`x_next = x_current − v × (t_current − t_next)`

这是该分支的核心更新式，不包括 Heun、SDE、可选修正或重绘注入。对应 [generate_audio](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py#L2189)。步数是潜变量更新次数，时长决定序列长度，seed 影响初始噪声；三者不能互相替代。

最终调用 [tiled_decode](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/core/generation/handler/vae_decode.py#L16)，把潜变量还原为音频。分块解码使用重叠窗口控制显存峰值，存在 MLX、MPS 与 CPU 后备分支。具体分支速度未实测。

Turbo 的少步数能力来自专门训练与蒸馏；技术报告 §4.1 描述约 50 步到 8 步的路线。减少普通模型步数不自动得到相同质量。报告是训练原理来源，不能代替本机性能证据。[报告](https://arxiv.org/html/2602.00744v1#S4.SS1)采用 CC BY 4.0；本页为归纳说明，没有复制论文插图。

### 参考、Cover 和 Repaint 如何不同

| 任务 | 主要输入位置 | 内部处理 | 含义 |
| --- | --- | --- | --- |
| 参考音色 | referenceAudioUrl，Gradio 索引 10 | VAE → timbre encoder → 条件序列 | 引导音色/风格；不代表按时间复制原波形 |
| Cover | sourceAudioUrl，索引 13；或 audioCodes，索引 14 | 源潜变量量化到结构表示，再作为生成上下文 | 提供旋律、节奏等线索，并允许声音重新合成 |
| Repaint | 源音频 + 起止秒数（索引 15/16） | 区间转帧索引、构造 mask、保留区间注入、可选边界混合 | 对指定范围施加重新生成约束 |

Cover 的具体强度实现：[循环](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py#L2091)用 `int(num_steps × audio_cover_strength)` 决定 Cover 条件参与的步骤数，之后可切换到 non-cover 条件。它不是将原音频与新音频按音量比例混合；结构保留程度仍需试听。

Repaint 的[掩码构造](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/core/generation/handler/conditioning_masks.py#L48)以 `int(seconds × sample_rate // 1920)` 换算帧索引，并进行边界约束。选中区间为 True，允许生成；源上下文中对应区间可替换为静音潜变量。

推理的指定前段步骤对保留区域重新注入与当前噪声水平匹配的源潜变量，之后可做边界混合。实际调用受 repaint_injection_ratio、repaint_crossfade_frames 等条件控制，并非无条件在全部步骤注入。见[模型循环](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/acestep/models/turbo/modeling_acestep_v15_turbo.py#L2207)。该 UI 的 51 项参数桥没有暴露这两项，因此不能把模型新版控制项都宣称为 UI 已有操作入口。

展示页的 12 秒掩码交互是本仓库制作的数学说明：25 Hz 共 300 帧，默认 [4,8) 秒对应 [100,200) 帧；未加载源音频或真实潜变量，不产生编辑结果。

## 对使用与扩展的具体启发

### 补充：直接呈现真实效果

2026-09-28，根据“直接呈现效果”的反馈，将首页改为三个官方真实音频播放器（中文歌曲、纯音乐、重金属）及 UI 原作者演示动图。音频通过官网流式播放，未下载到仓库；原版模型仍未在本机运行。此前“无音频素材”的记录描述加入试听前的版本，当前媒体来源、版本和许可边界见 [MEDIA-SOURCES.md](assets/MEDIA-SOURCES.md)。当前没有 Cover / Repaint 的真实前后对照，不用静态交互冒充其效果。

本机只读硬件检查：NVIDIA GeForce RTX 4070 Laptop GPU，8188 MiB 显存。这表明有进一步评估本地推理的条件，但本次没有安装、下载权重或以公开样例推定本机速度。

- **做创作产品**：优先学习表单 → 任务 → 音频文件 → 歌曲记录的分层；接入经过验证的稳定模型契约。
- **做算法研究**：直接读条件编码、采样循环与 VAE，在固定硬件和模型下保存真实音频对照。
- **做长期作品管理**：在已有 generation_params 之外补父作品、模型版本、实际 seed、编辑区间、文件哈希，形成 Cover / Repaint 的版本关系。
- **做可靠服务**：重点补齐执行状态持久化、完成落库、重试与幂等；界面上的进度、任务的状态和音频是否可用应分别观测。
