import test from 'node:test';
import assert from 'node:assert/strict';
import { parseYearRule, matchesYearRule, matchesYearRules, matchesNumericYears } from '../src/lib/year-range.mjs';
import { normalizeSearch, tokenizeSearch, searchDocuments } from '../src/lib/knowledge-search.mjs';

for (const rule of ['1996-2000', '1996–2000', '1996—2000', ' 1996 - 2000 ']) {
  test(`Inclusive range ${rule}`, () => {
    assert.equal(matchesYearRule(1996, rule), true);
    assert.equal(matchesYearRule(1998, rule), true);
    assert.equal(matchesYearRule(2000, rule), true);
    assert.equal(matchesYearRule(1995, rule), false);
    assert.equal(matchesYearRule(2001, rule), false);
  });
}
test('Exact year', () => { assert.equal(matchesYearRule('1996', '1996'), true); assert.equal(matchesYearRule(1997, '1996'), false); });
test('Open range', () => { assert.equal(matchesYearRule(2000, '1996+'), true); assert.equal(matchesYearRule(1995, '1996+'), false); });
test('Universal rules', () => { for (const value of ['wszystkie', 'WSZYSTKIE', 'Ogólne', 'all']) assert.equal(matchesYearRule(1998, value), true); });
test('Malformed rules remain unknown', () => { for (const value of ['', '2000-1996', '1996abc', '96', null]) assert.equal(parseYearRule(value), null); });
test('Malformed profile remains unknown', () => { for (const value of ['', '1998x', 0, NaN]) assert.equal(matchesYearRule(value, '1996+'), null); });
test('Multiple rules preserve uncertainty', () => { assert.equal(matchesYearRules(1998, ['1990', 'bad']), null); assert.equal(matchesYearRules(1998, ['bad', '1996+']), true); assert.equal(matchesYearRules(1998, ['1990', '1991']), false); });
test('Numeric tuple includes middle years', () => { assert.equal(matchesNumericYears(1998, [1996, 2000]), true); assert.equal(matchesNumericYears(1995, [1996, 2000]), false); assert.equal(matchesNumericYears(1998, [2000, 1996]), null); });
test('Discrete list with more than two values', () => { assert.equal(matchesNumericYears(1998, [1996, 1998, 2000]), true); assert.equal(matchesNumericYears(1999, [1996, 1998, 2000]), false); });
test('Polish normalization and stable tokens', () => { assert.equal(normalizeSearch(' ŁĄCZNOŚĆ '), 'lacznosc'); assert.deepEqual(tokenizeSearch('P0300, p0300 / ZAPŁON'), ['p0300', 'zaplon']); });
const documents = [
  { id: 'p0300', title: 'P0300', description: 'Wypadanie zapłonów', keywords: ['misfire'] },
  { id: 'p0740', title: 'P0740', description: 'Obwód TCC', keywords: ['4L60E', 'Skrzynia biegów'] },
  { id: 'guide', title: 'Poradnik zapłonu', description: 'Diagnostyka P0300' }
];
test('Exact code ranks first', () => assert.equal(searchDocuments(documents, 'p0300')[0].document.id, 'p0300'));
test('Related keywords are indexed', () => assert.equal(searchDocuments(documents, '4l60e')[0].document.id, 'p0740'));
test('All tokens must match', () => assert.equal(searchDocuments(documents, 'P0300 EVAP').length, 0));
test('Empty and one character query', () => { assert.deepEqual(searchDocuments(documents, ''), []); assert.deepEqual(searchDocuments(documents, 'p'), []); });
test('Duplicate IDs are excluded', () => assert.equal(searchDocuments([documents[0], documents[0]], 'P0300').length, 1));
