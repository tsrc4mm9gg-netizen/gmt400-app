import { NextResponse } from 'next/server';
import { createNotionStore, storeConfig, type VinRequestStore } from './vin-request-store.mjs';
import { passwordMatches, verifySession } from './vin-request.mjs';
import { fetchAuctionData, needsRefresh, type AuctionData } from './apibara.mjs';

export const ADMIN_COOKIE = 'gmt400_admin';
export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', ...headers } });

/** Magazyn albo null, gdy brakuje NOTION_TOKEN / NOTION_VIN_REQUESTS_DB — wtedy wszystko działa „fail closed” (503). */
export function getStore(): VinRequestStore | null {
  const cfg = storeConfig();
  return cfg ? createNotionStore(cfg) : null;
}
export const unconfigured = () => json({ error: 'Historia VIN jest chwilowo niedostępna (usługa nie jest jeszcze skonfigurowana).', code: 'unconfigured' }, 503);

/** POST musi pochodzić z tej samej witryny i mieć JSON (blokuje CSRF z innych domen). */
export function sameOriginJson(request: Request): boolean {
  if (!/^application\/json\b/i.test(request.headers.get('content-type') || '')) return false;
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try { return !!host && new URL(origin).host === host; } catch { return false; }
}

export function adminConfigured() { return !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8; }
export function isAdmin(cookieValue: string | undefined) { return adminConfigured() && verifySession(process.env.ADMIN_PASSWORD, cookieValue); }
export function checkPassword(given: unknown) { return adminConfigured() && passwordMatches(given, process.env.ADMIN_PASSWORD); }
export const ipSalt = () => process.env.ADMIN_PASSWORD || 'gmt400';

/** Powiadomienie admina przez webhook (VIN_REQUEST_WEBHOOK_URL: Slack/Discord/ntfy…); brak zmiennej = brak powiadomienia. */
export async function notifyAdmin(id: string, vin: string) {
  const url = process.env.VIN_REQUEST_WEBHOOK_URL;
  if (!url || !/^https:\/\//i.test(url)) return;
  const message = `Nowa prośba o historię VIN ${id} (${vin}). Zatwierdź lub odrzuć: https://www.gmt400.pl/admin/historia-vin`;
  try { await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: message, content: message }), signal: AbortSignal.timeout(4000) }); } catch { /* powiadomienie jest dodatkiem — prośba i tak jest zapisana */ }
}

/**
 * Dane aukcyjne Apibara dla zatwierdzonej prośby: cache przy prośbie (Notion, kolumna „Wyniki”).
 * Zapytanie do Apibara tylko gdy brak zapisu, minął tydzień albo wcześniejszy błąd jest starszy niż 10 min — oszczędza limit (plan darmowy: 100/mies.).
 * Klucz APIBARA_API_KEY jest czytany tylko tutaj, po stronie serwera, i nigdy nie jest zwracany ani logowany.
 */
export async function ensureAuctionData(store: VinRequestStore, rec: { pageId: string; vin: string; results: AuctionData | null }, fetchImpl: typeof fetch = fetch): Promise<AuctionData> {
  if (rec.results && !needsRefresh(rec.results)) return rec.results;
  const fresh = await fetchAuctionData(rec.vin, { apiKey: process.env.APIBARA_API_KEY, fetchImpl });
  if (fresh.state === 'unconfigured' && rec.results) return rec.results;
  try { await store.setResults(rec.pageId, fresh); } catch { /* cache jest dodatkiem — wynik i tak wracamy użytkownikowi */ }
  return fresh;
}
