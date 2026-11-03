// Poradniki diagnostyczne /diagnoza/[slug] (src/lib/diagnosis-guides.ts): spójność, źródła, kolory, podlinkowanie.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file) {
  const mod = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('exports', 'module', 'require', js)(mod.exports, mod, () => ({}));
  return mod.exports;
}
const G = load('src/lib/diagnosis-guides.ts');
const D = load('src/lib/diagnosis.ts');
const SYMPTOM_IDS = new Set(D.SYMPTOMS.map(s => s.id));

test('6 poradników, unikalne slugi, poprawne symptomy', () => {
  assert.ok(G.DIAG_GUIDES.length >= 6);
  const slugs = G.DIAG_GUIDES.map(g => g.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const g of G.DIAG_GUIDES) {
    assert.match(g.slug, /^[a-z0-9-]+$/);
    assert.ok(g.title.length > 10 && g.summary.length > 40 && g.scope.length > 10, g.slug);
    assert.ok(g.symptoms.length >= 1, g.slug);
    for (const s of g.symptoms) assert.ok(SYMPTOM_IDS.has(s), `${g.slug}: nieznany objaw ${s}`);
    assert.equal(G.getDiagGuide(g.slug), g);
  }
  assert.equal(G.getDiagGuide('nie-ma'), undefined);
});

test('każda sekcja ma treść, tabele są prostokątne, każdy poradnik ma źródła ze stronami', () => {
  for (const g of G.DIAG_GUIDES) {
    assert.ok(g.sections.length >= 2, g.slug);
    for (const sec of g.sections) {
      assert.ok(sec.heading && (sec.intro || sec.items?.length || sec.table), `${g.slug}/${sec.heading}`);
      if (sec.table) for (const r of sec.table.rows) assert.equal(r.length, sec.table.cols.length, `${g.slug}: ${r[0]}`);
    }
    assert.ok(g.sources.length >= 1, g.slug);
    for (const s of g.sources) assert.ok(s.doc.length > 5 && /\d/.test(s.pages), `${g.slug}: źródło bez stron`);
  }
});

test('brak linków do Drive / URL instrukcji i brak jednostek tylko imperialnych w tabelach', () => {
  const src = fs.readFileSync('src/lib/diagnosis-guides.ts', 'utf8');
  assert.doesNotMatch(src, /drive\.google|https?:\/\//);
  for (const g of G.DIAG_GUIDES) for (const sec of g.sections) for (const r of sec.table?.rows || [])
    for (const cell of r.slice(1)) if (/\bpsi\b|°F|inHg/.test(cell)) assert.match(cell, /kPa|bar|°C|mm/, `${g.slug}: ${cell}`);
});

test('każdy poradnik jest podlinkowany z diagnozy objawów, wyszukiwarki i mapy strony', () => {
  const hrefs = new Set();
  for (const s of D.SYMPTOMS) for (const c of s.causes) for (const l of c.links) if (l.href) hrefs.add(l.href);
  const search = fs.readFileSync('src/lib/search-index.ts', 'utf8');
  for (const g of G.DIAG_GUIDES) {
    assert.ok(hrefs.has(`/diagnoza/${g.slug}`), `${g.slug}: brak linku w diagnosis.ts`);
    assert.ok(search.includes(`u: '/diagnoza/${g.slug}'`), `${g.slug}: brak w wyszukiwarce`);
  }
  assert.match(fs.readFileSync('src/app/sitemap.ts', 'utf8'), /DIAG_GUIDES\.map/);
});

test('strony poradników: bez żółtego/bursztynowego, czerwony tylko w ostrzeżeniu, cele ≥44 px', () => {
  for (const f of ['src/app/diagnoza/[slug]/page.tsx', 'src/app/diagnoza/page.tsx']) {
    const src = fs.readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /\b(yellow|amber)-\d/, f);
    assert.ok((src.match(/\b(red|danger)-\d/g) || []).length <= 3, f);
    for (const m of src.matchAll(/<Link [^>]*className="([^"]+)"/g)) assert.match(m[1], /min-h-11/, `${f}: link < 44 px`);
  }
});
