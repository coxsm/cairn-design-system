Labeled fill-in blank — small-caps caption over a hairline rule. The sheet's generic "write here" field.

```jsx
<FieldLine label="Name" value="Brannagh Vale" />
<FieldLine label="Look" area value="Weathered coat, a burn scar across one knuckle." />
```

Variants: `area` gives a taller multi-line box for prose fields (Look, Background, Bonds); `size="lg"` bumps the value type up for prominent fields. Empty `value` renders in a faint placeholder tone so an unfilled sheet still reads as intentional, not broken.
