const fs = require('node:fs');
const ORIGIN = 'https://www.gmt400.pl';
const BASELINE = { 'Model': 39, 'Usterka': 80, 'Kod błędu': 202, 'Porada': 177 };
const ARTICLE_ID = '3fad7bf1-c139-8122-90d6-dbb1bf5d3cb9';
const IMAGES = ['diy-4l60e-pan-pl.jpg', 'diy-intake-pl.jpg', 'diy-np231-pl.jpg', 'diy-brakes-pl.jpg'];
const clean = value => String(value || '').replace(/-/g, '').toLowerCase();
const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const report = { auditorCodeSha: process.env.GITHUB_SHA || '', runId: process.env.GITHUB_RUN_ID || '', checkedAt: '', origin: ORIGIN, scope: 'Read-only live HTTP audit; compares counts with Notion inventory checked on 2026-10-16, validates IDs, one real article and four local graphics; not per-entry identity reconciliation, technical verification or Safari visual approval', baseline: BASELINE, checks: [], errors: [], passed: false };
async function request(path) { return fetch(ORIGIN + path, { cache: 'no-store', redirect: 'follow', signal: AbortSignal.timeout(25000), headers: { 'User-Agent': 'GMT400-Production-Audit/1.0' } }); }
function check(name, passed, details = {}) { report.checks.push({ name, passed, ...details }); if (!passed) report.errors.push(name); }
async function run() {
  let entries = [];
  try {
    const response = await request('/api/notion');
    check('api_http', response.ok, { status: response.status });
    if (!response.ok) throw new Error('API produkcyjne zwróciło błąd HTTP.');
    const data = await response.json();
    check('api_complete', data.complete === true);
    if (!Array.isArray(data.results)) throw new Error('API nie zwróciło tablicy results.');
    entries = data.results;
    check('api_count_consistent', data.count === entries.length, { count: data.count, rows: entries.length });
    const counts = {};
    for (const item of entries) counts[item.Typ || 'BRAK_TYPU'] = (counts[item.Typ || 'BRAK_TYPU'] || 0) + 1;
    const total = Object.values(BASELINE).reduce((sum, value) => sum + value, 0);
    check('inventory_counts_match_notion_snapshot', entries.length === total && Object.keys(counts).length === Object.keys(BASELINE).length && Object.entries(BASELINE).every(([type, count]) => counts[type] === count), { expectedTotal: total, actualTotal: entries.length, actualByType: counts, note: 'A difference requires investigation; it may also reflect a later legitimate Notion edit.' });
    const ids = entries.map(item => clean(item.id));
    check('unique_valid_entry_ids', ids.every(id => /^[a-f0-9]{32}$/.test(id)) && new Set(ids).size === entries.length, { uniqueIds: new Set(ids).size });
    check('entry_names_present', entries.every(item => typeof item.Nazwa === 'string' && item.Nazwa.trim().length > 0));
    const guides = entries.filter(item => item.Typ === 'Porada');
    const missingInstructions = guides.filter(item => typeof item.Rozwiązanie !== 'string' || !item.Rozwiązanie.trim());
    check('guide_instruction_fields_present', guides.length === BASELINE.Porada && missingInstructions.length === 0, { guides: guides.length, missingInstructionFields: missingInstructions.length, note: 'Non-empty text does not establish that a procedure is detailed or technically verified.' });
  } catch (error) { report.errors.push(String(error.message || error)); }
  try {
    const entry = entries.find(item => clean(item.id) === clean(ARTICLE_ID));
    const response = await request('/baza/' + ARTICLE_ID);
    const html = await response.text();
    const titleMatch = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1].replace(/<!--[\s\S]*?-->/g, '') : '';
    const expectedTitle = entry?.Nazwa || 'Wymiana amortyzatorów GMT400';
    check('real_article_http_and_title', response.ok && title.includes(escapeHtml(expectedTitle)), { status: response.status, articleId: ARTICLE_ID });
    check('real_article_preserves_api_instruction', Boolean(entry?.Rozwiązanie) && html.includes(escapeHtml(entry.Rozwiązanie)), { articleId: ARTICLE_ID });
    check('real_article_has_no_body_fetch_warning', !html.includes('Nie udało się pobrać dodatkowej zawartości strony Notion.'), { articleId: ARTICLE_ID });
  } catch (error) { report.errors.push('Kontrola rzeczywistego wpisu: ' + String(error.message || error)); }
  for (const image of IMAGES) {
    try {
      const response = await request('/' + image);
      const bytes = response.ok ? new Uint8Array(await response.arrayBuffer()) : new Uint8Array();
      const jpeg = bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
      check('graphic_' + image, response.ok && (response.headers.get('content-type') || '').startsWith('image/') && jpeg, { status: response.status, bytes: bytes.length });
    } catch (error) { report.errors.push(image + ': ' + String(error.message || error)); }
  }
  report.passed = report.checks.length === 14 && report.checks.every(item => item.passed) && report.errors.length === 0;
  report.checkedAt = new Date().toISOString();
  fs.mkdirSync('.diagnostics', { recursive: true });
  fs.writeFileSync('.diagnostics/production-content-report.json', JSON.stringify(report, null, 2) + '\n');
  process.exitCode = report.passed ? 0 : 1;
}
run().catch(error => { report.errors.push(String(error.message || error)); report.checkedAt = new Date().toISOString(); fs.mkdirSync('.diagnostics', { recursive: true }); fs.writeFileSync('.diagnostics/production-content-report.json', JSON.stringify(report, null, 2) + '\n'); process.exitCode = 1; });
