const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const checker = path.resolve(__dirname, '../scripts/check-frontend-quality.cjs');

function check(source, expectedStatus, expectedDiagnostic) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'frontend-quality-'));
  try {
    fs.mkdirSync(path.join(root, 'src'));
    fs.writeFileSync(path.join(root, 'src/page.tsx'), source);
    const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
    if (result.error) throw result.error;
    const output = (result.stdout || '') + (result.stderr || '');
    assert.equal(result.status, expectedStatus, output);
    if (expectedDiagnostic) {
      assert.match(output, expectedDiagnostic);
      assert.doesNotMatch(output, /AssertionError|MODULE_NOT_FOUND|Cannot find module/);
      if (!expectedDiagnostic.source.includes('syntax error')) assert.doesNotMatch(output, /syntax error/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('accepts accessible markup', () => {
  check('const Page = () => <><img src="/logo.png" alt="Logo" /><button type="button">Zapisz</button><h1>Tytuł</h1><h2>Sekcja</h2></>;', 0);
});

test('accepts a form control with an associated label', () => {
  check('const Page = () => <><label htmlFor="query">Szukaj</label><input id="query" type="text" /></>;', 0);
});

test('rejects image without alt', () => {
  check('const Page = () => <img src="/logo.png" />;', 1, /<img> without alt/);
});

test('rejects clickable div without role', () => {
  check('const Page = () => <div onClick={() => {}}>Kliknij</div>;', 1, /clickable div without role/);
});

test('rejects form control without label', () => {
  check('const Page = () => <input type="text" />;', 1, /form control without accessible label/);
});

test('rejects heading level jump', () => {
  check('const Page = () => <><h1>Tytuł</h1><h3>Sekcja</h3></>;', 1, /heading level jumps from h1 to h3/);
});

test('rejects dangerouslySetInnerHTML', () => {
  check('const Page = () => <div dangerouslySetInnerHTML={{ __html: html }} />;', 1, /dangerouslySetInnerHTML requires explicit review/);
});

test('rejects malformed JSX', () => {
  check('const Page = () => <input', 1, /syntax error/);
});
