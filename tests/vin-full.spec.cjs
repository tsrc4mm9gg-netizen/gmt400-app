// Pełny dekoder VIN GMT400: wszystkie pozycje ze źródłami, vPIC na żądanie (mock), linki do historii, wypełnienie Mój samochód.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
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
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCEK19R9VE112233');
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(d.getByTestId('vin-check')).toContainText('się zgadza');
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
  await hist.locator('summary').click(); // sekcja zwinięta domyślnie
  await expect(hist.getByRole('link', { name: /Google Grafika/ })).toHaveAttribute('href', /tbm=isch.*1GCEK19R9VE112233/);
  for (const a of await hist.locator('a[target="_blank"]').all()) await expect(a).toHaveAttribute('rel', /noopener/);
  await expect(hist.locator('img')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('VIN: nieznany kod pokazuje „nieznane – sprawdź”', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/?tab=vin');
  await expect(page).toHaveURL(/\/vin$/); // stary link przekierowuje
  const d = page.getByTestId('vin-decoder');
  await d.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GNFK16R7VJ345678');
  await d.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(d.getByTestId('vin-pos-11')).toContainText('nieznane – sprawdź');
  await expect(d.getByTestId('vin-pos-7')).toContainText('Suburban');
  expect(errors).toEqual([]);
});

test('Mój samochód: VIN wypełnia markę, nadwozie, model, napęd, rocznik i silnik', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/moj-samochod');
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
  await page.getByRole('textbox', { name: 'Numer VIN do dekodowania' }).fill('1GCHK29F8YF12');
  await page.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(page.getByTestId('vin-errors')).toContainText('17 znaków');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('VIN łatwo znaleźć: wejście na stronie głównej i w menu', async ({ page }) => {
  const { errors } = await guard(page);
  await page.goto(BASE + '/');
  const cta = page.getByTestId('home-vin-cta');
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  await cta.click();
  await expect(page).toHaveURL(/\/vin$/);
  const nav = page.getByRole('navigation', { name: 'Nawigacja główna' });
  await expect(nav.getByRole('link', { name: 'Sprawdź VIN', exact: true })).toHaveAttribute('aria-current', 'page');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});
