import React from "react";
import { Icon } from "./Icon";

export function StatBadge({ icon, value = "", max = "", size = 76, split = false, accent = "", label }) {
  const px = Number(size) || 76; // coerce — <x-import> passes attributes as strings
  const isSplit = split === true || split === "true";
  const isAccent = accent === "crimson" || accent === true || accent === "true";
  const valueColor = isAccent ? "var(--accent-hp)" : "var(--text-primary)";
  const slashColor = "var(--ink-150)"; // slash always gray — accent colors the value only
  const tick = (side) => ({
    position: "absolute",
    top: -3,
    [side]: 8,
    width: 5,
    height: 5,
    borderBottom: "1px solid var(--ink-300)",
    borderRight: "1px solid var(--ink-300)",
    transform: "rotate(45deg)",
    background: "var(--surface-page)",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", fontFamily: "var(--font-serif)" }}>
      <span
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--surface-page)",
          padding: "0 8px",
          marginBottom: -Math.round(px * 0.24),
          lineHeight: 0,
        }}
      >
        <Icon name={icon} size={px} />
      </span>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 82,
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-raised)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: `${Math.round(px * 0.24) + 8}px 10px 10px`,
        }}
      >
        <span aria-hidden="true" style={tick("left")}></span>
        <span aria-hidden="true" style={tick("right")}></span>
        {isSplit ? (
          <React.Fragment>
            <span style={{ fontWeight: "var(--weight-bold)", fontSize: 20, lineHeight: 1.1, color: valueColor, minWidth: 18, textAlign: "right" }}>{value}</span>
            <span style={{ fontSize: 26, lineHeight: 1, fontWeight: "var(--weight-regular)", color: slashColor, transform: "skewX(-10deg)" }}>/</span>
            <span style={{ fontWeight: "var(--weight-semibold)", fontSize: 16, lineHeight: 1.1, color: "var(--ink-300)", minWidth: 18, textAlign: "left" }}>{max}</span>
          </React.Fragment>
        ) : (
          <span style={{ fontWeight: "var(--weight-bold)", fontSize: 20, lineHeight: 1.1, color: valueColor }}>{value}</span>
        )}
      </div>
      {label ? (
        <div style={{ marginTop: 6, fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-header)", textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</div>
      ) : null}
    </div>
  );
}
