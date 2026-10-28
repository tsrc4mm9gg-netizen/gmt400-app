// Usterki: kafelek (zakres lat, fragment opisu, plakietka źródła), link do wpisu, filtr „tylko ze źródłami”, brak poziomego przewijania.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const DATA = { complete: true, results: [
  { id: 'a', Nazwa: 'Dudnienie wydechu na biegu D — test', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1996–2000 C/K — sprawdź w swoim aucie / manualu', Objawy: 'Dudnienie na biegu jałowym.', Opis: 'Biuletyn GM. Źródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/bulletins/828776', Rozwiązanie: '1. Opuść wydech. 2. Nowe uszczelki 4.3 L35. 3. Moment 48 N·m (35 lb ft). Sprawdź w swoim aucie / manualu.' },
  { id: 'b', Nazwa: 'Problemy z czymś — test bez źródła', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1988–1999', Objawy: 'Hałas', Opis: '', Rozwiązanie: 'Sprawdź to.' },
] };
test('usterki: kafelek wpisu i filtr źródeł', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.goto(`${BASE}/usterki`);
  await expect(page.getByTestId('issue-count')).toHaveText('Pokazano 2 z 2 usterek');
  // Lista pokazuje tylko kafelek (tytuł, tagi, krótki fragment); kroki i źródła są na stronie wpisu /baza/[id].
  const card = page.getByTestId('entry-tile').filter({ hasText: 'Dudnienie wydechu na biegu D' });
  await expect(card.getByTestId('tile-years')).toContainText('1996–2000');
  await expect(card.getByTestId('issue-sourced')).toBeVisible();
  await expect(card.getByTestId('tile-excerpt')).toContainText('Dudnienie na biegu jałowym.');
  await expect(card.getByTestId('issue-steps')).toHaveCount(0);
  await expect(card.getByRole('link', { name: 'Dudnienie wydechu na biegu D — test' })).toHaveAttribute('href', '/baza/a');
  await page.getByTestId('issue-sourced-only').check();
  await expect(page.getByTestId('issue-count')).toHaveText('Pokazano 1 z 2 usterek');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

// DIY: kafelek (lata, fragment instrukcji bez adresów URL, plakietka źródła), link do wpisu, filtr źródeł, bez przewijania w bok.
const DIY = { complete: true, results: [
  { id: 'd1', Nazwa: 'Wymiana oleju — test DIY', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1992–2000 — sprawdź w swoim aucie / manualu', Opis: 'Procedura GM.\nŹródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/7/7/60789', Rozwiązanie: 'Narzędzia: klucz 24 mm, pompka\nKrok po kroku (GM):\n1. Wykręć korek wlewu.\n2. Wykręć korek spustowy.\n3. Wkręć korek 47 N·m.\nMomenty (GM): korki 47 N·m.\n⚠️ Sprawdź w swoim aucie / manualu.' },
  { id: 'd2', Nazwa: 'Porada bez źródła — test DIY', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: '', Rozwiązanie: 'Sprawdź to.' },
] };
test('diy: kafelek wpisu, źródła i filtr', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DIY }));
  await page.goto(`${BASE}/diy`);
  await expect(page.getByTestId('diy-count')).toHaveText('Pokazano 2 z 2 poradników');
  const card = page.getByTestId('entry-tile').filter({ hasText: 'Wymiana oleju — test DIY' });
  await expect(card.getByTestId('tile-years')).toHaveText('1992–2000');
  await expect(card.getByTestId('diy-sourced')).toBeVisible();
  await expect(card.getByTestId('tile-excerpt')).toContainText('Procedura GM.');
  await expect(card.getByTestId('issue-steps')).toHaveCount(0);
  await expect(card.getByRole('link', { name: 'Wymiana oleju — test DIY' })).toHaveAttribute('href', '/baza/d1');
  await page.getByTestId('diy-sourced-only').check();
  await expect(page.getByTestId('diy-count')).toHaveText('Pokazano 1 z 2 poradników');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

