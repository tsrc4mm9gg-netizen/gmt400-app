type Segment = { text: string; highlighted: boolean };
const fold = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
export function getHighlightSegments(text: string, query: string): Segment[] {
  if (typeof text !== 'string' || !text) return [];
  const normalized = fold(query || '').replace(/\b(skrzynia automatyczna|automatyczna skrzynia|automat)\b/g, 'automat');
  const tokens = [...new Set(normalized.split(/[^a-z0-9]+/).filter(token => token.length > 1 && !['na', 'do', 'sie'].includes(token)))];
  if (!tokens.length) return [{ text, highlighted: false }];
  const segments: Segment[] = [];
  let plain = '', index = 0;
  const push = (value: string, highlighted: boolean) => { if (value) segments.push({ text: value, highlighted }); };
  while (index < text.length) {
    let match: { start: number; length: number } | null = null;
    for (const token of tokens) {
      for (let offset = 0; offset + token.length <= text.length - index; offset++) {
        const candidate = text.slice(index + offset, index + offset + token.length);
        if (fold(candidate) === token) { if (!match || offset < match.start || (offset === match.start && token.length > match.length)) match = { start: offset, length: token.length }; break; }
      }
    }
    if (!match) { plain += text[index]; index++; continue; }
    push(plain, false); plain = '';
    push(text.slice(index + match.start, index + match.start + match.length), true);
    index += match.start + match.length;
  }
  push(plain, false);
  return segments;
}
