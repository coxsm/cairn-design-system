import * as React from "react";

export interface SheetPanelProps {
  children: React.ReactNode;
  /** Extra/override styles merged onto the panel (e.g. width, flex layout of children). */
  style?: React.CSSProperties;
  /** Set false to remove internal padding when a child needs to bleed to the edge. */
  padded?: boolean;
}

/**
 * Thin-ruled panel — the sheet's container primitive: 1px gray border,
 * slight rounding (--radius-md), white fill, no shadow.
 */
export declare function SheetPanel(props: SheetPanelProps): JSX.Element;
