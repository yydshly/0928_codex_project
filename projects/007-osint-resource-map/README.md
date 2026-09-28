# 007 · OSINT 资源地图：两个清单的整理与使用说明

> [awesome-osint](https://github.com/jivoi/awesome-osint) 与 [awesome-osint-arsenal](https://github.com/rawfilejson/awesome-osint-arsenal) 都以收集外部资源为核心。前者偏向公开来源调查的分类导航；后者还收录安全测试、取证和练习资源，并提供批量安装脚本。本项目把它们整理成按任务查找的地图，作为个人研究入口的第一层；清单中的链接不等于已验证的服务。

| 项目资料 | 链接或说明 |
| --- | --- |
| 上游仓库 A | [jivoi/awesome-osint](https://github.com/jivoi/awesome-osint) |
| 上游仓库 B | [rawfilejson/awesome-osint-arsenal](https://github.com/rawfilejson/awesome-osint-arsenal) |
| 研究版本 | A：[提交 `3ab9cde`](https://github.com/jivoi/awesome-osint/tree/3ab9cde5d0f638de91bc86147db6996472d927c6)；B：[提交 `2c6475a`](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8)；2026-09-28 查阅 |
| 研究状态 | 已核对两份 README 的结构、B 的第 12 节、仓库文件列表和许可证；未逐一测试外部链接或运行安装脚本 |
| 在线演示 | [OSINT 资源地图网页](https://yydshly.github.io/0928_codex_project/007-osint-resource-map/)；2026-09-28 验证页面及总览图均可访问 |
| 详细记录 | [research.md](research.md) |
| 分类网页 | [打开本地网页源码](web/index.html)；部署子路径为 `/0928_codex_project/007-osint-resource-map/` |

![两份 OSINT 清单的十二类资源全景图](web/assets/resource-overview.svg)

图由本仓库根据上述固定提交的 README 独立绘制：按四条主线、十二个主题归纳主要资源类型和预期效果。它不是上游截图，也不表示图中每类资源均已实测。SVG 由本仓库编写，未使用外部图片；[PNG 版本](web/assets/resource-overview.png)由该 SVG 渲染。[打开完整 SVG](web/assets/resource-overview.svg)可放大查看；[简版定位图](assets/resource-map.svg)保留作为辅助说明。

## 能力与产品化价值

OSINT（开放来源情报）是从可公开获取的来源寻找、核对并分析信息的工作方式。两个仓库的核心能力是**发现和组织候选来源**：前者细分网页、账号、公司、域名、媒体、地图与公开记录；后者扩展到泄露、Tor 隐藏服务、威胁情报、主动安全测试、取证与学习。它们是线索目录，不是统一的搜索引擎、数据集或自动调查系统，也不会替使用者判断信息真假。

**为什么值得整理并产品化：**原始清单回答“有哪些链接”，个人入口应进一步回答“我遇到这个问题先做什么”。可把两套分类映射为任务，给出候选工具、查询顺序、预期结果、权限边界和核验方法；长期维护每个资源的状态、检查日期与证据，让它逐步成为自己反复使用的研究工作台。例如检查自有域名时，从证书、DNS 和公开扫描记录入手，再记录各来源的差异与查询时间。

**现在与下一步：**当前网页已提供一张总览图、12 个任务主题、6 类结合本仓库工作推断的机会、48 条重点说明及固定版本的名称索引。它是引导和检索入口，尚未接入第三方工具执行调查，也没有逐一验证外站。下一层可做任务操作卡、资源状态与核验日期、个人收藏及结果记录；这些是产品方向，不是当前已实现功能。

本项目另制作了[可搜索的分类网页](web/index.html)：以 12 个任务主题解释用途与边界，结合本仓库工作列出 6 类易忽略的能力，逐项说明 48 条重点资源，并保留从两个固定 README 提取的名称索引。索引包含跨分类重复记录，仅用于追溯上游条目；网页的运行与预定发布子路径见[网页说明](web/README.md)。

| 对比项 | awesome-osint | awesome-osint-arsenal |
| --- | --- | --- |
| 主体形式 | 分类清单和外部链接 | 分类清单、工具说明、安装命令及脚本 |
| 主要范围 | 搜索、社交媒体、人物、公司、域名、图像、地图、学术资料等公开来源调查 | 上述部分领域，另覆盖泄露检索、攻防安全、取证、硬件、练习环境等 |
| 适合的用法 | 浏览分类，按调查问题选择来源 | 查找工具及初步安装线索；按具体用途审查脚本与依赖 |
| 重要边界 | 资源条目是导航，不等于推荐或质量认证 | README 中的“753+ 工具、50 类”为上游自述；脚本会安装第三方程序，不能仅凭清单描述信任或运行 |

## 按任务查资源

以下是本仓库依据两份 README **重新归纳**的使用地图，示例名称仅说明可查找的工具类型；具体功能、价格、可用性和服务条款应在工具原站再次确认。更完整的分类对应关系见[研究记录](research.md#分类对应与检索入口)。

| 想解决的问题 | 先看 A 的分类 | 再看 B 的分类 | 使用时核对 |
| --- | --- | --- | --- |
| 搜索网页、历史页面和公开文档 | General Search、Web History、Document and Slides Search | Google Dorking、Learning Resources | 索引覆盖和资料发布日期 |
| 找公开账号或社交线索 | Username Check、Social Media Tools、People Investigations | 1 Username & Social Media、8 Social Media Monitoring | 同名账号不能直接认定同一人 |
| 研究域名、IP 和网络资产 | Domain and IP Research、DNS、Threat Intelligence | 4 Domain & IP、44 Threat Intel Platforms | 被动查询与主动扫描的权限边界 |
| 核对图片、视频、位置 | Image Search、Image Analysis、Video Search、Geospatial Research | 5 Geolocation、6 Image & Video | 反向搜索结果、拍摄时间和地点的交叉证据 |
| 查公开商业、学术或统计资料 | Company Research、Academic Resources、Data and Statistics | 20 Financial & Corporate、21 Public Records | 原始出处、更新日期、地区覆盖 |
| 查看泄露与威胁线索 | Data Breach Search、Threat Actor Search | 9 Data Breach、43–44 Blue Team / Threat Intel | 数据来源、合法访问和敏感信息处理 |
| 研究 Tor 隐藏服务 | Dark Web Search Engines | [12 Dark Web Search Engines & Tools](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8#12-dark-web-search-engines--tools) | 地址是否仍有效、镜像真伪及研究授权 |

## 第 12 节：暗网资源到底是什么

B 的第 12 节混合了四种东西：**搜索入口**（如 Torch、Haystak、Ahmia、Phobos、DarkSearch）、**通过 Tor 提供的一般搜索入口**（DuckDuckGo Onion）、**目录**（Dark.fail）和**分析工具**（OnionScan、OSINT-SPY）。这些不是同一种产品：搜索入口用于检索可索引的隐藏服务，目录用于查入口，分析工具用于技术研究；都不代表可以搜遍 Tor 网络。A 的同名分类在所研究版本只列出 Ahmia 与 Aleph Open Search，范围更窄。[B 第 12 节](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8#12-dark-web-search-engines--tools) · [A 的 Dark Web Search Engines](https://github.com/jivoi/awesome-osint/tree/3ab9cde5d0f638de91bc86147db6996472d927c6#dark-web-search-engines)

这里记录**名称与用途**，不复制 `.onion` 地址或声称其当前可访问。隐藏服务地址和镜像变化频繁；要使用时应从项目官方渠道核对真实入口，不要向未知站点提交账号、凭据或个人资料。

## 推荐的使用顺序

1. 明确调查问题和允许使用的数据范围，例如“核对自有域名是否出现在公开证书记录中”。
2. 在上表选分类，打开上游清单中的候选条目。
3. 到工具的**原站**核对维护情况、权限要求、价格、数据来源和许可证；记录查询日期。
4. 用两个独立来源交叉核对结果，保留原始链接与时间，不把单个搜索命中直接当结论。
5. 对需安装的工具先阅读源码、安装脚本和依赖，并在隔离环境中评估；只在授权范围内运行扫描或测试。

## 图片、代码与许可

本目录的中文归纳、研究记录和 SVG 均为本仓库独立创作，引用上游名称与链接用于说明和追溯，不复制上游清单全文或工具代码。A 的 [LICENSE.txt](https://github.com/jivoi/awesome-osint/blob/3ab9cde5d0f638de91bc86147db6996472d927c6/LICENSE.txt) 为 **CC BY-SA 4.0**；B 的 [LICENSE](https://github.com/rawfilejson/awesome-osint-arsenal/blob/2c6475a1d5b941cc598b3612419ef22e6d903ce8/LICENSE) 为 **MIT**。清单所指向的第三方工具、网站、数据与图片有各自的许可和条款，不能沿用清单仓库的许可。本研究未运行上游安装器，未验证其宣称的链接数量、可用性或安全性。
