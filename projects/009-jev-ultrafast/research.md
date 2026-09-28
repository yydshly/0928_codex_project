# Jev Ultrafast 研究与证据记录

研究日期：2026-09-28。固定上游提交：[`1231850a0bf1a0c0341fe408ef1668dbbfdfac46`](https://github.com/browser-use/jev-ultrafast/tree/1231850a0bf1a0c0341fe408ef1668dbbfdfac46)。本研究阅读公开材料和源码，未在本机运行上游 Agent。

本次讨论中关于“谁编号”“送给 Jev 什么”“返回编号后是否都再交给大模型”的完整归纳见 [understanding.md](understanding.md)。网页已加入三种编号关系、三个请求返回分支和完整 [SVG](web/assets/overview.svg) / [PNG](web/assets/overview.png) 图；图和交互均由本仓库独立制作。

## 一、交付物是什么

它是 Python 浏览器智能体及本地观察面板。用户提供 URL 和自然语言目标，`Agent.run()` 在网页上循环观察、选择和执行。选择包括点击、输入、原生下拉菜单、上下滚动、等待、完成和阻塞。上游示例使用现有 Chrome 配置，通过 Browser Harness 与 Chrome DevTools Protocol（CDP）连接；默认循环不发送截图，面板和录制可另外启用截图。运行需要 TypeSafe API 密钥，遇到输入任务还需要兼容 OpenAI Chat Completions 的文本模型 API 密钥。

来源：[README](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/README.md)、[pyproject.toml](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/pyproject.toml)、[示例环境配置](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/.env.example)。

## 二、决策和执行链

1. [`snapshot.js`](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/jev_ultrafast/snapshot.js) 在页面内读取可见文字、常见 HTML/ARIA 控件、角色、标签、值和状态；为实际 DOM 节点建立缓存引用，并限制送入模型的正文和动作数量。
2. [`model.py`](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/jev_ultrafast/model.py) 从观察到的动作生成编号元素表、操作集合及各操作的合法目标。一次 TypeSafe 请求并行询问“选哪种操作”和各操作对应的目标；只采用选中操作对应的目标答案。输入动作另向小模型请求仅包含 `text` 的 JSON 对象。
3. [`agent.py`](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/jev_ultrafast/agent.py) 控制观察、预测、执行和状态记录；决策在执行前只消费一次，避免不确定的重试造成重复点击。页面过期则重新观察。
4. [`browser.py`](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/jev_ultrafast/browser.py) 通过 CDP 在独立标签页执行动作。输入前比较页面和目标状态，重新取目标位置并检查是否被覆盖。模型输出不作为 CSS 选择器、坐标、Shell 命令或 JavaScript 执行。

性能优化的主要工程点是：一次 CDP 页面快照替代反复取可访问性树及逐个解析节点；操作与目标共享一次模型网络往返；动画变化不一律使决策失效；组合框输入后只短暂等待建议出现。来源：[上游性能解释](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/docs/performance.md)。

## 三、作者结果与可推断范围

| 观察 | 作者公开结果 | 范围 |
| --- | --- | --- |
| Google Flights 录制 | 7.073 秒，17 次 Jev 请求，10 次交互加 1 次显式等待，两次文本模型调用；独立检查单程、苏黎世、伦敦、日期和可见航班 | 一次真实网站任务；不含启动、初次导航、最终独立验收时间；未订票 |
| 新旧运行时对照 | 三对交替运行，旧版中位 9.450 秒，新版 7.092 秒；两组各 3/3 通过；CDP 调用中位 1,092 → 101 | 同一个任务、浏览器配置和模型；不是与其他产品的横向基准 |
| 其他烟雾检查 | Wikipedia 指定文章 2.798 秒；本地酒店筛选 1.896 秒 | 不构成同任务速度对照，不能估计大规模成功率 |
| 费用 | 录制中的两次文本调用约 $0.00006272；TypeSafe 输入 90,558 tokens、输出 6,325 tokens | TypeSafe 未给出账单金额，浏览器成本未算，总成本未知 |

来源：[性能记录](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/docs/performance.md)、[配对测量 JSON](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/docs/full-speed-measurement.json)、[录制测量 JSON](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/docs/flights-measurement.json)。上游自己指出三对样本不足以支持强统计结论。

## 四、适合与不适合的任务

适合探索：明确目标、短流程、普通 DOM 控件可见、可用 URL / 表单值 / 结果列表独立验收的任务，例如搜索、筛选、打开文章或简单后台操作。网页上的三个教学模拟对应上游披露的航班、Wikipedia 和本地酒店任务，不是本仓库重新运行的结果或逐帧复刻。

需要另行处理：Shadow DOM、iframe、Canvas、上传、新标签页、嵌套滚动、复杂键盘部件及完整无障碍名称算法。现有 Chrome 配置由新建标签页共享；实际使用时应审视登录态、数据发送给模型服务的范围及任务权限。`DONE` 需由业务逻辑独立验证。[上游边界](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/README.md#evidence-and-limits)。

## 五、采用前的复核建议

在自己的目标网站上定义十余个不同难度和控件类型的任务，固定页面版本、浏览器配置和模型设置，记录每次任务的完整耗时、独立成功率、TypeSafe 与文本模型实际账单、失败原因和人工接管情况。特别测试页面动态变化、同名控件、遮挡、自动补全、刷新及多步骤筛选。该建议是本仓库的研究计划，不是已完成实验。

## 六、来源、图片与许可

上游 `jev-ultrafast` 为 [MIT License](https://github.com/browser-use/jev-ultrafast/blob/1231850a0bf1a0c0341fe408ef1668dbbfdfac46/LICENSE)，Copyright (c) 2026 Browser Use。TypeSafe Jev、OpenRouter 等模型服务与 Browser Harness 是外部依赖，各自的服务条款或许可应另行核对。本项目未复制上游代码、截图或视频；`web/assets/overview.svg`、网页布局、场景步骤模拟与中文研究文字均为本仓库独立制作。场景模拟只解释上游公布的任务逻辑，不能作为上游运行证据。
