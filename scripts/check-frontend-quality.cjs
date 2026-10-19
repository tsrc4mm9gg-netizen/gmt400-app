#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve('src');
const findings = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      check(full);
    }
  }
}

function check(file) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = path.relative(process.cwd(), file);
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    const location = `${relative}:${index + 1}`;
    if (/<img\b(?![^>]*\balt=)/i.test(line)) findings.push(`${location}: <img> without alt`);
    if (/<div[^>]*\bonClick=/i.test(line) && !/\brole=/.test(line)) findings.push(`${location}: clickable div without role`);
    if (/<span[^>]*\bonClick=/i.test(line) && !/\brole=/.test(line)) findings.push(`${location}: clickable span without role`);
    if (/<(?:input|select|textarea)\b(?![^>]*\b(?:aria-label|aria-labelledby)=)/i.test(line) && !/<label/.test(line)) findings.push(`${location}: form control without accessible label`);
    if (/dangerouslySetInnerHTML/.test(line)) findings.push(`${location}: dangerouslySetInnerHTML requires explicit review`);
  });
  const headings = [...source.matchAll(/<h([1-6])\b/gi)].map(match => Number(match[1]));
  for (let index = 1; index < headings.length; index += 1) {
    if (headings[index] - headings[index - 1] > 1) {
      findings.push(`${relative}: heading level jumps from h${headings[index - 1]} to h${headings[index]}`);
      break;
    }
  }
}

if (!fs.existsSync(root)) {
  console.log('No src directory; frontend quality check skipped.');
  process.exit(0);
}

walk(root);
if (findings.length) {
  console.error(`Found ${findings.length} frontend quality issue(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}
console.log('Frontend quality checks passed.');
