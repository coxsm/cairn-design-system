import React from "react";

export function SectionHeading({ children, size = "base" }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: "var(--weight-bold)",
        fontSize: size === "lg" ? 18 : 14,
        lineHeight: 1.3,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        color: "var(--text-primary)",
        marginBottom: "var(--space-2)",
      }}
    >
      {children}
    </div>
  );
}
