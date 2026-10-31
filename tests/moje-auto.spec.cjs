// „Moje auto”: zapis/odczyt w localStorage (bez konta), garaż kilku aut, filtrowanie Usterek, DIY i szukajki objawów
// pod aktywne auto (selection/bodyId + profil), puste stany „Brak wyników dla Twojego profilu auta.” + „Pokaż wszystko”, usuwanie, offline.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const KEY = 'gmt400_vehicle_profile_v2';
const GARAGE = 'gmt400_garage_v1';
const ALL = { brand: [], model: ['Wszystkie'], years: [], engine: [], drive: [], transmission: [] };
const row = (id, Typ, Nazwa, Model, Modele, extra = {}) => ({ id, Typ, Nazwa, Model, Modele, Lata: '', Opis: 'Dane testowe — sprawdź w swoim aucie.', Objawy: '', Rozwiązanie: 'Dane testowe.', applicability: Modele.length && Modele[0] !== 'Wszystkie' ? { ...ALL, model: Modele } : ALL, ...extra });
const FIXTURE = { results: [
  row('t-sub', 'Usterka', 'TEST SUBURBAN HAMULCE', 'Suburban', ['Suburban'], { Objawy: 'stuka przy hamowaniu' }),
  row('t-gen', 'Usterka', 'TEST OGOLNA PALIWO', 'Wszystkie', ['Wszystkie'], { Objawy: 'wskaźnik paliwa skacze' }),
  row('t-yuk', 'Usterka', 'TEST YUKON SZARPANIE', 'GMC Yukon', ['GMC Yukon'], { Objawy: 'szarpie przy przyspieszaniu' }),
  row('d-yuk', 'Porada', 'TEST DIY YUKON', 'GMC Yukon', ['GMC Yukon']),
  row('d-gen', 'Porada', 'TEST DIY OGOLNA', 'Wszystkie', ['Wszystkie']),
], count: 5 };
const SUBURBAN = { brand: 'Chevrolet', platform: 'Suburban', model: 'Suburban 1500', year: '1997', engine: '', drive: '4WD', transmission: '', rpoCodes: [] };
const YUKON = { brand: 'GMC', platform: 'Yukon', model: 'Yukon 4-door', year: '1998', engine: '', drive: '4WD', transmission: '', rpoCodes: [] };

async function prepare(page, profile, others) {
  const errors = [];
  const benign = message => /[?&]_rsc=.*access control checks/.test(message);
  page.on('pageerror', error => { if (!benign(error.message)) errors.push('pageerror: ' + error.message); });
  await page.context().route(url => url.pathname.startsWith('/api/notion'), route => route.fulfill({ json: FIXTURE }));
  if (profile) {
    await page.addInitScript(({ key, garage, profile, others }) => {
      if (sessionStorage.getItem('moje-auto-seeded')) return;
      sessionStorage.setItem('moje-auto-seeded', '1');
      localStorage.setItem(key, JSON.stringify({ version: 2, profile }));
      if (others) localStorage.setItem(garage, JSON.stringify({ version: 1, cars: others }));
    }, { key: KEY, garage: GARAGE, profile, others });
  }
  return errors;
}
const stored = page => page.evaluate(([key, garage]) => ({ profile: localStorage.getItem(key), garage: localStorage.getItem(garage) }), [KEY, GARAGE]);
const heading = (page, name) => page.getByRole('heading', { name, exact: true });

