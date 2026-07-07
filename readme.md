# Cairn Design System

A monochrome, print-first design system for **Cairn**, the tabletop role-playing game — built from a single source artifact: a two-sided character-sheet printout and its seven hand-inked icon illustrations.

## Sources

- `uploads/Cairn printout FRONT.pdf` — the character-facing side (name, look, background, ability scores, HP/Armor, coin, inventory). Mostly vector line art + 6 embedded raster icon illustrations; almost no live text layer (12 short glyph runs total).
- `uploads/Cairn printout BACK.pdf` — the Rules Summary side. Fully text-extractable; its copy is reproduced verbatim on the template's back page. A working copy of the extracted text lives at `content/back-rules-source.txt`.
- `uploads/STR.svg`, `DEX.svg`, `WIL.svg`, `HP.svg`, `Armor.svg`, `Coin.svg`, `Deprived.svg` — the seven source icon illustrations, confirmed pixel-for-pixel matches of the artwork embedded in the FRONT PDF. Copied into `assets/icons/`.
- `uploads/Screenshot 2026-07-05 132425.png` / `…132432.png` — user-supplied captures of the printout's front and back, added after the first build round. **These are the authoritative layout reference**: portrait sheet; front = left column (Name bar with Deprived tickbox, Hands/Body/Backpack inventory rows with a fatigue tickbox per slot, then Notes filling the majority) plus a right rail (Armor, HP, STR, DEX, WIL, Coin, each an icon over a thin-ruled box — HP/STR/DEX/WIL with a current/max slash); back = all rules in the left of two ruled columns, with the "Damage → Armor → HP → STR" gray strip mid-column between COMBAT and ACTIONS, the right column left blank.
- No Figma file, codebase, or component library was provided — the printout itself is the entire design source. Component boundaries in this system (see **Components**, below) were derived directly from the sheet's own sections, not from an app/UI convention.
- Background on the game system (audience, tone, rules) was confirmed via public sources for Cairn (by Yochai Gal, released under CC0 — see `yochaigal.itch.io/cairn` and the community SRD at `keeper.farirpgs.com`), used only to sanity-check terminology already present in the uploaded PDFs.

**Note on fidelity:** the FRONT PDF page could not be rasterized in-tool (no text layer, no form fields, canvas rendering timed out), so the first draft reconstructed it from the icons + rules. The user then supplied screenshots of both sides (see Sources), and the template now follows those directly: portrait format, neutral grays, thin rules, fatigue tickboxes, right-rail stat boxes with current/max slashes. Everything on the **back** (Rules Summary) is verbatim from the PDF text layer.

## What Cairn is

Cairn is an adventure game for one facilitator (the Warden) and at least one other player: hardened adventurers exploring a dark, mysterious Wood full of strange folk, hidden treasure, and worse. It's rules-light by design — three abilities, a handful of save-based mechanics, no classes or XP — leaning on the Warden's judgment over rulebook lookups. Character creation is fast and largely random (3d6 down the line for STR/DEX/WIL, 1d6 for starting HP), which is exactly what the character sheet exists to capture in a single sitting.

## Product surface

There is exactly one product surface here: **the character sheet**. It isn't a software UI, so this system skips `ui_kits/` entirely and instead ships the sheet as a **template** — `templates/character-sheet/CharacterSheet.dc.html` — per this project's own convention for reusable, fillable starting documents. Duplicate it per character; the front is meant to be edited (name, look, stats, inventory…), the back should stay as-is.

The template's canvas stacks five pages so every variant is visible at once: the blank fillable front, the verbatim Rules Summary back, a fully-filled worked example, a "pencil" example (ability/HP maxes pre-printed, everything else left blank for a physical pencil), and a blank alternate back (no rules) for players who'd rather have more writing room. Delete whichever pages a given printout doesn't need.

