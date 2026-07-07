import * as React from "react";

export type CairnIconName =
  | "str"
  | "dex"
  | "wil"
  | "hp"
  | "armor"
  | "coin"
  | "deprived";

export interface IconProps {
  /** Which of the seven hand-inked sheet icons to render. */
  name: CairnIconName;
  /** Square render size in px (icons are inlined SVG and scale losslessly). */
  size?: number;
  /** Accessible label; defaults to the icon name. */
  title?: string;
  style?: React.CSSProperties;
  className?: string;
}

/** The seven Cairn icon names, for building pickers/menus. */
export declare const ICON_NAMES: CairnIconName[];

/**
 * Renders one of the seven woodcut-style Cairn sheet icons (str, dex, wil,
 * hp, armor, coin, deprived) as inline SVG. This is the one "intentional
 * addition" in this library — the source printout has no component system,
 * only these seven baked illustrations, so a thin Icon wrapper is the
 * natural way to make them reusable.
 */
export declare function Icon(props: IconProps): JSX.Element | null;
