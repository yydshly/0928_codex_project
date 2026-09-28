# Personal Edge Proxy · 完整理解研究网页

直接打开 [index.html](index.html) 可离线阅读。页面包含能力定位、使用端与 VPS 和目标端之间的请求/响应、入口与出口切换、内部机制、HTTPS 边界、个人价值、场景与扩展方向，并提供一张 [SVG 完整总览图](assets/personal-edge-proxy-overview.svg) 和可保存的 [PNG 图片](assets/personal-edge-proxy-overview.png)。

## 交互范围

新增“协议原理”章节，解释 HY2、VLESS、SOCKS5 的代理职责，REALITY 的传输安全、Vision 的条件优化，以及 WARP 服务与 MASQUE 隧道体系的关系；并将协议放回实际接入和出站链路。完整总览图已同步扩展为 1800 × 3600。TCP / UDP / QUIC、TLS、WebSocket、TUN 与执行程序也分别标明了层次。

- HY2 / REALITY 两个入口选项。
- Direct / WARP / 固定 SOCKS5 三个出口策略选项。
- 接住请求、进入 VPS、认证分流、连接目标、返回响应五个阶段。
- 切换时更新路径、最终出口 IP 的类型和对应原理说明；不发起任何代理、测速或目标网站访问请求。

页面是本仓库独立制作的解释工具，不是代理客户端或管理面板；原方案仍未部署实测。事实与引用见上一级 [README](../README.md)、[research.md](../research.md) 与网页末尾来源列表。

## 源码与运行

本页使用 HTML、CSS 和原生 JavaScript；无运行依赖、无构建步骤、无外部字体或自动外部请求。所有网页源码和图片均位于本目录。

总览图由 `tools/generate-overview.py` 使用 Python 标准库生成 SVG，`tools/check-page.cjs` 可通过本机 Playwright 与 Edge 将 SVG 渲染为 1800 × 3600 PNG，并检查交互、相对链接和移动布局。这些工具不是网页运行依赖。图片为原创技术信息图，没有使用上游截图或虚构实测画面。

## 站点集成与发布路径

沿用仓库现有 GitHub Pages 发布方式，预定子路径为 **`/0928_codex_project/006-personal-edge-proxy/`**。工作流将 `index.html`、`styles.css`、`app.js` 和 `assets/` 复制到该目录，不发布图像生成与检查脚本。站点首页已加入第 006 个项目入口。

**本次尚未向远端推送或发布，不能将预定子路径视为已上线地址。**页面可在本地独立打开或通过本机 HTTP 服务预览。公开发布成功并确认页面、图片与交互正常后，再补已验证的公网链接。

## 本次验证

2026-09-28 已完成桌面和手机截图检查；检查 2 种入口 × 3 种出口 × 5 个阶段的概念交互，以及循环返回第一步、图片和本地链接。1440、900、390、320 像素视口未发现页面整体横向溢出。表格允许在自身容器内横向滚动；无网页脚本异常。以上仅证明研究网页的显示与交互，不证明真实代理链路的可达性。
