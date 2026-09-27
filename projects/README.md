# 子项目目录

每个研究对象占用一个独立目录，命名为 `三位编号-简短英文名`，例如 `001-example`。编号表示收录顺序，不随研究进度或展示排序变化，也不重复使用。

新建项目时，从 [`templates/project/`](../templates/project/) 复制 `README.md`、`research.md` 和 `assets/`。实际需要网页时，再在该项目下建立 `web/`；不要把不同子项目的依赖和构建文件混在仓库根目录。

根目录 [README](../README.md) 是公开摘要和按编号排列的入口。子项目 README 负责项目简介、图片、来源和链接；`research.md` 负责详细分析与复现过程。