// DIY: chipy kategorii, wyszukiwanie z „Wyczyść”, licznik i „Brak wyników” z „Wyczyść filtry”.
const DIY_CAT = { complete: true, results: [
  { id: 'c1', Nazwa: 'Wymiana oleju skrzyni 4L60E — test kategorii', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: 'Procedura.', Rozwiązanie: 'Wymień ATF.' },
  { id: 'c2', Nazwa: 'Wymiana klocków hamulcowych — test kategorii', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: 'Klocki i tarcze.', Rozwiązanie: 'Wymień klocki.' },
  { id: 'c3', Nazwa: 'Mycie felg — test kategorii', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: 'Kosmetyka.', Rozwiązanie: 'Szczotka.' },
] };
test('diy: chipy kategorii, Wyczyść w wyszukiwarce, licznik i Brak wyników', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DIY_CAT }));
  await page.goto(`${BASE}/diy`);
  const count = page.getByTestId('diy-count');
  await expect(count).toHaveText('Pokazano 3 z 3 poradników');
  await hydrated(page.getByTestId('diy-cat-hamulce'));
  const chips = page.getByTestId('diy-categories').getByRole('button');
  await expect(chips).toHaveCount(7);
  for (const chip of await chips.all()) expect((await chip.boundingBox()).height).toBeGreaterThanOrEqual(44);
  const hamulce = page.getByTestId('diy-cat-hamulce');
  await hamulce.click();
  await expect(hamulce).toHaveAttribute('aria-pressed', 'true');
  await expect(count).toHaveText('Pokazano 1 z 3 poradników · kategoria: Hamulce');
  await expect(page.getByTestId('entry-tile')).toHaveCount(1);
  await page.getByTestId('diy-cat-wszystkie').click();
  await expect(count).toHaveText('Pokazano 3 z 3 poradników');
  await expect(page.getByTestId('diy-search-clear')).toHaveCount(0);
  await page.getByLabel('Szukaj porady DIY').fill('nic-takiego');
  await expect(page.getByTestId('diy-empty')).toContainText('Brak wyników');
  await page.getByTestId('diy-search-clear').click();
  await expect(page.getByLabel('Szukaj porady DIY')).toHaveValue('');
  await expect(count).toHaveText('Pokazano 3 z 3 poradników');
  await page.getByTestId('diy-cat-silnik').click();
  await page.getByLabel('Szukaj porady DIY').fill('felg');
  await expect(page.getByTestId('diy-empty')).toBeVisible();
  await page.getByTestId('diy-clear-filters').click();
  await expect(page.getByTestId('diy-empty')).toHaveCount(0);
  await expect(page.getByLabel('Szukaj porady DIY')).toHaveValue('');
  await expect(page.getByTestId('diy-cat-wszystkie')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).toHaveText('Pokazano 3 z 3 poradników');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

// Usterki: chipy kategorii, Wyczyść w wyszukiwarce, licznik i Brak wyników z „Wyczyść filtry”.
const ISS_CAT = { complete: true, results: [
  { id: 'u1', Nazwa: 'Skrzynia 4L60E ślizga się — test kategorii', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Objawy: 'Ślizganie przy ruszaniu.', Opis: 'Zużyte sprzęgła.', Rozwiązanie: 'Remont.' },
  { id: 'u2', Nazwa: 'Piszczenie hamulców — test kategorii', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Objawy: 'Pisk przy hamowaniu.', Opis: 'Klocki.', Rozwiązanie: 'Wymiana.' },
  { id: 'u3', Nazwa: 'Zacinające się wycieraczki — test kategorii', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Objawy: 'Zacinanie.', Opis: 'Mechanizm.', Rozwiązanie: 'Smarowanie.' },
] };
test('usterki: chipy kategorii, Wyczyść w wyszukiwarce, licznik i Brak wyników', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: ISS_CAT }));
  await page.goto(`${BASE}/usterki`);
  const count = page.getByTestId('issue-count');
  await expect(count).toHaveText('Pokazano 3 z 3 usterek');
  await hydrated(page.getByTestId('issue-cat-hamulce'));
  const chips = page.getByTestId('issue-categories').getByRole('button');
  await expect(chips).toHaveCount(7);
  for (const chip of await chips.all()) expect((await chip.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.getByTestId('issue-cat-hamulce').click();
  await expect(page.getByTestId('issue-cat-hamulce')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).toHaveText('Pokazano 1 z 3 usterek · kategoria: Hamulce');
  await expect(page.getByTestId('entry-tile')).toHaveCount(1);
  await page.getByTestId('issue-cat-wszystkie').click();
  await expect(page.getByTestId('issue-search-clear')).toHaveCount(0);
  await page.getByLabel('Szukaj usterki').fill('nic-takiego');
  await expect(page.getByTestId('issue-empty')).toContainText('Brak wyników');
  await page.getByTestId('issue-search-clear').click();
  await expect(page.getByLabel('Szukaj usterki')).toHaveValue('');
  await expect(count).toHaveText('Pokazano 3 z 3 usterek');
  await page.getByTestId('issue-cat-skrzynia').click();
  await page.getByLabel('Szukaj usterki').fill('wycieraczki');
  await expect(page.getByTestId('issue-empty')).toBeVisible();
  await page.getByTestId('issue-clear-filters').click();
  await expect(page.getByTestId('issue-empty')).toHaveCount(0);
  await expect(page.getByLabel('Szukaj usterki')).toHaveValue('');
  await expect(page.getByTestId('issue-cat-wszystkie')).toHaveAttribute('aria-pressed', 'true');
  await expect(count).toHaveText('Pokazano 3 z 3 usterek');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
