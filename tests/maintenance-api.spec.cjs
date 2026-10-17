const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
async function get(request, query) { const response = await request.get(BASE + '/api/maintenance' + query); expect(response.status()).toBe(200); return response.json(); }
test('full vehicle filters retain general tasks and automatic transmission', async ({ request }) => {
 const data = await get(request, '?fuel=benzyna&drivetrain=4x4&transmission=automatyczna');
 const ids = data.results.map(entry => entry.id);
 for (const id of ['engine-oil', 'brake-fluid', 'brake-inspection', 'tire-rotation', 'transfer-case-fluid', 'transmission-fluid']) expect(ids).toContain(id);
 expect(ids).not.toContain('manual-transmission-fluid');
});
test('two wheel drive excludes transfer case and manual filter accepts Polish spelling', async ({ request }) => {
 const data = await get(request, '?fuel=diesel&drivetrain=2WD&transmission=' + encodeURIComponent('Ręczna'));
 const ids = data.results.map(entry => entry.id);
 expect(ids).toContain('manual-transmission-fluid');
 expect(ids).toContain('brake-inspection');
 expect(ids).not.toContain('transmission-fluid');
 expect(ids).not.toContain('transfer-case-fluid');
 expect(data.query.drivetrain).toBe('rwd');
});
test('unsupported parameters are rejected instead of silently returning no results', async ({ request }) => {
 for (const query of ['?fuel=invalid', '?drivetrain=invalid', '?transmission=invalid', '?severeService=invalid']) expect((await request.get(BASE + '/api/maintenance' + query)).status()).toBe(400);
});
test('unverified intervals and misleading citations are not published', async ({ request }) => {
 for (const query of ['', '?severeService=true']) {
  const data = await get(request, query);
  expect(data.scheduleStatus).toBe('unverified');
  expect(data.results).toHaveLength(10);
  for (const entry of data.results) {
   expect(entry.confidence).toBe('verify');
   expect(entry.source).toBeNull();
   expect(entry.intervalVerified).toBe(false);
   for (const field of ['intervalMiles', 'intervalMonths', 'severeServiceMiles', 'severeServiceMonths']) expect(entry[field]).toBeNull();
  }
 }
});
