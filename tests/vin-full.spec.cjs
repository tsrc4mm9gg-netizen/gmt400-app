// Pełny dekoder VIN GMT400: wszystkie pozycje ze źródłami, vPIC na żądanie (mock), linki do historii, wypełnienie Mój samochód.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-ux.json');
const VPIC = { data: { Make: 'CHEVROLET', Model: 'C/K Pickup 1500', ModelYear: '1997', Series: '1/2 ton', BodyClass: 'Pickup', DriveType: '4WD/4-Wheel Drive/4x4', DisplacementL: '5.7', EngineCylinders: '8', FuelTypePrimary: 'Gasoline', PlantCity: 'PONTIAC', PlantState: 'MICHIGAN', PlantCountry: 'UNITED STATES (USA)', ErrorText: '0 - VIN decoded clean. Check Digit (9th position) is correct' }, source: 'NHTSA vPIC', fetchedAt: '2026-10-23T18:00:00.000Z' };

async function guard(page) {
  const errors = [];
  const benign = m => /[?&]_rsc=.*access control checks/.test(m);
  page.on('pageerror', e => { if (!benign(e.message)) errors.push('pageerror: ' + e.message); });
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text()) && !benign(m.text())) errors.push('console: ' + m.text()); });
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ path: FIXTURE, contentType: 'application/json' }));
  const posted = [];
  await page.context().route(u => u.pathname === '/api/official-vehicle', async r => { posted.push(r.request().postDataJSON()); await r.fulfill({ json: VPIC }); });
  return { errors, posted };
}
const noHorizontalScroll = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

