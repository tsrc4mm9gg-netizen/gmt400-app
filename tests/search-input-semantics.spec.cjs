const { test, expect } = require('@playwright/test');
const fixtures = [
  { id: 'duplicate', Nazwa: 'Materiał z duplikatem', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa.' },
  { id: 'duplicate', Nazwa: 'Materiał z duplikatem', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa.' },
  { Nazwa: 'Wpis bez identyfikatora A', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa A.' },
  { Nazwa: 'Wpis bez identyfikatora B', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa B.' },
];
async function open(page) {
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'kody'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures, count: fixtures.length } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('heading', { name: 'Materiał z duplikatem', exact: true })).toBeVisible();
  await page.locator('header button').first().click();
  const dialog = page.getByRole('dialog', { name: 'Szukaj w bazie wiedzy' });
  await expect(dialog).toBeVisible();
  return dialog;
}
test('uses search-oriented input semantics', async ({ page }) => {
  const dialog = await open(page);
  const input = dialog.getByLabel('Szukaj w bazie', { exact: true });
  await expect(input).toHaveAttribute('type', 'search');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await expect(input).toHaveAttribute('spellcheck', 'false');
  await expect(input).toHaveAttribute('enterkeyhint', 'search');
  await expect(input).toHaveAttribute('maxlength', '120');
});
test('announces search status politely', async ({ page }) => {
  const dialog = await open(page);
  const status = dialog.getByRole('status');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('wspolna');
  await expect(status).toContainText('Znaleziono: 3');
});
test('removes duplicate materials with the same id', async ({ page }) => {
  const dialog = await open(page);
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('wspolna');
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 3');
  await expect(dialog.getByRole('button', { name: 'Materiał z duplikatem', exact: true })).toHaveCount(1);
  await expect(dialog.getByRole('button', { name: 'Wpis bez identyfikatora A', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Wpis bez identyfikatora B', exact: true })).toBeVisible();
});
test('keeps distinct materials without ids', async ({ page }) => {
  const dialog = await open(page);
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('testowa a');
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 1');
  await expect(dialog.getByRole('button', { name: 'Wpis bez identyfikatora A', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Wpis bez identyfikatora B', exact: true })).toHaveCount(0);
});
