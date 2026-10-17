const { test, expect } = require('@playwright/test');
const { GET, POST } = require('../src/app/api/official-vehicle/route.ts');
const FAKE_VIN = '1GNEK13R9XJ123456';
const req = params => new Request('http://localhost/api/official-vehicle?' + new URLSearchParams(params));
const post = body => new Request('http://localhost/api/official-vehicle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
async function mocked(handler, task) { const original = global.fetch; const calls = []; global.fetch = async (url, options) => { calls.push({ url: new URL(String(url)), options }); return handler(url, options); }; try { await task(calls); } finally { global.fetch = original; } }
const ok = data => ({ ok: true, status: 200, json: async () => data });
test('invalid inputs never call an upstream service', async () => {
 await mocked(() => { throw new Error('Unexpected upstream call'); }, async calls => {
  for (const params of [{ action: 'invalid' }, { action: 'vin', vin: FAKE_VIN, year: '1999' }, { action: 'recalls', year: '2020', make: 'Chevrolet', model: 'Tahoe' }, { action: 'complaints', year: '1999', make: 'Other', model: 'Tahoe' }, { action: 'epaOptions', year: '1999', make: 'Chevrolet' }, { action: 'epaVehicle', id: '../secret' }]) expect((await GET(req(params))).status).toBe(400);
  expect((await POST(post({ action: 'vin', vin: 'INVALID', year: '1999' }))).status).toBe(400);
  expect(calls).toHaveLength(0);
 });
});
test('vPIC uses POST locally, encodes year, disables cache and preserves decoding warnings', async () => {
 const record = { Make: 'CHEVROLET', Model: 'Tahoe', ModelYear: '1999', ErrorCode: '1', ErrorText: 'Synthetic warning', EngineModel: '' };
 await mocked(() => ok({ Results: [record] }), async calls => {
  const response = await POST(post({ action: 'vin', vin: FAKE_VIN.toLowerCase(), year: '1999' })); const body = await response.json();
  expect(response.status).toBe(200); expect(response.headers.get('cache-control')).toBe('no-store'); expect(body.data).toEqual(record);
  expect(calls[0].url.hostname).toBe('vpic.nhtsa.dot.gov'); expect(calls[0].url.pathname).toBe('/api/vehicles/DecodeVinValues/' + FAKE_VIN); expect(calls[0].url.searchParams.get('modelyear')).toBe('1999'); expect(calls[0].url.searchParams.get('format')).toBe('json'); expect(calls[0].options.cache).toBe('no-store'); expect(calls[0].options.next).toBeUndefined(); expect(body.source).not.toContain(FAKE_VIN);
 });
});
test('NHTSA lists use separate recall and complaint issue types', async () => {
 await mocked(() => ok({ results: [{ model: 'C1500 SUBURBAN' }] }), async calls => {
  for (const [action, issue] of [['recallModels', 'r'], ['complaintModels', 'c']]) {
   const response = await GET(req({ action, year: '1999', make: 'Chevrolet' })); const body = await response.json(); const call = calls.at(-1);
   expect(response.status).toBe(200); expect(body.data).toEqual([{ text: 'C1500 SUBURBAN', value: 'C1500 SUBURBAN' }]); expect(call.url.hostname).toBe('api.nhtsa.gov'); expect(call.url.pathname).toBe('/products/vehicle/models'); expect(call.url.searchParams.get('issueType')).toBe(issue); expect(call.url.searchParams.get('modelYear')).toBe('1999'); expect(call.options.next.revalidate).toBe(86400);
  }
 });
});
test('recalls and complaints preserve provider records and selected model', async () => {
 const record = { NHTSACampaignNumber: 'TEST', odiNumber: 123, Summary: 'Synthetic record' };
 await mocked(() => ok({ results: [record] }), async calls => {
  for (const [action, path] of [['recalls', '/recalls/recallsByVehicle'], ['complaints', '/complaints/complaintsByVehicle']]) {
   const response = await GET(req({ action, year: '1999', make: 'GMC', model: 'C1500 SUBURBAN' })); const body = await response.json(); const call = calls.at(-1);
   expect(response.status).toBe(200); expect(body.data).toEqual([record]); expect(call.url.pathname).toBe(path); expect(call.url.searchParams.get('make')).toBe('GMC'); expect(call.url.searchParams.get('model')).toBe('C1500 SUBURBAN'); expect(call.url.searchParams.get('modelYear')).toBe('1999');
  }
 });
});
test('EPA menu normalizes singleton, array and empty responses', async () => {
 for (const [payload, expected] of [[{ menuItem: { text: 'V8 automatic', value: 123 } }, [{ text: 'V8 automatic', value: '123' }]], [{ menuItem: [{ text: 'Variant A', value: '123' }, { text: 'Variant B', value: '456' }] }, [{ text: 'Variant A', value: '123' }, { text: 'Variant B', value: '456' }]], [{}, []]]) {
  await mocked(() => ok(payload), async calls => { const response = await GET(req({ action: 'epaOptions', year: '1999', make: 'Chevrolet', model: 'Tahoe 4WD' })); const body = await response.json(); expect(response.status).toBe(200); expect(body.data).toEqual(expected); expect(calls[0].url.pathname).toBe('/ws/rest/vehicle/menu/options'); expect(calls[0].url.searchParams.get('model')).toBe('Tahoe 4WD'); expect(calls[0].options.headers.Accept).toBe('application/json'); });
 }
});
test('EPA vehicle details remain unchanged and outside-scope records are rejected', async () => {
 for (const [record, status] of [[{ year: '1999', make: 'Chevrolet', model: 'Tahoe 4WD', city08: '11', highway08: '15', comb08: '12' }, 200], [{ year: '2020', make: 'Chevrolet', model: 'Tahoe' }, 422], [{ year: '1999', make: 'Other', model: 'Other' }, 422]]) {
  await mocked(() => ok(record), async calls => { const response = await GET(req({ action: 'epaVehicle', id: '123' })); const body = await response.json(); expect(response.status).toBe(status); expect(calls[0].url.pathname).toBe('/ws/rest/vehicle/123'); if (status === 200) expect(body.data).toEqual(record); else expect(body.error).toBeTruthy(); });
 }
});
test('empty NHTSA response differs from provider and schema failures', async () => {
 const params = { action: 'recalls', year: '1999', make: 'Chevrolet', model: 'Tahoe' };
 await mocked(() => ok({ results: [] }), async () => { const response = await GET(req(params)); expect(response.status).toBe(200); expect((await response.json()).data).toEqual([]); });
 for (const handler of [() => ({ ok: false, status: 429 }), () => { throw new Error('Synthetic timeout'); }, () => ok({ unexpected: [] }), () => ({ ok: true, json: async () => { throw new Error('Not JSON'); } })]) {
  await mocked(handler, async () => { const response = await GET(req(params)); const body = await response.json(); expect(response.status).toBe(502); expect(body.error).toBeTruthy(); expect(body.data).toBeUndefined(); expect(response.headers.get('cache-control')).toBe('no-store'); });
 }
});
test('EPA model list uses model endpoint and malformed menu cannot become an empty success', async () => {
 await mocked(() => ok({ menuItem: [{ text: 'Tahoe 4WD', value: 'Tahoe 4WD' }] }), async calls => { const response = await GET(req({ action: 'epaModels', year: '1999', make: 'Chevrolet' })); expect(response.status).toBe(200); expect(calls[0].url.pathname).toBe('/ws/rest/vehicle/menu/model'); });
 await mocked(() => ok({ menuItem: { text: null, value: 'broken' } }), async () => { const response = await GET(req({ action: 'epaModels', year: '1999', make: 'Chevrolet' })); expect(response.status).toBe(502); expect((await response.json()).data).toBeUndefined(); });
});
