import { OBD_CODES } from './obd-codes.mjs';
import { searchDocuments } from './knowledge-search.mjs';

export function toSearchDocument(entry) {
  return {
    id: entry.href || entry.id,
    title: entry.Nazwa,
    description: [entry.Typ, entry.Model, entry.Lata, entry.Opis, entry.Objawy, entry.Rozwiązanie].filter(Boolean).join(' '),
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

export function getObdEntries() {
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

export function getKnowledgeEntries(items = []) {
  return [...getObdEntries(), ...items];
}
