const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['reminders-storage.spec.cjs', 'a11y-package.spec.cjs', 'faq-accessibility.spec.cjs', 'homepage-accessibility.spec.cjs', 'diy-heading-audit.spec.cjs'],
  timeout: 45000,
  expect: { timeout: 10000 },
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:3100', viewport: { width: 390, height: 844 }, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 3100', url: 'http://127.0.0.1:3100/api/status', reuseExistingServer: false, timeout: 120000 },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'webkit', use: { browserName: 'webkit', isMobile: true, hasTouch: true } },
  ],
});
