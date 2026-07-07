#!/usr/bin/env node
/**
 * Fetches Cairn 2e character data from cairnrpg.com and writes site/data/character-data.json.
 * Run: node scripts/fetch-character-data.mjs
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "site", "data", "character-data.json");
const BASE = "https://cairnrpg.com/second-edition";

const BACKGROUNDS = [
  ["Aurifex", "aurifex"],
  ["Barber-Surgeon", "barber-surgeon"],
  ["Beast Handler", "beast-handler"],
  ["Bonekeeper", "bonekeeper"],
  ["Cutpurse", "cutpurse"],
  ["Fieldwarden", "fieldwarden"],
  ["Fletchwind", "fletchwind"],
  ["Foundling", "foundling"],
  ["Fungal Forager", "fungal-forager"],
  ["Greenwise", "greenwise"],
  ["Half-Witch", "half-witch"],
  ["Hexenbane", "hexenbane"],
  ["Jongleur", "jongleur"],
  ["Kettlewright", "kettlewright"],
  ["Marchguard", "marchguard"],
  ["Mountebank", "mountebank"],
  ["Outrider", "outrider"],
  ["Prowler", "prowler"],
  ["Rill Runner", "rill-runner"],
  ["Scrivener", "scrivener"],
];

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function mainContent(html) {
  return html.match(/<main[^>]*id="main-content"[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
}

function headingBlock(html, heading, level = "h2") {
  const re = new RegExp(`<${level}[^>]*>([\\s\\S]*?)<\\/${level}>`, "gi");
  let m;
  const needle = new RegExp(`\\b${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  while ((m = re.exec(html))) {
    const title = stripTags(m[1]);
    if (needle.test(title)) {
      const start = m.index + m[0].length;
      const rest = html.slice(start);
      const end = rest.search(new RegExp(`<h[23]`, "i"));
      return end === -1 ? rest : rest.slice(0, end);
    }
  }
  return "";
}

function section(html, heading) {
  return headingBlock(html, heading, "h2");
}

function parseListItems(block) {
  const items = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = re.exec(block))) {
    items.push(stripTags(m[1]));
  }
  return items;
}

const ROLL_CELL = /<td[^>]*>\s*(?:<strong>)?(\d+)(?:<\/strong>)?\s*<\/td>/i;

function parseTable(block) {
  const rows = [];
  const re = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = re.exec(block))) {
    const row = m[1];
    const rollMatch = row.match(ROLL_CELL);
    if (!rollMatch) continue;
    const roll = Number(rollMatch[1]);
    if (roll < 1 || roll > 20) continue;
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    if (cells.length < 2) continue;
    const text = stripTags(cells[1][1]);
    if (!text || /^bond$/i.test(text) || /^d20$/i.test(text)) continue;
    rows.push({ roll, text });
  }
  rows.sort((a, b) => a.roll - b.roll);
  return rows;
}

function parseD20Table(html, sectionName) {
  return parseTable(section(html, sectionName));
}

function parseTraitTable(html, traitName) {
  const block = headingBlock(html, traitName, "h3");
  const entries = [];
  const re = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = re.exec(block))) {
    const cells = [...m[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
    for (let i = 0; i + 1 < cells.length; i += 2) {
      const roll = Number(stripTags(cells[i][1]));
      const value = stripTags(cells[i + 1][1]);
      if (roll >= 1 && roll <= 10 && value) {
        entries.push({ roll, value });
      }
    }
  }
  entries.sort((a, b) => a.roll - b.roll);
  return entries;
}

function parseBackgroundHtml(html, name, slug) {
  const h1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const title = h1 ? stripTags(h1[1]) : name;
  const afterH1 = html.split(/<h1[^>]*>[\s\S]*?<\/h1>/i)[1] || "";
  const beforeH2 = afterH1.split(/<h2/i)[0] || "";
  const flavor = stripTags(beforeH2).replace(/\s+/g, " ").trim();

  const namesBlock = section(html, "Names");
  const names = stripTags(namesBlock)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const gearBlock = section(html, "Starting Gear");
  const startingGear = parseListItems(gearBlock);

  const tables = [];
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let hm;
  while ((hm = h2Re.exec(html))) {
    const titleText = stripTags(hm[1]);
    if (/names|starting gear/i.test(titleText)) continue;
    const start = hm.index + hm[0].length;
    const rest = html.slice(start);
    const end = rest.search(/<h2/i);
    const tableBlock = end === -1 ? rest : rest.slice(0, end);
    if (!/<table/i.test(tableBlock)) continue;
    const entries = parseTable(tableBlock).filter((e) => e.roll <= 6);
    if (!entries.length) continue;
    tables.push({
      title: titleText.replace(/\s*roll\s+1d6:?\s*/i, "").trim(),
      entries,
    });
  }

  return { name: title, slug, flavor, names, startingGear, tables };
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.text();
}

async function main() {
  console.log("Fetching character creation page…");
  const creationHtml = mainContent(
    await fetchText(`${BASE}/players-guide/character-creation/`)
  );

  const bonds = parseD20Table(creationHtml, "Bonds");
  const omens = parseD20Table(creationHtml, "Omens");

  const traitNames = [
    "Physique",
    "Skin",
    "Hair",
    "Face",
    "Speech",
    "Clothing",
    "Virtue",
    "Vice",
  ];
  const traits = {};
  for (const t of traitNames) {
    traits[t.toLowerCase()] = parseTraitTable(creationHtml, t);
  }

  console.log(`Parsed ${bonds.length} bonds, ${omens.length} omens`);

  const backgrounds = [];
  for (const [name, slug] of BACKGROUNDS) {
    process.stdout.write(`  ${slug}…`);
    const html = mainContent(
      await fetchText(`${BASE}/backgrounds/${slug}/`)
    );
    const bg = parseBackgroundHtml(html, name, slug);
    backgrounds.push(bg);
    console.log(` ${bg.tables.length} tables, ${bg.startingGear.length} gear`);
  }

  const data = {
    version: 1,
    source: "https://cairnrpg.com/second-edition/",
    license: "CC-BY-SA 4.0",
    backgrounds,
    bonds,
    omens,
    traits,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`Wrote ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
