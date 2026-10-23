// Wspólny klient Notion API: ponawia żądania przy 429 (limit zapytań), 5xx i przekroczeniu czasu.
// Notion ogranicza ruch do ~3 zapytań/s na integrację, więc pojedyncze 429 przy ISR/rewalidacji jest normalne.
export const NOTION_VERSION = '2022-06-28';

const RETRY_STATUS = new Set([429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class NotionUnavailableError extends Error {
  constructor(message = 'Baza wiedzy jest chwilowo niedostępna.') {
    super(message);
    this.name = 'NotionUnavailableError';
  }
}

type NotionInit = Omit<RequestInit, 'headers' | 'signal'> & { token: string; revalidate?: number; attempts?: number; timeoutMs?: number };

/** Opóźnienie przed kolejną próbą: Retry-After (sekundy) albo wykładniczy backoff z losowym rozrzutem. */
export function retryDelay(attempt: number, retryAfter: string | null): number {
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds > 0) return Math.min(seconds * 1000, 5000);
  return Math.min(400 * 2 ** attempt, 3000) + Math.floor(Math.random() * 200);
}

/** fetch do api.notion.com z ponawianiem. Zwraca ostatnią odpowiedź (także 4xx) — o 404 decyduje wywołujący. */
export async function notionFetch(url: string, { token, revalidate = 300, attempts = 3, timeoutMs = 10000, ...init }: NotionInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION, ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
        next: { revalidate },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!RETRY_STATUS.has(response.status) || attempt === attempts - 1) return response;
      await sleep(retryDelay(attempt, response.headers.get('retry-after')));
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) break;
      await sleep(retryDelay(attempt, null));
    }
  }
  throw new NotionUnavailableError(lastError instanceof Error ? `Baza wiedzy jest chwilowo niedostępna (${lastError.name}).` : undefined);
}
