/**
 * Pure Cairn 2e character generation — no DOM dependencies.
 */

export function createRng(seed) {
  if (seed == null) {
    return () => Math.random();
  }
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

export function rollDie(sides, rng) {
  return Math.floor(rng() * sides) + 1;
}

export function rollDice(count, sides, rng) {
  let total = 0;
  for (let i = 0; i < count; i++) total += rollDie(sides, rng);
  return total;
}

function roll3d6(rng) {
  return rollDice(3, 6, rng);
}

function swapDexWil(attrs) {
  const [str, dex, wil] = attrs;
  return wil > dex ? [str, wil, dex] : attrs;
}

function pickName(names, rng) {
  if (!names?.length) return "Unnamed";
  return names[rollDie(names.length, rng) - 1];
}

function rollTraits(traits, rng) {
  const keys = ["physique", "skin", "hair", "face", "speech", "clothing", "virtue", "vice"];
  const out = {};
  for (const key of keys) {
    const table = traits[key] || [];
    const roll = rollDie(10, rng);
    const entry = table.find((e) => e.roll === roll);
    out[key] = entry?.value || `Roll ${roll}`;
  }
  return out;
}

function isPetty(item) {
  return /\(\s*petty\s*\)/i.test(item);
}

function isBulky(item) {
  return /\(\s*bulky\s*\)/i.test(item);
}

function isGoldLine(item) {
  return /^\d+d\d+\s+Gold Pieces?$/i.test(item.trim());
}

function cleanItemLabel(item) {
  return item
    .replace(/\(\s*petty\s*\)/gi, "")
    .replace(/\(\s*bulky\s*\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGold(gear, rng) {
  const line = gear.find(isGoldLine);
  if (!line) return 0;
  const m = line.match(/^(\d+)d(\d+)/i);
  return rollDice(Number(m[1]), Number(m[2]), rng);
}

function extractBoldItems(text) {
  const items = [];
  const re = /\*\*([^*]+)\*\*/g;
  let m;
  while ((m = re.exec(text))) {
    const label = m[1].trim();
    if (!/^\d+\s*gp$/i.test(label) && !/^d\d+$/i.test(label)) {
      items.push(label);
    }
  }
  return items;
}

function isWeapon(item) {
  return /\bd\d+\b/i.test(item) || /\b(sword|hammer|axe|bow|crossbow|dagger|knife|stake|chains)\b/i.test(item);
}

function isArmor(item) {
  return /\+\s*\d+\s*Armor/i.test(item) || /\b(armor|gambeson|helm|mail|shield)\b/i.test(item);
}

function armorValue(item) {
  const m = item.match(/\+\s*(\d+)\s*Armor/i);
  return m ? Number(m[1]) : /\bshield\b/i.test(item) ? 1 : 0;
}

function hpBonusFromText(text, rng) {
  const m = text.match(/\+\s*d(\d+)\s*HP/i);
  return m ? rollDice(1, Number(m[1]), rng) : 0;
}

function shortTableLabel(title) {
  const t = title.replace(/\s*roll\s+1d6:?\s*/i, "").replace(/\?.*$/, "").trim();
  const skip = new Set([
    "what", "how", "why", "who", "where", "when", "which", "your", "you", "the",
    "a", "an", "is", "are", "do", "does", "did", "of", "to", "in", "on", "for",
  ]);
  const words = t.split(/\s+/).filter((w) => !skip.has(w.toLowerCase()));
  if (!words.length) return title.slice(0, 24);
  const last = words[words.length - 1];
  return last.charAt(0).toUpperCase() + last.slice(1);
}

export function rollCharacter(data, rng = Math.random) {
  const bgIndex = rollDie(20, rng) - 1;
  const background = data.backgrounds[bgIndex];
  const attrs = swapDexWil([roll3d6(rng), roll3d6(rng), roll3d6(rng)]);
  let hp = rollDie(6, rng);

  const tableResults = (background.tables || []).map((table) => {
    const roll = rollDie(6, rng);
    const entry = table.entries.find((e) => e.roll === roll) || table.entries[0];
    return {
      title: table.title,
      shortLabel: shortTableLabel(table.title),
      roll,
      text: entry?.text || "",
    };
  });

  for (const tr of tableResults) {
    hp += hpBonusFromText(tr.text, rng);
  }

  const bondRoll = rollDie(20, rng);
  const bond = data.bonds.find((b) => b.roll === bondRoll) || data.bonds[0];

  const traits = rollTraits(data.traits, rng);
  const age = rollDice(2, 20, rng) + 10;
  const gold = parseGold(background.startingGear || [], rng);

  const inventory = mapInventory(background, tableResults, rng);

  return {
    name: pickName(background.names, rng),
    background,
    attrs: { str: attrs[0], dex: attrs[1], wil: attrs[2] },
    hp,
    armor: inventory.armor,
    gold: gold || inventory.extraGold || 0,
    bond: bond ? { roll: bondRoll, text: bond.text } : null,
    traits,
    age,
    tableResults,
    inventory,
    notesOverflow: "",
  };
}

export function rollStatsOnly(rng = Math.random) {
  const attrs = swapDexWil([roll3d6(rng), roll3d6(rng), roll3d6(rng)]);
  return {
    attrs: { str: attrs[0], dex: attrs[1], wil: attrs[2] },
    hp: rollDie(6, rng),
  };
}

export function mapInventory(background, tableResults, rng = Math.random) {
  const slots = Array(10).fill("");
  const petty = [];
  let armor = 0;
  let extraGold = 0;

  const candidates = [];

  for (const item of background.startingGear || []) {
    if (isGoldLine(item)) continue;
    if (isPetty(item)) {
      petty.push(cleanItemLabel(item));
      continue;
    }
    candidates.push({ label: cleanItemLabel(item), bulky: isBulky(item), source: "gear" });
  }

  for (const tr of tableResults) {
    const gp = tr.text.match(/take\s+(?:an?\s+)?extra\s+(\d+)\s*gp/i);
    if (gp) extraGold += Number(gp[1]);
    for (const item of extractBoldItems(tr.text)) {
      if (isPetty(item)) {
        petty.push(cleanItemLabel(item));
        continue;
      }
      candidates.push({
        label: cleanItemLabel(item),
        bulky: isBulky(item),
        source: "table",
      });
    }
  }

  const weapons = candidates.filter((c) => isWeapon(c.label));
  const armors = candidates.filter((c) => isArmor(c.label));
  const rest = candidates.filter((c) => !isWeapon(c.label) && !isArmor(c.label));

  for (const a of armors) {
    armor = Math.max(armor, armorValue(a.label));
  }

  let slot = 0;

  function place(label, bulky = false) {
    const need = bulky ? 2 : 1;
    while (slot + need <= 2 && need === 2) slot = 2;
    if (slot + need > 10) return false;
    slots[slot] = label;
    if (bulky && slot + 1 < 10) slots[slot + 1] = "";
    slot += need;
    return true;
  }

  for (const w of weapons) {
    if (!place(w.label, w.bulky)) petty.push(w.label);
  }

  for (const a of armors) {
    if (!place(a.label, a.bulky)) petty.push(a.label);
  }

  for (const item of rest) {
    if (!place(item.label, item.bulky)) petty.push(item.label);
  }

  return {
    slots,
    petty,
    armor,
    extraGold,
    hands: slots.slice(0, 2),
    body: slots.slice(2, 4),
    backpack: slots.slice(4, 10),
  };
}

export function formatNotes(character) {
  const { background, traits, age, tableResults, bond, inventory } = character;
  const traitLine = [
    `Age ${age}.`,
    [
      traits.physique,
      traits.skin,
      traits.hair,
      traits.face,
      traits.speech,
      traits.clothing,
    ].join(", "),
    `${traits.virtue} but ${traits.vice}.`,
  ].join(" ");

  const left = [
    `<p class="note-block"><strong>Background:</strong><br>${background.name} — ${background.flavor}</p>`,
    `<p class="note-block"><strong>Traits:</strong><br>${traitLine}</p>`,
  ];

  const right = tableResults.map(
    (tr) =>
      `<p class="note-block"><strong>${tr.shortLabel} (${tr.roll}):</strong><br>${tr.text}</p>`
  );

  if (bond?.text) {
    right.push(`<p class="note-block"><strong>Bond:</strong><br>${bond.text}</p>`);
  }

  if (inventory.petty?.length) {
    right.push(
      `<p class="note-block"><strong>Petty:</strong><br>${inventory.petty.join(", ")}.</p>`
    );
  }

  return { left: left.join(""), right: right.join("") };
}

const BOND_OVERFLOW_LEN = 220;

export function applyDisplayMode(character, mode) {
  if (mode === "blank") {
    return {
      name: "",
      namePlaceholder: true,
      slots: Array(10).fill(""),
      notesLeft: "",
      notesRight: "",
      stats: {
        armor: {},
        hp: {},
        str: {},
        dex: {},
        wil: {},
        coin: {},
      },
      notesOverflow: "",
    };
  }

  if (mode === "pencil") {
    const stats = character?.attrs
      ? { attrs: character.attrs, hp: character.hp }
      : rollStatsOnly();
    return {
      name: "",
      namePlaceholder: true,
      slots: Array(10).fill(""),
      notesLeft: "",
      notesRight: "",
      stats: {
        armor: {},
        hp: { max: String(stats.hp) },
        str: { max: String(stats.attrs.str) },
        dex: { max: String(stats.attrs.dex) },
        wil: { max: String(stats.attrs.wil) },
        coin: {},
      },
      notesOverflow: "",
    };
  }

  const notes = formatNotes(character);
  let notesRight = notes.right;
  let notesOverflow = character.notesOverflow || "";
  const bond = character.bond;

  if (bond?.text && bond.text.length > BOND_OVERFLOW_LEN) {
    notesOverflow = `<p class="note-block"><strong>Bond:</strong><br>${bond.text}</p>`;
    notesRight = notesRight.replace(
      `<p class="note-block"><strong>Bond:</strong><br>${bond.text}</p>`,
      `<p class="note-block"><strong>Bond:</strong><br>${bond.text.slice(0, BOND_OVERFLOW_LEN)}… (continued on notes page)</p>`
    );
  }

  const { attrs, hp, armor, gold, inventory } = character;

  return {
    name: character.name,
    namePlaceholder: false,
    slots: inventory.slots,
    notesLeft: notes.left,
    notesRight,
    stats: {
      armor: armor ? { value: String(armor) } : {},
      hp: { value: String(hp), max: String(hp) },
      str: { value: String(attrs.str), max: String(attrs.str) },
      dex: { value: String(attrs.dex), max: String(attrs.dex) },
      wil: { value: String(attrs.wil), max: String(attrs.wil) },
      coin: gold ? { value: String(gold) } : {},
    },
    notesOverflow,
  };
}
