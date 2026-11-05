const { test, expect } = require('@playwright/test');

for (const route of ['/diy/wymiana-oleju-silnikowego', '/kody-obd']) {
  test(`accordion semantics and keyboard: ${route}`, async ({ page }) => {
    await page.goto(route);
    const triggers = page.locator('h2 > button[aria-controls][aria-expanded]');
    expect(await triggers.count()).toBeGreaterThan(0);
    const trigger = triggers.first();
    await expect(trigger).toBeVisible();
    const panelId = await trigger.getAttribute('aria-controls');
    const panel = page.locator(`[id=${JSON.stringify(panelId)}]`);
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('aria-labelledby', await trigger.getAttribute('id'));
    await trigger.focus();
    await expect(trigger).toBeFocused();
    const wasOpen = await trigger.getAttribute('aria-expanded') === 'true';
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', String(!wasOpen));
    await expect(panel).toHaveJSProperty('hidden', wasOpen);
    await expect(panel).toBeAttached();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', String(wasOpen));
    await expect(panel).toHaveJSProperty('hidden', !wasOpen);
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
}

test('existing reminder survives update of another reminder and reload', async ({ page }) => {
  const original = [
    { id: 'oil', name: 'Olej + filtr', intervalKm: 8000, lastKm: 142000, lastDate: '2026-10-01' },
    { id: 'air', name: 'Filtr powietrza', intervalKm: 20000, lastKm: 130000, lastDate: '2026-09-01' },
  ];
  await page.goto('/api/status');
  await page.evaluate(data => {
    localStorage.setItem('gmt400-reminders', JSON.stringify(data));
    localStorage.setItem('gmt400-current-km', '150000');
  }, original);
  await page.goto('/moj-samochod');
  await page.getByRole('button', { name: 'Oznacz wykonanie: Olej + filtr', exact: true }).click();
  await page.getByLabel('Przebieg wykonania — Olej + filtr (km)', { exact: true }).fill('149900');
  await page.getByRole('button', { name: 'Zapisz wykonanie: Olej + filtr', exact: true }).click();
  await expect.poll(async () => JSON.parse(await page.evaluate(() => localStorage.getItem('gmt400-reminders')))[0].lastKm).toBe(149900);
  const saved = JSON.parse(await page.evaluate(() => localStorage.getItem('gmt400-reminders')));
  expect(saved[1]).toEqual(original[1]);
  expect(saved[0].intervalKm).toBe(original[0].intervalKm);
  await page.reload();
  await expect(page.getByText(/Ostatnio: 149\s900 km/)).toBeVisible();
  expect(JSON.parse(await page.evaluate(() => localStorage.getItem('gmt400-reminders')))[1]).toEqual(original[1]);
});

test('storage write failure does not report success or modify saved mileage', async ({ page }) => {
  await page.goto('/api/status');
  await page.evaluate(() => localStorage.setItem('gmt400-current-km', '150000'));
  await page.goto('/moj-samochod');
  const input = page.getByLabel('Aktualny przebieg (km)', { exact: true });
  await expect(input).toBeVisible();
  await page.evaluate(() => { Storage.prototype.setItem = function () { throw new DOMException('Blocked for test', 'QuotaExceededError'); }; });
  await input.fill('160000');
  await page.getByRole('button', { name: 'Zapisz przebieg', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Nie udało się zapisać przebiegu' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('gmt400-current-km'))).toBe('150000');
  await expect(input).toHaveValue('160000');
  await expect(page.getByText('Przebieg został zapisany.', { exact: true })).toHaveCount(0);
});

test('reminder form has no horizontal overflow on narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/moj-samochod');
  const input = page.getByLabel('Aktualny przebieg (km)', { exact: true });
  await expect(input).toBeVisible();
  const section = input.locator('xpath=ancestor::div[contains(@class,"space-y-4")][1]');
  const size = await section.evaluate(node => ({ width: node.clientWidth, scroll: node.scrollWidth }));
  expect(size.scroll).toBeLessThanOrEqual(size.width + 1);
});
