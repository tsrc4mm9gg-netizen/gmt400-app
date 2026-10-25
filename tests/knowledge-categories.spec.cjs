const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const generalRules = () => Object.fromEntries(['brand', 'model', 'years', 'engine', 'drive', 'transmission'].map(key => [key, ['Wszystkie']]));
const fixture = (Nazwa, Typ, id) => ({ Nazwa, Typ, id, Model: 'Wszystkie', Opis: 'Treść testowa kategorii.', applicability: generalRules() });
const data = [
  fixture('TEST MODEL', 'Model', '00000000-0000-0000-0000-000000000001'),
  fixture('TEST USTERKA', 'Usterka', '00000000-0000-0000-0000-000000000002'),
  fixture('TEST P0300', 'Kod błędu', '00000000-0000-0000-0000-000000000003'),
  fixture('TEST PORADA', 'Porada', '00000000-0000-0000-0000-000000000004'),
  fixture('TEST Punkty masy', 'Porada', '00000000-0000-0000-0000-000000000005'),
];
// /modele, /usterki, /kody-obd i /schematy mają teraz własne strony (testy w ux-key-paths.spec.cjs).
for (const [path, title, expected] of [
  ['poradniki', 'Poradniki', ['TEST PORADA', 'TEST Punkty masy']],
]) {
  test(`category ${path} shows correct entries and permalinks`, async ({ page }) => {
    await page.route('**/api/notion', route => route.fulfill({ json: { results: data, count: data.length, complete: true } }));
    await page.goto(`${BASE}/${path}`);
    await expect(page.getByRole('heading', { name: title, exact: true, level: 1 })).toBeVisible();
    for (const item of data) {
      const heading = page.getByRole('heading', { name: item.Nazwa, exact: true, level: 2 });
      if (expected.includes(item.Nazwa)) {
        await expect(heading).toBeVisible();
        await expect(heading.getByRole('link')).toHaveAttribute('href', '/baza/' + item.id);
      } else await expect(heading).toHaveCount(0);
    }
    await expect(page.getByRole('navigation', { name: 'Kategorie bazy wiedzy' }).getByRole('link')).toHaveCount(5);
  });
}
test('category search and clearing query restore visible entries', async ({ page }) => {
  await page.route('**/api/notion', route => route.fulfill({ json: { results: data, count: data.length, complete: true } }));
  await page.goto(`${BASE}/poradniki`);
  await expect(page.getByRole('heading', { name: 'TEST PORADA', exact: true })).toBeVisible();
  await page.getByLabel('Szukaj w tej kategorii', { exact: true }).fill('punkty');
  await expect(page.getByRole('heading', { name: 'TEST PORADA', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'TEST Punkty masy', exact: true })).toBeVisible();
  await page.getByLabel('Szukaj w tej kategorii', { exact: true }).fill('zzzzbrak');
  await expect(page.getByText('Brak wyników przy obecnych ustawieniach.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Wyczyść frazę wyszukiwania', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'TEST PORADA', exact: true })).toBeVisible();
});
test('fetch failure is distinct from empty data and retry works', async ({ page }) => {
  // Gdy serwer wyrenderował listę (ISR, initialItems), błąd odświeżania w tle jest celowo cichy — lista zostaje widoczna.
  const serverHtml = await (await page.request.get(`${BASE}/poradniki`)).text();
  test.skip(/href="\/baza\/[0-9a-f-]{36}"/.test(serverHtml), 'serwer wyrenderował wpisy (initialItems) — komunikat błędu dotyczy tylko trybu bez danych z serwera');
  let requests = 0;
  await page.route('**/api/notion', route => {
    requests++;
    return requests === 1 ? route.fulfill({ status: 503, json: { error: 'test' } }) : route.fulfill({ json: { results: data, count: data.length, complete: true } });
  });
  await page.goto(`${BASE}/poradniki`);
  const fetchError = page.getByRole('alert').filter({ hasText: 'Nie udało się pobrać treści' });
  await expect(fetchError).toHaveCount(1);
  await expect(fetchError).toBeVisible();
  await expect(fetchError).toContainText('To nie oznacza braku materiałów w bazie.');
  await expect(page.getByText('W pobranej bazie nie ma wpisów tej kategorii.', { exact: true })).toHaveCount(0);
  await fetchError.getByRole('button', { name: 'Ponów pobieranie', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'TEST PORADA', exact: true })).toBeVisible();
  await expect(fetchError).toHaveCount(0);
  expect(requests).toBeGreaterThanOrEqual(2);
});
