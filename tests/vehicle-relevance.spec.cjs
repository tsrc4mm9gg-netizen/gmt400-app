const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const profile = { brand: 'Chevrolet', model: 'Suburban', year: '1999', engine: '5.7', drive: '4WD', transmission: '' };
const applicability = (model, years) => ({ brand: ['Chevrolet'], model: [model], years, engine: ['5.7'], drive: ['4WD'], transmission: [] });
const results = [
  { id: 'within', Nazwa: 'Zgodna usterka', Typ: 'Usterka', Model: 'Suburban', applicability: applicability('Suburban', ['1988-2000']) },
  { id: 'general', Nazwa: 'Ogólna porada', Typ: 'Porada', Model: 'Wszystkie', applicability: applicability('Wszystkie', ['Wszystkie']) },
  { id: 'unknown', Nazwa: 'Nieustalony zakres', Typ: 'Usterka', Model: 'Suburban' },
  { id: 'outside', Nazwa: 'Poza zakresem', Typ: 'Usterka', Model: 'Yukon', applicability: applicability('Yukon', ['2007-2014']) }
];
async function prepare(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(({ profile }) => localStorage.setItem('gmt400_vehicle_profile_v1', JSON.stringify({ version: 1, profile })), { profile });
  await page.route('**/api/notion', route => route.fulfill({ json: { results, count: results.length, complete: true } }));
}
test('vehicle relevance excludes unknown materials', async({page}) => {
  await prepare(page);
  await page.goto(BASE + '/usterki');
  await expect(page.getByRole('button', { name: /Dla mojego auta \(2\)/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Zgodna usterka' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ogólna porada' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nieustalony zakres' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Poza zakresem' })).toHaveCount(0);
});
test('unknown materials remain available in their explicit mode', async({page}) => {
  await prepare(page);
  await page.goto(BASE + '/usterki');
  await page.getByRole('button', { name: 'Filtry zaawansowane' }).click();
  await page.getByRole('button', { name: /Nieustalone \(1\)/ }).click();
  await expect(page.getByRole('link', { name: 'Nieustalony zakres' })).toBeVisible();
});
