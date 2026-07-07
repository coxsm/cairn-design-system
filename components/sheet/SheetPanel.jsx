import React from "react";

export function SheetPanel({ children, style, padded = true }) {
  return (
    <div
      style={{
        position: "relative",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface-raised)",
        padding: padded ? "var(--space-4)" : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
