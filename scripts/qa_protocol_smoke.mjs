import assert from "node:assert/strict";
import {
  MAX_FEARS,
  buildBackup,
  canAddFear,
  canAdvanceBody,
  canAdvanceFears,
  canAdvancePlans,
  canAdvanceScope,
  emptyDraft,
  filterThoughts,
  hasOutcome,
  isBackupPayload,
  parseBackupText,
  progressRecord,
  ruminationRecord,
  thoughtStatus,
} from "../src/protocol.js";

function test(name, fn) {
  fn();
  console.log("ok", name);
}

test("AC-03 rumination needs no plans", () => {
  const rec = ruminationRecord("只是吓唬自己", "now");
  assert.equal(rec.kind, "rumination");
  assert.equal(thoughtStatus(rec), "rum");
  assert.equal(canAdvancePlans(rec), false);
});

test("AC-05 body required", () => {
  const d = emptyDraft();
  assert.equal(canAdvanceBody(d), false);
  d.body = "周会材料没对齐";
  assert.equal(canAdvanceBody(d), true);
});

test("AC-06 fears 1 required max 5", () => {
  const d = emptyDraft();
  assert.equal(canAdvanceFears(d), false);
  d.fears[0].text = "被问住";
  assert.equal(canAdvanceFears(d), true);
  d.fears = Array.from({ length: MAX_FEARS }, (_, i) => ({ text: `f${i}`, pct: 10 }));
  assert.equal(canAddFear(d), false);
  d.fears.push({ text: "sixth", pct: 1 });
  assert.equal(canAdvanceFears(d), false);
});

test("AC-07 scope required", () => {
  const d = emptyDraft();
  assert.equal(canAdvanceScope(d), false);
  d.scope = "mid";
  assert.equal(canAdvanceScope(d), true);
});

test("AC-08 plans A/B/C required no D needed", () => {
  const d = emptyDraft();
  d.plans = { a: "A", b: "", c: "C" };
  assert.equal(canAdvancePlans(d), false);
  d.plans.b = "B";
  assert.equal(canAdvancePlans(d), true);
});

test("AC-10 progress save clears outcome", () => {
  const d = emptyDraft();
  d.body = "x";
  d.outcomeText = "should clear";
  d.outcomeVsFear = "better";
  const rec = progressRecord(d, "now");
  assert.equal(rec.outcomeText, "");
  assert.equal(rec.outcomeVsFear, null);
  assert.equal(thoughtStatus(rec), "open");
});

test("AC-19 filter by status", () => {
  const thoughts = [
    ruminationRecord("a", "1"),
    progressRecord({ ...emptyDraft(), body: "b" }, "2"),
    { ...progressRecord({ ...emptyDraft(), body: "c" }, "3"), outcomeVsFear: "better" },
  ];
  assert.equal(filterThoughts(thoughts, "rum").length, 1);
  assert.equal(filterThoughts(thoughts, "open").length, 1);
  assert.equal(filterThoughts(thoughts, "done").length, 1);
  assert.equal(filterThoughts(thoughts, "all").length, 3);
});

test("AC-17/18 backup roundtrip", () => {
  const data = { thoughts: [{ id: "t1" }], wins: [{ id: "w1" }] };
  const json = JSON.stringify(buildBackup(data, "2026-01-01T00:00:00.000Z"));
  const restored = parseBackupText(json);
  assert.deepEqual(restored.thoughts, data.thoughts);
  assert.deepEqual(restored.wins, data.wins);
  assert.equal(isBackupPayload({ thoughts: [], wins: [] }), true);
  assert.throws(() => parseBackupText("{}"));
  assert.throws(() => parseBackupText("not-json"));
});

test("hasOutcome for archive gate", () => {
  assert.equal(hasOutcome(ruminationRecord("x")), false);
  assert.equal(hasOutcome(progressRecord(emptyDraft())), false);
  assert.equal(hasOutcome({ kind: "progress", outcomeText: "ok", outcomeVsFear: null }), true);
});

console.log("qa_protocol_smoke: all passed");
