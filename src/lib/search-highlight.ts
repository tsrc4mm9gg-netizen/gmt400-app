type Segment = { text: string; highlighted: boolean };
const fold = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
/** Synonimy: zapytanie „automat” podświetla też całą frazę „skrzynia automatyczna”. */
const PHRASES: Record<string, string[]> = { automat: ['skrzynia automatyczna', 'automatyczna skrzynia', 'automat'] };
export function getHighlightSegments(text: string, query: string): Segment[] {
  if (typeof text !== 'string' || !text) return [];
  const normalized = fold(query || '').replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat');
  const tokens = [...new Set(normalized.split(/[^a-z0-9]+/).filter(token => token.length > 1 && !['na', 'do', 'sie'].includes(token)))];
  if (!tokens.length) return [{ text, highlighted: false }];
  const needles = [...new Set(tokens.flatMap(token => PHRASES[token] ?? [token]))];
  // Złożenie znaków nie zmienia długości dla polskich liter, więc indeksy w tekście złożonym = indeksy w oryginale.
  const folded = [...text].map(char => fold(char).slice(0, 1) || char).join('');
  const sameLength = folded.length === text.length;
  const segments: Segment[] = [];
  const push = (value: string, highlighted: boolean) => { if (value) segments.push({ text: value, highlighted }); };
  let index = 0;
  while (index < text.length) {
    let match: { start: number; length: number } | null = null;
    for (const needle of needles) {
      let start = -1;
      if (sameLength) start = folded.indexOf(needle, index);
      else for (let i = index; i + needle.length <= text.length; i++) if (fold(text.slice(i, i + needle.length)) === needle) { start = i; break; }
      if (start < 0) continue;
      if (!match || start < match.start || (start === match.start && needle.length > match.length)) match = { start, length: needle.length };
    }
    if (!match) { push(text.slice(index), false); break; }
    push(text.slice(index, match.start), false);
    push(text.slice(match.start, match.start + match.length), true);
    index = match.start + match.length;
  }
  return segments;
}
