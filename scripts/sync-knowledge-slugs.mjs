import { readFile, writeFile } from 'node:fs/promises';
import { extendSlugRegistry } from '../src/lib/slug-registry.mjs';

const token = process.env.NOTION_TOKEN;
if (!token) throw new Error('Brak NOTION_TOKEN');
const databaseId = '746973771d604f1e8276502851176af2';
const registryPath = new URL('../data/knowledge-slugs.json', import.meta.url);
const previous = JSON.parse(await readFile(registryPath, 'utf8'));
const entries = [];
let cursor;
do {
  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify(cursor ? { start_cursor: cursor, page_size: 100 } : { page_size: 100 })
  });
  if (!response.ok) throw new Error(`Notion HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.results)) throw new Error('Invalid Notion response');
  for (const page of data.results) {
    if (page.archived || page.in_trash) continue;
    const title = (page.properties?.Nazwa?.title ?? []).map(part => part.plain_text || '').join('');
    entries.push({ id: page.id, Nazwa: title });
  }
  cursor = data.has_more ? data.next_cursor : undefined;
} while (cursor);
const next = extendSlugRegistry(previous, entries);
const output = JSON.stringify(next, null, 2) + '\n';
const current = JSON.stringify(previous, null, 2) + '\n';
if (output !== current) {
  await writeFile(registryPath, output);
  console.log(`Zaktualizowano rejestr: ${previous.length} -> ${next.length} wpisów.`);
} else {
  console.log(`Rejestr aktualny: ${next.length} wpisów.`);
}
