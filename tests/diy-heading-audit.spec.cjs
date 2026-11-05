const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '../src/app/diy');
const slugs = fs.readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !entry.name.startsWith('[') && fs.existsSync(path.join(root, entry.name, 'page.tsx')))
  .map(entry => entry.name).sort();

test('DIY audit discovers the existing guide collection', () => {
  expect(slugs.length).toBeGreaterThanOrEqual(25);
});

async function verifyHeadings(page, scope) {
  const headings = await page.locator('main h1,main h2,main h3,main h4,main h5,main h6').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length > 0).map(node => ({ level: Number(node.tagName.slice(1)), text: node.textContent.trim() })));
  expect(headings.filter(item => item.level === 1), scope).toHaveLength(1);
  expect(headings[0]?.level, scope).toBe(1);
  const jumps = headings.flatMap((item, index) => index && item.level > headings[index - 1].level + 1 ? [`h${headings[index - 1].level} ${headings[index - 1].text} -> h${item.level} ${item.text}`] : []);
  expect(jumps, scope).toEqual([]);
}

for (const slug of slugs) {
  test(`DIY rendered structure: ${slug}`, async ({ page }) => {
    const response = await page.goto(`/diy/${slug}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    await verifyHeadings(page, `${slug}: initial`);
    const visited = new Set();
    for (let pass = 0; pass < 6; pass++) {
      const ids = await page.locator('main button[aria-controls][aria-expanded]').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length > 0 && node.parentElement?.matches('h2,h3,h4,h5,h6')).map(node => node.id));
      let changed = false;
      for (const id of ids) {
        expect(id, `${slug}: missing trigger id`).toBeTruthy();
        if (visited.has(id)) continue;
        const trigger = page.locator(`[id=${JSON.stringify(id)}]`);
        await expect(trigger).toHaveCount(1);
        if (!await trigger.isVisible()) continue;
        const panelId = await trigger.getAttribute('aria-controls');
        expect(panelId).toBeTruthy();
        const panel = page.locator(`[id=${JSON.stringify(panelId)}]`);
        await expect(panel).toHaveCount(1);
        await expect(panel).toHaveAttribute('aria-labelledby', id);
        if (await trigger.getAttribute('aria-expanded') === 'false') {
          await trigger.click();
          await expect(trigger).toHaveAttribute('aria-expanded', 'true');
        }
        await expect(panel).toBeVisible();
        await verifyHeadings(page, `${slug}: after ${await trigger.innerText()}`);
        visited.add(id);
        changed = true;
      }
      if (!changed) break;
    }
    const allIds = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
    expect(duplicateIds, slug).toEqual([]);
  });
}
