import * as React from "react";
import { CairnIconName } from "./Icon";

export interface StatBadgeProps {
  /** Which icon crowns the box — armor, hp, str, dex, wil, or coin. */
  icon: CairnIconName;
  /** Current value (left of the slash in split mode, centered otherwise). */
  value?: string | number;
  /** Maximum value — rendered right of the slash in subtle gray. */
  max?: string | number;
  /** Icon size in px; the icon breaches the box's top border. */
  size?: number;
  /** Split mode: renders a "current / max" slash box (HP, STR, DEX, WIL). Omit for a plain box (Armor, Coin). */
  split?: boolean;
  /** "crimson" paints the current value + slash in the HP accent. Use on HP only. */
  accent?: "crimson" | "";
  /** Optional small caption under the box (usually omitted — the icon art bears the name). */
  label?: string;
}

/**
 * Right-rail stat block from the sheet: an icon breaching the top border of
 * a thin-ruled, slightly-rounded box. `split` gives the "current / max"
 * slash (max in subtle gray); `accent="crimson"` is reserved for HP.
 */
export declare function StatBadge(props: StatBadgeProps): JSX.Element;
