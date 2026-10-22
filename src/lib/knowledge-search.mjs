export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase().replace(/\s+/g, ' ').trim();
}

export function tokenizeSearch(query) {
  return [...new Set(normalizeSearch(query).split(/[^a-z0-9]+/).filter(Boolean))];
}

export function searchDocuments(documents, query) {
  const normalized = normalizeSearch(query);
  const tokens = tokenizeSearch(query);
  if (normalized.length < 2 || !tokens.length) return [];
  const seen = new Set();
  return documents.map((document, index) => {
    const title = normalizeSearch(document.title);
    const body = normalizeSearch([document.title, document.description, ...(document.keywords || [])].join(' '));
    const score = tokens.every(token => body.includes(token))
      ? tokens.reduce((sum, token) => sum + (title.includes(token) ? 10 : 1), 0)
        + (title === normalized ? 200 : title.startsWith(normalized) ? 100 : 0)
      : 0;
    return { document, score, index };
  }).filter(result => {
    if (!result.score || seen.has(result.document.id)) return false;
    seen.add(result.document.id);
    return true;
  }).sort((a, b) => b.score - a.score || a.index - b.index);
}
