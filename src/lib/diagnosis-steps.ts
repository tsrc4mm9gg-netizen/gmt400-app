/**
 * Kroki kontroli do „karty kroku” w /diagnoza — WYŁĄCZNIE dosłowne fragmenty pola „Rozwiązanie” istniejącego wpisu.
 * Bierzemy tylko jawnie ponumerowane kroki („1. …”, „2. …”) albo etykiety „KROK 1 — …”. Wypunktowane dane (np. tabele, parametry)
 * nie są krokami, więc ich nie przerabiamy. Nic nie dopisujemy; zbyt długie zdanie skracamy do pierwszego zdania lub ~150 znaków.
 */
export type StepsInfo = { steps: string[]; tools: string };

const MAX_STEPS = 4;
const MAX_LEN = 130;

function tidy(raw: string): string {
  return raw
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*[(\[]\s*[)\]]/g, '')
    .trim();
}

const ABBR = /(?:^|[\s(])(?:ok|min|max|maks|rozdz|ew|np|tj|tzn|wg|ca|poz|szt|tab|nr|ryc|rys|zob|cz|pkt|s|str|godz|tys|mm|in|qt|oz|ft|lb|psi)\.$/iu;
/** Koniec zdania: kropka/wykrzyknik/pytajnik + spacja + wielka litera lub cyfra, ale nie po skrócie („ok.”, „min.”, „rozdz.”). */
function firstSentence(t: string, max: number): string {
  const re = /[.!?](?=\s+[\p{Lu}\d„"(])/gu;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const head = t.slice(0, m.index + 1);
    if (head.length < 25 || ABBR.test(head)) continue;
    return head.length <= max ? head : '';
  }
  return '';
}

/** Pierwsze zdanie kroku (jeśli jest treściwe), a w razie potrzeby skrót do MAX_LEN na granicy słowa. */
function shorten(text: string, max = MAX_LEN): string {
  const t = tidy(text).split(' • ')[0].replace(/\s*•\s*$/, '');
  const base = firstSentence(t, max) || t;
  if (base.length <= max) return base.replace(/[;,:\s]+$/, '');
  const cut = base.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[\s,;:(–-]+$/, '') + '…';
}

function numbered(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const byLine: string[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*(\d{1,2})[.)]\s+(\p{L}.*)$/u);
    if (m && Number(m[1]) === byLine.length + 1) byLine.push(m[2]);
  }
  if (byLine.length >= 2) return byLine;
  // Kroki w jednej linii: „1. … 2. … 3. …” — tylko kolejne numery od 1, każdy krok zaczyna się od litery.
  const flat = text.replace(/\s+/g, ' ');
  const re = /(?:^|\s)(\d{1,2})[.)]\s+(?=\p{L})/gu;
  const marks: { n: number; at: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(flat))) {
    if (Number(m[1]) === marks.length + 1) marks.push({ n: Number(m[1]), at: m.index, end: m.index + m[0].length });
  }
  if (marks.length < 2) return [];
  return marks.map((mk, i) => flat.slice(mk.end, marks[i + 1] ? marks[i + 1].at : undefined));
}

function labelled(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*KROK\s*\d{1,2}\s*[—–:-]\s*(.+)$/iu);
    if (m) out.push(m[1]);
  }
  return out;
}

export function extractSteps(rozwiazanie?: string): StepsInfo {
  const text = rozwiazanie || '';
  const toolsMatch = text.match(/(?:^|\n)\s*Narzędzi[ae]\s*:\s*([^\n]+)/iu);
  const tools = toolsMatch ? shorten(toolsMatch[1].replace(/\.\s*$/, ''), 130) : '';
  let raw = numbered(text);
  if (raw.length < 2) raw = labelled(text);
  // Numeracja biegów/wierszy tabel („1. bieg: …”) i nagłówki sekcji nie są krokami kontroli.
  if (raw.some(s => /^bieg\b/iu.test(s.trim()))) raw = [];
  const steps = raw.map(s => shorten(s)).filter(s => s.length >= 8 && !/krok po kroku/i.test(s)).slice(0, MAX_STEPS);
  return { steps: steps.length >= 2 ? steps : [], tools };
}
