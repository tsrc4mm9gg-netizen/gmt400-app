const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function run(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-quality-'));
  const source = path.join(root, 'src');
  fs.mkdirSync(source);
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(source, name), content);
  const previous = process.cwd();
  process.chdir(root);
  try {
    execFileSync(process.execPath, [path.resolve(previous, 'scripts/check-frontend-quality.cjs')], { stdio: 'pipe' });
    return 0;
  } catch (error) {
    return error.status;
  } finally {
    process.chdir(previous);
  }
}

test('accepts accessible markup', () => {
  assert.equal(run({ 'page.tsx': '<img alt="Logo" />\n<button>Zapisz</button>\n<h1>Tytuł</h1>\n<h2>Sekcja</h2>\n' }), 0);
});

test('rejects image without alt', () => {
  assert.equal(run({ 'page.tsx': '<img src="/logo.png" />\n' }), 1);
});

test('rejects clickable div without role', () => {
  assert.equal(run({ 'page.tsx': '<div onClick={() => {}}>Kliknij</div>\n' }), 1);
});

test('rejects form control without label', () => {
  assert.equal(run({ 'page.tsx': '<input type="text" />\n' }), 1);
});

test('rejects heading level jump', () => {
  assert.equal(run({ 'page.tsx': '<h1>Tytuł</h1>\n<h3>Sekcja</h3>\n' }), 1);
});

test('rejects dangerouslySetInnerHTML', () => {
  assert.equal(run({ 'page.tsx': '<div dangerouslySetInnerHTML={{ __html: html }} />\n' }), 1);
});
