# 007 · OSINT 资源地图网页

直接打开 [index.html](index.html) 即可使用。页面没有构建依赖，不自动请求第三方网站；资源索引以 `inventory.js` 本地加载。搜索、筛选、分页和主题切换均在浏览器本地运行。外部链接只有在读者主动点击后才会打开。

## 内容

- 12 个按任务组织的中文主题，说明能获得的线索与核验边界。
- 一张可放大的[资源分类总览图](assets/resource-overview.svg)与 [PNG 版本](assets/resource-overview.png)，用四条主线概括十二个主题、主要子类、可能效果与代表名称。图由本仓库独立绘制，SVG 生成脚本为 `../tools/build_overview.py`；PNG 由同一 SVG 渲染。
- 依据本仓库现有研究与发布方式，推断出的 6 类容易忽略的能力、适用时机和可能成果。
- 48 条重点资源的逐项中文说明，以及 B 仓库暗网第 12 节的类型拆解。
- 从固定上游 README 提取的名称、分类、上游所列 URL 与行号索引；包含跨分类重复记录，不是独立工具数量，也不表示条目已经可用。
- 两个上游原始分类的中文用途说明、分类筛选和名称搜索。索引提取 Markdown 列表与表格，不包括正文和命令块的所有提及。
- “从清单到个人入口”说明：区分上游资源发现、本页已实现的分类引导，以及后续可做的任务操作卡、状态核验与个人结果记录。后续方向目前尚未实现。

## 数据来源与更新

上游版本为 [A `3ab9cde`](https://github.com/jivoi/awesome-osint/tree/3ab9cde5d0f638de91bc86147db6996472d927c6) 与 [B `2c6475a`](https://github.com/rawfilejson/awesome-osint-arsenal/tree/2c6475a1d5b941cc598b3612419ef22e6d903ce8)。`tools/build_inventory.py` 可从这两份 README 的本地临时副本重新生成 `inventory.js`：

```text
python tools/build_inventory.py <A-README.md> <B-README.md>
```

下载的 README 是临时构建输入，不保存在本项目。索引只保留名称、网址、分类与出处，中文归纳保存在 `catalog-data.js`。重新生成后须检查条目数、分类、重点资源匹配及许可证要求。详情见 [NOTICES.md](NOTICES.md)。

## 发布子路径

网页已通过仓库现有 GitHub Pages 工作流发布到 `/0928_codex_project/007-osint-resource-map/`：[打开已验证的研究网页](https://yydshly.github.io/0928_codex_project/007-osint-resource-map/)。2026-09-28 已核对页面、首页卡片以及 SVG/PNG 总览图均返回成功并包含预期内容。页面使用同目录相对资源路径；这项验证不包括清单中第三方站点或工具的可用性。
