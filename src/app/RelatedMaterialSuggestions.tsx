import { Suspense } from 'react';
import RelatedMaterialSuggestionsClient from './RelatedMaterialSuggestionsClient';
import { getListEntries } from '../lib/notion-entries';
import { getRelatedMaterials, type KnowledgeEntry, type RelatedMaterial } from '../lib/related-materials';

export async function getInitialRelated(current: KnowledgeEntry): Promise<{ initialRelated: RelatedMaterial[]; seedAvailable: boolean }> {
  const entries = await getListEntries();
  if (entries === null) return { initialRelated: [], seedAvailable: false };
  const initialRelated = getRelatedMaterials(current, entries, new Map()).map(({ id, Nazwa, Typ, Model, Lata, reason }) => ({ id, Nazwa, Typ, Model, Lata, reason }));
  return { initialRelated, seedAvailable: true };
}

async function ResolvedSuggestions({ current }: { current: KnowledgeEntry }) {
  const seed = await getInitialRelated(current);
  return <RelatedMaterialSuggestionsClient current={current} {...seed} />;
}

export default function RelatedMaterialSuggestions({ current }: { current: KnowledgeEntry }) {
  return <Suspense fallback={<section aria-label="Powiązane materiały" className="mt-6 rounded border border-white/15 p-4"><h2 className="text-lg text-silver-400">Powiązane materiały</h2><p role="status" className="mt-3 text-neutral-300">Ładowanie powiązanych materiałów…</p></section>}>
    <ResolvedSuggestions current={current} />
  </Suspense>;
}
