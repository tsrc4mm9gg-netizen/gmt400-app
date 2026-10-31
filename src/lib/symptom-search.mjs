// Wyszukiwarka objawów („stuka przy hamowaniu”) — indeks po stronie klienta dla wpisów Usterka i Porada.
// Normalizacja PL (bez ogonków), proste odcinanie końcówek i grupy synonimów objawów. Przeszukuje: tytuł, Objawy, Opis.
// Zwykły .mjs, żeby testy Node i komponent liczyły wynik identycznie.

export function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Grupy pojęć objawów. Słowo pasuje do grupy, gdy zaczyna się od któregoś rdzenia; rdzeń z „=” wymaga całego słowa.
 * Kolejność bez znaczenia; jedno słowo może należeć do jednej grupy (pierwsze dopasowanie).
 */
export const SYMPTOM_CONCEPTS = [
  { id: 'rozruch', label: 'nie odpala', stems: ['odpal', 'rozruch', 'zapal', 'startuj', 'kreci', 'rozrusz', 'nieodpala'] },
  { id: 'stuk', label: 'stuki', stems: ['stuk', 'puk', 'klekot', 'kleko', 'tyka', 'tykan', 'tykni', 'grzecho', 'dudni', 'halas', 'odglos', 'brzecz', 'telepi'] },
  { id: 'hamowanie', label: 'hamowanie', stems: ['hamow', 'hamuj', 'hamul', 'hamulc', 'brake', 'klock'] },
  { id: 'pisk', label: 'pisk', stems: ['pisk', 'piszcz', 'skrzyp', 'zgrzyt', 'gwizd', 'wycie', 'wyje', 'trabien', 'syk', 'syczy'] },
  { id: 'dym', label: 'dym', stems: ['dym', 'dymi', 'kopci', 'kopce', 'opary'] },
  { id: 'szarpie', label: 'szarpanie', stems: ['szarp', 'drga', 'drgan', 'wibr', 'trzes', 'nierown', '=przerywa', 'przerywani', 'misfire', 'falowa', 'faluj', 'pulsac', 'pulsuj', 'bicie'] },
  { id: 'przegrzewa', label: 'przegrzewanie', stems: ['grzeje', 'grzeja', 'przegrz', 'temperatur', 'gotuje', 'zagotow', 'goraco', 'chlodzen', 'chlodzac'] },
  { id: 'gasnie', label: 'gaśnie', stems: ['gasn', 'gasi', 'zgas', 'dlawi', 'dusi'] },
  { id: 'wyciek', label: 'wyciek', stems: ['wyciek', 'cieknie', 'ciekn', 'kapie', 'przeciek', 'pocen', 'poci', 'ubytek', 'ubywa'] },
  { id: 'sciaga', label: 'ściąganie', stems: ['sciag', 'znosi', 'plywa', 'plywan', 'kolysan'] },
  { id: 'kontrolka', label: 'kontrolka', stems: ['kontrolk', 'swieci', 'zapalila', 'miga', 'check'] },
  { id: 'moc', label: 'brak mocy', stems: ['=moc', '=mocy', 'slab', 'mul', 'przyspiesz', 'ciagnie'] },
  { id: 'skrzynia', label: 'skrzynia', stems: ['bieg', 'skrzyn', 'automat', 'wrzuca', 'slizg', 'wstecz', 'atf'] },
  { id: 'spalanie', label: 'spalanie', stems: ['=pali', '=pala', 'spalan', 'zuzyci'] },
  { id: 'klima', label: 'klimatyzacja i ogrzewanie', stems: ['klima', 'dmuch', 'nawiew', 'ogrzew', 'nagrzew'] },
  { id: 'prad', label: 'prąd', stems: ['akumul', 'rozlado', 'ladowa', 'prad', 'bezpiecz', 'napiec'] },
  { id: 'kierownica', label: 'kierownica', stems: ['kierown', 'kierowni', 'skret', 'skrec', 'wspomag'] },
  { id: 'zapach', label: 'zapach', stems: ['zapach', 'smierdz', 'spalenizn', 'smrod'] },
  { id: 'drzwi', label: 'drzwi', stems: ['drzwi', 'klamk', 'zamek', 'zamk'] },
];

// Frazy przepisywane przed podziałem na słowa (zanim „nie” zostanie odrzucone).
const PHRASES = [
  [/\bnie (pali|odpala|zapala|startuje|kreci|zaskakuje|chce odpalic|odpalil)\b/g, ' nieodpala '],
  [/\bcheck engine\b/g, ' kontrolka '],
  [/\bservice engine( soon)?\b/g, ' kontrolka '],
  [/\bbrak mocy\b/g, ' mocy '],
];

const STOPWORDS = new Set(['przy', 'sie', 'mi', 'mnie', 'moj', 'moje', 'moim', 'jest', 'jak', 'gdy', 'kiedy', 'po', 'na', 'w', 'we', 'z', 'ze', 'i', 'a', 'o', 'u', 'do', 'od', 'za', 'nie', 'tak', 'bardzo', 'cos', 'coz', 'auto', 'auta', 'autem', 'samochod', 'samochodu', 'samochodem', 'mam', 'ma', 'mialem', 'czasem', 'czasami', 'troche', 'dziwnie', 'dziwny', 'oraz', 'albo', 'lub', 'tylko', 'jeszcze', 'juz', 'the', 'my', 'chevrolet', 'chevy', 'gmc', 'tahoe', 'suburban', 'gmt400', 'pickup', 'to', 'co', 'czy', 'jak', 'dlaczego', 'czemu']);

