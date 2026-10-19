const fs = require('node:fs');
const path = require('node:path');
function flatten(raw) {
  if (!raw || !Array.isArray(raw.suites)) throw new Error('Missing suites');
  const rows = [];
  function walk(suites) { for (const suite of suites) { for (const spec of suite.specs || []) for (const test of spec.tests || []) rows.push({ key: JSON.stringify([path.basename(spec.file || suite.file || ''), spec.line || 0, spec.column || 0, spec.title, test.projectName || '']), file: path.basename(spec.file || suite.file || ''), project: test.projectName, title: spec.title, status: test.status, results: test.results || [] }); walk(suite.suites || []); } }
  walk(raw.suites); return rows;
}
function verify(plan, actual, project, requiredFiles, minimum = 38) {
  const planned = flatten(plan), completed = flatten(actual), errors = [];
  if ((plan.errors || []).length || (actual.errors || []).length) errors.push('runner-errors');
  if (planned.length < minimum) errors.push('below-minimum');
  if (planned.some(t => t.project !== project) || completed.some(t => t.project !== project)) errors.push('wrong-project');
  if (new Set(planned.map(t => t.key)).size !== planned.length || new Set(completed.map(t => t.key)).size !== completed.length) errors.push('duplicate-tests');
  if (JSON.stringify(planned.map(t => t.key).sort()) !== JSON.stringify(completed.map(t => t.key).sort())) errors.push('plan-result-mismatch');
  const coverage = requiredFiles.map(file => ({ file, planned: planned.filter(t => t.file === file).length, completed: completed.filter(t => t.file === file).length }));
  if (coverage.some(row => row.planned < 1 || row.completed !== row.planned)) errors.push('missing-file-coverage');
  const stats = actual.stats || {};
  if (stats.expected !== planned.length || stats.unexpected !== 0 || stats.skipped !== 0 || stats.flaky !== 0) errors.push('unsuccessful-stats');
  if (completed.some(t => t.status !== 'expected' || t.results.length !== 1 || t.results[0].status !== 'passed')) errors.push('unsuccessful-tests');
  return { passed: errors.length === 0, planned: planned.length, completed: completed.length, minimum, errors, coverage, failures: completed.filter(t => t.status !== 'expected').map(t => ({ title: t.title, status: t.status })) };
}
module.exports = { verify };
if (require.main === module) {
  const config = require('../playwright.context-ci.config.cjs');
  const reports = {};
  for (const project of config.projects) {
    try {
      const read = kind => JSON.parse(fs.readFileSync(`reports/context/${project.name}-${kind}.json`, 'utf8'));
      reports[project.name] = verify(read('plan'), read('results'), project.name, project.testMatch);
    } catch (error) { reports[project.name] = { passed: false, planned: 0, completed: 0, errors: [String(error.message)] }; }
  }
  const names = ['INSTALL','UNITS','BUILD','TOOLING','SERVER','CHROMIUM_PLAN','CHROMIUM','WEBKIT_PLAN','WEBKIT'];
  const stages = Object.fromEntries(names.map(name => [name, process.env[name] || 'missing']));
  const passed = Object.values(stages).every(value => value === 'success') && Object.values(reports).every(report => report.passed);
  const report = { codeSha: process.env.GITHUB_SHA, runId: process.env.GITHUB_RUN_ID, passed, integrationApplied: false, scope: 'Local committed source; identical configured selections used for discovery and execution; no deployment or physical iPhone certification.', stages, reports };
  fs.mkdirSync('.diagnostics', { recursive: true });
  fs.writeFileSync('.diagnostics/navigation-context-report.json', JSON.stringify(report, null, 2) + '\n');
  const lines = ['## Nawigacja — kompletność planu testów', '', 'Wynik: ' + (passed ? 'PASS' : 'FAIL'), 'Commit: `' + (process.env.GITHUB_SHA || 'unknown') + '`', '', '| Przeglądarka | Plan | Wyniki | Zaliczenie |', '|---|---:|---:|---|', ...Object.entries(reports).map(([name, result]) => `| ${name} | ${result.planned} | ${result.completed} | ${result.passed ? 'PASS' : 'FAIL'} |`), '', 'Minimum 38 testów na przeglądarkę. Wszystkie testy z planu muszą wystąpić dokładnie raz i przejść bez skip/flaky/retry. Obecność każdego skonfigurowanego pliku jest sprawdzana.', '', 'To porównanie planu i wykonania z tego samego commitu; nie dowodzi, że wcześniej nie usunięto testów ze źródeł. Nie zastępuje przeglądu zmian testów.', '', 'Brak zmian aplikacji i automatycznej publikacji. Szczegóły w artefakcie navigation-context-diagnostics.'];
  for (const [name, result] of Object.entries(reports)) if (!result.passed) lines.push('', '### ' + name, ...result.errors.map(error => '- ' + error));
  lines.push('', '| Etap | Wynik |', '|---|---|', ...Object.entries(stages).map(([name, result]) => `| ${name} | ${result} |`));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  if (!passed) process.exitCode = 1;
}
