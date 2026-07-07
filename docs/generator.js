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
  return /\bbulky\b/i.test(item);
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

function extractGearFromText(text) {
  const fromBold = extractBoldItems(text);
  if (fromBold.length) return fromBold;

  const items = [];
  const re =
    /(?:take|carry|start with|wield|and)\s+(?:an?\s+)?([^(,.]+?)\s*\(([^)]*(?:d\d+|Armor|bulky|petty|uses|slow|slots)[^)]*)\)/gi;
  let m;
  while ((m = re.exec(text))) {
    const label = m[1].trim();
    const tags = m[2].trim();
    if (label) items.push(`${label} (${tags})`);
  }
  return items;
}

function isWeapon(item) {
  return (
    /\bshield\b/i.test(item) ||
    /\bd\d+\b/i.test(item) ||
    /\b(sword|hammer|axe|bow|crossbow|dagger|knife|stake|spear|mace|flail|saw|pike|staff|club|blade|cutlass|rapier)\b/i.test(item)
  );
}

function isArmor(item) {
  return (
    /\+\s*\d+\s*Armor/i.test(item) ||
    /\b(armor|gambeson|helm|mail|cuirass|breastplate|brigandine)\b/i.test(item)
  );
}

function isClothing(item) {
  return /\b(gloves|cloak|coat|boots|hat|mask|robes|tunic|vest|leathers|sandals|shoes|hood|cape|wraps|bandages|gown)\b/i.test(
    item
  );
}

function isAmulet(item) {
  return /\b(amulet|locket|necklace|ring|signet|medallion|charm|talisman|brooch|pendant)\b/i.test(
    item
  );
}

function isBodyWear(item) {
  return isArmor(item) || isClothing(item) || isAmulet(item);
}

function armorValue(item) {
  const m = item.match(/\+\s*(\d+)\s*Armor/i);
  if (m) return Number(m[1]);
  if (/\b(helm|mail|gambeson|cuirass|breastplate|brigandine)\b/i.test(item)) return 1;
  return 0;
}

function placeInRegion(slots, start, end, items) {
  const overflow = [];
  for (const item of items) {
    const need = item.bulky ? 2 : 1;
    let placed = false;
    for (let pos = start; pos < end && !placed; pos++) {
      if (slots[pos] !== "") continue;
      if (need === 2) {
        if (pos + 1 >= end || slots[pos + 1] !== "") continue;
        slots[pos] = item.label;
        slots[pos + 1] = null;
        placed = true;
      } else {
        slots[pos] = item.label;
        placed = true;
      }
    }
    if (!placed) overflow.push(item);
  }
  return overflow;
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
    for (const item of extractGearFromText(tr.text)) {
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

  const weapons = [];
  const bodyWear = [];
  const general = [];

  for (const c of candidates) {
    if (isWeapon(c.label)) weapons.push(c);
    else if (isBodyWear(c.label)) bodyWear.push(c);
    else general.push(c);
  }

  weapons.sort((a, b) => {
    if (a.bulky !== b.bulky) return Number(b.bulky) - Number(a.bulky);
    if (a.source !== b.source) return a.source === "table" ? -1 : 1;
    return 0;
  });

  for (const item of bodyWear) {
    armor = Math.max(armor, armorValue(item.label));
  }

  let overflow = placeInRegion(slots, 0, 2, weapons);
  const weaponOverflow = overflow;
  overflow = placeInRegion(slots, 2, 4, bodyWear);
  overflow = placeInRegion(slots, 4, 10, general.concat(weaponOverflow, overflow));

  for (const item of overflow) {
    petty.push(item.label);
  }

  const normalized = slots.map((s) => (s == null ? "" : s));

  return {
    slots: normalized,
    petty,
    armor,
    extraGold,
    hands: normalized.slice(0, 2),
    body: normalized.slice(2, 4),
    backpack: normalized.slice(4, 10),
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
