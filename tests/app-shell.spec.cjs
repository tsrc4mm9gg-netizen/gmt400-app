// Aplikacja na telefonie: dolny pasek, PWA (manifest, meta iOS, service worker offline), wyszukiwarka objawów, podpisy zdjęć kafelków.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const ID = n => `00000000-0000-0000-0000-00000000030${n}`;
const DATA = { complete: true, results: [
  { id: ID(1), Nazwa: 'Hamulce — pisk i stukanie zacisków', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Objawy: 'Puka przy hamowaniu.', Opis: 'Luźny zacisk.' },
  { id: ID(2), Nazwa: 'Wymiana klocków hamulcowych', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: 'Procedura krok po kroku.' },
  { id: ID(3), Nazwa: 'Silnik nie odpala na zimno', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Objawy: 'Kręci, ale nie zapala.', Opis: '' },
] };
const mock = page => page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));

test('dolny pasek: 5 zakładek na telefonie (≥44 px), ukryty na komputerze', async ({ page }, info) => {
  await page.goto(BASE + '/');
  const bar = page.getByTestId('mobile-tabbar');
  if (info.project.name.endsWith('desktop')) { await expect(bar).toBeHidden(); return; }
  await expect(bar).toBeVisible();
  const links = bar.getByRole('link');
  await expect(links).toHaveCount(5);
  await expect(links).toHaveText([/Start/, /Szukaj/, /Moje auto/, /Usterki/, /DIY/]);
  const hrefs = await links.evaluateAll(a => a.map(x => x.getAttribute('href')));
  expect(hrefs).toEqual(['/', '/szukaj', '/moj-samochod', '/usterki', '/diy']);
  for (const box of await links.evaluateAll(a => a.map(x => x.getBoundingClientRect().height))) expect(box).toBeGreaterThanOrEqual(44);
  await expect(bar.getByRole('link', { name: /Start/ })).toHaveAttribute('aria-current', 'page');
  // ostatni element treści nie chowa się pod paskiem
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const footer = await page.locator('footer').last().boundingBox();
  const barBox = await bar.boundingBox();
  if (footer) expect(footer.y + footer.height).toBeLessThanOrEqual(barBox.y + 1);
});

test('PWA: manifest, ikony, meta iOS i service worker bez /admin i /api/vin-requests', async ({ page, request }) => {
  await page.goto(BASE + '/');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json');
  await expect(page.locator('link[rel="apple-touch-icon"]').first()).toHaveAttribute('href', /apple-(touch-)?icon/);
  await expect(page.locator('meta[name="apple-mobile-web-app-capable"]').first()).toHaveAttribute('content', 'yes');
  await expect(page.locator('meta[name="apple-mobile-web-app-status-bar-style"]')).toHaveAttribute('content', 'black-translucent');
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', /viewport-fit=cover/);
  const manifest = await (await request.get(BASE + '/manifest.json')).json();
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map(i => i.sizes)).toEqual(expect.arrayContaining(['192x192', '512x512', '180x180']));
  for (const icon of manifest.icons) expect((await request.get(BASE + icon.src)).status()).toBe(200);
  const sw = await (await request.get(BASE + '/sw.js')).text();
  expect(sw).toContain('/api\\/vin-requests');
  expect(sw).toContain('/^\\/admin');
});

test('offline: odwiedzona strona wpisu i /offline działają bez sieci (Chromium)', async ({ page, context, browserName }) => {
  if (browserName !== 'chromium') {
    // WebKit (Playwright/Linux) nie obsługuje pewnie trybu offline z SW — sprawdzamy stronę zapasową /offline online.
    await page.goto(BASE + '/offline');
    await expect(page.getByRole('heading', { name: 'Brak połączenia z internetem' }).first()).toBeVisible();
    return;
  }
  await page.goto(BASE + '/');
  await page.evaluate(() => localStorage.setItem('gmt400_sw', '1'));
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // strona pod kontrolą SW
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await page.goto(BASE + '/diy');
  await expect(page.locator('h1').first()).toBeVisible();
  await context.setOffline(true);
  await page.goto(BASE + '/diy');
  await expect(page.locator('h1').first()).toBeVisible();
  await page.goto(BASE + '/strona-ktorej-nie-odwiedzono-' + Date.now());
  await expect(page.getByRole('heading', { name: 'Brak połączenia z internetem' }).first()).toBeVisible();
  await context.setOffline(false);
});

test('wyszukiwarka objawów na stronie głównej: wyniki na żywo i pusty wynik z linkiem do /usterki', async ({ page }) => {
  await mock(page);
  await page.goto(BASE + '/');
  const box = page.getByTestId('symptom-search');
  await expect(box.getByRole('heading', { name: 'Co się dzieje z moim autem?' })).toBeVisible();
  // pod karuzelą
  const [carousel, sym] = await Promise.all([page.getByTestId('model-carousel').first().boundingBox(), box.boundingBox()]);
  if (carousel) expect(sym.y).toBeGreaterThan(carousel.y);
  const input = box.getByPlaceholder('Opisz objaw, np. stuka przy hamowaniu');
  await input.fill('stuka przy hamowaniu');
  await expect(box.getByTestId('symptom-faults').getByRole('link').first()).toHaveText(/Hamulce — pisk/);
  await expect(box.getByTestId('symptom-diy').getByRole('link')).toHaveText([/Wymiana klocków/]);
  await expect(box.getByTestId('symptom-faults').getByRole('link').first()).toHaveAttribute('href', `/baza/${ID(1)}`);
  await input.fill('nie pali');
  await expect(box.getByTestId('symptom-faults').getByRole('link').first()).toHaveText(/nie odpala/);
  await input.fill('qwerty zzz');
  await expect(box.getByTestId('symptom-empty')).toBeVisible();
  await expect(box.getByTestId('symptom-empty').getByRole('link', { name: 'wszystkie usterki' })).toHaveAttribute('href', '/usterki');
});

test('wyszukiwarka objawów na /szukaj', async ({ page }) => {
  await mock(page);
  await page.goto(BASE + '/szukaj');
  const box = page.getByTestId('symptom-search');
  await box.getByPlaceholder('Opisz objaw, np. stuka przy hamowaniu').fill('piszczy hamulec');
  await expect(box.getByTestId('symptom-faults').getByRole('link').first()).toHaveText(/Hamulce/);
});

test('kafelek DIY: zdjęcie poglądowe z podpisem autora i licencji', async ({ page }) => {
  await mock(page);
  await page.goto(BASE + '/diy');
  const tile = page.getByTestId('entry-tile').filter({ hasText: 'Wymiana klocków hamulcowych' });
  await expect(tile.getByTestId('tile-thumb').locator('img')).toHaveAttribute('src', /hamulce-przod/);
  await expect(tile.getByTestId('tile-credit')).toContainText(/Fot\. .+ · CC BY-SA 2\.0/);
});
