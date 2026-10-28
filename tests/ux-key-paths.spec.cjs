// Kluczowe ścieżki użytkownika (telefon 390×844 i komputer 1280). Uruchamiane w Chromium i WebKit.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const FIXTURE = path.join(__dirname, 'fixtures', 'notion-ux.json');

async function guard(page) {
  const errors = [];
  // WebKit zgłasza przerwane w trakcie nawigacji prefetche Next.js (?_rsc=) jako „access control checks” — to nie jest błąd strony.
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  page.on('console', message => { if (message.type() === 'error' && !/Failed to load resource/.test(message.text()) && !benign(message.text())) errors.push('console: ' + message.text()); });
  // /api/notion jest podmieniane fixture'em; w CI nie ma tokenu Notion, a WebKit potrafi puścić pojedyncze żądanie obok mocka — treść Notion sprawdzają osobne testy.
  page.on('response', response => { const url = response.url(); if (url.startsWith(BASE) && response.status() >= 400 && !url.includes('/_next/image') && !new URL(url).pathname.startsWith('/api/notion')) errors.push(response.status() + ' ' + url); });
  await page.context().route(url => url.pathname.startsWith('/api/notion'), route => route.fulfill({ path: FIXTURE, contentType: 'application/json' }));
  return errors;
}
async function noHorizontalScroll(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
}
const carousel = page => page.getByTestId('model-carousel');
const isMobile = testInfo => testInfo.project.use.viewport.width < 768;

