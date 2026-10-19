const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['search-results-pagination.spec.cjs', 'search-input-semantics.spec.cjs'],
  timeout: 30000,
  expect: { timeout: 5000 },
  workers: 1,
  retries: 0,
  use: { browserName: 'chromium', serviceWorkers: 'block', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
});
