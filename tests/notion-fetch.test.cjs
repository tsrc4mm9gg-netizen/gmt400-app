const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, extra = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib', file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, require, setTimeout: (fn) => setTimeout(fn, 0), AbortSignal, Math, Number, Error, Set, ...extra };
  vm.runInNewContext(code, context);
  return context.exports;
}

test('notionFetch retries 429 and 5xx, then returns the success response', async () => {
  const statuses = [429, 503, 200];
  let calls = 0;
  const fetch = async () => { const status = statuses[calls++]; return { status, ok: status === 200, headers: { get: () => (status === 429 ? '1' : null) } }; };
  const { notionFetch } = load('notion-fetch.ts', { fetch });
  const response = await notionFetch('https://api.notion.com/v1/pages/x', { token: 't' });
  assert.equal(response.status, 200);
  assert.equal(calls, 3);
});

test('notionFetch does not retry 404 (missing entry stays a 404)', async () => {
  let calls = 0;
  const fetch = async () => { calls++; return { status: 404, ok: false, headers: { get: () => null } }; };
  const { notionFetch } = load('notion-fetch.ts', { fetch });
  assert.equal((await notionFetch('u', { token: 't' })).status, 404);
  assert.equal(calls, 1);
});

test('notionFetch throws NotionUnavailableError after repeated network failures', async () => {
  let calls = 0;
  const fetch = async () => { calls++; throw new Error('timeout'); };
  const { notionFetch } = load('notion-fetch.ts', { fetch });
  await assert.rejects(notionFetch('u', { token: 't' }), error => error.name === 'NotionUnavailableError');
  assert.equal(calls, 3);
});
