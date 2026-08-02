/**
 * Fail the build if dist contains broken base joins
 * (e.g. /bitcoincrimescases or bitcoincrimesbitcoincrimes).
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const bad = [
  /bitcoincrimescases/,
  /bitcoincrimestimeline/,
  /bitcoincrimessearch/,
  /bitcoincrimesmethodology/,
  /bitcoincrimesabout/,
  /bitcoincrimesglossary/,
  /bitcoincrimesrss/,
  /bitcoincrimesfavicon/,
  /bitcoincrimesog\./,
  /bitcoincrimesbitcoincrimes/,
  /bitcoincrimespagefind/,
];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html') || e.name.endsWith('.xml')) yield p;
  }
}

let errors = 0;
let files = 0;

for await (const file of walk(dist)) {
  files++;
  const text = await readFile(file, 'utf8');
  for (const re of bad) {
    if (re.test(text)) {
      console.error(`✗ ${file.replace(root + '/', '')}: matches ${re}`);
      errors++;
    }
  }
}

// Spot-check expected good pattern in home
const home = await readFile(join(dist, 'index.html'), 'utf8');
if (!home.includes('href="/bitcoincrimes/cases')) {
  console.error('✗ dist/index.html missing href="/bitcoincrimes/cases"');
  errors++;
}
if (!home.includes('https://gianlucamazza.github.io/bitcoincrimes/')) {
  console.error('✗ dist/index.html missing correct absolute base URL');
  errors++;
}
if (home.includes('bitcoincrimesbitcoincrimes')) {
  console.error('✗ dist/index.html still has doubled base');
  errors++;
}

if (errors) {
  console.error(`\n${errors} base-href error(s) in ${files} file(s)`);
  process.exit(1);
}
console.log(`✓ base hrefs ok (${files} html/xml files checked)`);
