# Jev Ultrafast 研究网页

纯静态网页，所有 HTML、CSS、JavaScript 与 SVG 均在本目录内；没有构建步骤、运行时依赖、在线模型调用或上游 Agent 执行。

## 本地运行

从仓库根目录运行：

```powershell
python -m http.server 8089 --bind 127.0.0.1 --directory projects/009-jev-ultrafast/web
```

在浏览器打开 `http://127.0.0.1:8089/`。也可直接打开 `index.html`。页面上的场景切换只使用本地预设数据，不访问航班、百科或酒店网站。

## 部署约定

沿用本仓库现有 GitHub Pages 汇集流程，**预定**子路径为 `/0928_codex_project/009-jev-ultrafast/`，汇集产物为 `_site/009-jev-ultrafast/`。资源使用相对路径；站点构建只复制本目录的 `index.html`、`styles.css`、`app.js` 与 `assets/overview.svg`、`assets/overview.png`。尚未将该预定路径写成已发布链接；公开部署需以实际访问核验为准。

## 图片和模拟说明

`assets/overview.svg` 由本仓库独立绘制，不是上游截图。交互场景依据上游 README 和性能记录重组为教学步骤，并非录制轨迹的逐步复刻，也没有连接真实模型或浏览器智能体。性能数字归属上游公开测量，计时范围和限制见项目 `research.md`。

总览图扩展为 1600 × 2320，汇总库的范围、三种编号、请求与选择、文字生成分支、执行闭环、已测场景和扩展建议。SVG 由 `tools/build-overview.py` 生成，PNG 由 `tools/render-overview.cjs` 使用浏览器渲染；所有素材均在本项目内。网页首部嵌入完整图，并提供打开原图和下载两个版本的入口。

“请求与返回”交互使用固定示例数据解释 TYPE_TEXT、CLICK、DONE 的路由：只有 TYPE_TEXT 显示文本模型参与。JSON 省略了概率、置信度和无关目标答案，不是完整可调用协议；展开说明给出真实字段与源代码依据。

## 本地验证

2026-09-28 更新后使用 Chrome 的 1440px、768px、390px 视口检查：三个场景切换、前进至完成及重置，TYPE_TEXT / CLICK / DONE 请求返回示例与文本模型参与状态，图片与本地资源、锚点及重复 ID、横向溢出和浏览器脚本错误均通过。总览图已检查文字画布边界并查看实际 PNG；网页首屏和请求返回区也已查看实际截图。本地预览页面和 PNG 返回 HTTP 200。

验证脚本位于 `../qa/check-page.cjs`，需要本机可用的 Playwright；它不参与网页构建或发布。这些检查只验证本研究网页，不代表上游 Agent 的运行效果。
