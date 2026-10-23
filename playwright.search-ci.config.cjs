// Testy wyszukiwania /szukaj: stronicowanie i semantyka pola. Chromium + WebKit, 390 / 768 / 1280 px.
const { defineConfig } = require('@playwright/test');
const chromiumLaunch = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const sizes = {
  390: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  768: { viewport: { width: 768, height: 1024 } },
  1280: { viewport: { width: 1280, height: 800 } },
};
const projects = [];
for (const browserName of ['chromium', 'webkit']) for (const [w, size] of Object.entries(sizes)) {
  projects.push({ name: `${browserName}-${w}`, use: { browserName, ...(browserName === 'chromium' ? { launchOptions: chromiumLaunch } : {}), ...size } });
}
module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['search-results-pagination.spec.cjs', 'search-input-semantics.spec.cjs'],
  timeout: 30000,
  expect: { timeout: 10000 },
  workers: 1,
  retries: 0,
  use: { serviceWorkers: 'block', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects,
});
