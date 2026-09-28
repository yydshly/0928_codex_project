# 思路探索台：运行与发布

纯静态网页，无构建步骤、无远程字体、无在线 AI 调用、无浏览器运行依赖。所有页面源代码与工具位于本目录。

## 本地运行

在仓库根目录执行：

```powershell
python -m http.server 8088 --bind 127.0.0.1 --directory projects/008-ai-money-maker-handbook/web
```

打开浏览器中的本地 8088 端口。也可直接打开 index.html；本地文件方式的剪贴板或存储支持因浏览器而异，建议 HTTP 预览。

## 目录与功能

- index.html：页面框架、首页与导航。
- styles.css：桌面与手机样式。
- data.js：三个个人探索方向。
- catalog.js：514 篇固定版本的标题和来源元数据。
- views.js：能力研究、资料库、个人试验和来源视图。
- app.js：搜索分页、收藏、组合、草稿、成本和导出。
- assets/idea-map.svg / idea-map.png：本研究独立绘制的完整总览，覆盖六要素、八类方向与持续产品化。SVG 为编辑源，PNG 为 1800 × 2800 高清导出。
- UPSTREAM-LICENSE.txt、NOTICES.md：上游许可与内容归属。
- tools/build-index.py：从解压后的固定版本生成元数据。
- tools/check-page.cjs：在本地 HTTP 服务上验证关键交互。

## 个人记录

草稿与收藏使用当前浏览器的 localStorage，键为 idea-fieldnotes-008-v1。没有账号、服务器保存或跨设备同步。导出生成用户当前填写的 Markdown 文件；复制功能受浏览器剪贴板权限影响，不可用时提示导出。

网站源文件只包含用户在对话中确认的概括性背景，不包含未来的需求笔记、联系方式或客户资料。浏览器里的草稿不会自动进入 Git 提交和网页发布。

## 已有仓库的发布子路径

沿用现有仓库 GitHub Pages 发布流程：
- 已部署子路径：/0928_codex_project/008-ai-money-maker-handbook/
- 汇集产物目录：_site/008-ai-money-maker-handbook/
- 只复制 index.html、styles.css、data.js、catalog.js、views.js、app.js、NOTICES.md、UPSTREAM-LICENSE.txt 及 assets/。
- research.md、personal-value.md、sources/ 和验证工具不进入网页发布目录。
- 使用相对资源路径和 hash 导航，子路径访问与刷新无需服务器路由回退。

已发布：[在线研究网页](https://yydshly.github.io/0928_codex_project/008-ai-money-maker-handbook/#map)。首次部署提交 `1a696c1`，对应 [GitHub Actions 成功记录](https://github.com/yydshly/0928_codex_project/actions/runs/36407996142)。

2026-09-28 公开环境验证通过：页面及引导图 PNG/SVG、许可与归属文件返回 HTTP 200；514 篇索引可搜索、收藏刷新后保留；五个视图在 390px 无横向溢出；hash 刷新和根站点入口正常，没有浏览器运行错误。

## 验证记录

2026-09-28 本地通过：
- 四个 JavaScript 文件（app、views、data、catalog）的语法检查。
- 全部五个视图正常加载，没有浏览器运行错误。
- 索引 514 篇，20 条分页；按关键词、系列、主题及收藏筛选，零结果提示。
- 创业问答标题提取没有退化成“标题：”。
- 详情对话框及 Escape 关闭、方向带入。
- 草稿刷新后保留，收藏保留。
- 用户输入的 HTML 样式文本按文本显示。
- 组合想法带入时保留已有观察记录。
- 成本算例：3 小时 × 100 元 + 20 元 = 320 元；拟报价 500 元，差额 180 元。
- 导出 Markdown 内容与界面填写一致。
- 清空草稿有确认，取消不清空。
- 390px、768px 所有视图无横向溢出；1440px 桌面截图已检查。

验证使用环境提供的 Playwright 和已安装 Chrome，不要求网页使用者安装。可用 NODE_PATH 指向环境的 Playwright 包后运行 tools/check-page.cjs。该脚本在独立浏览器环境中使用测试数据，不会改动用户的浏览器草稿。

市场需求、询单、报价接受、交付效果和收益未实测。

## 完整图更新

总览图已扩展为案例收集与商业思考的六要素、八类内容（重点图文、音频、直播、绘本）、扩展方法和产品化循环。SVG 在 tools/build-overview.py 中生成，PNG 由浏览器内嵌 SVG 渲染导出。已核对图中文字宽度、真实图像、网页加载与下载链接、390px 布局。现有功能与后续设想分别注明。
