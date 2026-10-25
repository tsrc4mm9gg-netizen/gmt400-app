// Listy (/usterki, /diy, /modele, /poradniki, /baza) muszą być w HTML z serwera (Google), bez „Ładowanie…”, bez ostrzeżeń hydratacji.
// Wymaga danych Notion po stronie serwera: produkcja albo lokalnie `node tests/helpers/mock-notion.mjs` + build z NOTION_API_BASE.
// Bez tych danych (lokalny serwer bez tokenu) testy się pomijają, a SSR_LISTS=1 wymusza ich wykonanie.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const PAGES = [
  ['/usterki', 'Usterka', true], ['/diy', 'Porada', true], ['/modele', 'Model', true], ['/poradniki', 'Porada', true], ['/baza', '', false],
];
const linkCount = html => (html.match(/href="\/baza\/[0-9a-f-]{36}"/g) || []).length;

for (const [path, , hasItemList] of PAGES) {
  test(`SSR ${path}: wpisy i linki /baza/[id] w HTML serwera, canonical, ItemList`, async ({ request }) => {
    const res = await request.get(BASE + path);
    expect(res.status()).toBe(200);
    const html = await res.text();
    test.skip(!process.env.SSR_LISTS && linkCount(html) === 0, 'serwer nie ma danych Notion (brak tokenu) – SSR list pominięty');
    expect(linkCount(html)).toBeGreaterThanOrEqual(10);
    expect(html).not.toMatch(/role="status"[^>]*>Ładowanie/);
    expect(html).toMatch(/<link rel="canonical" href="https:\/\/www\.gmt400\.pl[^"]*"/);
    expect(html).toMatch(/<title>[^<]{15,}<\/title>/);
    if (hasItemList) {
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
      const list = blocks.find(b => b['@type'] === 'ItemList');
      expect(list, 'brak JSON-LD ItemList').toBeTruthy();
      expect(list.numberOfItems).toBe(list.itemListElement.length);
      expect(list.itemListElement.length).toBeGreaterThanOrEqual(10);
      for (const el of list.itemListElement.slice(0, 5)) {
        expect(el.url).toMatch(/^https:\/\/www\.gmt400\.pl\/baza\/[0-9a-f-]{36}$/);
        expect(el.name.length).toBeGreaterThan(3);
      }
    }
  });
}

test('SSR: lista widoczna przy wyłączonym JS (/usterki, /diy)', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });
  const page = await context.newPage();
  for (const path of ['/usterki', '/diy']) {
    await page.goto(BASE + path);
    const links = await page.locator('main a[href^="/baza/"]').count();
    test.skip(!process.env.SSR_LISTS && links === 0, 'serwer nie ma danych Notion');
    expect(links).toBeGreaterThanOrEqual(10);
    await expect(page.locator('main a[href^="/baza/"]').first()).toBeVisible();
  }
  await context.close();
});

test('SSR: hydratacja bez błędów/ostrzeżeń w konsoli i bez przesunięć układu (CLS)', async ({ page }) => {
  const messages = [];
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) messages.push(m.text()); });
  page.on('pageerror', e => messages.push('pageerror: ' + e.message));
  await page.setViewportSize({ width: 390, height: 800 });
  await page.addInitScript(() => {
    window.__cls = 0;
    try { new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
  });
  for (const path of ['/usterki', '/diy', '/modele', '/poradniki']) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${path} przewija się w poziomie`).toBeLessThanOrEqual(1);
  }
  expect(messages.filter(m => !/Failed to load resource|\/api\/notion|NOTION/i.test(m))).toEqual([]);
  expect(await page.evaluate(() => window.__cls)).toBeLessThan(0.1);
});
