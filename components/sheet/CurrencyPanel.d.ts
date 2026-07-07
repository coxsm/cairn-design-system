import * as React from "react";

export interface CurrencyPanelProps {
  /** Gold piece amount. */
  gp?: string | number;
  /** Silver piece amount. */
  sp?: string | number;
  /** Copper piece amount. */
  cp?: string | number;
  /** Coin icon size in px. */
  size?: number;
}

/**
 * Coin icon paired with the GP / SP / CP tally rows — reproduces the
 * currency block baked into the source printout's coin illustration, but
 * as three live fields instead of hand-lettered art.
 */
export declare function CurrencyPanel(props: CurrencyPanelProps): JSX.Element;
