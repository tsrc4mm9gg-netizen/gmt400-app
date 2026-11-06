import registry from '../../data/knowledge-slugs.json';

const slugs = new Map<string, string>();
for (const entry of registry as { id: string; slug: string }[]) {
  if (typeof entry?.id === 'string' && typeof entry?.slug === 'string') slugs.set(entry.id, entry.slug);
}

export function knowledgeSlugFor(id: string): string | null {
  return slugs.get(id) ?? null;
}
