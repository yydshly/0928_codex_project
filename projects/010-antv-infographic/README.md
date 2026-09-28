# 010 · AntV Infographic 原库能力展示

[在线研究网页](https://yydshly.github.io/0928_codex_project/010-antv-infographic/) · [架构原理与后续探索](https://yydshly.github.io/0928_codex_project/010-antv-infographic/#architecture)

[AntV Infographic](https://github.com/antvis/Infographic) 把结构化文字、数值与关系转换为图表或信息图，支持编辑、主题与 SVG／PNG 导出。使用时按表达类型选择模板，再填入符合要求的数据；模板指定结构、数据项组件与参数，程序查找已注册实现、组合组件和计算布局，再生成 SVG。价值是减少重复排版，让内容更容易理解；适用于研究配图、教程流程、知识摘要、产品说明、方案对比和报告。

对我而言，当前它是按需取用的绘图工具，优先用熟列表、流程、关系与对比；后期研究组件注册、组合与插件生命周期，把理解用于可插拔产品设计及相关产品方案，例如模板化报告工具、业务组件工作台和可扩展编辑器。先通过四个架构实验详细探索并亲手实现，再结合真实需求设计产品；实验和产品方案均待探索。这个子项目直接调用原库演示七类模板，并保留完整模板索引、架构解释和待办路线。页面外壳、引导图与示例数据由本仓库编写。

[![AntV Infographic 完整能力总览：内容、原理、类型、场景、个人价值与 276 个模板](web/public/assets/infographic-overview.png)](web/public/assets/infographic-overview.svg)

[可缩放 SVG 总览](web/public/assets/infographic-overview.svg) · [高清 PNG 长图](web/public/assets/infographic-overview.png) · [完整模板清单 JSON](assets/template-inventory.json)

总览图由本仓库独立编排，固定研究版本为 v0.2.20；276 个模板名称和 41 个家族数量直接来自安装包，七张缩略图来自原库实际渲染。图中包括库的内容、工作原理、七类图及全部模板家族、完整名称索引、场景、个人价值、接入与扩展。完整清单不代表全部模板都经过效果验证。网页 `#overview` 提供查看和下载入口。

[查看原库步骤信息图运行截图](assets/native-render.png)

图：2026-09-28 在本机浏览器截取的本子项目演示页。画布内容由上游 `@antv/infographic@0.2.20` 根据本仓库示例语法生成；这是真实运行截图，不是上游官方截图。图片随本仓库提供，原库代码及商标归原权利人。

[查看桌面网页总结截图](assets/web-summary.png) · [查看手机网页总结截图](assets/web-summary-mobile.png)：展示页内的五部分文字总结由本仓库依据上游文档编写；两张图片均为 2026-09-28 本机运行页面的截图，不是上游官方资料。

## 展示内容

| 类型 | 上游内置模板 | 页面中的数据 |
| --- | --- | --- |
| 步骤与流程 | `sequence-steps-simple` | 产品交付五阶段 |
| 列表与卡片 | `list-grid-compact-card` | 内容工作台六模块 |
| 数值与图表 | `chart-column-simple` | 虚构渠道访问量 |
| 方案对比 | `compare-swot` | 两种发布方式的特点 |
| 层级结构 | `hierarchy-structure` | 产品能力树 |
| 节点关系 | `relation-dagre-flow-tb-simple-circle-node` | 内容发布节点与关系 |
| 四象限 | `quadrant-quarter-simple-card` | 投入与价值的四种组合 |

## 模板分类与新增理解

网页的 `#templates` 区域通过上游 `getTemplates()` 实时读取全部名称：层级 112、序列 83、列表 29、对比 20、关系 18、图表 11、象限 3，合计 276。支持中文类别和模板名称搜索、展开完整清单，并从每类跳到一个代表演示。完整清单不代表逐一验证了所有模板效果。

网页已补充这次讨论的理解：整理内容 → 选择或定制模板 → 填入数据 → 按规则布局生成 SVG／PNG。模板包含同类图形的样式变体，日常按重点、先后、归属、差异和数量等表达需求选图即可；本仓库最常用的起点是能力列表、步骤流程、模块关系和方案对比。页面同时说明了人或外部 AI 与渲染库的分工，以及模板库、AI 生成页、网页调用和服务端生成四种入口。

[桌面分类截图](assets/template-catalog.png)与[手机分类截图](assets/template-catalog-mobile.png)均为本机运行本页时的真实截图；分类说明由本仓库编写，数量和模板名称来自固定版本原库。

所有示例数据仅用于演示版式和 API，不代表业务研究结果。页面上的主题切换调用内置的 `default`、`dark`、`hand-drawn` 主题；画布编辑通过 `editable` 打开；下载通过 `toDataURL` 实现。流式按钮把语法逐行累积并重复调用 `render`，模拟模型输出过程，但**没有连接 AI 模型**。

## 架构理解与后续探索

网页新增 `#architecture`：以真实 `list-grid-compact-card` 模板跟踪输入、模板查找、组件查找、组合、坐标计算和 SVG 输出。说明绘图组件的注册机制、统一接口与编辑器插件生命周期，并列出固定版本源码线索。教学坐标中的宽度是假设值，页面说明不是运行过程追踪器。

当前状态：已阅读关键源码，但还需要通过实验建立更深入的理解。后续四项均待开展：追踪一个模板的中间结果、注册自定义项目卡片、实现简单排列结构、实现并清理一个编辑器插件。每项的产物与验收要求已记录在网页 `#architecture-roadmap`，本次只补充说明与计划。

## 版本、来源与许可

- 原始仓库：[antvis/Infographic](https://github.com/antvis/Infographic)
- 本次研究和演示锁定的 npm 版本：[`@antv/infographic@0.2.20`](https://www.npmjs.com/package/@antv/infographic)
- 官方资料：[快速开始](https://infographic.antv.vision/learn)、[信息图语法](https://infographic.antv.vision/learn/infographic-syntax)、[编辑器](https://infographic.antv.vision/learn/editor)、[API](https://infographic.antv.vision/reference/infographic-api)、[示例库](https://infographic.antv.vision/gallery)
- 上游代码采用 [MIT 许可](https://github.com/antvis/Infographic/blob/main/LICENSE)。本仓库自写的界面、示例语法、说明和截图不代表上游官方作品；构建时会把上游 npm 依赖打包进演示产物。

## 运行与验证

在 `projects/010-antv-infographic/web/` 内运行：

```powershell
npm ci
npm run dev
```

生产构建：`npm run build`。详细的发布子路径与依赖约定见 [web/README.md](web/README.md)。研究结论见 [research.md](research.md)。

2026-09-28 本机以锁定版本完成生产构建，并用浏览器检查了七种模板的 SVG 输出、三种主题、画布编辑开关、语法重渲染、流式重播和两种下载。测试脚本为 [qa/check-demo.cjs](qa/check-demo.cjs)。同日完成 GitHub Pages 部署，核验公开网页中的五项摘要、七类渲染、276 个模板数量、引导图显示及架构六步说明。这验证的是本演示页，不代表所有上游模板、字体和资源场景都已验证。
