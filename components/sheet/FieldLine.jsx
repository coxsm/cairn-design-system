import React from "react";

export function FieldLine({ label, value = "", area = false, size = "base" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)", width: "100%" }}>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: "var(--weight-semibold)",
          fontSize: "var(--text-xs)",
          letterSpacing: "var(--tracking-header)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          minHeight: area ? 64 : 28,
          borderBottom: "var(--stroke-hairline) solid var(--border-default)",
          fontFamily: "var(--font-serif)",
          fontSize: size === "lg" ? "var(--text-md)" : "var(--text-base)",
          color: value ? "var(--text-primary)" : "var(--text-placeholder)",
          paddingBottom: "var(--space-1)",
          whiteSpace: "pre-wrap",
        }}
      >
        {value || ""}
      </div>
    </div>
  );
}
