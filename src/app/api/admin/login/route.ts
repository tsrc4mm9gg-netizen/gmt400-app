import { cookies } from 'next/headers';
import { clientIp, createLimiter, signSession } from '@/lib/vin-request.mjs';
import { ADMIN_COOKIE, adminConfigured, checkPassword, json, sameOriginJson } from '@/lib/vin-request-service';

export const dynamic = 'force-dynamic';
const limiter = createLimiter({ max: 5, windowMs: 15 * 60_000 });

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return json({ error: 'Nieprawidłowe żądanie.' }, 400);
  if (!adminConfigured()) return json({ error: 'Panel nie jest skonfigurowany (brak ADMIN_PASSWORD w środowisku).' }, 503);
  const ip = clientIp(request.headers);
  const lim = limiter.take(ip);
  if (!lim.ok) return json({ error: 'Zbyt wiele prób logowania. Spróbuj za kilkanaście minut.' }, 429, { 'Retry-After': String(lim.retryAfterSec) });
  let password: unknown;
  try { password = (await request.json())?.password; } catch { return json({ error: 'Nieprawidłowe żądanie.' }, 400); }
  if (!checkPassword(password)) {
    await new Promise(r => setTimeout(r, 600));
    return json({ error: 'Nieprawidłowe hasło.' }, 401);
  }
  limiter.reset(ip);
  (await cookies()).set(ADMIN_COOKIE, signSession(process.env.ADMIN_PASSWORD as string), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 3600 });
  return json({ ok: true });
}
