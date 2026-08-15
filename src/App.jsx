import { useEffect, useMemo, useRef, useState } from "react";
import { LANG_KEY, STR } from "./i18n";
import {
  STORAGE_KEY,
  buildBackup,
  canAddFear,
  canAdvanceFears,
  canAdvancePlans,
  filterThoughts,
  emptyDraft,
  parseBackupText,
  progressRecord,
  ruminationRecord,
  thoughtStatus,
  thoughtToWin,
} from "./protocol";

function loadLang() {
  try {
    const v = localStorage.getItem(LANG_KEY);
    if (v === "en" || v === "zh") return v;
  } catch {
    /* ignore */
  }
  return "zh";
}

const seed = () => ({
  thoughts: [
    {
      id: "t-rum",
      kind: "rumination",
      createdAt: "2026-08-12 23:14",
      note: "凌晨还在想对方已读不回是不是已经否定我了。",
      body: "",
      fears: [],
      scope: null,
      plans: { a: "", b: "", c: "" },
      uncontrollables: [],
      outcomeText: "",
      outcomeVsFear: null,
      linkedWinId: null,
    },
    {
      id: "t-open",
      kind: "progress",
      createdAt: "2026-08-13 21:40",
      note: "",
      body: "周会材料还没对齐，担心明天被当众问住。",
      fears: [{ text: "被领导认为准备不足，影响这次晋升讨论", pct: 70 }],
      scope: "mid",
      plans: {
        a: "今晚只补齐三页关键数字和两个风险问题。",
        b: "来不及就先发一页提纲，会前十分钟口头对齐。",
        c: "搞砸了大不了会后补发；这不是解雇级事件。",
      },
      uncontrollables: ["领导当天心情", "别人会不会突然改议程"],
      outcomeText: "",
      outcomeVsFear: null,
      linkedWinId: null,
    },
    {
      id: "t-done",
      kind: "progress",
      createdAt: "2026-08-04 08:05",
      note: "",
      body: "申请材料发出去后，开始循环「一定会被拒」。",
      fears: [{ text: "石沉大海，证明自己根本不够格", pct: 85 }],
      scope: "high",
      plans: {
        a: "把能改的格式错误改完，按清单再检查一遍发出。",
        b: "请一位同事只看第一页是否清楚。",
        c: "被拒就当一次样本；简历还在，人还在。",
      },
      uncontrollables: ["评审偏好", "名额", "时机"],
      outcomeText: "两周后收到进入下一轮的邮件，过程难看，但并没有想象中的终局。",
      outcomeVsFear: "better",
      linkedWinId: null,
    },
  ],
  wins: [
    {
      id: "w1",
      createdAt: "2025-11",
      before: "搞砸一次客户汇报，觉得自己会被移出核心项目。",
      during: "当晚把事实和补救步骤写成一页；第二天先认错再给时间表，连续两周加班把窟窿补上。",
      after: "项目留下了。难堪是真的，但并不是职业生涯结束。",
    },
    {
      id: "w2",
      createdAt: "2024-03",
      before: "一次重要申请被拒，整夜觉得「所有路都封死了」。",
      during: "允许自己难受两天，第三天把拒信里的具体缺口列出来，只改能改的三项。",
      after: "同年晚些时候另一条路径走通。被拒很难看，世界没有因此停转。",
    },
  ],
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return seed();
}

function snippet(t, copy) {
  if (t.kind === "rumination") return t.note || copy.rumSnippet;
  return t.body || copy.emptyThought;
}

function badge(t, copy) {
  const status = thoughtStatus(t);
  if (status === "rum") return { cls: "rum", text: copy.rumBadge };
  if (status === "done") return { cls: "done", text: copy.doneBadge };
  return { cls: "open", text: copy.openBadge };
}

function LangSwitch({ lang, setLang }) {
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button className={lang === "zh" ? "on" : ""} onClick={() => setLang("zh")}>
        中
      </button>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>
        EN
      </button>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(load);
  const [lang, setLangState] = useState(loadLang);
  const copy = STR[lang];
  const [tab, setTab] = useState("thoughts");
  const [screen, setScreen] = useState("home");
  const [formStep, setFormStep] = useState(1);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [winId, setWinId] = useState(null);
  const [winDraft, setWinDraft] = useState({ before: "", during: "", after: "" });
  const [newUnctrl, setNewUnctrl] = useState("");
  const [thoughtFilter, setThoughtFilter] = useState("all");
  const [backupOpen, setBackupOpen] = useState(false);
  const [backupMsg, setBackupMsg] = useState("");
  const [backupErr, setBackupErr] = useState(false);
  const importRef = useRef(null);

  function setLang(next) {
    setLangState(next);
    localStorage.setItem(LANG_KEY, next);
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "念头" : "Thoughts";
  }, [lang]);

  const current = useMemo(
    () => data.thoughts.find((t) => t.id === editingId),
    [data.thoughts, editingId]
  );
  const currentWin = useMemo(
    () => data.wins.find((w) => w.id === winId),
    [data.wins, winId]
  );

  function goHome(which = tab) {
    setTab(which);
    setScreen("home");
    setEditingId(null);
    setWinId(null);
    setFormStep(1);
    setDraft(emptyDraft());
  }

  function goThoughtList() {
    setTab("thoughts");
    setScreen("thought-list");
    setEditingId(null);
    setFormStep(1);
    setDraft(emptyDraft());
  }

  function saveThought(thought, after = "list") {
    const id = thought.id || `t-${Date.now()}`;
    const createdAt =
      thought.createdAt ||
      new Date().toLocaleString(lang === "zh" ? "zh-CN" : "en-US", { hour12: false }).replace(/\//g, "-");
    const next = { ...thought, id, createdAt };
    setData((d) => {
      const exists = d.thoughts.some((t) => t.id === id);
      return {
        ...d,
        thoughts: exists
          ? d.thoughts.map((t) => (t.id === id ? next : t))
          : [next, ...d.thoughts],
      };
    });
    if (after === "stay") {
      setEditingId(id);
      setScreen("detail");
      return;
    }
    goThoughtList();
  }

  function archiveToWin(thought) {
    if (thought.linkedWinId) {
      setTab("wins");
      setWinId(thought.linkedWinId);
      setScreen("win-detail");
      return;
    }
    const id = `w-${Date.now()}`;
    const win = {
      id,
      createdAt: new Date().toISOString().slice(0, 10),
      ...thoughtToWin(thought, copy),
    };
    const nextThought = { ...thought, linkedWinId: id };
    setData((d) => ({
      ...d,
      thoughts: d.thoughts.map((t) => (t.id === thought.id ? nextThought : t)),
      wins: [win, ...d.wins],
    }));
    setTab("wins");
    setWinId(id);
    setScreen("win-detail");
  }

  function saveRumination() {
    saveThought(ruminationRecord(draft.note));
  }

  function confirmProgress() {
    saveThought(progressRecord(draft));
  }

  function fearsOk() {
    return canAdvanceFears(draft);
  }
  function plansOk() {
    return canAdvancePlans(draft);
  }

  function addUnctrl() {
    const v = newUnctrl.trim();
    if (!v) return;
    setDraft((d) => ({ ...d, uncontrollables: [...d.uncontrollables, v] }));
    setNewUnctrl("");
  }

  function exportBackup() {
    const payload = buildBackup(data);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const stamp = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nianyun-backup-${stamp}.json`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBackupErr(false);
    setBackupMsg(copy.exportOk);
  }

  async function importBackup(file) {
    if (!file) return;
    try {
      const restored = parseBackupText(await file.text());
      if (!window.confirm(copy.importConfirm)) return;
      setData(restored);
      setBackupErr(false);
      setBackupMsg(copy.importOk(restored.thoughts.length, restored.wins.length));
    } catch {
      setBackupErr(true);
      setBackupMsg(copy.importBad);
    }
  }

  function BackupCard() {
    return (
      <div className="backup">
        <h3>{copy.backupTitle}</h3>
        <p>{copy.backupHint}</p>
        <button className="outline" onClick={exportBackup}>
          {copy.exportBtn}
        </button>
        <button className="outline" onClick={() => importRef.current?.click()}>
          {copy.importBtn}
        </button>
        <input
          ref={importRef}
          className="file-input"
          type="file"
          accept="application/json,.json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            importBackup(file);
          }}
        />
        {backupMsg ? (
          <p className={`backup-msg${backupErr ? " err" : ""}`}>{backupMsg}</p>
        ) : null}
        <button className="secondary" onClick={() => setBackupOpen(false)}>
          {copy.backupClose}
        </button>
      </div>
    );
  }

  const filteredThoughts = filterThoughts(data.thoughts, thoughtFilter);

  return (
    <div className="stage">
      <div className="phone">
        <div className="topbar">
          <button className="backup-trigger" onClick={() => setBackupOpen(true)}>
            {copy.backupTitle}
          </button>
          <LangSwitch lang={lang} setLang={setLang} />
        </div>
        {backupOpen && (
          <div
            className="sheet-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setBackupOpen(false);
            }}
          >
            <div className="sheet">
              <BackupCard />
            </div>
          </div>
        )}
        <div className="screen">
          {screen === "home" && tab === "thoughts" && (
            <>
              <div className="brand">
                <h1>{copy.appName}</h1>
                <span>{copy.notebook}</span>
              </div>
              <p className="lede">“{copy.lede}”</p>
              <p className="lede-author">{copy.ledeAuthor}</p>
              <button className="primary" onClick={() => setScreen("gate")}>
                {copy.capture}
              </button>
              <button className="outline" onClick={goThoughtList}>
                {copy.existing}
              </button>
              <p className="disclaimer">{copy.disclaimer}</p>
            </>
          )}

          {screen === "thought-list" && (
            <>
              <button className="ghost" onClick={() => goHome("thoughts")}>
                {copy.back}
              </button>
              <h2>{copy.existing}</h2>
              <p className="hint">{copy.existingHint}</p>
              <div className="filters">
                {[
                  ["all", copy.filterAll],
                  ["open", copy.openBadge],
                  ["rum", copy.rumBadge],
                  ["done", copy.doneBadge],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`chip ${thoughtFilter === key ? "on" : ""}`}
                    onClick={() => setThoughtFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="list">
                {filteredThoughts.length === 0 ? (
                  <p className="hint">{copy.filterEmpty}</p>
                ) : (
                  filteredThoughts.map((item) => {
                    const b = badge(item, copy);
                    return (
                      <button
                        key={item.id}
                        className="row"
                        onClick={() => {
                          setEditingId(item.id);
                          setScreen("detail");
                        }}
                      >
                        <div className="meta">
                          <span>{item.createdAt}</span>
                          <span>
                            <span className={`badge ${b.cls}`}>{b.text}</span>
                            {item.scope
                              ? `${copy.scopePrefix}${copy.scopeKeys[item.scope].label}`
                              : ""}
                          </span>
                        </div>
                        <p>{snippet(item, copy)}</p>
                      </button>
                    );
                  })
                )}
              </div>
            </>
          )}

          {screen === "home" && tab === "wins" && (
            <>
              <div className="brand">
                <h1>{copy.winsTitle}</h1>
                <span>{copy.winsSub}</span>
              </div>
              <p className="lede">{copy.winsLede}</p>
              <button
                className="primary"
                onClick={() => {
                  setWinDraft({ before: "", during: "", after: "" });
                  setScreen("win-form");
                }}
              >
                {copy.recordWin}
              </button>
              <div className="list" style={{ marginTop: 18 }}>
                {data.wins.map((w) => (
                  <button
                    key={w.id}
                    className="win-card"
                    onClick={() => {
                      setWinId(w.id);
                      setScreen("win-detail");
                    }}
                  >
                    <div className="meta">
                      <span>{w.createdAt}</span>
                      <span>{copy.winBadge}</span>
                    </div>
                    <p>{w.before}</p>
                  </button>
                ))}
              </div>
              <p className="disclaimer">{copy.disclaimer}</p>
            </>
          )}

          {screen === "gate" && (
            <>
              <button className="ghost" onClick={() => goHome()}>
                {copy.back}
              </button>
              <p className="step-kicker">{copy.gateKicker}</p>
              <h2>{copy.gateTitle}</h2>
              <p className="hint">{copy.gateHint}</p>
              <button
                className="choice"
                onClick={() => {
                  setDraft(emptyDraft());
                  setFormStep(1);
                  setScreen("form");
                }}
              >
                {copy.canProgress}
              </button>
              <button className="choice alt" onClick={() => setScreen("rumination")}>
                {copy.justScare}
              </button>
            </>
          )}

          {screen === "rumination" && (
            <div className="rumination">
              <p className="step-kicker">{copy.rumKicker}</p>
              <h2>{copy.rumTitle}</h2>
              <p className="hint">{copy.rumHint}</p>
              <div className="field">
                <label>{copy.optionalLine}</label>
                <input
                  type="text"
                  value={draft.note}
                  onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                  placeholder={copy.optionalPh}
                />
              </div>
              <button className="primary" onClick={saveRumination}>
                {copy.putDown}
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setDraft((d) => ({ ...emptyDraft(), note: d.note }));
                  setFormStep(1);
                  setScreen("form");
                }}
              >
                {copy.actuallyProgress}
              </button>
            </div>
          )}

          {screen === "form" && (
            <>
              <button
                className="ghost"
                onClick={() => (formStep === 1 ? setScreen("gate") : setFormStep((s) => s - 1))}
              >
                {copy.prev}
              </button>
              {formStep === 1 && (
                <>
                  <p className="step-kicker">2 / 6</p>
                  <h2>{copy.bodyTitle}</h2>
                  <p className="hint">{copy.bodyHint}</p>
                  <textarea
                    rows={5}
                    value={draft.body}
                    onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                    placeholder={copy.bodyPh}
                  />
                  <div className="footer-actions">
                    <button
                      className="primary"
                      disabled={!draft.body.trim()}
                      onClick={() => setFormStep(2)}
                    >
                      {copy.continue}
                    </button>
                  </div>
                </>
              )}
              {formStep === 2 && (
                <>
                  <p className="step-kicker">3 / 6</p>
                  <h2>{copy.fearTitle}</h2>
                  <p className="hint">{copy.fearHint}</p>
                  {draft.fears.map((f, i) => (
                    <div className="field" key={i}>
                      <label>{copy.fearN(i + 1)}</label>
                      <textarea
                        rows={3}
                        value={f.text}
                        onChange={(e) => {
                          const fears = [...draft.fears];
                          fears[i] = { ...f, text: e.target.value };
                          setDraft((d) => ({ ...d, fears }));
                        }}
                        placeholder={copy.fearPh}
                      />
                      <div className="range">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={f.pct}
                          onChange={(e) => {
                            const fears = [...draft.fears];
                            fears[i] = { ...f, pct: Number(e.target.value) };
                            setDraft((d) => ({ ...d, fears }));
                          }}
                        />
                        <strong>{f.pct}%</strong>
                      </div>
                    </div>
                  ))}
                  {canAddFear(draft) && (
                    <button
                      className="secondary"
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          fears: [...d.fears, { text: "", pct: 50 }],
                        }))
                      }
                    >
                      {copy.addFear}
                    </button>
                  )}
                  <div className="footer-actions">
                    <button className="primary" disabled={!fearsOk()} onClick={() => setFormStep(3)}>
                      {copy.continue}
                    </button>
                  </div>
                </>
              )}
              {formStep === 3 && (
                <>
                  <p className="step-kicker">4 / 6</p>
                  <h2>{copy.scopeTitle}</h2>
                  <p className="hint">{copy.scopeHint}</p>
                  <div className="scope">
                    {Object.entries(copy.scopeKeys).map(([k, v]) => (
                      <button
                        key={k}
                        className={draft.scope === k ? "on" : ""}
                        onClick={() => setDraft((d) => ({ ...d, scope: k }))}
                      >
                        <strong>{v.label}</strong>
                        <span>{v.desc}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="primary"
                    disabled={!draft.scope}
                    onClick={() => setFormStep(4)}
                  >
                    {copy.continue}
                  </button>
                </>
              )}
              {formStep === 4 && (
                <>
                  <p className="step-kicker">5 / 6</p>
                  <h2>{copy.plansTitle}</h2>
                  <div className="field">
                    <label>{copy.planA}</label>
                    <textarea
                      rows={3}
                      value={draft.plans.a}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, plans: { ...d.plans, a: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>{copy.planB}</label>
                    <p className="hint">{copy.planBHint}</p>
                    <textarea
                      rows={3}
                      value={draft.plans.b}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, plans: { ...d.plans, b: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label>{copy.planC}</label>
                    <textarea
                      rows={3}
                      value={draft.plans.c}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, plans: { ...d.plans, c: e.target.value } }))
                      }
                      placeholder={copy.planCPh}
                    />
                  </div>
                  <button className="primary" disabled={!plansOk()} onClick={() => setFormStep(5)}>
                    {copy.continue}
                  </button>
                </>
              )}
              {formStep === 5 && (
                <>
                  <p className="step-kicker">6 / 6</p>
                  <h2>{copy.unctrlTitle}</h2>
                  <ul className="unctrl">
                    {draft.uncontrollables.map((u, i) => (
                      <li key={i}>
                        <span>{u}</span>
                        <button
                          className="ghost"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              uncontrollables: d.uncontrollables.filter((_, j) => j !== i),
                            }))
                          }
                        >
                          {copy.remove}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="add-row">
                    <input
                      type="text"
                      value={newUnctrl}
                      onChange={(e) => setNewUnctrl(e.target.value)}
                      placeholder={copy.unctrlPh}
                      onKeyDown={(e) => e.key === "Enter" && addUnctrl()}
                    />
                    <button type="button" onClick={addUnctrl}>
                      {copy.add}
                    </button>
                  </div>
                  <div className="footer-actions">
                    <button className="primary" onClick={() => setScreen("review")}>
                      {copy.toReview}
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {screen === "review" && (
            <>
              <button className="ghost" onClick={() => setScreen("form")}>
                {copy.backEdit}
              </button>
              <p className="step-kicker">{copy.reviewKicker}</p>
              <h2>{copy.reviewTitle}</h2>
              <div className="aha">
                {draft.uncontrollables.length === 0 ? (
                  <p>{copy.reviewEmpty}</p>
                ) : (
                  draft.uncontrollables.map((u) => (
                    <p key={u}>
                      <span className="xmark">✕</span>
                      <span className="struck">{u}</span>
                    </p>
                  ))
                )}
              </div>
              <dl className="summary">
                <dt>{copy.thought}</dt>
                <dd>{draft.body}</dd>
                <dt>{copy.fears}</dt>
                <dd>
                  {draft.fears
                    .filter((f) => f.text.trim())
                    .map((f) => `${f.text}（${f.pct}%）`)
                    .join("；")}
                </dd>
                <dt>{copy.scope}</dt>
                <dd>
                  {draft.scope
                    ? `${copy.scopeKeys[draft.scope].label} · ${copy.scopeKeys[draft.scope].desc}`
                    : "—"}
                </dd>
                <dt>Plan A</dt>
                <dd>{draft.plans.a}</dd>
                <dt>Plan B</dt>
                <dd>{draft.plans.b}</dd>
                <dt>Plan C</dt>
                <dd>{draft.plans.c}</dd>
              </dl>
              <div className="footer-actions">
                <button className="primary" onClick={confirmProgress}>
                  {copy.confirmSave}
                </button>
                <button
                  className="secondary"
                  onClick={() => {
                    setFormStep(5);
                    setScreen("form");
                  }}
                >
                  {copy.backEdit}
                </button>
              </div>
            </>
          )}

          {screen === "detail" && current && (
            <Detail
              thought={current}
              copy={copy}
              onBack={goThoughtList}
              onSave={(next) => saveThought(next)}
              onWins={() => goHome("wins")}
              onArchiveToWin={archiveToWin}
            />
          )}

          {screen === "win-form" && (
            <>
              <button className="ghost" onClick={() => goHome("wins")}>
                {copy.back}
              </button>
              <h2>{copy.winFormTitle}</h2>
              <p className="hint">{copy.winFormHint}</p>
              <div className="field">
                <label>{copy.winBefore}</label>
                <textarea
                  rows={3}
                  value={winDraft.before}
                  onChange={(e) => setWinDraft((w) => ({ ...w, before: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>{copy.winDuring}</label>
                <textarea
                  rows={3}
                  value={winDraft.during}
                  onChange={(e) => setWinDraft((w) => ({ ...w, during: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>{copy.winAfter}</label>
                <textarea
                  rows={3}
                  value={winDraft.after}
                  onChange={(e) => setWinDraft((w) => ({ ...w, after: e.target.value }))}
                />
              </div>
              <button
                className="primary"
                disabled={!winDraft.before.trim() || !winDraft.during.trim() || !winDraft.after.trim()}
                onClick={() => {
                  const id = `w-${Date.now()}`;
                  setData((d) => ({
                    ...d,
                    wins: [
                      {
                        id,
                        createdAt: new Date().toISOString().slice(0, 10),
                        ...winDraft,
                      },
                      ...d.wins,
                    ],
                  }));
                  goHome("wins");
                }}
              >
                {copy.save}
              </button>
            </>
          )}

          {screen === "win-detail" && currentWin && (
            <>
              <button className="ghost" onClick={() => goHome("wins")}>
                {copy.back}
              </button>
              <p className="step-kicker">{currentWin.createdAt}</p>
              <h2>{copy.winDetailTitle}</h2>
              <dl className="summary">
                <dt>{copy.dtBefore}</dt>
                <dd>{currentWin.before}</dd>
                <dt>{copy.dtDuring}</dt>
                <dd>{currentWin.during}</dd>
                <dt>{copy.dtAfter}</dt>
                <dd>{currentWin.after}</dd>
              </dl>
            </>
          )}
        </div>

        {(screen === "home" || screen === "thought-list") && (
          <nav className="tabs">
            <button className={tab === "thoughts" ? "on" : ""} onClick={() => goHome("thoughts")}>
              {copy.tabThoughts}
            </button>
            <button className={tab === "wins" ? "on" : ""} onClick={() => goHome("wins")}>
              {copy.tabWins}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

function Detail({ thought, copy, onBack, onSave, onWins, onArchiveToWin }) {
  const [t, setT] = useState(thought);

  function convertToProgress() {
    setT((prev) => ({
      ...prev,
      kind: "progress",
      body: prev.body || prev.note,
      fears: prev.fears.length ? prev.fears : [{ text: "", pct: 50 }],
    }));
  }

  const canSaveProgress =
    t.kind === "rumination" ||
    (t.body.trim() && t.fears[0]?.text.trim() && t.scope && t.plans.a && t.plans.b && t.plans.c);

  const hasOutcome =
    t.kind === "progress" && Boolean(t.outcomeText.trim() || t.outcomeVsFear);

  return (
    <>
      <button className="ghost" onClick={onBack}>
        {copy.backList}
      </button>
      <p className="step-kicker">{t.createdAt}</p>
      <h2>{t.kind === "rumination" ? copy.rumRecord : copy.thoughtDetail}</h2>

      {t.kind === "rumination" && (
        <>
          <p className="hint">{copy.rumDetailHint}</p>
          <div className="field">
            <label>{copy.leftNote}</label>
            <textarea rows={3} value={t.note} onChange={(e) => setT({ ...t, note: e.target.value })} />
          </div>
          <button className="secondary" onClick={convertToProgress}>
            {copy.convertProgress}
          </button>
        </>
      )}

      {t.kind === "progress" && (
        <>
          <div className="field">
            <label>{copy.triggerBody}</label>
            <textarea rows={3} value={t.body} onChange={(e) => setT({ ...t, body: e.target.value })} />
          </div>
          {t.fears.map((f, i) => (
            <div className="field" key={i}>
              <label>{copy.fearN(i + 1)}</label>
              <textarea
                rows={2}
                value={f.text}
                onChange={(e) => {
                  const fears = [...t.fears];
                  fears[i] = { ...f, text: e.target.value };
                  setT({ ...t, fears });
                }}
              />
              <div className="range">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={f.pct}
                  onChange={(e) => {
                    const fears = [...t.fears];
                    fears[i] = { ...f, pct: Number(e.target.value) };
                    setT({ ...t, fears });
                  }}
                />
                <strong>{f.pct}%</strong>
              </div>
            </div>
          ))}
          {canAddFear(t) && (
            <button
              className="secondary"
              onClick={() => setT({ ...t, fears: [...t.fears, { text: "", pct: 50 }] })}
            >
              {copy.addFear}
            </button>
          )}
          <div className="field">
            <label>{copy.scopeLabel}</label>
            <div className="chip-row">
              {Object.entries(copy.scopeKeys).map(([k, v]) => (
                <button
                  key={k}
                  className={`chip ${t.scope === k ? "on" : ""}`}
                  onClick={() => setT({ ...t, scope: k })}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          {["a", "b", "c"].map((k) => (
            <div className="field" key={k}>
              <label>Plan {k.toUpperCase()}</label>
              <textarea
                rows={2}
                value={t.plans[k]}
                onChange={(e) => setT({ ...t, plans: { ...t.plans, [k]: e.target.value } })}
              />
            </div>
          ))}
          <div className="field">
            <label>{copy.unctrlLabel}</label>
            <p className="hint">
              {t.uncontrollables.map((u) => (
                <span key={u} className="struck" style={{ display: "block" }}>
                  ✕ {u}
                </span>
              ))}
              {t.uncontrollables.length === 0 && copy.none}
            </p>
          </div>
          <div className="field">
            <label>{copy.outcomeLabel}</label>
            <textarea
              rows={3}
              value={t.outcomeText}
              onChange={(e) => setT({ ...t, outcomeText: e.target.value })}
              placeholder={copy.outcomePh}
            />
            <div className="chip-row" style={{ marginTop: 8 }}>
              {Object.entries(copy.outcome).map(([k, label]) => (
                <button
                  key={k}
                  className={`chip ${t.outcomeVsFear === k ? "on" : ""}`}
                  onClick={() => setT({ ...t, outcomeVsFear: k })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="footer-actions">
        <button className="primary" disabled={!canSaveProgress} onClick={() => onSave(t)}>
          {copy.saveEdits}
        </button>
        {hasOutcome && (
          <button className="outline" onClick={() => onArchiveToWin(t)}>
            {t.linkedWinId ? copy.archived : copy.archive}
          </button>
        )}
        <button className="secondary" onClick={onWins}>
          {copy.seeWins}
        </button>
      </div>
    </>
  );
}
