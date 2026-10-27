// Etap 2: „Najczęstsze problemy” na stronie głównej + nagłówek wpisu /baza/[id] (poziom trudności, czas, aktualizacja).
// Chromium + WebKit; telefon 390, 768 i komputer 1280.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const STACYJKA = '404d7bf1-c139-81cc-bc2b-fd3bf56e2ef7'; // wpis z jawnym „Czas robocizny wg GM” (fixture notion-ssr.json)

async function guard(page) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text()) && !benign(message.text())) errors.push('console: ' + message.text()); });
  return errors;
}
const noHorizontalScroll = async page => expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);

for (const width of [390, 768, 1280]) {
  test(`home ${width}: „Najczęstsze problemy” — 3–6 zwartych kafli z ikonami, bez poziomego przewijania`, async ({ page }) => {
    const errors = await guard(page);
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    await page.goto(BASE + '/');
    const section = page.getByTestId('home-problems');
    await expect(section.getByRole('heading', { name: 'Najczęstsze problemy' })).toBeVisible();
    const tiles = section.locator('ul > li > a');
    const n = await tiles.count();
    expect(n).toBeGreaterThanOrEqual(3);
    expect(n).toBeLessThanOrEqual(6);
    for (let i = 0; i < n; i++) {
      const tile = tiles.nth(i);
      await expect(tile.locator('svg')).toHaveCount(1); // ikona wektorowa
      const box = await tile.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeLessThan(150);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      expect(await tile.getAttribute('href')).toMatch(/^\/diagnoza\?objaw=[a-z-]+(&[a-z]+=[a-z0-9-]+)*$/);
    }
    // kolejność: karuzela modeli → właściciel → problemy → wyszukiwarka
    const y = async sel => (await page.locator(sel).first().boundingBox()).y;
    expect(await y('[data-testid=owner-essentials]')).toBeLessThan(await y('[data-testid=home-problems]'));
    expect(await y('h2:has-text("Wybierz model")')).toBeLessThan(await y('[data-testid=owner-essentials]'));
    expect(await y('[data-testid=home-problems]')).toBeLessThan(await y('#home-search'));
    await noHorizontalScroll(page);
    expect(errors).toEqual([]);
  });
}

test('home: każdy kafel „Najczęstsze problemy” otwiera gotowy wynik /diagnoza (z przyczynami i linkami do wpisów)', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  const hrefs = await page.getByTestId('home-problems').locator('ul > li > a').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThanOrEqual(3);
  await hydrated(page.getByTestId('home-vin-cta'));
  await page.getByTestId('home-problems').locator('ul > li > a').first().click();
  await expect(page).toHaveURL(BASE + hrefs[0]);
  await expect(page.getByTestId('diagnoza-tool')).toBeVisible();
  for (const href of hrefs) {
    await page.goto(BASE + href);
    await expect(page.getByTestId('cause-list')).toBeVisible();
    expect(await page.getByTestId('cause-list').locator('> li').count(), href).toBeGreaterThanOrEqual(2);
    expect(await page.getByTestId('cause-link').count(), href).toBeGreaterThanOrEqual(2);
    await expect(page.getByTestId('results-count'), href).toBeVisible();
    // odpowiedzi z adresu są zaznaczone
    const answers = [...new URL(BASE + href).searchParams].filter(([k]) => k !== 'objaw');
    for (const [q, o] of answers) await expect(page.getByTestId(`option-${q}-${o}`), `${href}: ${q}=${o}`).toHaveAttribute('aria-pressed', 'true');
  }
  expect(errors).toEqual([]);
});

test('home: paleta „Najczęstsze problemy” — brak czerwieni, bursztynu, żółci i zieleni', async ({ page }) => {
  await page.goto(BASE + '/');
  const bad = await page.evaluate(() => {
    const parse = value => { const m = value.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
    const found = [];
    for (const el of document.querySelector('[data-testid=home-problems]').querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'outlineColor']) {
        const c = parse(cs[prop]); if (!c || c[3] < 0.2) continue;
        const [r, g, b] = c.slice(0, 3).map(v => v / 255);
        const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
        if (max < 0.25 || d / (max || 1) < 0.3) continue;
        let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h = (h * 60 + 360) % 360;
        if (h < 200 || h > 340) found.push(`${el.tagName}.${prop}=${cs[prop]}`);
      }
    }
    return found;
  });
  expect(bad).toEqual([]);
});

for (const width of [390, 768, 1280]) {
  test(`/baza/[id] ${width}: nagłówek — czas (z treści wpisu, „orientacyjnie”), trudność z Notion, data aktualizacji, tagi modelu`, async ({ page }) => {
    test.skip(!process.env.SSR_LISTS, 'wpis /baza/[id] wymaga danych Notion po stronie serwera (build z mockiem)');
    const errors = await guard(page);
    await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
    await page.goto(`${BASE}/baza/${STACYJKA}`);
    const meta = page.getByTestId('entry-meta');
    await expect(meta).toBeVisible();
    await expect(page.getByTestId('entry-meta-trudnosc')).toContainText('Poziom trudności');
    await expect(page.getByTestId('entry-meta-trudnosc')).toContainText('Średni');
    await expect(page.getByTestId('entry-meta-czas')).toContainText('Szacowany czas');
    await expect(page.getByTestId('entry-meta-czas')).toContainText('0,4 h');
    await expect(page.getByTestId('entry-meta-czas')).toContainText('orientacyjnie');
    await expect(page.getByTestId('entry-meta-aktualizacja')).toContainText('Ostatnia aktualizacja');
    await expect(page.getByTestId('entry-meta-aktualizacja')).toContainText(/\d{2}\.\d{2}\.\d{4}/);
    const box = await meta.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    await noHorizontalScroll(page);
    expect(errors).toEqual([]);
  });
}

test('/baza/[id]: wpis bez czasu i trudności pokazuje tylko datę aktualizacji (bez wymyślonych wartości)', async ({ page }) => {
  test.skip(!process.env.SSR_LISTS, 'wymaga danych Notion po stronie serwera (build z mockiem)');
  await page.goto(`${BASE}/baza/00000000-0000-4000-8000-000000000001`);
  await expect(page.getByTestId('entry-meta')).toBeVisible();
  await expect(page.getByTestId('entry-meta-aktualizacja')).toBeVisible();
  await expect(page.getByTestId('entry-meta-trudnosc')).toHaveCount(0);
  await expect(page.getByTestId('entry-meta-czas')).toHaveCount(0);
});
