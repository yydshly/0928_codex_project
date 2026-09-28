# Tailcat 静态研究展示

直接打开 [index.html](index.html) 即可阅读能力总览、技术原理、使用场景、产品方向、研究价值与安全边界。页面顶部的[完整理解总览图](assets/tailcat-understanding.svg)由本仓库依据上游固定提交及 WireGuard、DERP 官方说明独立绘制，可单独打开；手机上可在图内左右滑动。页面没有构建步骤、外部依赖、自动网络请求或真实 Tailcat 连接；“打洞成功 / 打洞失败”切换仅解释两种数据路径，不能用于测量性能或测试 NAT。

网页源码及依赖均在本项目 `web/` 内。Pages 工作流将网页与本项目的自绘图片复制到 `/0928_codex_project/005-tailcat/`。[在线研究网页](https://yydshly.github.io/0928_codex_project/005-tailcat/) 已于 2026-09-28 验证返回 200，首页入口、总览图和路径切换均可用。

事实与出处参见上一级 [README](../README.md) 和 [research.md](../research.md)。本页的文字、版式和交互代码由本仓库独立制作；并非 Tailcat 官方页面或真实运行结果。
