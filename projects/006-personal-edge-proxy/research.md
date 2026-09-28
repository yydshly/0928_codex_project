# Personal Edge Proxy 研究记录

## 研究问题与范围

- 上游现有的能力是什么？它能否准确称作个人 VPN 能力库？
- 入口协议、服务端路由和最终出口分别负责什么？
- 什么是已经提供的示例，什么只是推荐的部署方向？

本次依据 2026-09-28 上游 `main` 的固定提交 [`ff55bdf0429e927c97e304e03ee4b322f12d32e2`](https://github.com/yding-git/personal-edge-proxy/tree/ff55bdf0429e927c97e304e03ee4b322f12d32e2)进行文档与配置审阅。没有购买 VPS、部署服务、导入客户端或测量性能。

## 原项目的性质

上游文件主要为 README、部署和选机文档、Agent 维护说明、Xray 服务端 JSONC 示例、v2rayN 客户端示例及 MIT 许可证。它汇总一套作者使用和审计过的个人代理架构，并将生产资料脱敏为可参考示例；不是新实现的代理/VPN 内核，也不是可直接运行的一键安装产品。具体部署还需要 VPS、域名/证书、客户端与服务端软件、凭据、网络测试及可选的出口服务。[上游 README](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/README.md)

“VPN”在日常语言中常指设备流量经过远端网络出口。这里客户端的 TUN 模式可实现类似体验，但上游主线是**基于代理协议的个人网关**：客户端按规则进入 VPS，再由 Xray 选择出站。不能将其等同于提供完整私有网组网、设备发现和统一权限管理的产品。[HY2 客户端示例](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/v2rayn-hysteria2.example.md)

## 能力与证据

| 能力 | 证据 | 已验证程度 |
| --- | --- | --- |
| HY2 主入口 | Xray 示例的 `hysteria` inbound；v2rayN 的 sing-box HY2 outbound 示例 | 上游文档及配置已核对；本仓库未运行 |
| REALITY 备用入口 | Xray 示例的 VLESS/REALITY/Vision inbound；v2rayN 的 Xray outbound 示例 | 上游说明其存在于生产节点，但该客户端示例本次审计未主动切换测试 |
| Cloudflare Tunnel 应急入口 | README 的架构建议 | 当前仓库没有对应的可复制配置示例 |
| Direct 出口 | Xray 示例的 `freedom` outbound | 已核对配置；未测实际出口 |
| WARP 出口 | Xray 对 `127.0.0.1:40000` 的 SOCKS outbound；独立 WARP 安装文档 | 需要另装并连接 Cloudflare WARP；未在本仓库实测 |
| 固定 SOCKS5 出口 | Xray 示例的上游 SOCKS outbound；独立说明文档 | 可选，需自己控制或取得合规上游；未在本仓库实测 |
| 按目标路由与私网阻断 | Xray 示例的 `routing.rules` | 已核对示例规则；完整性和运行效果未测试 |

来源：[服务端配置](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/xray-server.example.jsonc) · [HY2 客户端](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/v2rayn-hysteria2.example.md) · [REALITY 客户端](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/v2rayn-reality-vision.example.md)

## 数据流与关键机制

```text
应用请求
  → 客户端 TUN / Rule：本地直连或送入代理
  → HY2（UDP/QUIC/TLS）或 VLESS+REALITY+Vision（TCP）
  → VPS 上的 Xray：解析可用的目标信息并按路由规则选择出站
  → Direct / 本机 WARP SOCKS5 / 可选固定上游 SOCKS5
  → 目标服务
```

HY2 与 REALITY 是**入站选择**。前者的 Xray 传输基于 QUIC，服务端示例配置 TLS 证书、`h3` ALPN 和认证用户；后者的示例通过 VLESS、REALITY 和 Vision 提供 TCP 路径。两者都将请求送到 VPS，并不决定最终出口身份。[Xray Hysteria 传输文档](https://xtls.github.io/config/transports/hysteria.html) · [Xray REALITY 文档](https://xtls.github.io/config/transports/reality.html)

**出站选择**发生在 VPS。Xray 示例先阻断客户端访问 VPS 所在网络的私网/链路本地地址；再将指定 Anthropic 域名路由至可选固定 SOCKS5，将部分 OpenAI 和 Google AI 域名路由至 WARP。没有命中这些规则的流量使用示例中的首个 Direct 出站。域名规则依赖 Xray 实际得到的目标信息和持续维护的域名清单；示例本身没有证明所有相关服务请求都被完整覆盖。[服务端配置](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/examples/xray-server.example.jsonc)

WARP 采用 Cloudflare Linux Client 的 Local Proxy 模式：Xray 将选中的请求发往 `127.0.0.1:40000`，由 `warp-svc` 通过 WARP 出去；VPS 系统默认路由仍可保持原生出口。这能独立测试两条路径，也避免 WARP 故障同时影响服务器的 SSH 与更新。固定 SOCKS5 可以让指定目标长期看到同一最终出口，但 SOCKS5 协议自身不提供传输加密。对刻意绑定固定出口的目标，上游建议上游失效时请求失败，避免无提示地转为 Direct。[WARP 文档](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/docs/warp-outbound.md) · [固定 SOCKS5 文档](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/docs/static-socks.md)

## 使用场景及选型

| 需求 | 可从上游选择的最小结构 | 注意 |
| --- | --- | --- |
| 个人设备经 VPS 出网 | HY2 → VPS Direct | 目标看到 VPS 原生出口 |
| UDP 连接不稳定 | 在上述结构外增加 REALITY 备用入口 | 只增加接入路径，出口未改变 |
| 指定服务使用不同出口 | HY2 → Xray 规则 → WARP | WARP 不保证目标服务可用或固定 IP |
| 指定目标长期维持固定出口 | 为该目标另配固定 SOCKS5 | 需核查上游可靠性、地区与链路保护 |

这些是架构选项，不是本仓库的性能比较或服务兼容性结论。[上游 README 的 A–E 档位](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/README.md)

## 扩展设想与验证顺序

1. **先做配置一致性检查：**从参数生成两侧配置，验证证书、密钥、端口、版本和规则顺序，并拒绝占位符进入生产环境。
2. **再做独立出口探测：**从 VPS 分别检查 Direct、WARP、固定 SOCKS5 的连通、最终 IP 和目标服务响应；清楚显示每条规则实际选择的出口。
3. **补规则和 DNS 检查：**维护域名清单，验证关键请求确实命中预期路由；检查客户端和服务端 DNS 处理造成的差异。
4. **按实测结果增加多 VPS：**第二 VPS 解决接入故障，但需额外确认固定出口策略和凭据管理在切换后依旧有效。
5. **补运维生命周期：**凭据轮换、日志保护、证书到期、WARP 状态和故障恢复流程。

以上均是本仓库研究后的开发方向，上游当前不提供这些完整功能。

## 复现、实验与限制

本次没有复现或修改原版，也没有生产配置、节点、测速数据或账号可用性结果。上游声称其生产环境经过现机审计；本项目只核对公开资料，不把上游经验记录冒充为本机实测。已独立绘制 [架构示意图](assets/architecture.svg)，用于解释数据流，而非展示运行效果。将来如实际部署，应记录组件版本、配置差异、线路条件、出口 IP、失败模式和服务条款适用性。

## 本次理解的网页与图表整理

新增 [研究网页](web/index.html)和 [1800 × 3600 完整总览图](web/assets/personal-edge-proxy-overview.svg)，覆盖客户端接管、入站传输、VPS 认证与路由、出站连接、目标响应、HTTPS 与代理通道的区别、个人价值与扩展方向。总览图同时提供 [PNG](web/assets/personal-edge-proxy-overview.png)，生成方式和图片来源见[网页说明](web/README.md)。

本次补充核对 [HY2 官方协议](https://v2.hysteria.network/docs/developers/Protocol/)、[Xray 路由文档](https://xtls.github.io/config/routing.html)和 [Xray 入站文档](https://xtls.github.io/config/inbound.html)。特别说明：应用 TCP 可由 HY2 的 QUIC 流承载；Xray 规则按序首个命中，未命中使用第一个 outbound；公开示例中的 WARP 规则仅针对 TCP，不能推定所有 UDP/HTTP3 请求都走 WARP。域名嗅探与 DNS 路径依配置而定，不等于解密 HTTPS 或自动避免 DNS 泄漏。

网页用 2 种入口、3 种出口和 5 个阶段演示请求链路，30 个组合已检查，桌面与手机布局、图片、本地链接和脚本也已检查。此验证对象仅为研究展示，**原代理方案仍未部署或测速**。现有 GitHub Pages 工作流已接入第 006 个子路径，但本次尚未推送或发布，未新增未验证的公网演示链接。

## 许可与来源

补充的协议说明区分了 HY2、VLESS、SOCKS5 三类代理协议与 REALITY 安全层、Vision 流控、WARP 服务和 MASQUE 隧道体系。依据 [VLESS / Vision 官方文档](https://xtls.github.io/config/inbounds/vless.html)、[REALITY 文档](https://xtls.github.io/config/transports/reality.html)、[HY2 协议](https://v2.hysteria.network/docs/developers/Protocol/)、[SOCKS5 RFC 1928](https://www.rfc-editor.org/rfc/rfc1928.html)、[MASQUE UDP 代理 RFC 9298](https://www.rfc-editor.org/rfc/rfc9298.html)及 [WARP 模式](https://developers.cloudflare.com/warp-client/warp-modes/)整理。没有将研究示例中的 `decryption: none` 推广为所有 VLESS 版本都不支持加密；也没有把“内外两层”的职责图当成所有字节始终双重 TLS 加密的实现描述。

- 原项目：[yding-git/personal-edge-proxy](https://github.com/yding-git/personal-edge-proxy/tree/ff55bdf0429e927c97e304e03ee4b322f12d32e2)。其 [LICENSE](https://github.com/yding-git/personal-edge-proxy/blob/ff55bdf0429e927c97e304e03ee4b322f12d32e2/LICENSE) 为 MIT，版权声明为 2026 StarryRain。
- 协议及组件原理：[Xray Hysteria](https://xtls.github.io/config/transports/hysteria.html)、[Xray REALITY](https://xtls.github.io/config/transports/reality.html)、[Cloudflare WARP 模式](https://developers.cloudflare.com/warp-client/warp-modes/)。这些组件由各自项目维护，不能仅凭上游仓库的 MIT 许可推定其许可或服务条件。
- 本项目文字与 SVG 是独立研究产物，未复制上游图片、代码或生产配置。
