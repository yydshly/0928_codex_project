# vphone-aio 简要研究记录

研究日期：2026-09-28。研究对象：[34306/vphone-aio，提交 `1db79dcc`](https://github.com/34306/vphone-aio/tree/1db79dccd95391d6247c41f3cc4eac523567f295)。依据公开 README、[`vphone-aio.sh`](https://github.com/34306/vphone-aio/blob/1db79dccd95391d6247c41f3cc4eac523567f295/vphone-aio.sh) 和上游项目文档整理；未下载约 12 GB 的归档，未运行虚拟机。

## 摘要

`vphone-aio` 是在 Apple 芯片 Mac 上运行虚拟 iPhone 的整合入口。它不是独立实现的虚拟化引擎。脚本检查 `swift`、`iproxy` 等工具；缺少分片时下载；将 `vphone-cli.tar.zst.part_*` 合并解压；启动 SSH、VNC 的 `iproxy` 转发；最后运行归档内的 `boot.sh`。依赖工具由使用者按 README 预先安装，脚本不负责完整的宿主机配置。

底层虚拟机、固件准备和系统启动依赖 [Lakr233/vphone-cli](https://github.com/Lakr233/vphone-cli)。上游说明其使用 Apple `Virtualization.framework` 与 PCC 研究虚拟机基础设施；[早期技术记录](https://github.com/wh1te4ever/super-tart-vphone-writeup)描述了虚拟设备配置、固件组合和启动链修改。该技术背景解释了虚拟 iPhone 的来源，但此仓库自身主要是分发与启动包装。

## 使用与研究边界

- 整合包 README 标明 iOS 26.1 和预装越狱环境；通过本机 `5901` 端口访问 VNC，通过 `22222` 端口访问 SSH。
- 原 README 要求 Apple 芯片 Mac、关闭 SIP 并调整 AMFI，建议预留超过 128 GB 空间。当前 Windows 环境没有运行验证。
- 上游 `vphone-cli` 已持续更新并提供新版虚拟机管理与 API；这些新版功能不应直接写成旧整合包的既有能力。
- 本仓库未见 `vphone-aio` 独立 LICENSE；[上游代码为 MIT](https://github.com/Lakr233/vphone-cli/blob/main/LICENSE)。预制归档和 Apple 固件应分别核对来源与授权。
- 本仓库的 `assets/vphone-aio-flow.svg` 为独立绘制的流程示意，不是原项目截图。没有发布演示或声称实际启动成功。

结论：按“脚本化交付复杂研究环境”的案例收录即可。若出现实际 iOS 测试需求，再评估上游当前版本、硬件要求和兼容性。
