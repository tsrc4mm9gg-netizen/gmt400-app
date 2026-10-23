import test from 'node:test';
import assert from 'node:assert/strict';
import { FUSE_TABLES, FUSE_YEARS, filterFuseTables, normalizeFuseText, yearsLabel } from '../src/lib/fuses.mjs';
import { decodeVin, expectedCheckDigit, YEAR_CODES } from '../src/lib/vin-decode.mjs';

test('każda tabela bezpieczników ma model + lata, źródła i kompletne pozycje', () => {
  assert.equal(FUSE_TABLES.length, 3);
  for (const t of FUSE_TABLES) {
    assert.match(t.models, /(19\d\d)/);
    assert.ok(t.sources.length >= t.years.length, t.id);
    for (const s of t.sources) assert.match(s.url, /^https:\/\//);
    for (const r of t.rows) { assert.ok(r.pos && r.variants.length, `${t.id} ${r.pos}`); for (const v of r.variants) assert.ok(v.years.every(y => t.years.includes(y))); }
  }
  const ip = FUSE_TABLES.find(t => t.id === 'ip-1995-1999');
  assert.deepEqual(ip.rows.map(r => r.pos), [...Array.from({ length: 24 }, (_, i) => String(i + 1)), 'A', 'B']);
  assert.equal(FUSE_TABLES.find(t => t.id === 'ip-1994').rows.find(r => r.name === 'WIPER').amps, '25 A');
});

test('filtr bezpieczników: rocznik i wyszukiwanie bez polskich znaków', () => {
  assert.equal(normalizeFuseText('Światła  STOP'), 'swiatla stop');
  const y97 = filterFuseTables(FUSE_TABLES, { year: '1997' });
  assert.deepEqual(y97.map(t => t.id), ['ip-1995-1999', 'uh-1996-1999']);
  const pos21 = y97[0].rows.find(r => r.pos === '21');
  assert.equal(pos21.variants.length, 1);
  assert.match(pos21.variants[0].text, /Variable Effort Steering|wspomag/i);
  const wip = filterFuseTables(FUSE_TABLES, { query: 'wycieraczki' });
  assert.ok(wip.some(t => t.rows.length));
  assert.equal(filterFuseTables(FUSE_TABLES, { query: 'zzzz-nie-ma' }).length, 0);
  assert.equal(yearsLabel(['1996', '1997', '1998']), '1996–1998');
  assert.deepEqual(FUSE_YEARS, ['1994', '1995', '1996', '1997', '1998', '1999']);
});

test('VIN: cyfra kontrolna wg 49 CFR 565.15 (przykład z X)', () => {
  assert.equal(expectedCheckDigit('1M8GDM9AXKP042788'), 'X');
  assert.equal(expectedCheckDigit('1M8GDM9AXKP04278'), null);
  const r = decodeVin('1m8gdm9a-xkp042788');
  assert.equal(r.ok, true); assert.equal(r.check.ok, true); assert.equal(r.year, 1989);
});

test('VIN: rok, silnik z OM i błędy znaków', () => {
  assert.equal(YEAR_CODES.R, 1994); assert.equal(YEAR_CODES.Y, 2000);
  const base = '1GCEK14K0RZ000000'.split('');
  const vin = base.join(''); base[8] = expectedCheckDigit(vin); const fixed = base.join('');
  const r = decodeVin(fixed);
  assert.equal(r.check.ok, true); assert.equal(r.year, 1994); assert.equal(r.engine.engine, '5.7 L V8');
  const v97 = decodeVin('1GCEK19R0VE000000');
  assert.equal(v97.engine.rpo, 'L31');
  const v99w = decodeVin('3GNFK16W0XG000000');
  assert.equal(v99w.engine, null); assert.match(v99w.engineNote, /nie występuje/);
  const v90 = decodeVin('1GCDC14K0LZ000000');
  assert.equal(v90.year, 1990); assert.equal(v90.engine, null); assert.match(v90.engineNote, /Brak tabeli/);
  const bad = decodeVin('1GCEK19R0VE00000O');
  assert.equal(bad.ok, false); assert.match(bad.errors.join(' '), /I, O ani Q/);
  assert.equal(decodeVin('123').ok, false);
});
