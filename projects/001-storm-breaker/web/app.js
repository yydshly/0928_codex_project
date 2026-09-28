"use strict";

const modules = {
  device: {
    title: "设备概况", label: "DEVICE PROFILE", icon: "⌘", badge: "不触发权限弹窗",
    permission: "无需弹窗", previewTitle: "页面已经载入",
    description: "网页可以读取部分浏览器与设备环境信息。它们不等于设备的完整身份。",
    caption: "原项目会将读取到的环境信息提交给接收端。本演示只在你的页面里显示。",
    hint: "只读取并显示本机浏览器信息；不会查询或上传 IP。",
    sample: "浏览器：示例浏览器\n语言：zh-CN（样例）\n屏幕：1440 × 900（样例）\n时区：Asia/Shanghai（样例）"
  },
  location: {
    title: "精确位置", label: "GEOLOCATION", icon: "◎", badge: "需要位置授权",
    permission: "需要授权", previewTitle: "页面请求位置信息",
    description: "经纬度来自浏览器定位 API。若未授权，页面无法得到精确坐标。",
    caption: "原项目可能将授权后的坐标提交给接收端；这里的真实坐标只在当前页面显示。",
    hint: "点击后浏览器可能弹出位置授权；只在本机显示坐标。",
    sample: "纬度：示例坐标 00.0000°\n经度：示例坐标 00.0000°\n来源：模拟授权结果"
  },
  camera: {
    title: "摄像头", label: "CAMERA ACCESS", icon: "◉", badge: "需要摄像头授权",
    permission: "需要授权", previewTitle: "页面请求摄像头",
    description: "获得浏览器授权后，网页可以看到媒体流。本机验证只显示预览，不拍照。",
    caption: "原项目会从媒体流中生成图片并提交；本演示只显示本机预览，不拍照、不上传。",
    hint: "点击后浏览器可能弹出摄像头授权；画面仅在本机预览。",
    sample: "媒体流：已获授权（模拟）\n画面：示意状态，无真实图像\n后续：原项目可生成并提交图像"
  },
  microphone: {
    title: "麦克风", label: "MICROPHONE", icon: "◌", badge: "需要麦克风授权",
    permission: "需要授权", previewTitle: "页面请求麦克风",
    description: "获得浏览器授权后，网页可以读取音频输入。本机验证只计算音量，不录制。",
    caption: "原项目会处理并上传录音；本演示只显示本机音量变化，不录制、不上传。",
    hint: "点击后浏览器可能弹出麦克风授权；仅显示音量，不录音。",
    sample: "音频输入：已获授权（模拟）\n音量：示意状态，无真实音频\n后续：原项目可录制并提交音频"
  }
};

const refs = {
  tabs: [...document.querySelectorAll(".module-tab")],
  panel: document.getElementById("module-panel"),
  previewLabel: document.getElementById("preview-label"),
  previewVisual: document.getElementById("preview-visual"),
  previewTitle: document.getElementById("preview-title"),
  previewDescription: document.getElementById("preview-description"),
  previewBadge: document.getElementById("preview-badge"),
  visitorCaption: document.getElementById("visitor-caption"),
  consoleTitle: document.getElementById("console-title"),
  permissionPill: document.getElementById("permission-pill"),
  statusText: document.getElementById("status-text"),
  resultMode: document.getElementById("result-mode"),
  resultText: document.getElementById("result-text"),
  allow: document.getElementById("simulate-allow"),
  deny: document.getElementById("simulate-deny"),
  local: document.getElementById("local-check"),
  stop: document.getElementById("stop-check"),
  localHint: document.getElementById("local-hint"),
  activity: document.getElementById("activity-list"),
  video: document.getElementById("camera-preview"),
  mic: document.getElementById("mic-preview"),
  micLevel: document.getElementById("mic-level"),
  micCaption: document.getElementById("mic-caption")
};

let active = "device";
let stream = null;
let audioContext = null;
let meterFrame = 0;
let requestId = 0;
let logNumber = 0;

function log(message) {
  if (logNumber === 0) refs.activity.replaceChildren();
  logNumber += 1;
  const item = document.createElement("li");
  const number = document.createElement("span");
  const label = document.createElement("span");
  number.className = "log-time";
  number.textContent = String(logNumber).padStart(2, "0");
  label.textContent = message;
  item.append(number, label);
  refs.activity.prepend(item);
  while (refs.activity.children.length > 4) refs.activity.lastElementChild.remove();
}

function showResult(status, mode, text) {
  refs.statusText.textContent = status;
  refs.resultMode.textContent = mode;
  refs.resultText.textContent = text;
}

