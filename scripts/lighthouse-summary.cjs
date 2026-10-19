const fs = require('node:fs');
const path = require('node:path');
const config = require('../lighthouserc.cjs').ci;
const output = process.env.GITHUB_STEP_SUMMARY;
const append = text => { if (output) fs.appendFileSync(output, text); else process.stdout.write(text); };
const median = values => { const sorted = [...values].sort((a, b) => a - b); return sorted[Math.floor(sorted.length / 2)]; };
const key = url => { const u = new URL(url); return u.origin + u.pathname.replace(/\/$/, ''); };
try {
  const directory = 'reports/lighthouse';
  const reports = fs.readdirSync(directory).filter(name => name.endsWith('.json') && name !== 'manifest.json').map(name => JSON.parse(fs.readFileSync(path.join(directory, name), 'utf8'))).filter(report => report.lighthouseVersion);
  const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
  const metrics = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time'];
  const rows = [];
  for (const url of config.collect.url) {
    const runs = reports.filter(report => key(report.requestedUrl) === key(url));
    if (runs.length !== config.collect.numberOfRuns) throw new Error('Incomplete report set for ' + url + ': ' + runs.length);
    for (const report of runs) {
      if (report.runtimeError) throw new Error('Lighthouse runtime error: ' + JSON.stringify(report.runtimeError));
      if (key(report.finalDisplayedUrl || report.finalUrl) !== key(url)) throw new Error('Unexpected redirect for ' + url);
      if (report.audits['http-status-code']?.score !== 1) throw new Error('Unsuccessful document response for ' + url);
      for (const category of categories) if (!Number.isFinite(report.categories[category]?.score)) throw new Error('Missing category ' + category);
      for (const metric of metrics) if (!Number.isFinite(report.audits[metric]?.numericValue)) throw new Error('Missing metric ' + metric);
    }
    rows.push({
      path: new URL(url).pathname,
      runs: runs.length,
      scores: Object.fromEntries(categories.map(category => [category, Math.round(median(runs.map(report => report.categories[category].score)) * 100)])),
      lcpSeconds: (median(runs.map(report => report.audits['largest-contentful-paint'].numericValue)) / 1000).toFixed(2),
      cls: median(runs.map(report => report.audits['cumulative-layout-shift'].numericValue)).toFixed(3),
      tbtMs: Math.round(median(runs.map(report => report.audits['total-blocking-time'].numericValue))),
      warnings: [...new Set(runs.flatMap(report => report.runWarnings || []))],
    });
  }
  fs.writeFileSync(path.join(directory, 'baseline-summary.json'), JSON.stringify({ commit: process.env.GITHUB_SHA || null, scope: 'Local production build; simulated mobile Chromium; no live Notion credentials or guaranteed populated content.', rows }, null, 2) + '\n');
  const lines = ['## Lighthouse — mobilny poziom bazowy', '', 'Commit: `' + (process.env.GITHUB_SHA || 'local') + '`', '', 'Mediany z 3 pomiarów każdej metryki. Niskie oceny są ostrzeżeniami, nie blokadą publikacji.', '', '| Strona | Wydajność | Dostępność | Praktyki | SEO | LCP (s) | CLS | TBT (ms) |', '|---|---:|---:|---:|---:|---:|---:|---:|'];
  for (const row of rows) lines.push(`| ${row.path} | ${row.scores.performance} | ${row.scores.accessibility} | ${row.scores['best-practices']} | ${row.scores.seo} | ${row.lcpSeconds} | ${row.cls} | ${row.tbtMs} |`);
  lines.push('', 'Zakres: lokalny build produkcyjny, symulacja mobilnego Chromium. To nie jest pomiar fizycznego iPhone’a, Safari ani rzeczywistych użytkowników (Core Web Vitals).', '', 'Nie przekazujemy sekretów Notion. Treści na głównej mogą być puste; nie porównuj tych wyników bezpośrednio z produkcją z pełną bazą. Zielony workflow oznacza kompletny pomiar, nie brak problemów.', '', 'Pełne raporty HTML/JSON znajdują się w artefakcie lighthouse. Nie wysyłamy ich do publicznego magazynu Lighthouse.');
  for (const row of rows) if (row.warnings.length) lines.push('', '### Ostrzeżenia: ' + row.path, ...row.warnings.map(warning => '- ' + String(warning).replace(/[\r\n]/g, ' ')));
  append(lines.join('\n') + '\n');
} catch (error) {
  append('## Lighthouse — niekompletny pomiar\n\nNie uznajemy audytu za zaliczony. Szczegóły w logu zadania.\n');
  throw error;
}
