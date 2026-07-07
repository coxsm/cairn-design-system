---
name: cairn-design
description: Use this skill to generate well-branded interfaces and assets for Cairn, the tabletop RPG, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and character-sheet components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick orientation:
- This is a strictly monochrome, print-first system (black ink through gray on a pure white page — no warm tint, zero drop shadow) with **one accent**: vibrant crimson, reserved exclusively for HP. Corners take a slight radius (6–10px), never fully square. See README.md → Visual Foundations before styling anything.
- One typeface throughout: Inknut Antiqua (`assets/fonts/`, `tokens/fonts.css`). Do not introduce a second family.
- The entire icon system is seven hand-inked SVGs in `assets/icons/` (str, dex, wil, hp, armor, coin, deprived) — there is no icon font and no emoji use. Reuse these; never draw new icons in this style from scratch.
- The one product surface is the character sheet itself, at `templates/character-sheet/CharacterSheet.dc.html` — duplicate/adapt it rather than redesigning from zero. It ships a blank template plus filled, pencil, and blank-back examples stacked on one canvas.
- Component source lives in `components/sheet/` (Icon, StatBadge, CurrencyPanel, ConditionMark, InventoryGrid, FieldLine, SectionHeading, SheetPanel) with matching `.d.ts` and `.prompt.md` per component.
- Need a new character fast? Use the `character-generator/` sub-skill — it generates a Cairn Second Edition character from the real cairnrpg.com backgrounds and maps it onto the sheet template.
