const { test, expect } = require('@playwright/test');

const ARTICLE =
  'https://www.gmt400.pl/baza/402d7bf1-c139-8123-a9b4-d311d27200b1';

test('termostat: podgląd ilustracji obsługiwany klawiaturą', async ({ page }) => {
  await page.goto(ARTICLE, { waitUntil: 'domcontentloaded' });

  const figure = page.getByTestId('entry-figure');
  const opener = figure.getByRole('link', { name: /^Powiększ:/ });

  await expect(figure).toBeVisible();

  await expect
    .poll(() =>
      opener
        .locator('img')
        .evaluate((image) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);

  await opener.focus();
  await expect(opener).toBeFocused();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', {
    name: 'Powiększenie ilustracji',
    exact: true,
  });

  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('button', {
      name: 'Zamknij powiększenie',
      exact: true,
    }),
  ).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});
