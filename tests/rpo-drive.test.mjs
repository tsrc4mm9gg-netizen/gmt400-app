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

// ---- „Zawiera”: zawartość pakietów z dokumentów GM (src/data/rpo-contents.json) ----
const contents = JSON.parse(readFileSync(new URL('../src/data/rpo-contents.json', import.meta.url), 'utf8'));
const contentEntries = Object.entries(contents).filter(([key]) => key !== '_');

test('zawartość pakietów: każdy kod istnieje w katalogu, grupy mają zakres, źródła i pozycje', () => {
  assert.ok(contentEntries.length >= 30, 'co najmniej 30 kodów z opisem zawartości');
  for (const [code, entry] of contentEntries) {
    assert.match(code, /^[A-Z0-9]{3}$/, code);
    assert.ok(byCode.has(code), `${code}: brak w katalogu RPO`);
    assert.ok(Array.isArray(entry.g) && entry.g.length > 0, `${code}: brak grup`);
    if ('w' in entry) assert.ok(typeof entry.w === 'string' && entry.w.trim().length >= 10, `${code}: puste wyjaśnienie`);
    const scopes = new Set();
    for (const group of entry.g) {
      assert.ok(typeof group.r === 'string' && /19\d\d/.test(group.r), `${code}: zakres musi zawierać rocznik`);
      assert.ok(!scopes.has(group.r), `${code}: zduplikowany zakres ${group.r}`);
      scopes.add(group.r);
      assert.ok(group.s.length > 0, `${code}/${group.r}: brak źródeł`);
      assert.equal(new Set(group.s).size, group.s.length, `${code}: zduplikowane źródła`);
      for (const s of group.s) assert.ok(data.docs[s]?.url?.startsWith('https://'), `${code}: dokument ${s}`);
      assert.ok(group.z.length > 0, `${code}/${group.r}: brak pozycji`);
      const seen = new Set();
      for (const item of group.z) {
        assert.ok(typeof item === 'string' && item.trim() === item && item.length >= 3, `${code}: pusta pozycja`);
        assert.ok(item.length <= 140, `${code}: pozycja za długa (parafraza, bez cytatów): ${item}`);
        const key = item.toLowerCase();
        assert.ok(!seen.has(key), `${code}/${group.r}: duplikat „${item}”`);
        seen.add(key);
      }
    }
  }
});

test('zawartość pakietów: przykładowe znane fakty (YE9 / Z71 / NZZ)', () => {
  const ye9 = contents.YE9.g.flatMap(g => g.z).join(' | ');
  assert.match(ye9, /zamek|szyb/i, 'YE9 obejmuje zamki/szyby');
  assert.ok(contents.Z71.g.some(g => g.z.some(z => /Bilstein/.test(z))), 'Z71 z amortyzatorami Bilstein (1990)');
  assert.ok(contents.NZZ.g.length >= 1);
});
