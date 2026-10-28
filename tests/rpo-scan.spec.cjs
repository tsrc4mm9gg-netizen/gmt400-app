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

test('Skan naklejki: ikony aparatu i zdjęcia w jednym rzędzie z polem kodów, prywatność, brak wysyłki zdjęcia na serwer', async ({ page }) => {
  const errors = await guard(page);
  const uploads = [];
  page.on('request', request => { if (request.method() !== 'GET' && request.method() !== 'HEAD' && request.postData() && request.postData().length > 20000) uploads.push(request.url()); });
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  const camera = page.getByTestId('rpo-scan-camera');
  await expect(camera).toHaveAttribute('accept', 'image/*');
  await expect(camera).toHaveAttribute('capture', 'environment');
  await expect(camera).toHaveAccessibleName('Zrób zdjęcie naklejki');
  await expect(page.getByTestId('rpo-scan-file')).toHaveAttribute('accept', 'image/*');
  await expect(page.getByTestId('rpo-scan-file')).not.toHaveAttribute('capture', /.*/);
  // brak osobnej sekcji skanu — przyciski są w tym samym rzędzie co pole, na tej samej wysokości
  await expect(page.getByTestId('rpo-scan')).toHaveCount(0);
  const row = page.getByTestId('rpo-input-row');
  await expect(row.locator('#rpo-query')).toBeVisible();
  const box = async locator => locator.boundingBox();
  const input = await box(row.locator('#rpo-query'));
  for (const id of ['rpo-scan-camera', 'rpo-scan-file']) {
    const btn = await box(page.getByTestId(id).locator('xpath=..'));
    expect(Math.abs(btn.y - input.y)).toBeLessThanOrEqual(2);
    expect(btn.width).toBeGreaterThanOrEqual(44);
    expect(btn.height).toBeGreaterThanOrEqual(44);
    expect(btn.x).toBeGreaterThan(input.x + input.width - 1);
  }
  await expect(page.getByTestId('rpo-scan-privacy')).toContainText('Zdjęcie jest przetwarzane tylko w Twojej przeglądarce');
  await noHorizontalScroll(page);
  expect(uploads).toEqual([]);
  expect(errors).toEqual([]);
});

