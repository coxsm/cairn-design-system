import * as React from "react";

export interface InventoryItem {
  /** Item description text. Empty renders a blank slot. */
  text?: string;
  /** Fills the slot's fatigue tickbox (upper-right of the slot). */
  fatigue?: boolean;
}

export interface InventorySection {
  /** Section caption shown in the first slot of the section's first row — "Hands", "Body", "Backpack". */
  label: string;
  /** Number of two-slot rows in this section. */
  rows: number;
}

export interface InventoryGridProps {
  /** Defaults to the sheet's canonical split: Hands (1 row), Body (1 row), Backpack (3 rows) = 10 slots. */
  sections?: InventorySection[];
  /** Flat array; index i fills slot i (left-to-right, top-to-bottom across sections). */
  items?: InventoryItem[];
  /** Vertical gap between rows in px. */
  gap?: number;
}

/**
 * The sheet's inventory: labeled row-boxes of two slots each (Hands, Body,
 * Backpack ×3 = 10 slots), every slot carrying a fatigue tickbox in its
 * upper-right corner. Thin gray borders, slight rounding, corner chevrons.
 */
export declare function InventoryGrid(props: InventoryGridProps): JSX.Element;
