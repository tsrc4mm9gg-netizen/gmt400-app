const { test, expect } = require('@playwright/test');
const base = process.env.BASE_URL || 'http://127.0.0.1:3100';

test('reminder mileage persists and rejects negative values', async ({ page }) => {
  await page.goto(`${base}/moj-samochod`);
  const mileage = page.getByLabel('Aktualny przebieg (km)', { exact: true });
  await mileage.fill('150000');
  await page.getByRole('button', { name: 'Zapisz przebieg', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400-current-km'))).toBe('150000');
  await mileage.fill('-1');
  await page.getByRole('button', { name: 'Zapisz przebieg', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Podaj przebieg' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('gmt400-current-km'))).toBe('150000');
  await page.reload();
  await expect(page.getByText('Zapisany przebieg: 150 000 km', { exact: true })).toBeVisible();
});

test('invalid existing reminders are not overwritten', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('gmt400-reminders', '{broken-json'));
  await page.goto(`${base}/moj-samochod`);
  await expect(page.getByRole('alert').filter({ hasText: 'Zapisywanie zostało zablokowane' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Zapisz przebieg', exact: true })).toBeDisabled();
  expect(await page.evaluate(() => localStorage.getItem('gmt400-reminders'))).toBe('{broken-json');
});
