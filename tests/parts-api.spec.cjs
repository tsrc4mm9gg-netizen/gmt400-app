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
 const year = page.getByLabel('Rocznik', { exact:true });
 await year.selectOption('2000');
 await year.selectOption('1999');
 await page.getByRole('button', { name:'Szukaj informacji', exact:true }).click();
 await expect(page.getByRole('status')).toContainText('Brak danych');
 await expect(page.getByRole('status')).toContainText('Nie oznacza to, że część nie pasuje');
});
