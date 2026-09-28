# Storm-Breaker 研究记录

## 研究问题

- 访问网页后，哪些信息能直接读取？
- 精确位置、摄像头和麦克风各自在哪一步要求授权？
- 原项目如何将页面模板、前端采集、后端接收及面板展示串起来？

## 原项目概况

- 仓库地址：https://github.com/ultrasecurity/Storm-Breaker
- 查阅版本：`4d7235104870ec0224f445fd905c98f22a105426`（`main` 上 2024-10-12 的提交；2026-09-27 查阅）。
- 原项目包含 Python 启动脚本、JavaScript 前端、PHP 页面及接收端。README 将其描述为社工工具，列出设备信息、位置、摄像头和麦克风等能力。

## 结构与工作原理

1. [页面模板](https://github.com/ultrasecurity/Storm-Breaker/tree/main/storm-web/templates)提供访问者看到的内容。
2. [环境信息脚本](https://github.com/ultrasecurity/Storm-Breaker/blob/main/storm-web/assets/js/loc.js)读取系统、浏览器、分辨率、时区、语言等信息，并调用外部 IP 查询服务。
3. [定位脚本](https://github.com/ultrasecurity/Storm-Breaker/blob/main/storm-web/assets/js/location.js)调用 `navigator.geolocation.getCurrentPosition()`；[摄像头页面](https://github.com/ultrasecurity/Storm-Breaker/blob/main/storm-web/templates/camera_temp/index.html)调用 `getUserMedia()`；[麦克风脚本](https://github.com/ultrasecurity/Storm-Breaker/blob/main/storm-web/templates/microphone/js/_app.js)调用 `getUserMedia()` 并处理录音。
4. PHP 页面负责接收和写入结果；[Python 启动脚本](https://github.com/ultrasecurity/Storm-Breaker/blob/main/st.py)启动本地 PHP 服务。

原 README 中「无需权限获取设备信息」只适用于部分环境信息。精确位置、摄像头和麦克风受浏览器许可与安全上下文约束，参见 [MDN Geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) 和 [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)。

## 完整能力清单（所研究提交）

下表把原作者 README 列出的四项采集能力，与源码中可见的页面、管理和运行能力分开。它是提交 `4d7235104870ec0224f445fd905c98f22a105426` 的功能盘点，并不声称每项都已在所有平台验证。

| 层面 | 源码具备的能力 | 实现与边界 |
| --- | --- | --- |
| 访客页面 | `nearyou`、`weather`、`camera_temp`、`microphone`、`normal_data` 五套模板 | 页面主题主要用于引导访问或权限请求；没有“附近的人匹配”或真实天气查询服务。 |
| 环境信息 | 操作系统及版本、浏览器及版本、CPU 架构、屏幕分辨率、时区、语言、逻辑处理器数量 | `assets/js/loc.js` 借 ClientJS 与 Navigator 读取，再发往模板的 `handler.php`；不等于读取磁盘文件或完整设备身份。 |
| 公网 IP | 向外部 IP 查询服务获取并回传访问者的公网 IP | 依赖第三方服务及浏览器网络状况；源码对部分浏览器采用不同分支，不能保证总能获得。 |
| 位置 | 两套主题页面经点击调用 `getCurrentPosition()`，把坐标构成地图链接回传 | 浏览器定位与许可决定能否得到坐标；无访客之间共享位置或附近人搜索。 |
| 摄像头 | 页面加载后请求视频流，将画面定时绘入隐藏 Canvas，编码为 PNG 并提交 | 需要摄像头权限；保存的是截取的图片，不是实时视频直播。本机虚拟设备测试确认了图片落盘。 |
| 麦克风 | 页面加载后请求音频流，用 Recorder.js 分段导出 WAV 并尝试上传 | 需要麦克风权限。本机测试只确认了面板通知，未确认音频文件落盘。 |
| 数据接收 | 各模板的 `handler.php` 写 `result.txt`；相机 `post.php` 写图片；音频 `upload.php` 尝试写录音 | 采用 PHP 和本地文件，没有数据库或完整的按访客归档系统。`upload.php` 在检查保存结果前就写入成功通知。 |
| 管理面板 | 登录、自动列出模板链接、复制链接、查看文字结果、地图及媒体通知、打开结果链接 | `panel.php` 与 `assets/js/script.js` 提供基本操作；面板约每两秒请求一次 `receiver.php`，后者读取并清空模板暂存文本。 |
| 面板操作 | 暂停或恢复监听、下载当前显示的文字日志、清空当前显示的文字日志 | 暂停只停止面板轮询，不会让访客页面停止提交；清空按钮只清除当前浏览器的文字框，并非删除服务器文件。 |
| 运行维护 | Python 脚本检查依赖和版本，启动及停止本机 PHP 服务并记录进程；面板也检查版本 | 安装脚本含多平台依赖安装及 Ngrok 下载逻辑，但运行脚本不自动创建公网入口；作者说明可自行部署到 PHP 主机。 |

这里的“功能具备”指代码中有相应路径，不代表在当前浏览器、系统和网络条件下必然成功。媒体访问与定位由浏览器权限控制；本仓库的复现结果见下节。

## 复现过程

2026-09-27 在 Windows 本机复现了原仓库提交 `4d7235104870ec0224f445fd905c98f22a105426`。原版代码由 `prepare-original.ps1` 拉取到被 Git 忽略的 `upstream/`；PHP 8.5.11 官方 Windows 便携包下载到被 Git 忽略的 `.runtime/`，并与 [官方 SHA-256](https://www.php.net/downloads.php?os=windows) 核对。直接运行原仓库的 `storm-web/`，服务只绑定 `127.0.0.1:2525`，未使用公网隧道或部署地址。

自动化浏览器登录了原版面板，并确认它列出五条原版模板链接。随后使用**虚拟摄像头和麦克风**、模拟经纬度 `31.2304, 121.4737`、保留作示例的 IP `203.0.113.7` 逐项访问原版模板。对外请求被拦截；IP 查询由测试浏览器返回示例值。原版面板中实际出现了环境信息、Google Maps 坐标链接、图像保存通知和音频保存通知。`images/` 目录中确实产生了约 20 KB 的虚拟摄像头图片；`sounds/` 目录中**没有找到对应录音文件**。原版 `upload.php` 在检查 `move_uploaded_file()` 是否成功之前就写入“已保存”通知；其文件名包含 ISO 时间字符串，在 Windows 上可能也会导致路径无效。因此音频通知只能证明上传请求走到了接收脚本，不能证明文件落盘。测试没有使用真实个人位置或真实摄录设备，也未运行原项目的安装脚本。

`normal_data` 模板在浏览器控制台出现 `gsap is not defined`，但环境信息仍成功提交。这说明该模板至少有一处页面脚本问题；不据此推断所有浏览器或平台的表现。

## 本仓库实验与改动

本仓库提供原版拉取及启动脚本；原版文件保持在被 Git 忽略的本地目录，没有复制进本仓库历史。`assets/original-nearyou-local.png` 是原版访客模板在请求定位前的截图；`assets/original-panel-virtual-test.png` 是原版面板使用虚拟输入后截取的结果图。图像出处和许可限制见[项目说明](README.md#原版效果)。另制作了一个零依赖的独立原理说明页，先并排展示这两张原版实测截图，再以自制的 `assets/storm-breaker-understanding.svg` 一图汇总项目定位、内部模块、能力和效果、权限边界、使用场景、研究价值与产品扩展方向。网页随后逐项解释原版实现，并模拟「打开页面 → 观察可用信息或权限请求 → 查看结果」的体验。该说明页默认使用样例内容，另提供明确触发的本机验证：环境信息只在页面显示；定位只显示在本机；摄像头只做本地预览；麦克风只显示音量变化。说明页不包含上传端点或原项目代码。`assets/demo-desktop.png` 是现行说明页的完整截图，嵌入的原版画面来源已标注。

## 结论与后续

- 原项目的关键在于社工页面与标准浏览器 API 的组合，不是浏览器权限绕过。
- 原版在本机的虚拟设备测试已验证环境信息、模拟位置和摄像头图片的回传及音频上传通知；音频文件落盘未成功验证。尚未验证它在其他平台或真实设备上的稳定性。
- 位置、摄像头和麦克风是可组合的浏览器基础能力。安全教育适合在授权环境中演示；现场记录、限时位置共享、远程协作只是可能的产品方向，原库没有对应的完整业务流程。是否值得扩展，要从具体任务出发，并补齐明示同意、时效与撤销、访问控制、可靠保存和删除机制。
- 后续可进一步审查存储、面板认证、权限失败路径以及不同浏览器差异；所有实际测试应使用自有设备或获得明确授权的环境。
- 原仓库根目录未见明确 `LICENSE` 文件。本仓库没有纳入原项目源码；两张本机运行截图仅作注明来源的研究记录，不代表取得界面再利用许可。

## 参考资料

- [原仓库与 README](https://github.com/ultrasecurity/Storm-Breaker)
- [所研究的提交](https://github.com/ultrasecurity/Storm-Breaker/tree/4d7235104870ec0224f445fd905c98f22a105426)
- [MDN：摄像头和麦克风权限](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [MDN：定位权限](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
