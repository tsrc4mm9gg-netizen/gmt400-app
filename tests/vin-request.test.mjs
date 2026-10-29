import test from 'node:test';
import assert from 'node:assert/strict';
import { validateVinForRequest, newRequestCode, hashCode, publicId, hashIp, clientIp, createLimiter, buildStatusBody, signSession, verifySession, passwordMatches, CODE_RE, ID_RE } from '../src/lib/vin-request.mjs';
import { createNotionStore, storeConfig, toRecord, packResults, parseResults } from '../src/lib/vin-request-store.mjs';
import { fetchAuctionData, needsRefresh, lotUrl, RESULTS_TTL_MS, RETRY_ERROR_AFTER_MS } from '../src/lib/apibara.mjs';

const VIN = '1GNEK13R4XJ445157';
// Testowy klucz — fikcyjny, służy tylko do sprawdzenia, że trafia wyłącznie do nagłówka.
const KEY = 'test-key-not-real-0000';

test('walidacja VIN: długość, znaki I/O/Q, cyfra kontrolna', () => {
  assert.deepEqual(validateVinForRequest(' 1gnek13r4xj445157 '), { ok: true, vin: VIN });
  assert.equal(validateVinForRequest('1GNEK13R4XJ44515').ok, false);
  assert.equal(validateVinForRequest('1GNEK13R4XJ44515O').ok, false);
  assert.equal(validateVinForRequest('1GNEK13R5XJ445157').ok, false);
  assert.equal(validateVinForRequest(undefined).ok, false);
  assert.equal(validateVinForRequest({}).ok, false);
});

test('kod prośby, hash, id publiczne i hash IP', () => {
  const c = newRequestCode();
  assert.match(c, CODE_RE);
  assert.notEqual(c, newRequestCode());
  const h = hashCode(c);
  assert.equal(h.length, 64);
  assert.match(publicId(h), ID_RE);
  assert.notEqual(hashIp('1.2.3.4', 'a'), hashIp('1.2.3.4', 'b'));
  assert.equal(clientIp({ get: n => (n === 'x-forwarded-for' ? '9.9.9.9, 10.0.0.1' : null) }), '9.9.9.9');
});

test('limiter: blokuje po limicie i odblokowuje po oknie', () => {
  let t = 0;
  const l = createLimiter({ max: 2, windowMs: 1000, now: () => t });
  assert.equal(l.take('a').ok, true); assert.equal(l.take('a').ok, true);
  const third = l.take('a'); assert.equal(third.ok, false); assert.ok(third.retryAfterSec >= 1);
  assert.equal(l.take('b').ok, true);
  t = 1500; assert.equal(l.take('a').ok, true);
});

test('status: loadResults jest wywoływane TYLKO dla approved (brak ujawnienia bez zatwierdzenia)', async () => {
  let calls = 0;
  const load = async () => { calls++; return { secret: true }; };
  const base = { id: 'HV-00000000', vin: VIN, createdAt: '2026-10-29T00:00:00Z' };
  for (const status of ['pending', 'rejected']) {
    const b = await buildStatusBody({ ...base, status }, load);
    assert.equal('results' in b, false);
    assert.equal(JSON.stringify(b).includes('secret'), false);
  }
  assert.equal(calls, 0);
  assert.deepEqual((await buildStatusBody({ ...base, status: 'approved' }, load)).results, { secret: true });
  assert.equal(calls, 1);
});

test('sesja admina: podpis, wygaśnięcie, manipulacja, zmiana hasła, hasło', () => {
  const pw = 'dlugie-testowe-haslo', T0 = 1_800_000_000_000;
  const tok = signSession(pw, { now: T0, ttlMs: 5000 });
  assert.equal(verifySession(pw, tok, T0 + 1000), true);
  assert.equal(verifySession(pw, tok, T0 + 6000), false);
  assert.equal(verifySession('inne-haslo-123', tok, T0 + 1000), false);
  const [exp, nonce, mac] = tok.split('.');
  assert.equal(verifySession(pw, `${Number(exp) + 99999}.${nonce}.${mac}`, T0 + 1000), false);
  assert.equal(verifySession(pw, 'a.b.c', T0 + 1000), false);
  assert.equal(verifySession(undefined, tok, T0 + 1000), false);
  assert.equal(verifySession(pw, undefined, T0 + 1000), false);
  assert.equal(passwordMatches(pw, pw), true);
  assert.equal(passwordMatches('x', pw), false);
  assert.equal(passwordMatches(pw, undefined), false);
});

