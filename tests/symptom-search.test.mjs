import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSymptomIndex, searchSymptoms, parseSymptomQuery, normalizeText, conceptOf } from '../src/lib/symptom-search.mjs';

const E = [
  { id: 'u1', Typ: 'Usterka', Nazwa: 'Hamulce — pisk i stukanie zacisków', Objawy: 'Puka przy hamowaniu, piszczą klocki.', Opis: '' },
  { id: 'u2', Typ: 'Usterka', Nazwa: 'Przegrzewanie się silnika', Objawy: 'Wskazówka temperatury wysoko.', Opis: 'Termostat, pompa wody.' },
  { id: 'u3', Typ: 'Usterka', Nazwa: 'Silnik nie odpala na zimno', Objawy: 'Kręci, ale nie zapala.', Opis: '' },
  { id: 'u4', Typ: 'Usterka', Nazwa: 'Niebieski dym z wydechu', Objawy: 'Auto dymi po rozruchu.', Opis: '' },
  { id: 'u5', Typ: 'Usterka', Nazwa: 'Szarpanie przy przyspieszaniu', Objawy: 'Szarpie, nierówna praca.', Opis: '' },
  { id: 'p1', Typ: 'Porada', Nazwa: 'Wymiana klocków hamulcowych', Objawy: '', Opis: 'Procedura krok po kroku.' },
  { id: 'p2', Typ: 'Porada', Nazwa: 'Paliwo — wymiana filtra', Objawy: '', Opis: '' },
  { id: 'x1', Typ: 'Specyfikacja', Nazwa: 'Hamulce — dane', Objawy: '', Opis: '' },
];
const ix = buildSymptomIndex(E);
const ids = r => [...r.faults, ...r.diy].map(e => e.id);

test('normalizacja: ogonki, ł, interpunkcja', () => {
  assert.equal(normalizeText('Piszczą  HAMULCE, łożysko!'), 'piszcza hamulce lozysko');
});

test('synonimy i odmiana: stuka/stukanie/puka, hamowanie/hamuje/hamulce', () => {
  for (const w of ['stuka', 'stukanie', 'puka', 'pukanie']) assert.equal(conceptOf(normalizeText(w)), 'stuk', w);
  for (const w of ['hamowanie', 'hamowaniu', 'hamuje', 'hamulce', 'hamulców']) assert.equal(conceptOf(normalizeText(w)), 'hamowanie', w);
  for (const w of ['piszczy', 'pisk']) assert.equal(conceptOf(normalizeText(w)), 'pisk', w);
  for (const w of ['dymi', 'dym']) assert.equal(conceptOf(normalizeText(w)), 'dym', w);
  for (const w of ['grzeje', 'przegrzewa']) assert.equal(conceptOf(normalizeText(w)), 'przegrzewa', w);
  assert.equal(conceptOf('szarpie'), 'szarpie');
});

test('„stuka przy hamowaniu” → usterka hamulców + DIY klocków, bez wpisów spoza Usterka/Porada', () => {
  const r = searchSymptoms(ix, 'stuka przy hamowaniu');
  assert.equal(r.faults[0].id, 'u1');
  assert.ok(r.diy.some(e => e.id === 'p1'));
  assert.ok(!ids(r).includes('x1'));
});

test('„nie pali” = „nie odpala” (a „dużo pali” to nie rozruch)', () => {
  assert.equal(searchSymptoms(ix, 'nie pali').faults[0].id, 'u3');
  assert.equal(searchSymptoms(ix, 'nie odpala').faults[0].id, 'u3');
  assert.ok(!searchSymptoms(ix, 'dużo pali').faults.some(e => e.id === 'u3'));
  assert.deepEqual(parseSymptomQuery('nie pali').map(t => t.key), ['rozruch']);
});

test('pojedyncze objawy: dymi, grzeje się, przegrzewa, szarpie, piszczy', () => {
  assert.equal(searchSymptoms(ix, 'dymi').faults[0].id, 'u4');
  assert.equal(searchSymptoms(ix, 'grzeje się').faults[0].id, 'u2');
  assert.equal(searchSymptoms(ix, 'przegrzewa').faults[0].id, 'u2');
  assert.equal(searchSymptoms(ix, 'szarpie').faults[0].id, 'u5');
  assert.equal(searchSymptoms(ix, 'piszczy').faults[0].id, 'u1');
});

test('brak trafień → puste listy', () => {
  const r = searchSymptoms(ix, 'xyzzy kot');
  assert.equal(r.faults.length + r.diy.length, 0);
  assert.equal(searchSymptoms(ix, '  ').terms.length, 0);
});
