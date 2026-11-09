import test from 'node:test';
import assert from 'node:assert/strict';
import { AMAZON_ASSOCIATE_TAG, amazonProductLink } from '../src/lib/amazon-product-link.mjs';

test('builds a direct product URL using only the owner tag', () => {
  const url = new URL(amazonProductLink('B000000001'));
  assert.equal(url.origin, 'https://www.amazon.de');
  assert.equal(url.pathname, '/dp/B000000001');
  assert.equal(url.searchParams.get('tag'), 'gmt400pl-20');
  assert.equal(AMAZON_ASSOCIATE_TAG, 'gmt400pl-20');
  assert.deepEqual([...url.searchParams.keys()], ['tag']);
});

test('normalizes ASIN case and surrounding whitespace', () => {
  assert.equal(amazonProductLink(' b000000001 '), amazonProductLink('B000000001'));
});

test('rejects missing identifiers, search links, injected tags and other URLs', () => {
  for (const value of [undefined, null, 123, {}, [], '', ' ', 'B123', 'B0000000011', 'B00000000-', 'B000000001?tag=other-20', 'https://www.amazon.de/s?k=tools', 'https://example.com/dp/B000000001', 'https://amzn.eu/d/example']) {
    assert.equal(amazonProductLink(value), null);
  }
});

test('does not emit a search-results URL', () => {
  assert.ok(!amazonProductLink('B000000001').includes('/s?'));
});
