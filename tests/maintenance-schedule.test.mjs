import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { roundKm, milesToKm, getSchedule, itemStatus, buildIcs, addMonths, NO_DATA, SCHEDULE_SOURCES, intervalText } from '../src/lib/maintenance-schedule.mjs';
import { BUYER_SECTIONS, BUYER_ITEM_IDS, BUYER_PL_LINKS, readChecked } from '../src/lib/buyer-checklist.mjs';

test('mile → km z zaokrągleniem', () => {
  assert.equal(milesToKm(7500), 12000);
  assert.equal(milesToKm(3000), 5000);
  assert.equal(milesToKm(100000), 160000);
  assert.equal(milesToKm(150000), 240000);
  assert.equal(roundKm(4828), 5000);
});

test('harmonogram 1996–99 benzyna: źródło, strony, filtr napędu', () => {
  for (const year of [1996, 1997, 1998, 1999]) {
    const s4 = getSchedule({ year, engine: 'L31', transmission: '4L60E', drive: '4WD' });
    assert.equal(s4.source, year === 1999 ? 'OM99' : `OM${String(year).slice(2)}`);
    assert.ok(s4.items.length > 8);
    assert.ok(s4.items.every(i => i.page || i.info), `strona lub info: ${year}`);
    assert.ok(s4.items.find(i => i.id === 'olej'));
    assert.ok(!s4.items.find(i => i.drive === '2WD'));
    const s2 = getSchedule({ year, engine: 'L31', transmission: '4L60E', drive: '2WD' });
    assert.ok(!s2.items.find(i => i.drive === '4WD'));
  }
  for (const k of Object.keys(SCHEDULE_SOURCES)) {
    if (k.startsWith('OM')) assert.match(SCHEDULE_SOURCES[k].url, /^https:\/\/assets\.gm\.com\//);
    else { assert.equal(SCHEDULE_SOURCES[k].url, ''); assert.match(SCHEDULE_SOURCES[k].drive, /\.pdf$/); }
  }
});

test('braki danych: diesel 1996+, brak rocznika, poza zakresem', () => {
  const d = getSchedule({ year: 1997, engine: 'L65', transmission: '4L80E', drive: '2WD' });
  assert.equal(d.items.length, 0);
  assert.ok(d.notice.length > 0);
  assert.ok(getSchedule({}).notice.length > 0);
  assert.equal(getSchedule({ year: 1990, engine: 'L05' }).reference, true);
  assert.equal(getSchedule({ year: 2000, engine: 'L31' }).reference, true);
  assert.equal(getSchedule({ year: 1990, engine: 'L05' }).source, 'SM89');
  assert.equal(getSchedule({ year: 1993, engine: 'L05' }).source, 'SM92');
  assert.equal(getSchedule({ year: 1988, engine: 'L05', emissions: 'HD' }).source, 'SM89');
  assert.equal(getSchedule({ year: 1987, engine: 'L05' }).items.length, 0);
  assert.equal(intervalText(null), '');
  assert.equal(NO_DATA, 'brak danych w dokumentach');
});

test('stan pozycji: zaległe / wkrótce / ok / brak', () => {
  const rule = { mi: 3000, km: 5000, months: 3 };
  assert.equal(itemStatus(rule, { km: 100000, date: '2026-10-01' }, 106000, '2026-10-31').state, 'zalegle');
  assert.equal(itemStatus(rule, { km: 100000, date: '2026-10-01' }, 104700, '2026-10-31').state, 'wkrotce');
  assert.equal(itemStatus(rule, { km: 100000, date: '2026-10-01' }, 101000, '2026-10-31').state, 'ok');
  assert.equal(itemStatus(rule, null, null, '2026-10-31').state, 'brak');
  assert.equal(itemStatus(rule, { date: '2026-01-01' }, null, '2026-10-31').state, 'zalegle');
  assert.equal(itemStatus(null, { km: 1 }, 2, '2026-10-31').state, 'info');
  assert.equal(addMonths('2026-01-31', 1), '2026-02-28');
});

test('ICS: VEVENT + VALARM, CRLF, linie ≤ 75 oktetów', () => {
  const ics = buildIcs([{ uid: 'olej-1', date: '2026-12-01', summary: 'GMT400: wymiana oleju', description: 'Źródło: instrukcja GM, s. 7-6; sprawdź w swoim aucie, przecinek, średnik; '.repeat(3) }], new Date('2026-10-31T10:00:00Z'));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /BEGIN:VEVENT\r\n/);
  assert.match(ics, /DTSTART;VALUE=DATE:20261201\r\n/);
  assert.match(ics, /BEGIN:VALARM\r\n/);
  assert.match(ics, /TRIGGER:-P7D/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  assert.ok(!/[^\r]\n/.test(ics), 'tylko CRLF');
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75, line);
});

