import type { Applicability, MatchResult } from './vehicle-compatibility';

export type KnowledgeEntry = {
  id?: string;
  Nazwa: string;
  Typ: string;
  Model: string;
  Lata?: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  applicability?: Applicability;
};

export type RelatedMaterial = KnowledgeEntry & { reason: string };

const normalize = (value: string) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ł/g, 'l')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'w', 'i', 'na', 'do', 'od', 'po', 'za', 'oraz', 'lub', 'nie', 'jest', 'sie', 'dla', 'przy', 'jak', 'co']);

const keywords = (entry: KnowledgeEntry) => {
  const text = normalize([entry.Nazwa, entry.Opis, entry.Objawy, entry.Rozwiązanie].filter(Boolean).join(' '));
  return new Set(text.split(' ').filter(word => word.length > 3 && !STOP_WORDS.has(word)));
};

export function getRelatedMaterials(current: KnowledgeEntry, candidates: KnowledgeEntry[], matches: Map<string, MatchResult>, limit = 3): RelatedMaterial[] {
  if (!current.id) return [];
  const currentKeywords = keywords(current);
  const seen = new Set([current.id]);
  const scored = candidates
    .filter(candidate => candidate.id && candidate.id !== current.id && !seen.has(candidate.id))
    .map(candidate => {
      const match = candidate.id ? matches.get(candidate.id) : undefined;
      if (match?.status === 'outside_scope') return null;
      const candidateKeywords = keywords(candidate);
      const shared = [...currentKeywords].filter(word => candidateKeywords.has(word));
      const sameType = candidate.Typ === current.Typ;
      const sameModel = normalize(candidate.Model) === normalize(current.Model);
      const score = (match?.status === 'within_scope' ? 40 : match?.status === 'general' ? 20 : 0) + (sameType ? 25 : 0) + (sameModel ? 20 : 0) + Math.min(shared.length, 5) * 3;
      if (score < 23) return null;
      const reason = sameType && sameModel ? 'Ten sam typ i model' : sameType ? 'Ten sam typ materiału' : sameModel ? 'Ten sam model' : 'Wspólne zagadnienie';
      seen.add(candidate.id as string);
      return { ...candidate, reason };
    })
    .filter((item): item is RelatedMaterial => Boolean(item))
    .sort((a, b) => b.Nazwa.localeCompare(a.Nazwa, 'pl'))
    .slice(0, limit);
  return scored;
}
