import test from 'node:test';
import assert from 'node:assert/strict';
import { buildKnowledgeIndex, searchKnowledge } from '../src/lib/knowledge-index.mjs';
import { searchNote } from '../src/lib/knowledge-search.mjs';
import { GUIDE_ENTRIES } from '../src/lib/guide-entries.mjs';

const other = [
  { id: 'n1', Nazwa: 'Pedał gazu — luz linki', Typ: 'Usterka', Model: 'C/K', Opis: 'Linka gazu i pedał gazu, regulacja.' },
  { id: 'n2', Nazwa: 'Kod P0300 — wypadanie zapłonu', Typ: 'Kod błędu', Model: 'Tahoe Suburban', Opis: 'Spalanie stukowe i wypadanie zapłonu.' },
  { id: 'n3', Nazwa: 'Wymiana oleju w skrzyni 4L60E', Typ: 'Porada', Model: 'Tahoe Suburban', Opis: 'Dexron VI, ilość oleju.' },
  { id: 'n4', Nazwa: 'Zardzewiałe przewody hamulcowe', Typ: 'Usterka', Model: 'C/K', Opis: 'Korozja przewodów.' },
  { id: 'n5', Nazwa: 'Chevrolet Tahoe 4-drzwi — pełny opis', Typ: 'Model', Model: 'Tahoe', Opis: 'Wersja rodzinna.' },
];
const index = buildKnowledgeIndex([...other, ...GUIDE_ENTRIES]);
const top = query => searchKnowledge(index, query)[0]?.href;
const g = slug => `/dla-wlasciciela/${slug}`;

const expectations = {
  lpg: ['tahoe lpg', 'chevrolet tahoe lpg', 'suburban lpg', 'silverado lpg', 'sierra lpg', 'lpg do v8', 'instalacja lpg v8 cena', 'instalacja gazowa', 'chevrolet tahoe gaz', 'gaz', 'autogaz', 'stag v8', 'prins v8', 'LPG', 'Instalacja Gazowa Tahoe'],
  import: ['akcyza auto z usa', 'sprowadzenie auta z usa', 'sprowadzenie auta z usa koszty', 'auto z usa kalkulator', 'cło auto z usa', 'rejestracja auta z usa', 'przegląd auta z usa', 'pierwszy przegląd auta z usa', 'import z usa', 'sprowadzenie', 'akcyza', 'opłata recyklingowa', 'pickup ciężarowy', 'tahoe z usa'],
  'swiatla-eu': ['czerwone kierunkowskazy usa', 'kierunkowskazy usa', 'kierunkowskazy', 'lampy usa', 'przeróbka lamp usa', 'przeróbka świateł usa na eu', 'migacze', 'turn signals', 'zielona żarówka', 'światła przeciwmgłowe', 'tahoe światła', 'headlights'],
  'zolte-tablice': ['żółte tablice', 'zabytek', 'rejestracja zabytku', 'auto zabytkowe od ilu lat', 'zabytek 25 lat', 'tablice zabytkowe', 'suburban zabytek', 'yellow plates'],
};
for (const [slug, phrases] of Object.entries(expectations)) {
  for (const phrase of phrases) test(`„${phrase}” → poradnik ${slug} na 1. miejscu`, () => assert.equal(top(phrase), g(slug)));
}

test('„gaz” nie ściąga pedału gazu przed poradnikiem LPG', () => {
  const results = searchKnowledge(index, 'gaz');
  assert.equal(results[0].href, g('lpg'));
});

test('spalanie: poradnik LPG + uczciwa notka, bez szumu „spalanie stukowe”', () => {
  for (const phrase of ['tahoe spalanie', 'suburban spalanie', 'silverado spalanie', 'zużycie paliwa', 'fuel consumption']) {
    const results = searchKnowledge(index, phrase);
    assert.deepEqual(results.map(r => r.href || r.id), [g('lpg')], phrase);
    assert.match(searchNote(phrase) ?? '', /osobnej strony o spalaniu/, phrase);
  }
  assert.equal(searchNote('tahoe lpg'), null);
});

test('homologacja: poradnik importu z notką o braku osobnej sekcji', () => {
  assert.equal(top('homologacja auta z usa'), g('import'));
  assert.match(searchNote('homologacja auta z usa') ?? '', /nie opisuje osobno homologacji/);
});

test('PL/EN synonimy zwykłych wpisów', () => {
  assert.equal(searchKnowledge(index, 'rust brakes')[0]?.id, 'n4');
  assert.equal(searchKnowledge(index, 'rdza hamulce')[0]?.id, 'n4');
  assert.equal(searchKnowledge(index, '4l60e oil')[0]?.id, 'n3');
});

test('model + temat: słowo modelu nie jest wymagane, ale podbija wynik', () => {
  assert.equal(searchKnowledge(index, 'suburban 4l60e')[0]?.id, 'n3');
  assert.equal(searchKnowledge(index, 'tahoe')[0]?.id !== undefined, true);
});

test('wyszukiwanie bez zmian dla kodów i fraz obcych', () => {
  assert.equal(top('p0300'), undefined);
  assert.equal(searchKnowledge(index, 'p0300')[0]?.id, 'n2');
  assert.equal(searchKnowledge(index, 'p').length, 0);
  assert.equal(searchKnowledge(index, 'xyzzy plugh').length, 0);
});

test('każdy poradnik ma frazy Slowa i href', () => {
  for (const entry of GUIDE_ENTRIES) { assert.ok(entry.Slowa.length > 50, entry.id); assert.match(entry.href, /^\/dla-wlasciciela\//); }
});
