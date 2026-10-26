// Strona główna v2: VIN → usterki/DIY → poradniki PL (kolejność, widoczność na 390 px), VIN z adresu, hasła w /szukaj, JSON-LD.
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

test('home: jeden H1, kolejność VIN → usterki/DIY → poradniki PL → szukaj → modele', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('GMT400');
  await expect(page.locator('h1')).toContainText('Tahoe');
  const y = async sel => (await page.locator(sel).first().boundingBox()).y;
  const vin = await y('[data-testid=home-vin-form]');
  const entries = await y('[data-testid=home-main-entries]');
  const owner = await y('[data-testid=owner-essentials]');
  expect(vin).toBeLessThan(entries);
  expect(entries).toBeLessThan(owner);
  expect(owner).toBeLessThan(await y('h2:has-text("Wybierz model")'));
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('home: VIN, Usterki i DIY widoczne bez przewijania (viewport telefonu), cele dotyku ≥ 44 px', async ({ page }) => {
  await setup(page);
  await page.goto(BASE + '/');
  const h = page.viewportSize().height;
  if (page.viewportSize().width > 500) test.skip(true, 'sprawdzenie „nad zgięciem” dotyczy telefonu');
  for (const id of ['home-vin-cta']) {
    const b = await page.getByTestId(id).boundingBox();
    expect(b.y + b.height, id).toBeLessThanOrEqual(h);
    expect(b.height).toBeGreaterThanOrEqual(44);
  }
  const list = page.getByTestId('home-main-entries');
  for (const name of ['Usterki', 'DIY']) {
    const b = await list.getByRole('link', { name: new RegExp('^' + name) }).boundingBox();
    expect(b.y + b.height, name).toBeLessThanOrEqual(h);
    expect(b.height).toBeGreaterThanOrEqual(44);
  }
  // początek sekcji „Najważniejsze dla właściciela w PL” jest już widoczny tuż pod spodem
  expect((await page.getByTestId('owner-essentials').boundingBox()).y).toBeLessThan(h);
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
