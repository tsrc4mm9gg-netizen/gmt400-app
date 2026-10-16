const { test, expect } = require('@playwright/test');
async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'modele'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [], count: 0 } }));
  await page.goto('http://127.0.0.1:3100');
  await expect(page.getByRole('navigation', { name: 'Skróty sekcji', exact: true })).toBeVisible();
}
async function headingInView(page, heading) {
  await expect(heading).toBeVisible();
  await expect.poll(() => heading.evaluate(node => { const r = node.getBoundingClientRect(); const header = document.querySelector('header')?.getBoundingClientRect().bottom || 0; const nav = document.querySelector('nav[aria-label="Skróty sekcji"]')?.getBoundingClientRect().bottom || 0; return r.top >= Math.max(header, nav) && r.bottom <= window.innerHeight; })).toBe(true);
  await expect(heading).toBeFocused();
}
test('category, section selection and stored content stay synchronized for all nineteen sections', async ({ page }) => {
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  const groups = [
    ['Moje GMT400', [['mojeauto','Moje auto'], ['dziennik','Dziennik'], ['paliwo','Paliwo']]],
    ['Modele i dane', [['modele','Modele'], ['specyfikacje','Specyfikacje'], ['historia','Historia'], ['porownaj','Porównaj']]],
    ['Serwis i części', [['usterki','Usterki'], ['kody','Kody OBD'], ['diy','DIY'], ['schematy','Schematy'], ['vin','VIN/RPO'], ['serwis','Serwis'], ['tips','Tips'], ['czesci','Części'], ['tuning','Tuning']]],
    ['Zakup i import', [['kupujacy','Kupujący'], ['import','Import'], ['kalkulator','Koszty']]],
  ];
  for (const [label, children] of groups) {
    await nav.getByRole('button', { name: label, exact: true }).click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400_tab'))).toBe(children[0][0]);
    await expect(nav.locator('[data-navigation-groups] [data-active="true"]')).toHaveCount(1);
    await expect(nav.getByRole('button', { name: label, exact: true })).toHaveAttribute('data-active', 'true');
    await expect(nav.getByRole('button')).toHaveCount(4 + children.length);
    for (const [id, child] of children) {
      const button = nav.getByRole('button', { name: child, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(nav.locator('[data-navigation-items] [aria-pressed="true"]')).toHaveCount(1);
      await expect.poll(() => page.evaluate(() => localStorage.getItem('gmt400_tab'))).toBe(id);
      await expect(nav.getByText(`Aktualnie: ${label} / ${child}`, { exact: true })).toBeVisible();
    }
    await expect(nav.getByRole('link')).toHaveCount(0);
  }
});
test('switching from import to garage replaces import content instead of only changing menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.getByRole('button', { name: 'Zakup i import', exact: true }).click();
  await nav.getByRole('button', { name: 'Import', exact: true }).click();
  await headingInView(page, page.getByRole('heading', { name: 'IMPORT DO POLSKI', exact: true }));
  await nav.getByRole('button', { name: 'Moje GMT400', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'IMPORT DO POLSKI', exact: true })).toHaveCount(0);
  await expect(nav.getByRole('button', { name: 'Moje auto', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(nav.getByRole('button', { name: 'Moje GMT400', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(nav.getByText('Aktualnie: Moje GMT400 / Moje auto', { exact: true })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Import', exact: true })).toHaveCount(0);
  await expect(nav).toHaveAttribute('data-pinned', 'true');
  await nav.getByRole('button', { name: 'Serwis i części', exact: true }).click();
  await headingInView(page, page.getByRole('heading', { name: 'USTERKI', exact: true }));
  await expect(nav.getByRole('button', { name: 'Usterki', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
test('header menu chooses a section and main navigation reflects actual content', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await prepare(page);
  await page.getByRole('button', { name: 'Otwórz menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Menu główne', exact: true });
  await menu.getByRole('button', { name: 'Zakup i import', exact: true }).click();
  await menu.getByRole('button', { name: 'Import', exact: true }).click();
  await expect(menu).toHaveCount(0);
  await headingInView(page, page.getByRole('heading', { name: 'IMPORT DO POLSKI', exact: true }));
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await expect(nav.getByRole('button', { name: 'Zakup i import', exact: true })).toHaveAttribute('data-active', 'true');
  await expect(nav.getByRole('button', { name: 'Import', exact: true })).toHaveAttribute('aria-pressed', 'true');
});
for (const width of [375, 390, 430]) test(`symmetric navigation and selected content at ${width}px`, async ({ page }, info) => {
  await page.setViewportSize({ width, height: 844 });
  await prepare(page);
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  await nav.getByRole('button', { name: 'Modele i dane', exact: true }).click();
  await expect.poll(() => nav.evaluate(node => { const r = node.getBoundingClientRect(); const header = document.querySelector('header')?.getBoundingClientRect().bottom || 0; return r.top >= header && r.bottom < window.innerHeight; })).toBe(true);
  const boxes = await nav.locator('[data-navigation-groups] > button').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }));
  expect(boxes).toHaveLength(4);
  for (const box of boxes) { expect(Math.abs(box.w - boxes[0].w)).toBeLessThan(1); expect(box.h).toBe(72); expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.w).toBeLessThanOrEqual(width); }
  expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
  expect(Math.abs(boxes[2].y - boxes[3].y)).toBeLessThan(1);
  expect(Math.abs(boxes[0].x - boxes[2].x)).toBeLessThan(1);
  const children = await nav.locator('[data-navigation-items] > li').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }));
  expect(children).toHaveLength(4);
  expect(Math.abs(children[0].y - children[1].y)).toBeLessThan(1);
  expect(Math.abs(children[0].x - children[2].x)).toBeLessThan(1);
  for (const child of children) { expect(Math.abs(child.w - children[0].w)).toBeLessThan(1); expect(child.h).toBe(52); expect(child.x + child.w).toBeLessThanOrEqual(width); }
  await expect(nav.getByRole('button', { name: 'Modele', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.screenshot({ path: info.outputPath(`navigation-${width}.png`), fullPage: true });
});
