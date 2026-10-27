// Strona główna v2: karuzela modeli na górze → skróty → VIN → poradniki PL (kolejność, widoczność nad zgięciem), VIN z adresu, hasła w /szukaj, JSON-LD.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-ux.json');

async function setup(page) {
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ path: FIXTURE, contentType: 'application/json' }));
  return errors;
}
const noHorizontalScroll = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

test('home: jeden H1, kolejność karuzela modeli → skróty (VIN/diagnoza/usterki/DIY) → dekoder VIN → poradniki PL → szukaj', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('GMT400');
  await expect(page.locator('h1')).toContainText('Tahoe');
  const y = async sel => (await page.locator(sel).first().boundingBox()).y;
  const carousel = await y('[data-testid=model-carousel]');
  const quick = await y('[data-testid=home-main-entries]');
  const vin = await y('[data-testid=home-vin-form]');
  const owner = await y('[data-testid=owner-essentials]');
  // karuzela jest pierwszym elementem głównym: przed nią tylko zwarty nagłówek H1
  expect(await y('h1')).toBeLessThan(carousel);
  expect(await y('main h2, [aria-label="Wybór modelu"] h2')).toBeLessThan(carousel);
  expect(carousel).toBeLessThan(quick);
  expect(quick).toBeLessThan(vin);
  expect(vin).toBeLessThan(owner);
  expect(owner).toBeLessThan(await y('[data-testid=home-problems]'));
  expect(await y('[data-testid=home-problems]')).toBeLessThan(await y('#home-search'));
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('home: karuzela modeli widoczna bez przewijania, skróty VIN/Diagnoza/Usterki/DIY tuż pod nią (cele dotyku ≥ 44 px)', async ({ page }) => {
  await setup(page);
  await page.goto(BASE + '/');
  const { width, height: h } = page.viewportSize();
  const c = await page.getByTestId('model-carousel').boundingBox();
  // zdjęcie (16:9) całe nad zgięciem — z zapasem ≥ 20 px na różnice fontów w CI
  expect(c.y + c.width * 9 / 16, 'zdjęcie karuzeli kończy się nad zgięciem').toBeLessThanOrEqual(h - 20);
  expect(c.y, 'karuzela zaczyna się wysoko').toBeLessThan(h * 0.45);
  const list = page.getByTestId('home-main-entries');
  for (const name of ['Sprawdź VIN', 'Diagnoza', 'Usterki', 'DIY']) {
    const b = await list.getByRole('link', { name: new RegExp('^' + name) }).boundingBox();
    expect(b.height, name).toBeGreaterThanOrEqual(44);
    expect(b.width, name).toBeGreaterThanOrEqual(44);
    if (width <= 500) expect(b.y + b.height, name + ' nad zgięciem na telefonie').toBeLessThanOrEqual(h - 20);
  }
  // skróty są małe — karuzela pozostaje dominująca
  const l = await list.boundingBox();
  expect(l.height).toBeLessThan(c.height / 2);
});

test('home: VIN ze spacjami i myślnikami przechodzi na /vin?vin=… i od razu się dekoduje', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  const input = page.locator('#home-vin-input');
  await input.fill('1gcek19r9ve 112233');
  await expect(page.getByTestId('home-vin-form')).toContainText('17 znaków');
  await page.getByTestId('home-vin-cta').click();
  await expect(page).toHaveURL(/\/vin\?vin=1GCEK19R9VE112233$/);
  await expect(page.getByTestId('vin-result')).toBeVisible();
  await expect(page.getByTestId('vin-summary')).toContainText('1997');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('home: Usterki, DIY i cztery poradniki PL prowadzą do właściwych stron', async ({ page }) => {
  await setup(page);
  const main = page.getByTestId('home-main-entries');
  for (const [name, url] of [['Usterki', '/usterki'], ['DIY', '/diy']]) {
    await page.goto(BASE + '/');
    await main.getByRole('link', { name: new RegExp('^' + name) }).click();
    await expect(page).toHaveURL(BASE + url);
  }
  await page.goto(BASE + '/');
  const links = await page.getByTestId('owner-essentials').locator('a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  for (const slug of ['lpg', 'import', 'swiatla-eu', 'zolte-tablice']) expect(links).toContain('/dla-wlasciciela/' + slug);
});

test('/szukaj: przykładowe hasła są linkami, a „suburban spalanie” daje poradnik LPG bez notki o luce', async ({ page }) => {
  await setup(page);
  await page.goto(BASE + '/szukaj');
  const chips = page.getByTestId('search-examples').getByRole('link');
  expect(await chips.count()).toBeGreaterThanOrEqual(4);
  await page.goto(BASE + '/szukaj?q=suburban%20spalanie');
  await expect(page.getByTestId('search-gap-note')).toHaveCount(0);
  await expect(page.locator('main a[href="/dla-wlasciciela/lpg"]').first()).toBeVisible();
});

for (const [q, slug] of [['tahoe lpg', 'lpg'], ['akcyza auto z usa', 'import'], ['czerwone kierunkowskazy usa', 'swiatla-eu'], ['żółte tablice', 'zolte-tablice']]) {
  test(`/szukaj?q=${q}: pierwszy wynik to poradnik ${slug}`, async ({ page }) => {
    await setup(page);
    await page.goto(BASE + '/szukaj?q=' + encodeURIComponent(q));
    const first = page.locator('main a[href^="/dla-wlasciciela/"], main a[href^="/baza/"]').first();
    await expect(first).toHaveAttribute('href', '/dla-wlasciciela/' + slug);
  });
}

test('SEO: poradniki mają tytuł z modelami, kanoniczny adres, Article + FAQPage + BreadcrumbList; strona główna WebSite', async ({ request }) => {
  const types = html => [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1])['@type']);
  for (const slug of ['lpg', 'import', 'swiatla-eu', 'zolte-tablice']) {
    const html = await (await request.get(`${BASE}/dla-wlasciciela/${slug}`)).text();
    expect(html).toMatch(/<title>[^<]*(Tahoe|Suburban)[^<]*<\/title>/);
    expect(html).toContain(`<link rel="canonical" href="https://www.gmt400.pl/dla-wlasciciela/${slug}"`);
    expect(types(html).sort()).toEqual(['Article', 'BreadcrumbList', 'FAQPage']);
  }
  const home = await (await request.get(BASE + '/')).text();
  expect(types(home)).toEqual(['WebSite']);
  expect(home).toMatch(/<meta name="description" content="[^"]*Tahoe[^"]*Suburban[^"]*"/);
  const szukaj = await (await request.get(BASE + '/szukaj')).text();
  expect(szukaj).toMatch(/<title>Szukaj w bazie wiedzy \| GMT400<\/title>/);
  expect(szukaj).toContain('noindex');
});

test('sitemap.ts: usterki/DIY/poradniki są, /szukaj (noindex) nie ma, baza jest pobierana ze stronicowaniem bez wpisów „do usunięcia”', () => {
  const src = require('node:fs').readFileSync(path.join(__dirname, '../src/app/sitemap.ts'), 'utf8');
  for (const p of ['/usterki', '/diy', '/poradniki']) expect(src).toContain('${BASE}' + p);
  expect(src).not.toContain('${BASE}/szukaj');
  expect(src).toContain('start_cursor');
  expect(src).toContain('isSuperseded');
});
