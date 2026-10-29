import { buildStatusBody, clientIp, CODE_RE, createLimiter, hashCode } from '@/lib/vin-request.mjs';
import { ensureAuctionData, getStore, json, sameOriginJson, unconfigured } from '@/lib/vin-request-service';
import { POST as vinHits } from '../../vin-hits/route';
import { vinHistoryLinks } from '@/lib/vin-decode.mjs';
import type { AuctionData } from '@/lib/apibara.mjs';

/**
 * Status prośby po kodzie (POST, żeby kod nie trafiał do URL ani logów).
 * Linki do aukcji i liczniki NHTSA są dokładane TYLKO po stronie serwera i TYLKO dla statusu „approved”.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 20;
const limiter = createLimiter({ max: 40, windowMs: 60_000 });

async function loadResults(vin: string, auction: AuctionData) {
  const res = await vinHits(new Request('http://internal/api/vin-hits', { method: 'POST', body: JSON.stringify({ vin }) }));
  const hits = res.ok ? await res.json() : { counts: {}, notes: { nhtsaRecalls: 'NHTSA nie odpowiedziało — liczba nieznana.', nhtsaComplaints: 'NHTSA nie odpowiedziało — liczba nieznana.' }, scope: null };
  return { auction, links: vinHistoryLinks(vin), counts: hits.counts ?? {}, notes: hits.notes ?? {}, scope: hits.scope ?? null, fetchedAt: hits.fetchedAt ?? null };
}

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return json({ error: 'Nieprawidłowe żądanie.' }, 400);
  const store = getStore();
  if (!store) return unconfigured();
  const lim = limiter.take(clientIp(request.headers));
  if (!lim.ok) return json({ error: 'Zbyt wiele odświeżeń. Spróbuj za chwilę.' }, 429, { 'Retry-After': String(lim.retryAfterSec) });
  let code = '';
  try { code = String((await request.json())?.code ?? ''); } catch { return json({ error: 'Nieprawidłowe żądanie.' }, 400); }
  if (!CODE_RE.test(code)) return json({ error: 'Nieprawidłowy kod prośby.' }, 400);
  try {
    const rec = await store.findByCodeHash(hashCode(code));
    if (!rec) return json({ error: 'Nie znaleziono prośby.', status: 'unknown' }, 404);
    return json(await buildStatusBody({ id: rec.id, vin: rec.vin, status: rec.status, createdAt: rec.createdAt },
      // Apibara i NHTSA są pytane WYŁĄCZNIE dla statusu „approved” (loadResults nie jest wywoływane dla pozostałych).
      async vin => loadResults(vin, await ensureAuctionData(store, rec))));
  } catch {
    return json({ error: 'Nie udało się odczytać statusu. Spróbuj ponownie.' }, 502);
  }
}
