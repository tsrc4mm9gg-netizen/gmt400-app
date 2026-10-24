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
  assert.equal(options({ NODE_ENV: 'production', NEXT_PUBLIC_VERCEL_ENV: 'production' }).sentryOptions.enabled, true);
  assert.equal(options({ NODE_ENV: 'production', VERCEL: '1' }).sentryOptions.enabled, true);
  assert.equal(options({ NODE_ENV: 'production', NEXT_PUBLIC_VERCEL_ENV: 'production', NEXT_PUBLIC_SENTRY_ENABLED: 'false' }).sentryOptions.enabled, false);
});

test('local production build (next start outside Vercel) does not report to Sentry', () => {
  assert.equal(options({ NODE_ENV: 'production' }).sentryOptions.enabled, false);
  assert.equal(options({ NODE_ENV: 'production', NEXT_PUBLIC_SENTRY_ENABLED: 'true' }).sentryOptions.enabled, true);
});

test('NEXT_PUBLIC_SENTRY_DISABLED=1 always disables reporting', () => {
  assert.equal(options({ NODE_ENV: 'production', NEXT_PUBLIC_VERCEL_ENV: 'production', NEXT_PUBLIC_SENTRY_DISABLED: '1' }).sentryOptions.enabled, false);
});

test('local/CI build does not get a fake Vercel environment from next.config', () => {
  const config = fs.readFileSync(path.join(__dirname, '../next.config.ts'), 'utf8');
  assert.match(config, /NEXT_PUBLIC_VERCEL_ENV: process\.env\.VERCEL_ENV \|\| ''/);
  assert.doesNotMatch(config, /NEXT_PUBLIC_VERCEL_ENV:[^\n]*NODE_ENV/);
});

test('browser reports to production Sentry only from gmt400.pl hosts', () => {
  const { isProductionHost } = options({ NODE_ENV: 'test' });
  for (const host of ['gmt400.pl', 'www.gmt400.pl', 'WWW.GMT400.PL', 'gmt400-app.vercel.app']) assert.equal(isProductionHost(host), true, host);
  for (const host of ['127.0.0.1', 'localhost', '0.0.0.0', 'gmt400.pl.evil.example', 'example.com']) assert.equal(isProductionHost(host), false, host);
  const client = fs.readFileSync(path.join(__dirname, '../src/instrumentation-client.ts'), 'utf8');
  assert.match(client, /isProductionHost\(window\.location\.hostname\)/);
  assert.match(client, /enabled: sentryOptions\.enabled && hostAllowed/);
});

test('events from localhost/127.0.0.1 are dropped for the production DSN', () => {
  const { beforeSend } = options({ NODE_ENV: 'test' });
  const local = { exception: { values: [{ type: 'TypeError', value: 'Script http://127.0.0.1:3100/sw.js load failed' }] } };
  assert.equal(beforeSend(local), null);
  assert.equal(beforeSend({ request: { url: 'http://localhost:3000/modele' }, exception: { values: [{ type: 'Error', value: 'x' }] } }), null);
  assert.equal(beforeSend({ exception: { values: [{ type: 'Error', value: 'x', stacktrace: { frames: [{ filename: 'http://127.0.0.1:3100/_next/static/chunks/a.js' }] } }] } }), null);
  assert.ok(beforeSend({ request: { url: 'https://www.gmt400.pl/modele' }, exception: { values: [{ type: 'Error', value: 'Prawdziwy błąd' }] } }));
  assert.ok(beforeSend({ exception: { values: [{ type: 'Error', value: 'x', stacktrace: { frames: [{ filename: 'https://www.gmt400.pl/_next/static/chunks/a.js' }] } }] } }));
});

test('CI test DSN may receive local events (isolated browser capture test)', () => {
  const { beforeSend } = options({ NODE_ENV: 'test', NEXT_PUBLIC_SENTRY_DSN: 'http://ci@127.0.0.1:4319/1' });
  assert.ok(beforeSend({ request: { url: 'http://127.0.0.1:3191/sentry-ci-fixture' }, exception: { values: [{ type: 'Error', value: 'GMT400 browser boundary test' }] } }));
});

test('service worker registration failure is handled', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/app/Encyclopedia.tsx'), 'utf8');
  assert.match(source, /serviceWorker\.register\('\/sw\.js'\)\.catch\(/);
});

test('privacy filter removes request, identity, extras and breadcrumbs', () => {
  const { sanitizeEvent } = options({ NODE_ENV: 'test' });
  const event = sanitizeEvent({ event_id: 'test', user: { email: 'private@example.invalid' }, request: { data: 'private' }, extra: { vin: 'private' }, breadcrumbs: [{ message: 'private' }] });
  assert.deepEqual(event, { event_id: 'test' });
});

test('expected 404 (notFound) is not sent, real errors are', () => {
  const { beforeSend } = options({ NODE_ENV: 'test' });
  assert.equal(beforeSend({ exception: { values: [{ type: 'Error', value: 'NEXT_HTTP_ERROR_FALLBACK;404' }] } }), null);
  assert.equal(beforeSend({ exception: { values: [{ type: 'Error', value: 'NEXT_NOT_FOUND' }] } }), null);
  assert.ok(beforeSend({ exception: { values: [{ type: 'Error', value: 'Baza wiedzy jest chwilowo niedostępna.' }] } }));
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
