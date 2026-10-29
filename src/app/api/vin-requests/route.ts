import { after } from 'next/server';
import { clientIp, createLimiter, hashCode, hashIp, IP_LIMIT_PER_HOUR, MAX_PENDING, newRequestCode, publicId, validateVinForRequest } from '@/lib/vin-request.mjs';
import { StoreError } from '@/lib/vin-request-store.mjs';
import { getStore, ipSalt, json, notifyAdmin, sameOriginJson, unconfigured } from '@/lib/vin-request-service';

/** Utworzenie prośby o historię VIN. Zwraca kod prośby (tajny) i status „pending” — NIGDY wyniki. */
export const dynamic = 'force-dynamic';
const perMinute = createLimiter({ max: 6, windowMs: 60_000 });

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return json({ error: 'Nieprawidłowe żądanie.' }, 400);
  const store = getStore();
  if (!store) return unconfigured();
  let body: { vin?: unknown };
  try { body = await request.json(); } catch { return json({ error: 'Nieprawidłowe żądanie.' }, 400); }
  const v = validateVinForRequest(body?.vin);
  if (!v.ok) return json({ error: v.error }, 400);
  const ipHash = hashIp(clientIp(request.headers), ipSalt());
  const quick = perMinute.take(ipHash);
  if (!quick.ok) return json({ error: 'Zbyt wiele prób. Spróbuj za chwilę.' }, 429, { 'Retry-After': String(quick.retryAfterSec) });
  try {
    const recent = await store.countRecentByIp(ipHash, new Date(Date.now() - 3600_000).toISOString());
    if (recent >= IP_LIMIT_PER_HOUR) return json({ error: `Limit próśb: ${IP_LIMIT_PER_HOUR} na godzinę. Spróbuj później.` }, 429, { 'Retry-After': '3600' });
    if (await store.pendingCount() >= MAX_PENDING) return json({ error: 'Zbyt wiele próśb czeka na zatwierdzenie. Spróbuj później.' }, 503);
    const code = newRequestCode(), codeHash = hashCode(code), id = publicId(codeHash);
    const rec = await store.create({ id, vin: v.vin, codeHash, ipHash });
    after(() => notifyAdmin(id, v.vin));
    return json({ code, id, vin: v.vin, status: 'pending', createdAt: rec.createdAt }, 201);
  } catch (e) {
    return json({ error: 'Nie udało się zapisać prośby. Spróbuj ponownie za chwilę.', code: e instanceof StoreError ? e.code : 'store' }, 502);
  }
}
