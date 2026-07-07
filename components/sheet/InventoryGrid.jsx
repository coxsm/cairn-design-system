import React from "react";

const DEFAULT_SECTIONS = [
  { label: "Hands", rows: 1 },
  { label: "Body", rows: 1 },
  { label: "Backpack", rows: 3 },
];

const chevron = (vertical) => ({
  position: "absolute",
  left: -3,
  [vertical]: 10,
  width: 5,
  height: 5,
  borderTop: "1px solid var(--ink-300)",
  borderRight: "1px solid var(--ink-300)",
  transform: "rotate(45deg)",
  background: "var(--surface-page)",
});

export function InventoryGrid({ sections = DEFAULT_SECTIONS, items = [], gap = 10 }) {
  let slot = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: Number(gap) || 10, fontFamily: "var(--font-serif)" }}>
      {sections.map((section, si) => (
        <div
          key={si}
          style={{
            position: "relative",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-sm)",
            background: "var(--surface-raised)",
          }}
        >
          {Array.from({ length: Number(section.rows) || 1 }).map((_, ri) => {
            const cells = [0, 1].map(() => {
              const item = items[slot] || {};
              slot += 1;
              return item;
            });
            return (
              <div
                key={ri}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  minHeight: 64,
                  borderTop: ri > 0 ? "1px solid var(--border-hairline)" : "none",
                }}
              >
                {cells.map((item, ci) => (
                  <div
                    key={ci}
                    style={{
                      position: "relative",
                      padding: "10px 30px 10px 14px",
                      borderLeft: ci === 1 ? "1px solid var(--border-hairline)" : "none",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {ci === 0 && ri === 0 && section.label ? (
                      <div style={{ position: "absolute", top: 5, left: 14, fontSize: 10, fontWeight: "var(--weight-semibold)", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                        {section.label}
                      </div>
                    ) : null}
                    <div style={{ fontSize: 13, lineHeight: 1.4, color: item.text ? "var(--text-primary)" : "var(--text-placeholder)", overflowWrap: "break-word", wordBreak: "break-word" }}>
                      {item.text || ""}
                    </div>
                    <span
                      aria-hidden="true"
                      title="Fatigue"
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 12,
                        height: 12,
                        border: "1px solid var(--border-default)",
                        borderRadius: 2,
                        background: item.fatigue ? "var(--ink-700)" : "var(--surface-raised)",
                      }}
                    ></span>
                  </div>
                ))}
              </div>
            );
          })}
          <span aria-hidden="true" style={chevron("top")}></span>
          <span aria-hidden="true" style={chevron("bottom")}></span>
        </div>
      ))}
    </div>
  );
}
