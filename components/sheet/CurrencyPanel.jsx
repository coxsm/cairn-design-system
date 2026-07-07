import React from "react";
import { Icon } from "./Icon";

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-2)" }}>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: "var(--weight-bold)",
          fontSize: "var(--text-sm)",
          letterSpacing: "var(--tracking-header)",
          lineHeight: 1.3,
          width: 26,
          flex: "0 0 auto",
          color: "var(--text-primary)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          minWidth: 56,
          borderBottom: "var(--stroke-hairline) solid var(--border-default)",
          textAlign: "left",
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-md)",
          color: value === "" || value == null ? "var(--text-placeholder)" : "var(--text-primary)",
          lineHeight: 1.3,
          padding: "0 4px 2px",
        }}
      >
        {value === "" || value == null ? "\u00A0" : value}
      </span>
    </div>
  );
}

export function CurrencyPanel({ gp = "", sp = "", cp = "", size = 88 }) {
  const px = Number(size) || 88; // coerce — <x-import> passes attributes as strings
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
      <Icon name="coin" size={px} />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", minWidth: 110 }}>
        <Row label="GP" value={gp} />
        <Row label="SP" value={sp} />
        <Row label="CP" value={cp} />
      </div>
    </div>
  );
}
