// Wspólna logika wyszukiwarki: aliasy PL/EN, słowa pomijane, „miękkie” nazwy modeli i trasy do poradników.
// Zwykły .mjs, żeby testy Node i komponenty (przez knowledge-index.ts) liczyły wynik identycznie.
// Zasada: alias tylko tam, gdzie słowo jest jednoznaczne. Dwuznaczne słowa (np. „gaz” = pedał gazu)
// trafiają do poradnika przez TRASY (całe frazy), a nie przez rozszerzanie pojedynczego słowa.

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Słowa bez znaczenia dla trafności („auto z usa” → „usa”). Pomijane tylko, gdy zostaje jakieś inne słowo. */
export const STOPWORDS = new Set(['z', 'ze', 'do', 'na', 'w', 'we', 'i', 'o', 'u', 'od', 'po', 'za', 'dla', 'jak', 'co', 'to', 'czy', 'ile', 'jaki', 'jaka', 'jakie', 'auto', 'auta', 'samochod', 'samochodu', 'samochody', 'the', 'for', 'of', 'a', 'in', 'to', 'my']);

/** Nazwy modeli/marek: pasują „na bonus”, nie wymagamy ich w treści, gdy fraza ma też słowo tematyczne
 *  („suburban lpg” → poradnik LPG, który dotyczy całej rodziny GMT400). */
export const MODEL_WORDS = new Set(['chevrolet', 'chevy', 'gmc', 'tahoe', 'suburban', 'silverado', 'sierra', 'yukon', 'blazer', 'k5', 'k1500', 'c1500', 'k2500', 'c2500', 'k3500', 'c3500', 'gmt400', 'obs', 'v8', 'pickup', 'truck']);

/** Przepisywanie całych fraz przed podziałem na słowa (angielskie nazwy → polskie wyrazy z treści). */
export const PHRASE_REWRITES = [
  [/\bblend door\b/g, 'klap temperatur'],
  [/\bheater core\b/g, 'nagrzewnic'],
  [/\bturn signals?\b/g, 'kierunkowskaz'],
  [/\bfuel consumption\b/g, 'spalanie'],
  [/\bfuel economy\b/g, 'spalanie'],
  [/\bgas mileage\b/g, 'spalanie'],
  [/\byellow (license )?plates?\b/g, 'zolte tablice'],
  [/\bhistoric (license )?plates?\b/g, 'zolte tablice'],
  [/\bclassic car\b/g, 'zabytek'],
  [/\btail ?lights?\b/g, 'tylne lampy'],
  [/\bhead ?lights?\b/g, 'reflektory'],
  [/\bautomatic transmission\b/g, 'skrzynia'],
  [/\bcheck engine\b/g, 'kontrolka silnika'],
];

/** Grupy równoważnych słów (po normalizacji, dopasowanie przez „zawiera”). */
export const SYNONYM_GROUPS = [
  ['sprowadzenie', 'sprowadzic', 'sprowadzenia', 'sprowadzony', 'sprowadzone', 'import', 'importu', 'importowany'],
  ['kierunkowskaz', 'migacz', 'migacze'],
  ['reflektor', 'reflektory', 'lampa przednia'],
  ['rdza', 'rdz', 'korozja', 'korozji', 'zardzewi', 'rust'],
  ['zabytek', 'zabytkow', 'zabytku', 'historyczn'],
  ['olej', 'oleju', 'oil'],
  ['skrzynia', 'skrzyni', 'transmission', 'automat'],
  ['hamulec', 'hamulce', 'hamulcowy', 'hamulcowe', 'brake', 'brakes'],
  ['chlodnica', 'chlodzenie', 'radiator', 'cooling'],
  ['wyciek', 'wycieka', 'przeciek', 'leak'],
  ['przeglad', 'badanie techniczne', 'oskp', 'skp'],
  ['usa', 'amerykan'],
];

/** Słowa, przy których wpisy bez trasy to szum („spalanie stukowe” w kodach błędów ≠ zużycie paliwa). */
const ROUTED_ONLY_WORDS = new Set(['spalanie', 'spalania', 'zuzycie', 'paliwa', 'paliwo', 'mpg', 'l', '100', 'fuel', 'consumption', 'economy', 'km']);

const synonymIndex = new Map();
for (const group of SYNONYM_GROUPS) for (const word of group) synonymIndex.set(word, group);

