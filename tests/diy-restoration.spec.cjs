const { test, expect } = require('@playwright/test');
const ALL = Object.fromEntries(['brand','model','years','engine','drive','transmission'].map(key => [key, ['Wszystkie']]));
const profile = { brand: 'Chevrolet', model: 'Suburban', year: '1999', engine: '5,7', drive: '4WD', transmission: '' };
const fixtures = [
  { id: '00000000-0000-0000-0000-000000000001', Nazwa: 'TEST 4L60E instrukcja Suburban', Typ: 'Porada', Model: 'Wszystkie', Opis: 'TEST OPIS', Rozwiązanie: 'TEST PEŁNA INSTRUKCJA\nKrok drugi zachowany.', applicability: { ...ALL, model: ['Suburban'] } },
  { id: '00000000-0000-0000-0000-000000000002', Nazwa: 'TEST TAHOE', Typ: 'Porada', Model: 'Wszystkie', Rozwiązanie: 'TEST TAHOE INSTRUKCJA', applicability: { ...ALL, model: ['Tahoe'] } },
  { id: '00000000-0000-0000-0000-000000000003', Nazwa: 'TEST NIEUSTALONA PORADA', Typ: 'Porada', Model: 'Wszystkie', Rozwiązanie: 'TEST BRAK METADANYCH' },
  { Nazwa: 'TEST KOD NIE JEST PORADĄ', Typ: 'Kod błędu', Model: 'Wszystkie', applicability: ALL },
];
async function prepare(page, withProfile) {
  await page.addInitScript(({ profile, withProfile }) => { localStorage.setItem('gmt400_tab', 'diy'); if (withProfile) localStorage.setItem('gmt400_vehicle_profile_v1', JSON.stringify({ version: 1, profile })); }, { profile, withProfile });
  await page.route('**/api/notion', route => route.fulfill({ json: { results: fixtures, count: fixtures.length } }));
  await page.goto('http://127.0.0.1:3100/baza');
  await expect(page.getByRole('heading', { name: 'PORADNIKI DIY', exact: true })).toBeVisible();
}
test('DIY restores instructions, existing graphic, lightbox and full-material link before videos', async ({ page }) => {
  await prepare(page, false);
  await expect(page.getByText('TEST PEŁNA INSTRUKCJA', { exact: false })).toBeVisible();
  await expect(page.getByText('Krok drugi zachowany.', { exact: false })).toBeVisible();
  const image = page.locator('#content img[src="/diy-4l60e-pan-pl.jpg"]').first();
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('link', { name: 'Otwórz pełną instrukcję z ilustracjami', exact: true }).first()).toHaveAttribute('href', '/baza/00000000-0000-0000-0000-000000000001');
  const headings = await page.locator('#content h2,#content h3').allTextContents();
  expect(headings.indexOf('PORADNIKI DIY')).toBeLessThan(headings.indexOf('PORADNIKI WIDEO'));
  await image.click();
  await expect(page.getByRole('img', { name: 'powiększony', exact: true })).toBeVisible();
});
