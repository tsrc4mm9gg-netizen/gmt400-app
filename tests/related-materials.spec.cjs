const { test, expect } = require('@playwright/test');
const BASE = 'http://127.0.0.1:3100';
const entry = (id, Nazwa, Typ, Model, Objawy) => ({ id, Nazwa, Typ, Model, Objawy });
const results = [
  entry('current', 'Silnik pracuje nierówno', 'Usterka', 'Suburban', 'nierowna praca silnika'),
  entry('related', 'Sprawdzenie zaplonu', 'Usterka', 'Suburban', 'nierowna praca silnika'),
  entry('other-model', 'Inny model', 'Usterka', 'Yukon', 'nierowna praca silnika'),
  entry('no-id', 'Bez identyfikatora', 'Usterka', 'Suburban', 'nierowna praca silnika')
];
test('related materials appear only for safe matches and link to existing entries', async({page}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/notion', route => route.fulfill({ json: { results, count: results.length, complete: true } }));
  await page.goto(BASE + '/usterki');
  await expect(page.getByRole('heading', { name: 'Powiązane materiały' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sprawdzenie zaplonu' })).toHaveAttribute('href', /baza\/related$/);
  await expect(page.getByRole('link', { name: 'Inny model' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Bez identyfikatora' })).toHaveCount(0);
});
test('related materials section is absent when no safe match exists', async({page}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [results[0]], count: 1, complete: true } }));
  await page.goto(BASE + '/usterki');
  await expect(page.getByRole('heading', { name: 'Silnik pracuje nierówno' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Powiązane materiały' })).toHaveCount(0);
});
