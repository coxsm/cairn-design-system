# Cairn 2e Character Generator — Reference

Source of truth: [cairnrpg.com/second-edition](https://cairnrpg.com/second-edition/) (text licensed CC-BY-SA 4.0 by the Cairn team). This doc captures the verified mechanical procedure and an index of backgrounds; it deliberately does **not** reproduce each background's flavor text, quirk tables, or the Bonds/Omens tables verbatim — those are the game's creative writing, not mechanical data, so fetch them live from the links below rather than trusting a cached copy here.

## Procedure

1. **Roll or choose a Background** — d20 on the table below (or let the user pick). Note its name.
2. **Fetch that background's page** (URL pattern: `https://cairnrpg.com/second-edition/backgrounds/<slug>/`, slugs below) for: a one-line flavor blurb, ~10 suggested first names, a fixed **Starting Gear** list (always includes some dice of gold), and one or two **d6 tables** that each hand out a quirky bonus item or ability tied to a short backstory beat. Roll on those tables and record the results. Never invent a background's gear or tables from memory — always pull the real page.
3. **Attributes** — roll 3d6 for STR, then DEX, then WIL, in order. You may swap any two of the three results.
4. **Hit Protection (HP)** — roll 1d6.
5. **Traits** (flavor, optional but fast) — pick or improvise one descriptor each for Physique, Skin, Hair, Face, Speech, Clothing, Virtue, and Vice (official d10 tables live on the [Character Creation](https://cairnrpg.com/second-edition/players-guide/character-creation/) page if you want to roll them instead of improvising).
6. **Bond** — d20 on the Bonds table (Character Creation page) for a starting relationship/possession hook. Fetch live; don't fabricate an official-sounding entry.
7. **Age** — 2d20+10. The youngest character at the table rolls once on the Omens table (also on the Character Creation page) as a piece of shared setting flavor for the Warden.
8. **Inventory** — 10 slots total: Hands (2), Body (2), Backpack (6). *Petty* items (e.g. small trinkets, <100gp in coin) don't take a slot; *Bulky* items take 2.

## Backgrounds (d20)

| d20 | Background | Slug |
|---|---|---|
| 1 | Aurifex | `aurifex` |
| 2 | Barber-Surgeon | `barber-surgeon` |
| 3 | Beast Handler | `beast-handler` |
| 4 | Bonekeeper | `bonekeeper` |
| 5 | Cutpurse | `cutpurse` |
| 6 | Fieldwarden | `fieldwarden` |
| 7 | Fletchwind | `fletchwind` |
| 8 | Foundling | `foundling` |
| 9 | Fungal Forager | `fungal-forager` |
| 10 | Greenwise | `greenwise` |
| 11 | Half-Witch | `half-witch` |
| 12 | Hexenbane | `hexenbane` |
| 13 | Jongleur | `jongleur` |
| 14 | Kettlewright | `kettlewright` |
| 15 | Marchguard | `marchguard` |
| 16 | Mountebank | `mountebank` |
| 17 | Outrider | `outrider` |
| 18 | Prowler | `prowler` |
| 19 | Rill Runner | `rill-runner` |
| 20 | Scrivener | `scrivener` |

Full URL = `https://cairnrpg.com/second-edition/backgrounds/` + slug + `/`.

## Confirmed structure (Aurifex, fetched and verified)

Every background page follows this shape — use it to know what to expect when you fetch any of the other 19:

- A one-sentence evocative flavor line (an alchemist-tinkerer archetype, in Aurifex's case).
- ~10 suggested first names to offer the player.
- A **Starting Gear** list, e.g. Aurifex's is: 3d6 Gold Pieces, Rations (3 uses), Lantern, Oil Can (6 uses), Needle-knife (d6), Protective Gloves (*petty*).
- One or two **d6 tables** ("What went horribly wrong?", "What's your latest invention?" for Aurifex) that each award a unique item, ability, or complication with a short narrative beat — roll on the live page, don't guess the entries.

## Random character site

The repo ships a static GitHub Pages site (`site/` → built to `docs/`):

- **Live:** [https://coxsm.github.io/cairn-design-system/](https://coxsm.github.io/cairn-design-system/)
- **Refresh** rolls a new character in **Filled** and **Max stats** modes; **Blank** stays empty.
- **Floating panel** (screen only): Filled | Blank | Max stats; notes pages 0–2 for overflow Bond/spell notes.
- **Print:** Ctrl+P manually — no auto-print. Floating controls are hidden in print/PDF.
- **Rebuild data:** `node scripts/fetch-character-data.mjs` then `node scripts/build-site.mjs`.

## Print export

Generated characters are **single-page, print-ready PDF exports** — not design-canvas previews.

1. **Always start from** `templates/character-sheet/CharacterPrint.dc.html` (one letter-size front, white background, no chrome). Never duplicate from `CharacterSheet.dc.html` (that file stacks multiple preview pages with gray gutters and section labels).
2. **Save to** `templates/character-sheet/generated/<Name>-<Background>.dc.html`.
3. **Keep the print stylesheet** — link `print.css` (grid layout, white `@page`, no chrome). Do not call `window.print()`; the user prints with Ctrl+P.
4. **After saving**, open via a local static server if paths require it (`npx serve . -p 3456` from repo root).

## Mapping results onto the sheet

Duplicate `templates/character-sheet/CharacterPrint.dc.html` and fill in:

- **Name bar** → chosen/rolled name.
- **Hands** (2 slots) → weapon + shield/offhand from Starting Gear.
- **Body** (2 slots) → armor + a clothing item.
- **Backpack** (6 slots) → remaining gear, background-table results, and any Fatigue (writes "Fatigue" into a slot with its tickbox filled).
- **Right rail**: STR / DEX / WIL as `split` StatBadges with `value` = current, `max` = the rolled score (start current = max); HP the same, current = max = rolled 1d6, `accent="crimson"`; Armor = a plain (non-split) value from worn armor; Coin = plain value in gp (convert sp/cp if needed, or add a line to Notes).
- **Notes** → spellbooks, potions, background quirk-table results, Bond, and petty items that don't take slots. Format each section as its own block with a **bold label** and a line break before the body text — use `<p class="note-block"><strong>Label:</strong><br>…</p>` inside each Notes column. Typical left column: Background, Traits. Typical right column: Trade, Escape (or other d6 table results), Bond, Petty. Never run sections together in one paragraph.

The template already ships two worked examples on its canvas — "Filled Character" (every field populated, current = max) and "Pencil (Predetermined Max)" (only the four ability/HP maxes printed, everything else left blank for a physical pencil) — use whichever matches how the sheet will actually be used.

The "Filled Character" example is itself built from this procedure: its background is **Aurifex** (fetched live from cairnrpg.com, not invented), its Notes cite the real background flavor line and starting-kit rationale, and its inventory includes an item earned from that background's own d6 table (rolled result: a workshop accident that cost the character their sense of smell but left them able to sniff out gold — hence the "Tin of Snuff" slot). Use it as a model for how a real generated character's Notes should read: short, specific, tied to an actual rolled result — never generic flavor text.
