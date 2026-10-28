// Skrót procedury DIY z treści wpisu (/baza/[id]): uwagi bezpieczeństwa, narzędzia i części, źródła.
// Zasada: nic nie wymyślamy — każda pozycja to dosłowny fragment tekstu wpisu (Opis / Rozwiązanie / bloki Notion).
// Brak danych = brak pozycji (strona pokazuje wtedy co najwyżej dyskretną informację „brak listy”).

const CAP = /[A-ZĄĆĘŁŃÓŚŹŻ0-9•]/;
const SAFE_RE = /okular|pod ciśnieniem|\bkwas|ogie[ńn]|zapał|iskr|wybuch|gorąc|poparz|uraz|zranie|nie rób|nie wolno|niebezpiecz|zagroż|poduszk|airbag|\bSIR\b|podpar|podpór|stoczeni|nie naprawiaj|nie wchodź|nie dotykaj|nie pal/i;

const norm = s => String(s || '').replace(/\r/g, '').replace(/[ \t]+/g, ' ');
const up = s => s.charAt(0).toUpperCase() + s.slice(1);
const stripBullet = s => s.replace(/^\s*(?:[•\-–*]|\d{1,2}[.)])\s+/, '').trim();

function cut(text, max) {
  const t = text.trim();
  if (t.length <= max) return t;
  const c = t.slice(0, max);
  return c.slice(0, Math.max(c.lastIndexOf(' '), max - 30)).replace(/[\s,;:(–-]+$/, '') + '…';
}

function sentences(text) {
  const out = [];
  let rest = text.trim();
  while (rest) {
    const m = /[.!?…](?=\s)/g;
    let end = -1, hit;
    while ((hit = m.exec(rest))) {
      const next = rest.slice(hit.index + 1).trimStart()[0];
      if (next && CAP.test(next) && !/\d$/.test(rest.slice(0, hit.index))) { end = hit.index + 1; break; }
    }
    if (end < 0) { out.push(rest); break; }
    out.push(rest.slice(0, end).trim());
    rest = rest.slice(end).trim();
  }
  return out.filter(Boolean);
}

const LABEL_SOURCE = String.raw`(NARZĘDZIA(?:\s+I\s+(?:MATERIAŁY|PRZYGOTOWANIE|CZĘŚCI))?|POTRZEBNE\s+NARZĘDZIA|CZĘŚCI(?:\s+GM|\s+ZAMIENNE)?|POTRZEBNE\s+CZĘŚCI|MATERIAŁY|BEZPIECZEŃSTWO|OSTRZEŻENI[AE]|PRZESTROGA|UWAGA)`;

/** Odcinki „ETYKIETA (opcjonalnie w nawiasie): treść” — etykieta na początku linii albo po końcu zdania/dwukropku. */
function labelled(text) {
  const re = new RegExp(String.raw`(?:^|\n|(?<=[.;:!?)]\s))[ \t]*(?:⚠\uFE0F?\s*)?` + LABEL_SOURCE + String.raw`(?:\s*\(([^)]{0,120})\))?\s*(?::|—|–)[ \t]*`, 'gi');
  const found = [];
  let m;
  while ((m = re.exec(text))) {
    const start = m.index + m[0].length;
    let end = text.indexOf('\n', start);
    if (end < 0) end = text.length;
    found.push({ label: m[1].toUpperCase().replace(/\s+/g, ' '), value: text.slice(start, end).trim() });
    re.lastIndex = Math.max(re.lastIndex, start);
  }
  return found;
}

function splitList(value) {
  const clean = value.replace(/\s+/g, ' ').trim();
  const split = (s, sep) => {
    const parts = []; let depth = 0, cur = '';
    for (const ch of s) {
      if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1);
      if (ch === sep && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
    }
    parts.push(cur);
    return parts.map(p => p.trim().replace(/[.\s]+$/, '')).filter(Boolean);
  };
  let items = split(clean, ';');
  if (items.length < 2) items = split(clean, ',');
  return items.slice(0, 14).map(i => cut(i, 140));
}

const TOPICS = [
  { tag: 'Akumulator', re: /odłącz\w*[^.\n;]{0,40}(?:minus|ujemn)|odłącz\w*[^.\n;]{0,30}akumulator|akumulator\w*[^.\n;]{0,30}odłącz/i },
  { tag: 'Zimny silnik / podzespół', re: /(?:poczekaj|odczekaj|zaczekaj|odstaw)[^.\n;]{0,45}(?:ostygn|wystyg|ostud)|(?:ostygn|wystyg)\w*\s+(?:silnik|układ|chłodnic|rur)|nie\s+(?:otwieraj|odkręcaj|zdejmuj)[^.\n;]{0,40}(?:gorąc|ciepł|nagrzan)/i },
  { tag: 'Podniesione auto', re: /podpórk|jackstand|kobyłk|stojak\w*\s+(?:pod|do)\b|podeprzyj\w*\s+na\s+(?:stojak|podpórk)|podeprzyj\w*[^.\n;]{0,25}(?:auto|pojazd|tył|przód|most|ram)/i },
  { tag: 'Poduszka powietrzna (SIR)', re: /wyłącz\w*[^.\n;]{0,40}(?:SIR|poduszk)|(?:SIR|poduszk\w+)[^.\n;]{0,40}wyłącz/i },
  { tag: 'Ciśnienie w układzie paliwa', re: /(?:zredukuj|zmniejsz|spuść|zrzuć|zdejmij)\w*\s+(?:całe\s+|resztkowe\s+)?ciśnieni/i },
];

function clauseAround(text, index) {
  let a = index, b = index;
  while (a > 0 && !/[.\n;]/.test(text[a - 1])) a--;
  while (b < text.length && !/[.\n;]/.test(text[b])) b++;
  return stripBullet(text.slice(a, b)).replace(/\s+/g, ' ');
}

/** Źródła z linii „Źródło: …” (do „Parafraza.” / końca linii) + adresy http(s) znalezione w tej linii. */
function sourcesOf(text) {
  const out = [];
  const re = /Źródł[oa]\s*:\s*/gi;
  let m;
  while ((m = re.exec(text))) {
    const start = m.index + m[0].length;
    let end = text.indexOf('\n', start); if (end < 0) end = text.length;
    let seg = text.slice(start, end);
    const stop = seg.search(/\.\s+(?:Parafraza|Sprawdź w swoim|Haynes nie podaje|POPRZEDZAJĄCE)\b/);
    if (stop >= 0) seg = seg.slice(0, stop + 1);
    const urls = [...new Set((seg.match(/https?:\/\/[^\s)]+/g) || []).map(u => u.replace(/[.,;]+$/, '')))];
    const label = seg.replace(/https?:\/\/[^\s)]+/g, '').replace(/\s+/g, ' ').replace(/[\s.,;:–—-]+$/, '').trim();
    if (label || urls.length) out.push({ text: cut(label, 300), urls: urls.slice(0, 3) });
  }
  const seen = new Set();
  return out.filter(s => { const k = s.text + '|' + s.urls.join(','); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 4);
}