A companion skill, `character-generator/`, generates a full Cairn **Second Edition** character (background, attributes, gear, traits) from the real cairnrpg.com background tables and maps the result onto this same template — see its `SKILL.md`.

---

## Content fundamentals

The source material is almost entirely **mechanical, not marketing** copy — a rules reference, not brand prose. A few things hold true everywhere in it:

- **Second person, terse, imperative-adjacent.** "Roll a d20 equal to or under an ability." "Drinking a potion is a free action." No "you might consider…" hedging; rules are stated flatly as fact.
- **PCs/characters are referred to in third person ("a character", "PCs", "their")**, not "you" — the rules describe what happens at the table, not what the reader personally does. Contrast this with the second-person voice typical of app onboarding copy; this is closer to a boardgame rulebook.
- **Compression over completeness.** Sentences carry two or three clauses each ("Actions may include casting a spell, attacking, making a second move, or other reasonable activities.") — the sheet is a *reminder*, not a tutorial. Nothing is explained twice.
- **No emoji, no exclamation points, no color commentary.** The only stylistic flourish in the whole source is the arrow shorthand in the footer: "Damage → Armor → HP → STR" — a compressed formula standing in for a full sentence. That economy is the voice.
- **Numbers and abbreviations are load-bearing.** STR/DEX/WIL/HP/GP/SP/CP are never spelled out in body copy after first mention; the sheet assumes fluency with its own shorthand.
- **Field labels on the front are one or two words, always capitalized, never punctuated**: "Name", "Look", "Background", "Bonds". Placeholder/hint copy in this template follows the same economy (e.g. "Where they're from, what they did before" — a fragment, not a sentence with a period).

When writing *for* this system (new rules text, UI copy for a digital tool, etc.), match this: short declarative sentences, third person for game mechanics, zero embellishment, and never explain a term the sheet itself doesn't explain.

---

## Visual foundations

