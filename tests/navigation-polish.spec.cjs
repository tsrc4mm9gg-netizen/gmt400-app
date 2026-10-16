const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => localStorage.setItem('gmt400_tab', 'modele'));
  await page.route('**/api/notion', route => route.fulfill({ json: { results: [], count: 0 } }));
});
test('navigation has tactile gradients instead of flat yellow and white outlines', async ({ page }, info) => {
  await page.goto('http://127.0.0.1:3100');
  const nav = page.getByRole('navigation', { name: 'Skróty sekcji', exact: true });
  const service = nav.getByRole('button', { name: 'Serwis i części', exact: true });
  await service.click();
  const styles = await service.evaluate(node => { const s = getComputedStyle(node); return { image: s.backgroundImage, shadow: s.boxShadow, background: s.backgroundColor, outline: s.outlineStyle }; });
  expect(styles.image).toContain('linear-gradient');
  expect(styles.shadow).toContain('inset');
  expect(styles.background).not.toBe('rgb(244, 185, 0)');
  expect(styles.outline).toBe('none');
  await page.screenshot({ path: info.outputPath('tactile-navigation.png'), fullPage: true });
});
test('profile launcher sits inside its panel rather than floating over content', async ({ page }) => {
  await page.goto('http://127.0.0.1:3100/usterki');
  const panel = page.getByRole('region', { name: 'Filtrowanie według profilu auta', exact: true });
  const launcher = panel.getByRole('button', { name: 'Ustaw profil auta', exact: true });
  await expect(launcher).toBeVisible();
  expect(await launcher.evaluate(node => getComputedStyle(node).position)).toBe('static');
  await launcher.click();
  await expect(page.getByRole('dialog', { name: 'Moje auto — wspólny profil', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Zamknij profil', exact: true }).click();
  await expect(launcher).toBeFocused();
});
