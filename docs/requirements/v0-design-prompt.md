# v0.app product design prompt

Copy everything inside the fence below into v0.

---

```
Build a mobile-first web app demo (PWA-like, iPhone width) called 「念头」— an anxiety thought collector for a busy, overthinking professional. Chinese UI only. This is a structured self-help notebook, NOT a mood tracker, NOT meditation, NOT therapy, NOT AI chat, NOT social.

Visual tone: calm, private, late-night desk lamp. Off-white / warm paper background, ink-black text, one accent (muted rust/terracotta) for primary actions. Generous spacing, large tap targets, no gamification, no pets, no charts, no stock wellness clichés (no lotus, no purple gradients). Feels like a serious pocket notebook.

Information architecture — 2 tabs:
1) 念头 (Thoughts)
2) 过关清单 (Wins)

THOUGHTS — Home
- One-line positioning: 「先判断值不值得焦虑，再把方案封死在三套。」
- Primary button: 「记下念头」
- List of saved thoughts (use 2–3 realistic dummy items: one marked 内耗, one open with empty 结果, one with 结果 filled).
- Each row: date, 1-line snippet, badge (内耗 / 推进中 / 已有结果), scope 高/中/低 if present.
- Footer disclaimer: 「这不是医疗产品，不能替代专业帮助。」

FLOW A — Record a thought (multi-step, one question per screen except the plans screen)

Step 0: 「这是当下可以逐步推进的问题吗？」 subtitle: 「不是问今晚能不能彻底解决。」 Two big choices: 「可以推进」 / 「只是我吓唬自己」.

If 「只是我吓唬自己」 (SUCCESS path, keep it short and kind):
- Full-screen confirmation: 「这些都是我自己吓唬自己。可以停在这里。」
- Optional one-line note.
- Button 「放下，并留下一条记录」 → save a lightweight 内耗 item with timestamp → back to list.
- Secondary: 「其实可以推进，继续拆解」.

If 「可以推进」, continue:

Step 1: 「契机和念头」 textarea, placeholder 1–2 sentences (trigger + the thought itself). Required.

Step 2: 「脑补的恐惧」 — one required feared outcome + probability slider 0–100%. Button 「再加一条恐惧」（optional second only). Do not push a long list.

Step 3: 「焦虑影响范围」 three cards, not a vague intensity slider:
- 低：主要影响今晚的情绪
- 中：会影响本周的工作或安排
- 高：牵扯到身份、长期后果或关系
Required.

Step 4: 「当下可行的三套思路（只能三套）」 three required textareas on one screen:
- Plan A 最优方案
- Plan B 平替（helper: 「如果 A 卡壳，今晚仍能做的退一步是什么？」）
- Plan C 搞砸了大不了怎么办（心理和规则上的准备）
No Plan D.

Step 5: 「当前无法控制的变量」 list of short items (e.g. 别人怎么评价、最终是否录用). Add item field.

Step 6 REVIEW (the aha screen, read-only summary, do not re-edit as a long form):
- Title: 「先看清楚：这些不用你扛」
- Uncontrollable items shown with a red strike-through / red X.
- Compact summary: 念头, 恐惧+%, 范围, Plan A/B/C.
- Primary: 「确认，记下这个念头」 → save, auto-create empty 结果 (outcome) field.
- Secondary: 「返回修改」.

THOUGHT DETAIL
- All fields editable.
- Outcome section: textarea 「后来实际怎样了」 + three options comparing to the ORIGINAL FEAR (not “met my hopes”):
  「比担心的更糟」 / 「和担心的差不多」 / 「比担心的更好」
- Link: 「去看过关清单」

FLOW B — 过关清单
- Header: 「你曾经这样怕过，也熬过来了。」
- Button: 「记录胜利经历」
- Form (3 fields): 发生前的焦虑和担忧；中途自己怎么应对、怎么熬过来的；最后的结果（允许不完美）.
- List of win cards; tap to read. Dummy: one work-task recovery, one rejection that didn’t end the world.

Interaction: instant client-side state (no auth, no backend). Seed dummy data so the demo isn’t empty. Keyboard-friendly textareas. All screens usable on a 390px-wide phone. After save, always land on the list so it feels complete.

Do not add: AI analysis, login, reminders, mood emojis, statistics dashboards, paywalls, English UI, extra onboarding tutorial beyond a one-line home subtitle.
```
