// Testy kluczowych ścieżek: Chromium + WebKit, telefon 390×844 i komputer 1280×800.
// Lokalnie bez WebKit: PW_CHROMIUM_PATH=/usr/bin/google-chrome PW_PROJECTS=chromium npx playwright test --config=playwright.ux.config.cjs
const { defineConfig } = require('@playwright/test');
const chromiumLaunch = process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {};
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const desktop = { viewport: { width: 1280, height: 800 } };
const all = [
  { name: 'chromium-mobile', use: { browserName: 'chromium', launchOptions: chromiumLaunch, ...mobile } },
  { name: 'chromium-desktop', use: { browserName: 'chromium', launchOptions: chromiumLaunch, ...desktop } },
  { name: 'webkit-mobile', use: { browserName: 'webkit', ...mobile } },
  { name: 'webkit-desktop', use: { browserName: 'webkit', ...desktop } },
];
const only = (process.env.PW_PROJECTS || '').split(',').filter(Boolean);
module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['ux-key-paths.spec.cjs', 'my-car-rpo.spec.cjs', 'vin-full.spec.cjs', 'issues-ux.spec.cjs', 'guides.spec.cjs', 'home-v2.spec.cjs', 'ssr-lists.spec.cjs', 'diagnoza.spec.cjs'],
  timeout: 60000, expect: { timeout: 10000 }, workers: 2, retries: 0,
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: only.length ? all.filter(project => only.some(prefix => project.name.startsWith(prefix))) : all,
});