const ENDINGS = ['owaniem', 'owania', 'owanie', 'aniem', 'enia', 'enie', 'ania', 'anie', 'ami', 'ach', 'ego', 'emu', 'ymi', 'imi', 'ow', 'om', 'em', 'ie', 'ia', 'y', 'a', 'e', 'i', 'u', 'o', 'ą', 'ę'];

/** Prosty rdzeń słowa: odcina typową końcówkę, zostawia min. 4 znaki. */
export function stem(word) {
  for (const end of ENDINGS) if (word.length - end.length >= 4 && word.endsWith(end)) return word.slice(0, -end.length);
  return word;
}

/** Grupa pojęcia dla słowa (lub null). */
export function conceptOf(word) {
  for (const c of SYMPTOM_CONCEPTS) for (const s of c.stems) {
    if (s.startsWith('=') ? word === s.slice(1) : word.startsWith(s)) return c.id;
  }
  return null;
}

/** Zapytanie → lista „terminów”: pojęcie objawu albo rdzeń słowa. Bez powtórzeń. */
export function parseSymptomQuery(query) {
  let q = ` ${normalizeText(query)} `;
  for (const [re, to] of PHRASES) q = q.replace(re, to);
  const terms = [];
  const seen = new Set();
  for (const word of q.split(' ')) {
    if (!word || STOPWORDS.has(word) || (word.length < 3 && !/^\d/.test(word))) continue;
    const concept = conceptOf(word);
    const term = concept ? { kind: 'concept', key: concept, raw: stem(word) } : { kind: 'word', key: stem(word), raw: stem(word) };
    const id = term.kind + ':' + term.key;
    if (!seen.has(id)) { seen.add(id); terms.push(term); }
  }
  return terms;
}

function fieldIndex(text) {
  const words = normalizeText(text).replace(/\bnie (pali|odpala|zapala|startuje|kreci)\b/g, 'nieodpala').split(' ').filter(Boolean);
  const concepts = new Set();
  for (const w of words) { const c = conceptOf(w); if (c) concepts.add(c); }
  return { words, concepts };
}

/** Indeks wpisów Usterka/Porada (tytuł, Objawy, Opis). */
export function buildSymptomIndex(entries) {
  return (entries || [])
    .filter(e => e && typeof e.Nazwa === 'string' && (e.Typ === 'Usterka' || e.Typ === 'Porada'))
    .map(e => ({ entry: e, fields: [fieldIndex(e.Nazwa), fieldIndex(e.Objawy), fieldIndex(e.Opis)] }));
}

const WEIGHTS = [3, 2, 1];
/** Pojęcia „układu” (gdzie), a nie „objawu” (co) — przy niepełnych trafieniach wygrywa wpis o tym układzie. */
const SYSTEM_CONCEPTS = new Set(['hamowanie', 'skrzynia', 'kierownica', 'klima', 'prad', 'drzwi', 'rozruch']);

function termScore(doc, term) {
  for (let i = 0; i < doc.fields.length; i++) {
    const f = doc.fields[i];
    const hit = term.kind === 'concept' ? f.concepts.has(term.key) : f.words.some(w => w.startsWith(term.key));
    // Dosłowne słowo z zapytania (nie tylko synonim) waży trochę więcej — „nie odpala” przed „po rozruchu”.
    if (hit) return WEIGHTS[i] + (term.kind === 'concept' && f.words.some(w => w.startsWith(term.raw)) ? 0.5 : 0);
  }
  return 0;
}

/**
 * Wyniki: usterki i powiązane porady DIY. Najpierw wpisy pasujące do wszystkich terminów, potem do większości.
 * Przy 2+ terminach wymagamy co najmniej 2 trafień (o ile jakikolwiek wpis je ma).
 */
export function searchSymptoms(index, query, { faults = 5, diy = 4 } = {}) {
  const terms = parseSymptomQuery(query);
  if (!terms.length) return { terms, faults: [], diy: [] };
  const scored = [];
  for (const doc of index) {
    let score = 0, matched = 0;
    for (const t of terms) { const s = termScore(doc, t); if (s) { matched++; score += s; } }
    if (matched) scored.push({ entry: doc.entry, matched, score, system: terms.some(t => t.kind === 'concept' && SYSTEM_CONCEPTS.has(t.key) && doc.fields[0].concepts.has(t.key)) });
  }
  const best = scored.reduce((m, s) => Math.max(m, s.matched), 0);
  const need = terms.length === 1 ? 1 : Math.min(best, Math.max(2, Math.ceil(terms.length * 0.6)));
  const order = (a, b) => b.matched - a.matched || b.score - a.score || a.entry.Nazwa.localeCompare(b.entry.Nazwa, 'pl');
  const kept = scored.filter(s => s.matched >= need).sort(order);
  // Za mało pełnych trafień? Dobierz wpisy, które mają jeden z objawów w tytule (np. ogólny wpis „Hamulce — …”).
  const pick = (typ, limit) => {
    const out = kept.filter(s => s.entry.Typ === typ).slice(0, limit);
    if (out.length < Math.min(3, limit)) {
      const extra = scored.filter(s => s.entry.Typ === typ && s.matched < need && s.score >= WEIGHTS[0]).sort((a, b) => Number(b.system) - Number(a.system) || order(a, b));
      for (const s of extra) { if (out.length >= Math.min(3, limit)) break; out.push(s); }
    }
    return out.map(s => s.entry);
  };
  return { terms, faults: pick('Usterka', faults), diy: pick('Porada', diy) };
}

/** Opisy rozpoznanych objawów do podpowiedzi („rozumiem: stuki · hamowanie”). */
export function termLabels(terms) {
  return terms.map(t => t.kind === 'concept' ? SYMPTOM_CONCEPTS.find(c => c.id === t.key)?.label || t.key : t.key);
}
