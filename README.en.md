# Thoughts (念头)

**[中文](./README.md) | English**

Decide whether the worry is worth carrying — then lock the response into three plans.

**Open on your phone:** [https://mikefan1433.github.io/anxiety-thoughts-collector/](https://mikefan1433.github.io/anxiety-thoughts-collector/)

**Thoughts** is a structured notebook for overthinkers. When an anxious thought shows up, it forces a fork first (a real problem vs. scaring yourself), then you write the feared outcomes, the scope of impact, and exactly three plans — and you see what you cannot control crossed out. Later you can fill in what actually happened. Wins you already survived live in a separate **wins list**, ready to open the next time anxiety returns.

> My life has been filled with terrible misfortune, most of which never happened  
> — Michel de Montaigne

**This is not a medical product. It does not replace therapy, diagnosis, or crisis care.**

The live site already has a **中 / EN** switch in the top-right. Your notes stay in the same browser either way; only the interface language changes.

---

## What it is for

When anxiety hits, it is easy to rehearse the worst script and never stop, and hard to tell whether it is even a real problem. A blank notes app is too loose. A full CBT worksheet is too heavy for a busy night.

This app does one job: in a few minutes at your desk or in bed, finish a capped loop — stop if it is rumination, or write Plan A / B / C if it is worth acting on.

**A fit if you:** have a packed calendar, tend to catastrophize, lack a steady person to talk to, and will write when the structure is short.

**Not a fit if you:** only want mood stickers or meditation, or need urgent clinical help.

---

## Features

- **Capture a thought:** first question is “can this be moved forward step by step?” If not, stopping counts as success (a light record is still saved). If yes, you keep going.
- **Fears and scope:** write the worst outcomes you are imagining (1–5) with a 0–100% probability, and pick impact scope (tonight’s mood / this week’s plans / identity and long-term stakes).
- **Exactly three plans:** Plan A (best), Plan B (fallback if A hits a snag), Plan C (if the worst happens, then what). There is no Plan D.
- **Review:** uncontrollable items are crossed out in red so you do not have to carry them.
- **Saved thoughts:** the home screen does not dump the full list. Filter by all / in progress / rumination / has an outcome. Edit any field. Fill in what happened relative to the original fear (worse / about the same / better).
- **Wins list:** before the fear → how you got through → how it ended (imperfect endings are allowed). A thought with an outcome can be archived into wins once, not duplicated.
- **中 / EN:** switch anytime in the top bar.
- **Backup & restore:** export JSON to your device; import later if you clear browser data.

---

## Quick start

You need [Node.js](https://nodejs.org/) 18+.

```bash
git clone https://github.com/MikeFan1433/anxiety-thoughts-collector.git
cd anxiety-thoughts-collector
npm install
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`).

- Desktop: a ~390px notebook frame (designed for phone use).
- Phone browser: full width.

The first visit includes a few sample thoughts and wins so the structure is visible. Delete them and use your own.

Preview a production build locally:

```bash
npm run build
npm run preview
```

**Daily use on a phone:** open [https://mikefan1433.github.io/anxiety-thoughts-collector/](https://mikefan1433.github.io/anxiety-thoughts-collector/). Closing the tab does not erase saved records in that browser. Export a backup now and then for anything that matters.

You can also host the `dist/` folder from `npm run build` on any static host. **No accounts, no server, no cloud sync.**

---

## How to use it

1. Tap **Capture a thought** (记下念头).
2. First: is this something you can move forward step by step? (Not “must I solve it completely tonight.”)
3. If you are only scaring yourself: stop on the success screen, optionally leave one line, save and done.
4. If you can move it forward: trigger + thought → fears and probabilities → impact scope → Plan A/B/C → uncontrollables → confirm.
5. Later, open **Saved thoughts**, fill in the outcome, and if it is worth keeping, tap **Save to wins**.
6. Next time anxiety shows up, open **Wins** in the bottom bar and read how you have been afraid before — and gotten through.

For important records, use the top-right **Backup & restore → Export**. Data lives only in the current browser. Clearing site data, switching browsers, or switching devices will not carry it automatically.

---

## Data and privacy

- Records are stored in this device’s browser `localStorage`. **Nothing is uploaded** (this repo has no backend).
- An exported JSON file contains the full text of thoughts and wins. Treat it as a private file.
- Import **replaces** all current records. Check the file source before you confirm.

---

## In this version / not in this version

| Included | Not in this slice |
|------|----------|
| Full capture loop, filters, wins, 中/EN, JSON backup | Accounts, cloud sync, automatic multi-device sync |
| Static webpage you can host | Full PWA install package, App Store / Google Play |
| Personal use and public sharing | AI analysis, reminders, stats dashboards, social |

---

## Tech

Vite 7 + React 19 single-page app. Protocol rules (fork, form gates, filters, backup validation) live in `src/protocol.js`, separate from the UI, so they can be tested.

```bash
npm test          # protocol + main-path smoke
npm run build     # production static files
```

---

## Disclaimer

This is a self-help notebook for sorting thoughts and responses. **It is not diagnosis, treatment, or emergency care.** If you are in severe distress, having thoughts of self-harm, or in crisis, contact local professional services or an emergency hotline — do not rely on this page.
