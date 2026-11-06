import test from 'node:test';
import assert from 'node:assert/strict';
import { extendSlugRegistry, normalizeId, slugifyTitle } from '../src/lib/slug-registry.mjs';

const A = '00000000-0000-0000-0000-000000000001';
const B = '00000000-0000-0000-0000-000000000002';
const row = (id, Nazwa) => ({ id, Nazwa });

test('Polish characters and empty titles', () => {
  assert.equal(slugifyTitle('ŁĄCZNIK — śruby / 4L60E'), 'lacznik-sruby-4l60e');
  assert.equal(slugifyTitle('!!!'), 'wpis');
});
test('UUID variants normalize to the same key', () => {
  assert.equal(normalizeId(A), normalizeId(A.replace(/-/g, '').toUpperCase()));
  assert.throws(() => normalizeId('not-an-id'));
});
test('title changes preserve persisted URLs', () => {
  const saved = extendSlugRegistry([], [row(A, 'Filtr oleju')]);
  assert.deepEqual(extendSlugRegistry(saved, [row(A, 'Nowa nazwa')]), saved);
});
test('input order does not affect the initial registry', () => {
  const entries = [row(A, 'Filtr'), row(B, 'Filtr')];
  assert.deepEqual(extendSlugRegistry([], entries), extendSlugRegistry([], [...entries].reverse()));
});
test('duplicate titles and shared ID prefixes remain unique', () => {
  const saved = extendSlugRegistry([], [row(A, 'Filtr'), row(B, 'Filtr')]);
  assert.equal(new Set(saved.map(x => x.slug)).size, 2);
});
test('removed entries retain reserved URLs; adding entries does not mutate existing rows', () => {
  const saved = extendSlugRegistry([], [row(B, 'Filtr')]);
  const snapshot = structuredClone(saved);
  const next = extendSlugRegistry(saved, [row(A, 'Filtr')]);
  assert.deepEqual(saved, snapshot);
  assert.equal(next.find(x => x.id === normalizeId(B)).slug, 'filtr');
});
test('corrupt registry fails closed', () => {
  assert.throws(() => extendSlugRegistry([{ id: A, slug: 'filtr' }, { id: B, slug: 'filtr' }], []));
  assert.throws(() => extendSlugRegistry([{ id: A, slug: '../bad' }], []));
});
test('UUID-shaped titles do not collide with the legacy route namespace', () => {
  const saved = extendSlugRegistry([], [row(A, B)]);
  assert.ok(saved[0].slug.startsWith('wpis-'));
});
