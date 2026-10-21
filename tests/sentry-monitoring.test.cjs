const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function options(env) {
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/sentry-options.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const context = { exports: {}, process: { env } };
  vm.runInNewContext(code, context);
  return context.exports;
}

test('monitoring is disabled in development and unit tests', () => {
  for (const NODE_ENV of ['development', 'test']) assert.equal(options({ NODE_ENV }).sentryOptions.enabled, false);
});

test('production monitoring can be explicitly disabled', () => {
  assert.equal(options({ NODE_ENV: 'production' }).sentryOptions.enabled, true);
  assert.equal(options({ NODE_ENV: 'production', NEXT_PUBLIC_SENTRY_ENABLED: 'false' }).sentryOptions.enabled, false);
});

test('privacy filter removes request, identity, extras and breadcrumbs', () => {
  const { sanitizeEvent } = options({ NODE_ENV: 'test' });
  const event = sanitizeEvent({ event_id: 'test', user: { email: 'private@example.invalid' }, request: { data: 'private' }, extra: { vin: 'private' }, breadcrumbs: [{ message: 'private' }] });
  assert.deepEqual(event, { event_id: 'test' });
});

test('replay, tracing, SDK logs and breadcrumbs are disabled', () => {
  const { sentryOptions: config } = options({ NODE_ENV: 'production' });
  for (const key of ['tracesSampleRate', 'replaysSessionSampleRate', 'replaysOnErrorSampleRate', 'maxBreadcrumbs']) assert.equal(config[key], 0);
  assert.equal(config.sendDefaultPii, false);
  assert.equal(config.enableLogs, false);
});

test('SDK captures an exception using only an in-memory transport', async () => {
  const Sentry = require('@sentry/nextjs');
  const envelopes = [];
  const config = options({ NODE_ENV: 'test' }).sentryOptions;
  Sentry.init({ ...config, enabled: true, defaultIntegrations: false, transport: () => ({
    send: async envelope => { envelopes.push(envelope); return { statusCode: 200 }; },
    flush: async () => true,
  }) });
  try {
    const id = Sentry.captureException(new Error('GMT400 isolated monitoring test'));
    assert.equal(await Sentry.flush(2000), true);
    const events = envelopes.flatMap(envelope => envelope[1].filter(item => item[0].type === 'event').map(item => item[1]));
    assert.equal(events.length, 1);
    assert.equal(events[0].event_id, id);
    assert.equal(events[0].exception.values[0].value, 'GMT400 isolated monitoring test');
    assert.equal(events[0].request, undefined);
    assert.equal(events[0].user, undefined);
  } finally {
    await Sentry.close(2000);
  }
});
