export const STORAGE_KEY = "nianyun-prototype-v1";
export const BACKUP_APP = "nianyun";
export const BACKUP_VERSION = 1;
export const MAX_FEARS = 5;

export function emptyDraft() {
  return {
    kind: "progress",
    note: "",
    body: "",
    fears: [{ text: "", pct: 50 }],
    scope: null,
    plans: { a: "", b: "", c: "" },
    uncontrollables: [],
    outcomeText: "",
    outcomeVsFear: null,
    linkedWinId: null,
  };
}

export function thoughtStatus(t) {
  if (!t) return "open";
  if (t.kind === "rumination") return "rum";
  if (t.outcomeVsFear || (t.outcomeText && String(t.outcomeText).trim())) return "done";
  return "open";
}

export function filterThoughts(thoughts, filter) {
  const list = Array.isArray(thoughts) ? thoughts : [];
  if (!filter || filter === "all") return list;
  return list.filter((item) => thoughtStatus(item) === filter);
}

export function canAdvanceBody(draft) {
  return Boolean(draft?.body && String(draft.body).trim());
}

export function canAdvanceFears(draft) {
  const fears = draft?.fears || [];
  if (fears.length < 1 || fears.length > MAX_FEARS) return false;
  return Boolean(fears[0]?.text && String(fears[0].text).trim());
}

export function canAddFear(draft) {
  return (draft?.fears?.length || 0) < MAX_FEARS;
}

export function canAdvanceScope(draft) {
  return Boolean(draft?.scope);
}

export function canAdvancePlans(draft) {
  const p = draft?.plans || {};
  return Boolean(String(p.a || "").trim() && String(p.b || "").trim() && String(p.c || "").trim());
}

export function hasPlanD(draft) {
  return Boolean(draft?.plans && Object.prototype.hasOwnProperty.call(draft.plans, "d") && draft.plans.d);
}

export function hasOutcome(t) {
  return t?.kind === "progress" && Boolean(String(t.outcomeText || "").trim() || t.outcomeVsFear);
}

export function ruminationRecord(note, createdAt) {
  return {
    ...emptyDraft(),
    kind: "rumination",
    note: String(note || "").trim(),
    createdAt,
  };
}

export function progressRecord(draft, createdAt) {
  return {
    ...draft,
    kind: "progress",
    outcomeText: "",
    outcomeVsFear: null,
    createdAt,
  };
}

export function isBackupPayload(payload) {
  return Boolean(payload && Array.isArray(payload.thoughts) && Array.isArray(payload.wins));
}

export function buildBackup(data, exportedAt = new Date().toISOString()) {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt,
    thoughts: data?.thoughts || [],
    wins: data?.wins || [],
  };
}

export function parseBackupText(text) {
  const payload = JSON.parse(text);
  if (!isBackupPayload(payload)) {
    throw new Error("invalid_backup");
  }
  return { thoughts: payload.thoughts, wins: payload.wins };
}

export function thoughtToWin(t, copy) {
  const fears = (t.fears || [])
    .filter((f) => f.text && String(f.text).trim())
    .map((f) => `${f.text}${copy.thenFeared(f.pct)}`)
    .join("；");
  return {
    before: [t.body, fears ? `${copy.thenWorry}${fears}` : ""].filter(Boolean).join("\n"),
    during: `Plan A：${t.plans.a}\nPlan B：${t.plans.b}\nPlan C：${t.plans.c}`,
    after: [
      t.outcomeText,
      t.outcomeVsFear ? `${copy.vsFear}${copy.outcome[t.outcomeVsFear]}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    sourceThoughtId: t.id,
  };
}

export function linkThoughtToWin(thought, winId) {
  return { ...thought, linkedWinId: winId };
}
