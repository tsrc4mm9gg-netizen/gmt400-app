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

type NotionInit = Omit<RequestInit, 'headers' | 'signal'> & {
  token: string;
  revalidate?: number;
  attempts?: number;
  timeoutMs?: number;
  sleep?: (ms: number) => Promise<void>;
};

/** Retry-After: sekundy albo data HTTP; bez skracania zalecenia serwera. */
export function retryDelay(attempt: number, retryAfter: string | null, now = Date.now()): number {
  const value = retryAfter?.trim() ?? '';
  let delay: number | null = null;
  if (/^\d+$/.test(value)) delay = Number(value) * 1000;
  else if (/^[A-Za-z]{3},/.test(value)) {
    const date = Date.parse(value);
    if (Number.isFinite(date)) delay = Math.max(0, date - now);
  }
  if (delay !== null) {
    if (!Number.isFinite(delay) || delay > 2_147_483_647) {
      throw new NotionUnavailableError('Retry-After przekracza bezpieczny zakres timera; nie ponawiamy przed zalecanym terminem.');
    }
    return delay;
  }
  return Math.min(400 * 2 ** attempt, 3000) + Math.floor(Math.random() * 200);
}

/** fetch do api.notion.com z ponawianiem. Zwraca ostatnią odpowiedź (także 4xx) — o 404 decyduje wywołujący. */
export async function notionFetch(
  url: string,
  {
    token,
    revalidate = 300,
    attempts = 5,
    timeoutMs = 15000,
    sleep: sleepFn = sleep,
    ...init
  }: NotionInit,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          'Notion-Version': NOTION_VERSION,
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        },
        next: { revalidate },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!RETRY_STATUS.has(response.status) || attempt === attempts - 1) return response;
      const delay = retryDelay(attempt, response.headers.get('retry-after'));
      await response.body?.cancel();
      await sleepFn(delay);
    } catch (error) {
      if (error instanceof NotionUnavailableError) throw error;
      lastError = error;
      if (attempt === attempts - 1) {
        console.error(`[notion-fetch] Nie udało się pobrać ${url} po ${attempts} próbach.`, error);
        break;
      }
      await sleepFn(retryDelay(attempt, null));
    }
  }
  throw new NotionUnavailableError(
    lastError instanceof Error
      ? `Baza wiedzy jest chwilowo niedostępna (${lastError.name}).`
      : undefined,
  );
}
