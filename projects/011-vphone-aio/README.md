# 011 · vphone-aio：Mac 上的虚拟 iPhone 整合包

> 面向 Apple 芯片 Mac 的虚拟 iPhone 启动整合包。以 Bash 脚本为入口，补齐压缩包分片、合并解压预制环境、启动虚拟机，并转发 VNC 与 SSH 端口；虚拟化和固件处理能力主要来自上游 vphone-cli。

![vphone-aio 启动流程：Apple 芯片 Mac 上的脚本准备运行环境并启动虚拟 iPhone](assets/vphone-aio-flow.svg)

图由本仓库依据所研究的 [vphone-aio 提交](https://github.com/34306/vphone-aio/tree/1db79dccd95391d6247c41f3cc4eac523567f295) 的 README 和脚本独立绘制，仅表示组件关系；不是原项目截图或运行结果。

| 项目资料 | 链接或说明 |
| --- | --- |
| 原仓库 | [34306/vphone-aio](https://github.com/34306/vphone-aio) |
| 原作者 | [34306](https://github.com/34306) |
| 研究版本 | [`1db79dcc`](https://github.com/34306/vphone-aio/tree/1db79dccd95391d6247c41f3cc4eac523567f295) |
| 核心上游 | [Lakr233/vphone-cli](https://github.com/Lakr233/vphone-cli) |
| 研究状态 | 已完成简要源码与文档整理；未在本机运行 |
| 在线演示 | 暂无 |
| 研究记录 | [research.md](research.md) |

## 能力与原理

仓库主要交付一个启动脚本和拆分的 `vphone-cli.tar.zst` 归档。脚本检查所需工具，下载缺失分片，合并、解压归档，运行其中的 `boot.sh`，并用 `iproxy` 将 SSH 与 VNC 连接转到本机端口。上游 `vphone-cli` 利用 Apple 芯片 Mac 的虚拟化框架和研究用固件组件运行虚拟 iPhone。此整合包的 README 对应 iOS 26.1、预装越狱环境；上游新版的能力不能直接视为该归档已包含的能力。

## 场景与个人价值

适合作为 iOS 虚拟化与研究环境打包方式的案例，供应用调试、安全研究或测试环境设计参考。对本仓库而言，主要价值是理解“复杂上游能力如何通过脚本降低启动门槛”；无需继续深挖此包装脚本。若以后需要实际运行、自动化或跟进新版 iOS，应优先评估持续维护的上游 `vphone-cli`。

## 边界与来源

原项目要求 Apple 芯片 Mac，并要求修改宿主机安全设置；README 建议预留超过 128 GB 空间。本研究没有在当前 Windows 环境运行原版，也未验证应用兼容性或性能。所研究的 `vphone-aio` 仓库根目录未见独立 LICENSE，不能仅凭上游 [MIT 许可](https://github.com/Lakr233/vphone-cli/blob/main/LICENSE)推定整合包、预制归档或固件的复用许可。本仓库仅撰写说明和自绘示意图，未复制原归档或固件。

[原仓库](https://github.com/34306/vphone-aio) · [固定研究版本](https://github.com/34306/vphone-aio/tree/1db79dccd95391d6247c41f3cc4eac523567f295) · [上游项目](https://github.com/Lakr233/vphone-cli) · [研究记录](research.md)