test('karuzela: strzałki, kropki, klawiatura i szybkie klikanie', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  await expect(carousel(page)).toHaveAttribute('aria-label', /^Model 1 z \d+:/);
  const total = Number((await carousel(page).getAttribute('aria-label')).match(/z (\d+)/)[1]);
  await page.getByRole('button', { name: 'Następny model', exact: true }).click();
  await expect(carousel(page)).toHaveAttribute('aria-label', new RegExp(`^Model 2 z ${total}:`));
  await page.getByRole('button', { name: 'Poprzedni model', exact: true }).click();
  await page.getByRole('button', { name: 'Poprzedni model', exact: true }).click();
  await expect(carousel(page)).toHaveAttribute('aria-label', new RegExp(`^Model ${total} z ${total}:`));
  const next = page.getByRole('button', { name: 'Następny model', exact: true });
  for (let i = 0; i < 12; i++) await next.click({ delay: 0 });
  await expect(carousel(page)).toHaveAttribute('aria-label', new RegExp(`^Model ${(12 % total) || total} z ${total}:`));
  await expect(page.locator('[aria-current="true"]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Następny model', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(carousel(page)).toHaveAttribute('aria-label', new RegExp(`^Model ${((13 % total) || total)} z ${total}:`));
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('karuzela: sterowanie poza zdjęciem — na każdym slajdzie strzałki, kropki i plakietka lat nie dotykają zdjęcia, cele ≥ 44 px, bez skoku układu', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  const total = Number((await carousel(page).getAttribute('aria-label')).match(/z (\d+)/)[1]);
  expect(total).toBeGreaterThanOrEqual(9);
  const intersects = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  const heights = new Set();
  for (let i = 0; i < total; i++) {
    await expect(carousel(page)).toHaveAttribute('aria-label', new RegExp(`^Model ${i + 1} z ${total}:`));
    await expect(carousel(page).locator('.studio img[alt]:not([alt=""])')).toBeVisible();
    const frame = await carousel(page).locator('.studio').boundingBox();
    const box = await carousel(page).boundingBox();
    heights.add(Math.round(box.height));
    for (const id of ['carousel-prev', 'carousel-next', 'year-badge']) {
      const b = await page.getByTestId(id).boundingBox();
      expect(intersects(b, frame), `${id} nie zasłania zdjęcia (slajd ${i + 1})`).toBe(false);
      if (id !== 'year-badge') {
        expect(b.width, id).toBeGreaterThanOrEqual(44);
        expect(b.height, id).toBeGreaterThanOrEqual(44);
        expect(b.x, id).toBeGreaterThanOrEqual(0);
        expect(b.x + b.width, id).toBeLessThanOrEqual(page.viewportSize().width);
      }
    }
    const dots = await page.getByTestId('carousel-dots').boundingBox();
    expect(intersects(dots, frame), 'kropki poza zdjęciem').toBe(false);
    await page.getByTestId('carousel-next').click();
  }
  expect([...heights], 'wysokość karuzeli jest stała na wszystkich slajdach (brak skoku układu)').toHaveLength(1);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('karuzela: poziomy gest zmienia model, pionowy nie', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.use.hasTouch, 'gesty tylko na telefonie');
  await guard(page);
  await page.goto(BASE + '/');
  await expect(carousel(page)).toHaveAttribute('aria-label', /^Model 1 /);
  const swipe = (dx, dy) => carousel(page).evaluate((node, [dx, dy]) => {
    const r = node.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + 80;
    // WebKit nie pozwala tworzyć obiektów Touch, więc zdarzenie dostaje listy dotknięć jako zwykłe obiekty (React czyta tylko clientX/clientY).
    const fire = (type, touches, changed) => { const event = new Event(type, { bubbles: true, cancelable: true }); Object.defineProperty(event, 'touches', { value: touches }); Object.defineProperty(event, 'targetTouches', { value: touches }); Object.defineProperty(event, 'changedTouches', { value: changed }); node.dispatchEvent(event); };
    const touch = (cx, cy) => ({ identifier: 1, target: node, clientX: cx, clientY: cy, pageX: cx, pageY: cy, screenX: cx, screenY: cy });
    fire('touchstart', [touch(x, y)], [touch(x, y)]);
    fire('touchend', [], [touch(x + dx, y + dy)]);
  }, [dx, dy]);
  await swipe(-120, 10);
  await expect(carousel(page)).toHaveAttribute('aria-label', /^Model 2 /);
  await swipe(10, -200);
  await expect(carousel(page)).toHaveAttribute('aria-label', /^Model 2 /);
  await swipe(120, 0);
  await expect(carousel(page)).toHaveAttribute('aria-label', /^Model 1 /);
});

test('filtr modelu: chip, usuwanie, odświeżenie, wyczyść i przejście do usterek', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  await page.getByRole('button', { name: 'Następny model', exact: true }).click();
  const name = (await carousel(page).getAttribute('aria-label')).replace(/^Model \d+ z \d+: /, '');
  const active = page.getByTestId('active-filters');
  await expect(active).toContainText(name);
  await page.getByRole('button', { name: 'Doprecyzuj: rocznik, silnik, napęd' }).click();
  const year = page.locator('#hero-year');
  const firstYear = await year.locator('option').nth(1).getAttribute('value');
  await year.selectOption(firstYear);
  await page.locator('#hero-drive').selectOption('4wd');
  await expect(active.getByRole('button', { name: `Usuń filtr rocznik: ${firstYear}` })).toBeVisible();
  await expect(page.getByTestId('year-badge')).toHaveText(firstYear);
  await page.reload();
  await expect(active).toContainText(name);
  await expect(active.getByRole('button', { name: `Usuń filtr rocznik: ${firstYear}` })).toBeVisible();
  await active.getByRole('button', { name: `Usuń filtr rocznik: ${firstYear}` }).click();
  await expect(active.getByRole('button', { name: /Usuń filtr rocznik/ })).toHaveCount(0);
  await expect(active.getByRole('button', { name: 'Usuń filtr napęd: 4wd' })).toBeVisible();
  await page.getByRole('link', { name: /Usterki/ }).first().click();
  await expect(page).toHaveURL(/\/usterki$/);
  await expect(page.getByText('Pokazuję materiały dla:')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(BASE + '/');
  await expect(active).toContainText(name);
  await active.getByRole('button', { name: 'Wyczyść', exact: true }).click();
  await expect(active).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId('active-filters')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('menu w nagłówku: każda sekcja się otwiera, aktywna pozycja i przycisk Wstecz', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  const nav = page.getByRole('navigation', { name: 'Nawigacja główna' });
  for (const [label, url] of [['Sprawdź VIN', '/vin'], ['Modele', '/modele'], ['Baza wiedzy', '/baza'], ['Kody OBD', '/kody-obd'], ['Schematy', '/schematy']]) {
    await nav.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp('^' + BASE.replace(/[.]/g, '\\.') + url + '(\\?tab=[a-z-]+)?$'));
    await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('h1').first()).toBeVisible();
    await noHorizontalScroll(page);
  }
  await page.goBack();
  await expect(page).toHaveURL(BASE + '/kody-obd');
  await page.goBack();
  await expect(page).toHaveURL(/\/baza(\?tab=[a-z]+)?$/);
  await page.getByRole('link', { name: 'Szukaj' }).first().click();
  await expect(page).toHaveURL(/\/szukaj/);
  expect(errors).toEqual([]);
});

test('wyszukiwarka: polskie znaki, brak wyników i wyczyszczenie', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  await page.getByLabel('Szukaj w encyklopedii GMT400').fill('zardzewiałe');
  await page.getByLabel('Szukaj w encyklopedii GMT400').press('Enter');
  await expect(page).toHaveURL(/\/szukaj\?q=/);
  await expect(page.getByRole('link', { name: /Zardzewiałe przewody hamulcowe/ })).toBeVisible();
  await page.goto(BASE + '/szukaj?q=zardzewiale');
  await expect(page.getByRole('link', { name: /Zardzewiałe przewody hamulcowe/ })).toBeVisible();
  await page.goto(BASE + '/szukaj?q=' + encodeURIComponent('qqzzxx brak'));
  const empty = page.getByTestId('search-empty');
  await expect(empty).toBeVisible();
  await empty.getByRole('link', { name: 'Wyczyść wyszukiwanie' }).click();
  await expect(page).toHaveURL(BASE + '/szukaj');
  await expect(page.getByLabel('Kod, objaw lub nazwa materiału')).toHaveValue('');
  await page.getByRole('link', { name: 'P0300', exact: true }).click();
  await expect(page.getByRole('link', { name: /P0300/ }).nth(1)).toBeVisible();
  expect(errors).toEqual([]);
});

