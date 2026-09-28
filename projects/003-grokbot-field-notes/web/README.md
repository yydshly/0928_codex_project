# Grok Bot Field Notes 工程经验与使用参考网页

网页源码与 SVG 图都在本目录；纯静态 HTML / CSS / JavaScript，无安装依赖和构建步骤。网页汇总资料库记录了什么、沉淀了什么、参考价值和后期使用方式，并用 Thursday Arena 的开发经过和失败案例支撑理解。

## 本地运行

在本目录运行：

```powershell
python -m http.server 2527 --bind 127.0.0.1
```

浏览器打开 `http://127.0.0.1:2527/`。也可以直接打开 `index.html`；建议用本地服务器检查资源路径与交互。

## 阅读与交互

首页先展示全量理解引导图，涵盖资料定位、能力与范围、五类沉淀、案例、价值边界和使用路线。可打开 SVG 放大，或保存 PNG。图中对有工程经验使用者的判断是：新增方法有限，主要用于具体案例、模板和查漏补缺，适合归档后按需使用。

引导图之后提供六项统一摘要：库的能力、技术本质、可沉淀技术、使用场景、可扩展方向、对我的意义。扩展方向明确标为后续迁移建议，并说明需要自行实现的部分。

1. 理解定位：区分 Grok Bot 工具、Thursday Arena 产品和第三方资料库。
2. 八个模块：使用原生折叠卡片阅读内容、用途与来源，支持点击和键盘 Enter/空格。
3. 五类成果：理解工作规则、流程、岗位、验收与案例；区分资料、方案、技能与运行系统。
4. 参考价值与后期使用：六类用途、五步使用路线，以及开源项目研究助手的迁移示例。
5. 实战案例：产品、三天经过、八个问题和处理边界。
6. 工作机制与场景：可切换工程、研究、客服示例；只展示固定说明。
7. 来源与边界：所有原库引用使用固定提交，当前游戏官网单独注明时间边界。

页面不发送用户输入、没有模型调用，也不请求麦克风、摄像头或位置权限。原仓库链接只在用户主动点击后打开。

## 打包与部署路径

仓库 `.github/workflows/deploy-pages.yml` 将本目录内容复制到 `_site/003-grokbot-field-notes/`。部署子路径为 `/0928_codex_project/003-grokbot-field-notes/`。页面使用相对资源路径和页内锚点，不依赖客户端路由。

已发布：[在线研究网页](https://yydshly.github.io/0928_codex_project/003-grokbot-field-notes/)。

2026-09-28 首次发布核验：提交 [`95b4c32`](https://github.com/yydshly/0928_codex_project/commit/95b4c321a7c3eac12bc03484026aa40229c3d3b9) 的 [GitHub Actions 部署](https://github.com/yydshly/0928_codex_project/actions/runs/36387455024) 成功。公网页面、SVG、PNG、交互脚本与样式均返回 HTTP 200，核验内容与该提交逐字节一致。从在线索引进入后，六项摘要、模块折叠、场景切换及手机布局正常。

本页是独立静态研究展示；原 Grok Bot 平台未复现。

## 文件

- `index.html`：网页结构和研究内容。
- `styles.css`：响应式样式、键盘焦点和减少动态效果适配。
- `product.css`：产品路径与问题案例的响应式样式。
- `understanding.css`：模块、成果、价值与使用路线的响应式样式。
- `app.js`：本地切换场景，无网络请求；模块折叠由原生 HTML 实现。
- `assets/field-notes-map.svg`：本仓库自制的工作闭环图。
- `assets/thursday-arena-study.svg`：本仓库依据游戏官网玩法自制的产品示意图。
- `assets/understanding-guide.svg`：本仓库依据固定版本研究与讨论绘制的全量理解引导图；1600 × 2160，可缩放，非官方图或产品截图。
- `assets/understanding-guide.png`：上述 SVG 的浏览器渲染导出，1600 × 2160，便于保存和分享。
- `QA.md`：本地浏览器、交互、响应式与预定子路径的验证记录。
