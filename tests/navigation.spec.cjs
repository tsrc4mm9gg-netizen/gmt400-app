const { test, expect } = require('@playwright/test');
async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'modele'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [], count: 0 } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('navigation', { name: 'Skróty sekcji', exact: true })).toBeVisible();
}
test('five groups retain all nineteen section buttons', async ({ page }) => {
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  const groups = [
    ['Moje GMT400', ['Moje auto', 'Dziennik', 'Paliwo']],
    ['Naprawa i diagnostyka', ['Usterki', 'Kody OBD', 'DIY', 'Schematy', 'VIN/RPO', 'Serwis', 'Tips']],
    ['Modele i dane', ['Modele', 'Specyfikacje', 'Historia', 'Porównaj']],
    ['Części i modyfikacje', ['Części', 'Tuning']],
    ['Zakup i import', ['Kupujący', 'Import', 'Koszty']],
  ];
  for (const [label, children] of groups) {
    const group = nav.getByRole('button', { name: label, exact: true });
    if (await group.getAttribute('aria-expanded') !== 'true') await group.click();
    for (const child of children) await expect(nav.getByRole('button', { name: child, exact: true })).toBeVisible();
    await expect(nav.getByRole('button')).toHaveCount(5 + children.length);
  }
});
test('desktop section selection and standalone link work', async ({ page }) => {
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.getByRole('button', { name: 'Naprawa i diagnostyka', exact: true }).click();
  await expect(nav.getByRole('link', { name: 'Otwórz Usterki jako osobną stronę', exact: true })).toHaveAttribute('href', '/usterki');
  await nav.getByRole('button', { name: 'Usterki', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'USTERKI', exact: true })).toBeVisible();
});
test('mobile menu selection closes menu and preserves import tool', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.getByRole('button', { name: 'Otwórz menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Menu główne', exact: true });
  await menu.getByRole('button', { name: 'Zakup i import', exact: true }).click();
  await menu.getByRole('button', { name: 'Import', exact: true }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'IMPORT DO POLSKI', exact: true })).toBeVisible();
});
