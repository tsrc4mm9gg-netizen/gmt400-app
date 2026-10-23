// Dopasowanie materiałów do zapisanego auta (strona „Mój samochód”).
// Zasada: pokazujemy jako „pasuje” tylko to, co wynika z metadanych materiału (model + lata).
// Brak lub nieczytelny zakres → „do sprawdzenia”, nigdy zgadywanie.
import { matchesYearRules } from './year-range.mjs';

const norm = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/gi, 'l').toLowerCase();
const GENERAL = /\b(wszystkie|all)\b/;
const CK_MODELS = ['c1500', 'k1500', 'c2500', 'k2500', 'c3500', 'k3500'];
const MODEL_WORDS = ['c/k', 'pickup', 'sierra', 'tahoe', 'blazer', 'yukon', 'suburban', 'dually', '3500hd', ...CK_MODELS];
const ENGINE_CODES = /\b(L0[35]|L19|L29|L3[015]|L56|L65|LB4|LH6|LL4)\b/g;

/** Słowa, którymi materiały opisują dane nadwozie. */
export function platformWords(profile) {
  if (!profile?.platform) return [];
  switch (profile.platform) {
    case 'C/K': return ['c/k', 'pickup', 'dually', '3500hd', ...CK_MODELS, ...(profile.brand === 'GMC' ? ['sierra'] : [])];
    case 'Sierra': return ['sierra', 'c/k', 'pickup', 'dually', '3500hd', ...CK_MODELS];
    case 'Tahoe': return ['tahoe', 'blazer'];
    case 'Yukon': return ['yukon'];
    case 'Suburban': return ['suburban'];
    default: return [];
  }
}

const hasWord = (text, word) => {
  const i = text.indexOf(word);
  if (i < 0) return false;
  const before = text[i - 1], after = text[i + word.length];
  const sep = ch => ch === undefined || !/[a-z0-9]/.test(ch);
  return sep(before) && sep(after);
};

/** Dopasowanie modelu na podstawie tekstów zakresu (np. ["Wszystkie"], ["Tahoe 4-drzwi"], "C/K 1500"). */
export function modelFit(texts, profile) {
  const list = (Array.isArray(texts) ? texts : [texts]).map(norm).filter(Boolean);
  if (!list.length) return 'unknown';
  if (list.some(t => GENERAL.test(t))) return 'general';
  const own = platformWords(profile);
  const mentioned = list.some(t => MODEL_WORDS.some(w => hasWord(t, w)));
  if (!mentioned) return 'unknown';
  return list.some(t => own.some(w => hasWord(t, w))) ? 'match' : 'outside';
}

/** Lata z początku opisowego zakresu, np. „1996–1999 (7.4 L29 VIN J)” → [1996, 1999]. */
export function leadingYears(rule) {
  const text = String(rule ?? '').trim();
  let m = text.match(/^(19\d\d|20\d\d)\s*[–—-]\s*(19\d\d|20\d\d)(?![\d])/);
  if (m) return [Number(m[1]), Number(m[2])];
  m = text.match(/^(19\d\d|20\d\d)\s*\+/);
  if (m) return [Number(m[1]), 9999];
  m = text.match(/^(19\d\d|20\d\d)(?![\d–—-])/);
  if (m) return [Number(m[1]), Number(m[1])];
  return null;
}

/** Dopasowanie rocznika: 'match' | 'outside' | 'unknown' | 'general'. */
export function yearFit(rules, year) {
  const list = (Array.isArray(rules) ? rules : [rules]).filter(r => typeof r === 'string' && r.trim());
  if (!list.length) return 'unknown';
  if (list.some(r => GENERAL.test(norm(r)))) return 'general';
  if (!/^\d{4}$/.test(String(year ?? ''))) return 'unknown';
  const strict = matchesYearRules(String(year), list);
  if (strict === true) return 'match';
  if (strict === false) return 'outside';
  const y = Number(year);
  const results = list.map(rule => { const r = leadingYears(rule); return r ? y >= r[0] && y <= r[1] : null; });
  if (results.includes(true)) return 'match';
  return results.includes(null) ? 'unknown' : 'outside';
}

/** Kody silników RPO wymienione w tytule. */
export function engineCodesIn(text) {
  return [...new Set(String(text ?? '').toUpperCase().match(ENGINE_CODES) ?? [])];
}

const combine = parts => parts.includes('outside') ? 'outside' : parts.includes('unknown') ? 'unknown' : parts.includes('match') ? 'match' : 'general';

