const fs = require('node:fs');
const http = require('node:http');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const fixture = 'src/app/sentry-ci-fixture/page.tsx';
const base = 'http://127.0.0.1:3191';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  assert.equal(process.env.CI, 'true', 'This test may only run in CI');
  assert.equal(process.env.NEXT_PUBLIC_SENTRY_DSN, 'http://ci@127.0.0.1:4319/1');
  if (process.argv[2] === 'prepare') {
    assert.equal(fs.existsSync(fixture), false, 'Refusing to overwrite an existing route');
    fs.mkdirSync('src/app/sentry-ci-fixture', { recursive: true });
    fs.writeFileSync(fixture, `'use client';
import { useState } from 'react';
export default function Fixture() {
  const [failed, setFailed] = useState(false);
  if (failed) throw new Error('GMT400 browser boundary test');
  return <main><h1>Test monitoringu</h1><button type="button" onClick={() => setFailed(true)}>Wywołaj błąd testowy</button></main>;
}
`);
    return;
  }
  const { chromium, webkit } = require('@playwright/test');
  fs.mkdirSync('test-results', { recursive: true });
  const sink = http.createServer((req, res) => { req.resume(); res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }); res.end('{}'); });
  await new Promise(resolve => sink.listen(4319, '127.0.0.1', resolve));
  const log = fs.openSync('test-results/sentry-next-server.log', 'w');
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3191'], { stdio: ['ignore', log, log], env: process.env });
  const results = [];
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      if (server.exitCode !== null) throw new Error('Next server exited before readiness');
      try { if ((await fetch(base + '/sentry-ci-fixture', { signal: AbortSignal.timeout(2000) })).ok) { ready = true; break; } } catch {}
      await delay(1000);
    }
    assert.equal(ready, true, 'Next server readiness timeout');
    for (const [name, engine] of [['chromium', chromium], ['webkit', webkit]]) {
      const browser = await engine.launch();
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, serviceWorkers: 'block' });
      const events = [];
      await context.tracing.start({ screenshots: true, snapshots: true });
      const page = await context.newPage();
      try {
        await context.route('http://127.0.0.1:4319/**', async route => {
          const body = route.request().postData() || '';
          for (const line of body.split('\n')) {
            try { const value = JSON.parse(line); if (value.event_id && value.exception) events.push(value); } catch {}
          }
          await route.fulfill({ status: 200, body: '{}', headers: { 'access-control-allow-origin': '*' } });
        });
        await page.goto(base + '/sentry-ci-fixture');
        await page.getByRole('button', { name: 'Wywołaj błąd testowy', exact: true }).click();
        const heading = page.getByRole('heading', { name: 'Nie udało się wyświetlić strony', exact: true });
        await heading.waitFor({ state: 'visible' });
        await page.waitForFunction(() => document.activeElement?.id === 'page-error-title');
        await page.getByRole('button', { name: 'Spróbuj ponownie', exact: true }).waitFor({ state: 'visible' });
        let event;
        for (let i = 0; i < 100; i++) {
          event = events.find(item => item.exception?.values?.some(value => value.value?.includes('GMT400 browser boundary test')));
          if (event) break;
          await delay(100);
        }
        assert.ok(event, 'Missing browser exception envelope');
        assert.equal(event.environment, 'preview');
        assert.equal(event.release, process.env.VERCEL_GIT_COMMIT_SHA);
        assert.deepEqual(event.user, { ip_address: null });
        for (const field of ['request', 'extra', 'breadcrumbs', 'server_name']) assert.equal(event[field], undefined);
        results.push({ browser: name, passed: true, eventId: event.event_id, environment: event.environment, release: event.release });
        await context.tracing.stop();
      } catch (error) {
        await page.screenshot({ path: 'test-results/sentry-' + name + '.png', fullPage: true }).catch(() => {});
        await context.tracing.stop({ path: 'test-results/sentry-' + name + '-trace.zip' }).catch(() => {});
        throw error;
      } finally { await browser.close(); }
    }
  } finally {
    server.kill('SIGTERM');
    sink.close();
    fs.closeSync(log);
    fs.writeFileSync('test-results/sentry-browser-report.json', JSON.stringify({ passed: results.length === 2, scope: 'Local production build; browser envelopes intercepted, not delivered to Sentry; not Vercel Preview certification.', results }, null, 2));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
