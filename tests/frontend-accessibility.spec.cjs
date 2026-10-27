const { test, expect } = require('@playwright/test');
test('Tips illustration supports keyboard modal controls and valid website JSON-LD', async ({ page }) => {
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [{ id: '00000000-0000-0000-0000-000000000001', Nazwa: '4L60E instrukcja', Typ: 'Porada', Model: 'Wszystkie', Rozwiązanie: 'Instrukcja testowa' }], count: 1 } }));
  await page.goto('http://127.0.0.1:3100/?tab=tips');
  // Listy DIY to teraz kafelki (bez powiększania w liście) — modal ilustracji sprawdzamy na zakładce z poradami (tips).
  const trigger = page.getByRole('button', { name: 'Powiększ ilustrację', exact: true }).first();
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Powiększenie ilustracji', exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Zamknij powiększenie', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.goto('http://127.0.0.1:3100/?tab=diy');
  await expect(page.getByRole('heading', { name: 'PORADNIKI DIY', exact: true })).toBeVisible();
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(JSON.parse(json)).toMatchObject({ '@type': 'WebSite', url: 'https://gmt400.pl' });
  await page.getByRole('button', { name: 'GMT400 — strona główna', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400_tab'))).toBe('modele');
});
test('VIN history field has a visible associated label', async ({ page }) => {
  await page.goto('http://127.0.0.1:3100/narzedzia/historia-vin');
  await expect(page.getByLabel('Numer VIN pojazdu', { exact: true })).toBeVisible();
  await page.locator('label[for="history-vin"]').click();
  await expect(page.getByLabel('Numer VIN pojazdu', { exact: true })).toBeFocused();
});
