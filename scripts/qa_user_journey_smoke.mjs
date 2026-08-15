import assert from "node:assert/strict";
import {
  canAdvanceBody,
  canAdvanceFears,
  canAdvancePlans,
  canAdvanceScope,
  emptyDraft,
  filterThoughts,
  hasOutcome,
  parseBackupText,
  buildBackup,
  progressRecord,
  ruminationRecord,
  thoughtStatus,
  thoughtToWin,
  linkThoughtToWin,
} from "../src/protocol.js";

const copy = {
  thenFeared: (pct) => ` (${pct}%)`,
  thenWorry: "feared: ",
  vsFear: "vs: ",
  outcome: { better: "better" },
};

function journeyProgress() {
  const d = emptyDraft();
  assert.equal(canAdvanceBody(d), false, "gate after empty body");
  d.body = "申请发出后循环会被拒";
  assert.ok(canAdvanceBody(d));
  d.fears[0] = { text: "永远不够格", pct: 80 };
  assert.ok(canAdvanceFears(d));
  d.scope = "high";
  assert.ok(canAdvanceScope(d));
  d.plans = { a: "改格式", b: "请同事看第一页", c: "被拒当样本" };
  assert.ok(canAdvancePlans(d));
  d.uncontrollables = ["名额"];
  const saved = { ...progressRecord(d, "t0"), id: "t-new" };
  assert.equal(thoughtStatus(saved), "open");
  saved.outcomeText = "进入下一轮";
  saved.outcomeVsFear = "better";
  assert.ok(hasOutcome(saved));
  const win = { id: "w-new", ...thoughtToWin(saved, copy) };
  const linked = linkThoughtToWin(saved, win.id);
  assert.equal(linked.linkedWinId, "w-new");
  assert.match(win.after, /进入下一轮/);
  return { saved: linked, win };
}

function journeyRumination() {
  const rec = { ...ruminationRecord("已读不回", "t1"), id: "t-rum" };
  assert.equal(thoughtStatus(rec), "rum");
  rec.kind = "progress";
  rec.body = rec.note;
  rec.fears = [{ text: "被否定", pct: 60 }];
  rec.scope = "low";
  rec.plans = { a: "先睡觉", b: "明天再看", c: "大不了关系降温" };
  assert.ok(canAdvancePlans(rec));
}

const { saved, win } = journeyProgress();
journeyRumination();

const bundle = buildBackup({ thoughts: [saved], wins: [win] });
const restored = parseBackupText(JSON.stringify(bundle));
assert.equal(restored.thoughts.length, 1);
assert.equal(restored.wins.length, 1);
assert.equal(filterThoughts(restored.thoughts, "done").length, 1);

console.log("qa_user_journey_smoke: AC-02..AC-10 rumination convert backup archive — passed");
