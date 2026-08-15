# Anxiety Thoughts Collector SLC1 — UI Specification

**Aesthetic direction:** morning linen / healing sage. Soft sky wash behind a 390px notebook. Capsule buttons, peach Review marks, no purple wellness cliché, no pets, no charts.

**Tokens:** `--linen #fffaf6`, `--sage #6a9a8b`, `--coral #d9786a`, `--ink #3a3f3d`. Type: Nunito + Noto Sans SC. Radius: pills 999px, cards 18px.

## 1. IA

- Top bar (always): 备份与恢复 | 中 / EN  
- Bottom tabs (home + thought-list): 念头 | 过关清单  
- Screens: home, gate, rumination, form×5, review, thought-list, detail, win-form, win-detail, backup sheet

## 2. Home（念头）

- Title「念头」  
- Quote (italic, **no trailing period**): 我的一生都充满了不幸，但其中大部分都未发生过  
- Attribution: —— 法国作家蒙田  
- Primary: 记下念头  
- Outline: 已有念头  
- Footer disclaimer  
- **Does not** list thoughts  

## 3. Gate / rumination / form / review

- Gate: two large choices; rumination is success copy + optional line + save.  
- Form: one question per step except plans (A/B/C together). Fear add hidden at 5. No Plan D. Uncontrollables: no spoiler that they will be struck.  
- Review: title「先看清楚：这些不用你扛」; red strike uncontrollables; summary; confirm.

## 4. Saved thoughts

- Filters: 全部 / 推进中 / 内耗 / 已有结果  
- Rows: date, badge, snippet  
- Detail: all fields editable; outcome vs original fear (not 达到预期); archive to wins if has outcome.

## 5. Wins

- Record win (3 fields). List + detail. Allow imperfect endings.

## 6. Backup sheet

- Trigger sits **left of language switch**.  
- Sheet: hint, export, import, close. Import confirm replace-all.

## 7. States

Empty list filter, disabled continue, invalid backup error, rumination vs progress badges.

## 8. Motion

Sheet slides from bottom; no gamified streaks.

## 9. PRD Traceability

| AC-ID | UI 落点 |
|---|---|
| AC-01 | §2 Home |
| AC-02–10 | §3 |
| AC-11,15,19 | §4 |
| AC-12,13,16 | §4–5 |
| AC-14 | §2 footer + phone frame |
| AC-17,18 | §6 |

## 10. Non-goals in UI

Login, AI, mood emojis, stats, native nav chrome.
