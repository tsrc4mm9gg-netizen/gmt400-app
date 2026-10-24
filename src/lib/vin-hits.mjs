/**
 * Liczniki „ile jest informacji” w sekcji „Zdjęcia i historia tego VIN”.
 *
 * Zasada: liczbę pokazujemy tylko ze źródła, które udostępnia ją legalnie i bez captchy (oficjalne API).
 * Gdy źródło nie daje liczby albo zapytanie się nie uda — `count: null` („sprawdź”), NIGDY 0.
 * 0 pokazujemy tylko, gdy źródło wprost zwróciło pustą listę.
 *
 * Wynik feasibility (24.10.2026):
 * - NHTSA recalls / complaints (api.nhtsa.gov) — oficjalne, darmowe API → liczymy (dla rocznika + modelu, nie egzemplarza).
 * - Google / Google Grafika — brak darmowego legalnego API do liczby wyników (Custom Search JSON API wymaga klucza
 *   i jest zamknięte dla nowych klientów); scrapowania Google nie robimy.
 * - bidfax.info, autoastat.com — Cloudflare „Just a moment” (HTTP 403, cf-mitigated: challenge) nawet dla robots.txt.
 * - poctra.com — HTTP 403 ze stroną captcha.
 * - cararam.com — czysta strona /en/vin/{VIN} z liczbą aukcji, robots.txt pozwala, ale regulamin zabrania
 *   automatycznego pobierania („scrape, harvest… by automated means”) → tylko link, bez liczby.
 * - CARFAX — robots.txt blokuje /*vin= i /VehicleHistory/; raport płatny.
 * - AutoCheck — formularz z reCAPTCHA. VinAudit — Cloudflare Turnstile; API tylko z płatnym kluczem.
 * - NICB VINCheck — reCAPTCHA + Cloudflare.
 */

export const NOT_COUNTABLE_REASON = {
  google: 'Google nie udostępnia darmowego API z liczbą wyników, a scrapowania nie robimy.',
  bidfax: 'Strona chroniona Cloudflare (wyzwanie antybotowe) — liczby nie da się pobrać zgodnie z zasadami.',
  poctra: 'Strona zwraca captchę — liczby nie da się pobrać zgodnie z zasadami.',
  autoastat: 'Strona chroniona Cloudflare (wyzwanie antybotowe) — liczby nie da się pobrać zgodnie z zasadami.',
  cararam: 'Regulamin serwisu zabrania automatycznego pobierania — tylko link.',
  carfax: 'Raport płatny; robots.txt blokuje zapytania z VIN.',
  autocheck: 'Raport płatny; formularz z reCAPTCHA.',
  vinaudit: 'Raport płatny; formularz z Cloudflare Turnstile, API tylko z płatnym kluczem.',
  nicb: 'Formularz z reCAPTCHA.',
};

const FULL_SIZE = /^(C\/K( SERIES)?|[CK](10|15|20|25|30|35|1500|2500|3500)( PICKUP)?|C SERIES\(LIGHT\)|1500|2500|3500|CREW CAB|FLEETSIDE|SPORTSIDE|CHEYENNE|SCOTTSDALE)$/;
const GMT400_ONLY_TO_1998 = /^(SILVERADO|SIERRA( PU| [123]500)?)$/; // od 1999 te nazwy w NHTSA to głównie GMT800

/**
 * Nazwy modeli NHTSA (z /products/vehicle/models dla marki i rocznika), które opisują tę samą platformę.
 * NHTSA zapisuje te same auta pod różnymi nazwami (C/K, K1500, K15, SIERRA…) — bierzemy tylko jednoznaczne.
 */
export function selectNhtsaModels(models, { platform, year }) {
  const y = Number(year);
  const names = [...new Set((models || []).filter(m => typeof m === 'string').map(m => m.trim().toUpperCase()))];
  const pick = re => names.filter(n => re.test(n));
  if (platform === 'C/K') return pick({ test: n => FULL_SIZE.test(n) || (y <= 1998 && GMT400_ONLY_TO_1998.test(n)) }).sort();
  if (platform === 'Suburban') return pick(/^SUBURBAN( [CK]?(10|15|20|25|1500|2500))?$/).sort();
  if (platform === 'Tahoe') return pick(/^TAHOE$/).sort();
  if (platform === 'Yukon') return pick(/^YUKON$/).sort();
  return [];
}

/** Liczba unikalnych rekordów (ta sama kampania/skarga pod kilkoma nazwami modelu liczy się raz). */
export function uniqueCount(lists, key) {
  const ids = new Set();
  for (const list of lists) for (const r of list || []) { const id = r?.[key]; if (id !== undefined && id !== null && id !== '') ids.add(String(id)); }
  return ids.size;
}

/** Etykieta liczby dla UI: liczba albo null (= „sprawdź”, nigdy 0 z braku danych). */
export function badgeText(count) {
  return typeof count === 'number' && Number.isInteger(count) && count >= 0 ? (count > 999 ? '999+' : String(count)) : null;
}

/** Kolejność: najpierw źródła z wynikami (malejąco), potem „sprawdź”, na końcu zera. Stabilna dla remisów. */
export function sortByHits(items, counts) {
  const rank = it => { const c = counts?.[it.id]; return typeof c === 'number' ? (c > 0 ? 0 : 2) : 1; };
  return items.map((it, i) => ({ it, i })).sort((a, b) => rank(a.it) - rank(b.it) || (rank(a.it) === 0 ? counts[b.it.id] - counts[a.it.id] : 0) || a.i - b.i).map(x => x.it);
}
