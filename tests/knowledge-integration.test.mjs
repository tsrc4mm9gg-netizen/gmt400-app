import test from 'node:test';
import assert from 'node:assert/strict';
import { buildKnowledgeIndex, searchKnowledge, getObdEntries, getKnowledgeEntries } from '../src/lib/knowledge-index.mjs';
import { matchesYearRules } from '../src/lib/year-range.mjs';

const notion = [
  { id: 'notion-1', Nazwa: 'Wyciek płynu ATF 4L60E', Typ: 'Usterka', Model: 'C/K', Lata: '1996-2000', Opis: 'Wyciek płynu skrzyni biegów.', Objawy: 'Plamy pod autem', Rozwiązanie: 'Sprawdź uszczelkę miski.', applicability: { brand: [], model: ['C/K'], years: ['1996-2000'], engine: [], drive: [], transmission: [] } },
  { id: 'notion-2', Nazwa: 'Poradnik wymiany filtra paliwa', Typ: 'Porada', Model: 'Wszystkie', Lata: 'Wszystkie', Opis: 'Wymiana filtra paliwa.', applicability: { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] } }
];

test('Index contains OBD and Notion entries without duplicates', () => {
  const index = buildKnowledgeIndex(getKnowledgeEntries(notion));
  assert.equal(index.length, 20);
  assert.equal(new Set(index.map(item => item.id)).size, index.length);
  assert.ok(index.some(item => item.id === '/kody-obd/p0300'));
  assert.ok(index.some(item => item.id === 'notion-1'));
});

test('Modal and page use the same search function and ranking', () => {
  const index = buildKnowledgeIndex(getKnowledgeEntries(notion));
  const first = searchKnowledge(index, 'p0300')[0];
  const second = searchKnowledge(index, 'p0300')[0];
  assert.equal(first.id, '/kody-obd/p0300');
  assert.equal(second.id, first.id);
  assert.equal(searchKnowledge(index, '4l60e')[0].id, 'notion-1');
  assert.equal(searchKnowledge(index, 'p').length, 0);
});

test('Shared year parser filters inclusive ranges', () => {
  assert.equal(matchesYearRules('1998', ['1996-2000']), true);
  assert.equal(matchesYearRules('1995', ['1996-2000']), false);
  assert.equal(matchesYearRules('1998', ['Wszystkie']), true);
});

test('OBD source is shared between homepage and detail cards', () => {
  const entries = getObdEntries();
  const p0300 = entries.find(entry => entry.href === '/kody-obd/p0300');
  assert.ok(p0300);
  assert.match(p0300.Nazwa, /^P0300 — /);
  assert.equal(p0300.href, '/kody-obd/p0300');
  assert.match(p0300.Rozwiązanie, /liczniki misfire/);
});
