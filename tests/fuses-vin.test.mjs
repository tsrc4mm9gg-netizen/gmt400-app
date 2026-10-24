import test from 'node:test';
import assert from 'node:assert/strict';
import { FUSE_TABLES, FUSE_YEARS, filterFuseTables, normalizeFuseText, yearsLabel } from '../src/lib/fuses.mjs';
import { decodeVin, expectedCheckDigit, YEAR_CODES, POSITION_TABLES, VIN_SOURCES, UNKNOWN, profileFromVin, vinHistoryLinks } from '../src/lib/vin-decode.mjs';

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
  assert.equal(v90.year, 1990); assert.equal(v90.engine.engine.includes('5.7'), true); assert.equal(v90.engine.tier, 'secondary'); assert.deepEqual(v90.engine.sources, ['lmc']);
  const v90x = decodeVin('1GCDC14X0LZ000000');
  assert.equal(v90x.engine, null); assert.ok(v90x.engineNote.includes(UNKNOWN));
  const bad = decodeVin('1GCEK19R0VE00000O');
  assert.equal(bad.ok, false); assert.match(bad.errors.join(' '), /I, O ani Q/);
  assert.equal(decodeVin('123').ok, false);
});

// VIN-y z poprawną cyfrą kontrolną, zweryfikowane w NHTSA vPIC (ErrorCode 0) — 23.10.2026.
const KNOWN = {
  '1GCDC14K8JZ100001': { year: 1988, plant: 'Fort Wayne', profile: { brand: 'Chevrolet', drive: '2WD', platform: 'C/K', model: 'C1500' } },
  '1GCEK19R9VE112233': { year: 1997, plant: 'Pontiac', profile: { brand: 'Chevrolet', drive: '4WD', platform: 'C/K', model: 'K1500', engine: 'L31' } },
  '1GNFK16R7VJ345678': { year: 1997, plant: null, profile: { brand: 'Chevrolet', drive: '4WD', platform: 'Suburban', model: 'Suburban 1500', engine: 'L31' } },
  '1GKEK13R1XJ456789': { year: 1999, plant: 'Janesville', profile: { brand: 'GMC', drive: '4WD', engine: 'L31' } },
  '1GCHK29F8YF123456': { year: 2000, plant: 'Flint', profile: { brand: 'Chevrolet', drive: '4WD', platform: 'C/K', model: 'K2500', engine: 'L65' } },
  '2GCEK19K9R1234567': { year: 1994, plant: 'Oshawa', profile: { brand: 'Chevrolet', drive: '4WD', platform: 'C/K', model: 'K1500' } },
  '1GTDC14Z9KE223344': { year: 1989, plant: 'Pontiac', profile: { brand: 'GMC', drive: '2WD', platform: 'C/K', model: 'C1500' } },
};

test('VIN: pełne dekodowanie — każda pozycja ma wartość ze źródłem albo „nieznane – sprawdź”', () => {
  for (const [vin, exp] of Object.entries(KNOWN)) {
    const r = decodeVin(vin);
    assert.equal(r.ok, true, vin); assert.equal(r.check.ok, true, vin); assert.equal(r.year, exp.year, vin);
    assert.deepEqual(r.fields.map(f => f.pos), ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12–17'], vin);
    for (const f of r.fields) {
      assert.ok(['gm', 'secondary', 'unknown'].includes(f.tier), `${vin} ${f.pos}`);
      if (f.value === null) { assert.equal(f.tier, 'unknown'); assert.ok(f.note, `${vin} poz. ${f.pos} bez wyjaśnienia`); }
      else assert.ok(f.sources.length > 0 && f.sources.every(k => VIN_SOURCES[k]?.url.startsWith('https://')), `${vin} poz. ${f.pos} bez źródła`);
    }
    const plant = r.fields.find(f => f.pos === '11');
    if (exp.plant) assert.match(plant.value, new RegExp(exp.plant), vin); else assert.equal(plant.value, null, vin);
    const p = profileFromVin(r);
    for (const [k, v] of Object.entries(exp.profile)) assert.equal(p[k], v, `${vin} ${k}`);
    if (!exp.profile.model) { assert.equal(p.model, undefined); assert.equal(p.platform, undefined); }
  }
});

test('VIN: tabele pozycji mają lata 1988–2000, rodzaj źródła i istniejące klucze źródeł', () => {
  for (const [pos, tables] of Object.entries(POSITION_TABLES)) for (const t of tables) {
    assert.ok(t.from >= 1988 && t.to <= 2000 && t.from <= t.to, pos);
    assert.ok(['gm', 'secondary'].includes(t.tier), pos);
    assert.ok(t.sources.length && t.sources.every(k => VIN_SOURCES[k]), pos);
    if (t.tier === 'secondary') assert.ok(t.sources.every(k => ['lmc', 'jegs'].includes(k)), pos);
  }
  // Dwuznaczny kod marki B/D w tabeli GM → nie zgadujemy typu
  const b = decodeVin('1GBHK34F0XF000000'); assert.equal(b.fields.find(f => f.pos === '3').value, null);
  assert.equal(profileFromVin(decodeVin('1GDHK34F0XF000000'))?.brand, 'GMC');
  assert.equal(profileFromVin(decodeVin('ABC')), null);
});

test('VIN: linki „Zdjęcia i historia” to tylko wyszukiwania / strony startowe (https, bez obrazków)', () => {
  const links = vinHistoryLinks('1GCEK19R9VE112233');
  assert.ok(links.length >= 8);
  for (const l of links) { assert.match(l.href, /^(https:\/\/|\/narzedzia\/)/); assert.doesNotMatch(l.href, /\.(jpe?g|png|webp)(\?|$)/i); }
  assert.ok(links.some(l => l.href.includes('tbm=isch') && l.href.includes(encodeURIComponent('"1GCEK19R9VE112233"'))));
  assert.ok(links.filter(l => l.href.startsWith('https://www.google.com/search')).every(l => l.href.includes('1GCEK19R9VE112233')));
});
