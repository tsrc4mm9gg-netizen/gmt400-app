import registry from '../../data/knowledge-slugs.json';
import type { NotionEntry } from './notion-entries';

const UUID_RE = /^(?:[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function isNotionId(value: string): boolean {
  return UUID_RE.test(value);
}

export type KnowledgeSlug = { id: string; slug: string };

const rows = (Array.isArray(registry) ? registry : []) as KnowledgeSlug[];
const byId = new Map(rows.map(row => [row.id, row]));
const bySlug = new Map(rows.map(row => [row.slug, row]));

export function getKnowledgeSlug(id: string): KnowledgeSlug | null {
  return byId.get(id.replace(/-/g, '')) ?? byId.get(id) ?? null;
}

export function getKnowledgeIdBySlug(slug: string): KnowledgeSlug | null {
  return bySlug.get(decodeURIComponent(slug).toLowerCase()) ?? null;
}

export function getKnowledgeSlugs(): KnowledgeSlug[] {
  return rows;
}

export function knowledgeHref(entry: Pick<NotionEntry, 'id' | 'Nazwa'>, slug?: string): string {
  const resolved = slug ?? getKnowledgeSlug(entry.id)?.slug;
  return `/baza/${encodeURIComponent(resolved || entry.id)}`;
}