test('poradnik kupującego: unikalne id, źródło lub link, istniejące trasy', () => {
  assert.equal(new Set(BUYER_ITEM_IDS).size, BUYER_ITEM_IDS.length);
  const diag = readFileSync(new URL('../src/lib/diagnosis.ts', import.meta.url), 'utf8');
  const routeOk = href => {
    const [path, query] = href.split('?');
    const dir = new URL(`../src/app${path === '/' ? '' : path}/page.tsx`, import.meta.url);
    const guide = path.startsWith('/dla-wlasciciela/') && readFileSync(new URL('../src/lib/guides/index.ts', import.meta.url), 'utf8').length > 0;
    const objaw = query && new URLSearchParams(query).get('objaw');
    if (objaw) assert.ok(diag.includes(`id: '${objaw}'`), `objaw ${objaw}`);
    return existsSync(dir) || guide;
  };
  for (const sec of BUYER_SECTIONS) {
    for (const item of sec.items) {
      assert.ok(item.page || item.link, item.id);
      if (item.link) assert.ok(routeOk(item.link[0]), item.link[0]);
    }
    for (const [href] of sec.links ?? []) assert.ok(routeOk(href), href);
    if (sec.image) assert.ok(existsSync(new URL(`../public${sec.image.src}`, import.meta.url)), sec.image.src);
  }
  for (const [href] of BUYER_PL_LINKS) assert.ok(routeOk(href), href);
  assert.ok(BUYER_SECTIONS.find(s => s.id === 'vin').links.some(([h]) => h === '/vin'));
  assert.deepEqual(readChecked('{"checked":{"rdza-podwozie":true,"x":true}}'), { 'rdza-podwozie': true });
  assert.deepEqual(readChecked('nie-json'), {});
});

test('harmonogram 1988–1994 z instrukcji serwisowych: LD / HD / diesel', () => {
  for (const [year, src] of [[1988, 'SM88'], [1989, 'SM89'], [1991, 'SM91'], [1992, 'SM92'], [1994, 'SM94']]) {
    const ld = getSchedule({ year, engine: 'L05', transmission: '4L60', drive: '2WD' });
    assert.equal(ld.source, src); assert.equal(ld.reference, false); assert.equal(ld.emissions, 'LD');
    const oil = ld.items.find(i => i.id === 'olej');
    assert.deepEqual([oil.normal.mi, oil.normal.months, oil.severe.mi, oil.severe.months], [7500, 12, 3000, 3]);
    assert.ok(ld.items.every(i => i.page), `strona: ${year}`);
    assert.equal(ld.items.find(i => i.id === 'chlodzenie').normal.months, 24);
    const d = getSchedule({ year, engine: 'LH6', transmission: '4L60', drive: '2WD' });
    assert.equal(d.emissions, 'D');
    assert.equal(d.items.find(i => i.id === 'olej').normal.mi, 5000);
    assert.equal(d.items.find(i => i.id === 'olej').severe.mi, 2500);
  }
  const hd = getSchedule({ year: 1992, engine: 'L19', emissions: 'HD', transmission: '4L80E', drive: '2WD' });
  assert.equal(hd.items.find(i => i.id === 'olej').normal.mi, 6000);
  assert.equal(hd.items.find(i => i.id === 'swiece').normal.mi, 27000);
  assert.equal(hd.items.find(i => i.id === 'filtr-oleju').normal.firstMi, 6000);
  // 1989: nieczytelne znaczniki Schedule 1 — bez zgadywania
  const s89 = getSchedule({ year: 1989, engine: 'L05' });
  assert.equal(s89.items.find(i => i.id === 'filtr-oleju').severe, null);
  assert.ok(s89.items.find(i => i.id === 'filtr-oleju').info);
});
