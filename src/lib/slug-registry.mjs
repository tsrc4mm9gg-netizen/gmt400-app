export function normalizeId(value) {
  if (typeof value !== 'string' || !/^(?:[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(value)) throw new Error('Invalid Notion ID');
  return value.replace(/-/g, '').toLowerCase();
}

export function slugifyTitle(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '') || 'wpis';
}

/** Pure allocator. The caller must persist the returned registry before publishing URLs. */
export function extendSlugRegistry(previous, entries) {
  if (!Array.isArray(previous) || !Array.isArray(entries)) throw new Error('Expected arrays');
  const byId = new Map();
  const used = new Set();
  for (const row of previous) {
    const id = normalizeId(row.id);
    if (typeof row.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug) || /^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(row.slug) || byId.has(id) || used.has(row.slug)) throw new Error('Invalid or duplicate registry entry');
    byId.set(id, { id, slug: row.slug });
    used.add(row.slug);
  }
  const pending = entries.map(row => ({ id: normalizeId(row.id), title: row.Nazwa })).sort((a, b) => a.id.localeCompare(b.id));
  for (const row of pending) {
    if (byId.has(row.id)) continue;
    let base = slugifyTitle(row.title);
    if (/^(?:[a-f0-9]{32}|[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})$/i.test(base)) base = `wpis-${base}`;
    let slug = base;
    if (used.has(slug)) {
      slug = `${base}-${row.id}`;
      for (let n = 2; used.has(slug); n++) slug = `${base}-${row.id}-${n}`;
    }
    byId.set(row.id, { id: row.id, slug });
    used.add(slug);
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}
