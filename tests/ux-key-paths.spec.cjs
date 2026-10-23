// Kluczowe ścieżki użytkownika (telefon 390×844 i komputer 1280). Uruchamiane w Chromium i WebKit.
const { test, expect } = require('@playwright/test');
const path = require('node:path');
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
  for (const [label, url] of [['Modele', '/modele'], ['Baza wiedzy', '/baza'], ['Kody OBD', '/kody-obd'], ['Schematy', '/schematy']]) {
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
  for (const url of ['/', '/modele', '/baza', '/usterki', '/diy', '/poradniki', '/kody-obd', '/schematy', '/szukaj?q=hamulce', '/narzedzia', '/swiat-gmt400']) {
    await page.goto(BASE + url);
    await page.waitForLoadState('networkidle');
    await noHorizontalScroll(page);
    const unnamed = await page.evaluate(() => [...document.querySelectorAll('button, a[href]')].filter(el => el.getClientRects().length && !(el.getAttribute('aria-label') || el.textContent.trim() || el.querySelector('img[alt]:not([alt=""])'))).map(el => el.outerHTML.slice(0, 80)));
    expect(unnamed, url).toEqual([]);
  }
  expect(errors).toEqual([]);
});
