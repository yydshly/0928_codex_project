# AntV Infographic 能力与实现研究

研究对象：[antvis/Infographic](https://github.com/antvis/Infographic)，演示使用固定 npm 版本 `@antv/infographic@0.2.20`。记录日期：2026-09-28。

## 能力

上游提供类 Mermaid 的信息图语法、配置对象、内置模板与主题。数据类型包括列表、序列、层级、对比、统计数值和节点关系；输出以 SVG 为主，可导出 SVG 或 PNG。编辑器支持选取、拖动、修改文字、缩放、撤销与重做。还有服务端 SVG 字符串渲染入口。参见[语法文档](https://infographic.antv.vision/learn/infographic-syntax)、[编辑器文档](https://infographic.antv.vision/learn/editor)及[快速开始](https://infographic.antv.vision/learn)。

## 实现原理

按照官方[核心概念](https://infographic.antv.vision/learn/core-concepts)、[设计说明](https://infographic.antv.vision/learn/design)和[API](https://infographic.antv.vision/reference/infographic-api)整理：输入语法或配置后，框架解析数据、设计和主题；模板选定整体结构与数据项组件；组件经 JSX 渲染引擎与布局逻辑组成 SVG；编辑器在浏览器里为结果增加选择和修改交互。模板本质上是可注册、可复用的设计配置。这个流程是基于公开文档的概括，未逐行审计所有内部实现。

AI 友好体现在语法简短、允许流式片段不断累积重渲染。库本身的浏览器渲染 API 不会自动调用大模型；自然语言到语法的转换需要外部模型或另外的应用层。[上游 README](https://github.com/antvis/Infographic)与[流式渲染示例](https://infographic.antv.vision/learn/infographic-syntax)给出了这种接法。

## 本项目真实运行结果

- `npm run build` 成功，Vite 把固定版本的上游库打入独立子项目的生产产物。
- 浏览器逐一切换七个内置模板，全部生成 SVG，图形子元素数分别为：步骤 75、列表 100、图表 53、对比 84、层级 49、关系 47。这些数字只是本次示例渲染的检查信号，不是性能指标。
- 内置默认、深色、手绘主题可切换；打开和关闭编辑模式后仍能渲染。
- 修改标题后可重新渲染；逐行流式重播结束；SVG 和 PNG 下载均触发成功。
- `assets/native-render.png` 是本机演示页的真实截图。示例中的访问量数字、流程及比较项均由本仓库编写，没有外部业务数据或 AI 生成结果。

## 适用场景与扩展

新增模板盘点：直接调用已安装的 v0.2.20 的 `getTemplates()`，按注册名称前缀统计为 hierarchy 112、sequence 83、list 29、compare 20、relation 18、chart 11、quadrant 3，共 276。模板数量包含方向、卡片与连线等变体，不能等同于独立的表达任务数。网页已接入可搜索的全量名称分类，同时新增四象限代表演示，实际渲染包含 56 个 SVG 子元素。

新增理解：信息图用于加快阅读者理解重点、顺序、归属、差异和数量；选择模板前应先判断内容关系。简短通知可以用文字，逐项参数查询可用表格。框架按模板与布局规则渲染，通常直接复用模板；外部 AI 可以负责内容提炼与选型，结果仍需人工核对。这些为本仓库结合此次讨论形成的使用建议。

适合知识摘要、产品说明、流程步骤、组织结构、方案对比，以及报告或 AI 助手中的可视化段落。它强调将少量结构化信息讲清楚；高密度探索性分析仍需另行评估。

官方已经开放自定义结构、数据项、模板、主题、色板、字体与资源加载器，也允许通过插件和交互扩展编辑器，见[自定义设计](https://infographic.antv.vision/learn/custom-design)。本仓库可继续尝试品牌模板库、业务数据到信息图语法的映射、AI 生成结果的校验与人工审核、批量导出和无障碍文本替代。这些是后续设计方向，本项目尚未实现。

## 一张图的归档成果

2026-09-28 新增能力总览长图（2400 × 8329），由本仓库独立编排，以原库七类真实渲染截图辅助说明。模板清单来自锁定版本的 `getTemplates()`；按名称前两段归并为 41 个模板家族，并保留全部 276 个注册名称，方便回到网页搜索定位。SVG 中的说明与索引为文字，示例缩略图为嵌入 PNG。

图中新增个人使用结论：把库作为按需取用的可视化工具；在开源研究中优先用能力列表、步骤流程、模块关系和方案对比。其价值是减少重复排版、统一视觉输出，内容关系与数据准确性仍由使用者把关。图中明确区分原库能力与后续业务扩展。

来源与可复现入口：`tools/build-overview.cjs`、`assets/template-inventory.json`，成品位于 `web/public/assets/infographic-overview.svg` 和 `.png`，网页入口为 `#overview`。

## 架构讨论补充与待做实验

根据 v0.2.20 安装包的关键源码确认：模板、结构、数据项通过各自 Map 注册表关联名称与配置/实现；`options/parser.js` 查找组件并包装参数；`runtime/infographic.js` 的 `compose` 把 data、Title、Item、Items、options 传入结构组件，再调用库的 JSX 渲染生成 SVG；`renderer/renderer.js` 继续处理文字、样式和资源。

真实模板 `list-grid-compact-card` 在 `templates/built-in.js` 中选择 `list-grid` 结构和 `compact-card` 数据项。`designs/structures/list-grid.js` 测量首项边界，默认三列、间距 24，按行列计算 x/y 后调用 Item。网页中的卡片宽 200 是解释坐标的假设值。

编辑器使用独立的插件管理器：`editor/managers/plugin.js` 注册实例后调用 init，注销时调用 destroy 并移除；插件得到事件、编辑器、命令、状态等上下文。绘图注册表没有相同的统一卸载机制，同名 Map.set 会覆盖映射；代码需要先加载注册，配置名称不会自动加载扩展。当前标题解析仍使用默认 Title，不能将所有部分都视为同样开放的插件接口。

用户仍未充分理解运行机制，要求留待后期详细探索和亲手实现。网页 `#architecture` 已保存六步解释与源码定位；`#architecture-roadmap` 保存以下待办，均未完成：

1. 追踪真实模板：展示原始输入、解析配置、选中的组件和 SVG，说明内容在哪一步进入图形。
2. 自定义项目卡片：注册新的数据项，在同一网格和数据下切换卡片，观察尺寸对布局的影响。
3. 自定义排列结构：复用卡片、计算并显示坐标、注册模板，检查长文字、空数据及多项内容。
4. 编辑器插件：实现状态提示，观察 init、事件处理、destroy；反复启停时清理界面和监听，避免重复响应。

这些为本仓库的后续实验计划，尚未作为现成能力交付。当前只完成关键源码阅读和解释整理，仍需运行追踪验证理解。

## 限制

本次只验证七种选定模板。浏览器截图体现当前字体和视口效果，其他环境可能有换行差异。当前演示在本地浏览器测试，未发布到公共地址。源库采用 MIT 许可；其他第三方资源如图标和用户输入内容需要分别核对来源与许可。
