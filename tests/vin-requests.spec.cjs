// Historia VIN z zatwierdzaniem: API „fail closed” bez konfiguracji, panel admina (noindex, logowanie), widoki wyników Apibara (0 rekordów, limit, błąd), /vin bez zmian.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const VIN = '1GNEK13R4XJ445157';
const post = (page, url, data, extra = {}) => page.request.post(BASE + url, { data, headers: { Origin: new URL(BASE).origin, ...extra } });

test('API prośb: serwer bez konfiguracji odmawia (503), złe żądania odrzuca, nic nie ujawnia', async ({ page }) => {
  const r = await post(page, '/api/vin-requests', { vin: VIN });
  // Bez NOTION_VIN_REQUESTS_DB → 503 „unconfigured”; ze skonfigurowanym magazynem (lokalny e2e) → 201. Ważne: nigdy nie 200 z wynikami.
  expect([201, 503, 502]).toContain(r.status());
  const body = await r.json();
  expect(JSON.stringify(body)).not.toMatch(/results|auction|apibara/i);
  expect(r.headers()['x-robots-tag']).toContain('noindex');
  expect(r.headers()['cache-control']).toContain('no-store');
  // Cross-origin / zły typ treści.
  const bad = await page.request.post(BASE + '/api/vin-requests', { data: { vin: VIN }, headers: { Origin: 'https://evil.example' } });
  expect(bad.status()).toBe(400);
  const status = await post(page, '/api/vin-requests/status', { code: 'za-krotki' });
  expect([400, 503]).toContain(status.status());
  const unknown = await post(page, '/api/vin-requests/status', { code: 'B'.repeat(22) });
  expect([404, 503, 502]).toContain(unknown.status());
  expect(JSON.stringify(await unknown.json())).not.toMatch(/results/);
});

test('API admina: bez sesji 401 (lub 503 bez konfiguracji), nigdy lista ani decyzja', async ({ page }) => {
  const list = await page.request.get(BASE + '/api/admin/vin-requests');
  expect([401, 503]).toContain(list.status());
  const decide = await post(page, '/api/admin/vin-requests', { id: 'HV-0A1B2C3D', status: 'approved' });
  expect([401, 503]).toContain(decide.status());
  const login = await post(page, '/api/admin/login', { password: 'zle-haslo-123' });
  expect([401, 503, 429]).toContain(login.status());
  expect(login.headers()['set-cookie'] || '').not.toContain('gmt400_admin=');
});

test('Panel /admin/historia-vin: noindex, formularz logowania albo komunikat o braku konfiguracji; robots blokuje /admin/ i /api/', async ({ page }) => {
  const res = await page.goto(BASE + '/admin/historia-vin');
  expect(res.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  await expect(page.getByRole('heading', { level: 1, name: 'Prośby o historię VIN' })).toBeVisible();
  await expect(page.getByTestId('admin-unconfigured').or(page.getByTestId('admin-login'))).toBeVisible();
  await expect(page.getByTestId('admin-panel')).toHaveCount(0);
  await expect(page.getByTestId('admin-request')).toHaveCount(0);
  const robots = await (await page.request.get(BASE + '/robots.txt')).text();
  expect(robots).toMatch(/Disallow: \/admin\//);
  expect(robots).toMatch(/Disallow: \/api\//);
});

test('Wyniki Apibara w widoku zatwierdzonej prośby: 0 rekordów, limit, błąd — jasne komunikaty, bez zdjęć', async ({ page }) => {
  const { vinHistoryLinks } = await import('../src/lib/vin-decode.mjs');
  let auction = { state: 'empty', fetchedAt: '2026-10-29T10:00:00.000Z' };
  await page.context().route(u => u.pathname === '/api/vin-requests/status', r => r.fulfill({ json: { id: 'HV-0A1B2C3D', vin: VIN, status: 'approved', createdAt: '2026-10-29T09:00:00.000Z', results: { auction, links: vinHistoryLinks(VIN), counts: { nhtsaRecalls: null, nhtsaComplaints: null }, notes: {}, scope: null, fetchedAt: null } } }));
  await page.addInitScript(([vin]) => localStorage.setItem('gmt400_vin_request', JSON.stringify({ code: 'C'.repeat(22), id: 'HV-0A1B2C3D', vin, createdAt: '2026-10-29T09:00:00.000Z' })), [VIN]);
  await page.goto(BASE + '/narzedzia/historia-vin');
  const box = page.getByTestId('history-vin-auction');
  await expect(box).toHaveAttribute('data-state', 'empty');
  await expect(page.getByTestId('history-vin-auction-zero')).toHaveText('Znaleziono 0 rekordów aukcyjnych dla tego VIN.');
  await expect(box).toContainText('nie dowodzi');
  await expect(box.getByTestId('history-vin-auction-attribution')).toContainText('Apibara.tech');
  await expect(page.getByTestId('vin-history')).toBeVisible(); // linki + liczniki NHTSA nadal są
  for (const [state, text] of [['quota', 'Wyczerpano limit'], ['error', 'Nie udało się pobrać'], ['unconfigured', 'nie jest jeszcze podłączone']]) {
    auction = { state, fetchedAt: '2026-10-29T10:00:00.000Z' };
    await page.reload();
    await expect(box).toHaveAttribute('data-state', state);
    await expect(box).toContainText(text);
  }
  await expect(page.locator('main img')).toHaveCount(0);
});

test('/vin bez zmian: dekoder nadal pokazuje linki historii i liczniki bez zatwierdzania', async ({ page }) => {
  await page.context().route(u => u.pathname === '/api/vin-hits', r => r.fulfill({ json: { counts: { nhtsaRecalls: 1, nhtsaComplaints: 2 }, notes: {}, scope: { make: 'Chevrolet', year: '1999', platform: 'Tahoe', nhtsaModels: ['Tahoe'] } } }));
  await page.context().route(u => u.pathname === '/api/vin-requests' || u.pathname === '/api/vin-requests/status', r => { throw new Error('/vin nie może używać prośb'); });
  await page.goto(BASE + '/vin');
  const d = page.getByTestId('vin-decoder');
  await hydrated(d.getByRole('button', { name: 'DEKODUJ VIN' }));
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill(VIN);
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  const hist = d.getByTestId('vin-history');
  await hist.locator('summary').first().click();
  await expect(hist.getByTestId('vin-hit-nhtsa-recalls')).toHaveText('1');
  await expect(hist.getByTestId('vin-hit-nhtsa-complaints')).toHaveText('2');
});
