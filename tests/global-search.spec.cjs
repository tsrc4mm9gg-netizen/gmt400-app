const { test, expect } = require('@playwright/test');
const fixtures = [
  { Nazwa: 'P0300 — test diagnostyki', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Opis kontrolny', Rozwiązanie: 'Pełne rozwiązanie testowe.' },
  { Nazwa: 'Kontrola chłodzenia', Typ: 'Porada', Model: 'Wszystkie', Objawy: 'Wyciek płynu pod autem' },
  { Nazwa: 'Obsługa skrzyni automatycznej', Typ: 'Porada', Model: 'Wszystkie', Opis: 'Skrzynia automatyczna — materiał testowy.' },
];
async function openSearch(page) {
  await page.addInitScript(() => { localStorage.setItem('gmt400_tab', 'kody'); });
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures, count: fixtures.length } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('heading', { name: fixtures[0].Nazwa, exact: true })).toBeVisible();
  await page.locator('header button').first().click();
  const dialog = page.getByRole('dialog', { name: 'Szukaj w bazie wiedzy' });
  await expect(dialog).toBeVisible();
  return dialog;
}
test('code search opens full material', async ({ page }) => {
  const dialog = await openSearch(page);
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('P0300');
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 1');
  await dialog.getByRole('button', { name: fixtures[0].Nazwa, exact: true }).click();
  await expect(dialog.getByRole('heading', { name: fixtures[0].Nazwa, exact: true })).toBeVisible();
  await expect(dialog).toContainText('Pełne rozwiązanie testowe.');
  await dialog.getByRole('button', { name: 'Wróć do wyników' }).click();
  await expect(dialog.getByLabel('Szukaj w bazie', { exact: true })).toHaveValue('P0300');
});
test('finds symptoms without Polish accents and handles no matches', async ({ page }) => {
  const dialog = await openSearch(page);
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('wyciek plynu');
  await expect(dialog.getByRole('button', { name: 'Kontrola chłodzenia', exact: true })).toBeVisible();
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('zzzzbrakwynikow');
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 0');
});
test('supports explicit automatic-transmission synonym', async ({ page }) => {
  const dialog = await openSearch(page);
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('automat');
  await expect(dialog.getByRole('button', { name: 'Obsługa skrzyni automatycznej', exact: true })).toBeVisible();
});
