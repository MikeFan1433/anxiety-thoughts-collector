# 重启后接手（2026-08-15）

电脑重启会关掉 Vite 开发服务器；**源码已在磁盘并已 git 提交**。浏览器 `localStorage` 一般会保留（除非你清过网站数据）。

## 项目路径

`/Users/mikefan/Projects/anxiety-thoughts-collector`

## 重新打开应用

```bash
cd /Users/mikefan/Projects/anxiety-thoughts-collector
npm install
npm run dev
```

浏览器打开终端里的地址（通常是 http://localhost:5173/ ）。

## 当前产品状态（已冻结）

- Harness 任务：`anxiety-thoughts-collector-slc1`
- 判断：`PROCEED_WITH_EYES_OPEN`
- 可行性：Go with Conditions
- QA：L1–L3 全绿（`.cursor-harness-runs/` 可再跑，不强制保留）
- 冻结 AC：AC-01 … AC-19
- 首页引语（无句号）：我的一生都充满了不幸，但其中大部分都未发生过 —— 法国作家蒙田
- 备份：右上角「备份与恢复」导出/导入 JSON
- 已有念头：可按全部 / 推进中 / 内耗 / 已有结果筛选

## 重启不会丢 / 会丢

| 内容 | 重启后 |
|---|---|
| `src/`、`docs/`、PRD、设计、协议代码 | 还在（已 commit） |
| 你在 App 里记下的念头/过关（localStorage） | 通常还在 |
| `npm run dev` 进程 | 没了，需按上面重开 |
| 未点「导出」的备份文件 | 没有单独文件；需要时再导出 |

建议重启前如有重要记录：点一次「备份与恢复 → 导出记录到本地」，存到「文件」或云盘。
