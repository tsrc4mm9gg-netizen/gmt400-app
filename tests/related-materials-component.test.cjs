const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const compile = (path) => ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React } }).outputText;
const suggestionsSource = compile('src/app/RelatedMaterialSuggestions.tsx');
const listSource = compile('src/app/RelatedMaterials.tsx');
const libSource = compile('src/lib/related-materials.ts');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const loadedLib = { exports: {} };
new Function('exports', 'require', 'module', libSource)(loadedLib.exports, require, loadedLib);
const { getRelatedMaterials } = loadedLib.exports;
const entry = (id, Nazwa, extra = {}) => ({ id, Nazwa, Typ: 'Porada', Model: 'Suburban', ...extra });

test('related list renders links and descriptive reason', () => {
  const loaded = { exports: {} };
  new Function('exports', 'require', 'module', 'React', listSource)(loaded.exports, require, loaded, React);
  const RelatedMaterials = loaded.exports.default;
  const items = [{ ...entry('b', 'P0300 diagnostyka'), reason: 'Wspólny kod lub identyfikator: P0300.' }];
  const html = renderToStaticMarkup(React.createElement(RelatedMaterials, { items }));
  assert.match(html, /Powiązane materiały/);
  assert.match(html, /\/baza\/b/);
  assert.match(html, /P0300 diagnostyka/);
  assert.match(html, /Wspólny kod lub identyfikator/);
});
test('related list returns null for empty items', () => {
  const loaded = { exports: {} };
  new Function('exports', 'require', 'module', 'React', listSource)(loaded.exports, require, loaded, React);
  const RelatedMaterials = loaded.exports.default;
  assert.equal(renderToStaticMarkup(React.createElement(RelatedMaterials, { items: [] })), '');
});
test('suggestions component contains retry, loading and empty states', () => {
  assert.match(suggestionsSource, /Spróbuj ponownie/);
  assert.match(suggestionsSource, /Ładowanie powiązanych materiałów/);
  assert.match(suggestionsSource, /Nie znaleziono powiązanych materiałów/);
  assert.match(suggestionsSource, /Nie udało się pobrać propozycji/);
  assert.match(suggestionsSource, /Treść instrukcji pozostaje dostępna/);
});
test('suggestions component guards incomplete API responses', () => {
  assert.match(suggestionsSource, /body\.complete !== true/);
  assert.match(suggestionsSource, /!Array\.isArray\(body\.results\)/);
  assert.match(suggestionsSource, /validEntry/);
});
test('suggestions component uses abort controller and retry attempt', () => {
  assert.match(suggestionsSource, /AbortController/);
  assert.match(suggestionsSource, /setAttempt\(value => value \+ 1\)/);
  assert.match(suggestionsSource, /controller\.abort\(\)/);
});
test('suggestions component does not block article rendering', () => {
  assert.match(suggestionsSource, /mt-6/);
  assert.match(suggestionsSource, /aria-label="Powiązane materiały"/);
  assert.doesNotMatch(suggestionsSource, /return null;/);
});
test('recommendation rules exclude outside scope and rank identifier matches', () => {
  const current = entry('a', 'P0300 nierowna praca silnika');
  const candidates = [entry('b', 'P0300 diagnostyka'), entry('c', 'P0300 diagnostyka')];
  const matches = new Map([['b', { status: 'outside_scope', reasons: [] }], ['c', { status: 'within_scope', reasons: [] }]]);
  const result = getRelatedMaterials(current, candidates, matches);
  assert.deepEqual(result.map(item => item.id), ['c']);
});
