import {
  rollCharacter,
  rollStatsOnly,
  applyDisplayMode,
} from "./generator.js";

const MODES = ["filled", "blank", "pencil"];
const React = window.React;
const ReactDOM = window.ReactDOM;
const { createElement: h } = React;
const { createRoot } = ReactDOM;

let gameData = null;
let sheetMode = "filled";
let notesPages = 0;
let badgeRoots = [];
let sessionCharacter = null;
let statOverrides = null;
let domSnapshot = null;

const SLOT_STYLE =
  "font-size:13px;line-height:1.4;min-height:18px;color:var(--text-primary);overflow-wrap:break-word;word-break:break-word;";
const EMPTY_SLOT_STYLE =
  "font-size:13px;line-height:1.4;min-height:18px;color:var(--text-muted);overflow-wrap:break-word;word-break:break-word;";

function readSettings() {
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode");
  const notes = params.get("notes");
  if (mode && MODES.includes(mode)) sheetMode = mode;
  else sheetMode = localStorage.getItem("sheetMode") || "filled";
  if (notes != null && /^[01]$/.test(notes)) notesPages = Number(notes);
  else {
    const stored = Number(localStorage.getItem("notesPages") || "0");
    notesPages = stored > 1 ? 1 : stored;
  }
}

function persistSettings() {
  localStorage.setItem("sheetMode", sheetMode);
  localStorage.setItem("notesPages", String(notesPages));
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slotCell(text, slotIndex) {
  const style = text ? SLOT_STYLE : EMPTY_SLOT_STYLE;
  const content = text ? escapeHtml(text) : "";
  return `<div data-slot="${slotIndex}" contenteditable="true" spellcheck="false" style="${style}">${content}</div>`;
}

function captureSheetState() {
  const nameEl = document.querySelector('[data-field="name"]');
  if (!nameEl) return null;
  return {
    name: nameEl.textContent.trim(),
    slots: [...document.querySelectorAll("[data-slot]")].map((el) =>
      el.textContent.trim()
    ),
    notesLeft: document.querySelector('[data-field="notes-left"]')?.innerHTML || "",
    notesRight: document.querySelector('[data-field="notes-right"]')?.innerHTML || "",
  };
}

function applyDomSnapshot(view) {
  if (!domSnapshot) return view;
  return {
    ...view,
    name: domSnapshot.name || view.name,
    namePlaceholder: !domSnapshot.name && view.namePlaceholder,
    slots: domSnapshot.slots?.length === 10 ? domSnapshot.slots : view.slots,
    notesLeft: domSnapshot.notesLeft || view.notesLeft,
    notesRight: domSnapshot.notesRight || view.notesRight,
  };
}

function applyStatOverrides(view) {
  if (!statOverrides) return view;
  const stats = { ...view.stats };
  const setSplit = (key) => {
    const val = statOverrides[key];
    if (val == null || val === "") return;
    if (sheetMode === "pencil") stats[key] = { max: String(val) };
    else if (sheetMode === "filled")
      stats[key] = { value: String(val), max: String(val) };
  };
  const setPlain = (key) => {
    const val = statOverrides[key];
    if (val != null && val !== "") stats[key] = { value: String(val) };
  };
  setSplit("hp");
  setSplit("str");
  setSplit("dex");
  setSplit("wil");
  setPlain("armor");
  setPlain("coin");
  return { ...view, stats };
}

function renderNotesPage(content = "") {
  const editable =
    content ?
      `<div class="print-notes-content" contenteditable="true" spellcheck="false">${content}</div>`
    : `<div class="print-notes-content" contenteditable="true" spellcheck="false"></div>`;
  return `
    <div class="print-notes-page">
      <div class="print-notes-frame">
        <span class="print-notes-notch-top" aria-hidden="true"></span>
        <span class="print-notes-notch-bottom" aria-hidden="true"></span>
        ${editable}
      </div>
    </div>`;
}

function renderSheet(view) {
  const nameColor = view.namePlaceholder
    ? "var(--ink-150)"
    : "var(--text-primary)";
  const nameText = view.name || "Name";

  const hands = view.slots.slice(0, 2);
  const body = view.slots.slice(2, 4);
  const backpack = view.slots.slice(4, 10);

  const notesPagesHtml =
    notesPages > 0
      ? renderNotesPage(notesPages > 0 && view.notesOverflow ? view.notesOverflow : "")
      : "";

  return `
    <div class="print-sheet sheet-editable">
      <div class="print-main">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--surface-panel);border-radius:var(--radius-sm);padding:10px 16px;min-height:48px;flex:0 0 auto;">
          <div data-field="name" contenteditable="true" spellcheck="false" style="font-weight:700;font-size:20px;line-height:1.2;color:${nameColor};flex:1;min-width:0;">${escapeHtml(nameText)}</div>
          <div data-mount="condition"></div>
        </div>

        <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-raised);min-height:64px;flex:0 0 auto;">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            <div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Hands</div>
            ${slotCell(hands[0], 0)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotCell(hands[1], 1)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <span aria-hidden="true" style="position:absolute;left:-3px;top:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
          <span aria-hidden="true" style="position:absolute;left:-3px;bottom:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
        </div>

        <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-raised);min-height:64px;flex:0 0 auto;">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            <div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Body</div>
            ${slotCell(body[0], 2)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotCell(body[1], 3)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <span aria-hidden="true" style="position:absolute;left:-3px;top:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
          <span aria-hidden="true" style="position:absolute;left:-3px;bottom:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
        </div>

        <div style="position:relative;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-raised);flex:0 0 auto;">
          ${renderBackpackRows(backpack)}
          <span aria-hidden="true" style="position:absolute;left:-3px;top:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
          <span aria-hidden="true" style="position:absolute;left:-3px;bottom:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
        </div>

        <div style="position:relative;flex:1;min-height:0;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-raised);">
          <div style="position:absolute;top:12px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Notes</div>
          <div style="position:absolute;left:50%;top:44px;bottom:20px;width:1px;background:var(--border-hairline);"></div>
          <span aria-hidden="true" style="position:absolute;top:-5px;left:50%;margin-left:-5px;width:9px;height:9px;background:var(--surface-page);border-right:1px solid var(--border-default);border-bottom:1px solid var(--border-default);transform:rotate(45deg);"></span>
          <span aria-hidden="true" style="position:absolute;bottom:-5px;left:50%;margin-left:-5px;width:9px;height:9px;background:var(--surface-page);border-left:1px solid var(--border-default);border-top:1px solid var(--border-default);transform:rotate(45deg);"></span>
          <div data-field="notes-left" contenteditable="true" spellcheck="false" style="position:absolute;top:40px;left:14px;right:calc(50% + 14px);bottom:16px;font-size:11px;line-height:1.5;color:var(--text-primary);overflow:hidden;overflow-wrap:break-word;word-break:break-word;">${view.notesLeft}</div>
          <div data-field="notes-right" contenteditable="true" spellcheck="false" style="position:absolute;top:40px;left:calc(50% + 14px);right:14px;bottom:16px;font-size:11px;line-height:1.5;color:var(--text-primary);overflow:hidden;overflow-wrap:break-word;word-break:break-word;">${view.notesRight}</div>
        </div>
      </div>

      <div class="print-rail">
        <div data-mount="armor"></div>
        <div data-mount="hp"></div>
        <div data-mount="str"></div>
        <div data-mount="dex"></div>
        <div data-mount="wil"></div>
        <div data-mount="coin"></div>
      </div>
    </div>
    ${notesPagesHtml}`;
}

function renderBackpackRows(slots) {
  const rows = [
    [slots[0], slots[1], 4],
    [slots[2], slots[3], 6],
    [slots[4], slots[5], 8],
  ];
  return rows
    .map((row, i) => {
      const [a, b, baseIndex] = row;
      const border = i > 0 ? "border-top:1px solid var(--border-hairline);" : "";
      const label =
        i === 0
          ? `<div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Backpack</div>`
          : "";
      return `
        <div style="display:grid;grid-template-columns:1fr 1fr;min-height:64px;${border}">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            ${label}
            ${slotCell(a, baseIndex)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotCell(b, baseIndex + 1)}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
        </div>`;
    })
    .join("");
}

function unmountBadges() {
  for (const root of badgeRoots) {
    try {
      root.unmount();
    } catch {
      /* ignore */
    }
  }
  badgeRoots = [];
}

function mountBadges(view) {
  const { StatBadge, ConditionMark } = window.CairnDesignSystem_b44824;
  const mounts = document.querySelectorAll("[data-mount]");
  const specs = {
    condition: { component: ConditionMark, props: { hintSize: "110px,22px" } },
    armor: { component: StatBadge, props: { icon: "armor", size: 72, ...view.stats.armor } },
    hp: {
      component: StatBadge,
      props: { icon: "hp", split: true, accent: "crimson", size: 66, ...view.stats.hp },
    },
    str: { component: StatBadge, props: { icon: "str", split: true, size: 66, ...view.stats.str } },
    dex: { component: StatBadge, props: { icon: "dex", split: true, size: 68, ...view.stats.dex } },
    wil: { component: StatBadge, props: { icon: "wil", split: true, size: 72, ...view.stats.wil } },
    coin: { component: StatBadge, props: { icon: "coin", size: 66, ...view.stats.coin } },
  };

  for (const el of mounts) {
    const spec = specs[el.dataset.mount];
    if (!spec) continue;
    const root = createRoot(el);
    root.render(h(spec.component, spec.props));
    badgeRoots.push(root);
  }
}

function statValueFromView(view, key) {
  const s = view.stats[key] || {};
  return s.value ?? s.max ?? "";
}

function syncStatInputs(view) {
  const panel = document.getElementById("stat-inputs");
  if (!panel) return;
  const show =
    sheetMode === "filled" || sheetMode === "pencil" ? "grid" : "none";
  panel.style.display = show;

  const fields = {
    hp: document.getElementById("stat-hp"),
    str: document.getElementById("stat-str"),
    dex: document.getElementById("stat-dex"),
    wil: document.getElementById("stat-wil"),
    armor: document.getElementById("stat-armor"),
    coin: document.getElementById("stat-coin"),
  };

  for (const [key, input] of Object.entries(fields)) {
    if (!input) continue;
    const override = statOverrides?.[key];
    input.value =
      override != null ? override : statValueFromView(view, key);
    input.disabled = sheetMode === "pencil" && (key === "armor" || key === "coin");
  }
}

function buildCharacter(forceNew = false) {
  if (sheetMode === "blank") {
    sessionCharacter = null;
    return null;
  }
  if (!forceNew && sessionCharacter) return sessionCharacter;
  if (sheetMode === "pencil") {
    const stats = rollStatsOnly();
    sessionCharacter = { attrs: stats.attrs, hp: stats.hp };
  } else {
    sessionCharacter = rollCharacter(gameData);
  }
  statOverrides = null;
  return sessionCharacter;
}

function render({ forceNew = false, preserveDom = false } = {}) {
  if (preserveDom) domSnapshot = captureSheetState();
  else if (forceNew) domSnapshot = null;

  const character = buildCharacter(forceNew);
  let view = applyDisplayMode(character, sheetMode);
  view = applyDomSnapshot(view);
  view = applyStatOverrides(view);

  const app = document.getElementById("app");
  unmountBadges();
  app.innerHTML = renderSheet(view);
  mountBadges(view);
  syncStatInputs(view);
  updateControlUi();
  domSnapshot = null;
}

function updateControlUi() {
  document.querySelectorAll("#mode-buttons button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === sheetMode);
  });
  document.querySelectorAll("#notes-buttons button").forEach((btn) => {
    btn.classList.toggle("active", Number(btn.dataset.notes) === notesPages);
  });
}

function wireControls() {
  const controls = document.getElementById("controls");
  controls.hidden = false;

  document.getElementById("mode-buttons").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn || btn.dataset.mode === sheetMode) return;
    sheetMode = btn.dataset.mode;
    persistSettings();
    render({ forceNew: true });
  });

  document.getElementById("notes-buttons").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-notes]");
    if (!btn || Number(btn.dataset.notes) === notesPages) return;
    notesPages = Number(btn.dataset.notes);
    persistSettings();
    render({ preserveDom: true });
  });

  document.getElementById("stat-inputs").addEventListener("input", (e) => {
    const input = e.target.closest("input[data-stat]");
    if (!input) return;
    if (!statOverrides) statOverrides = {};
    statOverrides[input.dataset.stat] = input.value;
    const character = sessionCharacter;
    let view = applyDisplayMode(character, sheetMode);
    view = applyDomSnapshot(captureSheetState() || {});
    view = applyStatOverrides(view);
    unmountBadges();
    mountBadges(view);
  });
}

async function init() {
  readSettings();
  const res = await fetch("data/character-data.json");
  gameData = await res.json();
  wireControls();
  render({ forceNew: true });
}

init();
