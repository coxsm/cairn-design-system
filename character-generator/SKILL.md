---
name: cairn-character-generator
description: Use this skill to quickly generate a complete, ready-to-play Cairn Second Edition character — background, attributes, gear, and traits — and drop the result straight into the Cairn character sheet template.
user-invocable: true
---

Read `backgrounds.md` in this folder for the full procedure: the d20 background table, how to fetch a background's exact starting gear, and how to map every rolled result onto the print template.

Quick start:
1. **Random character (default):** open the deployed site at [coxsm.github.io/cairn-design-system](https://coxsm.github.io/cairn-design-system/) — refresh for a new roll in **Filled** or **Max stats** mode. Use the floating panel to switch modes or add blank notes pages (0–2). Print with Ctrl+P (no auto-print).
2. **Custom or edited characters:** use this skill — roll or ask the user to pick a background from the d20 table in `backgrounds.md`.
3. Fetch that background's live page on cairnrpg.com for its exact flavor, name list, starting gear, and unique tables — never invent one from memory (or use baked data in `site/data/character-data.json` when offline).
4. Roll attributes (3d6 × STR/DEX/WIL, swap any two), HP (1d6), and traits per the procedure.
5. Duplicate `templates/character-sheet/CharacterPrint.dc.html` (not the multi-page `CharacterSheet.dc.html`), fill in the character, and save to `templates/character-sheet/generated/<Name>-<Background>.dc.html`. See `backgrounds.md` → Print export.
6. Open the saved file in the browser via a local static server if needed (`npx serve . -p 3456`).

To refresh baked game data after Cairn updates: `node scripts/fetch-character-data.mjs`, then `node scripts/build-site.mjs`.

This covers Cairn **Second Edition** specifically — a newer, distinct ruleset from the Rules Summary text printed on the sheet's back (which follows first-edition phrasing). Both editions share the same core "roll under on d20" resolution, so a 2e character still drops cleanly onto this sheet.
