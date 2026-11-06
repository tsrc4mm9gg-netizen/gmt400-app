const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(extra = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/notion-fetch.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, require, setTimeout, AbortSignal, Math, Number, Error, Set, Date, ...extra };
  vm.runInNewContext(code, context);
  return context.exports;
}

test('Retry-After seconds are not capped at five seconds', () => {
  const { retryDelay } = load();
  assert.equal(retryDelay(0, '12'), 12000);
  assert.equal(retryDelay(0, ' 12 '), 12000);
  assert.equal(retryDelay(0, '0'), 0);
});

test('Retry-After accepts future and past HTTP dates', () => {
  const { retryDelay } = load();
  const now = Date.parse('Fri, 06 Nov 2026 20:00:00 GMT');
  assert.equal(retryDelay(0, 'Fri, 06 Nov 2026 20:00:12 GMT', now), 12000);
  assert.equal(retryDelay(0, 'Fri, 06 Nov 2026 19:59:59 GMT', now), 0);
});

test('Missing and invalid Retry-After use bounded backoff', () => {
  const { retryDelay } = load();
  for (const value of [null, '', 'invalid', '-1', '1.5']) {
    const delay = retryDelay(0, value);
    assert.ok(delay >= 400 && delay < 600);
  }
});

test('Unsafe timer delay fails closed instead of retrying early', () => {
  const { retryDelay } = load();
  assert.throws(() => retryDelay(0, '2147484'), error => error.name === 'NotionUnavailableError');
});

test('notionFetch schedules the complete server delay and cancels retry response', async () => {
  const waits = [];
  let calls = 0;
  let cancelled = false;
  const { notionFetch } = load({
    setTimeout: (fn, ms) => { waits.push(ms); fn(); },
    fetch: async () => ++calls === 1
      ? { status: 429, headers: { get: () => '12' }, body: { cancel: async () => { cancelled = true; } } }
      : { status: 200 },
  });
  assert.equal((await notionFetch('https://api.notion.com/v1/pages/test', { token: 'test' })).status, 200);
  assert.deepEqual(waits, [12000]);
  assert.equal(cancelled, true);
  assert.equal(calls, 2);
});
