const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(relative) {
  const filename = path.resolve(relative);
  const loaded = { exports: {} };
  const localRequire = id => id.startsWith('.') ? load(path.resolve(path.dirname(filename), id + '.ts')) : require(id);
  new Function('exports', 'require', 'module', ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText)(loaded.exports, localRequire, loaded);
  return loaded.exports;
}
const { stories, storyCategories } = load('src/lib/gmt400-stories.ts');
test('contains complete unique articles and permits future additions', () => { assert.ok(stories.length >= 4); assert.equal(new Set(stories.map(s => s.slug)).size, stories.length); for (const s of stories) { assert.match(s.slug, /^[a-z0-9-]+$/); assert.ok(s.title && s.description); assert.ok(s.sections.length >= 3); for (const section of s.sections) assert.ok(section.title && section.text.length > 80); } });
test('every article has attributed dated HTTPS source', () => { for (const s of stories) { assert.equal(new URL(s.sourceUrl).protocol, 'https:'); assert.ok(s.sourceAuthor && s.sourcePublisher && s.sourceTitle); assert.match(s.sourceDate, /^\d{4}-\d{2}-\d{2}$/); } });
test('categories contain published content rather than empty placeholders', () => { for (const c of storyCategories) assert.ok(stories.some(s => s.category === c.id)); for (const s of stories) assert.ok(storyCategories.some(c => c.id === s.category)); });
test('quick links use existing section callbacks and editorial route', () => { const source = fs.readFileSync('src/app/QuickAccess.tsx', 'utf8'); for (const id of ['usterki', 'serwis', 'kupujacy']) assert.ok(source.includes(`onSelect('${id}')`)); assert.ok(source.includes('href="/swiat-gmt400"')); });
test('development and special-version stories are discoverable', () => { for (const slug of ['narodziny-generacji-gmt400', 'chevrolet-454-ss-muscle-truck']) assert.ok(stories.some(s => s.slug === slug)); assert.ok(storyCategories.some(c => c.id === 'wersje-niezwykle')); });
