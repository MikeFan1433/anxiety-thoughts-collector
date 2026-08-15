# Anxiety Thoughts Collector — 可行性评估

**Date:** 2026-08-14  
**Path:** 新产品（绿场）  
**第一用户:** 产品提出者本人（敏感、多疑、日程紧凑的年轻职场人）  
**Confidence:** 中（第一用户证据强；群体 ICP 无访谈，未编造引用或市场规模数字）  
**Overall:** `PROCEED_WITH_EYES_OPEN`

## 计分摘要

| 维度 | 分数 | 一句话 |
|---|---|---|
| 1. Problem Clarity & Urgency | Strong | 日常灾难化、分不清真问题与内耗，已影响决策与睡眠 |
| 2. Target User Definition | Strong | 第一用户可点名；群体「20–40 焦虑职场人」仍偏人口学，本轮以第一用户为准 |
| 3. Competitive Landscape | Moderate | 同类 CBT 焦虑日记已存在，但对「停手规则 + 三预案封顶 + 过关清单」组合有缝 |
| 4. Differentiation | Moderate | 协议组合是洞察，可被模板/竞品复制，无分发或数据护城河 |
| 5. Technical Feasibility | Strong | 个人优先、本地存储的移动 Web/PWA，vibecoding 可完成 |
| 6. Revenue or Impact Path | Moderate | 暂不商业化；个人效果可测但尚未测到 |

**Weak 数:** 0  
**Moderate 数:** 3（Competitive, Differentiation, Impact）  
**Strong 数:** 3  

按 Harness viability rubric：3+ Moderate 且 0–2 Weak → **Proceed with eyes open**，须带去风险议程，不得称为无条件 PASS。

---

## 1. Problem Clarity & Urgency — Strong

具体、可观察的问题，而不是「想做一个焦虑 App」：

- 念头出现后迅速滑向对未来不确定结果的恐惧、对严重后果的过度担忧。
- 当事人无法稳定区分「当下可处理的真问题」与「自己吓自己的内耗」。
- 已产生对精神状态、日常决策和睡眠的负面影响。
- 当事人**每天**都在经历，并主动寻求一个强制拆解的容器——不是 nice-to-have 的心情打卡。

人们今天已经在用备忘录、聊天机器人、纸质 CBT 表和现成焦虑 App **试图**解决；说明问题真实。缺口是：**缺少一个按本人协议强制走完、并能立刻调出过关证据的回路。**

## 2. Target User Definition — Strong（第一用户）/ 群体为 DRAFT

**本轮冻结的第一用户：** 20–40 岁、敏感多疑、日程紧凑、缺少倾诉对象的年轻知识工作者；自己既是提出者，也是 2–4 周验证样本。

群体描述「像我一样的年轻职场人」有角色与情境，不是「everyone」。但尚无第三方访谈，**不得把群体 ICP 写成已验证。** 下游设计以第一用户工作流为准。

## 3. Competitive Landscape — Moderate

市场已验证（有人付钱买焦虑日记），不是无人区。同一买家的目的型产品：

- Worry Watch：Record → Reason → Respond → Reflect，含「结果是否如担心的那样糟」
- WorryTree、Clarity / CBT Thought Diary、Moodnotes：结构化思维记录
- Daylio、Finch：心情/习惯，job 不同

**对本 ICP 的缝：** 现成产品很少把「现在不能解决就标内耗并停手」做成硬分流，很少把方案**封顶为 A/B/C 三套**，也很少把近 2–3 年人生困境做成可随时打开的过关证据库。

克隆风险记在 Differentiation，不把 Landscape 打成 Weak。

## 4. Differentiation — Moderate

结构优势是 **协议被产品强制执行**，不是「更好看的日记」：

- 两部判断法（具体化 → 现在能否解决 → 内耗停手 或 最低有效准备）
- 预案封顶（最多 Plan A/B/C）
- 过关清单（事前焦虑 / 如何熬过来 / 结果）

可复制性高：Notion 模板或 Worry Watch 加字段即可模仿。无分发、品牌或数据飞轮。Silent-pass 守卫：未把 Differentiation 打成 Weak（不是空洞的「我们做得更好」），因此未触发强制封顶 FAIL；但也 **达不到 PASS 所需的护城河叙事**。

## 5. Technical Feasibility — Strong

个人优先 SLC：单用户、本地优先、表单驱动的捕获与列表。无突破性 API、无实时协作。平台取 **可添加到主屏幕的 PWA/移动 Web**，比原生商店发布更贴近 vibecoding，同时满足「念头出现时立刻记」。

未知项（可研究、不阻塞判断）：离线、备份、锁屏。

## 6. Revenue or Impact Path — Moderate

商业化明确延后。Impact 路径清晰但未验证：

- 捕获后主观焦虑循环强度（0–10）下降
- 内耗条目被真正放下，而非反复新建同一念头
- 过关清单在新焦虑时被打开
- 2–4 周后仍在用（相对备忘录/现成 App）

尚无付费模型；未来 AI 分析可进 premium，但 **aha 回路不得付费墙**。

---

## 决策

| 项 | 值 |
|---|---|
| 建议 | `PROCEED_WITH_EYES_OPEN` |
| 是否写 build-ready PRD | 是（个人 SLC + 去风险假设） |
| 是否当公司/可融资产品推进 | 否，直到 H1–H4 有证据 |
| 若拒绝眼睛睁开继续 | 可先用纸质/Notion 跑同一协议 2 周，再决定是否值得数字化 |
