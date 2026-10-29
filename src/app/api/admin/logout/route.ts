import { cookies } from 'next/headers';
import { ADMIN_COOKIE, json, sameOriginJson } from '@/lib/vin-request-service';

export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  if (!sameOriginJson(request)) return json({ error: 'Nieprawidłowe żądanie.' }, 400);
  (await cookies()).delete(ADMIN_COOKIE);
  return json({ ok: true });
}
