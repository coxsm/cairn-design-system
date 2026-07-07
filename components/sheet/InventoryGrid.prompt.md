The sheet's inventory block: Hands / Body / Backpack row-boxes, two slots per row, a fatigue tickbox in each slot's corner.

```jsx
<InventoryGrid
  items={[
    { text: "Sword (d8)" }, { text: "Torch" },          // Hands
    { text: "Chainmail (2 Armor)" }, {},                 // Body
    { text: "Rations (3 days)", fatigue: true },         // Backpack…
  ]}
/>
```

`sections` defaults to the canonical 10-slot split (Hands 1 row, Body 1 row, Backpack 3 rows) — override only for hirelings/mounts. `items` is a flat array in slot order; set `fatigue` to fill a slot's tickbox. Blank items render as empty ruled slots ready to be written in.