/** Trasy: fraza (regexp na znormalizowanym tekście) → poradnik, który ma wylądować na pierwszym miejscu. */
export const GUIDE_ROUTES = [
  { id: '/dla-wlasciciela/lpg', test: /\b(lpg|autogaz\w*|autogas\w*|propan\w*|gazow\w*|gaz do|gaz w|gaz na|instalacj\w* gaz\w*|dual ?fuel|stag|prins|impco)\b/, boost: 1000 },
  { id: '/dla-wlasciciela/lpg', test: /\bgaz\b/, boost: 600 },
  { id: '/dla-wlasciciela/lpg', test: /\b(spalani\w*|zuzyci\w* paliw\w*|mpg|l\/100|fuel economy|fuel consumption|gas mileage)\b/, boost: 300, only: true },
  // Wpis Notion o spalaniu (Porada „Spalanie GMT400 — ile pali…”) ma wyprzedzać poradnik LPG; dopasowanie po tytule, nie po id Notion.
  { titleTest: /^spalanie gmt400\b/, test: /\b(spalani\w*|zuzyci\w* paliw\w*|mpg|l\/100|fuel economy|fuel consumption|gas mileage|ile pali\w*)\b/, boost: 1200, only: true },
  { id: '/dla-wlasciciela/import', test: /\b(akcyz\w*|cl[oa]|sprowadz\w*|import\w*|recykling\w*|pierwsz\w* przeglad)\b/, boost: 700 },
  { id: '/dla-wlasciciela/import', test: /\busa\b/, boost: 400 },
  { id: '/dla-wlasciciela/import', test: /\bhomologacj\w*/, boost: 400, gap: 'homologacja' },
  { id: '/dla-wlasciciela/import', test: /\bpickup\b.*\b(ciezar\w*|vat|n1)\b|\b(ciezar\w*|n1)\b.*\bpickup\b/, boost: 700 },
  { id: '/dla-wlasciciela/swiatla-eu', test: /\b(kierunkowskaz\w*|migacz\w*|lamp\w* usa|swiatl\w* usa|przerobk\w* (lamp|swiatel|swiatla|reflektor\w*)|reflektor\w* (eu|usa)|swiatla eu|zielona zarowka|e-?code|tylne lampy|lampy tylne|przeciwmglow\w*|swiatla stop)\b/, boost: 900 },
  { id: '/dla-wlasciciela/zolte-tablice', test: /\b(zolt\w* tablic\w*|tablic\w* zabytk\w*|zabytk\w*|zabytek|oldtimer|wuoz|biala karta|25 lat)\b/, boost: 900 },
];

/** Gdy trasa oznaczona `gap` jest trafiona, UI pokazuje uczciwą notkę o niepełnej treści. */
export const GAP_NOTES = {
  homologacja: 'Poradnik o imporcie nie opisuje osobno homologacji ani świadectwa zgodności — jest w nim badanie techniczne przed rejestracją i opłaty. Ścieżkę homologacji potwierdź w stacji kontroli lub wydziale komunikacji.',
};

function expandToken(token) {
  const group = synonymIndex.get(token);
  return group ? [...new Set([token, ...group])] : [token];
}

/** Przygotowuje zapytanie: grupy słów twardych (AND), słowa miękkie (bonus), trasy do poradników. */
export function prepareQuery(query) {
  let normalized = normalizeSearch(query);
  const routes = [];
  let note = null;
  let only = false;
  for (const route of GUIDE_ROUTES) {
    if (route.test.test(normalized) && (!route.requires || route.requires.test(normalized))) {
      routes.push(route);
      if (route.gap && !note) note = route.gap;
      if (route.only) only = true;
    }
  }
  for (const [pattern, replacement] of PHRASE_REWRITES) normalized = normalized.replace(pattern, replacement);
  const all = [...new Set(normalized.split(/[^a-z0-9]+/).filter(Boolean))];
  const meaningful = all.filter(token => !STOPWORDS.has(token));
  const base = meaningful.length ? meaningful : all;
  const topical = base.filter(token => !MODEL_WORDS.has(token));
  const hardTokens = topical.length ? topical : base;
  const softTokens = topical.length ? base.filter(token => MODEL_WORDS.has(token)) : [];
  const routedOnly = (Boolean(note) || only) && hardTokens.every(token => ROUTED_ONLY_WORDS.has(token));
  return {
    routedOnly,
    normalized,
    tokens: all,
    hard: hardTokens.map(expandToken),
    soft: softTokens,
    routes,
    note: note ? GAP_NOTES[note] : null,
    gap: note,
  };
}

/** Wynik 0 = brak dopasowania. `id` = href || id dokumentu. */
export function scoreDocument(prepared, { title, body, id }) {
  if (prepared.normalized.length < 2 || !prepared.tokens.length) return 0;
  const t = normalizeSearch(title);
  const b = normalizeSearch(body);
  let score = 0;
  let matched = true;
  for (const group of prepared.hard) {
    if (group.some(word => t.includes(word))) score += 10;
    else if (group.some(word => b.includes(word))) score += 1;
    else { matched = false; break; }
  }
  if (matched) {
    for (const word of prepared.soft) score += t.includes(word) ? 4 : b.includes(word) ? 2 : 0;
    if (t === prepared.normalized) score += 200;
    else if (t.startsWith(prepared.normalized)) score += 100;
  }
  const boost = prepared.routes.filter(route => route.id === id || (route.titleTest && route.titleTest.test(t))).reduce((max, route) => Math.max(max, route.boost), 0);
  if (boost) return Math.max(score, 1) + boost;
  if (!matched || prepared.routedOnly) return 0;
  // Poradniki to centralne strony tematów — przy zwykłym dopasowaniu wyprzedzają pojedyncze wpisy.
  return String(id).startsWith('/dla-wlasciciela/') ? score + 15 : score;
}