// ---- magazyn Notion z atrapą fetch ----
function fakeNotion() {
  const pages = [];
  const calls = [];
  const fetchImpl = async (url, init) => {
    const path = new URL(url).pathname; const body = init.body ? JSON.parse(init.body) : null;
    calls.push({ path, method: init.method, body, auth: init.headers.Authorization });
    const ok = j => ({ ok: true, status: 200, json: async () => j });
    if (path === '/v1/pages' && init.method === 'POST') {
      const props = {};
      for (const [k, v] of Object.entries(body.properties)) props[k] = v;
      const page = { id: 'page-' + (pages.length + 1), created_time: '2026-10-29T00:00:00.000Z', properties: props };
      pages.push(page); return ok(page);
    }
    if (path.endsWith('/query')) {
      const f = body.filter || {};
      const eq = (p, kind) => pages.filter(pg => (kind === 'title' ? pg.properties[p]?.title : pg.properties[p]?.rich_text)?.map(x => x.text.content).join('') === (f[kind]?.equals ?? f.rich_text?.equals));
      let r = pages;
      if (f.property === 'KodHash') r = eq('KodHash', 'rich_text');
      else if (f.property === 'Nazwa') r = eq('Nazwa', 'title');
      else if (f.property === 'Status') r = pages.filter(pg => pg.properties.Status?.select?.name === f.select.equals);
      return ok({ results: r });
    }
    const m = path.match(/^\/v1\/pages\/(.+)$/);
    if (m && init.method === 'PATCH') {
      const pg = pages.find(x => x.id === m[1]); Object.assign(pg.properties, body.properties); return ok(pg);
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
  return { fetchImpl, pages, calls };
}

test('magazyn: create / findByCodeHash / pendingCount / setStatus po publicznym id / list', async () => {
  const { fetchImpl, calls } = fakeNotion();
  const store = createNotionStore({ token: 'tok', db: 'a'.repeat(32), apiBase: 'http://notion.test', fetchImpl });
  const codeHash = hashCode(newRequestCode());
  const id = publicId(codeHash);
  const rec = await store.create({ id, vin: VIN, codeHash, ipHash: 'ip1' });
  assert.deepEqual([rec.id, rec.vin, rec.status], [id, VIN, 'pending']);
  assert.equal(calls[0].auth, 'Bearer tok');
  assert.equal((await store.findByCodeHash(codeHash)).id, id);
  assert.equal(await store.findByCodeHash('0'.repeat(64)), null);
  assert.equal(await store.pendingCount(), 1);
  assert.equal(await store.setStatus('HV-FFFFFFFF', 'approved'), null);
  const ap = await store.setStatus(id, 'approved');
  assert.equal(ap.status, 'approved');
  assert.ok(ap.decidedAt);
  assert.equal(await store.pendingCount(), 0);
  assert.equal((await store.list()).length, 1);
});

test('cache wyników: pakowanie w kawałki ≤2000 znaków i odczyt; zły JSON → null', async () => {
  const big = { state: 'ok', fetchedAt: 'x', history: Array.from({ length: 40 }, (_, i) => ({ lot: String(i), status: 'ś'.repeat(60) })) };
  const parts = packResults(big);
  assert.ok(parts.length >= 2 && parts.every(p => p.text.content.length <= 2000));
  assert.deepEqual(parseResults({ rich_text: parts.map(p => ({ plain_text: p.text.content })) }), big);
  assert.equal(parseResults({ rich_text: [{ plain_text: '{zepsuty' }] }), null);
  assert.equal(parseResults({ rich_text: [{ plain_text: '{"a":1}' }] }), null);
  assert.equal(packResults({ s: 'x'.repeat(200000) }), null);
  const { fetchImpl, pages } = fakeNotion();
  const store = createNotionStore({ token: 't', db: 'b'.repeat(32), apiBase: 'http://notion.test', fetchImpl });
  const r = await store.create({ id: 'HV-AAAAAAAA', vin: VIN, codeHash: 'h', ipHash: 'i' });
  assert.equal(await store.setResults(r.pageId, big), true);
  assert.deepEqual(toRecord(pages[0]).results, big);
});

test('storeConfig: wymaga tokenu i 32-znakowego id bazy', () => {
  assert.equal(storeConfig({}), null);
  assert.equal(storeConfig({ NOTION_TOKEN: 't', NOTION_VIN_REQUESTS_DB: 'abc' }), null);
  assert.equal(storeConfig({ NOTION_TOKEN: 't', NOTION_VIN_REQUESTS_DB: '12345678-1234-1234-1234-123456789abc' }).db, '123456781234123412341234' + '56789abc');
});

// ---- Apibara (atrapa fetch; zero prawdziwych zapytań) ----
const res = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
const run = (fetchImpl, opts = {}) => fetchAuctionData(VIN, { apiKey: KEY, fetchImpl, now: () => '2026-10-29T10:00:00.000Z', ...opts });

test('Apibara: klucz tylko w nagłówku X-API-Key, adres z VIN i include', async () => {
  let seen;
  await run(async (url, init) => { seen = { url, init }; return res(404, {}); });
  assert.equal(seen.url, `https://apibara.tech/api/v1/vehicle-auction/vehicles/${VIN}?include=history,vin_lots`);
  assert.equal(seen.init.headers['X-API-Key'], KEY);
  assert.equal(seen.url.includes(KEY), false);
});

test('Apibara: rekordy → ok, ceny/uszkodzenia/historia, brak wartości = null (nie 0), zdjęcia tylko jako liczba', async () => {
  const body = { data: {
    platform: 'copart', lot_number: '12345678', vin: VIN, title: '1999 CHEVROLET TAHOE', year: 1999, make: 'CHEVROLET', model: 'TAHOE', damage: 'Front end',
    odometer: { mi: 100000, km: null }, auction: { auction_at: '2026-05-01T14:00:00+00:00', outcome_status: 'Sold' },
    pricing: { sale_price_usd: 1200, current_bid_usd: null, buy_now_usd: null, last_sold_price_usd: null },
    media: { photos: ['https://img.example/1.jpg'], images_count: 14 },
    history: [{ platform: 'copart', lot_number: 12345678, date: '2026-05-01', price: 1200, status: 'Sold' }, { platform: 'iaai', lot_number: null, date: null, price: null, status: null }],
    vin_lots: [{ platform: 'iaai', lot_number: '99999999', title: 'x', auction: { outcome_status: 'Not Sold' }, pricing: { sale_price_usd: null } }],
  } };
  const r = await run(async () => res(200, body));
  assert.equal(r.state, 'ok');
  assert.equal(r.vehicle.damage, 'Front end');
  assert.equal(r.vehicle.priceUsd.sale, 1200);
  assert.equal(r.vehicle.priceUsd.currentBid, null);
  assert.equal(r.vehicle.odometerKm, null);
  assert.equal(r.vehicle.photoCount, 14);
  assert.equal(r.history.length, 2);
  assert.equal(r.history[1].priceUsd, null);
  assert.equal(r.otherLots[0].outcome, 'Not Sold');
  assert.equal(JSON.stringify(r).includes('img.example'), false, 'adresy zdjęć nie są zapisywane ani zwracane');
});

test('Apibara: 404 i pusty rekord → empty (0 rekordów)', async () => {
  assert.equal((await run(async () => res(404, { ok: false }))).state, 'empty');
  assert.equal((await run(async () => res(200, { data: {} }))).state, 'empty');
});

test('Apibara: 429 → quota; 401/403/500/zły format/timeout → error; brak klucza → unconfigured bez zapytania', async () => {
  assert.equal((await run(async () => res(429, {}))).state, 'quota');
  assert.deepEqual([(await run(async () => res(401, {}))).reason, (await run(async () => res(403, {}))).reason, (await run(async () => res(500, {}))).reason], ['auth', 'auth', 'http-500']);
  assert.equal((await run(async () => ({ ok: true, status: 200, json: async () => { throw new Error('x'); } }))).reason, 'format');
  assert.equal((await run(async () => { throw new Error('boom'); })).reason, 'timeout');
  let called = false;
  const u = await fetchAuctionData(VIN, { apiKey: '', fetchImpl: async () => { called = true; return res(200, {}); } });
  assert.equal(u.state, 'unconfigured'); assert.equal(called, false);
});

test('Apibara: cache — kiedy ponawiać pobranie', () => {
  const now = Date.parse('2026-10-29T10:00:00Z');
  const at = ms => new Date(now - ms).toISOString();
  assert.equal(needsRefresh(null, now), true);
  assert.equal(needsRefresh({ state: 'ok', fetchedAt: at(60_000) }, now), false);
  assert.equal(needsRefresh({ state: 'empty', fetchedAt: at(RESULTS_TTL_MS + 1000) }, now), true);
  assert.equal(needsRefresh({ state: 'quota', fetchedAt: at(60_000) }, now), false);
  assert.equal(needsRefresh({ state: 'error', fetchedAt: at(RETRY_ERROR_AFTER_MS + 1000) }, now), true);
  assert.equal(needsRefresh({ state: 'ok', fetchedAt: 'zly' }, now), true);
});

test('lotUrl: tylko Copart z poprawnym numerem', () => {
  assert.equal(lotUrl('copart', '51015256'), 'https://www.copart.com/lot/51015256');
  assert.equal(lotUrl('iaai', '51015256'), null);
  assert.equal(lotUrl('copart', '../x'), null);
});
