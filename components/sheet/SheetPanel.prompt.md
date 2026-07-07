Thin-ruled panel — the sheet's container primitive.

```jsx
<SheetPanel style={{ width: 320 }}>
  <SectionHeading>Notes</SectionHeading>
  …
</SheetPanel>
```

Always a 1px gray border, white fill, slight rounding (`--radius-md`), zero shadow. Set `padded={false}` when a child (like InventoryGrid) should bleed flush to the border.
