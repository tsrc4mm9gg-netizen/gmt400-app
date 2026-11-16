const { test, expect } = require('@playwright/test');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { readNotionBlocks, NotionContent, safeUrl } = require('../src/app/baza/[id]/NotionContent.tsx');
test('instruction body follows pagination and reads nested illustrations', async () => {
  const original = global.fetch;
  const calls = [];
  global.fetch = async value => {
    const url = new URL(value); calls.push(url.toString());
    const nested = url.pathname.includes('/nested/');
    const next = url.searchParams.get('start_cursor');
    const data = nested ? { results: [{ id: 'image', type: 'image', image: { external: { url: 'https://example.com/diagram.png' } } }], has_more: false } : next ? { results: [{ id: 'nested', type: 'toggle', has_children: true, toggle: { rich_text: [{ plain_text: 'Dalsze kroki' }] } }], has_more: false } : { results: [{ id: 'first', type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Pierwszy krok' }] } }], has_more: true, next_cursor: 'second-page' };
    return { ok: true, json: async () => data };
  };
  try { const blocks = await readNotionBlocks('root', 'test-placeholder'); expect(blocks).toHaveLength(2); expect(blocks[1].children[0].type).toBe('image'); expect(calls).toHaveLength(3); expect(calls.some(url => url.includes('start_cursor=second-page'))).toBe(true); } finally { global.fetch = original; }
});
test('repeated content cursor fails rather than silently returning partial instructions', async () => {
  const original = global.fetch;
  global.fetch = async () => ({ ok: true, json: async () => ({ results: [], has_more: true, next_cursor: 'same' }) });
  try { await expect(readNotionBlocks('root', 'test-placeholder')).rejects.toThrow('paginacja'); } finally { global.fetch = original; }
});
test('renderer retains text, formatting and image captions without executable links or HTML', () => {
  const blocks = [{ id: 'p', type: 'paragraph', paragraph: { rich_text: [{ plain_text: '<script>bad()</script>', annotations: { bold: true }, href: 'javascript:bad()' }] } }, { id: 'i', type: 'image', image: { external: { url: 'https://example.com/diagram.png' }, caption: [{ plain_text: 'Podpis ilustracji' }] } }];
  const html = renderToStaticMarkup(React.createElement(NotionContent, { blocks }));
  expect(html).toContain('&lt;script&gt;'); expect(html).toContain('<strong>'); expect(html).toContain('Podpis ilustracji'); expect(html).toContain('https://example.com/diagram.png'); expect(html).not.toContain('javascript:'); expect(html).not.toContain('<script>'); expect(safeUrl('data:text/html,bad')).toBe(null);
});
test('child page links use inline anchors for relative, absolute and mixed ID formats', () => {
  const childId = '414d7bf1c139819caccaeca7d3daba7b';
  const canonicalId = '414d7bf1-c139-819c-acca-eca7d3daba7b';
  const anchor = `#notion-child-${canonicalId}`;
  const blocks = [
    { id: 'intro', type: 'paragraph', paragraph: { rich_text: [
      { plain_text: 'Względny', href: `/baza/${childId}` },
      { plain_text: 'Absolutny', href: `https://www.gmt400.pl/baza/${canonicalId}` },
      { plain_text: 'Mieszany', href: `https://gmt400.pl/baza/414D7BF1-C139-819C-ACCA-ECA7D3DABA7B` },
      { plain_text: 'Nieistniejący', href: `/baza/00000000-0000-0000-0000-000000000000` },
    ] } },
    { id: canonicalId, type: 'child_page', child_page: { title: 'Dane fabryczne' }, children: [] },
  ];
  const html = renderToStaticMarkup(React.createElement(NotionContent, { blocks }));
  expect((html.match(new RegExp(anchor.replace(/[-]/g, '\\-'), 'g')) || []).length).toBe(3);
  expect(html).toContain(`href="${anchor}"`);
  expect(html).toContain(`href="/baza/00000000-0000-0000-0000-000000000000"`);
  expect(html).toContain(`id="${anchor.slice(1)}"`);
});
