import test from 'node:test';
import assert from 'node:assert/strict';
import { extractDiyBrief, blocksToBriefText } from '../src/lib/diy-brief.mjs';
import { localTileImage } from '../src/lib/tile-image.mjs';

const P = o => ({ Typ: 'Porada', Opis: '', Objawy: '', Rozwiązanie: '', ...o });

test('narzędzia i części z etykiet, bez wymyślania', () => {
  const b = extractDiyBrief(P({ Rozwiązanie: '1. Zdemontuj.\n\nNARZĘDZIA: klucz 13 mm, (kombinerki; młotek); śrubokręt.\nCZĘŚCI GM (s. 10-1): uszczelka; olej API SG (10W-30).' }));
  assert.deepEqual(b.tools, ['klucz 13 mm, (kombinerki; młotek)', 'śrubokręt']);
  assert.deepEqual(b.parts, ['uszczelka', 'olej API SG (10W-30)']);
  assert.equal(b.safety.length, 0);
});

test('bez danych: puste listy, zero ostrzeżeń, wskazanie „procedura bez listy”', () => {
  const b = extractDiyBrief(P({ Rozwiązanie: '1. Odkręć śrubę.\n2. Wymień element.' }));
  assert.deepEqual([b.tools, b.parts, b.safety], [[], [], []]);
  assert.equal(b.isProcedure, true);
});

test('ostrzeżenia tylko z treści: odłączenie akumulatora, podpórki, ⚠️ z manualem nie jest ostrzeżeniem', () => {
  const b = extractDiyBrief(P({ Rozwiązanie: '1. Odłącz minus akumulatora.\n2. Unieś przód, podeprzyj na stojakach.\n⚠️ Sprawdź w swoim aucie / manualu — numeracja gniazd różni się wg rocznika.' }));
  assert.deepEqual(b.safety.map(s => s.tag), ['Akumulator', 'Podniesione auto']);
  assert.match(b.safety[0].text, /Odłącz minus akumulatora/);
});

test('UWAGA bez słów o ryzyku nie jest ostrzeżeniem; z ryzykiem — jest', () => {
  assert.equal(extractDiyBrief(P({ Rozwiązanie: 'UWAGA: procedura z instrukcji, sprawdź w manualu.' })).safety.length, 0);
  const b = extractDiyBrief(P({ Rozwiązanie: 'UWAGA — noś okulary, zbiornik jest pod ciśnieniem. Reszta kroku.' }));
  assert.equal(b.safety.length, 1);
  assert.match(b.safety[0].text, /okulary/);
});

test('BEZPIECZEŃSTWO rozbite na krótkie pozycje (max 3)', () => {
  const b = extractDiyBrief(P({ Rozwiązanie: 'BEZPIECZEŃSTWO (s. 5-2): kwas w akumulatorze; nie świeć zapałką; a; ten czwarty element; piąty element.' }));
  assert.equal(b.safety.filter(s => s.tag === 'Bezpieczeństwo').length <= 3, true);
  assert.equal(b.safety[0].text, 'Kwas w akumulatorze');
});

test('inne typy wpisu: brak bloków porady, ale źródła są czytane', () => {
  const b = extractDiyBrief({ Typ: 'Usterka', Opis: 'Opis. Źródło: Haynes 1988–98, s. 3. Parafraza. Sprawdź w swoim aucie / manualu.', Objawy: '', Rozwiązanie: '1. Odłącz minus akumulatora.' });
  assert.equal(b.applies, false);
  assert.deepEqual(b.safety, []);
  assert.deepEqual(b.sources, [{ text: 'Haynes 1988–98, s. 3', urls: [] }]);
  assert.equal(b.paraphrase, true);
});

test('źródło z adresem https; adresy inne niż http(s) nie są przepuszczane do linków', () => {
  const b = extractDiyBrief(P({ Opis: 'Źródło: Instrukcja GM 1996 https://assets.gm.com/x.pdf.\n' }));
  assert.deepEqual(b.sources, [{ text: 'Instrukcja GM 1996', urls: ['https://assets.gm.com/x.pdf'] }]);
  assert.deepEqual(extractDiyBrief(P({ Opis: 'Źródło: javascript:alert(1)' })).sources[0].urls, []);
});

test('bloki Notion: nagłówek „Narzędzia” + lista punktowana', () => {
  const rt = t => ({ rich_text: [{ plain_text: t }] });
  const txt = blocksToBriefText([
    { type: 'heading_2', heading_2: rt('Narzędzia') },
    { type: 'bulleted_list_item', bulleted_list_item: rt('klucz 10 mm') },
    { type: 'bulleted_list_item', bulleted_list_item: rt('zestaw nasadek') },
    { type: 'heading_2', heading_2: rt('Części') },
    { type: 'bulleted_list_item', bulleted_list_item: rt('filtr oleju') },
    { type: 'paragraph', paragraph: rt('Zwykły akapit.') },
  ]);
  const b = extractDiyBrief(P({}), txt);
  assert.deepEqual(b.tools, ['klucz 10 mm', 'zestaw nasadek']);
  assert.deepEqual(b.parts, ['filtr oleju']);
});

test('obrazek miniatury z danych: tylko lokalna ścieżka graficzna', () => {
  assert.equal(localTileImage('/diy/olej.jpg'), '/diy/olej.jpg');
  for (const bad of ['https://x.pl/a.jpg', '//x.pl/a.jpg', '/a/../b.jpg', '/a.svg', 'a.jpg', '', null, 5]) assert.equal(localTileImage(bad), null);
});
