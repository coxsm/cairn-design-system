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
  if (notes != null && /^[0-2]$/.test(notes)) notesPages = Number(notes);
  else notesPages = Number(localStorage.getItem("notesPages") || "0");
}

function persistSettings() {
  localStorage.setItem("sheetMode", sheetMode);
  localStorage.setItem("notesPages", String(notesPages));
}

function slotText(text) {
  if (!text) return `<div style="${EMPTY_SLOT_STYLE}"></div>`;
  return `<div style="${SLOT_STYLE}">${escapeHtml(text)}</div>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderNotesPage(content = "") {
  return `
    <div class="print-notes-page">
      <div class="print-notes-frame">
        <span class="print-notes-notch-top" aria-hidden="true"></span>
        <span class="print-notes-notch-bottom" aria-hidden="true"></span>
        <div class="print-notes-content">${content}</div>
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
      ? Array.from({ length: notesPages }, (_, i) =>
          renderNotesPage(i === 0 && view.notesOverflow ? view.notesOverflow : "")
        ).join("")
      : "";

  return `
    <div class="print-sheet">
      <div class="print-main">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--surface-panel);border-radius:var(--radius-sm);padding:10px 16px;min-height:48px;flex:0 0 auto;">
          <div style="font-weight:700;font-size:20px;line-height:1.2;color:${nameColor};flex:1;min-width:0;">${escapeHtml(nameText)}</div>
          <div data-mount="condition"></div>
        </div>

        <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-raised);min-height:64px;flex:0 0 auto;">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            <div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Hands</div>
            ${slotText(hands[0])}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotText(hands[1])}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <span aria-hidden="true" style="position:absolute;left:-3px;top:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
          <span aria-hidden="true" style="position:absolute;left:-3px;bottom:10px;width:5px;height:5px;border-top:1px solid var(--ink-300);border-right:1px solid var(--ink-300);transform:rotate(45deg);background:var(--surface-page);"></span>
        </div>

        <div style="position:relative;display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--surface-raised);min-height:64px;flex:0 0 auto;">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            <div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Body</div>
            ${slotText(body[0])}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotText(body[1])}
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
          <div style="position:absolute;top:40px;left:14px;right:calc(50% + 14px);bottom:16px;font-size:11px;line-height:1.5;color:var(--text-primary);overflow:hidden;overflow-wrap:break-word;word-break:break-word;">${view.notesLeft}</div>
          <div style="position:absolute;top:40px;left:calc(50% + 14px);right:14px;bottom:16px;font-size:11px;line-height:1.5;color:var(--text-primary);overflow:hidden;overflow-wrap:break-word;word-break:break-word;">${view.notesRight}</div>
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
    [slots[0], slots[1]],
    [slots[2], slots[3]],
    [slots[4], slots[5]],
  ];
  return rows
    .map((pair, i) => {
      const border = i > 0 ? "border-top:1px solid var(--border-hairline);" : "";
      const label =
        i === 0
          ? `<div style="position:absolute;top:5px;left:14px;font-size:10px;font-weight:600;letter-spacing:.06em;color:var(--text-muted);">Backpack</div>`
          : "";
      return `
        <div style="display:grid;grid-template-columns:1fr 1fr;min-height:64px;${border}">
          <div style="position:relative;padding:10px 30px 10px 14px;display:flex;flex-direction:column;justify-content:center;">
            ${label}
            ${slotText(pair[0])}
            <span aria-hidden="true" style="position:absolute;top:8px;right:8px;width:12px;height:12px;border:1px solid var(--border-default);border-radius:2px;background:var(--surface-raised);"></span>
          </div>
          <div style="position:relative;padding:10px 30px 10px 14px;border-left:1px solid var(--border-hairline);display:flex;flex-direction:column;justify-content:center;">
            ${slotText(pair[1])}
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

function buildCharacter() {
  if (sheetMode === "blank") return null;
  if (sheetMode === "pencil") {
    const stats = rollStatsOnly();
    return { attrs: stats.attrs, hp: stats.hp };
  }
  return rollCharacter(gameData);
}

function render() {
  const character = buildCharacter();
  const view = applyDisplayMode(character, sheetMode);
  const app = document.getElementById("app");
  unmountBadges();
  app.innerHTML = renderSheet(view);
  mountBadges(view);
  updateControlUi();
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
    if (!btn) return;
    sheetMode = btn.dataset.mode;
    persistSettings();
    render();
  });

  document.getElementById("notes-buttons").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-notes]");
    if (!btn) return;
    notesPages = Number(btn.dataset.notes);
    persistSettings();
    render();
  });
}

async function init() {
  readSettings();
  const res = await fetch("data/character-data.json");
  gameData = await res.json();
  wireControls();
  render();
}

init();
