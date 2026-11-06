'use client';
import type { RelatedMaterial } from '../lib/related-materials';
import { knowledgeSlugFor } from '../lib/knowledge-slug-map';

export default function RelatedMaterials({ items }: { items: RelatedMaterial[] }) {
  if (!items.length) return null;
  return <section aria-labelledby="related-materials-title" className="mt-6 rounded border border-white/15 p-4">
    <h2 id="related-materials-title" className="text-lg text-silver-400">Powiązane materiały</h2>
    <ul className="mt-3 space-y-3">
      {items.map(item => {
        const id = item.id;
        if (!id) return null;
        const slug = knowledgeSlugFor(id);
        const href = `/baza/${encodeURIComponent(slug || id)}`;
        return <li key={id} className="rounded border border-white/10 p-3">
          <p className="text-xs text-neutral-400">{item.reason} · {item.Typ} · {item.Model} {item.Lata}</p>
          <a className="mt-1 inline-flex min-h-11 items-center text-silver-400 underline" href={href}>{item.Nazwa}</a>
        </li>;
      })}
    </ul>
  </section>;
}
