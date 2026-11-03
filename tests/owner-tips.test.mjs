import assert from 'node:assert/strict';
import test from 'node:test';
import { OWNER_TIPS, OWNER_TIP_CATEGORIES, ILLUSTRATED_SCOPE, ownerTipFit } from '../src/lib/owner-tips.mjs';

test('każda porada ma zakres, kroki, źródło ze stroną i znaną kategorię', () => {
  const cats = new Set(OWNER_TIP_CATEGORIES.map(c => c.id));
  const ids = new Set();
  for (const t of OWNER_TIPS) {
    assert.ok(!ids.has(t.id), 'duplikat ' + t.id); ids.add(t.id);
    assert.ok(cats.has(t.cat), t.id);
    assert.match(t.scope, /^Dotyczy:/, t.id);
    assert.ok(t.steps.length >= 2, t.id);
    assert.ok(t.sources.length >= 1 && t.sources.every(s => s.doc && s.page), t.id);
    for (const s of t.sources) if (s.url) assert.match(s.url, /^https:\/\/(assets\.gm\.com|www\.chevrolet\.com|differentials\.com)\//, t.id);
    assert.doesNotMatch(JSON.stringify(t), /drive\.google|docs\.google/, t.id);
  }
  assert.ok(OWNER_TIPS.length >= 30);
});

test('filtr: bez profilu porady z zakresem są „unknown”, ogólne „general”', () => {
  const t = OWNER_TIPS.find(x => x.id === 'przelozenie-test');
  assert.equal(ownerTipFit(t, null).status, 'general');
  assert.equal(ownerTipFit(OWNER_TIPS.find(x => x.id === 'docieranie'), null).status, 'unknown');
});

test('filtr: model, napęd i roczniki', () => {
  const k97 = { platform: 'C/K', model: 'K1500', year: '1997', drive: '' };
  const c90 = { platform: 'C/K', model: 'C1500', year: '1990', drive: '2WD' };
  const get = id => OWNER_TIPS.find(x => x.id === id);
  assert.equal(ownerTipFit(get('4wd-przyciski'), k97).status, 'match');
  assert.equal(ownerTipFit(get('4wd-przyciski'), c90).status, 'outside');
  assert.equal(ownerTipFit(get('blizniaki'), k97).status, 'outside');
  assert.equal(ownerTipFit(get('blizniaki'), { ...k97, model: 'K3500' }).status, 'match');
  assert.equal(ownerTipFit(get('aldl'), c90).status, 'unknown');
  assert.equal(ownerTipFit(get('aldl'), { ...c90, year: '1991' }).status, 'match');
  assert.equal(ownerTipFit(get('aldl'), k97).status, 'outside');
  assert.equal(ownerTipFit(ILLUSTRATED_SCOPE['third-row'], { platform: 'Tahoe', model: 'Tahoe 4-door', year: '1999', drive: '4WD' }).status, 'outside');
  assert.equal(ownerTipFit(ILLUSTRATED_SCOPE['second-row'], { platform: 'Tahoe', model: 'Tahoe 2-door', year: '1999', drive: '4WD' }).status, 'outside');
  assert.equal(ownerTipFit(ILLUSTRATED_SCOPE['second-row'], { platform: 'Suburban', model: 'Suburban 1500', year: '1999', drive: '4WD' }).status, 'match');
});