/** Bloki Notion → linie „NARZĘDZIA: a; b” (nagłówek/akapit „Narzędzia” + kolejne punkty listy) i zwykłe linie tekstu. */
export function blocksToBriefText(blocks) {
  const plain = b => ((b?.[b?.type]?.rich_text) || []).map(p => p.plain_text || p.text?.content || '').join('').trim();
  const lines = [];
  const walk = list => {
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      const t = plain(b);
      const head = /^(?:potrzebne\s+)?(narzędzia(?:\s+i\s+(?:materiały|części))?|części(?:\s+zamienne)?|materiały|bezpieczeństwo|ostrzeżenia?)\s*:?\s*$/i.exec(t);
      if (head && /^(heading_[123]|paragraph|toggle|callout)$/.test(b.type)) {
        const items = [];
        const pool = [...(b.children || [])];
        let j = i + 1;
        while (j < list.length && /^(bulleted_list_item|numbered_list_item|to_do)$/.test(list[j].type)) { pool.push(list[j]); j++; }
        for (const it of pool) { const s = plain(it); if (s) items.push(s); }
        if (items.length) { lines.push(`${head[1].toUpperCase()}: ${items.join('; ')}`); i = j - 1; continue; }
      }
      if (t) lines.push(t);
      if (b.children?.length) walk(b.children);
    }
  };
  walk(Array.isArray(blocks) ? blocks : []);
  return lines.join('\n');
}

