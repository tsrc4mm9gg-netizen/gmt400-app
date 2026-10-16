const { test, expect } = require('@playwright/test');
const ORIGIN = 'https://www.gmt400.pl';
const ID = '3fad7bf1-c139-8122-90d6-dbb1bf5d3cb9';
const clean = value => String(value || '').replace(/-/g, '').toLowerCase();
test('real production instruction has its visible title, original text and no missing-body warning', async ({ page, request }, info) => {
  const pageErrors = [];
  const snapshot = { origin: ORIGIN, articleId: ID, apiStatus: null, pageStatus: null, expectedTitle: '', finalUrl: '', h1: [], pageErrors };
  page.on('pageerror', error => pageErrors.push(error.message.slice(0, 1500)));
  try {
    const api = await request.get(ORIGIN + '/api/notion', { timeout: 30000 });
    snapshot.apiStatus = api.status();
    expect(api.ok()).toBe(true);
    const data = await api.json();
    expect(data.complete).toBe(true);
    expect(Array.isArray(data.results)).toBe(true);
    const entry = data.results.find(item => clean(item.id) === clean(ID));
    expect(entry).toBeTruthy();
    expect(typeof entry.Nazwa).toBe('string');
    expect(entry.Nazwa.trim().length).toBeGreaterThan(0);
    expect(typeof entry.Rozwiązanie).toBe('string');
    expect(entry.Rozwiązanie.trim().length).toBeGreaterThan(0);
    snapshot.expectedTitle = entry.Nazwa;
    const response = await page.goto(ORIGIN + '/baza/' + ID, { waitUntil: 'domcontentloaded', timeout: 45000 });
    snapshot.pageStatus = response?.status() ?? null;
    expect(snapshot.pageStatus).toBe(200);
    const title = page.getByRole('heading', { name: entry.Nazwa, exact: true, level: 1 });
    await expect(title).toHaveCount(1);
    await expect(title).toBeVisible();
    const article = page.locator('article').filter({ has: title });
    await expect(article).toHaveCount(1);
    await expect(article.getByText(entry.Rozwiązanie, { exact: true })).toBeVisible();
    await expect(article.getByRole('alert').filter({ hasText: 'Nie udało się pobrać dodatkowej zawartości strony Notion.' })).toHaveCount(0);
    expect(pageErrors).toEqual([]);
  } finally {
    snapshot.finalUrl = page.url();
    try { snapshot.h1 = await page.locator('h1').allTextContents(); } catch {}
    await info.attach('production-entry-diagnostics', { body: JSON.stringify(snapshot, null, 2), contentType: 'application/json' });
    try { await page.screenshot({ path: info.outputPath('production-instruction.png'), fullPage: true }); } catch {}
  }
});
