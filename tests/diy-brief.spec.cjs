// DIY: miniatura z danych wpisu, blok uwag bezpieczeństwa, lista narzędzi/części i widoczne Źródła + „Sprawdź w swoim aucie / manualu”.
// Strony /baza/[id] są renderowane na serwerze z atrapy Notion (tests/helpers/mock-notion.mjs + fixtures/notion-blocks.json).
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const SIR = '406d7bf1-c139-81bf-a68d-d6eab2e69aba';     // ostrzeżenia + źródło, parafraza, brak listy narzędzi
const HEADLIGHT = '406d7bf1-c139-817a-8ac7-cdfbdc51ba26'; // UWAGA + bloki „Narzędzia/Części”
const TIRES = '406d7bf1-c139-81bf-9d1c-ff68bf51b9d5';   // Usterka ze źródłem

test.describe('DIY: kafelek z obrazkiem z danych', () => {
  const ID = n => `00000000-0000-0000-0000-00000000020${n}`;
  const DATA = { complete: true, results: [
    { id: ID(1), Nazwa: 'Wpis z obrazkiem w danych', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Obraz: '/diy-brakes-pl.jpg', Opis: 'Krótki opis.' },
    { id: ID(2), Nazwa: 'Wpis ze zdalnym obrazkiem', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Obraz: 'https://obcy.example/a.jpg', Opis: 'Krótki opis.' },
    { id: ID(3), Nazwa: 'Wpis bez obrazka', Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Opis: 'Krótki opis.' },
  ] };
  test('miniatura z pola Obraz tylko dla lokalnej ścieżki; brak = ikona', async ({ page }) => {
    await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
    await page.goto(BASE + '/diy');
    const thumb = n => page.getByTestId('entry-tile').filter({ hasText: n }).getByTestId('tile-thumb');
    await expect(thumb('Wpis z obrazkiem w danych').locator('img')).toHaveCount(1);
    await expect(thumb('Wpis z obrazkiem w danych').locator('img')).toHaveAttribute('src', /diy-brakes-pl\.jpg/);
    await expect(thumb('Wpis ze zdalnym obrazkiem')).toBeVisible();
    await expect(thumb('Wpis ze zdalnym obrazkiem').locator('img')).toHaveCount(0);
    await expect(thumb('Wpis bez obrazka').locator('img')).toHaveCount(0);
    await expect(thumb('Wpis bez obrazka').locator('svg').first()).toBeVisible();
  });
});

test('procedura z uwagami: blok bezpieczeństwa na górze, źródło i weryfikacja w manualu', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(`${BASE}/baza/${SIR}`);
  const safety = page.getByTestId('diy-safety');
  await expect(safety).toBeVisible();
  await expect(safety).toContainText('wyłączyć układ SIR przed pracami');
  // blok uwag jest nad treścią wpisu (Opis)
  const [sy, oy] = await Promise.all([safety.boundingBox(), page.getByRole('heading', { name: 'Opis', exact: true }).boundingBox()]);
  expect(sy.y).toBeLessThan(oy.y);
  // brak danych o narzędziach → brak pustej checklisty, tylko subtelna informacja
  await expect(page.getByTestId('diy-checklist')).toHaveCount(0);
  await expect(page.getByTestId('diy-no-list')).toContainText('Brak listy narzędzi i części');
  const verify = page.getByTestId('entry-verify');
  await expect(verify.getByRole('heading', { name: 'Sprawdź w swoim aucie / manualu' })).toBeVisible();
  await expect(page.getByTestId('entry-sources')).toContainText('Haynes, Chevrolet & GMC Pick-ups 1988–98');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('procedura z blokami Notion: checklista narzędzi i części', async ({ page }) => {
  await page.goto(`${BASE}/baza/${HEADLIGHT}`);
  const list = page.getByTestId('diy-checklist');
  await expect(list).toBeVisible();
  await expect(page.getByTestId('diy-tools')).toContainText('klucz 10 mm');
  await expect(page.getByTestId('diy-tools')).toContainText('zestaw nasadek 1/4');
  await expect(page.getByTestId('diy-parts')).toContainText('żarówka H4 (komplet)');
  await expect(page.getByTestId('diy-no-list')).toHaveCount(0);
  await expect(page.getByTestId('diy-safety')).toContainText('Żarówki halogenowe są pod ciśnieniem');
});

test('inne typy wpisu: bez bloków porady, ale z Źródłami i weryfikacją', async ({ page }) => {
  await page.goto(`${BASE}/baza/${TIRES}`);
  await expect(page.getByTestId('diy-safety')).toHaveCount(0);
  await expect(page.getByTestId('diy-checklist')).toHaveCount(0);
  await expect(page.getByTestId('diy-no-list')).toHaveCount(0);
  await expect(page.getByTestId('entry-verify')).toBeVisible();
  await expect(page.getByTestId('entry-sources')).toContainText('Haynes');
});
