// /porady-wlasciciela: lista porad z instrukcji GM, filtr wg profilu Moje auto, „pokaż wszystko”, źródła, przekierowanie /tips.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const KEY = 'gmt400_vehicle_profile_v2';
const C90 = { brand: 'Chevrolet', platform: 'C/K', model: 'C1500', year: '1990', engine: '', drive: '2WD', transmission: '', rpoCodes: [] };

test('/tips przekierowuje na /porady-wlasciciela, porady mają źródło i zakres', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE + '/tips');
  await expect(page).toHaveURL(BASE + '/porady-wlasciciela');
  await expect(page.locator('h1')).toHaveText('Porady właściciela GMT400');
  const tips = page.getByTestId('owner-tip');
  expect(await tips.count()).toBeGreaterThanOrEqual(30);
  await expect(tips.first()).toContainText('Dotyczy:');
  await expect(tips.first()).toContainText('Źródło:');
  await expect(page.locator('a[href="/poradniki"]').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('filtr wg profilu ukrywa porady 4×4 dla C1500 2WD, „Pokaż wszystko” je pokazuje', async ({ page }) => {
  await page.addInitScript(({ key, profile }) => localStorage.setItem(key, JSON.stringify({ version: 2, profile })), { key: KEY, profile: C90 });
  await page.goto(BASE + '/porady-wlasciciela');
  await hydrated(page);
  await expect(page.getByTestId('owner-tips-filter')).toContainText('C1500');
  await expect(page.locator('#porada-4wd-przyciski')).toHaveCount(0);
  await expect(page.locator('#porada-aldl')).toBeVisible();
  const all = page.getByTestId('owner-tips-show-all');
  const box = await all.boundingBox(); expect(box.height).toBeGreaterThanOrEqual(44);
  await all.click();
  await expect(page.locator('#porada-4wd-przyciski')).toHaveAttribute('data-fit', 'outside');
});
