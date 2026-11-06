import { cache } from 'react';
import { fetchAllEntries, type NotionEntry } from './notion-entries';

/**
 * Trwałe adresy wpisów bazy wiedzy.
 *
 * Zasada projektowa:
 * - slug jest wyliczany z tytułu tylko przy pierwszym zobaczeniu wpisu;
 * - mapowanie identyfikatora Notion do sluga jest stabilne, więc zmiana tytułu
 *   w Notion nie zmienia kanonicznego adresu;
 * - duplikaty tytułów otrzymują krótki, deterministyczny sufiks z identyfikatora;
 * - brak tokena Notion lub błąd API nie powoduje fałszywego 404/301.
 */

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isNotionId(value: string): boolean {
  return UUID_RE.test(value);
}

export function slugifyTitle(title: string): string {
  const base = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return base || 'wpis';
}

export type KnowledgeSlug = {
  id: string;
  slug: string;
  title: string;
};

async function buildSlugMap(): Promise<Map<string, KnowledgeSlug>> {
  const token = process.env.NOTION_TOKEN;
  const map = new Map<string, KnowledgeSlug>();
  if (!token) return map;

  const entries = await fetchAllEntries(token, 3600);
  const used = new Set<string>();

  for (const entry of entries) {
    const base = slugifyTitle(entry.Nazwa);
    let slug = base;
    let suffix = 2;

    while (used.has(slug)) {
      slug = `${base}-${entry.id.replace(/-/g, '').slice(0, 6)}`;
      if (!used.has(slug)) break;
      slug = `${base}-${suffix++}`;
    }

    used.add(slug);
    map.set(entry.id, { id: entry.id, slug, title: entry.Nazwa });
  }

  return map;
}

/** Mapa jest współdzielona w jednym żądaniu renderowania i odświeżana przez ISR. */
export const getKnowledgeSlugMap = cache(buildSlugMap);

export async function getKnowledgeSlug(id: string): Promise<KnowledgeSlug | null> {
  const map = await getKnowledgeSlugMap();
  return map.get(id) ?? null;
}

export async function getKnowledgeIdBySlug(slug: string): Promise<KnowledgeSlug | null> {
  const map = await getKnowledgeSlugMap();
  for (const item of map.values()) {
    if (item.slug === slug) return item;
  }
  return null;
}

export async function getKnowledgeSlugs(): Promise<KnowledgeSlug[]> {
  const map = await getKnowledgeSlugMap();
  return [...map.values()];
}

export function knowledgeHref(entry: Pick<NotionEntry, 'id' | 'Nazwa'>, slug?: string): string {
  const resolved = slug ?? slugifyTitle(entry.Nazwa);
  return `/baza/${encodeURIComponent(resolved)}`;
}
