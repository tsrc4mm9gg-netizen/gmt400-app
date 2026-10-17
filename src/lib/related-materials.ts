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
const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const cleanId = (value: string) => value.replace(/-/g, '').toLowerCase();
const STOP_WORDS = new Set(['the','and','for','with','w','i','na','do','od','po','za','oraz','lub','nie','jest','sie','dla','przy','jak','co','material','instrukcja','poradnik','opis','rozwiazanie']);
const entryText = (entry: KnowledgeEntry) => [entry.Nazwa,entry.Opis,entry.Objawy,entry.Rozwiązanie].filter(Boolean).join(' ');
const keywords = (entry: KnowledgeEntry) => new Set(normalize(entryText(entry)).split(' ').filter(word => word.length > 3 && !STOP_WORDS.has(word)));
const identifiers = (entry: KnowledgeEntry) => new Set(entryText(entry).toUpperCase().match(/\b(?:[PBCU][0-3][0-9A-F]{3}|4L(?:60|65|70|80|85)E|NP(?:208|231|233|241|243|246|261|263))\b/g) || []);
const matchWeight = (status?: MatchResult['status']) => status === 'within_scope' ? 4 : status === 'general' ? 2 : 0;

export function getRelatedMaterials(current: KnowledgeEntry, candidates: KnowledgeEntry[], matches: Map<string, MatchResult>, limit = 3): RelatedMaterial[] {
  if (!current.id || !Number.isFinite(limit) || limit < 1) return [];
  const currentKeywords = keywords(current);
  const currentIdentifiers = identifiers(current);
  const seen = new Set([cleanId(current.id)]);
  const ranked: { item: RelatedMaterial; score: number }[] = [];
  for (const candidate of candidates) {
    if (!candidate.id || !candidate.Nazwa.trim()) continue;
    const id = cleanId(candidate.id);
    if (!id || seen.has(id)) continue;
    const match = matches.get(candidate.id) || matches.get(id);
    if (match?.status === 'outside_scope') continue;
    const candidateKeywords = keywords(candidate);
    const shared = [...currentKeywords].filter(word => candidateKeywords.has(word)).sort();
    const candidateIdentifiers = identifiers(candidate);
    const sharedIdentifiers = [...currentIdentifiers].filter(code => candidateIdentifiers.has(code)).sort();
    if (!sharedIdentifiers.length && shared.length < 2) continue;
    seen.add(id);
    const model = normalize(current.Model);
    const sameModel = Boolean(model) && normalize(candidate.Model) === model;
    const score = sharedIdentifiers.length * 100 + Math.min(shared.length, 10) * 5 + matchWeight(match?.status) + (sameModel ? 2 : 0);
    const reason = sharedIdentifiers.length
      ? 'Wspólny kod lub identyfikator: ' + sharedIdentifiers.join(', ') + '. Powiązanie tematyczne, nie potwierdzenie zgodności z autem.'
      : 'Wspólne słowa w treści: ' + shared.slice(0, 3).join(', ') + '. Powiązanie tekstowe, nie zalecenie naprawy ani potwierdzenie zgodności z autem.';
    ranked.push({ item: { ...candidate, reason }, score });
  }
  return ranked.sort((a, b) => b.score - a.score || a.item.Nazwa.localeCompare(b.item.Nazwa, 'pl') || (a.item.id || '').localeCompare(b.item.id || '')).slice(0, Math.min(Math.floor(limit), 10)).map(result => result.item);
}
