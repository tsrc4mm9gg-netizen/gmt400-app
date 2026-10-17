const fs = require('node:fs');
const ORIGIN = 'https://www.gmt400.pl';
const checks = [];
async function probe(name, path, validate, html = false) {
 const result = { name, path, checkedAt: new Date().toISOString(), passed: false }; const started = Date.now();
 try {
  const response = await fetch(ORIGIN + path, { headers: { Accept: html ? 'text/html' : 'application/json' }, signal: AbortSignal.timeout(20000), redirect: 'follow', cache: 'no-store' });
  result.status = response.status; result.contentType = response.headers.get('content-type');
  if (!response.ok) { result.reason = response.status === 404 ? 'route_not_found_on_production' : response.status === 401 || response.status === 403 ? 'access_restricted' : response.status >= 500 ? 'server_or_provider_failure' : 'http_failure'; return null; }
  if (!html && !result.contentType?.includes('application/json')) { result.reason = 'expected_json_received_other_content'; return null; }
  const payload = html ? await response.text() : await response.json();
  result.passed = Boolean(validate(payload)); result.reason = result.passed ? 'response_contract_passed' : 'unexpected_response_contract';
  if (Array.isArray(payload?.data)) result.recordCount = payload.data.length;
  if (payload?.effectiveDate) result.effectiveDate = payload.effectiveDate;
  return result.passed ? payload : null;
 } catch (e) { result.reason = e.name === 'TimeoutError' || e.name === 'AbortError' ? 'request_timeout' : 'network_or_json_failure'; return null; }
 finally { result.durationMs = Date.now() - started; checks.push(result); }
}
const query = p => '/api/official-vehicle?' + new URLSearchParams(p);
const list = p => p && Array.isArray(p.data) && typeof p.source === 'string' && p.data.every(row => typeof row.text === 'string' && typeof row.value === 'string');
const records = p => p && Array.isArray(p.data) && typeof p.source === 'string';
function skipped(name, reason) { checks.push({ name, passed: false, skipped: true, reason }); }
async function main() {
 await probe('Official data tool page', '/narzedzia/dane-pojazdu', html => html.includes('Oficjalne dane pojazdu'), true);
 for (const currency of ['USD', 'EUR']) await probe('NBP ' + currency, '/api/exchange-rate?currency=' + currency, p => p.currency === currency && typeof p.rate === 'number' && Number.isFinite(p.rate) && p.rate > 0 && /^\d{4}-\d{2}-\d{2}$/.test(p.effectiveDate) && typeof p.tableNumber === 'string' && p.source?.startsWith('https://api.nbp.pl/'));
 const base = { make: 'Chevrolet', year: '1999' };
 for (const [action, kind] of [['recallModels', 'recalls'], ['complaintModels', 'complaints']]) {
  const models = await probe('NHTSA ' + kind + ' model list', query({ ...base, action }), list);
  const model = models?.data.find(row => /tahoe|suburban/i.test(row.value));
  if (model) await probe('NHTSA ' + kind + ' sample records', query({ ...base, action: kind, model: model.value }), records);
  else skipped('NHTSA ' + kind + ' sample records', models ? 'no_tahoe_or_suburban_option' : 'model_list_unavailable');
 }
 const models = await probe('EPA model list', query({ ...base, action: 'epaModels' }), list);
 const model = models?.data.find(row => /tahoe|suburban/i.test(row.value));
 if (model) {
  const options = await probe('EPA variant list', query({ ...base, action: 'epaOptions', model: model.value }), list);
  const variant = options?.data.find(row => /^[0-9]+$/.test(row.value));
  if (variant) await probe('EPA sample vehicle record', query({ action: 'epaVehicle', id: variant.value }), p => p?.data?.make === 'Chevrolet' && String(p.data.year) === '1999' && typeof p.data.model === 'string' && Number(p.data.comb08) > 0);
  else skipped('EPA sample vehicle record', options ? 'no_variant_available' : 'variant_list_unavailable');
 } else { skipped('EPA variant list', models ? 'no_tahoe_or_suburban_option' : 'model_list_unavailable'); skipped('EPA sample vehicle record', 'variant_list_not_checked'); }
 const passed = checks.length === 10 && checks.every(row => row.passed);
 const report = { auditorCodeSha: process.env.GITHUB_SHA || null, runId: process.env.GITHUB_RUN_ID || null, checkedAt: new Date().toISOString(), origin: ORIGIN, passed, scope: 'Live public HTTP and JSON response checks; Chevrolet 1999 sample only. No browser interaction, no VIN submission, no Notion requests, no authentication tokens. This does not identify the deployed commit or certify all GMT400 variants.', checks };
 fs.mkdirSync('.diagnostics', { recursive: true }); fs.writeFileSync('.diagnostics/official-production-report.json', JSON.stringify(report, null, 2) + '\n');
 if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '## Public production API diagnostics\n\n' + checks.map(row => '- ' + (row.passed ? 'PASS' : row.skipped ? 'NOT CHECKED' : 'FAIL') + ': ' + row.name + ' — ' + row.reason + (row.status ? ' (HTTP ' + row.status + ')' : '')).join('\n') + '\n\nNo VIN or Notion token was used. A successful audit does not identify the deployed commit.\n');
 if (!passed) process.exitCode = 1;
}
main().catch(() => { process.exitCode = 1; });