test('VIN: wszystkie pozycje, źródła, vPIC po kliknięciu i linki historii', async ({ page }) => {
  const { errors, posted } = await guard(page);
  await page.goto(BASE + '/vin');
  const d = page.getByTestId('vin-decoder');
  // Na wolnym runnerze (WebKit) formularz bywa klikany, zanim React zhydratuje stronę — wtedy kliknięcie nic nie robi.
  // Powtarzamy wpisanie i kliknięcie aż dekoder zareaguje (operacja jest idempotentna, nic nie jest wysyłane).
  await expect(async () => {
    await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCEK19R9VE112233');
    await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
    await expect(d.getByTestId('vin-check')).toContainText('się zgadza', { timeout: 3000 });
  }).toPass({ timeout: 30000 });
  // Podsumowanie na górze, szczegóły zwinięte
  const sum = d.getByTestId('vin-summary');
  await expect(sum).toContainText('1997');
  await expect(sum).toContainText('K1500');
  await expect(sum).toContainText('RPO L31');
  await expect(sum).toContainText('Pontiac');
  await expect(sum).toContainText('kabina przedłużona'); // poz. 6 = 9 (1996–97)
  await expect(d.getByTestId('vin-fields')).toBeHidden();
  await d.getByTestId('vin-positions').locator('summary').click();
  const rows = d.getByTestId('vin-fields').locator('li');
  await expect(rows).toHaveCount(12);
  for (let i = 0; i < 12; i++) await expect(rows.nth(i).locator('a[href^="https://"]').first()).toBeVisible();
  await expect(d.getByTestId('vin-pos-4')).toContainText('2722–3175 kg (6001–7000 lb)');
  await expect(d.getByTestId('vin-pos-4')).toContainText('źródło wtórne');
  await expect(d.getByTestId('vin-engine')).toContainText('RPO L31');
  await expect(d.getByTestId('vin-pos-11')).toContainText('Pontiac');
  expect(posted).toHaveLength(0); // nic nie wysyłamy bez kliknięcia
  await d.getByTestId('vin-vpic').locator('summary').click();
  const reqP = page.waitForRequest(r => new URL(r.url()).pathname === '/api/official-vehicle' && r.method() === 'POST');
  await d.getByTestId('vin-vpic-fetch').click();
  const req = await reqP;
  expect(JSON.parse(req.postData() || '{}')).toEqual({ action: 'vin', vin: '1GCEK19R9VE112233', year: 1997 });
  await expect(d.getByTestId('vin-vpic-data')).toContainText('PONTIAC');
  await expect(d.getByTestId('vin-vpic-data')).toContainText('5.7');
  const hist = d.getByTestId('vin-history');
  await hist.locator('summary').first().click(); // sekcja zwinięta domyślnie
  await expect(hist.getByRole('link', { name: /Google Grafika/ })).toHaveAttribute('href', /tbm=isch.*1GCEK19R9VE112233/);
  for (const a of await hist.locator('a[target="_blank"]').all()) await expect(a).toHaveAttribute('rel', /noopener/);
  await expect(hist.locator('img')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('VIN: liczniki przed linkami historii — tylko po otwarciu, 0 przygaszone, brak danych ≠ 0', async ({ page }) => {
  const { errors } = await guard(page);
  const hits = [];
  await page.context().route(u => u.pathname === '/api/vin-hits', async r => { hits.push(r.request().postDataJSON()); await new Promise(res => setTimeout(res, 300)); await r.fulfill({ json: { counts: { nhtsaRecalls: 2, nhtsaComplaints: 0 }, notes: {}, scope: { make: 'Chevrolet', year: '1995', platform: 'C/K', nhtsaModels: ['C/K', 'K1500'] } } }); });
  await page.goto(BASE + '/vin');
  const d = page.getByTestId('vin-decoder');
  await hydrated(d.getByRole('button', { name: 'DEKODUJ VIN' }));
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCEK14K6SZ199684');
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  const hist = d.getByTestId('vin-history');
  await expect(hist).toBeVisible();
  expect(hits).toHaveLength(0); // nic nie wysyłamy, dopóki sekcja zwinięta
  await hist.locator('summary').first().click();
  await expect(hist.getByTestId('vin-hit-nhtsa-recalls')).toHaveText('2');
  expect(hits).toEqual([{ vin: '1GCEK14K6SZ199684' }]);
  await expect(hist.getByTestId('vin-hit-nhtsa-complaints')).toHaveText('0');
  await expect(hist.getByTestId('vin-hit-google')).toHaveText(/sprawdź/i);
  await expect(hist.getByTestId('vin-hit-bidfax')).toHaveText(/sprawdź/i);
  const items = hist.getByTestId('vin-history-list').locator('li');
  await expect(items.first()).toContainText('akcje serwisowe');
  await expect(items.last()).toContainText('skargi'); // zera na końcu
  await expect(items.last()).toHaveClass(/opacity-60/);
  await expect(hist.getByTestId('vin-hits-scope')).toContainText('C/K, K1500');
  await expect(hist.getByRole('link', { name: /cararam\.com/ })).toHaveAttribute('href', 'https://cararam.com/en/vin/1GCEK14K6SZ199684');
  const heights = await items.evaluateAll(els => els.map(e => e.getBoundingClientRect().height));
  expect(Math.max(...heights)).toBeLessThan(90);
  await expect(hist.locator('img')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('VIN: błąd liczników pokazuje „?”, nigdy 0', async ({ page }) => {
  const { errors } = await guard(page);
  await page.context().route(u => u.pathname === '/api/vin-hits', r => r.fulfill({ status: 503, json: { error: 'x' } }));
  await page.goto(BASE + '/vin');
  const d = page.getByTestId('vin-decoder');
  await hydrated(d.getByRole('button', { name: 'DEKODUJ VIN' }));
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCEK14K6SZ199684');
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  const hist = d.getByTestId('vin-history');
  await hist.locator('summary').first().click();
  await expect(hist.getByRole('status')).toContainText('nie znaczy, że wyników nie ma');
  await expect(hist.getByTestId('vin-hit-nhtsa-recalls')).toHaveText('?');
  await expect(hist.getByTestId('vin-hit-nhtsa-complaints')).toHaveText('?');
  expect(errors).toEqual([]);
});

test('Historia VIN: walidacja, prośba → oczekiwanie → zatwierdzenie → wyniki (linki, liczniki, dane aukcyjne), bez obrazków', async ({ page }) => {
  const { errors } = await guard(page);
  const { vinHistoryLinks } = await import('../src/lib/vin-decode.mjs');
  const VIN = '1GCEK14K6SZ199684';
  const created = []; let approved = false; const statusBodies = [];
  const CODE = 'A'.repeat(22);
  await page.context().route(u => u.pathname === '/api/vin-requests', async r => { created.push(r.request().postDataJSON()); await r.fulfill({ status: 201, json: { code: CODE, id: 'HV-0A1B2C3D', vin: VIN, status: 'pending', createdAt: '2026-10-29T09:00:00.000Z' } }); });
  await page.context().route(u => u.pathname === '/api/vin-requests/status', async r => {
    statusBodies.push(r.request().postDataJSON());
    const base = { id: 'HV-0A1B2C3D', vin: VIN, createdAt: '2026-10-29T09:00:00.000Z' };
    if (!approved) return r.fulfill({ json: { ...base, status: 'pending' } });
    await r.fulfill({ json: { ...base, status: 'approved', results: {
      links: vinHistoryLinks(VIN), counts: { nhtsaRecalls: 0, nhtsaComplaints: 12 }, notes: {}, scope: { make: 'Chevrolet', year: '1995', platform: 'C/K', nhtsaModels: ['C/K'] }, fetchedAt: '2026-10-29T10:00:00.000Z',
      auction: { state: 'ok', fetchedAt: '2026-10-29T10:00:00.000Z',
        vehicle: { platform: 'copart', lot: '12345678', title: '1995 CHEVROLET K1500', year: 1995, make: 'CHEVROLET', model: 'K1500', damage: 'Front end', lossType: null, run: null, odometerMi: null, odometerKm: 250000, outcome: 'Sold', auctionAt: '2026-05-01', state: null, priceUsd: { sale: 1200, lastSold: null, currentBid: null, buyNow: null, estimatedRetail: null }, photoCount: 14 },
        history: [{ platform: 'copart', lot: '12345678', date: '2026-05-01', priceUsd: 1200, status: 'Sold' }], otherLots: [] } } } });
  });
  await page.goto(BASE + '/narzedzia/historia-vin');
  await expect(page.getByRole('heading', { level: 1, name: 'Historia VIN' })).toBeVisible();
  const input = page.getByLabel('Numer VIN pojazdu', { exact: true });
  const go = page.getByRole('button', { name: 'SPRAWDŹ HISTORIĘ' });
  await hydrated(go);
  await input.fill('1GCEK14K6SZ1996');
  await go.click();
  await expect(page.getByTestId('history-vin-errors')).toContainText('17 znaków');
  await input.fill('1GCEK14K7SZ199684'); // zła cyfra kontrolna
  await go.click();
  await expect(page.getByTestId('history-vin-errors')).toContainText('Cyfra kontrolna');
  await expect(page.getByTestId('history-vin-errors')).toContainText('6');
  expect(created).toHaveLength(0); // niepoprawny VIN nie tworzy prośby
  await input.fill(VIN);
  await go.click();
  // Wynik NIE jest widoczny przed zatwierdzeniem.
  await expect(page.getByTestId('history-vin-pending')).toHaveText('Prośba wysłana — czekaj na zatwierdzenie administratora.');
  expect(created).toEqual([{ vin: VIN }]);
  await expect(page.getByTestId('vin-history')).toHaveCount(0);
  await expect(page.getByTestId('history-vin-auction')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('gmt400_vin_request') || '{}').code)).toBe(CODE);
  // Po przeładowaniu prośba jest odtwarzana z localStorage i nadal czeka.
  await page.reload();
  await expect(page.getByTestId('history-vin-pending')).toBeVisible();
  await expect(page.getByTestId('vin-history')).toHaveCount(0);
  expect(statusBodies.every(b => b.code === CODE)).toBe(true);
  approved = true;
  await page.getByRole('button', { name: 'Odśwież status' }).click();
  await expect(page.getByTestId('history-vin-approved')).toBeVisible();
  const auction = page.getByTestId('history-vin-auction');
  await expect(auction.getByTestId('history-vin-auction-count')).toContainText('Znaleziono 2 rekordów');
  await expect(auction).toContainText('Front end');
  await expect(auction).toContainText('Cena sprzedaży: 1200 USD');
  await expect(auction).toContainText('250 000 km');
  await expect(auction.getByTestId('history-vin-auction-photos')).toContainText('Źródło ma 14 zdjęć');
  await expect(auction.getByTestId('history-vin-auction-attribution')).toContainText('Auction data: Apibara.tech');
  await expect(auction.getByRole('link', { name: /Copart · lot 12345678/ }).first()).toHaveAttribute('href', 'https://www.copart.com/lot/12345678');
  const hist = page.getByTestId('vin-history');
  await expect(hist.getByTestId('vin-hit-nhtsa-complaints')).toHaveText('12');
  await expect(hist.getByTestId('vin-hit-nhtsa-recalls')).toHaveText('0');
  const items = hist.getByTestId('vin-history-list').locator('li');
  await expect(items.first()).toContainText('skargi');
  await expect(items.last()).toHaveClass(/opacity-60/);
  await expect(hist.getByTestId('vin-hit-cararam')).toHaveText(/sprawdź/i);
  await expect(hist.getByText('Dlaczego przy części linków nie ma liczby?')).toBeVisible();
  await expect(page.getByTestId('history-vin-summary')).toContainText('1995 Chevrolet K1500');
  await expect(hist.getByRole('link', { name: /pełne dekodowanie/ })).toHaveAttribute('href', '/vin');
  await expect(page.locator('main img, [data-testid="vin-history"] img, [data-testid="history-vin-auction"] img')).toHaveCount(0);
  for (const a of await page.locator('main a[target="_blank"]').all()) await expect(a).toHaveAttribute('rel', /noopener/);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('Narzędzia: karta Historia VIN prowadzi do strony historii', async ({ page }) => {
  await page.goto(BASE + '/narzedzia');
  const card = page.locator('a[data-tool-card][href="/narzedzia/historia-vin"]');
  await expect(card).toContainText('Historia VIN');
  await card.click();
  await expect(page).toHaveURL(/\/narzedzia\/historia-vin\/?$/);
  await expect(page.getByLabel('Numer VIN pojazdu', { exact: true })).toBeVisible();
});

test('VIN: nieznany kod pokazuje „nieznane – sprawdź”', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/?tab=vin');
  await expect(page).toHaveURL(/\/vin$/); // stary link przekierowuje
  const d = page.getByTestId('vin-decoder');
  await hydrated(d.getByRole('button', { name: 'DEKODUJ VIN' }));
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GNFK16R7VJ345678');
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(d.getByTestId('vin-pos-11')).toContainText('nieznane – sprawdź');
  await expect(d.getByTestId('vin-pos-7')).toContainText('Suburban');
  expect(errors).toEqual([]);
});

test('Mój samochód: VIN wypełnia markę, nadwozie, model, napęd, rocznik i silnik', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  await hydrated(page.getByRole('button', { name: 'DEKODUJ VIN', exact: true }));
  await page.locator('#vin-input').fill('1GCHK29F8YF123456');
  await page.getByRole('button', { name: 'DEKODUJ VIN', exact: true }).click();
  const form = page.getByRole('form', { name: 'Dane auta' });
  await expect(form.getByLabel('Marka')).toHaveValue('Chevrolet');
  await expect(form.getByLabel('Nadwozie')).toHaveValue('C/K');
  await expect(form.getByLabel('Model')).toHaveValue('K2500');
  await expect(form.getByLabel('Napęd')).toHaveValue('4WD');
  await expect(form.getByLabel('Rocznik')).toHaveValue('2000');
  await expect(form.getByLabel('Silnik (kod RPO)')).toHaveValue('L65');
  await expect(page.getByTestId('my-car-vin-note')).toContainText('model K2500');
  // Yukon 4-drzwiowy: kod nadwozia nie rozstrzyga modelu → wybór ręczny
  await page.locator('#vin-input').fill('1GKEK13R1XJ456789');
  await page.getByRole('button', { name: 'DEKODUJ VIN', exact: true }).click();
  await expect(form.getByLabel('Marka')).toHaveValue('GMC');
  await expect(page.getByTestId('my-car-vin-note')).toContainText('wybierz ręcznie');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('/vin: wklejanie, RPO od razu i zapis VIN + RPO w Mój samochód', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/vin');
  await expect(page.locator('h1')).toHaveText('Sprawdź swój VIN');
  const d = page.getByTestId('vin-decoder');
  await hydrated(d.getByRole('button', { name: 'DEKODUJ VIN' }));
  const input = d.getByRole('textbox', { name: 'Numer VIN do dekodowania' });
  await input.fill('1gchk29f8yf123456');
  await expect(input).toHaveValue('1GCHK29F8YF123456');
  await expect(d.getByTestId('vin-length')).toContainText('17 znaków');
  const btn = d.getByRole('button', { name: 'DEKODUJ VIN' });
  expect((await btn.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await btn.click();
  await expect(d.getByTestId('vin-summary')).toContainText('K2500');
  await d.locator('#vin-rpo-input').fill('g80 z71 xqz');
  const items = d.getByTestId('vin-rpo-item');
  await expect(items).toHaveCount(3);
  await expect(d.locator('[data-testid="vin-rpo-item"][data-code="G80"]')).toContainText('źródło');
  await expect(d.locator('[data-testid="vin-rpo-item"][data-code="XQZ"]')).toContainText('nieznany kod – sprawdź');
  await d.getByTestId('vin-save').click();
  await expect(d.getByTestId('vin-save-status')).toContainText('Zapisano');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('gmt400_vehicle_profile_v2') || 'null'));
  expect(stored.profile).toMatchObject({ vin: '1GCHK29F8YF123456', brand: 'Chevrolet', platform: 'C/K', model: 'K2500', year: '2000', rpoCodes: ['G80', 'XQZ', 'Z71'] });
  await d.getByTestId('vin-save-status').getByRole('link', { name: 'Otwórz Mój samochód' }).click();
  await expect(page).toHaveURL(/\/moj-samochod$/);
  await expect(page.getByTestId('header-car-badge')).toContainText('K2500');
  // Błędny VIN — prosty komunikat
  await page.goto(BASE + '/vin');
  await hydrated(page.getByRole('button', { name: 'DEKODUJ VIN' }));
  await page.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCHK29F8YF12');
  await page.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(page.getByTestId('vin-errors')).toContainText('17 znaków');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('VIN łatwo znaleźć: wejście na stronie głównej i w menu', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/');
  // skrót „Sprawdź VIN” tuż pod karuzelą jest nad zgięciem; pełny dekoder (pole + przycisk) leży niżej
  const cta = page.getByTestId('home-quick-vin');
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  if (page.viewportSize().width <= 500) expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height - 20);
  await expect(page.getByTestId('home-vin-cta')).toBeVisible();
  await hydrated(page.getByTestId('home-vin-cta'));
  await cta.click();
  await expect(page).toHaveURL(/\/vin$/);
  const nav = page.getByRole('navigation', { name: 'Nawigacja główna' });
  await expect(nav.getByRole('link', { name: 'Sprawdź VIN', exact: true })).toHaveAttribute('aria-current', 'page');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});
