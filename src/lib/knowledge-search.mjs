import { prepareQuery, scoreDocument } from './search-aliases.mjs';

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function tokenizeSearch(query) {
  return [...new Set(normalizeSearch(query).split(/[^a-z0-9]+/).filter(Boolean))];
}

export function searchDocuments(documents, query) {
  const prepared = prepareQuery(query);
  if (prepared.normalized.length < 2 || !prepared.tokens.length) return [];
  const seen = new Set();
  return documents.map((document, index) => {
    const body = [document.title, document.description, ...(document.keywords || [])].join(' ');
    return { document, score: scoreDocument(prepared, { title: document.title, body, id: document.id }), index };
  }).filter(result => {
    if (!result.score || seen.has(result.document.id)) return false;
    seen.add(result.document.id);
    return true;
  }).sort((a, b) => b.score - a.score || a.index - b.index);
}

/** Notka o luce w treści (np. spalanie) albo null — do pokazania nad wynikami. */
export function searchNote(query) {
  return prepareQuery(query).note;
}
