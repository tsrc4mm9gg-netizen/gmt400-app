import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isSuperseded, withoutSuperseded } from '../src/lib/superseded.mjs';

test('isSuperseded rozpoznaje znacznik przeglądu', () => {
  assert.equal(isSuperseded({ Opis: 'Do usunięcia – zastąpione przez: Zapłon https://app.notion.com/p/abc' }), true);
  assert.equal(isSuperseded({ Opis: '  Do usunięcia - zastąpione przez: X' }), true);
  assert.equal(isSuperseded({ Opis: 'Opis usterki. Do usunięcia – zastąpione przez X' }), false);
  assert.equal(isSuperseded({ Opis: '' }), false);
  assert.equal(isSuperseded({}), false);
  assert.equal(isSuperseded(null), false);
});

test('withoutSuperseded zachowuje kolejność pozostałych wpisów', () => {
  const items = [{ id: 'a', Opis: 'ok' }, { id: 'b', Opis: 'Do usunięcia – zastąpione przez: Y' }, { id: 'c' }];
  assert.deepEqual(withoutSuperseded(items).map(i => i.id), ['a', 'c']);
  assert.deepEqual(withoutSuperseded(undefined), []);
});

test('/api/notion i listy SSR filtrują oznaczone wpisy tą samą funkcją (wspólna biblioteka) przed liczeniem count', () => {
  const lib = readFileSync(new URL('../src/lib/notion-entries.ts', import.meta.url), 'utf8');
  const route = readFileSync(new URL('../src/app/api/notion/route.ts', import.meta.url), 'utf8');
  assert.match(lib, /import \{ withoutSuperseded \} from '\.\/superseded\.mjs'/);
  assert.match(lib, /withoutSuperseded\(/);
  assert.match(route, /fetchAllEntries\(/);
  assert.match(route, /count: results\.length/);
});
