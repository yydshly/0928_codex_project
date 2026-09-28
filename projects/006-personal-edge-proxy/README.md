# 006 · Personal Edge Proxy：个人代理架构能力研究

> 这个仓库提供个人代理的部署思路、说明文档和脱敏配置示例。它把“客户端如何连接 VPS”与“VPS 使用哪个出口访问目标”分开处理；可形成类似个人 VPN 的日常使用体验，但不是独立 VPN 内核、现成 VPN 服务或一键部署程序。

| 项目资料 | 链接或说明 |
| --- | --- |
| 原仓库 | [yding-git/personal-edge-proxy](https://github.com/yding-git/personal-edge-proxy) |
| 原作者 / 组织 | yding-git；许可证版权声明为 StarryRain |
| 研究依据 | [固定提交 `ff55bdf0429e927c97e304e03ee4b322f12d32e2`](https://github.com/yding-git/personal-edge-proxy/tree/ff55bdf0429e927c97e304e03ee4b322f12d32e2)，2026-09-28 查阅 |
| 研究状态 | 已核对 README、服务端配置示例、客户端示例与出口说明；未部署到 VPS，未实测网络表现 |
| 在线演示 | 暂无；本项目没有已验证的公开演示地址 |
| 本地研究网页 | [完整理解与交互展示](web/index.html)；网页已验证，尚未发布 |
| 一图总览 | [高清 SVG](web/assets/personal-edge-proxy-overview.svg) · [PNG 图片](web/assets/personal-edge-proxy-overview.png) |
| 详细记录 | [research.md](research.md) |

[![Personal Edge Proxy 完整理解：能力定位、客户端与 VPS 和目的端交互、两层加密、内部机制、个人价值、能力边界及扩展路线](web/assets/personal-edge-proxy-overview.png)](web/assets/personal-edge-proxy-overview.svg)

图由本仓库依据上游 [README](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/README.md)、[Xray 服务端配置示例](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/xray-server.example.jsonc)及 HY2 / Xray 官方文档独立绘制，是概念图，不是原项目截图或实测结果。另保留[简版架构图](assets/architecture.svg)。

## 理解摘要

| 维度 | 我们的结论 |
| --- | --- |
| 库的能力 | 提供 HY2 与 VLESS/REALITY/Vision 接入、Xray 按目标选择 Direct/WARP/固定 SOCKS5 的个人代理部署说明和配置范例 |
| 底层本质 | 以 VPS 为中转和路由节点，组合现有代理核心、传输协议与出口服务，构成个人网络网关；可获得类似 VPN 的出网体验 |
| 实现原理 | 客户端接管并筛选请求，经加密代理通道送到 VPS；VPS 认证分流，选定出口连接目标，响应沿代理链返回应用 |
| 使用场景 | 个人出网、开发工具和 AI 服务访问、按目标管理出口、UDP 受限时使用 TCP 备用入口，以及按需维持固定最终 IP |
| 对我们的价值 | 沉淀入口/出口解耦、协议分层和故障定位方法；保留为未来自建网关、配置校验与出口观测工具的参考，实际收益需部署验证 |

引导图采用本仓库已生成的完整总览图，覆盖上述摘要与协议细节。以下说明以固定研究提交为依据，扩展设想与实测状态分别标注。

## 阅读与交互展示

[研究网页](web/index.html)将本次理解按请求旅程、能力地图、内部机制、加密边界、个人价值和扩展方向展开。可切换 HY2 / REALITY 与 Direct / WARP / 固定 SOCKS5，逐步观察客户端如何接管请求、VPS 如何认证分流、最终出口如何连接目标，以及响应怎样返回；所有交互都是概念说明，不发起真实代理连接。完整总览图可单独放大或保存。

网页已经过桌面、手机显示和交互验证。预定发布子路径、运行方法与验证范围见[网页说明](web/README.md)；尚未公开发布。

## 它是不是搭建个人 VPN 的能力库？

**可以把它作为搭建个人代理通道的参考资料，但“个人 VPN 能力库”不够准确。**上游没有提供新开发的 VPN 协议实现、可直接安装的成品服务或自动部署脚本；核心资产是现有 Xray、Hysteria2、Cloudflare WARP 等组件的组合方法和配置范例。客户端启用 TUN 后，应用流量可以按规则进入代理，使用体验可能类似 VPN；实际传输仍由所选代理协议、VPS 和出口路由承担。它也不是让个人设备直接组成私有网络的方案，关注点是经 VPS 访问目标服务。[上游 README](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/README.md) · [客户端 TUN/Rule 示例](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/v2rayn-hysteria2.example.md)

## 已有能力

| 层次 | 上游提供的方案 | 解决的问题 |
| --- | --- | --- |
| 客户端初步分流 | v2rayN 的 TUN / Rule 使用示例 | 决定哪些流量直连，哪些进入 VPS |
| 主入口 | Hysteria2，基于 UDP / QUIC / TLS | 日常接入 VPS |
| 备用入口 | VLESS + REALITY + Vision，经 TCP 接入；Cloudflare Tunnel 仅作为可选应急思路 | UDP 受限时提供独立接入路径 |
| 服务端出口 | VPS Direct、WARP 本地 SOCKS5、可选固定上游 SOCKS5 | 按目标选择最终公网出口 |
| 服务端规则 | Xray 域名路由、私网地址阻断、指定目标固定出口失败时不自动回落 | 集中管理目标与出口之间的关系 |

上游服务端示例实际包含 HY2 与 REALITY 入站，以及 Direct、WARP、固定 SOCKS5、block 出站；Cloudflare Tunnel 没有出现在该配置示例中。固定 SOCKS5 与 WARP 都需额外服务或配置，不能仅凭复制 JSONC 文件获得。[服务端配置示例](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/xray-server.example.jsonc)

## 底层原理

### 代理协议与组合关系

网页新增[协议原理](web/index.html#protocols)章节，总览图同步补充协议分工：

| 名称 | 所处层次 | 简单原理 |
| --- | --- | --- |
| Hysteria2 / HY2 | 主入口代理协议 | QUIC 加密连接上认证，再发送目标地址；TCP 用 QUIC 流承载，UDP 用数据报承载 |
| VLESS | 备用入口代理协议 | 携带用户标识、目标与转发指令；研究配置未启用 VLESS 额外加密，配合 REALITY 使用 |
| REALITY | 传输安全层 | 修改 TLS 握手与验证，结合密钥识别连接并借用目标站点的 TLS 外观 |
| XTLS Vision | 流控与转发优化 | 早期握手填充；对符合条件的 TLS 1.3 数据直接搬运已有密文，减少重复处理 |
| SOCKS5 | 出口侧代理协议 | 协商认证、发送目标地址、转发；本例接本地 WARP 或远程固定上游，自身不提供传输加密 |
| WARP / MASQUE | 出口服务 / 隧道协议体系 | Xray → 本地 SOCKS5 → warp-svc → MASQUE 隧道 → Cloudflare 出口 |

TCP / UDP / QUIC 是传输层相关机制，TLS 提供传输保护；TUN 是虚拟网卡接口，Xray / sing-box 是实现程序。上游可选的 VLESS + WebSocket + Cloudflare Tunnel 路径中，WebSocket 承载数据，Tunnel 将边缘流量送至 VPS，但当前没有对应配置示例。详细来源与当前版本边界见[网页引用](web/index.html#sources)。

### 请求路径

1. 客户端按规则选出需要代理的流量，通过 HY2 主入口或 REALITY 备用入口发送到 VPS。
2. VPS 上的 Xray 根据请求目标与规则选择出站。示例将普通流量送往 VPS 原生网络、部分 AI 相关域名送往 WARP、可选的 Claude / Anthropic 域名送往固定 SOCKS5。
3. WARP 在 VPS 上以本地 SOCKS5 代理形式提供给 Xray；系统默认路由仍可保持 VPS 原生网络。固定 SOCKS5 则是另一条独立的上游路径。

**入口决定如何到达 VPS，出口决定目标服务看到哪个公网地址。**切换 HY2 与 REALITY 本身不会改善或固定出口 IP。[WARP 出口说明](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/docs/warp-outbound.md) · [固定 SOCKS5 说明](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/docs/static-socks.md)

## 使用场景与边界

- **个人远程访问与开发测试：**有自己的 VPS，希望按设备和目标选择代理路径。
- **UDP 环境不稳定：**保留 TCP 备用入口，提高接入方式的弹性；是否更稳定取决于实际网络。
- **不同服务需要不同出口：**将指定流量与 VPS 原生机房 IP 解耦；对真正需要固定最终 IP 的目标，按需增加受控 SOCKS5。
- **集中维护：**出口策略和上游凭据由服务端管理，减少每台客户端重复配置。

WARP 不等于住宅 IP，也不保证特定服务接受；远程 SOCKS5 协议本身不加密。域名路由需要持续维护，示例域名表不能视为永久完整。使用时需遵守所在地法规、VPS 供应商及目标服务条款。当前研究没有验证服务可用性、速度或账号风控效果。[上游 README](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/README.md) · [固定 SOCKS5 安全边界](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/docs/static-socks.md)

## 可扩展方向（本仓库设想，尚未实现）

| 方向 | 需要补齐的工作 |
| --- | --- |
| 参数化部署与校验 | 生成服务端/客户端配置，检查证书、密钥、版本和规则顺序，再在目标环境验证 |
| 出口观测 | 分别检测 Direct、WARP、固定 SOCKS5 的连通性、实际出口 IP 和故障原因 |
| 规则维护 | 维护目标域名清单、路由命中测试和 DNS 行为检查，减少漏分流 |
| 多 VPS 容灾 | 配置并测试第二接入点，明确切换时是否保持原有出口策略 |
| 凭据与运行维护 | 凭据轮换、最小权限、日志保护、证书到期提醒和故障恢复 |

## 图片、代码与许可

本目录的文字分析、研究网页和 SVG / PNG 总览图为本仓库独立创作，未复制上游截图或生产配置。上游仓库的 [LICENSE](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/LICENSE) 为 MIT；Xray、WARP 等组件及其他素材各有自己的许可和服务条款，后续实际使用或再分发时需分别核查。研究网页只展示理解，不提供 VPN 服务或真实代理节点。
