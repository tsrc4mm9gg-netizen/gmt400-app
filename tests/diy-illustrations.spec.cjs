// Ilustracje w DIY: miniatura zdjęcia z rejestru na liście, plakietka „z rysunkiem”, ikona bez obrazu,
// a w pełnej instrukcji (/baza/[id]) powiększenie obrazu w lightboxie z widoczną atrybucją.
const { test, expect } = require('@playwright/test');
const { hydrated } = require('./helpers/hydration.cjs');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const PHOTO = '406d7bf1-c139-81c7-a5df-cabcd0d06741'; // 6.5 TD rozruch zimą: zdjęcie K2500 (Commons) + rysunek
const DRAWING = '406d7bf1-c139-815f-a311-f2d5638e438f'; // uszczelki kolektora: tylko własny rysunek
const PLAIN = '00000000-0000-0000-0000-000000000199'; // bez wpisu w rejestrze i bez słowa kluczowego
const mk = (id, Nazwa) => ({ id, Nazwa, Typ: 'Porada', Model: 'Wszystkie', Modele: ['Wszystkie'], Lata: '1988–1999', Opis: 'Opis testowy wpisu.', Rozwiązanie: 'Krok pierwszy.' });
const DATA = { complete: true, results: [mk(PHOTO, 'Rozruch zimą — test zdjęcia'), mk(DRAWING, 'Wymiana uszczelek — test rysunku'), mk(PLAIN, 'Zupełnie inny temat — test ikony')] };

test('lista /diy: zdjęcie z rejestru jako miniatura 64×64, rysunek → plakietka, brak obrazu → ikona', async ({ page }) => {
  await page.context().route(u => u.pathname.startsWith('/api/notion'), r => r.fulfill({ json: DATA }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/diy');
  const tile = t => page.getByTestId('entry-tile').filter({ hasText: t });
  const photo = tile('test zdjęcia');
  await expect(photo).toHaveCount(1);
  const img = photo.getByTestId('tile-thumb').locator('img');
  await expect(img).toHaveCount(1);
  await expect(img).toHaveAttribute('loading', 'lazy');
  await photo.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  const box = await photo.getByTestId('tile-thumb').boundingBox();
  expect(Math.round(box.width)).toBe(64); expect(Math.round(box.height)).toBe(64);
  await expect(photo.getByTestId('tile-drawing')).toHaveCount(0);

  const drawing = tile('test rysunku');
  await expect(drawing.getByTestId('tile-thumb').locator('svg')).toHaveCount(1);
  await expect(drawing.getByTestId('tile-drawing')).toHaveText('z rysunkiem');

  const plain = tile('test ikony');
  await expect(plain.getByTestId('tile-thumb').locator('svg')).toHaveCount(1);
  await expect(plain.getByTestId('tile-drawing')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
});

for (const [id, label] of [[PHOTO, 'zdjęcie'], [DRAWING, 'rysunek']]) {
  test(`/baza/[id] (${label}): obraz otwiera lightbox, Esc zamyka i oddaje fokus, atrybucja widoczna`, async ({ page }) => {
    const res = await page.request.get(BASE + '/baza/' + id);
    test.skip(!process.env.SSR_LISTS && res.status() !== 200, 'serwer nie ma danych Notion');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/baza/' + id);
    const fig = page.getByTestId('entry-figure').first();
    await expect(fig).toBeVisible();
    await expect(fig.getByTestId('figure-credit')).toBeVisible();
    const trigger = fig.getByRole('link', { name: /^Powiększ:/ });
    await trigger.scrollIntoViewIfNeeded();
    await hydrated(trigger);
    await trigger.focus();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Powiększenie ilustracji' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('img')).toHaveAttribute('alt', /.{10,}/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}
