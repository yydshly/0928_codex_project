# 研究记录：两个 OSINT 资源清单

## 研究问题与范围

1. 两个仓库是否主要收集资源，它们各自比普通书签列表多提供什么？
2. 如何按调查任务在两套不同分类中找到资源？
3. B 的“Dark Web Search Engines & Tools”包含哪些不同类型，怎样理解其边界？

研究对象为 [A：jivoi/awesome-osint，提交 `3ab9cde5d0f638de91bc86147db6996472d927c6`](https://github.com/jivoi/awesome-osint/tree/3ab9cde5d0f638de91bc86147db6996472d927c6) 和 [B：rawfilejson/awesome-osint-arsenal，提交 `2c6475a1d5b941cc598b3612419ef22e6d903ce8`](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8)，查阅日期为 2026-09-28。提交 ID 从两仓库默认分支读取；以下分类和例子依据该时点的 README。

## 原项目概况

| 维度 | A：awesome-osint | B：awesome-osint-arsenal |
| --- | --- | --- |
| 上游自己的定位 | “OSINT tools and resources”的精选清单，面向 OSINT、威胁情报和威胁狩猎 | “OSINT + Security Toolkit”，自述 753+ 工具、50 分类 |
| 核心资产 | README 分类、名称、外部链接和少量说明；另有贡献说明、许可和标志 | README 分类和工具表、`tools.json`、`install.sh` 及分领域安装脚本 |
| 分类特点 | 按来源或调查对象细分，如搜索、用户名、人物、公司、域名、媒体、地图、威胁情报 | 按任务与安全工作流编号，含账号、邮箱、域名、泄露、暗网、攻防、取证、实验室等 |
| 可直接运行的东西 | 没有统一调查程序，主体是链接目录 | 有批量安装脚本，但清单中的第三方工具才执行具体任务 |
| 研究边界 | 未逐一访问清单中的外站 | 未执行脚本或核对上游的工具数量统计 |

B 的安装脚本不改变它以**收集、分类和导流外部工具**为主的属性。README 的“已验证链接”是上游自述，本仓库没有重复验证。其范围还包括主动扫描、凭据审计和安全练习；这些不能一概称为仅使用公开来源的被动 OSINT。

## 分类对应与检索入口

下表覆盖两个 README 的主要资源领域。A 的分类为原 README 标题；B 保留原编号以便回查。归组是本仓库的解释，并非上游共同采用的分类体系。

| 本仓库归组 | A 的对应入口 | B 的对应入口 | 查找时的关键问题 |
| --- | --- | --- | --- |
| 通用检索与资料 | General Search；Meta Search；Document and Slides Search；Web History and Website Capture；Academic Resources and Grey Literature | 24 Google Dorking；36 APIs & Developer Tools；38/48 Learning Resources | 要找网页、历史版本、文档还是学术资料？ |
| 身份与社交线索 | Username Check；People Investigations；Email Search；Phone Number Research；Social Media Tools | 1 Username & Social Media；2 Email；3 Phone；7 Facial Recognition；8 Social Media；27–29 Community & Platforms | 目标是账号存在性、公开资料还是跨平台关联？ |
| 组织与基础设施 | Company Research；Domain and IP Research；DNS；Threat Intelligence | 4 Domain & IP；20 Financial & Corporate；43 Blue Team；44 Threat Intel | 查询是否被动，是否会触达目标系统？ |
| 媒体与空间 | Image Search；Image Analysis；Video Search；Geospatial Research and Mapping Tools | 5 Geolocation & Maps；6 Image & Video；22 Metadata | 原图、EXIF、地图资料是否互相印证？ |
| 公共记录与核查 | News；Fact Checking；Data and Statistics；Maritime | 20 Financial & Corporate；21 Vehicle, Property & Public Records | 信息来自原始记录、聚合站还是转述？ |
| 泄露与隐藏服务 | Data Breach Search Engines；Dark Web Search Engines；Threat Actor Search | 9 Data Breach；10 Whistleblower Platforms；12 Dark Web；13 Privacy | 是否涉及敏感信息，是否有合规访问和保存依据？ |
| 安全研究与练习 | 仅零散列于 Other Tools、Threat Intelligence 等 | 11 Password Tools；14–18 Offensive Security；30–35 Toolkits/Systems；42–47 Red/Blue Team、取证、实验室与漏洞奖励 | 是否是主动测试？是否有书面授权与隔离环境？ |

**使用示例：**若要核对自有域名的公开足迹，先看 A 的 Domain and IP Research / DNS，再看 B 的第 4 类。可从证书透明度、DNS 和注册信息等不同公开来源取证；主动端口扫描属于另一种行为，需要单独评估权限。若要确认一张图的出处，优先使用媒体反向检索与元数据核查，再结合地图或网页存档，不以一次匹配认定来源。

## B 第 12 节逐项整理

下表是对 B 所列九项的**类型归纳**，不是对服务在线状态、准确性或安全性的验证。原节中还有 Tor 设置命令，此处不复制或执行。A 的暗网搜索类别在研究版本仅列 Ahmia 和 Aleph Open Search。

| B 中名称 | 本仓库归类 | 说明与边界 |
| --- | --- | --- |
| Torch、Haystak、Phobos | Tor 隐藏服务搜索入口 | 尝试索引部分 `.onion` 内容；覆盖范围和入口状态未核验 |
| Ahmia | 可从普通网页访问的隐藏服务搜索入口 | 同时出现在 A 的暗网搜索分类；搜索结果仍须检查来源与时效 |
| DarkSearch | 搜索服务 / API | 上游将其列为普通网页可访问的暗网搜索 API；服务状态与条件未核验 |
| DuckDuckGo Onion | Tor 形式的通用搜索入口 | 通过 Tor 访问的搜索服务，不应等同于专门索引隐藏服务的搜索引擎 |
| Dark.fail | 链接目录 | 上游将其描述为入口目录；具体链接真伪需回到服务官方渠道核验 |
| OnionScan | 分析工具 | 用于对隐藏服务进行技术分析；任何主动操作需有授权 |
| OSINT-SPY | 带 Tor 支持的 OSINT 工具 | 通用调查工具，不能仅凭名称认为它是暗网搜索引擎 |

这些条目混合了搜索、导航和分析。`.onion` 地址及镜像可能变动，故本仓库只链接[上游第 12 节](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8#12-dark-web-search-engines--tools)，不转录地址，也不保证其能访问。公开可获取不等于可不受限制地复制、传播或测试；尤其需要考虑隐私、数据来源与当地法律。

## 本仓库的实验与改动

- 将两个清单重新整理为“问题 → 分类 → 原始来源核验”的导航表。
- 制作 `assets/resource-map.svg`，说明两个仓库的范围与实际使用路径。
- 制作[静态分类网页](web/index.html)：12 个中文任务主题、48 条重点资源说明、暗网第 12 节拆解、原始分类对照和可搜索名称索引。索引只提取上游固定 README 的名称、网址、分类与行号，包含重复收录记录；未复制上游说明文字。
- 没有克隆或运行上游项目；没有安装第三方工具、访问隐藏服务、执行扫描或验证外部站点。
- [研究网页](https://yydshly.github.io/0928_codex_project/007-osint-resource-map/)已于 2026-09-28 通过 GitHub Pages 部署并核对页面及总览图可访问；没有复制上游图片与资源清单全文。网页上线不代表外部工具已实测。

## 结论与维护方式

两个仓库适合作为**发现候选资源的起点**。A 的优点是公开来源类别细，B 的优点是把工具、安装线索及安全工作流放在同一目录；两者大量交叉，但深度与安全边界不同。选定工具后应独立核实其原站、维护状态、数据来源、费用、许可证和是否需要授权。后续如要扩充本项目，可建立逐项核验表并为每个条目记录检查日期与证据，不能直接继承上游的“有效”判断。

### 从清单到个人入口

这两个上游仓库的可复用能力是**资源发现与分类导航**，而不是代替用户执行调查。本项目把其范围归为四条主线：发现公开线索（网页、账号、公司与公共记录）；核对内容与资产（域名、图片视频文件、地理资料）；识别风险与特殊来源（泄露、Tor 隐藏服务、威胁情报）；组织研究与执行（隐私环境、安全测试与取证、API/脚本/学习材料）。[一张总览图](web/assets/resource-overview.svg)把十二个主题的子类、可能效果及代表名称并列呈现。

产品化的价值在于把“工具列表”变成长期可用的**任务引导入口**：输入问题，找到合适的资源类别；按顺序核对原站、数据来源、权限和结果；保留查询时间与证据。当前静态网页实现了分类、说明、搜索与筛选，没有实现自动查询、任务操作卡、个人结果记录或资源状态监测。这些可作为后续扩展，并应在实际访问与使用后记录证据，避免仅凭简介推断能力。

## 对本仓库可能特别有用的能力（推断）

以下优先级基于本仓库正在做的开源项目研究、公开网页、图片来源说明及配置范例推断，未实际启用这些工具。

| 能力 | 与当前工作关联 | 可形成的结果 | 注意边界 |
| --- | --- | --- | --- |
| 上游变更监测与留证 | 固定提交研究会随上游 README、许可证和网页变化而过时 | 需重看项目的变更清单与页面快照 | [ChangeDetection.io 官方说明](https://github.com/dgtlmoon/changedetection.io)只支持发现变化，影响仍需人工判断 |
| 自有资产公开暴露核对 | 仓库有网页发布，另研究 VPS 代理架构 | 域名、证书、服务和公开扫描记录核对表 | [Censys 官方文档](https://docs.censys.com/docs/platform-quickstart-guide)说明了可搜索的数据；[urlscan 可见性](https://urlscan.io/docs/api/)需在提交前选择 |
| 发布前凭据检查 | 配置、日志、截图和代码可能意外包含令牌 | 疑似密钥清单及整改记录 | [Gitleaks 官方说明](https://github.com/gitleaks/gitleaks)；扫描有误报与漏报，真实密钥需轮换 |
| 素材出处与许可链 | 本仓库要求记录图片来源和许可证 | 素材来源卡、相似版本、元数据和许可依据 | [TinEye 官方教程](https://help.tineye.com/article/265-tineye-tutorial)明确搜索结果不能授予使用许可 |
| 第三方工具准入评估 | B 收录大量安装脚本、安全工具及外部站点 | 来源、版本、许可、安装行为与风险线索记录 | [VirusTotal 私密扫描说明](https://docs.virustotal.com/docs/private-scanning)显示普通提交与私密扫描不同；无告警不等于安全 |
| 实体与关系图 | 多项目研究可能涉及作者、组织、域名和依赖关系 | 每条关系附来源的实体图 | [Gephi 官方说明](https://gephi.org/desktop/)提供图分析能力；共现不能直接证明归属 |

## 来源与许可

- [A README](https://github.com/jivoi/awesome-osint/blob/3ab9cde5d0f638de91bc86147db6996472d927c6/README.md)；[A LICENSE.txt：CC BY-SA 4.0](https://github.com/jivoi/awesome-osint/blob/3ab9cde5d0f638de91bc86147db6996472d927c6/LICENSE.txt)。
- [B README](https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/README.md)；[B 第 12 节](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8#12-dark-web-search-engines--tools)；[B LICENSE：MIT](https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/LICENSE)。
- 外部工具、网站和数据均属于各自提供方；上游仓库的许可证不自动覆盖它们。本文的分类对应、中文分析与示意图由本仓库独立制作。
