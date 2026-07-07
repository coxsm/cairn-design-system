import * as React from "react";

export interface ConditionMarkProps {
  /** Defaults to "Deprived" — the only condition the sheet tracks by name. */
  label?: string;
  /** Whether the tickbox renders filled (marked). */
  checked?: boolean;
  /** Also render the deprived icon before the label (off by default — the sheet's Name bar shows label + box only). */
  showIcon?: boolean;
  /** Icon size in px when showIcon is set. */
  size?: number;
}

/**
 * "Deprived" label with a tickbox, as it appears at the right end of the
 * sheet's Name bar. A PC lacking food, water or rest is Deprived: they stop
 * recovering HP/abilities and accrue Fatigue. Set `showIcon` to include the
 * kneeling-figure illustration where there's room for it.
 */
export declare function ConditionMark(props: ConditionMarkProps): JSX.Element;
