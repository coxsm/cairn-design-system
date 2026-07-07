#!/usr/bin/env node
/**
 * Copies site sources and design-system assets into docs/ for GitHub Pages.
 * Run: node scripts/build-site.mjs
 */

import { cpSync, mkdirSync, rmSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SITE = join(ROOT, "site");
const DOCS = join(ROOT, "docs");

function copy(src, dest) {
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

if (existsSync(DOCS)) {
  rmSync(DOCS, { recursive: true, force: true });
}
mkdirSync(DOCS, { recursive: true });

const files = ["index.html", "app.js", "generator.js", "print.css"];
for (const file of files) {
  copy(join(SITE, file), join(DOCS, file));
}

copy(join(SITE, "data", "character-data.json"), join(DOCS, "data", "character-data.json"));
copy(join(ROOT, "_ds_bundle.js"), join(DOCS, "_ds_bundle.js"));
copy(join(ROOT, "styles.css"), join(DOCS, "styles.css"));
copy(join(ROOT, "tokens"), join(DOCS, "tokens"));
copy(join(ROOT, "assets", "fonts"), join(DOCS, "assets", "fonts"));

console.log(`Built ${DOCS}`);
