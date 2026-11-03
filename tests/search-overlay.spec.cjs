// Globalna wyszukiwarka w nagłówku: pole „Szukaj kodu, objawu…” → nakładka z grupami wyników, profil auta, ostatnie wyszukiwania.
const { test, expect } = require('@playwright/test');
const BASE = process.env.UX_BASE || 'http://127.0.0.1:3100';
const trackErrors = page => { const errors = []; page.on('pageerror', e => { if (!/[?&]_rsc=.*access control checks/.test(e.message)) errors.push(String(e)); }); return errors; };
const profileJson = JSON.stringify({ version: 2, profile: { brand: 'Chevrolet', platform: 'C/K', model: 'K1500', year: '1997', engine: 'L31', drive: '4WD', transmission: '', rpoCodes: [] } });
const EXTRA = [
  { g: 'usterki', k: 'test-stuki-ck', t: 'Stuki w przednim zawieszeniu C/K — test', u: '/baza/test-stuki-ck', s: 'Stuka przy najeżdżaniu na nierówności.', b: 'usterka stuka stuki zawieszenie', y: '1995–1998', am: ['C/K'], ay: ['1995-1998'] },
  { g: 'usterki', k: 'test-stuki-yukon', t: 'Stuki tylko Yukon 1999 — test', u: '/baza/test-stuki-yukon', s: 'Stuka w Yukonie.', b: 'usterka stuka stuki yukon', y: '1998–2000', m: ['GMC Yukon'], am: ['Yukon'], ay: ['1998-2000'] },
  { g: 'usterki', k: 'test-stuki-ogolne', t: 'Stuki ogólne bez zakresu — test', u: '/baza/test-stuki-ogolne', s: 'Ogólny opis stuków.', b: 'usterka stuka stuki' },
];
async function withFixtures(page) {
  await page.route('**/api/search-index', async route => {
    const response = await route.fetch();
    const data = await response.json();
    await route.fulfill({ json: { ...data, docs: [...EXTRA, ...data.docs] } });
  });
}
async function openOverlay(page) {
  await page.getByTestId('header-search').click();
  const overlay = page.getByTestId('search-overlay');
  await expect(overlay).toBeVisible();
  await expect(page.getByTestId('search-overlay-input')).toBeFocused();
  return overlay;
}

test('pole wyszukiwania jest w nagłówku każdej podstrony i ma cel ≥44 px', async ({ page }) => {
  for (const path of ['/', '/schematy', '/kody-obd', '/przeglady', '/vin']) {
    await page.goto(BASE + path);
    const trigger = page.getByTestId('header-search');
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText('Szukaj kodu, objawu');
    const box = await trigger.boundingBox();
    expect(box.height, path).toBeGreaterThanOrEqual(43.5);
    expect(box.width, path).toBeGreaterThanOrEqual(43.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), path).toBeLessThanOrEqual(1);
  }
});

