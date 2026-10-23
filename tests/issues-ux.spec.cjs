// Usterki: kroki jako lista, zakres lat, przyczyna i źródła, filtr „tylko ze źródłami”, brak poziomego przewijania.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const DATA = { complete: true, results: [
  { id: 'a', Nazwa: 'Dudnienie wydechu na biegu D — test', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1996–2000 C/K — sprawdź w swoim aucie / manualu', Objawy: 'Dudnienie na biegu jałowym.', Opis: 'Biuletyn GM. Źródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/bulletins/828776', Rozwiązanie: '1. Opuść wydech. 2. Nowe uszczelki 4.3 L35. 3. Moment 48 N·m (35 lb ft). Sprawdź w swoim aucie / manualu.' },
  { id: 'b', Nazwa: 'Problemy z czymś — test bez źródła', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1988–1999', Objawy: 'Hałas', Opis: '', Rozwiązanie: 'Sprawdź to.' },
] };
test('usterki: struktura wpisu i filtr źródeł', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.goto(`${BASE}/usterki`);
  await expect(page.getByTestId('issue-count')).toHaveText('Znaleziono: 2 usterek');
  const card = page.locator('div.bg-neutral-950', { hasText: 'Dudnienie wydechu na biegu D' }).first();
  await expect(card.getByTestId('issue-steps').locator('ol > li')).toHaveCount(3);
  await expect(card.getByTestId('issue-steps').locator('ol > li').nth(1)).toContainText('4.3 L35');
  await expect(card.getByTestId('issue-years')).toContainText('1996–2000');
  await card.getByText('Przyczyna i źródła').click();
  const link = card.getByTestId('issue-cause').locator('a');
  await expect(link).toHaveAttribute('href', 'https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/bulletins/828776');
  await expect(link).toHaveAttribute('rel', /noopener/);
  await page.getByTestId('issue-sourced-only').check();
  await expect(page.getByTestId('issue-count')).toHaveText('Znaleziono: 1 usterek');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

// DIY: kroki w osobnych liniach → jedna lista, etykiety (Narzędzia/Momenty), opis i źródła, filtr źródeł, 390 px bez przewijania w bok.
const DIY = { complete: true, results: [
  { id: 'd1', Nazwa: 'Wymiana oleju — test DIY', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1992–2000 — sprawdź w swoim aucie / manualu', Opis: 'Procedura GM.\nŹródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/7/7/60789', Rozwiązanie: 'Narzędzia: klucz 24 mm, pompka\nKrok po kroku (GM):\n1. Wykręć korek wlewu.\n2. Wykręć korek spustowy.\n3. Wkręć korek 47 N·m.\nMomenty (GM): korki 47 N·m.\n⚠️ Sprawdź w swoim aucie / manualu.' },
  { id: 'd2', Nazwa: 'Porada bez źródła — test DIY', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: '', Rozwiązanie: 'Sprawdź to.' },
] };
test('diy: numerowane kroki, etykiety, źródła i filtr', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DIY }));
  await page.goto(`${BASE}/diy`);
  await expect(page.getByTestId('diy-count')).toHaveText('Znaleziono: 2');
  const card = page.locator('div.bg-neutral-950', { hasText: 'Wymiana oleju — test DIY' }).first();
  await expect(card.getByTestId('issue-steps').locator('ol > li')).toHaveCount(3);
  await expect(card.getByTestId('issue-steps').locator('ol > li').nth(2)).toContainText('47 N·m');
  await expect(card.getByTestId('steps-label').first()).toHaveText('Narzędzia:');
  await expect(card.getByTestId('issue-years')).toContainText('1992–2000');
  await expect(card.getByTestId('diy-sourced')).toBeVisible();
  await card.getByText('Opis i źródła').click();
  await expect(card.getByTestId('issue-cause').locator('a')).toHaveAttribute('href', 'https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/7/7/60789');
  await page.getByTestId('diy-sourced-only').check();
  await expect(page.getByTestId('diy-count')).toHaveText('Znaleziono: 1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
