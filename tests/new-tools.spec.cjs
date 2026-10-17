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

function contrast(foreground, background) {
 const luminance = color => color.match(/[\d.]+/g).slice(0,3).map(Number).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum,value,index) => sum + value * [.2126,.7152,.0722][index],0);
 const a = luminance(foreground), b = luminance(background); return (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
}
for (const tool of [
 {path:'rpo',placeholder:'Wpisz kod lub szukaną frazę',query:'G80',button:'Sprawdź kody'},
 {path:'diagnostyka',placeholder:'Wpisz kod błędu lub objaw',query:'P0300',button:'Sprawdź kod'},
 {path:'kalkulatory',button:'Porównaj opony'}
]) {
 test('dark readable form and results for ' + tool.path, async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto(BASE + '/narzedzia/' + tool.path);
  const surface = page.locator('[data-tool-theme="dark-v1"]'); await expect(surface).toBeVisible();
  const panel = surface.locator('main > section').first();
  await expect(panel).toHaveCSS('background-color','rgb(23, 29, 37)');
  await expect(panel.locator('h1')).toHaveCSS('color','rgb(250, 250, 250)');
  for (const control of await panel.locator('input,select').all()) {
   await expect(control).toHaveCSS('background-color','rgb(16, 19, 23)');
   await expect(control).toHaveCSS('color','rgb(250, 250, 250)');
   const colors = await control.evaluate(element => {const style = getComputedStyle(element); return [style.color,style.backgroundColor];});
   expect(contrast(...colors)).toBeGreaterThanOrEqual(4.5);
  }
  const button = page.getByRole('button',{name:tool.button,exact:true});
  await expect(button).toHaveCSS('background-color','rgb(231, 185, 94)');
  await expect(button).toHaveCSS('color','rgb(17, 17, 17)');
  if (tool.placeholder) await page.getByPlaceholder(tool.placeholder,{exact:true}).fill(tool.query);
  await button.click();
  const result = tool.path === 'kalkulatory' ? page.getByRole('heading',{name:'Wynik',exact:true}).locator('..') : surface.locator('article').first();
  await expect(result).toBeVisible();
  await expect(result).toHaveCSS('background-color','rgb(23, 29, 37)');
  const text = result.locator('p').first();
  const colors = await text.evaluate(element => [getComputedStyle(element).color,getComputedStyle(element.closest('article') || element.parentElement).backgroundColor]);
  expect(contrast(...colors)).toBeGreaterThanOrEqual(4.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({path:test.info().outputPath(tool.path + '-dark.png'),fullPage:true});
 });
}