test('pola tekstowe na telefonie mają min. 16 px (iOS nie powiększa strony)', async ({ page }, testInfo) => {
  test.skip(!isMobile(testInfo), 'tylko telefon');
  await guard(page);
  for (const url of ['/', '/szukaj', '/modele', '/kody-obd', '/narzedzia/diagnostyka']) {
    await page.goto(BASE + url);
    await page.waitForLoadState('networkidle');
    const small = await page.evaluate(() => [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]), select, textarea')]
      .filter(el => el.getClientRects().length && parseFloat(getComputedStyle(el).fontSize) < 16).map(el => el.id || el.name || el.outerHTML.slice(0, 60)));
    expect(small, url).toEqual([]);
  }
});

test('zakładki encyklopedii przełączają treść', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/baza');
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.getByRole('button', { name: 'Serwis i części', exact: true }).click();
  for (const child of ['Usterki', 'Kody OBD', 'Schematy', 'Części']) {
    const button = nav.getByRole('button', { name: child, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(nav.locator('[data-navigation-items] [aria-pressed="true"]')).toHaveCount(1);
  }
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('modele: katalog, strona modelu, okruszki i nieistniejący model', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/');
  await page.getByRole('link', { name: /^Strona modelu:/ }).click();
  await expect(page).toHaveURL(/\/modele\/[a-z0-9-]+$/);
  const crumbs = page.getByRole('navigation', { name: 'Okruszki' });
  await expect(crumbs.getByRole('link', { name: 'Modele' })).toHaveAttribute('href', '/modele');
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText(await page.locator('h1').innerText());
  await noHorizontalScroll(page);
  await crumbs.getByRole('link', { name: 'Modele' }).click();
  await expect(page).toHaveURL(BASE + '/modele');
  expect(errors).toEqual([]);
  const missing = await page.goto(BASE + '/modele/nie-ma-takiego');
  expect(missing.status()).toBe(404);
});

test('schemat: pełny ekran, powiększenie, Esc i powrót fokusu', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/schematy');
  const open = page.getByRole('button', { name: /^Otwórz schemat na pełnym ekranie:/ }).first();
  await open.scrollIntoViewIfNeeded();
  await open.click();
  const dialog = page.getByTestId('schematic-dialog');
  await expect(dialog).toBeVisible();
  const img = dialog.locator('img[data-scale]');
  await expect.poll(async () => Number(await img.getAttribute('data-scale'))).toBe(1);
  await dialog.getByRole('button', { name: 'Powiększ' }).click();
  await expect.poll(async () => Number(await img.getAttribute('data-scale'))).toBeGreaterThan(1);
  await dialog.getByRole('button', { name: 'Dopasuj do ekranu' }).click();
  await expect.poll(async () => Number(await img.getAttribute('data-scale'))).toBe(1);
  const box = await dialog.getByRole('button', { name: 'Zamknij schemat' }).boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.width).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole('button', { name: 'Zamknij schemat' }).click();
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});

