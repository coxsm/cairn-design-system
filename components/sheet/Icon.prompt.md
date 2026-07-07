Renders one of the seven hand-inked Cairn sheet icons as inline SVG, at any square size.

```jsx
<Icon name="str" size={72} />
<Icon name="hp" size={96} title="Hit Protection" />
```

Variants: `name` is one of `str | dex | wil | hp | armor | coin | deprived` (see `ICON_NAMES` export). Icons are pure black linework on transparent ground — they inherit `currentColor`-free fill baked at export time (always ink-black), so use them on paper-colored surfaces, not inside dark/inverse panels. There is no "generic icon font" in this system: these seven illustrations are the entire iconography (see readme.md → Iconography).
