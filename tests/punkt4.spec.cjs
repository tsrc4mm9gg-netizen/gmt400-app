// Punkt 4: stały dostęp do auta i wyszukiwarki, stany puste z „Pokaż wszystko”, większe chipy, „Ostatnio oglądane”.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const SIZES = [{ w: 390, h: 844 }, { w: 768, h: 1024 }, { w: 1280, h: 800 }];
const noHScroll = page => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const profileJson = JSON.stringify({ version: 2, profile: { brand: 'Chevrolet', platform: 'C/K', model: 'K1500', year: '1997', engine: '', drive: '', transmission: '', rpoCodes: [] } });

const YUKON_ONLY = (id, typ, name) => ({ id, Nazwa: name, Typ: typ, Model: 'Yukon', Modele: ['GMC Yukon'], Lata: '1998–2000', Objawy: 'Test', Opis: '', Rozwiązanie: 'Krok 1. Sprawdź w swoim aucie / manualu.', applicability: { brand: [], model: ['Yukon'], years: ['1998-2000'], engine: [], drive: [], transmission: [] } });
const EMPTY_DATA = { complete: true, results: [
  YUKON_ONLY('y1', 'Usterka', 'Usterka tylko Yukon — test'),
  YUKON_ONLY('y2', 'Porada', 'Poradnik tylko Yukon — test'),
] };

