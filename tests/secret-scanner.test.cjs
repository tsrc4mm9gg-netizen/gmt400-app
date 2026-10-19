const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function run(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'secret-scan-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, name), content);
  }
  const list = path.join(root, 'changed.txt');
  fs.writeFileSync(list, Object.keys(files).map(name => path.join(root, name)).join('\n'));
  return { status: (() => { try { execFileSync(process.execPath, [path.resolve('scripts/scan-changed-secrets.cjs')], { env: { ...process.env, CHANGED_FILES: list }, stdio: 'pipe' }); return 0; } catch (error) { return error.status; } })(), root };
}

test('accepts files without credential patterns', () => {
  const result = run({ 'safe.txt': 'const value = process.env.API_KEY;\n' });
  assert.equal(result.status, 0);
});

test('rejects an OpenAI-style key', () => {
  const result = run({ 'unsafe.txt': 'const key = "sk-abcdefghijklmnopqrstuvwxyz123456";\n' });
  assert.equal(result.status, 1);
});

test('rejects a GitHub token', () => {
  const result = run({ 'unsafe.txt': 'token=ghp_abcdefghijklmnopqrstuvwxyzabcdefghijklmn\n' });
  assert.equal(result.status, 1);
});

test('rejects a private key marker', () => {
  const result = run({ 'key.pem': '-----BEGIN PRIVATE KEY-----\n' });
  assert.equal(result.status, 1);
});

test('rejects an inline secret assignment', () => {
  const result = run({ 'config.js': "const config = { apiKey: 'AbCdEf1234567890AbCdEf1234567890' };\n" });
  assert.equal(result.status, 1);
});
