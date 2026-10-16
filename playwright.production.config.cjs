const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['production-entry-live.spec.cjs'],
  timeout: 90000,
  expect: { timeout: 30000 },
  workers: 1,
  retries: 0,
  use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
});
