const { defineConfig } = require('@playwright/test');
const webkit = require('./playwright.webkit.config.cjs');
const chromiumFiles = ['vehicle-filters.spec.cjs','global-search.spec.cjs','knowledge-categories.spec.cjs','navigation.spec.cjs','navigation-polish.spec.cjs','diy-restoration.spec.cjs','notion-pagination.spec.cjs','notion-content.spec.cjs','model-catalog.spec.cjs','navigation-context.spec.cjs','visual-consistency.spec.cjs'];
module.exports = defineConfig({
  testDir: './tests', workers: 1, retries: 0,
  projects: [
    { name: 'chromium', testMatch: chromiumFiles, timeout: 30000, expect: { timeout: 5000 }, use: { browserName: 'chromium', trace: 'retain-on-failure', screenshot: 'only-on-failure' } },
    { name: 'webkit', testMatch: [...new Set([...webkit.testMatch,'model-catalog.spec.cjs','navigation-context.spec.cjs','visual-consistency.spec.cjs'])], timeout: webkit.timeout, expect: webkit.expect, use: webkit.use },
  ],
});
