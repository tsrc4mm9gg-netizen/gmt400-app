import { searchDocuments } from './knowledge-search.mjs';

export function toSearchDocument(entry) {
  return {
    id: entry.href || entry.id,
    title: entry.Nazwa,
    description: [entry.Typ, entry.Model, entry.Lata, entry.Opis, entry.Objawy, entry.Rozwiązanie, entry.Slowa].filter(Boolean).join(' '),
    keywords: [entry.Typ, entry.Model, entry.Lata].filter(Boolean),
  };
}

export function buildKnowledgeIndex(entries) {
  const seen = new Set();
  const documents = [];
  for (const entry of entries) {
    const key = entry.href || entry.id;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    documents.push({ ...toSearchDocument(entry), entry, href: entry.href });
  }
  return documents;
}

export function searchKnowledge(index, query) {
  return searchDocuments(index, query).map(({ document }) => document);
}

export function getKnowledgeEntries(items = []) {
  return [...items];
}
