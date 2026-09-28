# 真实效果展示的媒体来源

核对日期：2026-09-28。当前展示页在线引用下述上游媒体，不下载、改编或保存音频及动图文件，不冒充本机生成结果。

## 音频

来源：[ACE-Step 1.5 官方项目页](https://ace-step.github.io/ace-step-v1.5.github.io/)的 GeneralSongs 分区。网站仓库研究快照：`7ec4df4f18b02ce35716b8f148e6d3070e0c8087`。页面播放 URL 使用官网当前托管地址，未来可能更新。

| 展示名称 | 上游样例 | 官方音频 | 官方提示词 |
| --- | --- | --- | --- |
| 中文歌曲：人声与伴奏 | zh_jazz | [音频](https://ace-step.github.io/ace-step-v1.5.github.io/mp3/samples/GeneralSongs/zh_jazz.mp3) | [输入](https://ace-step.github.io/ace-step-v1.5.github.io/raw/samples/GeneralSongs/zh_jazz_prompt.txt) |
| 纯音乐：游戏 / 影视氛围 | inst | [音频](https://ace-step.github.io/ace-step-v1.5.github.io/mp3/samples/GeneralSongs/inst.mp3) | [输入](https://ace-step.github.io/ace-step-v1.5.github.io/raw/samples/GeneralSongs/inst_prompt.txt) |
| 重金属：切换曲风 | en_metal | [音频](https://ace-step.github.io/ace-step-v1.5.github.io/mp3/samples/GeneralSongs/en_metal.mp3) | [输入](https://ace-step.github.io/ace-step-v1.5.github.io/raw/samples/GeneralSongs/en_metal_prompt.txt) |

样例和文件对应关系来自[官方清单](https://ace-step.github.io/ace-step-v1.5.github.io/samples_data.json)，中文输入说明是本仓库对提示词的摘要，未复制歌词。GeneralSongs 与网站另外列出的 XLDemos 分开处理，不将所选三首声称为 XL 生成结果。清单未提供每首完整 checkpoint、seed 和推理参数，不据此给出本机复现承诺。

音乐来自模型团队的公开演示；模型代码的 MIT 许可不自动等同于所有音频素材的再分发许可。本项目保留来源、在线引用，不主张素材所有权或授予再使用许可。

## 原版 UI 动图与视频

- [原作者 demo.gif 固定版本](https://raw.githubusercontent.com/fspecii/ace-step-ui/a1fdf91829ec6f7b98844f80e323529cd155dbf2/docs/demo.gif)，由 UI README 的 Demo 区引用。该图展示原作者操作，不是本仓库复现截图。
- 页面使用同一固定提交的 [jsDelivr 在线镜像](https://cdn.jsdelivr.net/gh/fspecii/ace-step-ui@a1fdf91829ec6f7b98844f80e323529cd155dbf2/docs/demo.gif)。直连加载超时后切换镜像，浏览器已成功读取 800 × 433 的 GIF 帧；原文件约 14 MB，完整动画加载受网络影响。
- [原作者完整演示视频](https://www.youtube.com/watch?v=8zg0Xi36qGc)，链接取自相同 README；本次未验证视频内容能够在当前网络播放。
- UI README 声称 MIT，但固定提交未见独立 LICENSE；媒体权利仍归原作者及相应权利人，独立媒体许可未核实。

## 完整理解总览图（2026-09-28）

- `understanding-overview.svg`：本仓库独立绘制的矢量信息图，2400 × 3220；`understanding-overview.png` 为同一 SVG 在本机 Edge 中的渲染导出。文字与结构均由本仓库根据固定源码归纳，未复制论文图或原版截图。
- 内容覆盖创作入口、应用架构、LM / 条件编码 / DiT / VAE 原理、模型支持范围、输出、创作迭代与产品参考。图中产品建议是分析，并非声称原库已全部实现。
- 原始依据：UI [`a1fdf91829ec6f7b98844f80e323529cd155dbf2`](https://github.com/fspecii/ace-step-ui/tree/a1fdf91829ec6f7b98844f80e323529cd155dbf2)、模型 [`ca1e85fe9430179831e6bc6be790c332190a3866`](https://github.com/ace-step/ACE-Step-1.5/tree/ca1e85fe9430179831e6bc6be790c332190a3866)；细分源码链接、组件与许可边界见 [完整理解说明](../understanding.md)。两版未配套实测。
- 图解是本仓库原创研究素材；不据此转授原代码、模型权重或第三方素材权利。没有使用生成式图片、远程图片下载或本机音乐生成结果。
- `overview-page-1440.png`、`overview-page-390.png` 是本机 Edge 渲染 `web/overview.html` 的桌面与手机首屏检查截图；属于本仓库网页，不是原版 UI。概念总览始终是上述一张图的 SVG / PNG 两种格式。

### 既有页面截图

`creation-guide-desktop.png` 与 `creation-guide-mobile.png` 于 2026-09-28 在本机 Edge 截取，分别使用 1440 × 1000 与 390 × 844 视口。内容为本仓库独立编写的创作入口与产品分析，不是原版 UI 截图，也没有生成音频结果。

`research-page-preview.png` 与 `listening-mobile-preview.png` 是本机 Edge 渲染新增试听首页所得，显示本仓库播放器与提示词摘要，不代表本机运行音乐模型。旧的完整截图保留为加入试听区前的架构展示记录。

## 模型内部说明截图

`model-blackbox-1440.png` 与 `model-blackbox-390.png` 于 2026-09-28 使用本机 Edge 截取，分别对应 1440 × 1000 与 390 × 844 视口。它们展示本仓库原创解释页面，不是原版 UI、模型推理结果或第三方截图。总览首屏截图同日更新，保留原有总览引导图。
