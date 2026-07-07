import * as React from "react";

export interface SectionHeadingProps {
  children: React.ReactNode;
  /** "base" (default, 14px) or "lg" (18px). */
  size?: "base" | "lg";
}

/**
 * Plain bold uppercase heading — titles every Rules Summary block (SAVES,
 * COMBAT, ACTIONS, HEALING, INVENTORY, SPELLBOOKS). No underline, no rule —
 * the printout's headers are bare bold caps.
 */
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
