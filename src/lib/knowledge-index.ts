import { OBD_CODES } from './obd-codes';
import { GUIDE_ENTRIES } from './guide-entries.mjs';
import { prepareQuery, scoreDocument } from './search-aliases.mjs';
import type { Applicability } from './vehicle-compatibility';

export type KnowledgeEntry = {
  id?: string;
  Nazwa: string;
  Typ: string;
  Model?: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
  Slowa?: string;
  href?: string;
  applicability?: Applicability;
};

export type IndexedKnowledge = KnowledgeEntry & {
  searchId: string;
  searchTitle: string;
  searchBody: string;
  searchKeywords: string[];
};

const normalizeSearch = (value: unknown) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ł/gi, 'l')
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .trim();

const tokenizeSearch = (query: string) => [...new Set(
  normalizeSearch(query).split(/[^a-z0-9]+/).filter(Boolean)
)];

export function toSearchDocument(entry: KnowledgeEntry): IndexedKnowledge {
  const searchId = entry.href || entry.id || '';
  const searchTitle = entry.Nazwa;
  const searchKeywords = [entry.Typ, entry.Model, entry.Lata].filter((value): value is string => Boolean(value));
  const searchBody = [entry.Nazwa, entry.Typ, entry.Model, entry.Lata, entry.Opis, entry.Objawy, entry.Rozwiązanie, entry.Slowa]
    .filter(Boolean)
    .join(' ');
  return { ...entry, searchId, searchTitle, searchBody, searchKeywords };
}

export function buildKnowledgeIndex(entries: readonly KnowledgeEntry[]): IndexedKnowledge[] {
  const seen = new Set<string>();
  const documents: IndexedKnowledge[] = [];
  for (const entry of entries) {
    const key = entry.href || entry.id;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    documents.push(toSearchDocument(entry));
  }
  return documents;
}

export function searchKnowledge(index: readonly IndexedKnowledge[], query: string): KnowledgeEntry[] {
  const prepared = prepareQuery(query);
  if (prepared.normalized.length < 2 || !prepared.tokens.length) return [];
  const seen = new Set<string>();
  return index.map((document, originalIndex) => {
    const body = [document.searchTitle, document.searchBody, ...document.searchKeywords].join(' ');
    const score = scoreDocument(prepared, { title: document.searchTitle, body, id: document.searchId });
    return { document, score, originalIndex };
  })
    .filter(({ document, score }) => {
      if (!score || seen.has(document.searchId)) return false;
      seen.add(document.searchId);
      return true;
    })
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)
    .map(({ document }) => document);
}

export function getObdEntries(): KnowledgeEntry[] {
  return OBD_CODES.map(item => ({
    id: `obd:${item.code}`,
    Nazwa: `${item.code} — ${item.title}`,
    Typ: 'Kod błędu',
    Model: 'Zakres zastosowania wymaga sprawdzenia',
    Opis: item.description,
    Objawy: item.commonCauses.join('\n'),
    Rozwiązanie: item.diagnosticSteps.join('\n'),
    href: `/kody-obd/${item.code.toLowerCase()}`,
  }));
}

export function getGuideEntries(): KnowledgeEntry[] {
  return GUIDE_ENTRIES.map(entry => ({ ...entry }));
}

export function getKnowledgeEntries(items: readonly KnowledgeEntry[] = []): KnowledgeEntry[] {
  return [...getGuideEntries(), ...getObdEntries(), ...items];
}
