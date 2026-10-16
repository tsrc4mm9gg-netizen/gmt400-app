#!/usr/bin/env node
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const reportPath = '.diagnostics/navigation-context-report.json';
const roadmapPath = 'docs/ROADMAP.md';
if (!fs.existsSync(reportPath)) throw new Error('Verification report is missing');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const head = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const verified = report.codeSha === head && report.passed === true && report.integrationApplied === true;
if (!verified) {
  fs.mkdirSync('.diagnostics', { recursive: true });
  fs.writeFileSync('.diagnostics/roadmap-progression.json', JSON.stringify({ checkedAt: new Date().toISOString(), head, reportCodeSha: report.codeSha, passed: report.passed, progression: 'blocked', reason: 'Latest verification report does not cover the current commit or did not pass' }, null, 2) + '\n');
  console.log('Progression blocked: current commit is not covered by a passing verification report.');
  process.exit(0);
}
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
const completed = [1, 2, 3, 4];
for (const number of completed) roadmap = roadmap.replace(new RegExp('^- \\[ \\] (' + number + '\\.)'), '- [x] $1');
fs.writeFileSync(roadmapPath, roadmap);
const queue = { updatedAt: new Date().toISOString(), verifiedThrough: head, completedPackages: [1], next: { id: 3, title: 'Visual hierarchy and accent restraint', roadmapPoints: [5, 6, 7], preparation: 'scripts/prepare-visual-hierarchy.cjs', status: 'queued' } };
fs.mkdirSync('.diagnostics', { recursive: true });
fs.writeFileSync('.diagnostics/roadmap-queue.json', JSON.stringify(queue, null, 2) + '\n');
execSync('node ' + queue.next.preparation, { stdio: 'inherit' });
fs.writeFileSync('.diagnostics/roadmap-progression.json', JSON.stringify({ checkedAt: new Date().toISOString(), head, verifiedThrough: head, progression: 'advanced', completedPackages: [1], nextPackage: queue.next }, null, 2) + '\n');
