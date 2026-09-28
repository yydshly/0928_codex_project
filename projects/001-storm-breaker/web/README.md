# Storm-Breaker 原理说明页

本目录是独立编写的静态网页，无第三方运行依赖、服务端接收程序或构建步骤。页面先展示本机运行原仓库时截取的**访客模板和管理面板实测画面**，再用[一张总览图](assets/storm-breaker-understanding.svg)汇总模块、基础能力、实现原理、可见效果、研究价值及按需扩展的场景。下方还有独立制作的本机交互实验和逐项技术说明。静态网页本身不运行原项目，也不采集访问者数据。要打开原仓库自带的页面和管理面板，请先阅读[原版运行说明](../README.md#原版效果)。

## 本地查看

在此目录启动任意静态文件服务器，例如：

```sh
python -m http.server 8000
```

然后打开 `http://localhost:8000/`。也可以直接打开 `index.html` 查看截图和模拟流程；真实权限验证建议使用 `localhost`。页面中的“在本机打开原版”链接只在原版服务运行于 `127.0.0.1:2525` 时可用，其中摄像头和麦克风模板加载后会尝试请求权限。独立实验默认只展示样例数据；点击「在本机验证」才会读取本机信息或触发浏览器权限弹窗。摄像头画面及麦克风音量只在当前页面处理，不录制、不上传。关闭页面或切换模块时会停止媒体流。

## 发布约定

GitHub Pages 发布子路径为 `/0928_codex_project/001-storm-breaker/`，已验证的公开地址是 [在线研究网页](https://yydshly.github.io/0928_codex_project/001-storm-breaker/)。公开页面仅包含本目录的静态研究内容，不部署原版 PHP 服务；原版入口只在本机打开页面时启用。非 `localhost` 环境中的真实位置、摄像头和麦克风验证需要 HTTPS。

## 来源

页面布局、[总览图](assets/storm-breaker-understanding.svg)、插图和演示脚本由本仓库独立制作，未复制原项目源码。总览图在子项目 `../assets/` 中留有同图副本。原版画面使用本仓库运行所研究提交时自行截取的 `assets/original-nearyou-local.png` 和 `assets/original-panel-virtual-test.png`；它们是子项目 `../assets/` 中同名研究截图的静态网页副本。后者使用示例 IP、模拟位置和虚拟媒体设备，音频通知不证明文件落盘。原仓库未见明确 `LICENSE` 文件，截图仅作研究说明。研究对象：[ultrasecurity/Storm-Breaker](https://github.com/ultrasecurity/Storm-Breaker)，查阅提交 `4d7235104870ec0224f445fd905c98f22a105426`。
