import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(new URL('../src/lib/entry-media.ts', import.meta.url), 'utf8');
const files = [...src.matchAll(/['"`]\/baza\/([\w.-]+)['"`]|svg\('([\w.-]+)'/g)].map(m => m[1] || m[2]);

test('każdy plik z rejestru istnieje w public/baza', () => {
  assert.ok(files.length >= 10);
  for (const f of files) assert.ok(fs.existsSync(path.join('public/baza', f)), f);
});

test('każde zdjęcie ma autora, licencję i URL źródła, a docs/photo-credits.md je wymienia', () => {
  const docs = fs.readFileSync('docs/photo-credits.md', 'utf8');
  const photos = [...new Set(files.filter(f => f.endsWith('.webp')))];
  assert.equal(photos.length, 4);
  for (const f of photos) assert.ok(docs.includes(f), f);
  assert.equal((src.match(/credit: \{/g) || []).length, 4);
  for (const k of ['author', 'licence', 'sourceUrl']) assert.ok((src.match(new RegExp(`\\b${k}:`, 'g')) || []).length >= 4, k);
});

test('klucze rejestru są 32-znakowymi id Notion bez myślników', () => {
  const keys = [...src.matchAll(/\[P \+ '([0-9a-f]+)'\]/g)].map(m => '406d7bf1c139' + m[1]);
  assert.equal(keys.length, 14);
  for (const k of keys) assert.match(k, /^[0-9a-f]{32}$/);
  assert.equal(new Set(keys).size, 14);
});

test('rysunki własne nie używają czerwieni ani żółci', () => {
  for (const f of fs.readdirSync('public/baza').filter(f => f.endsWith('.svg'))) {
    const t = fs.readFileSync(path.join('public/baza', f), 'utf8').toLowerCase();
    assert.ok(!/#(ef4444|dc2626|b91c1c|ff0000|eab308|facc15|fde047|ffff00)/.test(t), f);
  }
});
