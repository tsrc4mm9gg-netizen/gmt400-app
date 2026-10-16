#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
  }
  return files;
}
const findings = [];
for (const file of walk('src')) {
  const source = fs.readFileSync(file, 'utf8');
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    const number = index + 1;
    if (/#[eE]7[bB]95[eE]|#[fF]2[cC][fF]85|#947442|#80683[eE]/.test(line)) findings.push({ file, line: number, kind: 'gold-accent', snippet: line.trim().slice(0, 240) });
    if (/<h[1-6][\s>]/.test(line)) findings.push({ file, line: number, kind: 'heading', snippet: line.trim().slice(0, 240) });
    if (/rounded-(sm|md|lg|xl|2xl|3xl)|borderRadius/.test(line)) findings.push({ file, line: number, kind: 'radius', snippet: line.trim().slice(0, 240) });
  });
}
const summary = findings.reduce((acc, finding) => { acc[finding.kind] = (acc[finding.kind] || 0) + 1; return acc; }, {});
fs.mkdirSync('.diagnostics', { recursive: true });
fs.writeFileSync('.diagnostics/visual-hierarchy-audit.json', JSON.stringify({ generatedAt: new Date().toISOString(), scope: 'Roadmap package 3 preparation: static source audit for headings, radii and gold accent usage; no UI changes', summary, findings }, null, 2) + '\n');
console.log('Visual hierarchy audit complete:', JSON.stringify(summary));
