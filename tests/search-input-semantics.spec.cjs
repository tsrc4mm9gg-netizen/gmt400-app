// Semantyka pola wyszukiwania na /szukaj (dawniej: okno GlobalSearch, usunięte z interfejsu).
const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const fixtures = [
  { id: 'duplicate', Nazwa: 'Materiał z duplikatem', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa.' },
  { id: 'duplicate', Nazwa: 'Materiał z duplikatem', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa.' },
  { id: 'distinct-a', Nazwa: 'Wpis odrębny A', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa Alfa.' },
  { id: 'distinct-b', Nazwa: 'Wpis odrębny B', Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Wspólna fraza testowa Beta.' },
];
async function open(page, q = '') {
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures, count: fixtures.length } }));
  await page.goto(`${BASE}/szukaj${q ? `?q=${encodeURIComponent(q)}` : ''}`);
  const input = page.getByLabel('Kod, objaw lub nazwa materiału', { exact: true });
  await expect(input).toBeVisible();
  return input;
}
const link = (page, name) => page.getByRole('main').getByRole('link', { name, exact: true });

test('uses search-oriented input semantics', async ({ page }) => {
  const input = await open(page);
  await expect(page.getByRole('search')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Kod, objaw lub nazwa materiału' })).toBeVisible();
  await expect(input).toHaveAttribute('type', 'search');
  await expect(input).toHaveAttribute('inputmode', 'search');
  await expect(input).toHaveAttribute('enterkeyhint', 'search');
  await expect(input).toHaveAttribute('autocomplete', 'off');
  await expect(input).toHaveAttribute('spellcheck', 'false');
  await expect(input).toHaveAttribute('maxlength', '120');
  await expect(input).toHaveAttribute('name', 'q');
  const fontSize = await input.evaluate(el => parseFloat(getComputedStyle(el).fontSize));
  expect(fontSize, 'min. 16 px — iOS nie powiększa strony przy fokusie').toBeGreaterThanOrEqual(16);
});
test('submits with the keyboard and announces status politely', async ({ page }) => {
  const input = await open(page);
  await input.focus();
  await page.keyboard.type('wspolna');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/[?&]q=wspolna(&|$)/);
  const status = page.getByTestId('search-status');
  await expect(status).toHaveAttribute('role', 'status');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toContainText('Materiały Notion załadowane.');
  await expect(status).toContainText('Wyświetlanie 3 wyników dla: wspolna');
});
test('removes duplicate materials with the same id', async ({ page }) => {
  await open(page, 'wspolna');
  await expect(page.getByTestId('search-status')).toContainText('Wyświetlanie 3 wyników');
  await expect(link(page, 'Materiał z duplikatem')).toHaveCount(1);
  await expect(link(page, 'Wpis odrębny A')).toBeVisible();
  await expect(link(page, 'Wpis odrębny B')).toBeVisible();
});
test('keeps distinct materials apart when filtering', async ({ page }) => {
  await open(page, 'testowa alfa');
  await expect(page.getByTestId('search-status')).toContainText('Wyświetlanie 1 wyników');
  await expect(link(page, 'Wpis odrębny A')).toBeVisible();
  await expect(link(page, 'Wpis odrębny B')).toHaveCount(0);
  await open(page, 'testowa beta');
  await expect(page.getByTestId('search-status')).toContainText('Wyświetlanie 1 wyników');
  await expect(link(page, 'Wpis odrębny B')).toBeVisible();
  await expect(link(page, 'Wpis odrębny A')).toHaveCount(0);
});
