import { NextResponse } from 'next/server';
import { decodeVin, profileFromVin } from '@/lib/vin-decode.mjs';
import { selectNhtsaModels, uniqueCount } from '@/lib/vin-hits.mjs';

/**
 * Liczniki dla sekcji „Zdjęcia i historia tego VIN”.
 * VIN przychodzi metodą POST (nie trafia do URL ani do cache). Na zewnątrz wysyłamy tylko markę, rocznik i nazwę
 * modelu (NHTSA) — te odpowiedzi cache'ujemy 24 h. Błąd/timeout źródła → count: null („sprawdź”), nigdy 0.
 */
export const maxDuration = 20;
const TIMEOUT_MS = 4500;
const DAY = 86400;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

async function nhtsa(path: string, params: Record<string, string>) {
  const url = new URL('https://api.nhtsa.gov/' + path);
  url.search = new URLSearchParams(params).toString();
  const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS), next: { revalidate: DAY } });
  const raw = await res.json().catch(() => null);
  const list = raw?.results ?? raw?.Results;
  // recallsByVehicle odpowiada HTTP 400 z {"Count":0,"Message":"Results returned successfully","results":[]}, gdy nie ma kampanii —
  // to jest jednoznaczne „0”. Każdy inny błąd HTTP → wyjątek → liczba nieznana.
  const emptyOk = res.status === 400 && Array.isArray(list) && list.length === 0 && raw?.Count === 0 && /returned successfully/i.test(String(raw?.Message ?? ''));
  if (!res.ok && !emptyOk) throw new Error('HTTP ' + res.status);
  if (!Array.isArray(list)) throw new Error('schema');
  return list as Record<string, unknown>[];
}

type Count = { count: number | null; models: string[]; error?: string };
async function countNhtsa(kind: 'r' | 'c', make: string, year: string, platform: string): Promise<Count> {
  try {
    const models = selectNhtsaModels((await nhtsa('products/vehicle/models', { modelYear: year, make, issueType: kind })).map(m => m.model), { platform, year });
    if (!models.length) return { count: null, models, error: 'NHTSA nie ma jednoznacznej nazwy modelu dla tego rocznika.' };
    const path = kind === 'r' ? 'recalls/recallsByVehicle' : 'complaints/complaintsByVehicle';
    const lists = await Promise.all(models.map(model => nhtsa(path, { make, model, modelYear: year })));
    return { count: uniqueCount(lists, kind === 'r' ? 'NHTSACampaignNumber' : 'odiNumber'), models };
  } catch {
    return { count: null, models: [], error: 'NHTSA nie odpowiedziało na czas — liczba nieznana.' };
  }
}

export async function POST(request: Request) {
  let vin = '';
  try { vin = String((await request.json())?.vin ?? ''); } catch { return json({ error: 'Nieprawidłowe żądanie.' }, 400); }
  const result = decodeVin(vin);
  if (!result.ok) return json({ error: 'Nieprawidłowy VIN.' }, 400);
  const p = profileFromVin(result);
  const counts: Record<string, number | null> = { nhtsaRecalls: null, nhtsaComplaints: null };
  const notes: Record<string, string> = {};
  let models: string[] = [];
  if (p?.brand && p.year && p.platform && result.yearInRange) {
    const [r, c] = await Promise.all([countNhtsa('r', p.brand, p.year, p.platform), countNhtsa('c', p.brand, p.year, p.platform)]);
    counts.nhtsaRecalls = r.count; counts.nhtsaComplaints = c.count;
    if (r.error) notes.nhtsaRecalls = r.error;
    if (c.error) notes.nhtsaComplaints = c.error;
    models = [...new Set([...r.models, ...c.models])].sort();
  } else {
    notes.nhtsaRecalls = notes.nhtsaComplaints = 'Nie rozpoznano marki, rocznika lub nadwozia z VIN — liczba nieznana.';
  }
  return json({
    counts, notes,
    scope: p?.brand && p.year ? { make: p.brand, year: p.year, platform: p.platform ?? null, nhtsaModels: models } : null,
    source: 'https://api.nhtsa.gov/', fetchedAt: new Date().toISOString(),
  });
}
