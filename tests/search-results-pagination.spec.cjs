// Stronicowanie wyników na /szukaj (dawniej: okno GlobalSearch, usunięte z interfejsu).
const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const TOTAL = 120;
const fixtures = Array.from({ length: TOTAL }, (_, index) => ({ id: `pagination-${String(index).padStart(3, '0')}`, Nazwa: `Materiał testowy ${String(index).padStart(3, '0')}`, Typ: 'Kod błędu', Model: 'Wszystkie', Opis: `Wspólna fraza testowa numer ${index}.` }));
const title = name => ({ name, exact: true });
async function open(page, count = TOTAL, q = 'wspolna fraza') {
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures.slice(0, count), count } }));
  await page.goto(`${BASE}/szukaj?q=${encodeURIComponent(q)}`);
  const status = page.getByTestId('search-status');
  await expect(status).toContainText('Materiały Notion załadowane.');
  await expect(status).toContainText(`Wyświetlanie ${count} wyników`);
  return status;
}
const links = page => page.getByRole('main').getByRole('link', { name: /^Materiał testowy \d{3}$/ });
const more = page => page.getByRole('button', title('Pokaż więcej wyników'));

test('shows first fifty and reveals results in pages', async ({ page }) => {
  const status = await open(page);
  await expect(status).toContainText('Pokazujemy 50 z 120.');
  await expect(page.getByRole('link', title('Materiał testowy 049'))).toBeVisible();
  await expect(page.getByRole('link', title('Materiał testowy 050'))).toHaveCount(0);
  await more(page).click();
  await expect(status).toContainText('Pokazujemy 100 z 120.');
  await expect(page.getByRole('link', title('Materiał testowy 099'))).toBeVisible();
  await more(page).click();
  await expect(status).toContainText('Pokazujemy wszystkie 120.');
  await expect(page.getByRole('link', title('Materiał testowy 119'))).toBeVisible();
  await expect(more(page)).toHaveCount(0);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'brak poziomego przewijania').toBeLessThanOrEqual(0);
});
test('keeps ranking order while expanding results', async ({ page }) => {
  await open(page);
  await expect(links(page)).toHaveText(fixtures.slice(0, 50).map(item => item.Nazwa));
  await more(page).click();
  await expect(links(page)).toHaveText(fixtures.slice(0, 100).map(item => item.Nazwa));
});
test('does not show pagination for exactly fifty results', async ({ page }) => {
  const status = await open(page, 50);
  await expect(status).not.toContainText('Pokazujemy');
  await expect(more(page)).toHaveCount(0);
  await expect(links(page)).toHaveCount(50);
});
test('resets pagination when the query changes', async ({ page }) => {
  await open(page);
  await more(page).click();
  await expect(page.getByRole('link', title('Materiał testowy 099'))).toBeVisible();
  const input = page.getByLabel('Kod, objaw lub nazwa materiału');
  await input.fill('wspolna testowa');
  await input.press('Enter');
  await expect(page).toHaveURL(/[?&]q=wspolna\+testowa/);
  const status = page.getByTestId('search-status');
  await expect(status).toContainText('Pokazujemy 50 z 120.');
  await expect(links(page)).toHaveCount(50);
  await expect(page.getByRole('link', title('Materiał testowy 050'))).toHaveCount(0);
  await expect(more(page)).toBeVisible();
});
test('keeps focus on the reveal control after expanding', async ({ page }) => {
  const status = await open(page);
  const button = more(page);
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(status).toContainText('Pokazujemy 100 z 120.');
  await expect(button).toBeFocused();
});
