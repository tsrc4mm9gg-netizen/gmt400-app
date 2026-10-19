const test = require('node:test');
const assert = require('node:assert/strict');
const { verify } = require('../scripts/verify-navigation-manifest.cjs');
function fixture(count = 2) { return { suites: [{ file: 'sample.spec.cjs', specs: Array.from({ length: count }, (_, i) => ({ file: 'sample.spec.cjs', line: i + 1, title: 'case ' + i, tests: [{ projectName: 'chromium', status: 'expected', results: [{ status: 'passed' }] }] })) }], stats: { expected: count, unexpected: 0, skipped: 0, flaky: 0 }, errors: [] }; }
const check = (plan, actual, minimum = 2) => verify(plan, actual, 'chromium', ['sample.spec.cjs'], minimum);
test('accepts complete successful matching plan', () => assert.equal(check(fixture(), fixture()).passed, true));
test('accepts additional planned tests without a hard upper count', () => assert.equal(check(fixture(3), fixture(3)).passed, true));
test('rejects missing result', () => assert.equal(check(fixture(), fixture(1)).passed, false));
test('rejects duplicate results even when totals match', () => { const actual = fixture(); actual.suites[0].specs[1] = actual.suites[0].specs[0]; assert.equal(check(fixture(), actual).passed, false); });
test('rejects skipped and flaky totals', () => { for (const field of ['skipped','flaky']) { const actual = fixture(); actual.stats[field] = 1; assert.equal(check(fixture(), actual).passed, false); } });
test('rejects missing file coverage and insufficient plan', () => { assert.equal(verify(fixture(), fixture(), 'chromium', ['missing.spec.cjs'], 2).passed, false); assert.equal(check(fixture(1), fixture(1)).passed, false); });
test('rejects wrong browser and runner errors', () => { assert.equal(verify(fixture(), fixture(), 'webkit', ['sample.spec.cjs'], 2).passed, false); const actual = fixture(); actual.errors.push({ message: 'runner failed' }); assert.equal(check(fixture(), actual).passed, false); });
test('rejects a retry or expected-failure result', () => { const actual = fixture(); actual.suites[0].specs[0].tests[0].results.push({ status: 'passed' }); assert.equal(check(fixture(), actual).passed, false); const failed = fixture(); failed.suites[0].specs[0].tests[0].results[0].status = 'failed'; assert.equal(check(fixture(), failed).passed, false); });
