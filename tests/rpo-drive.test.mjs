import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/rpo-gmt400.json', import.meta.url), 'utf8'));
const byCode = new Map(data.codes.map(c => [c.c, c]));

test('kody RPO uzupełnione z press kitów GM (B4U, L49, N88, V08) mają opis, lata i źródła', () => {
  for (const code of ['B4U', 'L49', 'N88', 'V08']) {
    const c = byCode.get(code);
    assert.ok(c, code);
    assert.ok(c.p && c.g && c.a.length && c.s.length, code);
    for (const [vehicle, years] of c.a) {
      assert.ok(data.vehicles[vehicle], `${code}: pojazd ${vehicle}`);
      assert.match(years, /^19\d\d(–19\d\d)?(, 19\d\d(–19\d\d)?)*$/, `${code}: lata`);
    }
    for (const s of c.s) assert.ok(data.docs[s]?.url?.startsWith('https://www.gm.com/'), `${code}: dokument ${s}`);
  }
});

test('katalog RPO: brak duplikatów kodów i poprawne indeksy dokumentów', () => {
  assert.equal(byCode.size, data.codes.length);
  for (const c of data.codes) for (const s of c.s) assert.ok(data.docs[s], c.c);
});

test('L49 to silnik wolnossący, nie turbo (L56/L65 mają turbo)', () => {
  assert.match(byCode.get('L49').g, /naturally aspirated/);
  assert.match(byCode.get('L56').g, /turbo/);
});
