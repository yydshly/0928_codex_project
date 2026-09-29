# Buzz 简体中文研究版

这是基于 Block / Buzz 固定提交 `ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43` 的本地修改版，版本号 0.5.25，不是 Block 官方发布的中文版本。原项目采用 Apache-2.0，许可见 [UPSTREAM-LICENSE.txt](../web/UPSTREAM-LICENSE.txt)。本目录保存本仓库编写的翻译、界面补丁与构建脚本；完整上游源码和运行数据保留在被忽略的 `upstream/`。

## 直接使用

当前机器双击子项目中的 **`启动 Buzz 中文版.cmd`**。它会启动已有的本机服务并打开 `upstream/runtime/BuzzZh/buzz-desktop.exe`。已安装的官方英文版仍位于 `upstream/runtime/BuzzApp/`；两者共用本机身份和工作区数据，不应当作两个隔离账号使用。

- 已有测试频道：**中文界面体验**。
- 切换语言：左下角头像 → **设置 → 外观 → 界面语言**，选择简体中文或 English，点击保存并重新载入。
- 默认中文；语言选择保存在当前客户端本地。
- 重新载入前先保存正在编辑的内容。
- 启动脚本针对当前机器的既有 PostgreSQL、Redis、MinIO 与 relay 配置，其他机器需先按 [runtime.md](../runtime.md) 配置运行环境。

## 本次覆盖

主要导航、频道新建与成员管理、聊天常用操作、身份资料、智能体新建与部分运行配置、设置导航与常用设置、日期显示。术语采用：Agent → 智能体，Profile → 身份资料，Thread → 讨论串，Harness → 执行器。

用户写入的频道名称、人物名称、消息正文、智能体指令，以及模型名称、地址、公钥和协议值保持原文。部分高级 Git、媒体、工作流界面和底层错误仍可能显示英文；未宣称完整翻译全产品。上游自带的示例消息也可能保留英文。

## 实现

`zh-CN.json` 是英文源文案与中文文案的映射；`uiText.ts` 负责语言选择、占位参数和英文回退。`LanguageSettings.tsx` 新增外观设置中的语言卡片。`localize.mjs` 用 TypeScript 语法树定位源码中的展示文案，`source-edits.json` 补充少量有上下文的动态标签；不遍历或改写运行时聊天 DOM，不翻译用户输入。`coverage.json` 记录已替换的展示位置，不代表整个产品的覆盖率。

语言切换明确重新载入界面，使模块初始化时计算的选项也更新。应用仍使用原有 Tauri、React、Rust 服务和身份协议。

## 复现构建

前提：获取该固定版本源码、安装上游 pnpm 工作区依赖、安装 Rust stable 与 Windows C++ 构建环境，并已将官方 0.5.25 Windows sidecar 文件放在 `upstream/runtime/BuzzApp/`。关闭正在运行的中文客户端后，在本项目执行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File localization/build-chinese.ps1
```

流程是应用源码翻译 → TypeScript 检查 → Vite 构建 → Rust 桌面端构建 → 复制配套可执行文件和 DLL。使用 dev 编译配置并启用 `tauri/custom-protocol`，把前端嵌入可执行文件，因此运行时不依赖 Vite 服务。本机成品路径及 SHA-256 记录在 `upstream/runtime/BuzzZh/build-info.json`。

本机 MSVC 14.35 无法链接语音库较新静态预编译包，因此 `prepare-windows-build.mjs` 将已有 sherpa-onnx 依赖切换为其支持的 shared 模式；版本仍由现有 Cargo.lock 锁定为 1.13.4，配套 DLL 随成品放置。语音识别功能本轮未验证。本次构建曾使用 rsproxy 镜像获取 Rust 依赖，脚本默认使用标准 Cargo 源。

## 实测记录 · 2026-09-29

- 已在隔离副本上从原始源文件重新应用翻译补丁，结果与当前修改后的源码逐文件一致；重复应用不产生新替换。
- TypeScript 检查、Vite 构建、Rust 独立桌面构建通过；Rust 保留上游编译警告。
- 翻译辅助函数的 5 项测试通过：默认语言、切换保存、英文回退、用户文本占位不被改写、存储错误与模板参数。
- 在真实桌面应用中切换中文 → English → 中文，重新载入后语言选择保留。
- 经中文表单新建私密频道 `中文界面体验`，ID `bfd07de8-f438-44c1-b2a0-7a1fc542b68e`；频道成员侧栏显示“你 / 所有者”。
- 在中文界面发送 `中文界面已成功发送这条消息。English stays unchanged.`；官方 CLI 从 relay 读回完全相同的正文，事件 ID `bcb670c1666d541767e1a84faac1cf7428c5571c40a32794687f4cfa7dae7766`。
- 关闭 Vite 后独立客户端从 `http://tauri.localhost/` 加载，仍能读取该频道与消息。
- 本轮没有配置模型，没有验证 AI 自动回复、语音或所有高级功能；原有 relay 分区日志问题见运行记录。

## 截图来源

`../web/assets/zh-channel.png`、`zh-language-settings.png`、`zh-agent-setup.png` 为本仓库于 2026-09-29 从本机真实运行的中文修改版截取，非上游截图，非设计示意图。智能体配置图仅展示表单，没有创建或启动模型任务。
