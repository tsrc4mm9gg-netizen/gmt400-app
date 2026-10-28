// Odczyt kodów RPO ze zdjęcia naklejki SPID (OCR w przeglądarce) + kafelki „Zawiera”.
// Fixture: tests/fixtures/spid/spid-clean.jpg — syntetyczna naklejka wygenerowana skryptem (make-spid.py), znane kody w spid-expected.json.
// OCR (tesseract.js, WASM) działa naprawdę — test sprawdza tylko kody, które odczytuje stabilnie, i działanie edycji.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-ux.json');
const STICKER = path.join(__dirname, 'fixtures', 'spid', 'spid-clean.jpg');

async function guard(page) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message) || /^(console: )?Estimating resolution as \d+/.test(message); // komunikat Tesseract (stderr), nie błąd aplikacji
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text()) && !benign(message.text())) errors.push('console: ' + message.text()); });
  await page.context().route(url => url.pathname.startsWith('/api/notion'), route => route.fulfill({ path: FIXTURE, contentType: 'application/json' }));
  return errors;
}
const noHorizontalScroll = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

test('Skan naklejki: pola wyboru zdjęcia, prywatność, brak wysyłki zdjęcia na serwer', async ({ page }) => {
  const errors = await guard(page);
  const uploads = [];
  page.on('request', request => { if (request.method() !== 'GET' && request.method() !== 'HEAD' && request.postData() && request.postData().length > 20000) uploads.push(request.url()); });
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  const camera = page.getByTestId('rpo-scan-camera');
  await expect(camera).toHaveAttribute('accept', 'image/*');
  await expect(camera).toHaveAttribute('capture', 'environment');
  await expect(page.getByTestId('rpo-scan-file')).toHaveAttribute('accept', 'image/*');
  await expect(page.getByTestId('rpo-scan-file')).not.toHaveAttribute('capture', /.*/);
  await expect(page.getByText('Zrób zdjęcie naklejki', { exact: true })).toBeVisible();
  await expect(page.getByTestId('rpo-scan-privacy')).toContainText('Zdjęcie jest przetwarzane tylko w Twojej przeglądarce');
  await noHorizontalScroll(page);
  expect(uploads).toEqual([]);
  expect(errors).toEqual([]);
});