function resetPreview() {
  refs.video.hidden = true;
  refs.video.srcObject = null;
  refs.mic.hidden = true;
  refs.micLevel.style.transform = "scale(1)";
  refs.micCaption.textContent = "等待麦克风授权";
  refs.previewVisual.hidden = false;
}

function stopMedia() {
  if (meterFrame) cancelAnimationFrame(meterFrame);
  meterFrame = 0;
  if (stream) stream.getTracks().forEach(track => track.stop());
  stream = null;
  if (audioContext) audioContext.close().catch(() => {});
  audioContext = null;
  refs.stop.hidden = true;
  resetPreview();
}

function selectModule(key) {
  if (!modules[key]) return;
  requestId += 1;
  stopMedia();
  active = key;
  const info = modules[key];
  refs.tabs.forEach(tab => {
    const selected = tab.dataset.module === key;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  refs.panel.setAttribute("aria-labelledby", `tab-${key}`);
  refs.previewLabel.textContent = info.label;
  refs.previewVisual.textContent = info.icon;
  refs.previewTitle.textContent = info.previewTitle;
  refs.previewDescription.textContent = info.description;
  refs.previewBadge.textContent = info.badge;
  refs.visitorCaption.textContent = info.caption;
  refs.consoleTitle.textContent = info.title;
  refs.permissionPill.textContent = info.permission;
  refs.localHint.textContent = info.hint;
  refs.allow.textContent = key === "device" ? "模拟访问" : "模拟允许";
  refs.deny.textContent = key === "device" ? "不适用" : "模拟拒绝";
  refs.deny.disabled = key === "device";
  refs.local.disabled = false;
  refs.stop.hidden = true;
  showResult("等待操作", "尚无结果", "选择下方操作，查看这一步会出现什么。");
  refs.activity.replaceChildren();
  logNumber = 0;
  log(`已选择「${info.title}」`);
}

function simulate(allow) {
  if (active === "device" && !allow) return;
  requestId += 1;
  stopMedia();
  refs.local.disabled = false;
  const info = modules[active];
  if (allow) {
    log(active === "device" ? "页面载入后读取可用的环境信息" : "用户在浏览器中允许权限请求（模拟）");
    showResult("模拟成功", "样例数据 · 非实测", info.sample);
    log("控制台显示样例结果；没有真实数据传输");
  } else {
    log("用户在浏览器中拒绝权限请求（模拟）");
    showResult("模拟拒绝", "样例流程 · 非实测", "浏览器未提供所请求的内容。\n页面无法取得此项的真实数据。");
  }
}

function errorMessage(error) {
  switch (error && error.name) {
    case "NotAllowedError": return "浏览器未授权。你可以在浏览器设置中管理该站点的权限。";
    case "NotFoundError": return "本机未检测到可用的设备。";
    case "NotReadableError": return "设备当前不可用，可能正被其他应用占用。";
    case "SecurityError": return "当前页面环境不允许访问此功能。";
    default: return "验证未完成；请检查浏览器支持、权限和页面环境。";
  }
}

function showDeviceInfo() {
  const timezone = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "未知"; } catch { return "未知"; } })();
  const data = [
    `语言：${navigator.language || "未知"}`,
    `平台：${navigator.platform || "未提供"}`,
    `屏幕：${screen.width} × ${screen.height}`,
    `时区：${timezone}`,
    `逻辑处理器：${navigator.hardwareConcurrency || "未提供"}`,
    `浏览器标识：${navigator.userAgent || "未提供"}`
  ];
  showResult("本机读取完成", "本机信息 · 未上传", data.join("\n"));
  log("已在当前页面读取可用的浏览器环境信息");
}

function showLocation(id) {
  if (!navigator.geolocation) {
    showResult("不可用", "本机验证", "当前浏览器不提供定位接口。");
    log("定位接口不可用");
    refs.local.disabled = false;
    return;
  }
  log("已向浏览器请求位置权限");
  showResult("等待浏览器响应", "本机验证", "请在浏览器的权限提示中自行选择。");
  navigator.geolocation.getCurrentPosition(
    position => {
      if (id !== requestId || active !== "location") return;
      const {latitude, longitude, accuracy} = position.coords;
      showResult("本机定位完成", "本机坐标 · 未上传", `纬度：${latitude.toFixed(5)}°\n经度：${longitude.toFixed(5)}°\n精度估计：约 ${Math.round(accuracy)} 米`);
      log("位置只显示在当前页面");
      refs.local.disabled = false;
    },
    error => {
      if (id !== requestId || active !== "location") return;
      const message = error.code === 1 ? "浏览器未授权位置访问。" : error.code === 2 ? "浏览器当前无法取得位置信息。" : "位置请求超时。";
      showResult("本机验证未完成", "本机验证", message);
      log(message);
      refs.local.disabled = false;
    },
    {enableHighAccuracy: false, timeout: 12000, maximumAge: 0}
  );
}

