const { test, expect } = require('@playwright/test');

for (const title of ['Najczęstsze problemy', 'Dane serwisowe', 'Poradniki PL', 'Więcej']) {
  test(`homepage accordion: ${title}`, async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: title, exact: true });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panelId = await trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    const panel = page.locator(`[id=${JSON.stringify(panelId)}]`);
    await expect(panel).toHaveCount(1);
    await expect(panel).toHaveAttribute('aria-labelledby', await trigger.getAttribute('id'));
    await expect(panel).toBeHidden();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel).toBeVisible();
    await expect.poll(() => panel.locator(':scope > *').count()).toBeGreaterThan(0);
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });
}

for (const route of ['/', '/kody-obd', '/diy/wymiana-oleju-silnikowego', '/moj-samochod']) {
  test(`rendered headings after expansion: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main h1')).toBeVisible();
    const visited = new Set();
    for (let pass = 0; pass < 6; pass++) {
      const candidateIds = await page.locator('main button[aria-expanded="false"][aria-controls]').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length > 0 && node.parentElement?.matches('h2,h3,h4,h5,h6')).map(node => node.id));
      let changed = false;
      for (const candidateId of candidateIds) {
        expect(candidateId, 'Accordion trigger must have a stable id').toBeTruthy();
        if (visited.has(candidateId)) continue;
        const candidate = page.locator(`[id=${JSON.stringify(candidateId)}]`);
        await expect(candidate).toHaveCount(1);
        if (!await candidate.isVisible()) continue;
        if (await candidate.getAttribute('aria-expanded') !== 'false') continue;
        await candidate.click();
        await expect(candidate).toHaveAttribute('aria-expanded', 'true');
        visited.add(candidateId);
        changed = true;
      }
      if (!changed) break;
    }
    const headings = await page.locator('main h1,main h2,main h3,main h4,main h5,main h6').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length > 0).map(node => ({ level: Number(node.tagName.slice(1)), text: node.textContent.trim() })));
    expect(headings.filter(item => item.level === 1)).toHaveLength(1);
    expect(headings[0]?.level).toBe(1);
    const jumps = headings.flatMap((item, index) => index && item.level > headings[index - 1].level + 1 ? [`${headings[index - 1].text} (h${headings[index - 1].level}) -> ${item.text} (h${item.level})`] : []);
    expect(jumps, `Heading jumps on ${route}`).toEqual([]);
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
}
