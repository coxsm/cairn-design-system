---
name: cairn-character-generator
description: Use this skill to quickly generate a complete, ready-to-play Cairn Second Edition character — background, attributes, gear, and traits — and drop the result straight into the Cairn character sheet template.
user-invocable: true
---

Read `backgrounds.md` in this folder for the full procedure: the d20 background table, how to fetch a background's exact starting gear, and how to map every rolled result onto `templates/character-sheet/CharacterSheet.dc.html`.

Quick start:
1. Roll or ask the user to pick a background from the d20 table in `backgrounds.md`.
2. Fetch that background's live page on cairnrpg.com for its exact flavor, name list, starting gear, and unique tables — never invent one from memory.
3. Roll attributes (3d6 × STR/DEX/WIL, swap any two), HP (1d6), and traits per the procedure.
4. Fill the results into a copy of `templates/character-sheet/CharacterSheet.dc.html` (see the field-mapping table in `backgrounds.md`).

This covers Cairn **Second Edition** specifically — a newer, distinct ruleset from the Rules Summary text printed on the sheet's back (which follows first-edition phrasing). Both editions share the same core "roll under on d20" resolution, so a 2e character still drops cleanly onto this sheet.
