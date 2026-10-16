const { test, expect } = require('@playwright/test');
const URL = 'http://127.0.0.1:3100';
const PROFILE = { brand: 'Chevrolet', model: 'Suburban', year: '1999', engine: 'L31', drive: '4WD', transmission: '' };
const ALL = Object.fromEntries(['brand', 'model', 'years', 'engine', 'drive', 'transmission'].map(key => [key, ['Wszystkie']]));
const entry = (name, applicability) => ({ Nazwa: name, Typ: 'Kod błędu', Model: 'Wszystkie', Opis: 'Dane testowe, nie porada techniczna', applicability });
const fixtures = [entry('TEST MATCH', { ...ALL, model: ['Suburban'], drive: ['4x4'] }), entry('TEST GENERAL', ALL), entry('TEST UNKNOWN', { ...ALL, transmission: ['4L60E'] }), entry('TEST OUTSIDE', { ...ALL, model: ['Yukon'] })];
async function prepare(page, profile) {
  await page.addInitScript(({ profile }) => {
    localStorage.setItem('gmt400_tab', 'kody');
    if (profile) localStorage.setItem('gmt400_vehicle_profile_v1', JSON.stringify({ version: 1, profile }));
  }, { profile });
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures, count: fixtures.length } }));
  await page.goto(URL);
  await expect(page.getByRole('heading', { name: 'TEST MATCH', exact: true })).toBeVisible();
}
test('filters visible lists and restores all materials', async ({ page }) => {
  await prepare(page, PROFILE);
  const panel = page.getByRole('region', { name: 'Filtrowanie według profilu auta' });
  for (const [label, shown] of [['Zgodne z zakresem', 'TEST MATCH'], ['Ogólne', 'TEST GENERAL'], ['Nieustalone', 'TEST UNKNOWN'], ['Poza zakresem', 'TEST OUTSIDE']]) {
    await panel.getByRole('button', { name: `${label} (1)`, exact: true }).click();
    for (const item of fixtures) {
      const heading = page.getByRole('heading', { name: item.Nazwa, exact: true });
      if (item.Nazwa === shown) await expect(heading).toBeVisible();
      else await expect(heading).toHaveCount(0);
    }
  }
  await panel.getByRole('button', { name: 'Wszystkie (4)', exact: true }).click();
  for (const item of fixtures) await expect(page.getByRole('heading', { name: item.Nazwa, exact: true })).toBeVisible();
});
test('without profile nothing is excluded', async ({ page }) => {
  await prepare(page, null);
  for (const item of fixtures) await expect(page.getByRole('heading', { name: item.Nazwa, exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Filtrowanie według profilu auta' })).toContainText('Obecnie nie ograniczamy list');
});
test('profile editor persists configuration across reload', async ({ page }) => {
  await prepare(page, null);
  await page.getByRole('button', { name: 'Ustaw profil auta', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Moje auto — wspólny profil' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox', { name: /^Marka/ }).selectOption('Chevrolet');
  await dialog.getByRole('combobox', { name: /^Model/ }).selectOption('Suburban');
  await dialog.getByLabel('Rocznik', { exact: true }).fill('1999');
  await dialog.getByLabel('Silnik', { exact: true }).fill('L31');
  await dialog.getByRole('combobox', { name: /^Napęd/ }).selectOption('4WD');
  await dialog.getByRole('button', { name: 'Zapisz profil', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Moje auto: Chevrolet Suburban 1999', exact: true })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('gmt400_vehicle_profile_v1')));
  expect(saved.profile).toEqual(PROFILE);
});