test('kody OBD: lista, karta kodu, brak karty, zły kod i głęboki link', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/kody-obd');
  await expect(page.locator('h1')).toContainText('Kody OBD');
  await page.goto(BASE + '/kody-obd/p0300');
  await expect(page.locator('h1')).toContainText('P0300');
  await expect(page.getByRole('navigation', { name: 'Okruszki' }).getByRole('link', { name: 'Kody OBD' })).toBeVisible();
  expect(errors).toEqual([]);
  const response = await page.goto(BASE + '/kody-obd/zzzz');
  expect(response.status()).toBe(404);
});

test('przycisk „na górę” pojawia się po przewinięciu i wraca na górę', async ({ page }) => {
  await guard(page);
  await page.goto(BASE + '/kody-obd');
  const button = page.getByTestId('back-to-top');
  await expect(button).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  await button.click();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(10);
});

test('strony kluczowe: bez przewijania w bok, bez błędów, każdy przycisk ma nazwę', async ({ page }) => {
  const errors = await guard(page);
  for (const url of ['/', '/modele', '/baza', '/usterki', '/diy', '/poradniki', '/kody-obd', '/schematy', '/szukaj?q=hamulce', '/narzedzia', '/narzedzia/rpo', '/moj-samochod', '/swiat-gmt400']) {
    await page.goto(BASE + url);
    await page.waitForLoadState('networkidle');
    await noHorizontalScroll(page);
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('button, a[href]')].filter(el => el.getClientRects().length && !(el.getAttribute('aria-label') || el.textContent.trim() || el.querySelector('img[alt]:not([alt=""])'))).map(el => el.outerHTML.slice(0, 80)));
    expect(unnamed, url).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('bezpieczniki: wyszukiwanie, filtr rocznika i brak wyników', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/schematy#fuse-locations');
  const table = page.getByTestId('fuse-table');
  await table.scrollIntoViewIfNeeded();
  const count = table.getByTestId('fuse-count');
  const all = Number((await count.innerText()).match(/\d+/)[0]);
  expect(all).toBe(65);
  await table.getByRole('searchbox', { name: 'Szukaj w tabeli bezpieczników' }).fill('wycieraczki');
  await expect.poll(async () => Number((await count.innerText()).match(/\d+/)[0])).toBeLessThan(all);
  await table.getByRole('combobox', { name: 'Rocznik' }).selectOption('1994');
  await expect(table.getByText('R1·K7', { exact: true })).toBeVisible();
  await table.getByRole('searchbox', { name: 'Szukaj w tabeli bezpieczników' }).fill('zzzz');
  await expect(count).toHaveText('Wyniki: 0');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('dekoder VIN: cyfra kontrolna, rok, silnik z OM i błędne znaki', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/vin');
  const decoder = page.getByTestId('vin-decoder');
  await decoder.scrollIntoViewIfNeeded();
  await hydrated(decoder.getByRole('button', { name: 'DEKODUJ VIN' }));
  const input = decoder.getByRole('textbox', { name: 'Numer VIN do dekodowania' });
  await input.fill('1GCEK19R0VE000000');
  await decoder.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(decoder.getByTestId('vin-year')).toContainText('1997');
  await expect(decoder.getByTestId('vin-engine')).toContainText('RPO L31');
  await expect(decoder.getByTestId('vin-check')).toContainText('nie zgadza');
  await input.fill('1GCEK19R0VE00000O');
  await decoder.getByRole('button', { name: 'DEKODUJ VIN' }).click();
  await expect(decoder.getByTestId('vin-errors')).toContainText('I, O ani Q');
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

// ---------- Dekoder RPO ----------
test('RPO: kilka kodów naraz, nieznany kod i podpowiedź O/0', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/narzedzia/rpo');
  await hydrated(page.getByRole('button', { name: 'Sprawdź kody', exact: true }));
  await page.locator('#rpo-query').fill('G80 Z71 L31 XQZ LO5');
  await page.getByRole('button', { name: 'Sprawdź kody', exact: true }).click();
  await expect(page.getByTestId('rpo-count')).toContainText('5');
  for (const code of ['G80', 'Z71', 'L31']) await expect(page.locator(`[data-testid="rpo-result"][data-code="${code}"]`)).toBeVisible();
  await expect(page.locator(`[data-testid="rpo-result"][data-code="G80"]`)).toContainText('Sprawdź w swoim aucie / manualu');
  const unknown = page.getByTestId('rpo-unknown');
  await expect(unknown).toHaveCount(2);
  await expect(unknown.first()).toContainText('nieznany – sprawdź');
  await unknown.filter({ hasText: 'LO5' }).getByRole('button', { name: 'L05', exact: true }).click();
  await expect(page.locator(`[data-testid="rpo-result"][data-code="L05"]`)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Źródła/ })).toBeVisible();
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

// ---------- Mój samochód ----------
async function saveManualCar(page, { brand = 'Chevrolet', platform = 'C/K', model = 'K1500', year = '1997', engine = 'L31', rpo = 'G80 Z71 XQZ' } = {}) {
  const form = page.getByRole('form', { name: 'Dane auta' });
  await form.getByLabel('Marka').selectOption(brand);
  await form.getByLabel('Nadwozie').selectOption(platform);
  await form.getByLabel('Model').selectOption(model);
  await form.getByLabel('Rocznik').selectOption(year);
  if (engine) await form.getByLabel('Silnik (kod RPO)').selectOption(engine);
  await form.getByLabel('Kody RPO z naklejki (opcjonalnie)').fill(rpo);
  await form.getByRole('button', { name: 'Zapisz moje auto', exact: true }).click();
}

test('Mój samochód: ręczny zapis → plakietka → dopasowane sekcje → przeładowanie → zapomnij', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', 'empty');
  await expect(page.getByTestId('my-car-form')).toBeVisible();
  await noHorizontalScroll(page);
  await saveManualCar(page);
  const summary = page.getByTestId('my-car-summary');
  await expect(summary).toContainText('Chevrolet K1500 · 1997');
  await expect(summary).toContainText('L31');
  await expect(page.getByTestId('header-car-badge')).toContainText('K1500 · 1997');
  await expect(page.getByRole('heading', { name: 'Bezpieczniki — 1997' })).toBeVisible();
  await expect(page.getByTestId('fuse-table').getByLabel('Rocznik')).toHaveValue('1997');
  // Usterki: tarcze 1988–1999 pasują; TBI 1988–1995 i 6.5L (inny silnik) pominięte.
  const faults = page.getByTestId('my-car-fault');
  await expect(faults.filter({ hasText: 'tarcze' })).toHaveAttribute('data-fit', 'match');
  await expect(faults.filter({ hasText: 'TBI' })).toHaveCount(0);
  await expect(faults.filter({ hasText: '6.5L' })).toHaveCount(0);
  await expect(faults.first()).toContainText('sprawdź w swoim aucie / manualu');
  await expect(page.getByTestId('my-car-diy').filter({ hasText: 'Procedury DIY' })).toHaveAttribute('data-fit', 'match');
  await expect(page.getByTestId('my-car-model').filter({ hasText: 'Yukon' })).toHaveCount(0);
  await expect(page.locator('[data-testid="my-car-rpo"][data-code="G80"]')).not.toContainText('nieznany');
  await expect(page.locator('[data-testid="my-car-rpo"][data-code="XQZ"]')).toContainText('nieznany – sprawdź');
  await noHorizontalScroll(page);
  await page.reload();
  await expect(page.getByTestId('my-car-summary')).toContainText('Chevrolet K1500 · 1997');
  await page.getByTestId('my-car-rpo-link').click();
  await expect(page).toHaveURL(/\/narzedzia\/rpo$/);
  await expect(page.locator('#rpo-vehicle')).toHaveValue('Chevrolet C/K');
  await page.getByRole('button', { name: /Wstaw moje kody RPO/ }).click();
  await expect(page.locator('[data-testid="rpo-result"][data-code="G80"] [data-testid="rpo-fit"]')).toBeVisible();
  await page.getByTestId('header-car-badge').click();
  await expect(page).toHaveURL(/\/moj-samochod$/);
  await page.getByRole('button', { name: 'Zapomnij auto', exact: true }).click();
  await page.getByRole('button', { name: 'Tak, zapomnij', exact: true }).click();
  await expect(page.getByTestId('my-car-form')).toBeVisible();
  await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', 'empty');
  expect(await page.evaluate(() => localStorage.getItem('gmt400_vehicle_profile_v2'))).toBeNull();
  expect(errors).toEqual([]);
});

test('Mój samochód: VIN uzupełnia rocznik i silnik, zmiana auta', async ({ page }) => {
  const errors = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  await page.locator('#vin-input').fill('1GCEK19R0VZ000000');
  await page.getByRole('button', { name: 'DEKODUJ VIN', exact: true }).click();
  await expect(page.getByTestId('my-car-vin-note')).toContainText('rocznik 1997');
  await expect(page.getByTestId('my-car-vin-note')).toContainText('L31');
  const form = page.getByRole('form', { name: 'Dane auta' });
  await expect(form.getByLabel('Rocznik')).toHaveValue('1997');
  await expect(form.getByLabel('Silnik (kod RPO)')).toHaveValue('L31');
  await saveManualCar(page, { engine: '', rpo: '' });
  await expect(page.getByTestId('my-car-summary')).toContainText('1GCEK19R0VZ000000');
  await page.getByRole('button', { name: 'Zmień auto', exact: true }).click();
  await saveManualCar(page, { platform: 'Tahoe', model: 'Tahoe 4-door', year: '1999', engine: '', rpo: '' });
  await expect(page.getByTestId('my-car-summary')).toContainText('Chevrolet Tahoe 4-door · 1999');
  await expect(page.getByTestId('header-car-badge')).toContainText('Tahoe 4d · 1999');
  await expect(page.getByTestId('my-car-fuse-warning')).toBeVisible();
  await expect(page.getByTestId('my-car-tip').filter({ hasText: 'drugiego rzędu' })).toHaveAttribute('data-fit', 'match');
  await expect(page.getByTestId('my-car-tip').filter({ hasText: 'Trzeci rząd' })).toHaveCount(0);
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});

test('Mój samochód: działa bez localStorage (tryb prywatny / blokada)', async ({ page }) => {
  await page.addInitScript(() => {
    const fail = () => { throw new DOMException('blocked', 'SecurityError'); };
    try { Object.defineProperty(window, 'localStorage', { configurable: true, get: fail }); } catch {}
  });
  const errors = await guard(page);
  await page.goto(BASE + '/moj-samochod');
  await expect(page.getByTestId('my-car-storage-note')).toBeVisible();
  await saveManualCar(page);
  await expect(page.getByTestId('my-car-summary')).toContainText('Chevrolet K1500 · 1997');
  await expect(page.getByTestId('my-car-notice')).toContainText('tylko w tej karcie');
  await expect(page.getByTestId('header-car-badge')).toBeVisible();
  await noHorizontalScroll(page);
  expect(errors).toEqual([]);
});