test('Skan naklejki: odczyt, edycja chipów, „brak w bazie”, VIN, „Pokaż opisy” i kafelek Zawiera', async ({ page }, testInfo) => {
  test.setTimeout(180000);
  const errors = await guard(page);
  const uploads = [];
  page.on('request', request => { if (request.method() !== 'GET' && request.method() !== 'HEAD' && request.postData() && request.postData().length > 20000) uploads.push(request.url()); });
  const ocrAssets = [];
  page.on('response', response => { if (response.url().includes('/ocr/')) ocrAssets.push(response.status()); });
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  await hydrated(page.getByTestId('rpo-scan-file'));
  await page.getByTestId('rpo-scan-file').setInputFiles(STICKER);
  await expect(page.getByTestId('rpo-scan-review')).toBeVisible({ timeout: 150000 });
  expect(ocrAssets.length).toBeGreaterThan(0);
  expect(ocrAssets.every(status => status === 200 || status === 206 || status === 304)).toBe(true);

  const chips = page.getByTestId('rpo-scan-chip');
  // Kody odczytywane stabilnie na czystym zdjęciu: YE9 (pakiet), G80, L31, M30, V22
  for (const code of ['YE9', 'G80', 'L31', 'M30', 'V22']) await expect(chips.and(page.locator(`[data-code="${code}"]`))).toHaveCount(1);
  await expect(page.getByTestId('rpo-scan-summary')).toContainText('Odczytano kodów');

  // Edycja: usunięcie kodu i dopisanie własnego (QQ7 — nie ma go w bazie, KC4 — jest)
  const removable = 'M30';
  const countBefore = await chips.count();
  await page.getByRole('button', { name: `Usuń kod ${removable}` }).click();
  await expect(chips).toHaveCount(countBefore - 1);
  await page.getByTestId('rpo-scan-add').fill('qq7');
  await page.getByTestId('rpo-scan-add-btn').click();
  await expect(chips.and(page.locator('[data-code="QQ7"]'))).toHaveAttribute('data-known', '0');
  await expect(page.getByTestId('rpo-scan-chips')).toContainText('brak w bazie');
  await page.getByTestId('rpo-scan-add').fill('ab');
  await page.getByTestId('rpo-scan-add-btn').click();
  await expect(page.getByText('dokładnie 3 znaki')).toBeVisible();
  await noHorizontalScroll(page);
  await page.screenshot({ path: testInfo.outputPath('scan-review.png'), fullPage: false });

  // VIN z naklejki (jeśli OCR odczytał go poprawnie — ten egzemplarz jest czysty): link do dekodera
  const vin = page.getByTestId('rpo-scan-vin');
  if (await vin.count()) {
    await expect(vin).toContainText('1GCEK14K7TZ123456');
    await expect(vin.getByRole('link', { name: 'Otwórz dekoder VIN' })).toHaveAttribute('href', '/vin?vin=1GCEK14K7TZ123456');
  }

  await page.getByTestId('rpo-scan-show').click();
  const results = page.getByTestId('rpo-scan-results');
  await expect(results).toBeVisible();
  await expect(results.getByTestId('rpo-result').and(results.locator('[data-code="YE9"]'))).toHaveCount(1);
  await expect(results.getByTestId('rpo-scan-unknown')).toContainText('QQ7');
  await expect(results.getByTestId('rpo-scan-unknown-code')).toContainText(['QQ7']);

  // Kafelek „Zawiera” dla YE9: zwinięty → rozwinięty (aria-expanded), źródło i uwaga
  const ye9 = results.locator('[data-testid="rpo-result"][data-code="YE9"]');
  const tile = ye9.getByTestId('rpo-contents');
  await expect(tile).toBeVisible();
  await expect(tile).toHaveAttribute('data-state', 'closed');
  await expect(tile.getByTestId('rpo-contents-note')).toContainText(/zawartość według GM dla modelu i rocznika – sprawdź w swoim aucie/i);
  const toggle = tile.getByTestId('rpo-contents-toggle');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const before = await tile.locator('li').count();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(tile).toHaveAttribute('data-state', 'open');
  expect(await tile.locator('li').count()).toBeGreaterThan(before);
  await expect(tile.getByText('Źródło:').first()).toBeVisible();
  await tile.scrollIntoViewIfNeeded();
  await noHorizontalScroll(page);
  await page.screenshot({ path: testInfo.outputPath('scan-results-open.png'), fullPage: false });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');

  expect(uploads).toEqual([]);
  expect(errors).toEqual([]);
});

test('Kody wpisane ręcznie: Zawiera dla pakietu z opisem i jawny brak opisu dla pakietu bez opisu', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  await page.getByLabel('Kody RPO lub szukana fraza').fill('YE9 Y91 G80');
  await page.getByRole('button', { name: 'Sprawdź kody' }).click();
  const ye9 = page.locator('[data-testid="rpo-result"][data-code="YE9"]');
  await expect(ye9.getByTestId('rpo-contents')).toHaveAttribute('data-state', /closed|open/);
  const y91 = page.locator('[data-testid="rpo-result"][data-code="Y91"]');
  await expect(y91.getByTestId('rpo-contents')).toHaveAttribute('data-state', 'missing');
  await expect(y91.getByTestId('rpo-contents')).toContainText('brak opisu zawartości w dokumentach');
  // kod spoza kategorii „Pakiety” bez opisu nie dostaje kafelka
  await expect(page.locator('[data-testid="rpo-result"][data-code="G80"]').getByTestId('rpo-contents')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});
