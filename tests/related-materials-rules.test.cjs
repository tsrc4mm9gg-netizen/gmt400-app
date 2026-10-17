const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/related-materials.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const loaded = { exports: {} };
new Function('exports', 'require', 'module', compiled)(loaded.exports, require, loaded);
const { getRelatedMaterials } = loaded.exports;
const entry = (id, Nazwa, extra = {}) => ({ id, Nazwa, Typ: 'Porada', Model: 'Suburban', ...extra });
const run = (current, candidates, matches = new Map(), limit = 3) => getRelatedMaterials(current, candidates, matches, limit);

test('same type and model alone do not establish a relationship', () => {
  assert.deepEqual(run(entry('a', 'Hamulce'), [entry('b', 'Alternator')]), []);
});
test('exact diagnostic code ranks above shared ordinary words', () => {
  const result = run(entry('a', 'P0300 nierowna praca silnika'), [entry('b', 'Nierowna praca silnika'), entry('c', 'P0300 diagnostyka')]);
  assert.deepEqual(result.map(item => item.id), ['c', 'b']);
  assert.match(result[0].reason, /P0300/);
  assert.match(result[0].reason, /nie potwierdzenie/);
});
test('different transmission identifiers are not treated as equivalent', () => {
  assert.deepEqual(run(entry('a', '4L60E'), [entry('b', '4L80E')]), []);
  assert.equal(run(entry('a', '4l60e'), [entry('b', '4L60E')]).length, 1);
});
test('current entry and duplicate normalized identifiers are excluded', () => {
  const result = run(entry('AA-BB', 'P0300'), [entry('aabb', 'P0300'), entry('CC-DD', 'P0300'), entry('ccdd', 'P0300')]);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'CC-DD');
});
test('outside-scope candidates are excluded', () => {
  assert.deepEqual(run(entry('a', 'P0300'), [entry('b', 'P0300')], new Map([['b', { status: 'outside_scope', reasons: [] }]])), []);
});
test('Polish diacritics normalize and stronger text overlap ranks first', () => {
  const result = run(entry('a', 'Ciśnienie paliwa pompa'), [entry('b', 'Cisnienie paliwa'), entry('c', 'Cisnienie paliwa pompa')]);
  assert.deepEqual(result.map(item => item.id), ['c', 'b']);
});
test('missing identifiers and invalid limits yield no recommendations', () => {
  assert.deepEqual(run(entry(undefined, 'P0300'), [entry('b', 'P0300')]), []);
  assert.deepEqual(run(entry('a', 'P0300'), [entry(undefined, 'P0300')]), []);
  for (const limit of [0, -1, NaN, Infinity]) assert.deepEqual(run(entry('a', 'P0300'), [entry('b', 'P0300')], new Map(), limit), []);
});
test('results respect limit without mutating candidates', () => {
  const candidates = [entry('b', 'P0300'), entry('c', 'P0300')];
  const before = JSON.stringify(candidates);
  assert.equal(run(entry('a', 'P0300'), candidates, new Map(), 1).length, 1);
  assert.equal(JSON.stringify(candidates), before);
});
