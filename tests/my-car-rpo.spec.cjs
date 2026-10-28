// Kluczowe ścieżki: Mój samochód (VIN, formularz, plakietka, zapomnij), dekoder RPO, bezpieczniki.
// Uruchamiane przez playwright.ux.config.cjs (Chromium + WebKit, 390 i 1280) oraz dodatkowo 768 px.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-ux.json');

async function guard(page) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text()) && !benign(message.text())) errors.push('console: ' + message.text()); });
  await page.context().route(url => url.pathname.startsWith('/api/notion'), route => route.fulfill({ path: FIXTURE, contentType: 'application/json' }));
  return errors;
}
const noHorizontalScroll = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

test('Mój samochód: formularz → podsumowanie, plakietka, odświeżenie, zapomnij', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  const form = page.getByRole('form', { name: 'Dane auta' });
  await hydrated(form.getByRole('button', { name: 'Zapisz moje auto' }));
  await form.getByLabel('Marka').selectOption('Chevrolet');
  await form.getByLabel('Nadwozie').selectOption({ index: 1 });
  await form.getByLabel('Model').selectOption('K1500');
  await form.getByLabel('Rocznik').selectOption('1997');
  await form.getByRole('button', { name: 'Zapisz moje auto' }).click();
  await expect(page.getByTestId('my-car-summary')).toContainText('K1500');
  await expect(page.getByTestId('header-car-badge')).toContainText('K1500 · 1997');
  await expect(page.getByTestId('my-car-rpo-link')).toHaveAttribute('href', '/narzedzia/rpo');
  await expect(page.getByTestId('my-car-fuses')).toHaveCount(1);
  await noHorizontalScroll(page);
  await page.reload();
  await expect(page.getByTestId('my-car-summary')).toContainText('K1500');
  await page.getByRole('button', { name: 'Zapomnij auto' }).click();
  await page.getByRole('button', { name: 'Tak, zapomnij' }).click();
  await expect(page.getByRole('form', { name: 'Dane auta' })).toBeVisible();
  await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', 'empty');
  expect(errors).toEqual([]);
});

test('Mój samochód: VIN podpowiada rocznik', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  await hydrated(page.getByRole('button', { name: 'DEKODUJ VIN' }));
  await page.getByLabel('Numer VIN do dekodowania').fill('1GCEK19R0VE000000');
  await page.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(page.getByTestId('vin-year')).toContainText('1997');
  await expect(page.getByTestId('my-car-vin-note')).toContainText('1997');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('dekoder RPO: kilka kodów naraz, nieznany kod i oryginał GM', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  await page.getByLabel('Kody RPO lub szukana fraza').fill('Z71 G80 ZY2 QQ9');
  await page.getByRole('button', { name: 'Sprawdź kody' }).click();
  await expect(page.locator('[data-testid=rpo-result][data-code=Z71]')).toBeVisible();
  await expect(page.locator('[data-testid=rpo-result][data-code=G80]')).toBeVisible();
  const zy2 = page.locator('[data-testid=rpo-result][data-code=ZY2]');
  await expect(zy2).toContainText('Kombinacja kolorów: dwukolorowy');
  await expect(zy2).toContainText('Color combination, two tone');
  await expect(page.getByTestId('rpo-unknown')).toContainText('nieznany – sprawdź');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('bezpieczniki: wyszukiwanie w tabeli', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/schematy');
  const table = page.getByTestId('fuse-table').first();
  await expect(table).toBeVisible();
  const count = table.getByTestId('fuse-count');
  const before = await count.innerText();
  await hydrated(table.getByLabel('Szukaj w tabeli bezpieczników'));
  await table.getByLabel('Szukaj w tabeli bezpieczników').fill('radio');
  await expect(count).not.toHaveText(before);
  await expect(count).not.toHaveText('Wyniki: 0');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

for (const pathName of ['/', '/moj-samochod', '/narzedzia', '/narzedzia/rpo', '/schematy']) {
  test('768 px bez poziomego przewijania: ' + pathName, async ({ page }) => {
    await guard(page);
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE + pathName);
    await page.waitForLoadState('networkidle');
    await noHorizontalScroll(page);
  });
}
