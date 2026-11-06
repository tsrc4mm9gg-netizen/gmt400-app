const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const compile = path => ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React } }).outputText;
function load(path, dependencies = {}) {
  const loaded = { exports: {} };
  const localRequire = name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name);
  new Function('exports', 'require', 'module', 'React', compile(path))(loaded.exports, localRequire, loaded, React);
  return loaded.exports;
}
const lib = load('src/lib/related-materials.ts');
const registry = JSON.parse(fs.readFileSync('data/knowledge-slugs.json', 'utf8'));
const clean = id => id.replace(/-/g, '').toLowerCase();
const slugMap = new Map(registry.map(row => [clean(row.id), row.slug]));
const list = load('src/app/RelatedMaterials.tsx', { '../lib/knowledge-slug-map': { knowledgeSlugFor: id => slugMap.get(clean(id)) ?? null } }).default;
const suggestionsSource = fs.readFileSync('src/app/RelatedMaterialSuggestionsClient.tsx', 'utf8');
const entry = (id, Nazwa, extra = {}) => ({ id, Nazwa, Typ: 'Porada', Model: 'Suburban', ...extra });
const current = entry('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'P0300 nierowna praca silnika');
const candidate = entry(registry[0].id, 'P0300 diagnostyka', { Opis: 'Private selection payload' });
function server(entries) {
  return load('src/app/RelatedMaterialSuggestions.tsx', {
    './RelatedMaterialSuggestionsClient': { default: () => null },
    '../lib/notion-entries': { getListEntries: async () => entries },
    '../lib/related-materials': lib,
  });
}

test('related list renders links and descriptive reason', () => {
  const html = renderToStaticMarkup(React.createElement(list, { items: [{ ...entry('b', 'P0300 diagnostyka'), reason: 'Wspólny kod lub identyfikator: P0300.' }] }));
  assert.match(html, /Powiązane materiały/);
  assert.match(html, /\/baza\/b/);
  assert.match(html, /P0300 diagnostyka/);
  assert.match(html, /Wspólny kod lub identyfikator/);
});
test('related list returns null for empty items', () => {
  assert.equal(renderToStaticMarkup(React.createElement(list, { items: [] })), '');
});
test('suggestions component contains retry, loading and empty states', () => {
  for (const text of ['Spróbuj ponownie', 'Ładowanie powiązanych materiałów', 'Nie znaleziono powiązanych materiałów', 'Nie udało się pobrać propozycji', 'Treść instrukcji pozostaje dostępna']) assert.ok(suggestionsSource.includes(text));
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
  assert.match(fs.readFileSync('src/app/RelatedMaterialSuggestions.tsx', 'utf8'), /<Suspense/);
});
test('recommendation rules exclude outside scope and rank identifier matches', () => {
  const candidates = [entry('b', 'P0300 diagnostyka'), entry('c', 'P0300 diagnostyka')];
  const matches = new Map([['b', { status: 'outside_scope', reasons: [] }], ['c', { status: 'within_scope', reasons: [] }]]);
  assert.deepEqual(lib.getRelatedMaterials(current, candidates, matches).map(item => item.id), ['c']);
});
test('server seed uses existing rules and omits article bodies', async () => {
  const seed = await server([current, candidate]).getInitialRelated(current);
  assert.equal(seed.seedAvailable, true);
  assert.equal(seed.initialRelated.length, 1);
  assert.equal(seed.initialRelated[0].id, candidate.id);
  assert.equal(seed.initialRelated[0].Opis, undefined);
  assert.ok(seed.initialRelated[0].reason.includes('P0300'));
});
test('unavailable inventory allows client fallback', async () => {
  assert.deepEqual(await server(null).getInitialRelated(current), { initialRelated: [], seedAvailable: false });
});
test('initial related links render to HTML before profile hydration', async () => {
  const seed = await server([current, candidate]).getInitialRelated(current);
  const client = load('src/app/RelatedMaterialSuggestionsClient.tsx', {
    './RelatedMaterials': { default: list },
    './VehicleProfileProvider': { useVehicleProfile: () => ({ profile: null, ready: false }) },
    '../lib/related-materials': lib,
    '../lib/vehicle-compatibility': { matchVehicle: () => { throw new Error('No profile expected'); } },
  }).default;
  const html = renderToStaticMarkup(React.createElement(client, { current, ...seed }));
  assert.ok(html.includes('/baza/' + encodeURIComponent(registry[0].slug)));
  assert.match(html, /P0300 diagnostyka/);
  assert.doesNotMatch(html, /Ładowanie powiązanych/);
});
