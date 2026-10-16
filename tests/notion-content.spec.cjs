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
