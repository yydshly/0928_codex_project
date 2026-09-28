# 005 · Tailcat：加密 P2P 连接能力研究

> Tailcat 的核心能力是让两端在复杂网络下建立按需连接：优先尝试 UDP 直连，失败时通过 DERP 中继，并始终使用 WireGuard 加密。加密是连接的安全基础，连通性才是它主要解决的问题。

| 项目资料 | 链接或说明 |
| --- | --- |
| 原仓库 | [tailscale/tailcat](https://github.com/tailscale/tailcat) |
| 原作者 / 组织 | Tailscale Inc. 与贡献者 |
| 研究依据 | [固定提交 `a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8`](https://github.com/tailscale/tailcat/tree/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8)，2026-09-28 查阅；当时最近发布版为 v0.7.0 |
| 研究状态 | 文档与源码结构研究；未在两台设备上运行原版，未测量性能 |
| 在线演示 | [Tailcat 研究网页](https://yydshly.github.io/0928_codex_project/005-tailcat/)；2026-09-28 已验证页面、图片和路径切换 |
| 本地展示 | [静态研究页](web/index.html)；只演示概念，不建立实际连接 |
| 详细记录 | [research.md](research.md) |

![Tailcat 完整理解总览：能力、DERP 与 WireGuard 原理、使用场景、个人价值和产品方向](web/assets/tailcat-understanding.svg)

图由本仓库根据上游 README 的 [How it works](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#how-it-works)、[WireGuard 官方说明](https://www.wireguard.com/)及 [Tailscale DERP 文档](https://tailscale.com/docs/reference/derp-servers) 独立绘制，是技术示意图，不是运行截图或测试结果。另有[连接流程图](assets/tailcat-flow.svg)可单独查看。

## 核心能力

Tailcat 不是单独的加密算法，也不是完整的 Tailscale 组网服务。它将 Tailscale 的数据通道组件组合成一个无需 Tailscale 账号与控制平面的双端连接工具。服务端生成 `tc...` 地址，客户端通过其他渠道获得该地址后连接；连接初始走 DERP，随后尝试 NAT 穿透并切换为直连。直连失败时仍可用中继传输。[来源](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#tailcat)

| 层次 | 已有能力 | 价值 |
| --- | --- | --- |
| 连通 | 双端发现、UDP 打洞、DERP 回退 | 在没有入站公网端口时仍尝试建立连接 |
| 保护 | WireGuard 端到端加密；地址默认包含预共享密钥 | 保护隧道流量；地址须按凭证管理 |
| 使用 | 标准输入输出、TCP/UDP、端口转发、SOCKS5、SSH、SFTP 文件服务、出口节点与性能测试 | 将隧道用于实际开发、运维和文件传输 |
| 集成 | Go 库；实验性浏览器 WASM 页面 | 可嵌入程序；浏览器版目前仅经 DERP 中继 |

这些能力分布在不同 CLI 服务和库接口中，不表示一个命令会自动开放所有服务。[功能清单](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#usage)

### 三个容易混淆的概念

- **NAT 穿透：**尝试让处在不同内网的两端建立直接 UDP 路径；这是优先方案，不保证每次成功。
- **DERP：**双方都能主动连接的公网会合与中转服务器。最初帮助两端取得联系；无法直连时转发已经加密的数据包。可用公共 DERP，也可自建。[Tailscale DERP 文档](https://tailscale.com/docs/reference/derp-servers)
- **WireGuard：**基于密钥的加密隧道协议，认证对端并加密 IP 数据包；它负责传输安全，不负责为 Tailcat 选择直连或中继路径。[WireGuard 官方说明](https://www.wireguard.com/)

## 实现原理

1. 服务端创建临时或持久密钥，并连接选定 DERP；生成的地址编码服务端 WireGuard 公钥、路径发现公钥、默认的预共享密钥与 DERP 信息。
2. 客户端从带外渠道获得地址，经相同 DERP 发送发现消息；服务端将客户端加入对等节点配置。双方完成 WireGuard 握手。
3. `magicsock` 结合 STUN 和路径发现协议交换候选 UDP 端点并尝试打洞。成功则流量改走直连；失败时经 DERP 中继。
4. 进程内的 gVisor netstack 处理 TCP/IP，向端口转发、SSH、文件服务等应用功能交付连接，因此通常无需修改系统路由、DNS 或使用 TUN 设备。

详见[逐步原理和证据](research.md#连接流程与关键组件)。

## 使用场景

- **临时远程访问：**访问开发机上的网页、数据库或 SSH 服务，无需配置公网入站端口。
- **按需文件传输：**在两台设备之间分享受限目录或接收文件；权限由服务配置决定。
- **嵌入式连接：**Go 应用使用库接口为特定 TCP/UDP 服务建立点对点传输。
- **网络诊断：**观察直连或 DERP 路径，并用内置性能测试比较网络条件；不能把官方示例数值当作本仓库实测。

## 对我们的意义

**最值得借鉴的是“连通层”的设计。**若未来要让分布在不同网络中的个人设备、开发工具或 Agent 安全通信，可研究它如何把地址交换、节点身份、NAT 穿透、加密和应用服务分层。初期可先验证“两台设备、一个授权端口”的最小场景，再决定是否需要更完整的身份管理、发现服务和多人协作能力。

它也适合作为本仓库的可复现实验案例：分别记录直连与中继的可达条件、时延、吞吐和故障原因。当前这些是**后续实验方向**，不是已经获得的结果。若只是让固定团队长期组网，还需要另外评估设备管理、权限策略和运维成本，不能仅凭 Tailcat 的双端隧道能力作结论。

## 可扩展产品方向（我们的设想，尚未实现）

| 方向 | 可以利用的现有基础 | 需要补齐 |
| --- | --- | --- |
| 个人远程工作台 | 端口转发、SSH、浏览访问 | 设备列表、细粒度授权、密钥轮换和撤销 |
| 一次性加密文件投递 | 文件接收与目录服务 | 限时链接、配额、清理、文件安全检查和收件人认证 |
| 分布式 Agent 安全通道 | Go 库的 TCP/UDP 接口 | 节点身份、任务协议、权限、审计和故障恢复 |
| 连接质量与中继诊断面板 | ping、perf 与路径状态 | 持续采集、历史记录、故障解释和自建 DERP 运维 |

这些产品会增加身份、权限、可靠性和运维责任；上游当前提供的是连接基础能力，不能把表中的方向当作现成功能。

## 边界与安全

- `tc...` 地址默认包含预共享密钥，通常是秘密访问凭证。公开到 DNS 或网页后，必须另配客户端公钥允许列表或服务层认证。
- 临时密钥在进程退出后失效；保存密钥可获得稳定地址，同时意味着过去拿到地址的人可能再次连接。
- 公共 DERP 有速率限制；浏览器实验版目前只使用 DERP，尚不能据此推断浏览器已支持直连。
- 上游 [SECURITY.md](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/SECURITY.md) 将 Tailcat 包装层描述为早期实验工具，提醒谨慎对不互信方开放 Shell、可写目录或出口节点。

## 图片、代码与许可

本项目的 SVG 和静态研究页为本仓库独立编写，未复制上游图片或代码，也没有运行真实 Tailcat 隧道。上游 Tailcat 使用 [BSD-3-Clause 许可证](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/LICENSE)；若后续复制或修改原代码，应保留要求的版权与许可声明。相关依赖和素材的许可仍需按实际使用内容分别核查。
