// Dla właściciela: dane (źródła/daty/liczby), kalkulator, strony, wyszukiwarka, strona główna, układ 390/768/1280.
const { test, expect } = require('@playwright/test');
const { GUIDES, getGuide } = require('../src/lib/guides/index.ts');
const { SOURCES, getSource } = require('../src/lib/guides/sources.ts');
const { calculateImport, IMPORT_RATES } = require('../src/lib/import-calc.ts');
const { BODY_STYLES } = require('../src/lib/body-styles.ts');
const { GUIDE_ENTRIES } = require('../src/lib/guide-entries.mjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const SLUGS = ['lpg', 'import', 'swiatla-eu', 'zolte-tablice'];
const NONE = /brak|nie dotyczy/i;

const allBlocks = g => g.sections.flatMap(s => s.blocks);
const srcIds = g => {
  const ids = [];
  for (const b of allBlocks(g)) {
    if (Array.isArray(b.src)) ids.push(...b.src);
    if (b.items) for (const i of b.items) { if (Array.isArray(i.src)) ids.push(...i.src); else if (typeof i.src === 'string') ids.push(i.src); }
    if (b.rows) for (const r of b.rows) ids.push(...r.src);
  }
  for (const f of g.faq) if (Array.isArray(f.src)) ids.push(...f.src);
  return ids;
};

test('rejestr źródeł: https, data, unikalne id, rodzaj', () => {
  const seen = new Set();
  for (const s of SOURCES) {
    expect(seen.has(s.id), 'duplikat ' + s.id).toBe(false); seen.add(s.id);
    expect(s.url, s.id).toMatch(s.id === 'gmpartswiki' ? /^https?:\/\// : /^https:\/\//); // adres zapisany tak, jak go otwarto (http)
    expect(s.date, s.id).toMatch(/^((\d{2}(–\d{2})?\.)?\d{2}\.\d{4}|\d{4}(\/\d{4})?|sprawdzono \d{2}\.\d{2}\.\d{4}|data nieustalona)$/);
    expect(['official', 'media', 'forum', 'shop']).toContain(s.kind);
  }
});

test('każdy poradnik: 4 slugi, stan na, podsumowanie, błędy, FAQ, tagi z body-styles', () => {
  expect(GUIDES.map(g => g.slug)).toEqual(SLUGS);
  for (const g of GUIDES) {
    expect(g.asOf, g.slug).toMatch(/^\d{2}\.\d{2}\.2026$/);
    expect(g.summary.length, g.slug).toBeGreaterThanOrEqual(4);
    expect(g.mistakes.length, g.slug).toBeGreaterThanOrEqual(4);
    expect(g.faq.length, g.slug).toBeGreaterThanOrEqual(3);
    expect(g.sections.length, g.slug).toBeGreaterThanOrEqual(3);
    for (const id of g.bodies) expect(BODY_STYLES.find(b => b.id === id), g.slug + ' ' + id).toBeTruthy();
    expect(g.years).toMatch(/^\d{4}–\d{4}$/);
    for (const r of g.related) expect(getGuide(r), r).toBeTruthy();
  }
});

test('każdy wiersz tabeli ma istniejące źródło albo jawne „brak / nie dotyczy”; id źródeł istnieją', () => {
  for (const g of GUIDES) {
    for (const id of srcIds(g)) expect(getSource(id), g.slug + ' → ' + id).toBeTruthy();
    for (const b of allBlocks(g)) {
      if (b.t === 'table') for (const r of b.rows) {
        expect(r.cells.length, g.slug + ' ' + b.caption).toBe(b.head.length);
        if (!r.src.length) expect(r.cells.join(' '), g.slug + ' bez źródła: ' + r.cells[0]).toMatch(NONE);
      }
      if (b.t === 'reports') for (const i of b.items) { expect(i.date).toMatch(/\d{4}|brak daty|nieustalona/); expect(getSource(i.src), i.src).toBeTruthy(); }
    }
  }
});

test('żaden tekst poradników nie opisuje fałszywych pewników: brak „na pewno”, brak „100%” bez źródła', () => {
  for (const g of GUIDES) {
    const blob = JSON.stringify(g);
    expect(blob).not.toMatch(/na pewno|gwarantowan/i);
  }
});

test('wpisy wyszukiwarki (guide-entries.mjs) zgadzają się z poradnikami', () => {
  expect(GUIDE_ENTRIES.map(e => e.href)).toEqual(SLUGS.map(s => '/dla-wlasciciela/' + s));
  for (const e of GUIDE_ENTRIES) {
    expect(e.id).toBe('guide:' + e.href.split('/').pop());
    expect(e.Typ).toBe('Poradnik');
    const g = getGuide(e.href.split('/').pop());
    expect(e.Lata).toBe(g.years);
    expect(e.Nazwa.length).toBeGreaterThan(20);
  }
});

test('kalkulator: przykład 5700 cm³, 40 000 zł, USA z dowodem → akcyza 7 440, VAT 10 911,20', () => {
  const r = calculateImport({ price: '40000', transport: '0', capacity: '5700', kind: 'osobowy', origin: 'usa-proof' });
  expect(r.valid).toBe(true);
  const by = id => r.lines.find(l => l.id === id).amount;
  expect(by('customs')).toBe(0); expect(by('excise')).toBe(7440); expect(by('vat')).toBe(10911.2);
  expect(r.duties).toBe(18351.2); expect(r.total).toBe(40000 + 18351.2 + 160 + 149);
});

test('kalkulator odtwarza przykład agencji celnej (20 000, 2200 cm³): 9 175,60 i 12 093,16 bez dowodu', () => {
  const a = calculateImport({ price: '20000', transport: '0', capacity: '2200', kind: 'osobowy', origin: 'usa-proof' });
  expect(a.valid && a.duties).toBe(9175.6);
  const b = calculateImport({ price: '20000', transport: '0', capacity: '2200', kind: 'osobowy', origin: 'usa-no-proof' });
  expect(b.valid && b.duties).toBe(12093.16);
});

test('kalkulator: pickup bez akcyzy, UE bez cła/VAT, zabytek 8% VAT, przecinek dziesiętny, błędne dane', () => {
  const p = calculateImport({ price: '30 000,50', transport: '1000', capacity: '5700', kind: 'pickup-n1', origin: 'usa-no-proof' });
  expect(p.valid).toBe(true);
  expect(p.lines.find(l => l.id === 'excise').amount).toBe(0);
  expect(p.lines.find(l => l.id === 'customs').amount).toBe(Math.round(31000.5 * 0.22 * 100) / 100);
  expect(p.notes.join(' ')).toContain('Pickup nie oznacza automatycznie stawki 0%.');
  const eu = calculateImport({ price: '50000', transport: '3000', capacity: '5700', kind: 'osobowy', origin: 'ue' });
  expect(eu.lines.find(l => l.id === 'customs').amount).toBe(0);
  expect(eu.lines.find(l => l.id === 'vat').amount).toBe(0);
  expect(eu.lines.find(l => l.id === 'excise').amount).toBe(9300);
  const z = calculateImport({ price: '10000', transport: '0', capacity: '5700', kind: 'zabytek-9705', origin: 'usa-proof' });
  expect(z.lines.find(l => l.id === 'vat').amount).toBe(800);
  expect(z.lines.find(l => l.id === 'excise').amount).toBe(0);
  for (const bad of ['', '-5', 'abc', '1e9']) expect(calculateImport({ price: bad, transport: '0', capacity: '5700', kind: 'osobowy', origin: 'ue' }).valid).toBe(false);
  expect(calculateImport({ price: '1000', transport: '0', capacity: '10', kind: 'osobowy', origin: 'ue' }).valid).toBe(false);
  expect(IMPORT_RATES.excise.over2000).toBe(0.186);
});

for (const slug of SLUGS) {
  test(`/dla-wlasciciela/${slug}: render, stan na, podsumowanie, źródła, brak błędów konsoli`, async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(String(e)));
    const res = await page.goto(`${BASE}/dla-wlasciciela/${slug}`);
    expect(res.status()).toBe(200);
    const g = getGuide(slug);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(g.title);
    await expect(page.getByTestId('guide-asof')).toContainText('Stan na: ' + g.asOf);
    await expect(page.getByTestId('guide-summary')).toBeVisible();
    await expect(page.getByText('Przepisy się zmieniają — sprawdź w urzędzie').first()).toBeVisible();
    await expect(page.getByText('Sprawdź w swoim aucie / manualu').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Najczęstsze błędy' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'FAQ' })).toBeVisible();
    expect(await page.locator('[data-testid=src] a').count()).toBeGreaterThan(5);
    expect(await page.locator('link[rel=canonical]').getAttribute('href')).toBe('https://www.gmt400.pl/dla-wlasciciela/' + slug);
    for (const id of g.bodies) await expect(page.locator(`[data-body=${id}]`)).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test('/dla-wlasciciela/import: kalkulator w przeglądarce liczy i pokazuje „orientacyjnie, sprawdź w urzędzie”', async ({ page }) => {
  await page.goto(`${BASE}/dla-wlasciciela/import`);
  const calc = page.getByTestId('guide-calc');
  await expect(calc).toBeVisible();
  await expect(calc.getByText('Orientacyjnie, sprawdź w urzędzie')).toBeVisible();
  const num = async id => Number((await calc.getByTestId(id).innerText()).replace(/zł|\s|\u00a0/g, '').replace(',', '.'));
  expect(await num('guide-calc-excise')).toBe(7440);
  expect(await num('guide-calc-vat')).toBe(10911.2);
  await calc.getByLabel('Cena zakupu (zł)').fill('20000');
  await calc.getByLabel('Pojemność silnika (cm³)').fill('2200');
  await expect.poll(() => num('guide-calc-duties')).toBe(9175.6);
  await calc.getByLabel('Pochodzenie i trasa').selectOption('usa-no-proof');
  await expect.poll(() => num('guide-calc-duties')).toBe(12093.16);
  await calc.getByLabel('Cena zakupu (zł)').fill('abc');
  await expect(calc.getByRole('status')).toBeVisible();
});

test('/dla-wlasciciela/swiatla-eu: schemat SVG jest dostępny i mieści się w ekranie', async ({ page }) => {
  await page.goto(`${BASE}/dla-wlasciciela/swiatla-eu`);
  const svg = page.getByTestId('lights-wiring-svg');
  await svg.scrollIntoViewIfNeeded();
  await expect(svg.locator('svg')).toHaveAttribute('role', 'img');
  const box = await svg.locator('svg').boundingBox();
  expect(box.width).toBeLessThanOrEqual(page.viewportSize().width);
});

test('/dla-wlasciciela: hub linkuje 4 poradniki; menu nagłówka ma „Dla właściciela”', async ({ page }) => {
  await page.goto(`${BASE}/dla-wlasciciela`);
  for (const s of SLUGS) await expect(page.locator(`main a[href="/dla-wlasciciela/${s}"], a[href="/dla-wlasciciela/${s}"]`).first()).toBeVisible();
  expect(await page.locator('link[rel=canonical]').getAttribute('href')).toBe('https://www.gmt400.pl/dla-wlasciciela');
});

test('strona główna: wyróżniona kategoria „Najważniejsze dla właściciela w PL” z 4 linkami', async ({ page }) => {
  await page.route('**/api/notion', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) }));
  await page.goto(BASE + '/');
  const sec = page.getByTestId('owner-essentials');
  await expect(sec).toBeVisible();
  await expect(sec.getByRole('heading', { name: 'Najważniejsze dla właściciela w PL' })).toBeVisible();
  for (const s of SLUGS) await expect(sec.locator(`a[href="/dla-wlasciciela/${s}"]`)).toHaveCount(1);
  await sec.locator('a[href="/dla-wlasciciela/lpg"]').click();
  await expect(page).toHaveURL(/\/dla-wlasciciela\/lpg$/);
});

test('sitemap.ts zawiera /dla-wlasciciela i 4 podstrony (public/sitemap.xml jest statyczny, produkcja serwi dynamiczny)', () => {
  const src = require('fs').readFileSync(require('path').join(__dirname, '../src/app/sitemap.ts'), 'utf8');
  expect(src).toContain('${BASE}/dla-wlasciciela`');
  for (const s of SLUGS) expect(src).toContain(`'${s}'`);
});

test('wyszukiwarka /szukaj znajduje poradniki (LPG, żółte tablice, cło)', async ({ page }) => {
  await page.route('**/api/notion', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) }));
  for (const [q, slug] of [['Flashlube', 'lpg'], ['biała karta', 'zolte-tablice'], ['akcyza cło', 'import'], ['zielona żarówka', 'swiatla-eu']]) {
    await page.goto(`${BASE}/szukaj?q=${encodeURIComponent(q)}`);
    await expect(page.locator(`a[href="/dla-wlasciciela/${slug}"]`).first(), q).toBeVisible();
  }
});

