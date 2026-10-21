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

test('privacy filter replaces identity with explicit null IP and removes request metadata', () => {
  const { sanitizeEvent } = options({ NODE_ENV: 'test' });
  const event = sanitizeEvent({ event_id: 'test', user: { email: 'private@example.invalid', ip_address: '192.0.2.1', geo: { city: 'private' } }, server_name: 'private-host', request: { data: 'private' }, extra: { vin: 'private' }, breadcrumbs: [{ message: 'private' }] });
  assert.equal(JSON.stringify(event), JSON.stringify({ event_id: 'test', user: { ip_address: null } }));
  assert.equal(sanitizeEvent({}).user.ip_address, null);
});

test('replay, tracing, SDK logs, sessions and client reports are disabled', () => {
  const { sentryOptions: config } = options({ NODE_ENV: 'production' });
  for (const key of ['tracesSampleRate', 'replaysSessionSampleRate', 'replaysOnErrorSampleRate', 'maxBreadcrumbs']) assert.equal(config[key], 0);
  for (const key of ['sendDefaultPii', 'enableLogs', 'autoSessionTracking', 'sendClientReports']) assert.equal(config[key], false);
});

test('DSN override and deployment labels are preserved', () => {
  const config = options({ NODE_ENV: 'production', NEXT_PUBLIC_SENTRY_DSN: 'http://ci@127.0.0.1:4319/1', NEXT_PUBLIC_VERCEL_ENV: 'preview', NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: 'test-release' }).sentryOptions;
  assert.equal(config.dsn, 'http://ci@127.0.0.1:4319/1');
  assert.equal(config.environment, 'preview');
  assert.equal(config.release, 'test-release');
});

test('SDK captures an exception using only an in-memory transport', async () => {
  const Sentry = require('@sentry/nextjs');
  const envelopes = [];
  Sentry.init({ ...options({ NODE_ENV: 'test' }).sentryOptions, enabled: true, defaultIntegrations: false, transport: () => ({ send: async envelope => { envelopes.push(envelope); return { statusCode: 200 }; }, flush: async () => true }) });
  try {
    const id = Sentry.captureException(new Error('GMT400 isolated monitoring test'));
    assert.equal(await Sentry.flush(2000), true);
    const events = envelopes.flatMap(envelope => envelope[1].filter(item => item[0].type === 'event').map(item => item[1]));
    assert.equal(events.length, 1);
    assert.equal(events[0].event_id, id);
    assert.equal(events[0].exception.values[0].value, 'GMT400 isolated monitoring test');
    assert.deepEqual(events[0].user, { ip_address: null });
    for (const field of ['request', 'extra', 'breadcrumbs', 'server_name']) assert.equal(events[0][field], undefined);
  } finally { await Sentry.close(2000); }
});
