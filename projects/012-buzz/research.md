# Buzz 研究记录 · 源码与本机复现

## 研究问题

获取上游固定版本，展示界面并验证私密频道、身份与讨论串；区分官方展示、源码可见能力与本机实测。

## 讨论汇总

我们最终把 Buzz 理解为三层：**通信底座负责房间、身份权限与消息推送；Agent 接入负责触发和执行调度；业务执行由模型、工具与外部系统完成。** 完整的身份识别、响应控制、多 Agent 交互和证据边界已整理到 [understanding.md](understanding.md)。

## 来源与版本

- 原仓库：<https://github.com/block/buzz>
- 研究提交：[`ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43`](https://github.com/block/buzz/tree/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43)
- 获取方式：2026-09-28 从 GitHub codeload 下载该提交的完整 ZIP，约 46 MB；SHA-256：`87062D975ABD224F159500A33D3369195D2DC8AFB11832BEAABA0F194D1C557B`。
- 许可证：上游根目录 `LICENSE` 为 Apache License 2.0；本项目保存副本 [web/UPSTREAM-LICENSE.txt](web/UPSTREAM-LICENSE.txt)。

## 已核对的效果

上游 README 直接嵌入四张桌面应用截图。本仓库原样复制到 `web/assets/` 并在 [展示页](web/index.html) 中提供切换和原图入口：

| 截图 | 上游来源 | 可见内容 |
| --- | --- | --- |
| `channel-thread.png` | [原图](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots/channel-thread.png) | 人与 Agent 在同一频道对话 |
| `channel-agents.png` | [原图](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots/channel-agents.png) | 工程频道中的多人和多 Agent 讨论 |
| `create-channel.png` | [原图](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots/create-channel.png) | 频道搜索、筛选、创建入口 |
| `media-comments.png` | [原图](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots/media-comments.png) | 媒体预览和带时间点的评论侧栏 |

这些是上游提供的演示截图，不是当前机器独立运行生成的截图。截图中的人物、对话、PR 和媒体内容也不应当成实际项目执行结果。另有 [本机实测截图](web/assets/local-private-channel.png)，来源与步骤见 [runtime.md](runtime.md)。

## 架构：一条事件主线，多个功能模块

固定版本的 [架构文档](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/ARCHITECTURE.md) 与源码表明，Buzz 是 Rust 单仓库。桌面端用 Tauri + React；人通过桌面端或 Web 客户端，Agent 通过 `buzz-cli` 或 `buzz-acp`，连接同一个 `buzz-relay`。Relay 是单一事实来源，不做 relay 间点对点复制。

```text
桌面端 / Web / buzz-cli / ACP Agent
               │ WebSocket + REST
               ▼
          buzz-relay (Rust / Axum)
          ├─ 鉴权、频道权限、事件验证与订阅推送
          ├─ PostgreSQL：事件、频道、工作流、审计、全文搜索
          ├─ Redis：跨实例推送、在线状态、输入状态
          └─ S3 / MinIO：媒体文件

频道 @提及 ──→ buzz-acp ── ACP/JSON-RPC ──→ Agent 进程
```

核心单位是 [Nostr NIP-01 事件](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/ARCHITECTURE.md#2-the-protocol)：事件带作者公钥、类型 `kind`、标签、内容、哈希 ID 与 Schnorr 签名。人和 Agent 使用同一种事件格式、身份与频道权限模型。消息、表情、Git 变更和工作流执行可通过不同 `kind` 放入同一事件体系；在线状态等临时事件不写入历史记录。

一条持久频道消息的主要流程是：NIP-42 认证 → 对照作者公钥并验证签名 → 检查频道成员权限 → 写入 PostgreSQL → 通过本地订阅和 Redis 推送 → 异步触发审计及工作流。全文搜索使用 PostgreSQL 的生成列与 GIN 索引；媒体文件由 S3 兼容存储保存。审计和工作流触发是异步步骤，不能将“消息已接受”直接解释为后续动作必然执行成功。具体处理代码见 [`event.rs`](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/crates/buzz-relay/src/handlers/event.rs)。

Agent 集成分成两层：`buzz-cli` 提供适合工具调用的 JSON 命令接口；[`buzz-acp`](https://github.com/block/buzz/tree/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/crates/buzz-acp) 监听频道里的 `@提及`，经 ACP/JSON-RPC 把任务交给 Agent 子进程。它管理 Agent 进程池、会话范围内的队列和执行中状态；当前默认按频道组织会话，也支持按讨论串划分，命令行默认采用排队模式。这使 Agent 有独立身份和活动记录，但具体行动仍取决于它被授予的频道与外部工具权限。

## 实现的效果：上游能力与本机证据

| 层次 | 固定版本的上游说明或源码 | 本项目目前看到的证据 |
| --- | --- | --- |
| 团队界面 | 频道、话题、私信、画布、媒体、搜索和桌面端被 README 列为可用 | 四张官方截图展示更广场景；本机已用官方桌面端创建私密频道、发送消息，并通过 CLI 验证讨论串 |
| Agent 协作 | `buzz-cli` 和 ACP 适配程序已提供；Agent 可作为成员加入频道 | 本机验证第二身份以 Bot 角色加入、读取、签名回复；未配置模型或 ACP，未实测自主任务 |
| 开发协作 | README 列出 Git 事件与 Git 托管后端 | 官方截图出现 PR 入口；本机未验证推送、评审与合并流程 |
| 自动化 | README 列出消息、表情、定时、Webhook 触发的 YAML 工作流 | 代码有工作流引擎；本机未执行工作流；审批关卡等存在明确缺口 |

官方截图里的 PR、对话和 Agent 回复均属于上游演示内容。本机另行验证了有限的消息与权限流程，不构成性能或可靠性测试。

## 使用场景

1. **多人与多 Agent 的开发协作**：在频道中讨论需求、分配任务、查看补丁与评审记录，保留对决策过程的上下文。README 中“功能分支作为房间”是上游给出的使用故事，仍需针对真实 Git/CI 接入做端到端验证。
2. **事件驱动的团队流程**：由消息、表情、时间或 Webhook 触发通知、反应与外部调用，例如故障初步分流、日报或发布信息汇总。需要人工审批后继续运行的流程，目前不能按完整能力设计。
3. **项目记忆与排障**：按频道权限检索历史讨论、事件和工作流记录，让 Agent 根据可追溯内容回答“以前如何处理过类似问题”。Agent 回答质量需要另行验证。
4. **媒体协作与自建工作区**：在视频时间点留下评论；团队自行部署 relay 并管理工作区数据与成员身份。

## 对本仓库的可参考价值

- **统一事件底座**：讨论、任务、代码活动、工作流用同一种可签名记录表示，适合未来研究自己的 Agent 协作或研发工作台。值得借鉴的是事件类型、身份和可追溯上下文的组织方式。
- **Agent 作为成员**：Agent 使用独立密钥和频道成员身份；`buzz-acp` 把对话场景与具体 Agent 实现隔开。可借鉴“先限定身份与权限，再接执行器”的接入路径。
- **模块边界清楚**：`buzz-core` 负责协议与验证；relay 统一协调数据库、搜索、审计、工作流与实时推送。适合研究事件系统如何渐进加入新功能。
- **产品启发**：频道能成为代码变更或任务的持续上下文，而非仅承载即时聊天；可从个人小范围协作场景先验证“讨论、执行、证据”能否连成闭环。

采用成本也很具体：运行需要 relay、PostgreSQL、Redis 和媒体存储；单 relay 是中心依赖。固定版本的架构文档明确列出限流未真正接入、审批关卡不能恢复执行，`send_dm` 与 `set_channel_topic` 两个工作流动作会返回 `NotImplemented`；[`executor.rs`](https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/crates/buzz-workflow/src/executor.rs) 中可看到后两项的实现状态。适合把它作为架构与交互参考，是否直接用于生产需部署后逐项验收。

## 产品化判断

我们希望扩展的是“定制 Agent，并通过连接器或 API 把能力交付到客户已有的平台”。文字群聊、客服是消息接入方向；会议交互需新增音视频与发言控制；能力服务交付需定义鉴权、租户隔离、任务接口、回调和用量管理。它们借鉴 Buzz 的身份、事件与执行接入机制，当前均不是已验证的跨平台成品。[产品结构与验证路线](understanding.md#9-我们想扩展的产品定制-agent并交付到其他平台)。

## 本机复现状态与限制

- 已在 Windows 上启动 PostgreSQL、Redis、MinIO、固定源码编译的 relay 与官方 `0.5.25` 桌面客户端。独立测试身份在私密频道中的加入前后可见性、收发消息、Bot 角色和讨论串均已验证。完整步骤、版本、截图来源与运行提示见 [runtime.md](runtime.md)。
- 展示页仍是静态研究页，不直接连接 relay。它分别标注上游截图、官方版本机实测和中文修改版截图，并提供三层架构与交互控制说明。
- 未接入模型与 ACP 进程；Bot 身份的回复由 CLI 手动发送，不能解释为 AI 自动生成。Git、媒体、搜索、Forum 与工作流均未端到端验证。
- relay 启动时有事件分区重叠错误日志，尽管本次消息写入和读取成功；长期运行需排查。上游 README 的移动客户端和审批关卡仍为进行中。

下一步若要验证 Agent 行为，应配置模型提供商与 Persona/ACP，检查 `@提及` 触发、工具权限和回复来源，并对 Git、媒体与工作流分别做独立验收。

## 网页发布记录

2026-09-29 已将研究页部署到 [GitHub Pages](https://yydshly.github.io/0928_codex_project/012-buzz/)，公开内容包含现有引导图、能力与原理摘要、实测截图和定制 Agent 跨平台交付方向。公网页面及图片、交互已验证；本次发布不包含本机运行服务和身份数据。详见 [网页部署记录](web/README.md#部署验证--2026-09-29)。
