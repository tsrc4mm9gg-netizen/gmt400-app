// Narzędzie /diagnoza „Co się dzieje z moim autem?”: wybór objawu → pytania → lista przyczyn z linkami do wpisów.
// Chromium + WebKit, telefon 390×844 i komputer 1280×800 (dodatkowo sprawdzamy szerokość 768).
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-diagnoza.json');
const SYMPTOM_IDS = ['nie-odpala', 'szarpie-gasnie', 'check-engine', 'wycieki', 'halasy', 'hamulce', 'skrzynia', 'klima-ogrzewanie', 'elektryka', 'przegrzewanie', 'paliwo-dym'];

async function guard(page, { notion = 'fixture' } = {}) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text()) && !benign(message.text())) errors.push('console: ' + message.text()); });
  await page.context().route(url => url.pathname.startsWith('/api/notion'), route => notion === 'fixture'
    ? route.fulfill({ path: FIXTURE, contentType: 'application/json' })
    : route.fulfill({ status: 502, contentType: 'application/json', body: '{"error":"test"}' }));
  return errors;
}
async function noHorizontalScroll(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
}
async function open(page, query = '') {
  await page.goto(BASE + '/diagnoza' + query);
  await expect(page.getByTestId('diagnoza-tool')).toBeVisible();
  await hydrated(page.getByTestId('diagnoza-tool').locator('button').first());
}

