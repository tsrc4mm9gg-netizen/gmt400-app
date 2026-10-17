const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';

test('RPO decodes multiple codes, filters categories and reports ratio conflicts', async ({ request }) => {
 const response = await request.get(BASE + '/api/rpo?q=G80%20Z71%20GU5%20GT5');
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.ratioConflict).toBe(true);
 for (const code of ['G80', 'Z71', 'GU5', 'GT5']) expect(data.results.some(item => item.code === code)).toBe(true);
 const filtered = await request.get(BASE + '/api/rpo?q=G80%20Z71&category=Osie');
 const body = await filtered.json();
 expect(body.results.length).toBeGreaterThan(0);
 expect(body.results.every(item => item.category === 'Osie')).toBe(true);
});

test('unit conversion has correct direction and rejects missing values', async ({ request }) => {
 const response = await request.get(BASE + '/api/units?type=pressure&value=32');
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.output.unit).toBe('bar');
 expect(data.output.value).toBeCloseTo(2.206322, 5);
 expect((await request.get(BASE + '/api/units?type=pressure')).status()).toBe(400);
});

test('VIN checksum and returned identifier lengths are correct', async ({ request }) => {
 const response = await request.get(BASE + '/api/vin/validate?vin=1M8GDM9AXKP042788');
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.valid).toBe(true);
 expect(data.worldManufacturerIdentifier).toBe('1M8');
 expect(data.serialNumber).toHaveLength(6);
});

test('larger tires lower effective ratio and increase actual speed', async ({ request }) => {
 const response = await request.get(BASE + '/api/calculators?tool=tire&width=265&aspect=75&rim=16&oldWidth=235&oldAspect=75&oldRim=16&speed=60&axleRatio=3.73');
 expect(response.status()).toBe(200);
 const data = await response.json();
 expect(data.newTireDiameterMm).toBeGreaterThan(data.oldTireDiameterMm);
 expect(data.effectiveAxleRatio).toBeLessThan(3.73);
 expect(data.actualSpeedAtIndicatedSpeed).toBeGreaterThan(60);
});

test('Tools button is visible and opens the hub and RPO page', async ({ page }) => {
 await page.route('**/api/notion', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) }));
 await page.goto(BASE);
 const launcher = page.getByRole('link', { name: 'Narzędzia', exact: true });
 await expect(launcher).toBeVisible();
 await launcher.click();
 await expect(page.getByRole('heading', { name: 'Narzędzia GMT400' })).toBeVisible();
 await expect(page.getByRole('link', { name: 'Narzędzia', exact: true })).toBeHidden();
 await page.getByRole('link', { name: /Kody RPO/ }).click();
 await expect(page.getByRole('heading', { name: 'Co oznaczają kody RPO?' })).toBeVisible();
});

test('Polish OBD search displays the P0300 result', async ({ page }) => {
 await page.goto(BASE + '/narzedzia/diagnostyka');
 await page.getByPlaceholder('Wpisz kod błędu lub objaw').fill('P0300');
 await page.getByRole('button', { name: 'Sprawdź kod', exact: true }).click();
 await expect(page.getByText('Wysoka pilność', { exact: true })).toBeVisible();
 await expect(page.getByRole('heading', { name: 'Co sprawdzić najpierw' })).toBeVisible();
});

for (const width of [320, 390, 768]) {
 test('Tools cards have visible styling and fit viewport ' + width, async ({ page }) => {
  await page.setViewportSize({ width, height: 844 });
  await page.goto(BASE + '/narzedzia');
  await expect(page.locator('[data-tools-appearance="inline-v1"]')).toBeVisible();
  const cards = page.locator('[data-tool-card]');
  await expect(cards).toHaveCount(4);
  for (const card of await cards.all()) {
   await expect(card).toHaveCSS('background-color', 'rgb(23, 29, 37)');
   await expect(card).toHaveCSS('border-left-color', 'rgb(231, 185, 94)');
   await expect(card).toHaveCSS('border-left-width', '3px');
   await expect(card.locator('h2')).toHaveCSS('color', 'rgb(242, 207, 133)');
   const box = await card.boundingBox();
   expect(box).not.toBeNull();
   expect(box.x).toBeGreaterThanOrEqual(0);
   expect(box.x + box.width).toBeLessThanOrEqual(width);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath('tools-' + width + '.png'), fullPage: true });
 });
}