test('Skan naklejki: odczyt do pola kodów, edycja chipów, „brak w bazie”, VIN i kafelek Zawiera', async ({ page }, testInfo) => {
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

  // Kody trafiły do tego samego pola i od razu do wyników (bez osobnej sekcji)
  const field = page.locator('#rpo-query');
  const chips = page.getByTestId('rpo-scan-chip');
  // Kody odczytywane stabilnie na czystym zdjęciu: YE9 (pakiet), G80, L31, M30, V22
  for (const code of ['YE9', 'G80', 'L31', 'M30', 'V22']) {
    await expect(chips.and(page.locator(`[data-code="${code}"]`))).toHaveCount(1);
    await expect(field).toHaveValue(new RegExp(`\\b${code}\\b`));
    await expect(page.locator(`[data-testid="rpo-results"] [data-testid="rpo-result"][data-code="${code}"]`)).toHaveCount(1);
  }
  await expect(page.getByTestId('rpo-scan-summary')).toContainText('odczytano kodów');
  await expect(page.getByTestId('rpo-scan-results')).toHaveCount(0);

  // Edycja pola: usunięcie chipa usuwa kod z pola i z wyników; dopisanie własnego kodu w polu (QQ7 — nie ma go w bazie)
  const removable = 'M30';
  const countBefore = await chips.count();
  await page.getByRole('button', { name: `Usuń kod ${removable}` }).click();
  await expect(chips).toHaveCount(countBefore - 1);
  await expect(field).not.toHaveValue(/M30/);
  await expect(page.locator('[data-testid="rpo-result"][data-code="M30"]')).toHaveCount(0);
  await field.fill((await field.inputValue()) + ' QQ7');
  await page.getByRole('button', { name: 'Sprawdź kody' }).click();
  await expect(chips.and(page.locator('[data-code="QQ7"]'))).toHaveAttribute('data-known', '0');
  await expect(page.getByTestId('rpo-scan-chips')).toContainText('brak w bazie');
  await expect(page.getByTestId('rpo-unknown').filter({ hasText: 'QQ7' })).toHaveCount(1);
  await noHorizontalScroll(page);
  await page.screenshot({ path: testInfo.outputPath('scan-review.png'), fullPage: false });

  // VIN z naklejki (jeśli OCR odczytał go poprawnie — ten egzemplarz jest czysty): link do dekodera
  const vin = page.getByTestId('rpo-scan-vin');
  if (await vin.count()) {
    await expect(vin).toContainText('1GCEK14K7TZ123456');
    await expect(vin.getByRole('link', { name: 'Otwórz dekoder VIN' })).toHaveAttribute('href', '/vin?vin=1GCEK14K7TZ123456');
  }

  // Kafelek „Zawiera” dla YE9: zwinięty → rozwinięty (aria-expanded); źródło dopiero po rozwinięciu
  const ye9 = page.locator('[data-testid="rpo-results"] [data-testid="rpo-result"][data-code="YE9"]');
  const tile = ye9.getByTestId('rpo-contents');
  await expect(tile).toBeVisible();
  await expect(tile).toHaveAttribute('data-state', 'closed');
  await expect(tile.getByText('Źródło:')).toHaveCount(0);
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

test('Kafelek kodu: domyślnie zwarty (kod, nazwa PL, nazwa GM, kategoria, Zawiera); model/lata, źródła i nota po rozwinięciu', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody' }));
  await page.getByLabel('Kody RPO lub szukana fraza').fill('YE9 G80 KL6');
  await page.getByRole('button', { name: 'Sprawdź kody' }).click();
  for (const code of ['YE9', 'G80', 'KL6']) {
    const card = page.locator(`[data-testid="rpo-result"][data-code="${code}"]`);
    await expect(card).toBeVisible();
    const more = card.getByTestId('rpo-more');
    await expect(more).not.toHaveAttribute('open', /.*/);
    // zwinięte meta nie jest widoczne
    await expect(card.getByTestId('rpo-applies')).toBeHidden();
    await expect(card.getByText('Model i lata (dokumenty GM)')).toBeHidden();
    await expect(card.getByTestId('rpo-check-note')).toBeHidden();
    await expect(card.getByRole('link')).toHaveCount(0);
    // widoczne: kod, nazwa GM (dla pozycji z polskim tłumaczeniem), kategoria
    await expect(card.getByTestId('rpo-gm-name')).toBeVisible();
    // rozwinięcie: model/lata, nota i źródła
    await card.getByTestId('rpo-more-toggle').click();
    await expect(card.getByTestId('rpo-applies')).toContainText('Model i lata (dokumenty GM)');
    await expect(card.getByTestId('rpo-check-note')).toContainText('Sprawdź w swoim aucie / manualu');
    expect(await card.getByRole('link').count()).toBeGreaterThan(0);
  }
  // pakiet z opisem: nota „Zawartość według GM…” jest w rozwinięciu (nie na kafelku Zawiera)
  const ye9 = page.locator('[data-testid="rpo-result"][data-code="YE9"]');
  await expect(ye9.getByTestId('rpo-contents')).toBeVisible();
  await expect(ye9.getByTestId('rpo-contents').getByTestId('rpo-contents-note')).toHaveCount(0);
  await expect(ye9.getByTestId('rpo-contents-note')).toContainText(/zawartość według GM dla modelu i rocznika – sprawdź w swoim aucie/i);
  // KL6 (CNG): opis z kitów GM, włącznie z KL5
  const kl6 = page.locator('[data-testid="rpo-result"][data-code="KL6"]').getByTestId('rpo-contents');
  await kl6.getByTestId('rpo-contents-toggle').click();
  await expect(kl6).toContainText('KL5');
  await noHorizontalScroll(page);
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
  await expect(y91.getByTestId('rpo-contents')).toContainText('Zawiera: brak opisu w dokumentach');
  // kod spoza kategorii „Pakiety” bez opisu nie dostaje kafelka
  await expect(page.locator('[data-testid="rpo-result"][data-code="G80"]').getByTestId('rpo-contents')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});