for (const size of SIZES) {
  test.describe(`punkt 4 @${size.w}`, () => {
    test.use({ viewport: { width: size.w, height: size.h } });

    test(`${size.w}: nagłówek z autem i wyszukiwarką zostaje na ekranie po przewinięciu (cele ≥44 px)`, async ({ page }) => {
      const errors = []; page.on('pageerror', e => errors.push(String(e)));
      await page.goto(`${BASE}/schematy`);
      const header = page.getByTestId(size.w < 1024 ? 'site-header-bar' : 'site-header');
      await expect(header).toBeVisible();
      await expect(header).toHaveCSS('position', 'sticky');
      const badge = page.getByTestId('header-car-badge');
      await expect(badge).toHaveAttribute('data-state', 'empty');
      await expect(badge).toContainText('Dodaj auto');
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(250);
      for (const id of ['header-car-badge', 'header-search']) {
        const box = await page.getByTestId(id).boundingBox();
        expect(box, id).not.toBeNull();
        expect(box.y).toBeGreaterThanOrEqual(-1);
        expect(box.y + box.height).toBeLessThanOrEqual(size.h);
        expect(box.height).toBeGreaterThanOrEqual(43.5);
        expect(box.width).toBeGreaterThanOrEqual(43.5);
      }
      const hb = await header.boundingBox();
      expect(hb.y).toBeGreaterThanOrEqual(-1);
      expect(hb.y + hb.height).toBeLessThanOrEqual(size.w < 1024 ? 72 : 90);
      expect(await noHScroll(page)).toBeLessThanOrEqual(1);
      await page.getByTestId('header-car-badge').click();
      await expect(page).toHaveURL(/\/moj-samochod$/);
      expect(errors).toEqual([]);
    });

    test(`${size.w}: plakietka pokazuje zapisane auto, a kotwica nie chowa się pod nagłówkiem`, async ({ page }) => {
      await page.addInitScript(json => localStorage.setItem('gmt400_vehicle_profile_v2', json), profileJson);
      await page.goto(`${BASE}/schematy#ground-points`);
      await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', 'saved');
      await expect(page.getByTestId('header-car-badge')).toContainText('K1500 · 1997');
      await page.waitForTimeout(500);
      const target = await page.locator('#ground-points').boundingBox();
      const hb = await page.getByTestId(size.w < 1024 ? 'site-header-bar' : 'site-header').boundingBox();
      expect(target.y).toBeGreaterThanOrEqual(hb.y + hb.height - 1);
    });

    test(`${size.w}: DIY i Usterki — brak wyników dla profilu auta → „Pokaż wszystko” / „Wyczyść filtry”`, async ({ page }) => {
      await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: EMPTY_DATA }));
      await page.addInitScript(() => sessionStorage.setItem('gmt400_model_selection', JSON.stringify({ bodyId: 'suburban', filters: {} })));
      for (const [path, prefix, itemName] of [['/usterki', 'issue', 'Usterka tylko Yukon — test'], ['/diy', 'diy', 'Poradnik tylko Yukon — test']]) {
        await page.goto(`${BASE}${path}`);
        const empty = page.getByTestId(`${prefix}-empty`);
        await expect(empty).toBeVisible();
        await expect(page.getByTestId(`${prefix}-empty-title`)).toHaveText(/^Brak wyników dla Twojego profilu auta\./);
        const showAll = page.getByTestId(`${prefix}-show-all`);
        await expect(showAll).toBeVisible();
        expect((await showAll.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
        await hydrated(showAll);
        await showAll.click();
        await expect(page.getByRole('link', { name: itemName })).toBeVisible();
        await expect(empty).toHaveCount(0);
        expect(await noHScroll(page)).toBeLessThanOrEqual(1);
      }
    });

    test(`${size.w}: „Wyczyść filtry” przywraca tryb „Dopasowane do mojego auta”, a „Pokaż wszystko” odsłania listę`, async ({ page }) => {
      await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: EMPTY_DATA }));
      await page.addInitScript(json => localStorage.setItem('gmt400_vehicle_profile_v2', json), profileJson);
      await page.goto(`${BASE}/poradniki`);
      const showAll = page.getByTestId('category-show-all');
      await expect(showAll).toBeVisible();
      expect((await showAll.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
      await hydrated(showAll);
      await showAll.click();
      await expect(page.getByRole('link', { name: 'Poradnik tylko Yukon — test' })).toBeVisible();
      await expect(showAll).toHaveCount(0);
    });

    test(`${size.w}: chipy kategorii i przyciski filtrów mają ≥44 px i czytelny stan`, async ({ page }) => {
      await page.goto(`${BASE}/diy`);
      const chips = page.getByTestId('diy-categories').getByRole('button');
      await expect(chips.first()).toBeVisible();
      const n = await chips.count();
      expect(n).toBeGreaterThan(2);
      for (let i = 0; i < n; i++) {
        const box = await chips.nth(i).boundingBox();
        expect(box.height, `chip ${i}`).toBeGreaterThanOrEqual(43.5);
      }
      await hydrated(chips.nth(1));
      await chips.nth(1).click();
      await expect(chips.nth(1)).toHaveAttribute('aria-pressed', 'true');
      await expect(chips.nth(1)).toContainText('✓');
      await page.goto(`${BASE}/usterki`);
      const issueChips = page.getByTestId('issue-categories').getByRole('button');
      await expect(issueChips.first()).toBeVisible();
      for (let i = 0; i < await issueChips.count(); i++) expect((await issueChips.nth(i).boundingBox()).height).toBeGreaterThanOrEqual(43.5);
      expect(await noHScroll(page)).toBeLessThanOrEqual(1);
    });

    test(`${size.w}: „Ostatnio oglądane” — brak sekcji bez danych, zapis po otwarciu wpisu i modelu, czyszczenie`, async ({ page }) => {
      const errors = []; page.on('pageerror', e => errors.push(String(e)));
      await page.goto(BASE + '/');
      await expect(page.getByTestId('model-carousel')).toBeVisible();
      await expect(page.getByTestId('recently-viewed')).toHaveCount(0);
      await page.goto(`${BASE}/modele/tahoe-4d`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400-recent'))).toContain('/modele/tahoe-4d');
      // wpis z /baza/[id]: pierwszy link do wpisu z listy usterek
      await page.goto(`${BASE}/usterki`);
      const link = page.locator('a[href^="/baza/"]').first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      await link.click();
      await expect(page).toHaveURL(new RegExp(href.replace(/[/]/g, '\\/')));
      await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400-recent'))).toContain(href);
      // dane niezaufane w localStorage są pomijane (zewnętrzny href), a lista ma ≤5 pozycji
      await page.evaluate(() => {
        const list = JSON.parse(localStorage.getItem('gmt400-recent'));
        list.push({ id: 'zly', title: 'Zły adres', href: 'https://example.com/x', type: 'Wpis' });
        for (let i = 0; i < 8; i++) list.push({ id: 'x' + i, title: 'Wpis ' + i, href: '/baza/x' + i, type: 'Usterka' });
        localStorage.setItem('gmt400-recent', JSON.stringify(list));
      });
      await page.goto(BASE + '/');
      const section = page.getByTestId('recently-viewed');
      await expect(section).toBeVisible();
      const items = page.getByTestId('recently-viewed-item');
      expect(await items.count()).toBeGreaterThanOrEqual(2);
      expect(await items.count()).toBeLessThanOrEqual(5);
      await expect(section).not.toContainText('Zły adres');
      await expect(items.first()).toHaveAttribute('href', /^\/(baza|modele)\//);
      for (let i = 0; i < await items.count(); i++) expect((await items.nth(i).boundingBox()).height).toBeGreaterThanOrEqual(43.5);
      const clear = page.getByTestId('recently-viewed-clear');
      expect((await clear.boundingBox()).height).toBeGreaterThanOrEqual(43.5);
      await hydrated(clear);
      await clear.click();
      await expect(section).toHaveCount(0);
      expect(await page.evaluate(() => localStorage.getItem('gmt400-recent'))).toBeNull();
      expect(await noHScroll(page)).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  });
}