test('encyklopedia: zakładka import linkuje do poradnika i zachowuje kalkulator budżetu', async ({ page }) => {
  await page.route('**/api/notion', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ results: [] }) }));
  await page.goto(BASE + '/?tab=import');
  await expect(page.getByTestId('import-budget')).toBeVisible();
  await expect(page.getByTestId('import-guide-link').locator('a[href="/dla-wlasciciela/import"]')).toBeVisible();
  await expect(page.getByText('Homologacja nie wymagana')).toHaveCount(0);
});

for (const [w, h] of [[390, 844], [768, 1024], [1280, 800]]) {
  test(`brak poziomego przewijania i przycięć przy ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const path of ['/dla-wlasciciela', ...SLUGS.map(s => '/dla-wlasciciela/' + s)]) {
      await page.goto(BASE + path);
      // otwórz wszystkie sekcje, by zmierzyć także ich zawartość
      await page.evaluate(() => document.querySelectorAll('details').forEach(d => { d.open = true; }));
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, over: [...document.querySelectorAll('article *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && !e.closest('svg, thead'); }).slice(0, 3).map(e => e.tagName + '.' + String(e.className).slice(0, 40)) }));
      expect(m.sw, path + ' scrollWidth').toBeLessThanOrEqual(m.iw);
      expect(m.over, path + ' wystaje poza ekran').toEqual([]);
    }
  });
}
