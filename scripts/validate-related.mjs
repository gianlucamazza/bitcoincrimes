/**
 * Enforce related[] shape: only { id, note } entries, ids must exist.
 * No legacy string-list format.
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
  const caseId = file.replace(/\.mdx?$/, '');
  const body = fm[1];

  if (!/^related:\s*$/m.test(body) && !/^related:\s*\[\]\s*$/m.test(body)) {
    // related optional when omitted (schema default [])
    if (!body.includes('related:')) continue;
  }

  const relatedSection = body.match(
    /^related:\n((?:[ \t]+(?:-|\w).*\n?)*)/m,
  );
  if (!relatedSection) {
    if (/^related:\s*\[\]\s*$/m.test(body)) continue;
    if (/^related:\s*$/m.test(body)) continue;
    continue;
  }

  const block = relatedSection[1];

  // Reject legacy bare-string items: "  - some-slug" without "id:"
  const legacyItems = [
    ...block.matchAll(/^[ \t]+-\s+([a-z0-9][a-z0-9-]*)\s*$/gim),
  ];
  for (const m of legacyItems) {
    console.error(
      `✗ ${caseId}: legacy related item "${m[1]}" — use "{ id, note }" only`,
    );
    errors++;
  }

  const idRefs = [...block.matchAll(/^[ \t]+-\s+id:\s*(\S+)\s*$/gm)].map(
    (m) => m[1],
  );
  const notes = [...block.matchAll(/^[ \t]+note:\s*(.+)\s*$/gm)];

  if (idRefs.length === 0 && block.trim().length > 0 && legacyItems.length === 0) {
    console.error(`✗ ${caseId}: related block has no id entries`);
    errors++;
  }

  if (idRefs.length > 0 && notes.length !== idRefs.length) {
    console.error(
      `✗ ${caseId}: related entries must each have note (ids=${idRefs.length}, notes=${notes.length})`,
    );
    errors++;
  }

  for (const ref of idRefs) {
    if (!ids.has(ref)) {
      console.error(`✗ ${caseId}: related id "${ref}" does not exist`);
      errors++;
    }
    if (ref === caseId) {
      console.error(`✗ ${caseId}: related must not reference self`);
      errors++;
    }
  }
}

if (errors) {
  console.error(`\n${errors} related validation error(s)`);
  process.exit(1);
}
console.log(`✓ related[] ok (${ids.size} cases, {id,note} only)`);
