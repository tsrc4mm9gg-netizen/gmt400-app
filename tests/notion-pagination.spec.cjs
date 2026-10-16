const { test, expect } = require('@playwright/test');
const { GET } = require('../src/app/api/notion/route.ts');
const entry = n => ({ id: `fixture-${n}`, properties: { Nazwa: { title: [{ plain_text: 'Instrukcja ' }, { plain_text: String(n) }] }, Typ: { select: { name: 'Porada' } }, Model: { select: { name: 'Wszystkie' } }, Rozwiązanie: { rich_text: [{ plain_text: 'Pełna treść testowa' }] } } });
test('API returns all 501 materials and concatenates title fragments', async () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.NOTION_TOKEN;
  const calls = [];
  process.env.NOTION_TOKEN = 'pagination-test-placeholder';
  global.fetch = async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    const start = body.start_cursor ? Number(body.start_cursor) : 0;
    const end = Math.min(start + 100, 501);
    return { ok: true, json: async () => ({ results: Array.from({ length: end - start }, (_, index) => entry(start + index)), has_more: end < 501, next_cursor: end < 501 ? String(end) : null }) };
  };
  try {
    const response = await GET();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.count).toBe(501);
    expect(data.results).toHaveLength(501);
    expect(data.complete).toBe(true);
    expect(data.results[500].Nazwa).toBe('Instrukcja 500');
    expect(data.results[500].Rozwiązanie).toBe('Pełna treść testowa');
    expect(calls).toHaveLength(6);
    expect(calls[5].start_cursor).toBe('500');
  } finally { global.fetch = originalFetch; if (originalToken === undefined) delete process.env.NOTION_TOKEN; else process.env.NOTION_TOKEN = originalToken; }
});
test('repeated cursor fails explicitly instead of returning an incomplete successful list', async () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.NOTION_TOKEN;
  let calls = 0;
  process.env.NOTION_TOKEN = 'pagination-test-placeholder';
  global.fetch = async () => { calls++; return { ok: true, json: async () => ({ results: [entry(calls)], has_more: true, next_cursor: 'repeated-cursor' }) }; };
  try {
    const response = await GET();
    expect(response.status).toBe(502);
    const data = await response.json();
    expect(data.error).toContain('paginacja');
    expect(data.results).toBeUndefined();
    expect(calls).toBe(2);
  } finally { global.fetch = originalFetch; if (originalToken === undefined) delete process.env.NOTION_TOKEN; else process.env.NOTION_TOKEN = originalToken; }
});
