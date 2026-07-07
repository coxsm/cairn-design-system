Right-rail stat block — icon breaching the top border of a thin-ruled box, as on the printout.

```jsx
<StatBadge icon="armor" value={1} />
<StatBadge icon="hp" split accent="crimson" value={4} max={6} />
<StatBadge icon="str" split value={14} max={14} />
```

Variants: plain box (Armor, Coin) vs `split` slash box reading "current / max" — the max is subtle gray since abilities and HP heal back to it. `accent="crimson"` paints value + slash in the system's one accent color and belongs to HP alone. Empty values leave the slash standing ready to be written over, like the unfilled paper sheet.
