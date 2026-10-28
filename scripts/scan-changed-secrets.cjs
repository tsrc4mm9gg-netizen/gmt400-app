#!/usr/bin/env node
const fs = require('node:fs');

const patterns = [
  /sk-[A-Za-z0-9_-]{20,}/,
  /ghp_[A-Za-z0-9]{36,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{10,}/,
  /AIza[0-9A-Za-z_-]{35}/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-+/=]{16,}['"]/i,
];

const changed = fs.readFileSync(process.env.CHANGED_FILES || '/tmp/changed-files.txt', 'utf8')
  .split('\n').map(line => line.trim()).filter(Boolean);

const findings = [];
for (const file of changed) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
  // public/ocr/ = dołączone pliki tesseract.js (WASM osadzony jako base64, fałszywe trafienia wzorców)
  if (/(^|\/)(package-lock\.json|public\/ocr\/|\.next\/|node_modules\/)/.test(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (pattern.test(line)) {
        findings.push(`${file}:${index + 1}: possible credential pattern`);
        break;
      }
    }
  });
}

if (findings.length) {
  console.error('Potential secrets detected:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`No credential patterns found in ${changed.length} changed file(s).`);
