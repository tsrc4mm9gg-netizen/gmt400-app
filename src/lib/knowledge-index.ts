import { OBD_CODES } from './obd-codes';
import type { Applicability } from './vehicle-compatibility';

export type KnowledgeEntry = {
  id: string;
  Nazwa: string;
  Typ: string;
  Model?: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
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
  const searchId = entry.href || entry.id;
  const searchTitle = entry.Nazwa;
  const searchKeywords = [entry.Typ, entry.Model, entry.Lata].filter((value): value is string => Boolean(value));
  const searchBody = [entry.Nazwa, entry.Typ, entry.Model, entry.Lata, entry.Opis, entry.Objawy, entry.Rozwiązanie]
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
  const normalized = normalizeSearch(query);
  const tokens = tokenizeSearch(query);
  if (normalized.length < 2 || !tokens.length) return [];
  const seen = new Set<string>();
  return index.map((document, originalIndex) => {
    const title = normalizeSearch(document.searchTitle);
    const body = normalizeSearch([document.searchTitle, document.searchBody, ...document.searchKeywords].join(' '));
    const matches = tokens.every(token => body.includes(token));
    const score = matches
      ? tokens.reduce((sum, token) => sum + (title.includes(token) ? 10 : 1), 0)
        + (title === normalized ? 200 : title.startsWith(normalized) ? 100 : 0)
      : 0;
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

export function getKnowledgeEntries(items: readonly KnowledgeEntry[] = []): KnowledgeEntry[] {
  return [...getObdEntries(), ...items];
}