function startMeter(mediaStream) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error("AudioContext unavailable");
  audioContext = new AudioContextClass();
  const source = audioContext.createMediaStreamSource(mediaStream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);
  const samples = new Uint8Array(analyser.fftSize);
  function draw() {
    analyser.getByteTimeDomainData(samples);
    let sum = 0;
    for (const value of samples) { const normalized = (value - 128) / 128; sum += normalized * normalized; }
    const level = Math.min(1, Math.sqrt(sum / samples.length) * 4);
    refs.micLevel.style.transform = `scale(${(1 + level * 1.4).toFixed(2)})`;
    refs.micCaption.textContent = `本机音量：${Math.round(level * 100)}%`;
    meterFrame = requestAnimationFrame(draw);
  }
  draw();
}

async function showMedia(kind, id) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showResult("不可用", "本机验证", "需要支持媒体权限的浏览器，并通过 HTTPS 或 localhost 打开页面。");
    log("当前页面无法调用媒体设备接口");
    refs.local.disabled = false;
    return;
  }
  const name = kind === "camera" ? "摄像头" : "麦克风";
  log(`已向浏览器请求${name}权限`);
  showResult("等待浏览器响应", "本机验证", "请在浏览器的权限提示中自行选择。");
  try {
    const obtained = await navigator.mediaDevices.getUserMedia(kind === "camera" ? {video: true, audio: false} : {audio: true, video: false});
    if (id !== requestId || active !== kind) {
      obtained.getTracks().forEach(track => track.stop());
      return;
    }
    stream = obtained;
    refs.previewVisual.hidden = true;
    refs.stop.hidden = false;
    if (kind === "camera") {
      refs.video.hidden = false;
      refs.video.srcObject = stream;
      refs.video.play().catch(() => {});
      if (id !== requestId || active !== kind || !stream) return;
      showResult("本机预览中", "实时画面 · 未上传", "摄像头画面只显示在左侧预览。\n本演示不会拍照或保存。" );
    } else {
      refs.mic.hidden = false;
      startMeter(stream);
      showResult("本机音量监测中", "仅音量 · 未录制", "左侧显示实时音量变化。\n本演示不会录音或保存。" );
    }
    log(`${name}已启动，仅在当前页面处理`);
  } catch (error) {
    if (id !== requestId || active !== kind) return;
    stopMedia();
    const message = errorMessage(error);
    showResult("本机验证未完成", "本机验证", message);
    log(message);
  } finally {
    if (id === requestId) refs.local.disabled = false;
  }
}

function verifyLocally() {
  requestId += 1;
  const id = requestId;
  stopMedia();
  refs.local.disabled = true;
  if (active === "device") {
    showDeviceInfo();
    refs.local.disabled = false;
  } else if (active === "location") {
    showLocation(id);
  } else {
    showMedia(active, id);
  }
}

refs.tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectModule(tab.dataset.module));
  tab.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? refs.tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + refs.tabs.length) % refs.tabs.length;
    refs.tabs[next].focus();
    selectModule(refs.tabs[next].dataset.module);
  });
});

document.querySelectorAll("[data-jump]").forEach(link => link.addEventListener("click", () => selectModule(link.dataset.jump)));
refs.allow.addEventListener("click", () => simulate(true));
refs.deny.addEventListener("click", () => simulate(false));
refs.local.addEventListener("click", verifyLocally);
refs.stop.addEventListener("click", () => {
  requestId += 1;
  stopMedia();
  showResult("已停止", "本机验证", "已停止设备访问；此演示没有保存数据。");
  log("已停止本机媒体流");
});
window.addEventListener("pagehide", stopMedia);
document.addEventListener("visibilitychange", () => {
  if (document.hidden && stream) {
    requestId += 1;
    stopMedia();
    showResult("已停止", "本机验证", "页面切到后台后，设备访问已停止。");
    log("页面切到后台，已停止媒体流");
  }
});

const localOriginalAvailable = location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(location.hostname);
document.querySelectorAll("[data-local-path]").forEach(link => {
  if (localOriginalAvailable) {
    link.href = `http://127.0.0.1:2525${link.dataset.localPath}`;
  } else {
    link.classList.add("local-link-unavailable");
    link.setAttribute("aria-disabled", "true");
    link.removeAttribute("target");
    link.tabIndex = -1;
    const label = link.querySelector("b");
    if (label) label.textContent = "仅供本机运行查看";
    else link.textContent = link.textContent.replace("↗", "· 仅限本机");
  }
});

selectModule("device");
