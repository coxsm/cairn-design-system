import React from "react";
import { Icon } from "./Icon";

export function ConditionMark({ label = "Deprived", checked = false, size = 56, showIcon = false }) {
  const px = Number(size) || 56; // coerce — <x-import> passes attributes as strings
  const isChecked = checked === true || checked === "true";
  const withIcon = showIcon === true || showIcon === "true";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-3)" }}>
      {withIcon ? <Icon name="deprived" size={px} /> : null}
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: "var(--weight-bold)",
          fontSize: 12,
          lineHeight: 1.2,
          letterSpacing: "0.02em",
          color: "var(--text-primary)",
        }}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: 20,
          height: 20,
          border: "1px solid var(--border-rule)",
          borderRadius: 3,
          background: isChecked ? "var(--ink-700)" : "var(--surface-raised)",
          flex: "0 0 auto",
        }}
      ></span>
    </div>
  );
}
