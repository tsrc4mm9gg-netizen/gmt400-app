// Dane mechaniczne silników 1998 w kartach modeli (src/lib/engine-mech-1998.ts).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const js = ts.transpileModule(fs.readFileSync('src/lib/engine-mech-1998.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} };
new Function('exports', 'module', 'require', js)(mod.exports, mod, () => ({}));
const M = mod.exports;

test('5 silników 1998, każdy ze stronami źródła i danymi ogólnymi', () => {
  assert.deepEqual(M.ENGINE_MECH_1998.map(m => m.rpo), ['L35', 'L30', 'L31', 'L56', 'L29']);
  for (const m of M.ENGINE_MECH_1998) {
    assert.match(m.pages, /^s\. 6-\d+–6-\d+$/, m.rpo);
    const keys = m.rows.map(r => r[0]);
    for (const k of ['Średnica × skok', 'Stopień sprężania', 'Rozrząd']) assert.ok(keys.includes(k), `${m.rpo}: ${k}`);
    assert.ok(m.rows.length <= 10, `${m.rpo}: to ma być wybór, nie cała tabela GM`);
  }
});

test('metryczne pierwsze: ciśnienie w kPa przed psi, wymiary w mm przed in', () => {
  for (const m of M.ENGINE_MECH_1998) for (const [k, v] of m.rows) {
    if (/psi/.test(v)) assert.ok(v.indexOf('kPa') > -1 && v.indexOf('kPa') < v.indexOf('psi'), `${m.rpo}/${k}`);
    if (/ in\)/.test(v)) assert.ok(v.indexOf('mm') > -1 && v.indexOf('mm') < v.indexOf(' in'), `${m.rpo}/${k}`);
  }
});

test('dopasowanie po RPO z tabeli silników (także L56 / L65)', () => {
  assert.deepEqual(M.mechForRpos(['L05', 'L31']).map(m => m.rpo), ['L31']);
  assert.deepEqual(M.mechForRpos(['L56 (GVWR < 3856 kg / 8500 lb) / L65 (> 3856 kg)']).map(m => m.rpo), ['L56']);
  assert.equal(M.mechForRpos(['LB4', 'L03']).length, 0);
});

test('karta modelu pokazuje dane tylko dla nadwozi z rocznikami 1996+', () => {
  const src = fs.readFileSync('src/app/modele/[id]/page.tsx', 'utf8');
  assert.match(src, /body\.to >= 1996 \? mechForRpos/);
  assert.match(src, /MECH_SOURCE/);
});