test('zapis i odczyt: formularz → karta auta, plakietka, aktywny pasek, odświeżenie', async ({ page }) => {
  const errors = await prepare(page, null);
  await page.goto(BASE + '/moj-samochod');
  await expect(page.getByTestId('my-car-privacy')).toContainText('tylko na tym urządzeniu');
  await expect(page.getByTestId('tab-moj-samochod')).toHaveAttribute('data-saved', 'false');
  const form = page.getByRole('form', { name: 'Dane auta' });
  await hydrated(form.getByRole('button', { name: 'Zapisz moje auto' }));
  await form.getByLabel('Marka').selectOption('Chevrolet');
  await form.getByLabel('Nadwozie').selectOption('Suburban');
  await form.getByLabel('Model').selectOption('Suburban 1500');
  await form.getByLabel('Rocznik').selectOption('1997');
  await form.getByLabel('Napęd').selectOption('4WD');
  await form.getByRole('button', { name: 'Zapisz moje auto' }).click();
  const card = page.getByTestId('my-car-summary');
  await expect(card).toContainText('Chevrolet Suburban 1500 · 1997');
  await expect(card).toContainText('4WD');
  await expect(page.getByTestId('header-car-badge')).toContainText('Suburban 1500 · 1997');
  await expect(page.getByTestId('tab-moj-samochod')).toHaveAttribute('data-saved', 'true');
  for (const button of await card.getByRole('button').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  const saved = JSON.parse((await stored(page)).profile);
  expect(saved).toMatchObject({ version: 2, profile: { brand: 'Chevrolet', model: 'Suburban 1500', year: '1997', drive: '4WD' } });
  await page.reload();
  await expect(page.getByTestId('my-car-summary')).toContainText('Chevrolet Suburban 1500 · 1997');
  await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', /saved|active/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('edycja i garaż: drugie auto, zmiana aktywnego, usunięcie z garażu', async ({ page }) => {
  const errors = await prepare(page, SUBURBAN);
  await page.goto(BASE + '/moj-samochod');
  await hydrated(page.getByRole('button', { name: 'Zmień auto' }));
  // edycja aktywnego auta
  await page.getByRole('button', { name: 'Zmień auto' }).click();
  const form = page.getByRole('form', { name: 'Dane auta' });
  await form.getByLabel('Rocznik').selectOption('1998');
  await form.getByRole('button', { name: 'Zapisz moje auto' }).click();
  await expect(page.getByTestId('my-car-summary')).toContainText('Suburban 1500 · 1998');
  // drugie auto
  await page.getByTestId('my-car-add').click();
  await expect(page.getByTestId('my-car-adding')).toBeVisible();
  await form.getByLabel('Marka').selectOption('GMC');
  await form.getByLabel('Nadwozie').selectOption('Yukon');
  await form.getByLabel('Model').selectOption('Yukon 4-door');
  await form.getByLabel('Rocznik').selectOption('1998');
  await form.getByRole('button', { name: 'Zapisz moje auto' }).click();
  await expect(page.getByTestId('my-car-summary')).toContainText('GMC Yukon 4-door · 1998');
  await expect(page.getByTestId('my-car-garage-item')).toHaveCount(1);
  await expect(page.getByTestId('my-car-garage-item')).toContainText('Chevrolet Suburban 1500 · 1998');
  await page.getByRole('button', { name: 'Ustaw jako aktywne: Chevrolet Suburban 1500 · 1998' }).click();
  await expect(page.getByTestId('my-car-summary')).toContainText('Chevrolet Suburban 1500 · 1998');
  await expect(page.getByTestId('header-car-badge')).toContainText('Suburban 1500 · 1998');
  await expect(page.getByTestId('my-car-garage-item')).toContainText('GMC Yukon 4-door · 1998');
  await page.reload();
  await expect(page.getByTestId('my-car-garage-item')).toContainText('GMC Yukon 4-door · 1998');
  await page.getByRole('button', { name: 'Usuń z garażu: GMC Yukon 4-door · 1998' }).click();
  await page.getByRole('button', { name: 'Tak, usuń' }).click();
  await expect(page.getByTestId('my-car-garage-item')).toHaveCount(0);
  expect((await stored(page)).garage).toBeNull();
  expect(errors).toEqual([]);
});

test('filtrowanie Usterek pod auto + pusty stan i „Pokaż wszystko”', async ({ page }) => {
  const errors = await prepare(page, { ...SUBURBAN, engine: 'L31' });
  await page.goto(BASE + '/usterki');
  // Kod RPO silnika z profilu trafia do filtra modelu jako pojemność (L31 → 5.7), nie jako „31”.
  await expect(page.getByText('Suburban · 1997 · 5.7 · 4WD').first()).toBeVisible();
  await expect(heading(page, 'TEST SUBURBAN HAMULCE')).toBeVisible();
  await expect(heading(page, 'TEST OGOLNA PALIWO')).toBeVisible();
  await expect(heading(page, 'TEST YUKON SZARPANIE')).toHaveCount(0);
  await hydrated(page.getByLabel('Szukaj usterki'));
  await page.getByLabel('Szukaj usterki').fill('yukon');
  await expect(page.getByTestId('issue-empty-title')).toHaveText('Brak wyników dla Twojego profilu auta.');
  const showAll = page.getByTestId('issue-show-all');
  expect((await showAll.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await showAll.click();
  await expect(heading(page, 'TEST YUKON SZARPANIE')).toBeVisible();
  expect(errors).toEqual([]);
});

test('filtrowanie DIY pod auto + pusty stan i „Pokaż wszystko”', async ({ page }) => {
  const errors = await prepare(page, SUBURBAN);
  await page.goto(BASE + '/diy');
  await expect(page.getByText('TEST DIY OGOLNA').first()).toBeVisible();
  await expect(page.getByText('TEST DIY YUKON')).toHaveCount(0);
  await hydrated(page.getByLabel('Szukaj porady DIY'));
  await page.getByLabel('Szukaj porady DIY').fill('yukon');
  await expect(page.getByTestId('diy-empty-title')).toHaveText('Brak wyników dla Twojego profilu auta.');
  await page.getByTestId('diy-show-all').click();
  await expect(page.getByText('TEST DIY YUKON').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('szukajka objawów pod auto + pusty stan i „Pokaż wszystko”', async ({ page }) => {
  const errors = await prepare(page, SUBURBAN);
  await page.goto(BASE + '/szukaj');
  const input = page.getByTestId('symptom-input');
  await hydrated(input);
  await input.fill('stuka przy hamowaniu');
  await expect(page.getByTestId('symptom-faults')).toContainText('TEST SUBURBAN HAMULCE');
  await expect(page.getByTestId('symptom-scope')).toContainText('Dla Twojego auta');
  await input.fill('szarpie przy przyspieszaniu');
  await expect(page.getByTestId('symptom-profile-empty')).toContainText('Brak wyników dla Twojego profilu auta.');
  await page.getByTestId('symptom-show-all').click();
  await expect(page.getByTestId('symptom-faults')).toContainText('TEST YUKON SZARPANIE');
  expect(errors).toEqual([]);
});

test('usuwanie: zapomnij auto — następne z garażu staje się aktywne, potem pusty profil', async ({ page }) => {
  const errors = await prepare(page, SUBURBAN, [YUKON]);
  await page.goto(BASE + '/moj-samochod');
  await hydrated(page.getByRole('button', { name: 'Zapomnij auto' }));
  await page.getByRole('button', { name: 'Zapomnij auto' }).click();
  await page.getByRole('button', { name: 'Tak, zapomnij' }).click();
  await expect(page.getByTestId('my-car-summary')).toContainText('GMC Yukon 4-door · 1998');
  await expect(page.getByTestId('my-car-notice')).toContainText('Aktywne jest teraz: GMC Yukon 4-door 1998');
  await page.getByRole('button', { name: 'Zapomnij auto' }).click();
  await page.getByRole('button', { name: 'Tak, zapomnij' }).click();
  await expect(page.getByRole('form', { name: 'Dane auta' })).toBeVisible();
  await expect(page.getByTestId('header-car-badge')).toHaveAttribute('data-state', 'empty');
  await expect(page.getByTestId('tab-moj-samochod')).toHaveAttribute('data-saved', 'false');
  expect(await stored(page)).toEqual({ profile: null, garage: null });
  // Bez auta listy niczego nie ukrywają.
  await page.goto(BASE + '/usterki');
  await expect(heading(page, 'TEST YUKON SZARPANIE')).toBeVisible();
  expect(errors).toEqual([]);
});

test('offline (PWA): /moj-samochod z zapisanym autem działa bez sieci', async ({ page, context, browserName, request }) => {
  const sw = await (await request.get(BASE + '/sw.js')).text();
  expect(sw).toContain("'/moj-samochod'");
  if (browserName !== 'chromium') {
    // WebKit (Playwright/Linux) nie obsługuje pewnie trybu offline z SW — tu wystarcza sprawdzenie, że strona jest w powłoce SW.
    return;
  }
  await prepare(page, SUBURBAN);
  await page.goto(BASE + '/');
  await page.evaluate(() => localStorage.setItem('gmt400_sw', '1'));
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await page.goto(BASE + '/moj-samochod');
  await expect(page.getByTestId('my-car-summary')).toContainText('Suburban 1500');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByTestId('my-car-summary')).toContainText('Suburban 1500');
  await context.setOffline(false);
});
