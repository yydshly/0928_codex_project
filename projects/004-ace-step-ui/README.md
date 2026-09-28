# 004 · ACE-Step UI 音乐创作能力研究

ACE-Step UI 为 ACE-Step 1.5 提供音乐生成、修改、管理与播放的浏览器工作台。本子项目用独立的静态展示页解释其能力和工作流程；尚未在本机运行原版模型；首页现已在线引用三段模型团队公开音频与 UI 原作者演示动图，可直接试听和观看。

| 项目资料 | 链接或说明 |
| --- | --- |
| 界面原仓库 | [fspecii/ace-step-ui](https://github.com/fspecii/ace-step-ui) |
| 模型原仓库 | [ace-step/ACE-Step-1.5](https://github.com/ace-step/ACE-Step-1.5) |
| 原作者 | ACE-Step UI 作者及贡献者；ACE-Step 模型团队及贡献者 |
| UI 研究提交 | [`a1fdf91829ec6f7b98844f80e323529cd155dbf2`](https://github.com/fspecii/ace-step-ui/tree/a1fdf91829ec6f7b98844f80e323529cd155dbf2) |
| 模型文档参考提交 | [`ca1e85fe9430179831e6bc6be790c332190a3866`](https://github.com/ace-step/ACE-Step-1.5/tree/ca1e85fe9430179831e6bc6be790c332190a3866) |
| 查阅日期 | 2026-09-28 |
| 研究状态 | 已核对原项目文档与关键源码；原版未在本机运行 |
| 独立展示 | [web/index.html](web/index.html) · [运行说明](web/README.md) |
| 在线研究网页 | [完整总览](https://yydshly.github.io/0928_codex_project/004-ace-step-ui/) · [试听与技术研究](https://yydshly.github.io/0928_codex_project/004-ace-step-ui/web/index.html) · [创作指南](https://yydshly.github.io/0928_codex_project/004-ace-step-ui/web/creation.html) |
| 完整总览 | [一张图看懂](web/overview.html) · [完整理解说明](understanding.md) |
| 详细研究 | [research.md](research.md) · [创作入口指南](web/creation.html) |

## 六项摘要

- **能力**：生成、参考、改编、局部重绘，以及试听、作品管理与后期工具。
- **本质**：默认连接本地 ACE-Step 1.5 的产品应用层；模型内部含 DiT、VAE 等，产品开发可先按输入输出黑盒使用。
- **模型**：UI 六个 DiT 选项、三个专用音乐 LM；文本编码器与 VAE 为配套组件，XL 等额外组合待验证。
- **入口**：Simple、Custom、Reference、Cover、Repaint、Batch / Reuse，另有格式辅助、LoRA、参数与推理控制。
- **输出**：人声歌曲或纯音乐、多个候选和编辑版本，主文件 MP3 / FLAC，附歌曲记录；后期衍生结果依赖工具。
- **价值**：学习模型能力的产品化、创作决策和迭代流程；换模型时重新匹配 API 能力。

## 看点

[![ACE-Step UI 完整理解总览：能力、操作入口、模型、内部原理、产出与产品参考](assets/understanding-overview.png)](assets/understanding-overview.svg)

图为本仓库依据上述固定提交**独立绘制的结构示意**，不是原项目界面截图，也不是模型运行结果。

**先看完整总览：**[网页与可放大图](web/overview.html) · [完整理解说明](understanding.md) · [PNG](assets/understanding-overview.png) · [SVG](assets/understanding-overview.svg)。汇总我们对定位、能力、模型、入口、原理、产出和产品价值的理解；区分 UI 的六个内置 DiT 选项、三个可选 LM 与模型仓库中尚未验证 UI 兼容的 XL 系列，并说明辅助输出与实际运行边界。

- **创作入口**：描述或歌词、风格、纯音乐、BPM、调性、时长、种子与多变体参数。
- **迭代手段**：参考音频、Cover 和 Repaint 把“生成一次”变成“试听、调整、再生成”的过程。
- **作品工作台**：任务进度、歌曲库、播放、收藏和歌单；音频剪辑、分轨和配视频作为辅助工具。
- **技术分工**：React 界面与 Express 服务处理交互、任务及存储；ACE-Step 1.5 的可选 LM 和 DiT 负责音乐规划与音频生成。

静态展示页含可切换的能力卡、三层系统架构、六步请求追踪、LM / 条件编码 / DiT / VAE 原理，以及参考、Cover、Repaint 的内部实现。可拖动重绘范围，观察秒数到潜变量帧和 mask 的换算。各关键环节链接到固定版本源码；说明性交互不会请求模型或生成音乐；首页播放器会按需读取官方音频，演示动图从原仓库加载。

建议先在首页试听结果、观看原版动图，再看“架构”和“原理”。研究文档补充任务 ID、内存队列、Gradio 位置参数、查询触发入库、Flow Matching、条件编码与边界混合等细节，并明确区分源码事实、控制流推断和待开发扩展。

页面预览（首屏已更新为试听版；完整截图保留此前架构版）：[桌面首屏](assets/research-page-preview.png) · [桌面完整截图](assets/research-page-desktop.png) · [手机完整截图](assets/research-page-mobile.png)。三张图均为本仓库独立网页在本机浏览器中的真实渲染，不是 ACE-Step UI 原版截图。交互与布局检查见 [QA 记录](web/QA.md)。

技术详情：[系统架构截图](assets/architecture-preview.png) · [重绘掩码截图](assets/repaint-mask-preview.png) · [手机重绘掩码](assets/repaint-mask-mobile.png)。均于 2026-09-28 使用本机 Edge 渲染本页截取，为本仓库独立研究图示，未包含原版生成结果。

## 对本仓库的价值

当前研究重点是**可操作的创作入口，以及如何组织成逐步改善作品的产品流程**。先读 [创作控制指南](web/creation.html) 或 [分析记录](creation-guide.md)：直接生成、歌词与风格控制、Reference、Cover、Repaint、候选筛选，以及 AI 辅助、LoRA、音频编辑等补充入口。

每项都回答“用户手里有什么、原库在哪里操作、控制什么、生成后听什么、下一步怎么改”。产品建议包括目标分流、保留与改变、对照试听、完整参数快照和版本关系；这些是本仓库分析，未声称原库已完整实现。

这个案例适合研究“开源模型如何包装成可持续使用的创作产品”。可以借鉴参数组织、任务状态、生成结果管理，以及参考音频到局部修改的交互流程。若以后要做真实演示，应先验证所选模型与 UI 提交是否兼容，再记录硬件、生成参数、耗时、音质和实际输出；当前页面不声称完成这些验证。

## 来源、许可与边界

- UI README 列出上述功能，部分功能依赖独立安装的 ACE-Step 1.5、FFmpeg 或可选第三方服务。模型版本和硬件会影响可用性。
- UI README 声称 MIT，但本次查看的固定提交根目录未见独立 LICENSE 文件。复用 UI 源码或商业发布前，应向原作者核实许可文本。ACE-Step 1.5 原仓库有 [MIT LICENSE](https://github.com/ace-step/ACE-Step-1.5/blob/ca1e85fe9430179831e6bc6be790c332190a3866/LICENSE)。第三方音频、素材和工具须单独核对。
- 本仓库制作说明性 SVG 与展示网页，并在线引用官方公开音频和原作者 demo.gif；未将远程媒体下载到仓库，也未加载模型权重。音频和动图不属于本仓库原创素材。
- `assets/research-page-preview.png`、`assets/research-page-desktop.png` 与 `assets/research-page-mobile.png` 于 2026-09-28 使用本机 Edge 浏览器渲染 `web/index.html` 截取；只证明本仓库网页外观，不证明原版软件运行效果。
- 原项目名称、代码和模型归各自作者与贡献者；本项目的解读和网页设计属于本仓库的独立研究。

## 发布记录

2026-09-28，研究网页经 GitHub Pages 发布。首个发布提交 `758c0ff`，部署 [36392806828](https://github.com/yydshly/0928_codex_project/actions/runs/36392806828) 成功。公开页面、引导图及研究文档均验证 HTTP 200，浏览器确认跳转、模型说明与图片加载正常。网页发布不代表原版音乐模型已经部署。
