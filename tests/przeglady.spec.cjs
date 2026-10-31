// Harmonogram przeglądów (/przeglady) i Poradnik kupującego (/poradnik-kupujacego):
// harmonogram z instrukcji GM dla aktywnego auta, stan zaległe/wkrótce/OK, „oznacz wykonane”, plik .ics,
// widok ogólny bez auta; lista kontrolna kupującego z odhaczaniem w localStorage i kafel na stronie głównej.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const KEY = 'gmt400_vehicle_profile_v2';
const CAR = { brand: 'Chevrolet', platform: 'C/K', model: 'K1500', year: '1997', engine: 'L31', drive: '4WD', transmission: '4L60E', rpoCodes: [] };

function watch(page) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  return errors;
}
const isoDaysAgo = days => { const d = new Date(Date.now() - days * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

test('przeglądy bez auta: zachęta do zapisu, widok ogólny ze źródłami', async ({ page }) => {
  const errors = watch(page);
  await page.goto(BASE + '/przeglady');
  await expect(page.getByRole('heading', { level: 1, name: 'Harmonogram przeglądów' })).toBeVisible();
  const noCar = page.getByTestId('przeglady-no-car');
  await expect(noCar).toBeVisible();
  await expect(noCar.getByRole('link', { name: /Zapisz/ })).toHaveAttribute('href', /\/moj-samochod/);
  await expect(page.getByTestId('przeglady-item').first()).toBeVisible();
  await expect(page.getByTestId('przeglady-sources')).toContainText('Owner');
  await expect(page.locator('main')).toContainText(/sprawdź w swoim aucie/i);
  await hydrated(noCar.getByRole('button', { name: '1995' }));
  await noCar.getByRole('button', { name: '1995' }).click();
  await expect(noCar.getByRole('button', { name: '1995' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('przeglady-item').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('przeglądy z autem: zaległe → oznacz wykonane → OK po odświeżeniu, plik .ics', async ({ page, browserName }) => {
  const errors = watch(page);
  await page.addInitScript(({ key, car }) => {
    if (sessionStorage.getItem('przeglady-seeded')) return;
    sessionStorage.setItem('przeglady-seeded', '1');
    localStorage.setItem(key, JSON.stringify({ version: 2, profile: car }));
  }, { key: KEY, car: CAR });
  await page.goto(BASE + '/przeglady');
  await expect(page.getByTestId('przeglady-car')).toContainText('1997');
  await hydrated(page.getByTestId('przeglady-odo'));
  await page.getByTestId('przeglady-last-km').fill('100000');
  await page.getByTestId('przeglady-last-date').fill(isoDaysAgo(60));
  await page.getByTestId('przeglady-odo').fill('120000');
  const oil = page.locator('[data-testid="przeglady-item"][data-id="olej"]');
  await expect(oil).toHaveAttribute('data-state', 'zalegle');
  await expect(oil.getByTestId('przeglady-state')).toHaveText(/zaległe/i);
  await expect(page.locator('[data-testid="przeglady-item"][data-id="lozyska"]')).toHaveCount(0); // 2WD-only pozycja ukryta w 4WD
  await expect(page.getByTestId('przeglady-summary')).toContainText('Zaległe:');
  await oil.getByTestId('przeglady-done').click();
  await expect(oil).toHaveAttribute('data-state', 'ok');
  await expect(page.getByTestId('przeglady-message')).toContainText('wykonane');
  const box = await oil.getByRole('button', { name: 'Cofnij' }).boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await page.getByRole('button', { name: 'Ciężkie warunki' }).click();
  await expect(page.getByRole('button', { name: 'Ciężkie warunki' })).toHaveAttribute('aria-pressed', 'true');
  // aktywny przełącznik i przycisk kalendarza: ciemny tekst na srebrnym tle (kontrast)
  for (const locator of [page.getByRole('button', { name: 'Ciężkie warunki' }), page.getByTestId('przeglady-ics')]) {
    const ratio = await locator.evaluate(el => {
      const lum = c => { const [r, g, b] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const s = getComputedStyle(el); const a = lum(s.color), b = lum(s.backgroundColor);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
  await page.reload();
  await expect(page.locator('[data-testid="przeglady-item"][data-id="olej"]')).toHaveAttribute('data-state', 'ok');
  await expect(page.getByTestId('przeglady-odo')).toHaveValue('120000');
  const stored = await page.evaluate(() => localStorage.getItem('gmt400_przeglady_v1'));
  expect(stored).toContain('"severe":true');

  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('przeglady-ics').click()]);
  expect(download.suggestedFilename()).toBe('gmt400-przeglady.ics');
  const fs = require('node:fs');
  const ics = fs.readFileSync(await download.path(), 'utf8');
  expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/);
  expect(ics).toContain('BEGIN:VEVENT');
  expect(ics).toContain('BEGIN:VALARM');
  expect(ics).not.toMatch(/[0-9A-HJ-NPR-Z]{17}/); // bez VIN
  expect(errors).toEqual([]);
  void browserName;
});

test('Moje auto prowadzi do harmonogramu, sw.js ma obie trasy', async ({ page, request }) => {
  await page.addInitScript(({ key, car }) => localStorage.setItem(key, JSON.stringify({ version: 2, profile: car })), { key: KEY, car: CAR });
  await page.goto(BASE + '/moj-samochod');
  await expect(page.getByRole('link', { name: 'Harmonogram przeglądów' }).first()).toHaveAttribute('href', '/przeglady');
  const sw = await (await request.get(BASE + '/sw.js')).text();
  expect(sw).toContain("'/przeglady'");
  expect(sw).toContain("'/poradnik-kupujacego'");
});

test('poradnik kupującego: kafel na home, odhaczanie zostaje po odświeżeniu, linki do VIN i importu', async ({ page }) => {
  const errors = watch(page);
  await page.goto(BASE + '/');
  const tile = page.getByTestId('home-buyer-guide');
  await expect(tile).toBeVisible();
  const carousel = await page.getByTestId('home-main-entries').boundingBox();
  const tileBox = await tile.boundingBox();
  expect(tileBox.y).toBeGreaterThan(carousel.y);
  expect(tileBox.height).toBeGreaterThanOrEqual(44);
  expect(tileBox.height).toBeLessThan(90);
  await expect(tile).toHaveAttribute('href', '/poradnik-kupujacego');
  await page.goto(BASE + '/poradnik-kupujacego');
  await expect(page.getByRole('heading', { level: 1, name: 'Poradnik kupującego' })).toBeVisible();
  for (const name of ['Rdza', 'Silnik', 'Skrzynia biegów', 'Napęd 4WD', 'Elektryka', 'VIN i dokumenty', 'Procedury i opłaty w Polsce']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  await expect(page.locator('img[src="/guide-rdza-schemat.svg"]')).toHaveCount(1);
  await expect(page.locator('img[src="/guide-rama-schemat.svg"]')).toHaveCount(1);
  await expect(page.locator('#vin').getByRole('link', { name: /Sprawdź VIN/ })).toHaveAttribute('href', '/vin');
  await expect(page.getByTestId('buyer-procedures').getByRole('link').first()).toHaveAttribute('href', '/dla-wlasciciela/import');
  await expect(page.locator('main')).toContainText(/sprawdź w swoim aucie/i);
  const first = page.getByTestId('buyer-item').first();
  await hydrated(first.getByTestId('buyer-check'));
  await expect(page.getByTestId('buyer-checklist')).toHaveAttribute('data-ready', '1');
  const label = await first.locator('label').boundingBox();
  expect(label.height).toBeGreaterThanOrEqual(44);
  await first.locator('label').click();
  await expect(first).toHaveAttribute('data-checked', '1');
  await expect(page.getByTestId('buyer-progress')).toContainText('Sprawdzone: 1');
  await page.reload();
  await expect(page.getByTestId('buyer-item').first()).toHaveAttribute('data-checked', '1');
  await page.getByTestId('buyer-reset').click();
  await expect(page.getByTestId('buyer-progress')).toContainText('Sprawdzone: 0');
  await page.locator('#rdza img').click();
  await expect(page.getByRole('dialog', { name: 'Powiększenie ilustracji' })).toBeVisible();
  await page.getByRole('button', { name: 'Zamknij powiększenie', exact: true }).click();
  expect(errors).toEqual([]);
});