**Palette.** Neutral monochrome — black ink through gray on a pure white page; **no warm paper tint** (the printout is plain white). One accent exists in the entire system: **vibrant crimson (`--crimson-500` #dc143c), reserved exclusively for HP** — it paints the HP current value and slash, nothing else, ever. See `tokens/colors.css`: an ink ramp (`--ink-900` #0c0c0c, matching the fill baked into the icon art, down to `--ink-150`), a neutral surface ramp (`--paper-000` #ffffff → `--paper-200`; `--paper-100` is the gray fill of the Name bar and the Damage→Armor strip), and the crimson accent (`--accent-hp`).

**Type.** One family, every weight: **Inknut Antiqua** (see the naming note below), from 400 body copy up through 900 for display. No italics anywhere (the family doesn't have any, and nothing in the source uses slanted type). Section headers (SAVES, COMBAT, INVENTORY…) are **bare bold caps** — no underline, no rule beneath, only light tracking (0.03em). Field labels (Name, Hands, Body, Backpack, Notes, Deprived) are small (12px) semibold, set in muted gray — except "Deprived", which is black.

**Spacing.** A plain 4px-based scale (`--space-1` = 4px → `--space-9` = 96px). Nothing exotic — this is a print-document layout, so spacing reads as margins and rule-gaps, not the tight, animated spacing of an app UI.

**Backgrounds & imagery.** Flat paper color only — no gradients, no photography, no full-bleed imagery, no repeating pattern/texture. The "grit" in this brand comes entirely from the ink linework in the seven icon illustrations (dense woodcut/scratchboard hatching), not from a paper-grain overlay or filter. Adding a grain texture was considered and rejected: the actual PDF background is clean, flat white — the icons alone carry the hand-made feel.

**Animation.** None. This is a static, printable document; there is nothing in the source to suggest motion design, and a character sheet template shouldn't invent any. If this system is ever extended into a digital character-tracker app, prefer instant state changes (checkbox fills, number updates) over eased transitions — nothing about this brand's voice suggests softness.

**Hover / press states.** Not applicable to the source (paper has no interaction states). If you build an interactive tool on top of this system, the nearest-neighbor convention already in the system is the tickbox fill used by `ConditionMark` and the fatigue boxes: an unfilled thin outline vs. a solid dark fill — i.e., presence/absence of ink, not color shift, shadow, or scale change.

**Borders & shadows.** Every box on the sheet — name bar, inventory rows, right-rail stat boxes, notes panel, the full-page rules frame — is a **thin 1px gray rule** (`--border-default`, #a3a3a3) on white. Hairline gray dividers split slots and columns. **Zero drop shadows or blur anywhere** — containment is drawn with a fine pen, not simulated with light. The printout finishes its frames with tiny hand-drawn details, echoed in this system as a fixed rule: **edge nicks always indent inward, toward the card**. Inventory rows carry two nicks on their left edge, both pointing right (into the card); stat boxes carry two nicks on their top edge, both pointing down (into the card); large panels (Notes, the rules frame) use diamond notches at the top/bottom center of their frame instead.

**Corner radius.** Slight, not zero: `--radius-sm` (6px) on rows, bars and stat boxes; `--radius-md` (10px) on the notes panel and the full-page rules frame. Anything rounder would read as software chrome.

**Transparency & blur.** Unused. Icons are opaque black linework on transparent SVG canvas (so they drop cleanly onto the paper color) — that's the only transparency in the system, and it's structural, not a stylistic blur/glass effect.

**Imagery color vibe.** Pure black and white, no grayscale gradients, no photography. The seven icons are dense pen-and-ink illustration — closer to scratchboard/woodcut printmaking than flat vector iconography — and are the system's only imagery.

**Cards/panels.** A "card" in this system is just a `SheetPanel`: 1px gray border, white fill, slight rounding (`--radius-md`), generous internal padding, no shadow. See `guidelines/borders-panels.card.html`.

### On the "Inkput Antiqua" naming note

The brief names the display/body font **"Inkput Antiqua."** No font file by that exact name exists — the closest real match, by a wide margin, is **Inknut Antiqua** by Claus Eggers Sørensen (2014, SIL Open Font License, distributed free on Google Fonts). Given the near-identical spelling and that it's a perfect stylistic fit (a woodcut-flavored literary Antiqua with heavy ink-trap strokes), this system treats it as the intended family rather than flagging a substitution. Five static weights (400/500/600/700/900) were downloaded from Google Fonts and self-hosted in `assets/fonts/`, declared in `tokens/fonts.css`. **Please confirm this is the font you meant** — if "Inkput Antiqua" refers to a different, non-public font, send the actual files and I'll swap the `@font-face` sources.

---

## Iconography

The entire icon system is **seven hand-inked illustrations**, supplied as source SVGs and copied verbatim into `assets/icons/` (`str.svg`, `dex.svg`, `wil.svg`, `hp.svg`, `armor.svg`, `coin.svg`, `deprived.svg`). There is no icon font, no Unicode/emoji usage, and no secondary icon set anywhere in the source — these seven pieces of art *are* the iconography:

- **str** — a clenched fist, lettered "STR"
- **dex** — an upward arrow, lettered "DEX"
- **wil** — a radiating starburst, lettered "WIL"
- **hp** — an anatomical, dripping heart, lettered "HP"
- **armor** — a chained shield, lettered "ARMOR"
- **coin** — a laurel-wreathed profile bust (on the sheet's front it crowns a plain fill-in box; the GP/SP/CP tally hand-lettered into the original coin illustration lives on as the `CurrencyPanel` component's live fields)
- **deprived** — a kneeling, hooded figure leaning on a planted sword under a radiating moon — the game's "Deprived" condition (lacking food, water, or rest). The sheet itself marks Deprived with just the word + tickbox at the right end of the Name bar; the illustration is available for contexts with more room.

Five of these (str/dex/wil/hp/armor) already hand-letter their own name into the illustration — that's why `StatBadge` doesn't render a separate text label by default. Icons are inlined as raw SVG (via the `Icon` component, `dangerouslySetInnerHTML`) rather than loaded as `<img>`, so the compiled design-system bundle is self-contained; the original files in `assets/icons/` remain available for plain `<img>` use, hand-off to developers, or print contexts outside React.

No logo or wordmark file was supplied. Wherever a brand mark would normally go, this system sets "CAIRN" in Inknut Antiqua Black rather than inventing a symbol — see `guidelines/brand-name-lockup.card.html`.

---

## Components

No component library, codebase, or Figma file was provided — only the printout. So instead of authoring a generic software UI kit (Button, Input, Tabs…), the component inventory below was derived directly from the sheet's own sections; each one is a distinct visual pattern the printout actually uses. All live in `components/sheet/` and render via CSS custom properties from `styles.css`.

- **Icon** — renders one of the seven inline SVG icons by name. *(Intentional addition — the source has no icon-wrapper convention of its own; this is the thin glue needed to reuse raw SVG art as a prop-driven component.)*
- **StatBadge** — the right-rail stat block: an icon breaching the top border of a thin-ruled box. Covers Armor and Coin (plain box) and HP/STR/DEX/WIL (`split` — a "current / max" slash, max in subtle gray). `accent="crimson"` is reserved for HP.
- **CurrencyPanel** — coin icon plus GP / SP / CP tally rows (the tally hand-lettered into the original coin art, as live fields).
- **ConditionMark** — "Deprived" label + tickbox as it sits in the Name bar; `showIcon` adds the kneeling-figure illustration where there's room.
- **InventoryGrid** — the Hands / Body / Backpack row-boxes (10 slots), each slot with a fatigue tickbox in its upper-right corner.
- **FieldLine** — labeled fill-in blank (small-caps caption over a hairline rule) — the sheet's generic "write here" pattern, for use when composing new screens; the template itself hand-codes this pattern inline so its fields stay directly click-editable.
- **SectionHeading** — bare bold uppercase heading (no underline) — titles every Rules Summary block.
- **SheetPanel** — the one container primitive: 1px gray border, slight rounding, no shadow.

Every directory's `@dsCard` card is dense on purpose — see `components/sheet/sheet.card.html` for all eight in their key states.

---

## Index

```
styles.css                     → imports only; the design system's single CSS entry point
tokens/
  colors.css                   → neutral ink + surface ramps, crimson HP accent, semantic aliases
  typography.css                → Inknut Antiqua scale, weights, tracking
  spacing.css                   → 4px-based spacing scale + stroke weights (no radius, no shadow)
  fonts.css                     → @font-face for the 5 self-hosted Inknut Antiqua weights
assets/
  icons/                        → the 7 source SVGs (str, dex, wil, hp, armor, coin, deprived)
  fonts/                        → InknutAntiqua-{400,500,600,700,900}.woff2
guidelines/                     → 15 small @dsCard foundation specimens (Colors, Type, Spacing, Brand)
components/sheet/               → Icon, StatBadge, CurrencyPanel, ConditionMark, InventoryGrid,
                                   FieldLine, SectionHeading, SheetPanel (+ .d.ts + .prompt.md each)
                                   sheet.card.html → dense @dsCard specimen of all eight
templates/character-sheet/
  CharacterSheet.dc.html        → the deliverable: blank template + rules back + filled example +
                                   pencil example + blank alternate back, stacked on one canvas
  ds-base.js                    → loads styles.css + the compiled bundle for the template preview
character-generator/
  SKILL.md                      → Claude-Code-compatible sub-skill: fast Cairn 2e character generation
  backgrounds.md                → verified 2e procedure, d20 background table, sheet field-mapping
content/back-rules-source.txt   → verbatim BACK-page text extraction, kept for reference
uploads/                        → original source PDFs + icon SVGs, as provided
SKILL.md                        → Claude-Code-compatible skill wrapper for this system
```
