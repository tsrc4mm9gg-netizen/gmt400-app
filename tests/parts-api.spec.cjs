const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
test('1999 and 2000 are accepted without extending catalog fitments', async ({ request }) => {
 for (const year of [1999, 2000]) {
  const response = await request.get(BASE + '/api/parts?model=Suburban&year=' + year);
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.query.year).toBe(year);
  expect(data.results).toHaveLength(0);
  expect(data.matchStatus).toBe('reference-only');
 }
});
test('malformed and out of range years are rejected', async ({ request }) => {
 for (const year of ['', 'abc', '1999.5', '1e3', '1987', '2001']) expect((await request.get(BASE + '/api/parts?year=' + encodeURIComponent(year))).status()).toBe(400);
});
test('reference results do not assert verified fitment', async ({ request }) => {
 const response = await request.get(BASE + '/api/parts?model=Tahoe&year=1997');
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.results.length).toBeGreaterThan(0);
 for (const entry of data.allResults) { expect(entry.fitmentVerified).toBe(false); expect(entry.confidence).toBe('verify'); }
});
test('parts form offers 1999 and 2000 and explains missing data', async ({ page }) => {
 await page.goto(BASE + '/narzedzia/czesci');
 const year = page.getByRole('combobox', { name:'Rocznik', exact:true });
 await expect(year).toBeVisible();
 await expect(year.locator('option')).toHaveCount(14);
 await year.selectOption('2000');
 await expect(year).toHaveValue('2000');
 await year.selectOption('1999');
 const responsePromise = page.waitForResponse(response => { const url = new URL(response.url()); return url.pathname === '/api/parts' && url.searchParams.get('year') === '1999'; });
 await page.getByRole('button', { name:'Szukaj informacji', exact:true }).click();
 expect((await responsePromise).status()).toBe(200);
 await expect(page.getByRole('status')).toContainText('Brak danych lokalnych');
 await expect(page.getByRole('status')).toContainText('Nie oznacza to, że część nie pasuje');
 await expect(page.getByRole('alert')).toHaveCount(0);
});
test('1999 Suburban 5.7 offers separate catalog links without false local matches', async ({ request, page }) => {
 const params = new URLSearchParams({ model:'Suburban 1500', year:'1999', engine:'5.7L V8', transmission:'Automatyczna', drivetrain:'4x4' });
 const response = await request.get(BASE + '/api/parts?' + params);
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.results).toHaveLength(0);
 expect(data.externalCatalogs).toHaveLength(2);
 for (const item of data.externalCatalogs) { expect(item.drivetrain).toBe('4x4'); expect(item.kind).toBe('external-catalog-link'); expect(item.fitmentVerified).toBe(false); }
 const other = await request.get(BASE + '/api/parts?' + new URLSearchParams({ model:'Suburban 1500', year:'2000', engine:'5.7L V8' }));
 expect((await other.json()).externalCatalogs).toHaveLength(0);
 await page.goto(BASE + '/narzedzia/czesci');
 for (const [name, value] of [['Model', 'Suburban 1500'], ['Rocznik', '1999'], ['Silnik', '5.7L V8'], ['Skrzynia biegów', 'Automatyczna'], ['Napęd', '4x4']]) await page.getByRole('combobox', { name, exact:true }).selectOption(value);
 await page.getByRole('button', { name:'Szukaj informacji', exact:true }).click();
 const catalogs = page.getByRole('region', { name:'Katalogi zewnętrzne', exact:true });
 await expect(catalogs).toBeVisible();
 await expect(catalogs.getByRole('link')).toHaveCount(2);
});
