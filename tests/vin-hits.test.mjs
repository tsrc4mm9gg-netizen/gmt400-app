// Liczniki „Zdjęcia i historia tego VIN”: tylko legalne źródła, 0 tylko z pustej odpowiedzi, brak danych ≠ 0.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectNhtsaModels, uniqueCount, badgeText, sortByHits, NOT_COUNTABLE_REASON } from '../src/lib/vin-hits.mjs';
import { vinHistoryLinks } from '../src/lib/vin-decode.mjs';

const NHTSA_1995_CHEVY = ['C/K', 'CAMARO', 'S-10', 'BLAZER', 'C10', 'C20', 'K10', 'K15', 'C15', 'SUBURBAN', 'K25', 'K20', 'PICKUP', 'TAHOE', '1500', 'S-BLAZER', 'SUBURBAN 1500', 'SUBURBAN 2500', 'S/T BLAZER', 'K1500', 'C1500', 'SILVERADO'];

test('NHTSA: tylko jednoznaczne nazwy pełnowymiarowych C/K (bez S-10, Blazera, ogólnego PICKUP)', () => {
  const m = selectNhtsaModels(NHTSA_1995_CHEVY, { platform: 'C/K', year: '1995' });
  for (const n of ['C/K', 'K1500', 'C1500', 'K15', '1500', 'SILVERADO']) assert.ok(m.includes(n), n);
  for (const n of ['S-10', 'BLAZER', 'S-BLAZER', 'PICKUP', 'TAHOE', 'SUBURBAN', 'CAMARO']) assert.ok(!m.includes(n), n);
  assert.ok(!selectNhtsaModels(['SILVERADO', 'K2500'], { platform: 'C/K', year: 1999 }).includes('SILVERADO'), 'od 1999 SILVERADO = GMT800');
  assert.deepEqual(selectNhtsaModels(NHTSA_1995_CHEVY, { platform: 'Suburban', year: 1995 }), ['SUBURBAN', 'SUBURBAN 1500', 'SUBURBAN 2500']);
  assert.deepEqual(selectNhtsaModels(NHTSA_1995_CHEVY, { platform: 'Tahoe', year: 1995 }), ['TAHOE']);
  assert.deepEqual(selectNhtsaModels(NHTSA_1995_CHEVY, { platform: undefined, year: 1995 }), []);
});

test('ta sama kampania pod kilkoma nazwami modelu liczy się raz', () => {
  assert.equal(uniqueCount([[{ NHTSACampaignNumber: '06E043000' }, { NHTSACampaignNumber: '07E088000' }], [{ NHTSACampaignNumber: '06E043000' }], []], 'NHTSACampaignNumber'), 2);
  assert.equal(uniqueCount([[], []], 'odiNumber'), 0);
});

test('brak danych nigdy nie jest pokazywany jako 0', () => {
  assert.equal(badgeText(0), '0');
  assert.equal(badgeText(3), '3');
  assert.equal(badgeText(1200), '999+');
  for (const v of [null, undefined, NaN, -1, '3', 1.5]) assert.equal(badgeText(v), null, String(v));
});

test('sortowanie: wyniki na górze, potem „sprawdź”, zera na końcu', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  assert.deepEqual(sortByHits(items, { a: 0, b: null, c: 5, d: 9 }).map(x => x.id), ['d', 'c', 'b', 'a']);
});

test('każdy link historii ma licznik z API albo udokumentowany powód braku liczby', () => {
  const links = vinHistoryLinks('1GCEK14K6SZ199684');
  assert.equal(new Set(links.map(l => l.id)).size, links.length);
  for (const l of links) assert.ok(l.count || NOT_COUNTABLE_REASON[l.reason], l.id);
  assert.deepEqual(links.filter(l => l.count).map(l => l.count), ['nhtsaRecalls', 'nhtsaComplaints']);
  assert.ok(links.some(l => l.href === 'https://cararam.com/en/vin/1GCEK14K6SZ199684'));
});

test('API /api/vin-hits: VIN przez POST, bez cache odpowiedzi, timeouty, błąd → null (nie 0)', () => {
  const src = fs.readFileSync(new URL('../src/app/api/vin-hits/route.ts', import.meta.url), 'utf8');
  assert.match(src, /export async function POST/);
  assert.doesNotMatch(src, /export async function GET/);
  assert.match(src, /'Cache-Control': 'no-store'/);
  assert.match(src, /AbortSignal\.timeout\(TIMEOUT_MS\)/);
  assert.match(src, /revalidate: DAY/);
  assert.match(src, /return \{ count: null/);
  assert.match(src, /res\.status === 400 && Array\.isArray\(list\) && list\.length === 0 && raw\?\.Count === 0/, 'pusty 400 z NHTSA = 0, inne błędy = nieznane');
  assert.doesNotMatch(src, /google\.com|bidfax|poctra|autoastat|cararam|carfax|autocheck|vinaudit|nicb/i, 'serwer nie odpytuje stron bez legalnego API');
});

test('historia VIN: jedna implementacja, brak starego scrapera i cudzych obrazków', async () => {
  const { existsSync, readFileSync } = await import('node:fs');
  const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
  assert.equal(existsSync(new URL('../src/app/api/vin-history', import.meta.url)), false, 'stary /api/vin-history usunięty');
  assert.equal(existsSync(new URL('../src/app/VinHistorySummary.tsx', import.meta.url)), false);
  const shared = read('src/app/VinHistoryHits.tsx');
  assert.doesNotMatch(shared, /<img|duckduckgo|referrerPolicy/i);
  assert.match(shared, /fetch\('\/api\/vin-hits'/);
  const decoder = read('src/app/VinDecoder.tsx'), tool = read('src/app/narzedzia/historia-vin/VinHistoryTool.tsx'), enc = read('src/app/Encyclopedia.tsx');
  assert.match(decoder, /<VinHistoryHits /);
  assert.match(tool, /<VinHistoryHits [^>]*variant="page"/);
  for (const [name, src] of [['VinDecoder', decoder], ['VinHistoryTool', tool]]) {
    assert.doesNotMatch(src, /api\/vin-hits|api\/vin-history|duckduckgo|<img/i, name + ' nie liczy po swojemu i nie pokazuje cudzych zdjęć');
  }
  assert.doesNotMatch(enc, /api\/vin-history|duckduckgo|VinHistorySummary/i, 'Encyclopedia bez starego wyszukiwania');
  assert.match(tool, /check\.ok/, 'strona historii sprawdza cyfrę kontrolną');
  assert.match(read('src/app/narzedzia/page.tsx'), /href: '\/narzedzia\/historia-vin'/);
});
