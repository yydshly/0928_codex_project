# AntV Infographic 浏览器演示

本目录是独立的 Vite 小项目，`package.json` 和 `package-lock.json` 固定依赖 `@antv/infographic@0.2.20`。生产构建会把库和页面源码打包在本目录的 `dist/` 下；运行时不从 CDN 加载信息图库。界面使用系统字体。

页面上半部分可直接操作原库生成的信息图；下半部分 `#summary` 用五个章节汇总能力、效果、原理、场景与扩展，并链接到上游文档。该总结文字是本仓库的研究整理。

新增 `#templates` 分类区：从原库 API 读取 276 个模板的名称，按七类展示数量与用途，可搜索中文类别或模板名称。每类按钮跳转至本页一个代表模板，其中四象限为新增原库演示。总结区还包含日常选图建议、模板与数据的关系、AI 与库的分工及四种使用入口。

## 本地运行

`#architecture` 保存本次讨论的架构理解：真实模板配置、注册表查找、组件组合、网格位置计算和 SVG 输出。示意内容为静态教学说明；后续运行追踪、自定义组件、布局及编辑器插件的实验列在 `#architecture-roadmap`，尚未实现。页内源码线索均对应固定安装包 v0.2.20。

`#overview` 提供一张完整总览图的预览、SVG 与高清 PNG 下载。图片位于 `public/assets/`，由 Vite 自动复制到构建目录。图中列出固定版本 276 个模板名称、41 个模板家族，并嵌入七类原库实际运行截图。

重新生成图片：先启动本页预览，再运行 `node ../tools/build-overview.cjs`。需要可用的 Playwright（可用 `PLAYWRIGHT_PATH` 指定模块路径）；`DEMO_URL` 可指定本页预览地址，默认 `http://127.0.0.1:4173/`。脚本同步输出 `../assets/template-inventory.json`，核对类别数量、完整性和画布文字边界。生成器是本仓库工具，不属于上游库。

```powershell
cd projects/010-antv-infographic/web
npm ci
npm run dev
```

浏览器打开终端显示的本地地址。生产检查：

```powershell
npm run build
npm run preview
```

如需自动核对七种模板和导出，可先启动预览，再运行 `../qa/check-demo.cjs`。该脚本需要本机可用的 Playwright；不参与生产构建。

## 部署子路径

摘要按能力、价值、使用场景、实现方式和个人意义整理，强调“按表达类型选择模板，将结构化内容转换为图表或信息图”。`#product-directions` 记录后期研究架构并用于可插拔产品设计的三个候选方向；这些方案尚待验证。首页继续使用已有能力总览长图作为引导。

已部署并核验：[公开研究网页](https://yydshly.github.io/0928_codex_project/010-antv-infographic/)。部署子路径为 `/0928_codex_project/010-antv-infographic/`，汇集目录为 `_site/010-antv-infographic/`。`npm run build` 使用相对资源基路径 `./`；工作流在 Node 22 中执行 `npm ci` 与构建，复制 `dist/` 并补充一张运行截图，不发布 `node_modules/` 或源代码。总览图与上游 MIT 许可由 `public/` 随构建发布。

## 能力与来源

七个示例都调用上游 `Infographic.render`。主题使用官方内置名称，编辑通过 `editable`，导出通过 `toDataURL`。页面的示例内容、交互控件和视觉界面为本仓库独立编写。项目概览、图片来源、许可和验证边界见 [子项目 README](../README.md)。
