// Klient Apibara.tech (Copart + IAAI) — WYŁĄCZNIE po stronie serwera; klucz z APIBARA_API_KEY nigdy nie trafia do przeglądarki ani do logów.
// Dokumentacja: https://apibara.tech/en/products/vehicle-auction-data-api/docs · kontrakt: https://apibara.tech/openapi/v1.json
// Jedno zapytanie na VIN: GET /vehicles/{vin}?include=history,vin_lots (nagłówek X-API-Key). Plan darmowy = 100 zapytań/mies., więc wynik jest cache'owany.
// Zdjęć NIE pobieramy ani nie pokazujemy: warunki Apibara (Terms, 27.10.2026) nie dają prawa do ich publikacji — zostaje liczba zdjęć i link do aukcji.
export const APIBARA_BASE = 'https://apibara.tech/api/v1/vehicle-auction';
export const RESULTS_TTL_MS = 7 * 24 * 3600 * 1000; // „techniczny cache” — po tygodniu dane są pobierane na nowo
export const RETRY_ERROR_AFTER_MS = 10 * 60 * 1000; // po błędzie/limicie nie ponawiamy częściej niż co 10 min

const str = (v, max = 120) => (typeof v === 'string' || typeof v === 'number') && String(v).trim() ? String(v).trim().slice(0, max) : null;
const num = v => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);
const date = v => { const s = str(v, 40); return s && /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null; };
const platform = v => (v === 'copart' || v === 'iaai' ? v : null);

/** Znormalizowane, ograniczone dane (bez zdjęć). Brak pola = null — nigdy 0 w zastępstwie „nieznane”. */
export function normalizeVehicle(data) {
  if (!data || typeof data !== 'object') return null;
  const cond = data.condition && typeof data.condition === 'object' ? data.condition : {};
  const pr = data.pricing && typeof data.pricing === 'object' ? data.pricing : {};
  const au = data.auction && typeof data.auction === 'object' ? data.auction : {};
  const od = data.odometer && typeof data.odometer === 'object' ? data.odometer : {};
  const media = data.media && typeof data.media === 'object' ? data.media : {};
  const damage = [str(data.damage) ?? str(cond.primary_damage), str(cond.secondary_damage)].filter(Boolean);
  return {
    platform: platform(data.platform), lot: str(data.lot_number, 20), title: str(data.title, 160), year: num(data.year), make: str(data.make, 40), model: str(data.model, 60),
    damage: damage.length ? damage.join(' + ') : null, lossType: str(cond.loss_type), run: str(cond.run_cond ?? cond.run_condition),
    odometerMi: num(od.mi), odometerKm: num(od.km),
    outcome: str(au.outcome_status) ?? str(au.last_sold_status), auctionAt: date(au.auction_at), state: str(au.state, 30),
    priceUsd: { sale: num(pr.sale_price_usd), lastSold: num(pr.last_sold_price_usd), currentBid: num(pr.current_bid_usd), buyNow: num(pr.buy_now_usd), estimatedRetail: num(pr.estimated_retail_value_usd) },
    photoCount: num(media.images_count) ?? num(media.thumbs_count),
  };
}
export function normalizeHistory(list) {
  return (Array.isArray(list) ? list : []).slice(0, 40).map(h => ({ platform: platform(h?.platform), lot: str(h?.lot_number, 20), date: date(h?.date), priceUsd: num(h?.price), status: str(h?.status, 60) }));
}
export function normalizeOtherLots(list) {
  return (Array.isArray(list) ? list : []).slice(0, 20).map(l => ({
    platform: platform(l?.platform), lot: str(l?.lot_number, 20), title: str(l?.title, 160), outcome: str(l?.auction?.outcome_status) ?? str(l?.auction?.last_sold_status), auctionAt: date(l?.auction?.auction_at),
    priceUsd: { sale: num(l?.pricing?.sale_price_usd), lastSold: num(l?.pricing?.last_sold_price_usd), currentBid: num(l?.pricing?.current_bid_usd) },
  }));
}

/**
 * Pobranie danych. Zwraca { state, fetchedAt, ... }:
 *  ok — są rekordy · empty — źródło nic nie ma (404 / puste) · quota — 429 · error — 401/403/5xx/timeout/zły format · unconfigured — brak klucza.
 */
export async function fetchAuctionData(vin, { apiKey, fetchImpl = fetch, now = () => new Date().toISOString(), timeoutMs = 9000 } = {}) {
  const fetchedAt = now();
  if (!apiKey) return { state: 'unconfigured', fetchedAt };
  let res;
  try {
    res = await fetchImpl(`${APIBARA_BASE}/vehicles/${encodeURIComponent(vin)}?include=history,vin_lots`, {
      headers: { Accept: 'application/json', 'X-API-Key': apiKey }, cache: 'no-store', signal: AbortSignal.timeout(timeoutMs),
    });
  } catch { return { state: 'error', fetchedAt, reason: 'timeout' }; }
  if (res.status === 404) return { state: 'empty', fetchedAt };
  if (res.status === 429) return { state: 'quota', fetchedAt };
  if (res.status === 401 || res.status === 403) return { state: 'error', fetchedAt, reason: 'auth' };
  if (!res.ok) return { state: 'error', fetchedAt, reason: 'http-' + res.status };
  const body = await res.json().catch(() => null);
  const data = body?.data;
  if (!data || typeof data !== 'object') return { state: 'error', fetchedAt, reason: 'format' };
  const vehicle = normalizeVehicle(data), history = normalizeHistory(data.history), otherLots = normalizeOtherLots(data.vin_lots);
  const hasAny = !!(vehicle && (vehicle.lot || vehicle.title)) || history.length > 0 || otherLots.length > 0;
  if (!hasAny) return { state: 'empty', fetchedAt };
  return { state: 'ok', fetchedAt, vehicle, history, otherLots };
}

/** Czy zapisany wynik trzeba pobrać ponownie (brak, wygasł TTL albo wcześniejszy błąd starszy niż 10 min). */
export function needsRefresh(results, nowMs = Date.now()) {
  if (!results || typeof results !== 'object' || !results.fetchedAt) return true;
  const age = nowMs - Date.parse(results.fetchedAt);
  if (!Number.isFinite(age)) return true;
  if (results.state === 'ok' || results.state === 'empty') return age > RESULTS_TTL_MS;
  return age > RETRY_ERROR_AFTER_MS;
}

/** Link do aukcji tylko tam, gdzie format jest w dokumentacji (Copart: /lot/<numer>). */
export const lotUrl = (platformName, lot) => (platformName === 'copart' && lot && /^\d{5,10}$/.test(lot) ? `https://www.copart.com/lot/${lot}` : null);
