import { cookies } from 'next/headers';
import { ID_RE, STATUSES, type RequestStatus } from '@/lib/vin-request.mjs';
import { ADMIN_COOKIE, ensureAuctionData, getStore, isAdmin, json, sameOriginJson, unconfigured } from '@/lib/vin-request-service';

/** Lista próśb i decyzje admina. Każde wywołanie wymaga podpisanego ciasteczka sesji; POST dodatkowo tej samej witryny. */
export const dynamic = 'force-dynamic';
export const maxDuration = 20;
const deny = () => json({ error: 'Brak dostępu.' }, 401);

export async function GET() {
  if (!isAdmin((await cookies()).get(ADMIN_COOKIE)?.value)) return deny();
  const store = getStore();
  if (!store) return unconfigured();
  try {
    const requests = (await store.list(100)).map(({ pageId: _pageId, results, ...r }) => ({ ...r, auctionState: results?.state ?? null }));
    return json({ requests, pending: requests.filter(r => r.status === 'pending').length });
  } catch { return json({ error: 'Nie udało się pobrać listy próśb z Notion.' }, 502); }
}

export async function POST(request: Request) {
  if (!sameOriginJson(request)) return json({ error: 'Nieprawidłowe żądanie.' }, 400);
  if (!isAdmin((await cookies()).get(ADMIN_COOKIE)?.value)) return deny();
  const store = getStore();
  if (!store) return unconfigured();
  let body: { id?: unknown; status?: unknown };
  try { body = await request.json(); } catch { return json({ error: 'Nieprawidłowe żądanie.' }, 400); }
  const id = String(body?.id ?? ''), status = String(body?.status ?? '') as RequestStatus;
  if (!ID_RE.test(id) || !STATUSES.includes(status)) return json({ error: 'Nieprawidłowe dane.' }, 400);
  try {
    const rec = await store.setStatus(id, status);
    if (!rec) return json({ error: 'Nie znaleziono prośby.' }, 404);
    // Po zatwierdzeniu od razu pobieramy dane z Apibara (cache przy prośbie); błąd tu nie cofa zatwierdzenia.
    let auctionState: string | null = rec.results?.state ?? null;
    if (status === 'approved') { try { auctionState = (await ensureAuctionData(store, rec)).state; } catch { /* użytkownik odświeży status */ } }
    const { pageId: _pageId, results: _results, ...pub } = rec;
    return json({ request: { ...pub, auctionState } });
  } catch { return json({ error: 'Nie udało się zapisać decyzji w Notion.' }, 502); }
}
