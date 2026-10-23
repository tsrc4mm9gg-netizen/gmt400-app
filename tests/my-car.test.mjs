import test from 'node:test';
import assert from 'node:assert/strict';
import { knowledgeFit, leadingYears, modelFit, partFit, scopeTextFit, yearFit } from '../src/lib/my-car.mjs';

const k1500 = { brand: 'Chevrolet', platform: 'C/K', model: 'K1500', year: '1997', engine: 'L31' };
const tahoe = { brand: 'Chevrolet', platform: 'Tahoe', model: 'Tahoe 4-door', year: '1999', engine: '' };
const item = (Nazwa, model, years) => ({ Nazwa, applicability: { model, years } });

test('lata: zakresy, „+”, opisowe i nieczytelne', () => {
  assert.deepEqual(leadingYears('1996–1999 (7.4 L29 VIN J)'), [1996, 1999]);
  assert.equal(yearFit(['1996+'], '1997'), 'match');
  assert.equal(yearFit(['1988–1995'], '1997'), 'outside');
  assert.equal(yearFit(['1996–1999 (7.4 L29 VIN J)'], '1997'), 'match');
  assert.equal(yearFit(['do 2002 (USA)'], '1997'), 'unknown');
  assert.equal(yearFit([], '1997'), 'unknown');
});

test('model: ogólne, własne, inne nadwozie, brak danych', () => {
  assert.equal(modelFit(['Wszystkie'], k1500), 'general');
  assert.equal(modelFit(['C/K'], k1500), 'match');
  assert.equal(modelFit(['Tahoe'], k1500), 'outside');
  assert.equal(modelFit(['coś innego'], k1500), 'unknown');
  assert.equal(modelFit(['Tahoe / Blazer 2-drzwi'], tahoe), 'match');
});

test('materiał z bazy: silnik, marka i tonaż z tytułu', () => {
  assert.equal(knowledgeFit(item('Problemy z pompą wtryskową 6.5L — tipy', ['Wszystkie'], ['1992–1999']), k1500, '5.7').fit, 'outside');
  assert.equal(knowledgeFit(item('7.4 L29 — syk', ['Wszystkie'], ['1996–1999']), k1500, '5.7').fit, 'outside');
  assert.equal(knowledgeFit(item('Silnik 5.7L Vortec (L31)', ['Wszystkie'], ['1996–1999']), k1500, '5.7').fit, 'match');
  assert.equal(knowledgeFit(item('GMC Sierra 2500', ['C/K'], ['1988–1999']), k1500).fit, 'outside');
  assert.equal(knowledgeFit(item('Chevrolet C/K 3500 Dually', ['C/K'], ['1991–1999']), k1500).fit, 'outside');
  assert.equal(knowledgeFit(item('Chevrolet C/K 1500 Extended Cab', ['C/K'], ['1988–1999']), k1500).fit, 'match');
  assert.equal(knowledgeFit(item('Pływający wskaźnik paliwa', ['Wszystkie'], []), k1500).fit, 'general');
  assert.equal(knowledgeFit(item('Problemy z TBI', ['Wszystkie'], ['1988–1995']), k1500).fit, 'outside');
  assert.equal(knowledgeFit(item('Problem 6.5L', ['Wszystkie'], ['1992–1999']), { ...k1500, engine: '' }).fit, 'unknown');
});

test('porady i części: zakres tekstowy i tonaż', () => {
  assert.equal(scopeTextFit('Suburban 1999 i Tahoe 1999 czterodrzwiowy z kanapą 60/40.', tahoe).fit, 'match');
  assert.equal(scopeTextFit('Suburban 1999 z wyjmowanym trzecim rzędem; nie dotyczy Tahoe.', k1500).fit, 'outside');
  assert.equal(scopeTextFit('Suburban 1999 z wyjmowanym trzecim rzędem; nie dotyczy Tahoe.', tahoe).fit, 'outside');
  assert.equal(scopeTextFit('Suburban 1999 z wyjmowanym trzecim rzędem; nie dotyczy Tahoe.', { ...tahoe, platform: 'Suburban', model: 'Suburban 1500' }).fit, 'match');
  assert.equal(partFit({ fitsModels: ['C/K 1500', 'Tahoe'], yearRange: [1996, 1998] }, k1500).fit, 'match');
  assert.equal(partFit({ fitsModels: ['C/K 2500', 'C/K 3500'], yearRange: [1991, 1998] }, k1500).fit, 'outside');
  assert.equal(partFit({ fitsModels: ['Tahoe'], yearRange: [1996, 1998] }, tahoe).fit, 'outside');
});
