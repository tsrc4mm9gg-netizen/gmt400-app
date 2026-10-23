const { test, expect } = require('@playwright/test');
const { groupModels, modelWarning } = require('../src/lib/model-catalog.ts');
const item = (n, Nazwa, Model, Opis = 'Opis testowy') => ({ id: `00000000-0000-0000-0000-${String(n).padStart(12,'0')}`, Nazwa, Model, Opis, Typ: 'Model', Lata: '1995–1999' });
const data = [item(1,'Chevrolet Tahoe 2-drzwi','Tahoe','DOC1'), item(2,'Chevrolet Tahoe 2-drzwi — pełny opis','Tahoe','DOC2'), item(3,'Chevrolet Tahoe 4-drzwi','Tahoe','DOC3'), item(4,'Chevrolet Suburban 1500','Suburban','DOC4'), item(5,'Silnik 5.7L Vortec (L31)','Wszystkie','DOC5')];
test('family grouping preserves every source record and combines descriptions without deleting them', () => {
  const extra = [...data, item(6,'Chevrolet K5 Blazer','C/K'), item(7,'Nieopisany wariant','Wszystkie')];
  const groups = groupModels(extra);
  expect(groups.flatMap(group => group.entries).map(item => item.id).sort()).toEqual(extra.map(item => item.id).sort());
  const tahoe = groups.find(group => group.id === 'tahoe');
  expect(tahoe.variants.find(variant => variant.label === '2 drzwi').entries).toHaveLength(2);
  expect(groups.find(group => group.id === 'engines').entries).toHaveLength(1);
  expect(groups.find(group => group.id === 'other').entries).toHaveLength(1);
  expect(modelWarning(extra[5])).not.toBe('');
});
test('Sierra and ambiguous GMC Suburban names are separated without relabelling source records', () => {
  const records = [item(1,'GMC Sierra 1500','C/K'), item(2,'GMC Yukon XL (odpowiednik Suburban)','Suburban')];
  const groups = groupModels(records);
  expect(groups.find(group => group.id === 'pickups').entries[0].Nazwa).toBe(records[0].Nazwa);
  expect(groups.find(group => group.id === 'suburban').entries[0].Nazwa).toBe(records[1].Nazwa);
  expect(modelWarning(records[1])).not.toBe('');
});
async function prepare(page) {
  await page.route('**/api/notion', route => route.fulfill({ json: { results: data, count: data.length, complete: true } }));
  await page.goto('http://127.0.0.1:3100/modele');
  return page.getByRole('region', { name: 'Katalog modeli według rodzin', exact: true });
}
test('catalog opens family and body variant while keeping both original descriptions and links', async ({ page }, info) => {
  const catalog = await prepare(page);
  await expect(catalog).toBeVisible();
  await catalog.getByRole('button', { name: 'Chevrolet Tahoe', exact: true }).click();
  const variants = catalog.getByRole('region', { name: 'Odmiany: Chevrolet Tahoe', exact: true });
  await variants.locator('summary').filter({ hasText: '2 drzwi' }).click();
  await expect(variants.getByText('DOC1', { exact: true })).toBeVisible();
  await expect(variants.getByText('DOC2', { exact: true })).toBeVisible();
  await expect(variants.getByRole('link', { name: 'Otwórz cały wpis', exact: true }).first()).toHaveAttribute('href','/baza/' + data[0].id);
  await page.screenshot({ path: info.outputPath('grouped-model-catalog.png'), fullPage: true });
});
test('engine search exposes technical descriptions and clearing restores all families', async ({ page }) => {
  const catalog = await prepare(page);
  await catalog.getByLabel('Szukaj rodziny, wersji lub silnika', { exact: true }).fill('vortec');
  await expect(catalog.getByRole('heading', { name: data[4].Nazwa, exact: true })).toBeVisible();
  await expect(catalog.getByRole('button', { name: 'Chevrolet Tahoe', exact: true })).toHaveCount(0);
  await catalog.getByRole('button', { name: 'Wyczyść wyszukiwanie', exact: true }).click();
  await expect(catalog.getByRole('button', { name: 'Chevrolet Tahoe', exact: true })).toBeVisible();
  await expect(catalog.getByRole('button', { name: 'Suburban', exact: true })).toBeVisible();
  await expect(catalog.getByRole('button', { name: 'Silniki — dane techniczne', exact: true })).toBeVisible();
});
