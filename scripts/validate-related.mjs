/**
 * Post-content validation: related[] case ids must exist.
 * Run after content sync via `pnpm build` (astro build loads collections)
 * or standalone after a failed mental check — uses filesystem only.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const casesDir = join(root, 'src/content/cases');

const files = (await readdir(casesDir)).filter((f) => /\.mdx?$/.test(f));
const ids = new Set(files.map((f) => f.replace(/\.mdx?$/, '')));

let errors = 0;

for (const file of files) {
  const raw = await readFile(join(casesDir, file), 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) continue;
  const relatedBlock = fm[1].match(/related:\n((?:  - .+\n?)*)/);
  if (!relatedBlock) continue;
  const refs = [...relatedBlock[1].matchAll(/- (.+)/g)].map((m) => m[1].trim());
  const id = file.replace(/\.mdx?$/, '');
  for (const ref of refs) {
    if (!ids.has(ref)) {
      console.error(`✗ ${id}: related "${ref}" does not exist`);
      errors++;
    }
  }
}

if (errors) {
  console.error(`\n${errors} related-case validation error(s)`);
  process.exit(1);
}
console.log(`✓ related[] ok (${ids.size} cases)`);
