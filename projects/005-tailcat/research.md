# Tailcat 研究记录

## 研究问题与范围

1. Tailcat 的核心究竟是 P2P 连通、隧道，还是加密？
2. 没有 Tailscale 控制平面时，两端如何发现、认证并选择数据路径？
3. 哪些场景可以直接使用，哪些只是我们的延伸设想？

本文以 [tailscale/tailcat 固定提交 `a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8`](https://github.com/tailscale/tailcat/tree/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8) 为研究依据，查阅日期为 2026-09-28。该提交比当时的 [v0.7.0 发布版](https://github.com/tailscale/tailcat/releases/tag/v0.7.0) 更新。功能描述以固定提交的 README、SECURITY.md 和源码为准；未运行原程序或测试网络性能。

## 核心结论

**核心能力是按需建立可用的双端连接，优先 P2P 直连；WireGuard 加密是这条连接的安全机制。** 只做加密不能解决两端发现、NAT 和没有公网入口的问题。Tailcat 把这些网络问题与用户态 TCP/IP 栈、应用服务接口组合起来，让文件、端口或 SSH 会话在连接上运行。若直连失败，仍可经 DERP 中继，因此“使用 Tailcat”不保证物理路径一定是 P2P。[上游原理说明](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#how-it-works)

我们的概念划分：**NAT 穿透决定能否直连；DERP 是双方可主动访问的公网会合与中转节点；WireGuard 认证并加密两端之间的 IP 数据包。** DERP 在打洞失败时转发加密包，不解密应用内容。WireGuard 本身不替 Tailcat 完成地址交换、会合或路径选择。参见 [Tailscale DERP 文档](https://tailscale.com/docs/reference/derp-servers)与 [WireGuard 官方说明](https://www.wireguard.com/)。

## 能力地图与证据

| 层次 | 已实现的能力 | 上游依据 | 注意 |
| --- | --- | --- | --- |
| 连通 | DERP 引导与回退、STUN 端点发现、UDP 打洞 | [Connection flow](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#connection-flow) | 直连取决于网络环境 |
| 加密与身份 | WireGuard、预共享密钥、可选客户端公钥允许列表 | [Key Management](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#key-management) | 地址默认是秘密凭证 |
| 通用数据流 | stdin/stdout、TCP/UDP 接口、端口映射与本地转发 | [Usage](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#usage) | 按所服务的端口与模式开放 |
| 应用服务 | SSH、SFTP 文件收发、SOCKS5、出口节点 | [Usage](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#usage) | 高权限服务需单独设计授权 |
| 诊断与集成 | ping、perf、Go `Server` / `Client` 与监听接口 | [Go library](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#go-library)；[v0.7.0](https://github.com/tailscale/tailcat/releases/tag/v0.7.0) | 官方文档示例不是我们的实测 |
| 浏览器 | 实验性 WASM 文本与文件页面 | [README](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#tailcat) | 当前经 DERP 中继；WebRTC 直连仍是[议题](https://github.com/tailscale/tailcat/issues/4) |

## 连接流程与关键组件

```text
服务端                                  客户端
生成节点密钥、路径发现密钥与 PSK         通过带外渠道获得 tc 地址
连接 DERP 并公布 tc 地址                解析服务端公钥、PSK、DERP 信息
           └──────── DERP 发现握手 ────────┘
                 配置 WireGuard 对等节点
                 WireGuard 加密传输启动
                ╱                    ╲
       UDP 打洞成功：直连       打洞失败：DERP 转发
                ╲                    ╱
             gVisor netstack → TCP/UDP → 端口/SSH/文件等服务
```

### 1. 地址交换代替集中控制平面

服务端地址是 `tc` 前缀加 CBOR 数据的编码，包含 WireGuard 公钥、独立路径发现公钥、默认的 256 位预共享密钥和 DERP 区域或节点信息。双方仍需通过聊天、二维码等**带外渠道**交换地址；Tailcat 没有为此提供完整的账号、设备目录和集中权限管理。[地址格式](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#tailcat-addresses)；[地址编码源码](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/wire.go)

默认临时密钥让一次进程运行对应一次地址。保存密钥可跨重启复用，但要考虑此前获知地址的所有人。地址若进入公开 DNS TXT 记录，就失去保密性，服务端必须通过 `--allow` 或应用层公钥认证限制访问。[密钥管理](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#key-management)

### 2. DERP 负责会合与失败回退

服务端先连接地址指定的 DERP。客户端解析地址并连接相同区域，通过 DERP 发送 `Meow` 发现消息，包含客户端节点公钥；服务端将其加入对等节点配置并回复 `Meowed`，随后开始 WireGuard 握手。DERP 是初始会合通道，也是无法直连时的数据中继；它不是 Tailscale 控制平面。默认可用公共但限速的 DERP，也可以自建。即使是走中继，隧道中的应用数据仍由 WireGuard 端到端加密。[连接流程](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#connection-flow)；[自建 DERP](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#bring-your-own-derp-relay)

### 3. magicsock 尝试从中继升级到直连

`magicsock` 通过 STUN 探测公网端点，双方交换候选 UDP 地址并尝试打洞。成功后，数据路径升级为直接 UDP；失败则保留 DERP 路径。网络限制、NAT 类型和防火墙会影响结果，因此不能把“P2P 工具”理解为“永远直连”。路径发现还有独立的 disco 密钥，避免在直连探测帧里泄露 WireGuard 节点公钥。[Network stack](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#network-stack)；[路径发现源码](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/disco.go)

### 4. WireGuard 和用户态网络栈承载服务

用户态 WireGuard 加密两端的隧道流量。gVisor netstack 在进程内终止 TCP/IP 连接，并把流量交给选定的服务处理器或端口转发器。因此普通使用不需要 TUN/TAP 设备、管理员权限或全局路由修改。Go 库暴露 TCP/UDP 连接与监听能力，CLI 在其上实现文件、SSH 和其他操作。[Network stack](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#network-stack)；[核心库源码](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/tailcat.go)；[监听接口](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/listen.go)

## 使用场景与我们的扩展设想

| 场景 | 现成支撑 | 我们仍需完成的部分 |
| --- | --- | --- |
| 访问远端开发服务 | `serve` + `forward` / `browse` | 确定开放端口、客户端身份、会话时效 |
| 两人临时交换文件 | `recv`、`serve files`、`cp`、`ls` | 文件大小、留存、审计和恶意内容处理策略 |
| 远程维护个人设备 | SSH、端口转发与可选允许列表 | 密钥管理、撤销、故障恢复和监控 |
| 分布式 Agent 或设备通信 | Go 库的 TCP/UDP 接口 | 应用协议、端到端授权、发现与设备管理；这是设想，尚未实现 |
| 浏览器到设备的直连交互 | 现有实验性 WASM 页面 | WebRTC 路径与浏览器端安全设计；当前并非已有能力 |

### 对我们的具体价值

1. **学习边界清晰的网络分层：**地址交换负责引导，DERP 负责会合与回退，magicsock 负责路径优化，WireGuard 负责加密，netstack 负责把隧道转换成可用的应用连接。
2. **建立真实的选型标准：**个人临时连接可优先评估 Tailcat；稳定、多设备、多人权限场景还要评估身份管理与运维负担，不能仅凭是否能打洞选型。
3. **形成可复现实验：**将“可连通”和“可直连”分别记录，测量路径、时延、吞吐，并说明网络条件。当前研究尚无这些结果。

## 安全、限制与许可

- 地址默认包含预共享密钥，泄露后可能让他人连接。持久地址尤其需要客户端允许列表；绝不能公开没有其他认证的 `no-auth-ssh` 地址。[官方密钥说明](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#key-management)
- 上游明确说 Tailcat 包装层仍是早期实验工具，历史威胁模型偏向同一人控制两端。不互信方之间开放 Shell、可写目录、出口节点需要额外审查。[SECURITY.md](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/SECURITY.md)
- 公共 DERP 的速率限制会影响中继传输；官方 `perf` 测试默认等待直连，也避免把共享中继的限制误当成直连吞吐。[性能测试说明](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/README.md#measure-throughput-and-latency)
- 上游代码采用 [BSD-3-Clause](https://github.com/tailscale/tailcat/blob/a59f8011dd8aa5ab9f2445d66c4d4dd94eeaf7f8/LICENSE)。本仓库只整理文字和独立绘制图片，未复制上游源码、截图或基准数据。

## 复现与验证状态

已完成：查阅固定提交的 README、SECURITY.md、LICENSE、关键源码文件和 v0.7.0 发布记录；制作本仓库的流程图与概念展示页。

未完成：两台设备实际建立连接、不同 NAT 环境下打洞、DERP 回退、自建 DERP、SSH/文件权限测试和性能测量。展示页是解释机制的交互模型，不是联网模拟器或 Tailcat 原版运行结果。

后续实验应记录：Tailcat 二进制版本与构建提交、两端系统和网络类型、所选 DERP、实际路径、成功率、时延与吞吐，并仅在确实测得后填写结果。测试前先使用最小权限服务和临时密钥。
