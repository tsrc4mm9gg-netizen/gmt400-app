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
const homeAction = (page, href, name) => page.locator('main').getByRole('link', { name, exact: true }).and(page.locator(`a[href="${href}"]`));

async function accordion(page, name) {
  const trigger = page.getByRole('button', { name, exact: true });
  await expect(trigger).toHaveCount(1);
  const panelId = await trigger.getAttribute('aria-controls');
  expect(panelId).toBeTruthy();
  const panel = page.locator(`[id=${JSON.stringify(panelId)}]`);
  await expect(panel).toHaveAttribute('aria-labelledby', await trigger.getAttribute('id'));
  return { trigger, panel };
}

test('home: jeden H1, główne wejścia i akordeony bez przewijania poziomego', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('GMT400');
  await expect(page.locator('h1')).toContainText('Tahoe');
  for (const [href, name] of [
    ['/diagnoza', 'Diagnoza Sprawdź objawy'],
    ['/diy', 'DIY Naprawy krok po kroku'],
    ['/narzedzia/rpo', 'Kody RPO Rozkoduj naklejkę'],
    ['/vin', 'VIN Dekoder VIN'],
    ['/dla-wlasciciela', 'Poradniki LPG, import, światła'],
    ['/moj-samochod', 'Mój samochód Przeglądy, VIN'],
  ]) {
    const link = homeAction(page, href, name);
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  for (const title of ['Najczęstsze problemy', 'Dane serwisowe', 'Poradniki PL', 'Więcej']) {
    const { trigger, panel } = await accordion(page, title);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
  }
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('home: akordeon problemów obsługuje Enter i Spację oraz montuje i usuwa treść', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  const { trigger, panel } = await accordion(page, 'Najczęstsze problemy');
  await expect(page.getByTestId('home-problems')).toHaveCount(0);
  await trigger.focus();
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(page.getByTestId('home-problems')).toBeVisible();
  await noHorizontalScroll(page);
  await expect(trigger).toBeFocused();
  await trigger.press('Space');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await expect(page.getByTestId('home-problems')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(errors).toEqual([]);
});

test('home: wejście VIN prowadzi do dekodera, a VIN w URL daje wynik', async ({ page }) => {
  const errors = await setup(page);
  await page.goto(BASE + '/');
  await homeAction(page, '/vin', 'VIN Dekoder VIN').click();
  await expect(page).toHaveURL(BASE + '/vin');
  await expect(page.getByRole('heading', { level: 1, name: 'Sprawdź swój VIN' })).toBeVisible();
  await page.goto(BASE + '/vin?vin=1GCEK19R9VE112233');
  await expect(page.getByTestId('vin-result')).toBeVisible();
  await expect(page.getByTestId('vin-summary')).toContainText('1997');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('home: aktualne skróty prowadzą do stron, a poradniki PL są dostępne po rozwinięciu', async ({ page }) => {
  await setup(page);
  for (const [href, name] of [
    ['/diagnoza', 'Diagnoza Sprawdź objawy'],
    ['/diy', 'DIY Naprawy krok po kroku'],
    ['/narzedzia/rpo', 'Kody RPO Rozkoduj naklejkę'],
    ['/dla-wlasciciela', 'Poradniki LPG, import, światła'],
    ['/moj-samochod', 'Mój samochód Przeglądy, VIN'],
  ]) {
    await page.goto(BASE + '/');
    await homeAction(page, href, name).click();
    await expect(page).toHaveURL(BASE + href);
  }
  await page.goto(BASE + '/');
  const { trigger, panel } = await accordion(page, 'Poradniki PL');
  await expect(page.getByTestId('owner-essentials')).toHaveCount(0);
  await trigger.click();
  await expect(panel).toBeVisible();
  await expect(page.getByTestId('owner-essentials')).toBeVisible();
  for (const slug of ['lpg', 'import', 'swiatla-eu', 'zolte-tablice']) {
    const link = page.getByTestId('owner-essentials').locator(`a[href="/dla-wlasciciela/${slug}"]`);
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
  }
  await noHorizontalScroll(page);
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

test('sitemap.ts: usterki/DIY/poradniki są, /szukaj (noindex) nie ma, wpisy pochodzą ze wspólnego modułu', () => {
  const src = require('node:fs').readFileSync(path.join(__dirname, '../src/app/sitemap.ts'), 'utf8');
  for (const p of ['/usterki', '/diy', '/poradniki']) expect(src).toContain('${BASE}' + p);
  expect(src).not.toContain('${BASE}/szukaj');
  expect(src).toMatch(/import\s*\{\s*getListEntries\s*\}\s*from\s*['"]@\/lib\/notion-entries['"]/);
  expect(src).toMatch(/await\s+getListEntries\(\)/);
});

test('wspólny moduł pobiera kolejne strony i odrzuca zastąpione wpisy', async () => {
  const { fetchAllEntries } = require('../src/lib/notion-entries.ts');
  const original = global.fetch;
  const calls = [];
  const entry = (id, name, description = '') => ({ id, properties: {
    Nazwa: { title: [{ plain_text: name }] },
    Opis: { rich_text: [{ plain_text: description }] },
  } });
  global.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    calls.push(body);
    return { ok: true, json: async () => body.start_cursor
      ? { results: [entry('active-second', 'Drugi aktywny wpis')], has_more: false, next_cursor: null }
      : { results: [entry('active-first', 'Pierwszy aktywny wpis'), entry('superseded', 'Stary wpis', 'Do usunięcia – zastąpione przez nowy wpis')], has_more: true, next_cursor: 'page-two' } };
  };
  try {
    const entries = await fetchAllEntries('test-placeholder');
    expect(calls).toEqual([{ page_size: 100 }, { page_size: 100, start_cursor: 'page-two' }]);
    expect(entries.map(entry => entry.id)).toEqual(['active-first', 'active-second']);
  } finally {
    global.fetch = original;
  }
});
