import * as React from "react";

export interface FieldLineProps {
  /** Small uppercase caption above the rule, e.g. "Name", "Look", "Background". */
  label: string;
  /** Filled-in text. Empty renders a faint placeholder-colored blank. */
  value?: string;
  /** Taller variant (multi-line) for longer prose fields like Look/Background. */
  area?: boolean;
  /** "base" (default) or "lg" for a larger value size. */
  size?: "base" | "lg";
}

/**
 * A labeled fill-in blank: small caps caption over a hairline rule. This is
 * the sheet's generic "write here" pattern (Name, Look, Background, Bonds…).
 * In the character-sheet template itself, fields like these are written as
 * plain editable template text rather than through this component, so a
 * consumer can click straight into them — use FieldLine when composing a
 * *new* screen that needs the same visual pattern.
 */
export declare function FieldLine(props: FieldLineProps): JSX.Element;
