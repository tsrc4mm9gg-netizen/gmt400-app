const fs = require('node:fs');
const assert = require('node:assert/strict');
const mode = process.argv[2];
assert(['diy', 'material-text'].includes(mode));
const directory = 'reports/' + mode;
const steps = JSON.parse(process.env.STEP_RESULTS || '{}');
const required = mode === 'diy' ? ['install', 'build', 'tooling', 'server', 'tests'] : ['install', 'candidate', 'build', 'tooling', 'server', 'tests'];
const stages = Object.fromEntries(required.map(key => [key, steps[key]?.outcome || 'missing']));
let raw = {}, parseError = '';
try { raw = JSON.parse(fs.readFileSync(directory + '/tests.json', 'utf8')); } catch (error) { parseError = error.message; }
const tests = [];
function walk(suites) {
  for (const suite of suites || []) {
    for (const spec of suite.specs || []) for (const test of spec.tests || []) tests.push({ title: spec.title, file: (spec.file || suite.file || '').split(/[\\/]/).pop(), project: test.projectName, status: test.status, errors: (test.results || []).flatMap(result => result.errors || (result.error ? [result.error] : [])).map(error => String(error.message || '').slice(0, 3000)) });
    walk(suite.suites);
  }
}
walk(raw.suites);
const minima = mode === 'diy' ? { 'vehicle-filters.spec.cjs': 3, 'global-search.spec.cjs': 3, 'knowledge-categories.spec.cjs': 8, 'navigation.spec.cjs': 6, 'navigation-polish.spec.cjs': 2, 'diy-restoration.spec.cjs': 2 } : { 'material-text.spec.cjs': 5, 'notion-content.spec.cjs': 3 };
const projects = mode === 'diy' ? ['chromium'] : ['chromium', 'webkit'];
const coverage = projects.flatMap(project => Object.entries(minima).map(([file, minimum]) => ({ project, file, minimum, count: tests.filter(test => test.project === project && test.file === file).length })));
const stats = raw.stats || {};
const passed = Object.values(stages).every(value => value === 'success') && !parseError && !(raw.errors || []).length && tests.length > 0 && coverage.every(item => item.count >= item.minimum) && stats.expected === tests.length && stats.unexpected === 0 && stats.skipped === 0 && stats.flaky === 0 && tests.every(test => test.status === 'expected');
const report = { codeSha: process.env.GITHUB_SHA, runId: process.env.GITHUB_RUN_ID, checkedAt: new Date().toISOString(), passed, integrationApplied: false, scope: mode === 'diy' ? 'Current committed homepage; Chromium and mocked Notion fixtures. No page migration or repository writes.' : 'Candidate local MaterialText integration and synthetic fixture; Chromium and Linux WebKit. Production tests are unchanged; no source publication or live Notion certification.', stages, stats, coverage, parseError, runnerErrors: raw.errors || [], failures: tests.filter(test => test.status !== 'expected') };
fs.mkdirSync(directory, { recursive: true });
fs.writeFileSync(directory + '/report.json', JSON.stringify(report, null, 2) + '\n');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### ' + mode + ' verification\nResult: ' + (passed ? 'PASS' : 'FAIL') + '\nSource: ' + report.codeSha + '\nScope: ' + report.scope + '\nDetails and raw test output are workflow artifacts.\n');
process.exitCode = passed ? 0 : 1;
