const { test, expect } = require('@playwright/test');

test.describe('Package 2 smoke', () => {
  test('homepage loads and shows navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('GMT400')).toBeVisible();
    await expect(page.getByRole('button', { name: /Modele/i })).toBeVisible();
  });

  test('issues list is visible without filters', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Usterki/i }).click();
    await expect(page.getByText(/usterk/i).first()).toBeVisible();
  });

  test('search page responds', async ({ page }) => {
    await page.goto('/szukaj');
    await expect(page.getByRole('heading', { name: /Szukaj/i })).toBeVisible();
  });
});