export function extractDiyBrief(entry, extraText = '') {
  const typ = entry?.Typ || '';
  const text = norm([entry?.Opis, entry?.Objawy, entry?.Rozwiązanie, extraText].filter(Boolean).join('\n\n'));
  const sources = sourcesOf(text);
  const paraphrase = /\bParafraza\b/i.test(text);
  const base = { applies: typ === 'Porada', sources, paraphrase, safety: [], tools: [], parts: [], toolsLabel: 'Narzędzia', isProcedure: false };
  if (typ !== 'Porada') return base;

  const safety = [];
  const tools = []; const parts = [];
  let toolsLabel = 'Narzędzia';
  const push = (arr, item) => { if (item && !arr.some(x => x.text === item.text)) arr.push(item); };
  for (const seg of labelled(text)) {
    if (/NARZĘDZIA/.test(seg.label)) { if (/MATERIAŁY|CZĘŚCI/.test(seg.label)) toolsLabel = 'Narzędzia i materiały'; for (const i of splitList(seg.value)) if (!tools.includes(i)) tools.push(i); }
    else if (/CZĘŚCI|MATERIAŁY/.test(seg.label)) { for (const i of splitList(seg.value)) if (!parts.includes(i)) parts.push(i); }
    else {
      const isGeneral = seg.label === 'UWAGA';
      const tag = seg.label === 'BEZPIECZEŃSTWO' ? 'Bezpieczeństwo' : seg.label.startsWith('OSTRZE') || seg.label === 'PRZESTROGA' ? 'Ostrzeżenie' : 'Uwaga';
      const parts2 = isGeneral ? sentences(seg.value).slice(0, 1) : seg.value.split(/;\s+/).flatMap(p => sentences(p)).slice(0, 3);
      for (const part of parts2) {
        const t = part.replace(/[;\s]+$/, '');
        if (t.length >= 8 && (!isGeneral || SAFE_RE.test(t))) push(safety, { text: cut(up(t), 240), tag });
      }
    }
  }
  // Same linie ⚠️ (bez etykiety) — tylko gdy mówią o ryzyku, a nie wyłącznie „sprawdź w manualu”.
  for (const line of text.split('\n')) {
    const m = /^\s*⚠\uFE0F?\s*(.+)$/.exec(line);
    if (!m) continue;
    const body = m[1].replace(/sprawdź w swoim aucie\s*\/\s*manualu[.\s—–-]*/ig, '').trim();
    if (body.length < 12 || !SAFE_RE.test(body) || /^(?:OSTRZE|UWAGA|BEZPIECZ)/i.test(body)) continue;
    push(safety, { text: cut(up(body.replace(/[;\s]+$/, '')), 240), tag: 'Ostrzeżenie' });
  }
  const stepsText = norm([entry?.Rozwiązanie, extraText].filter(Boolean).join('\n\n')).split('\n').filter(l => !/^\s*(?:⚠\uFE0F?\s*)?(?:NARZĘDZIA|CZĘŚCI|MATERIAŁY|POTRZEBNE)/i.test(l)).join('\n');
  // Tematy wynikające z kroków: pokazujemy dosłowną klauzulę z wpisu, tylko gdy temat nie jest już w uwagach.
  for (const topic of TOPICS) {
    if (safety.some(s => topic.re.test(s.text))) continue;
    const m = topic.re.exec(stepsText);
    if (!m) continue;
    const clause = clauseAround(stepsText, m.index);
    if (clause.length >= 8) push(safety, { text: cut(up(clause), 220), tag: topic.tag });
  }
  const isProcedure = /(?:^|\n)\s*\d{1,2}[.)]\s|\bkroki?\b|krok po kroku/i.test(text);
  return { ...base, safety: safety.slice(0, 6), tools: tools.slice(0, 14), parts: parts.slice(0, 14), toolsLabel, isProcedure };
}
