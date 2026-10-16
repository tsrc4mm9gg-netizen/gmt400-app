const { test, expect } = require('@playwright/test');
async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'modele'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [], count: 0 } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('navigation', { name: 'Skróty sekcji', exact: true })).toBeVisible();
}
async function headingInView(page, heading) {
  await expect(heading).toBeVisible();
  await expect.poll(() => heading.evaluate(node => { const r = node.getBoundingClientRect(); const bottom = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom || 0); return r.top >= bottom && r.bottom <= window.innerHeight; })).toBe(true);
  await expect(heading).toBeFocused();
}
test('four collapsed groups retain nineteen uniform single-action tiles', async ({ page }) => {
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await expect(nav.getByRole('button')).toHaveCount(4);
  const groups = [
    ['Moje GMT400', ['Moje auto', 'Dziennik', 'Paliwo']],
    ['Modele i dane', ['Modele', 'Specyfikacje', 'Historia', 'Porównaj']],
    ['Serwis i części', ['Usterki', 'Kody OBD', 'DIY', 'Schematy', 'VIN/RPO', 'Serwis', 'Tips', 'Części', 'Tuning']],
    ['Zakup i import', ['Kupujący', 'Import', 'Koszty']],
  ];
  for (const [label, children] of groups) {
    await nav.getByRole('button', { name: label, exact: true }).click();
    await expect(nav.locator('[aria-expanded="true"]')).toHaveCount(1);
    for (const child of children) await expect(nav.getByRole('button', { name: child, exact: true })).toBeVisible();
    await expect(nav.getByRole('button')).toHaveCount(4 + children.length);
    await expect(nav.locator('[data-navigation-items] > li > button')).toHaveCount(children.length);
    await expect(nav.getByRole('link')).toHaveCount(0);
    await expect(nav.locator('svg')).toHaveCount(0);
    await nav.getByRole('button', { name: label, exact: true }).click();
    await expect(nav.getByRole('button')).toHaveCount(4);
  }
});
test('section selection collapses tiles and reveals focused content heading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.getByRole('button', { name: 'Serwis i części', exact: true }).click();
  await nav.getByRole('button', { name: 'Usterki', exact: true }).click();
  await headingInView(page, page.getByRole('heading', { name: 'USTERKI', exact: true }));
  await expect(nav.getByRole('button')).toHaveCount(4);
});
test('mobile header menu closes and reveals import heading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.getByRole('button', { name: 'Otwórz menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Menu główne', exact: true });
  await menu.getByRole('button', { name: 'Zakup i import', exact: true }).click();
  await menu.getByRole('button', { name: 'Import', exact: true }).click();
  await expect(menu).toHaveCount(0);
  await headingInView(page, page.getByRole('heading', { name: 'IMPORT DO POLSKI', exact: true }));
});
for (const width of [375, 390, 430]) test(`equal two by two tiles and visible subtiles at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.scrollIntoViewIfNeeded();
  const boxes = await nav.locator('[data-navigation-groups] > button').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height }; }));
  expect(boxes).toHaveLength(4);
  for (const box of boxes) { expect(Math.abs(box.w - boxes[0].w)).toBeLessThan(1); expect(box.h).toBe(72); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.w).toBeLessThanOrEqual(width); }
  expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
  expect(Math.abs(boxes[2].y - boxes[3].y)).toBeLessThan(1);
  expect(Math.abs(boxes[0].x - boxes[2].x)).toBeLessThan(1);
  expect(boxes[2].y).toBeGreaterThan(boxes[0].y + boxes[0].h);
  await nav.getByRole('button', { name: 'Modele i dane', exact: true }).click();
  const items = nav.locator('[data-navigation-items]');
  await expect.poll(() => items.evaluate(node => { const r = node.getBoundingClientRect(); const bottom = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom || 0); return r.top >= bottom && r.top < window.innerHeight; })).toBe(true);
  const children = await items.locator(':scope > li').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, w: r.width, h: r.height }; }));
  expect(children).toHaveLength(4);
  expect(children[0].y).toBeGreaterThan(boxes[3].y + boxes[3].h);
  expect(Math.abs(children[0].y - children[1].y)).toBeLessThan(1);
  expect(Math.abs(children[0].x - children[2].x)).toBeLessThan(1);
  for (const child of children) { expect(Math.abs(child.w - children[0].w)).toBeLessThan(1); expect(child.h).toBe(52); expect(child.x + child.w).toBeLessThanOrEqual(width); }
  await page.screenshot({ path: info.outputPath(`navigation-${width}.png`), fullPage: true });
});