const LITERS = /(?:^|[^\d.,])(4[.,]3|5[.,]0|5[.,]7|6[.,]0|6[.,]2|6[.,]5|7[.,]4)\s*l(?![a-z])/gi;
/** Pojemności (np. „6.5L”, „7,4 l”) wymienione w tekście. */
export function litersIn(text) {
  return [...new Set([...String(text ?? '').matchAll(LITERS)].map(m => m[1].replace(',', '.')))];
}

/** Tytuł: marka, model i tonaż wymienione wprost (np. „GMC Sierra 2500”, „C/K 3500 Dually”). */
export function titleFit(title, profile) {
  const text = norm(title);
  if (!profile?.brand) return 'general';
  const otherBrand = profile.brand === 'GMC' ? 'chevrolet' : 'gmc';
  if (hasWord(text, otherBrand) && !hasWord(text, norm(profile.brand))) return 'outside';
  const mentioned = MODEL_WORDS.filter(w => hasWord(text, w));
  if (mentioned.length && !mentioned.some(w => platformWords(profile).includes(w))) return 'outside';
  const ton = String(profile.model ?? '').match(/(1500|2500|3500)/)?.[1];
  const tons = [...new Set(text.match(/\b(1500|2500|3500)\b/g) ?? [])];
  if (ton && tons.length && !tons.includes(ton)) return 'outside';
  return 'general';
}

/** Silnik: kody RPO i pojemności w tytule vs silnik zapisany w profilu. */
export function engineFit(title, profile, engineLiters) {
  const codes = engineCodesIn(title);
  const liters = litersIn(title);
  if (!codes.length && !liters.length) return { engine: 'general', engines: [] };
  const mentioned = [...codes, ...liters.map(l => `${l} l`)];
  const own = String(profile?.engine ?? '').toUpperCase();
  if (!own) return { engine: 'unknown', engines: mentioned };
  if (codes.length) return { engine: codes.includes(own) ? 'match' : 'outside', engines: mentioned };
  if (!engineLiters) return { engine: 'unknown', engines: mentioned };
  return { engine: liters.includes(engineLiters) ? 'match' : 'outside', engines: mentioned };
}

/** Materiał z bazy (Notion): model + lata z metadanych, a marka/model/silnik z tytułu. */
export function knowledgeFit(item, profile, engineLiters) {
  const rules = item?.applicability;
  const modelTexts = [...(rules?.model ?? []), ...(Array.isArray(item?.Modele) ? item.Modele : [])];
  const years = rules?.years?.length ? rules.years : item?.Lata ? [item.Lata] : [];
  const model = modelFit(modelTexts, profile);
  const year = !years.length && model === 'general' ? 'general' : yearFit(years, profile?.year);
  const title = titleFit(item?.Nazwa, profile);
  const { engine, engines } = engineFit(item?.Nazwa, profile, engineLiters);
  return { fit: combine([model, year, title, engine]), model, year, title, engine, engines };
}

/** Tekst zakresu (np. „Suburban 1999 i Tahoe 1999 …”). */
export function scopeTextFit(scope, profile) {
  const [positive, ...excluded] = String(scope ?? '').split(/nie dotyczy/i);
  const text = positive;
  const excludedOwn = excluded.some(part => platformWords(profile).some(w => hasWord(norm(part), w)));
  const model = excludedOwn ? 'outside' : modelFit([text], profile);
  const years = [...text.matchAll(/(19\d\d|20\d\d)(?:\s*[–—-]\s*(19\d\d|20\d\d))?/g)].map(m => [Number(m[1]), Number(m[2] ?? m[1])]);
  let year = 'unknown';
  if (years.length && /^\d{4}$/.test(String(profile?.year ?? ''))) { const y = Number(profile.year); year = years.some(([a, b]) => y >= a && y <= b) ? 'match' : 'outside'; }
  return { fit: combine([model, year]), model, year };
}

/** Część z PART_FITMENTS: lata + model z uwzględnieniem tonażu (1500/2500/3500). */
export function partFit(part, profile) {
  const y = Number(profile?.year);
  const year = !/^\d{4}$/.test(String(profile?.year ?? '')) ? 'unknown' : (y >= part.yearRange[0] && y <= part.yearRange[1] ? 'match' : 'outside');
  const own = platformWords(profile);
  const ton = String(profile?.model ?? '').match(/(1500|2500|3500)/)?.[1];
  const fits = part.fitsModels.some(raw => {
    const text = norm(raw);
    if (!own.some(w => hasWord(text, w))) return false;
    const partTon = text.match(/(1500|2500|3500)/)?.[1];
    return !partTon || !ton || partTon === ton;
  });
  return { fit: combine([fits ? 'match' : 'outside', year]), year, model: fits ? 'match' : 'outside' };
}
