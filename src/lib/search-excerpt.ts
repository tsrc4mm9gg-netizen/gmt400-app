type Entry = { Opis?: string; Objawy?: string; Rozwiązanie?: string };
type Field = 'Opis' | 'Objawy' | 'Rozwiązanie';
const fold = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
export function getSearchExcerpt(entry: Entry, query: string, limit = 200): { field: Field; text: string; matched: boolean } | null {
  const budget = Number.isFinite(limit) ? Math.max(40, Math.min(400, Math.floor(limit))) : 200;
  const normalized = fold(query).replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat');
  const tokens = [...new Set(normalized.split(/[^a-z0-9]+/).filter(token => token.length > 1 && !['na', 'do', 'sie'].includes(token)))];
  const fields: Field[] = ['Opis', 'Objawy', 'Rozwiązanie'];
  const candidates = fields.flatMap((field, order) => {
    const value = entry[field];
    if (typeof value !== 'string' || !value.trim()) return [];
    const text = value.trim(), offsets: number[] = [];
    let searchable = '', offset = 0;
    for (const char of text) { const part = fold(char); searchable += part; for (let i = 0; i < part.length; i++) offsets.push(offset); offset += char.length; }
    const hits = tokens.map(token => searchable.indexOf(token)).filter(index => index >= 0);
    return [{ field, text, order, score: hits.length, first: hits.length ? offsets[Math.min(...hits)] : 0 }];
  });
  candidates.sort((a, b) => b.score - a.score || a.order - b.order);
  const best = candidates[0];
  if (!best) return null;
  let start = best.text.length > budget ? Math.max(0, best.first - Math.floor(budget / 3)) : 0;
  start = Math.min(start, Math.max(0, best.text.length - budget));
  if (start > 0 && /[\uDC00-\uDFFF]/.test(best.text[start])) start--;
  let end = Math.min(best.text.length, start + budget);
  if (end < best.text.length && /[\uDC00-\uDFFF]/.test(best.text[end])) end--;
  return { field: best.field, matched: best.score > 0, text: (start ? '…' : '') + best.text.slice(start, end) + (end < best.text.length ? '…' : '') };
}
