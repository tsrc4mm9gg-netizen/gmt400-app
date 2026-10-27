// Listy jako zwarte kafelki: tytuł, miniatura (zdjęcie wpisu albo ikona), krótki fragment opisu (line-clamp), tagi;
// cała treść otwiera się dopiero po kliknięciu (strona /baza/[id]). Sprawdzane przy 390 px.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const LONG = Array.from({ length: 40 }, (_, i) => `Bardzo długie zdanie opisu numer ${i + 1}, które nie może rozciągać listy.`).join(' ');
const ID = n => `00000000-0000-0000-0000-00000000010${n}`;
const DATA = { complete: true, results: [
  { id: ID(1), Nazwa: 'Wymiana oleju skrzyni 4L60E — test kafelka', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1996–1999 (wg instrukcji GM C/K 1999; inne roczniki sprawdź) — sprawdź w swoim aucie / manualu', Opis: 'Procedura GM.\nŹródło: https://gm.saturn.team/Chevrolet/Tahoe___4WD/1999/7/7/60789', Rozwiązanie: `Narzędzia: klucz 24 mm\nKrok po kroku (GM): 1. Zlej olej 2. Wymień filtr 3. ${LONG}` },
  { id: ID(2), Nazwa: 'Dudnienie wydechu — test usterki bez zdjęcia', Typ: 'Usterka', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1988–1999', Objawy: 'Dudnienie na biegu jałowym.', Opis: LONG, Rozwiązanie: 'Sprawdź mocowania.' },
  { id: ID(3), Nazwa: 'P0300 — test kodu', Typ: 'Kod błędu', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: LONG, Rozwiązanie: LONG },
] };

for (const [path, count, title, kind] of [['/diy', 'diy-count', 'Wymiana oleju skrzyni 4L60E — test kafelka', 'Porada'], ['/usterki', 'issue-count', 'Dudnienie wydechu — test usterki bez zdjęcia', 'Usterka'], ['/poradniki', null, 'Wymiana oleju skrzyni 4L60E — test kafelka', 'Porada']]) {
  test(`kafelki ${path}: zwarty podgląd, cały kafelek jest linkiem do /baza/[id]`, async ({ page }) => {
    const errors = []; page.on('pageerror', e => errors.push(String(e)));
    await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + path);
    const tile = page.getByTestId('entry-tile').filter({ hasText: title });
    await expect(tile).toHaveCount(1);
    await tile.scrollIntoViewIfNeeded();
    // tytuł, miniatura (zdjęcie albo ikona), fragment opisu i tagi model + lata
    await expect(tile.getByTestId('tile-title')).toContainText(title);
    await expect(tile.getByTestId('tile-thumb')).toBeVisible();
    await expect(tile.getByTestId('tile-model')).toHaveText('Wszystkie');
    await expect(tile.getByTestId('tile-years')).toHaveText(kind === 'Porada' ? '1996–1999' : '1988–1999');
    const excerpt = tile.getByTestId('tile-excerpt');
    await expect(excerpt).toBeVisible();
    // line-clamp: najwyżej 2 linie, a pełna treść (kilkaset znaków) nie trafia do listy
    const clamp = await excerpt.evaluate(el => ({ lines: getComputedStyle(el).webkitLineClamp, text: el.textContent.length, h: el.getBoundingClientRect().height, lh: parseFloat(getComputedStyle(el).lineHeight) }));
    expect(clamp.lines).toBe('2');
    expect(clamp.text).toBeLessThanOrEqual(205);
    expect(clamp.h).toBeLessThanOrEqual(clamp.lh * 2 + 2);
    await expect(tile).not.toContainText('numer 30');
    if (count) await expect(page.getByTestId(count)).toBeVisible();
    // zwarty kafelek (nie wielostronicowy opis) i cel dotyku ≥ 44 px
    const box = await tile.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeLessThan(260);
    const link = tile.getByRole('link', { name: title });
    await expect(link).toHaveAttribute('href', '/baza/' + (kind === 'Porada' ? ID(1) : ID(2)));
    // klik w narożnik kafelka (poza tytułem) też otwiera wpis
    await tile.click({ position: { x: box.width - 12, y: box.height - 8 } });
    await expect(page).toHaveURL(new RegExp('/baza/' + (kind === 'Porada' ? ID(1) : ID(2)) + '$'));
    expect(errors).toEqual([]);
  });
}

test('kafelki: strona bez poziomego przewijania, ikona kategorii gdy brak zdjęcia, lista kodów', async ({ page }) => {
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/diy');
  const noPhoto = page.getByTestId('entry-tile').filter({ hasText: 'Wymiana oleju skrzyni 4L60E' });
  await expect(noPhoto.getByTestId('tile-thumb').locator('img')).toHaveCount(1); // „4L60E” → ilustracja wpisu
  for (const path of ['/diy', '/usterki', '/poradniki']) {
    await page.goto(BASE + path);
    await expect(page.getByTestId('entry-tile').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  }
});

test('kafelki: wpis bez zdjęcia ma srebrną ikonę kategorii zamiast obrazka', async ({ page }) => {
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/usterki');
  const issue = page.getByTestId('entry-tile').filter({ hasText: 'Dudnienie wydechu' });
  await expect(issue.getByTestId('tile-thumb').locator('svg')).toHaveCount(1); // brak zdjęcia → srebrna ikona
  await expect(issue.getByTestId('tile-thumb').locator('img')).toHaveCount(0);
});
