const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ testDir: './tests', testMatch: ['official-live.spec.cjs'], workers: 1, retries: 0, timeout: 120000, expect: { timeout: 30000 }, use: { browserName: 'webkit', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, trace: 'off', screenshot: 'only-on-failure' } });