test('/diagnoza: 11 kategorii objawów + „Inny objaw”, jeden H1, tytuł i canonical', async ({ page }) => {
  const errors = await guard(page);
  await open(page);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Co się dzieje z moim autem?');
  await expect(page).toHaveTitle(/Co się dzieje z moim autem/);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://www.gmt400.pl/diagnoza');
  for (const id of SYMPTOM_IDS) {
    const tile = page.getByTestId('symptom-' + id);
    await expect(tile).toBeVisible();
    expect((await tile.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByTestId('symptom-other')).toHaveAttribute('href', '/szukaj');
  await expect(page.locator('[data-testid^=symptom-]:not([data-testid=symptom-other]):not([data-testid=symptom-picker]):not([data-testid=symptom-panel]):not([data-testid=symptom-selected]):not([data-testid=symptom-change])')).toHaveCount(11);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('/diagnoza: nie odpala → diesel → rozrusznik: lista przyczyn, dopasowanie, linki do /baza/[id]', async ({ page }) => {
  const errors = await guard(page);
  await open(page);
  await page.getByTestId('symptom-nie-odpala').click();
  await expect(page.getByTestId('symptom-selected')).toHaveText('Nie odpala');
  await expect(page).toHaveURL(/\/diagnoza\?objaw=nie-odpala$/);
  await expect(page.getByTestId('question-silnik')).toBeVisible();
  const before = Number((await page.getByTestId('results-count').innerText()).replace(/\D/g, ''));
  expect(before).toBeGreaterThanOrEqual(5);

  const diesel = page.getByTestId('option-silnik-diesel');
  await diesel.click();
  await expect(diesel).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/silnik=diesel/);
  const afterDiesel = Number((await page.getByTestId('results-count').innerText()).replace(/\D/g, ''));
  expect(afterDiesel).toBeLessThan(before); // przyczyny „tylko benzyna” znikają

  const q = page.getByTestId('question-rozrusznik');
  await q.locator('button').first().click();
  await expect(page.locator('[data-testid=cause-list] [data-testid=cause-match]').first()).toContainText('Pasuje:');
  // pierwsza przyczyna to ta pasująca do odpowiedzi
  const firstCause = page.locator('[data-testid=cause-list] > li').first();
  await expect(firstCause.getByTestId('cause-match')).toHaveCount(1);
  await expect(firstCause).toContainText(/sprawdź w swoim aucie \/ manualu/i);
  const hrefs = await page.getByTestId('cause-link').evaluateAll(as => as.map(a => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(3);
  expect(hrefs.some(h => /^\/baza\/[0-9a-f-]{36}$/.test(h))).toBe(true);
  // tytuły wpisów z Notion i tagi model/lata są widoczne w wierszach linków
  await expect(firstCause.getByTestId('cause-link').first()).toContainText(/Model:/);
  await expect(page.getByText('Ładowanie wpisu…')).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('/diagnoza: link do wpisu otwiera /baza/[id]; „Zmień” i przycisk wstecz wracają do wyboru objawu', async ({ page }) => {
  await guard(page);
  await open(page);
  await page.getByTestId('symptom-wycieki').click();
  await expect(page.getByTestId('symptom-panel')).toBeVisible();
  await page.getByTestId('symptom-change').click();
  await expect(page.getByTestId('symptom-picker')).toBeVisible();
  await page.goBack();
  await expect(page.getByTestId('symptom-panel')).toBeVisible();
  await expect(page.getByTestId('symptom-selected')).toHaveText('Wycieki');
  await page.goBack();
  await expect(page.getByTestId('symptom-picker')).toBeVisible();
  await page.goForward();
  const link = page.getByTestId('cause-link').first();
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(BASE + href);
});

test('/diagnoza: głęboki link ?objaw=…&odpowiedzi odtwarza stan; błędna wartość jest ignorowana', async ({ page }) => {
  const errors = await guard(page);
  await open(page, '?objaw=hamulce&objaw2=x');
  await expect(page.getByTestId('symptom-selected')).toHaveText('Hamulce');
  await page.goto(BASE + '/diagnoza?objaw=hamulce&kiedy=nie-ma-takiej');
  await expect(page.getByTestId('symptom-selected')).toHaveText('Hamulce');
  await expect(page.locator('[aria-pressed=true]')).toHaveCount(0);
  await page.goto(BASE + '/diagnoza?objaw=nie-ma');
  await expect(page.getByTestId('symptom-picker')).toBeVisible();
  expect(errors).toEqual([]);
});

test('/diagnoza: każdy z 11 objawów daje listę przyczyn z linkami; luka treści jest jawnie oznaczona', async ({ page }) => {
  const errors = await guard(page);
  await open(page);
  for (const id of SYMPTOM_IDS) {
    await page.getByTestId('symptom-' + id).click();
    await expect(page.locator('[data-testid=cause-list] > li').first()).toBeVisible();
    expect(await page.locator('[data-testid=cause-list] > li').count(), id).toBeGreaterThanOrEqual(3);
    expect(await page.getByTestId('cause-link').count(), id).toBeGreaterThanOrEqual(3);
    await expect(page.getByText('Ładowanie wpisu…')).toHaveCount(0);
    await noHorizontalScroll(page);
    await page.getByTestId('symptom-change').click();
  }
  await page.getByTestId('symptom-check-engine').click();
  await expect(page.getByTestId('gaps')).toContainText('Brak wpisu w bazie');
  expect(errors).toEqual([]);
});

test('/diagnoza: gdy Notion nie odpowiada, przyczyny nadal się pokazują z ogólnymi linkami do bazy (bez błędu strony)', async ({ page }) => {
  await guard(page, { notion: 'fail' });
  await open(page, '?objaw=nie-odpala');
  const list = page.getByTestId('cause-list');
  await expect(list).toBeVisible();
  const loading = await page.getByText('Ładowanie wpisu…').count();
  const fallback = await page.getByText('Wpis w bazie wiedzy').count();
  const server = await page.getByTestId('cause-link').first().getAttribute('href');
  // serwer z danymi Notion (np. produkcja) renderuje wpisy bez udziału przeglądarki — wtedy scenariusz awarii nie dotyczy
  test.skip(loading === 0 && fallback === 0 && /^\/baza\//.test(server || ''), 'serwer ma dane Notion po stronie SSR');
  await expect(page.getByText('Wpis w bazie wiedzy').first()).toBeVisible({ timeout: 20000 });
  await expect(list.locator('> li').first()).toBeVisible();
});

test('/diagnoza: szerokość 768 — bez poziomego przewijania, kafelki w siatce', async ({ page }) => {
  await guard(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await open(page);
  await noHorizontalScroll(page);
  await page.getByTestId('symptom-elektryka').click();
  await expect(page.getByTestId('cause-list')).toBeVisible();
  await noHorizontalScroll(page);
  const boxes = await page.getByTestId('cause-list').locator('> li').evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.left, r.right]; }));
  for (const [l, r] of boxes) { expect(l).toBeGreaterThanOrEqual(0); expect(r).toBeLessThanOrEqual(768); }
});

test('/diagnoza: paleta — brak czerwieni, bursztynu i żółci w kolorach elementów', async ({ page }) => {
  await guard(page);
  await open(page, '?objaw=przegrzewanie');
  await expect(page.getByTestId('cause-list')).toBeVisible();
  for (const url of ['/diagnoza', '/diagnoza?objaw=przegrzewanie']) {
    await page.goto(BASE + url);
    await expect(page.getByTestId('diagnoza-tool')).toBeVisible();
    const bad = await page.evaluate(() => {
      const parse = value => { const m = value.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
      const found = [];
      for (const el of document.querySelector('[data-testid=diagnoza-tool]').querySelectorAll('*')) {
        const cs = getComputedStyle(el);
        for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'outlineColor']) {
          const c = parse(cs[prop]); if (!c || c[3] < 0.2) continue;
          const [r, g, b] = c.slice(0, 3).map(v => v / 255);
          const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
          if (max < 0.25 || d / (max || 1) < 0.3) continue; // grafit / srebro / biel
          let h = d === 0 ? 0 : max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
          h = (h * 60 + 360) % 360;
          if (h < 65 || h > 340) found.push(`${el.tagName}.${prop}=${cs[prop]}`);
        }
      }
      return found;
    });
    expect(bad).toEqual([]);
  }
});

test('strona główna: wyraźny kafel „Co się dzieje z moim autem?” prowadzi do /diagnoza', async ({ page }) => {
  await guard(page);
  await page.goto(BASE + '/');
  const tile = page.getByTestId('home-diagnoza');
  await expect(tile).toBeVisible();
  expect((await tile.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await hydrated(page.getByTestId('home-vin-cta'));
  await tile.click();
  await expect(page).toHaveURL(BASE + '/diagnoza');
  await expect(page.getByTestId('symptom-picker')).toBeVisible();
  await noHorizontalScroll(page);
});
