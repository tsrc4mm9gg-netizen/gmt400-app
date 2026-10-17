const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const tire = { tool:'tire', width:'265', aspect:'75', rim:'16', oldWidth:'235', oldAspect:'75', oldRim:'16', speed:'60', axleRatio:'3.73' };
const get = (request, path, params) => request.get(BASE + '/api/' + path + '?' + new URLSearchParams(params));
test('tire calculation matches independent geometry and supports zero speed', async ({ request }) => {
 const response = await get(request, 'calculators', tire); expect(response.status()).toBe(200); const data = await response.json();
 const oldD = 16 * 25.4 + 2 * 235 * .75, newD = 16 * 25.4 + 2 * 265 * .75;
 expect(data.oldTireDiameterMm).toBeCloseTo(oldD, 1); expect(data.newTireDiameterMm).toBeCloseTo(newD, 1);
 expect(data.actualSpeedAtIndicatedSpeed).toBeCloseTo(60 * newD / oldD, 1); expect(data.effectiveAxleRatio).toBeCloseTo(3.73 * oldD / newD, 3);
 const stopped = await get(request, 'calculators', { ...tire, speed:'0' }); expect((await stopped.json()).actualSpeedAtIndicatedSpeed).toBe(0);
});
test('tire calculator rejects negative blank nonnumeric and overflowing inputs', async ({ request }) => {
 for (const patch of [{ speed:'-1' }, { axleRatio:'-3' }, { axleRatio:'0' }, { oldWidth:'' }, { width:'0' }, { rim:'abc' }, { width:'Infinity' }, { width:'1e308', aspect:'1e308' }]) expect((await get(request, 'calculators', { ...tire, ...patch })).status()).toBe(400);
 expect((await get(request, 'calculators', { tool:'unknown' })).status()).toBe(400);
});
test('gear ratio returns independently calculated speeds and rejects zero divisor', async ({ request }) => {
 const params = { tool:'gear-ratio', tireDiameterInches:'31.6', engineRpm:'2000', transmissionRatio:'1', axleRatio:'3.73' };
 const response = await get(request, 'calculators', params); expect(response.status()).toBe(200); const data = await response.json();
 const expected = 2000 * 31.6 / (3.73 * 336.13); expect(data.speedMph).toBeCloseTo(expected, 1); expect(data.speedKmh).toBeCloseTo(expected * 1.609344, 1);
 for (const value of ['0', '-1', '', 'NaN']) expect((await get(request, 'calculators', { ...params, transmissionRatio:value })).status()).toBe(400);
});
test('compression ratio handles dome dish and rejects invalid chamber or gasket', async ({ request }) => {
 const params = { tool:'compression-ratio', cylinderVolumeCc:'716', combustionChamberCc:'64', gasketVolumeCc:'8' };
 for (const dome of [0, 5, -5]) { const response = await get(request, 'calculators', { ...params, pistonDomeCc:String(dome) }); expect(response.status()).toBe(200); const data = await response.json(); expect(data.compressionRatio).toBeCloseTo((716 + 72 - dome) / (72 - dome), 2); }
 for (const patch of [{ gasketVolumeCc:'-8' }, { combustionChamberCc:'0' }, { pistonDomeCc:'100' }, { pistonDomeCc:'' }]) expect((await get(request, 'calculators', { ...params, ...patch })).status()).toBe(400);
});
test('all five unit conversions round trip including Polish decimal comma', async ({ request }) => {
 for (const [type, factor] of Object.entries({ length:1.609344, volume:3.785411784, pressure:.0689475729, mass:.45359237, torque:1.35581795 })) {
  const response = await get(request, 'units', { type, value:'12,5' }); expect(response.status()).toBe(200); const data = await response.json(); expect(data.output.value).toBeCloseTo(12.5 * factor, 5);
  const reversed = await get(request, 'units', { type, value:String(data.output.value), reverse:'true' }); expect(reversed.status()).toBe(200); expect((await reversed.json()).output.value).toBeCloseTo(12.5, 4);
 }
});
test('unit converter rejects inherited properties bad direction and overflow', async ({ request }) => {
 for (const params of [{ type:'__proto__', value:'1' }, { type:'constructor', value:'1' }, { type:'toString', value:'1' }, { type:'mass', value:'' }, { type:'volume', value:'1e308' }, { type:'mass', value:'1', reverse:'yes' }]) expect((await get(request, 'units', params)).status()).toBe(400);
});
test('RPO rejects malformed limits and honors valid limit', async ({ request }) => {
 for (const limit of ['-1', '0', '1.5', '201', 'abc', '']) expect((await get(request, 'rpo', { q:'G80 Z71', limit })).status()).toBe(400);
 const response = await get(request, 'rpo', { q:'G80 Z71', limit:'1' }); expect(response.status()).toBe(200); expect((await response.json()).results).toHaveLength(1);
});
test('diagnostic search handles Polish accents and combines query with system', async ({ request }) => {
 const response = await get(request, 'diagnostics', { q:'wypadanie zaplonow', system:'OBD-II' }); expect(response.status()).toBe(200); expect((await response.json()).results.some(item => item.code === 'P0300')).toBe(true);
 const excluded = await get(request, 'diagnostics', { q:'P0300', system:'OBD-I' }); expect((await excluded.json()).results).toHaveLength(0);
 expect((await get(request, 'diagnostics', { q:'P0300', system:'bad' })).status()).toBe(400);
});
test('parts API separates no local match from real validation errors', async ({ request }) => {
 const response = await get(request, 'parts', { model:'Suburban 1500', year:'1999', engine:'5.7L V8', drivetrain:'2wd' }); expect(response.status()).toBe(200); const data = await response.json(); expect(data.results).toHaveLength(0); expect(data.externalCatalogs).toHaveLength(1); expect(data.externalCatalogs[0].drivetrain).toBe('2wd'); expect(data.coverage.completePartsCatalog).toBe(false);
 expect((await get(request, 'parts', { year:'2001' })).status()).toBe(400); expect((await get(request, 'parts', { drivetrain:'unknown' })).status()).toBe(400);
});
for (const path of ['kalkulatory', 'diagnostyka', 'rpo', 'czesci', 'historia-vin', 'dane-pojazdu']) {
 test('tool page loads without horizontal overflow at 390px: ' + path, async ({ page }) => {
  await page.setViewportSize({ width:390, height:844 }); const errors = []; page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(BASE + '/narzedzia/' + path); expect(response.status()).toBe(200); await expect(page.getByRole('heading', { level:1 }).first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true); expect(errors).toEqual([]);
 });
}
