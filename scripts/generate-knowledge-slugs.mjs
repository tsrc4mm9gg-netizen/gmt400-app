import { readFile, writeFile, rename, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../data/knowledge-slugs.json', import.meta.url));
const normalizeId = value => {
  if (typeof value !== 'string' || !/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(value)) throw new Error('Invalid Notion ID');
  return value.replaceAll('-', '').toLowerCase();
};
const compare = (a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0;

async function main() {
  const existing = JSON.parse(await readFile(output, 'utf8'));
  if (!Array.isArray(existing)) throw new Error('Registry must be an array');
  const byId = new Map();
  const used = new Set();
  for (const row of existing) {
    const id = normalizeId(row?.id);
    const slug = row?.slug;
    if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || /^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(slug) || byId.has(id) || used.has(slug)) throw new Error('Invalid or duplicate registry row');
    byId.set(id, { id, slug });
    used.add(slug);
  }
  const token = process.env.NOTION_TOKEN;
  const database = normalizeId(process.env.NOTION_DATABASE_ID);
  if (!token) throw new Error('Missing NOTION_TOKEN');
  const pages = new Map();
  const cursors = new Set();
  let cursor;
  do {
    const response = await fetch(`https://api.notion.com/v1/databases/${database}/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`Notion HTTP ${response.status}; registry unchanged`);
    const payload = await response.json();
    if (!Array.isArray(payload.results) || typeof payload.has_more !== 'boolean') throw new Error('Invalid Notion response');
    for (const page of payload.results) {
      const id = normalizeId(page.id);
      if (pages.has(id)) throw new Error('Duplicate page across API results');
      const property = Object.values(page.properties ?? {}).find(p => p.type === 'title');
      if (!Array.isArray(property?.title)) throw new Error('Missing title property');
      const title = property.title.map(p => p.plain_text ?? '').join('').trim();
      if (!title) throw new Error('Empty page title');
      pages.set(id, { id, title });
    }
    cursor = undefined;
    if (payload.has_more) {
      if (typeof payload.next_cursor !== 'string' || !payload.next_cursor || cursors.has(payload.next_cursor)) throw new Error('Invalid pagination cursor');
      cursor = payload.next_cursor;
      cursors.add(cursor);
    }
  } while (cursor);
  if (!pages.size) throw new Error('Empty source; registry unchanged');
  for (const { id, title } of [...pages.values()].sort(compare)) {
    if (byId.has(id)) continue;
    const base = title.toLowerCase().replaceAll('ł', 'l').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '') || 'wpis';
    let slug = base;
    let suffix = 2;
    while (used.has(slug) || /^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(slug)) slug = `${base}-${suffix++}`;
    byId.set(id, { id, slug });
    used.add(slug);
  }
  const rows = [...byId.values()].sort(compare);
  const temporary = `${output}.${process.pid}.tmp`;
  try {
    await writeFile(temporary, `${JSON.stringify(rows, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await rename(temporary, output);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  console.log(`Registry: ${rows.length}; fetched: ${pages.size}; added: ${rows.length - existing.length}`);
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
