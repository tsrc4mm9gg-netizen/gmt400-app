const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const fixture = (Nazwa, Typ, id) => ({ Nazwa, Typ, id, Model: 'Wszystkie', Opis: 'Treść testowa kategorii.' });
const data = [
  fixture('TEST MODEL', 'Model', '00000000-0000-0000-0000-000000000001'),
  fixture('TEST USTERKA', 'Usterka', '00000000-0000-0000-0000-000000000002'),
  fixture('TEST P0300', 'Kod błędu', '00000000-0000-0000-0000-000000000003'),
  fixture('TEST PORADA', 'Porada', '00000000-0000-0000-0000-000000000004'),
  fixture('TEST Punkty masy', 'Porada', '00000000-0000-0000-0000-000000000005'),
];
for (const [path, title, expected] of [
  ['modele', 'Modele GMT400', ['TEST MODEL']],
  ['usterki', 'Usterki i diagnostyka', ['TEST USTERKA']],
  ['kody-obd', 'Kody OBD', ['TEST P0300']],
  ['poradniki', 'Poradniki', ['TEST PORADA', 'TEST Punkty masy']],
  ['schematy', 'Schematy i punkty masy', ['TEST Punkty masy']],
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
  let requests = 0;
  await page.route('**/api/notion', route => {
    requests++;
    return requests === 1 ? route.fulfill({ status: 503, json: { error: 'test' } }) : route.fulfill({ json: { results: data, count: data.length, complete: true } });
  });
  await page.goto(`${BASE}/usterki`);
  const fetchError = page.getByRole('alert').filter({ hasText: 'Nie udało się pobrać treści' });
  await expect(fetchError).toHaveCount(1);
  await expect(fetchError).toBeVisible();
  await expect(fetchError).toContainText('To nie oznacza braku materiałów w bazie.');
  await expect(page.getByText('W pobranej bazie nie ma wpisów tej kategorii.', { exact: true })).toHaveCount(0);
  await fetchError.getByRole('button', { name: 'Ponów pobieranie', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'TEST USTERKA', exact: true })).toBeVisible();
  await expect(fetchError).toHaveCount(0);
  expect(requests).toBeGreaterThanOrEqual(2);
});
test('profile counters and default filtering are scoped to the current knowledge category', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('gmt400_tab', 'modele');
    localStorage.setItem('gmt400_vehicle_profile_v1', JSON.stringify({ version: 1, profile: { brand: 'Chevrolet', model: 'Suburban', year: '1999', engine: '', drive: '', transmission: '' } }));
  });
  await page.route('**/api/notion', route => route.fulfill({ json: { results: data, count: data.length, complete: true } }));
  await page.goto(`${BASE}/poradniki`);
  const panel = page.getByRole('region', { name: 'Filtrowanie według profilu auta' });
  await expect(panel.getByRole('button', { name: 'Dla mojego auta (2)', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(panel.getByRole('button', { name: 'Wszystkie (2)', exact: true })).toBeVisible();
await panel.getByRole('button', { name: 'Filtry zaawansowane', exact: true }).click();
  await expect(panel.getByRole('button', { name: 'Zgodne z zakresem (0)', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEST PORADA', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEST Punkty masy', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEST P0300', exact: true })).toHaveCount(0);
  await page.getByRole('link', { name: 'Schematy', exact: true }).click();
  const diagramPanel = page.getByRole('region', { name: 'Filtrowanie według profilu auta' });
  await expect(diagramPanel.getByRole('button', { name: 'Wszystkie (1)', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEST Punkty masy', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEST USTERKA', exact: true })).toHaveCount(0);
});
