# Buzz 中文版与原版实测展示页

这是独立编写的静态研究页，分别展示上游固定提交 README 中的四张截图，以及 2026-09-29 本仓库运行官方客户端的私密频道截图和中文修改版的三张操作截图；并整理架构、能力、使用场景和可参考价值。网页本身不连接 relay，也不是 Buzz 客户端。浏览器直接打开 `index.html` 即可查看；网页仅使用本目录的 HTML、CSS、JavaScript、图片和许可证副本，无外部依赖。实测过程见 [runtime.md](../runtime.md)。

本次发布采用的 GitHub Pages 子路径为 `/0928_codex_project/012-buzz/`。发布流程只复制页面、样式、前端脚本、图片和上游许可；本地服务与图像生成脚本不进入站点。相对资源地址可在该子路径下工作。实际发布并验证之前，根索引不填写公共演示 URL。

四张上游图片来自 [block/buzz 固定提交的截图目录](https://github.com/block/buzz/tree/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots)，依据上游 Apache-2.0 许可使用。`local-private-channel.png` 是本仓库本机操作时截取的真实桌面客户端画面，测试数据由本仓库创建。网页排版与中文说明由本仓库编写。

中文版截图为 `zh-channel.png`、`zh-language-settings.png`、`zh-agent-setup.png`，均来自本机真实运行的源码修改版。详情见 [中文版说明](../localization/README.md)。

在此目录运行 `node serve.mjs`，即可通过本机 `http://127.0.0.1:4173/#chinese` 查看中文版本专区；该地址不对公网提供服务。

## 理解汇总

新增 `#understanding` 专区：三层分工、消息推送路径、业务示例，以及身份识别、响应权限、会话控制和多 Agent 接力的可展开说明。内容与 [understanding.md](../understanding.md) 对齐，区分本机实测、源码核对与尚未验证的业务能力。展开操作采用浏览器原生详情控件，不连接模型或业务系统。

## 一图总览

`#overview` 展示本仓库原创的六部分研究总览，矢量源为 `assets/buzz-overview.svg`，高清图片为 `assets/buzz-overview.png`。2026-09-29 根据固定源码、讨论汇总和本机验证绘制，非上游截图。`node build-overview.mjs` 可重新生成 SVG；PNG 由浏览器按 1920 × 2180 原尺寸渲染导出。内容和来源依据见 [understanding.md](../understanding.md)。

## 本次产品理解更新

首页沿用已生成的 Buzz 引导图，新增六项摘要与 `#product` 产品方向：Agent 定制后台、统一运行服务、平台连接器；分别说明外部群聊、语音视频会议与 API / SDK 交付的效果、所需开发和实测边界。站点仅公开研究页面与图片，本机 relay、客户端、数据和模型服务不随网页部署。
