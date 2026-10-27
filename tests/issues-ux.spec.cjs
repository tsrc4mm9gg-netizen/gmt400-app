// Usterki: kafelek (zakres lat, fragment opisu, plakietka źródła), link do wpisu, filtr „tylko ze źródłami”, brak poziomego przewijania.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const DATA = { complete: true, results: [
  { id: 'a', Nazwa: 'Dudnienie wydechu na biegu D — test', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1996–2000 C/K — sprawdź w swoim aucie / manualu', Objawy: 'Dudnienie na biegu jałowym.', Opis: 'Biuletyn GM. Źródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/bulletins/828776', Rozwiązanie: '1. Opuść wydech. 2. Nowe uszczelki 4.3 L35. 3. Moment 48 N·m (35 lb ft). Sprawdź w swoim aucie / manualu.' },
  { id: 'b', Nazwa: 'Problemy z czymś — test bez źródła', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1988–1999', Objawy: 'Hałas', Opis: '', Rozwiązanie: 'Sprawdź to.' },
] };
test('usterki: kafelek wpisu i filtr źródeł', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.goto(`${BASE}/usterki`);
  await expect(page.getByTestId('issue-count')).toHaveText('Znaleziono: 2 usterek');
  // Lista pokazuje tylko kafelek (tytuł, tagi, krótki fragment); kroki i źródła są na stronie wpisu /baza/[id].
  const card = page.getByTestId('entry-tile').filter({ hasText: 'Dudnienie wydechu na biegu D' });
  await expect(card.getByTestId('tile-years')).toContainText('1996–2000');
  await expect(card.getByTestId('issue-sourced')).toBeVisible();
  await expect(card.getByTestId('tile-excerpt')).toContainText('Dudnienie na biegu jałowym.');
  await expect(card.getByTestId('issue-steps')).toHaveCount(0);
  await expect(card.getByRole('link', { name: 'Dudnienie wydechu na biegu D — test' })).toHaveAttribute('href', '/baza/a');
  await page.getByTestId('issue-sourced-only').check();
  await expect(page.getByTestId('issue-count')).toHaveText('Znaleziono: 1 usterek');
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
  await expect(page.getByTestId('diy-count')).toHaveText('Znaleziono: 2');
  const card = page.getByTestId('entry-tile').filter({ hasText: 'Wymiana oleju — test DIY' });
  await expect(card.getByTestId('tile-years')).toHaveText('1992–2000');
  await expect(card.getByTestId('diy-sourced')).toBeVisible();
  await expect(card.getByTestId('tile-excerpt')).toContainText('Procedura GM.');
  await expect(card.getByTestId('issue-steps')).toHaveCount(0);
  await expect(card.getByRole('link', { name: 'Wymiana oleju — test DIY' })).toHaveAttribute('href', '/baza/d1');
  await page.getByTestId('diy-sourced-only').check();
  await expect(page.getByTestId('diy-count')).toHaveText('Znaleziono: 1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
