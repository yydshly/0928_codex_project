(() => {
  const state = { ingress: 'hy2', route: 'direct', step: 0 };
  const routes = {
    direct: { title: 'VPS 直接出网', detail: 'VPS 建立到目标的连接', note: '此时中转站也是最终出口', ip: 'VPS 公网 IP', outbound: '原生网络', insight: 'Direct：Xray 使用 VPS 原生网络连接目标，不需要额外上游。C 是 B 的出站动作，不代表另一台服务器。', connect: 'Xray 通过 VPS 原生网络建立到目标的连接。对常见 HTTPS 网站，浏览器再通过转发路径与网站完成 TLS 握手，网站看到 VPS 的公网 IP。' },
    warp: { title: 'WARP 出口', detail: '本地 SOCKS5 → warp-svc', note: '经 Cloudflare 网络出网', ip: 'WARP 出口 IP', outbound: '127.0.0.1:40000', insight: 'WARP：选中流量交给 VPS 上的本地 WARP 服务，再经 Cloudflare 出口访问目标；VPS 默认路由仍可保持原生网络。示例 WARP 规则只匹配 TCP。', connect: 'Xray 把选中的连接送到 VPS 本机 127.0.0.1:40000；warp-svc 经 WARP 通道访问目标。目标看到 WARP 出口 IP，并不保证固定或是住宅 IP。' },
    fixed: { title: '固定 SOCKS5', detail: '受控的远程上游代理', note: '由上游提供固定出口', ip: '上游固定公网 IP', outbound: '上游 SOCKS5', insight: '固定 SOCKS5：指定目标交给独立上游，入口切换不会主动改变这条出站策略。若上游不可用，示例没有自动回落到 Direct 的规则。固定性取决于上游。', connect: 'Xray 连接配置好的 SOCKS5 上游，由上游连接目标。目标看到上游的出口 IP。SOCKS5 自身不加密；正常 HTTPS 的应用内容仍由浏览器和网站之间的 TLS 保护。' }
  };
  const baseSteps = [
    ['本机代理先接住应用请求', '应用主动使用本地代理端口，或由 TUN 虚拟网卡接收流量。客户端规则决定哪些直连、哪些交给 VPS。本图展示的是被选中进入代理的请求。', ['client']],
    ['', '', ['client','vps']],
    ['VPS 验证接入身份，再按目标选择出站', 'VPS 上的 Xray 验证接入所需凭据，读取目标地址和端口。路由从上到下使用首个命中规则；示例先阻断私网，再匹配特定域名，未命中时使用 Direct。', ['vps']],
    ['', '', ['vps','exit','destination']],
    ['响应沿同一逻辑代理链返回', '网站将响应发给最终出口，经 VPS 和加密代理通道回到本机核心，再交给应用。字节流可以双向持续传输；浏览器负责解释网页或 API 数据，VPS 无需运行浏览器。', ['client','vps','exit','destination']]
  ];
  const set = (id, text) => { document.getElementById(id).textContent = text; };
  function render() {
    const r = routes[state.route];
    const steps = baseSteps.map(s => [...s]);
    steps[1] = state.ingress === 'hy2'
      ? ['客户端经 HY2 连接 VPS', '客户端通过 QUIC（基于 UDP）建立加密代理通道，并携带认证和目标信息。应用的 TCP 字节流可以由 QUIC 流承载；HY2 使用 UDP 不等于网页失去可靠传输。', ['client','vps']]
      : ['客户端经 REALITY 的 TCP 路径连接 VPS', '客户端使用 VLESS + REALITY + Vision 接入，配置用户标识、公钥、shortId 等信息。它提供 UDP 不好用时的备用接入路径，所选的最终出口保持不变。', ['client','vps']];
    steps[3] = ['选定出口，建立到目标的连接', r.connect, ['vps','exit','destination']];
    set('ingress-label', state.ingress === 'hy2' ? 'HY2 / QUIC' : 'REALITY / TCP');
    set('exit-title', r.title); set('exit-detail', r.detail); set('exit-note', r.note); set('ip-label', r.ip); set('outbound-label', r.outbound); set('route-insight', r.insight);
    set('step-number', String(state.step + 1).padStart(2, '0')); set('step-title', steps[state.step][0]); set('step-description', steps[state.step][1]);
    document.querySelectorAll('[data-ingress]').forEach(b => b.setAttribute('aria-pressed', b.dataset.ingress === state.ingress));
    document.querySelectorAll('[data-route]').forEach(b => b.setAttribute('aria-pressed', b.dataset.route === state.route));
    document.querySelectorAll('[data-step]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.step) === state.step));
    document.querySelectorAll('[data-station]').forEach(n => n.classList.toggle('active', steps[state.step][2].includes(n.dataset.station)));
    set('next-step', state.step === 4 ? '从头查看 ↺' : '下一步 →');
  }
  document.querySelectorAll('[data-ingress]').forEach(b => b.addEventListener('click', () => { state.ingress = b.dataset.ingress; render(); }));
  document.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => { state.route = b.dataset.route; render(); }));
  document.querySelectorAll('[data-step]').forEach(b => b.addEventListener('click', () => { state.step = Number(b.dataset.step); render(); }));
  document.getElementById('next-step').addEventListener('click', () => { state.step = (state.step + 1) % 5; render(); });
  render();
})();
