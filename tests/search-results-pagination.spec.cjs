const { test, expect } = require('@playwright/test');
const TOTAL = 120;
const fixtures = Array.from({ length: TOTAL }, (_, index) => ({ id: `pagination-${String(index).padStart(3, '0')}`, Nazwa: `Materiał testowy ${String(index).padStart(3, '0')}`, Typ: 'Kod błędu', Model: 'Wszystkie', Opis: `Wspólna fraza testowa numer ${index}.` }));
async function open(page, count = TOTAL) {
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'kody'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures.slice(0, count), count } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('heading', { name: 'Materiał testowy 000', exact: true })).toBeVisible();
  await page.locator('header button').first().click();
  const dialog = page.getByRole('dialog', { name: 'Szukaj w bazie wiedzy' });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('wspolna fraza');
  await expect(dialog.getByRole('status')).toContainText(`Znaleziono: ${count}`);
  return dialog;
}
test('shows first fifty and reveals results in pages', async ({ page }) => {
  const dialog = await open(page);
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 120 — pokazujemy 50 z 120.');
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 049', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 050', exact: true })).toHaveCount(0);
  await dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 120 — pokazujemy 100 z 120.');
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 099', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true }).click();
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 120 — pokazujemy wszystkie 120.');
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 119', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true })).toHaveCount(0);
});
test('keeps ranking order while expanding results', async ({ page }) => {
  const dialog = await open(page);
  const buttons = dialog.getByRole('button', { name: /^Materiał testowy \d{3}$/ });
  await expect(buttons).toHaveText(fixtures.slice(0, 50).map(item => item.Nazwa));
  await dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true }).click();
  await expect(buttons).toHaveText(fixtures.slice(0, 100).map(item => item.Nazwa));
});
test('does not show pagination for exactly fifty results', async ({ page }) => {
  const dialog = await open(page, 50);
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 50');
  await expect(dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 049', exact: true })).toBeVisible();
});
test('resets pagination when the query changes', async ({ page }) => {
  const dialog = await open(page);
  await dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 099', exact: true })).toBeVisible();
  await dialog.getByLabel('Szukaj w bazie', { exact: true }).fill('wspolna testowa');
  await expect(dialog.getByRole('status')).toContainText('Znaleziono: 120 — pokazujemy 50 z 120.');
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 049', exact: true })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 050', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: 'Materiał testowy 099', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('button', { name: /^Materiał testowy \d{3}$/ })).toHaveCount(50);
  await expect(dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true })).toBeVisible();
});
test('keeps focus on the reveal control after expanding', async ({ page }) => {
  const dialog = await open(page);
  const button = dialog.getByRole('button', { name: 'Pokaż więcej wyników', exact: true });
  await button.click();
  await expect(button).toBeFocused();
  await expect(dialog.getByRole('status')).toContainText('pokazujemy 100 z 120');
});
