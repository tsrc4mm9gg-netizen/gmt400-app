const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({ testDir: './tests', testMatch: ['official-vehicle-api.spec.cjs'], workers: 1, retries: 0, timeout: 15000, reporter: [['list'], ['json', { outputFile: 'test-results/official-api/report.json' }]] });