test('nakładka: autofokus, blokada przewijania, Escape i „Zamknij” zamykają i oddają fokus', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(BASE + '/schematy');
  await openOverlay(page);
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
  const overlayBox = await page.getByTestId('search-overlay').boundingBox();
  const viewport = page.viewportSize();
  expect(overlayBox.y).toBeLessThanOrEqual(0.5);
  expect(overlayBox.height).toBeGreaterThanOrEqual(viewport.height - 1);
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('search-overlay')).toHaveCount(0);
  await expect(page.getByTestId('header-search')).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
  await openOverlay(page);
  await page.getByTestId('search-overlay-close').click();
  await expect(page.getByTestId('search-overlay')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('wyniki w grupach: P0300 → Kody OBD, „rpo” → Strony i narzędzia, polskie znaki opcjonalne', async ({ page }) => {
  await page.goto(BASE + '/');
  await openOverlay(page);
  const input = page.getByTestId('search-overlay-input');
  await input.fill('P0300');
  const obd = page.getByTestId('search-group-obd');
  await expect(obd).toBeVisible();
  await expect(obd.getByTestId('search-result').first()).toContainText('P0300');
  await input.fill('rpo');
  const pages = page.getByTestId('search-group-strony');
  await expect(pages.locator('a[href="/narzedzia/rpo"]')).toBeVisible();
  await input.fill('harmonogram przegladow');
  await expect(page.getByTestId('search-group-strony').locator('a[href="/przeglady"]')).toBeVisible();
  // Cele dotykowe w nakładce.
  for (const el of await page.getByTestId('search-overlay').locator('a:visible, button:visible').all()) {
    const box = await el.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(43.5);
  }
  await page.getByTestId('search-group-strony').locator('a[href="/przeglady"]').click();
  await expect(page).toHaveURL(/\/przeglady$/);
  await expect(page.getByTestId('search-overlay')).toHaveCount(0);
});

test('„stuka” → Usterki; Enter prowadzi do /szukaj?q=, ostatnie wyszukiwania można wyczyścić', async ({ page }) => {
  await withFixtures(page);
  await page.goto(BASE + '/kody-obd');
  await openOverlay(page);
  await expect(page.getByTestId('search-profile-chip')).toHaveCount(0);
  const input = page.getByTestId('search-overlay-input');
  await input.fill('stuka');
  const group = page.getByTestId('search-group-usterki');
  await expect(group).toContainText('Stuki w przednim zawieszeniu C/K — test');
  await expect(group).toContainText('Stuki tylko Yukon 1999 — test');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/szukaj\?q=stuka$/);
  await openOverlay(page);
  const recent = page.getByTestId('search-recent');
  await expect(recent).toContainText('stuka');
  await recent.getByRole('button', { name: 'stuka' }).click();
  await expect(page.getByTestId('search-overlay-input')).toHaveValue('stuka');
  await page.getByTestId('search-overlay-input').fill('');
  await page.getByTestId('search-recent-clear').click();
  await expect(page.getByTestId('search-recent')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('gmt400_search_recent_v1'))).toBeNull();
});

test('profil auta: „Dla mojego auta” ukrywa tylko wyraźnie inne auto, „Pokaż wszystko” jest zapamiętane', async ({ page }) => {
  await withFixtures(page);
  await page.addInitScript(json => localStorage.setItem('gmt400_vehicle_profile_v2', json), profileJson);
  await page.goto(BASE + '/schematy');
  await openOverlay(page);
  const chip = page.getByTestId('search-profile-chip');
  await expect(chip).toContainText('Dla: K1500 · 1997 · L31');
  await expect(page.getByTestId('search-scope-mine')).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('search-overlay-input').fill('stuka');
  const group = page.getByTestId('search-group-usterki');
  const rows = group.getByTestId('search-result');
  await expect(rows.first()).toContainText('Stuki w przednim zawieszeniu C/K — test');
  await expect(rows.first()).toHaveAttribute('data-fit', 'match');
  await expect(group).toContainText('Stuki ogólne bez zakresu — test');
  await expect(group).not.toContainText('Stuki tylko Yukon 1999 — test');
  await page.getByTestId('search-scope-all').click();
  await expect(page.getByTestId('search-scope-all')).toHaveAttribute('aria-pressed', 'true');
  await expect(group).toContainText('Stuki tylko Yukon 1999 — test');
  expect(await page.evaluate(() => localStorage.getItem('gmt400_search_scope_v1'))).toBe('all');
  await page.keyboard.press('Escape');
  await page.reload();
  await openOverlay(page);
  await expect(page.getByTestId('search-scope-all')).toHaveAttribute('aria-pressed', 'true');
});

test('API /api/search-index: lekki indeks z grupami i bez stron administracyjnych', async ({ request }) => {
  const response = await request.get(BASE + '/api/search-index');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text.length).toBeLessThan(650000); // pełne słowa wpisów Notion; ładowane dopiero po otwarciu/fokusie wyszukiwarki
  const data = JSON.parse(text);
  expect(data.version).toBe(1);
  const groups = new Set(data.docs.map(doc => doc.g));
  for (const g of ['obd', 'modele', 'poradniki', 'strony']) expect(groups.has(g)).toBe(true);
  for (const doc of data.docs) {
    expect(doc.u).toMatch(/^\//);
    expect(doc.u).not.toMatch(/^\/(admin|api)\b/);
    expect(doc.s.length).toBeLessThanOrEqual(141);
  }
  expect(data.engines.L31).toBe('5.7');
});
