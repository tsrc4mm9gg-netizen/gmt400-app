export function sanitizeEvent<T extends { user?: unknown; request?: unknown; extra?: unknown; breadcrumbs?: unknown }>(event: T): T {
  delete event.user;
  delete event.request;
  delete event.extra;
  delete event.breadcrumbs;
  return event;
}

// notFound() w Next.js rzuca specjalny błąd (digest NEXT_HTTP_ERROR_FALLBACK;404 / NEXT_NOT_FOUND).
// To oczekiwany 404 (nieistniejący wpis), nie awaria — nie wysyłamy go do Sentry.
const EXPECTED_404 = /NEXT_HTTP_ERROR_FALLBACK;404|NEXT_NOT_FOUND/;
export function isExpectedNotFound(event: { exception?: { values?: { type?: string; value?: string }[] }; message?: string }): boolean {
  const texts = [event.message || '', ...(event.exception?.values || []).flatMap(value => [value.type || '', value.value || ''])];
  return texts.some(text => EXPECTED_404.test(text));
}

// Produkcyjny projekt Sentry. Zdarzenia z lokalnych/testowych hostów (Playwright, `next start` na 127.0.0.1, CI)
// nie mogą tam trafiać — wcześniej testy raportowały się jako „production” (np. GMT400-APP-7, sw.js na 127.0.0.1:3100).
export const PRODUCTION_DSN = 'https://d98d3250958bf8200baa65a90fbc4582@o4512280021499904.ingest.de.sentry.io/4512280030675024';
export const PRODUCTION_HOSTS = ['gmt400.pl', 'www.gmt400.pl'];
const LOCAL_ORIGIN = /\b(?:https?:\/\/)?(?:localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[::1\]|::1)(?::\d+)?(?:\/|\b)/i;

export function isProductionHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return PRODUCTION_HOSTS.includes(host) || host.endsWith('.vercel.app');
}

type SentryLikeEvent = {
  user?: unknown; request?: unknown; extra?: unknown; breadcrumbs?: unknown; message?: string;
  exception?: { values?: { type?: string; value?: string; stacktrace?: { frames?: { filename?: string; abs_path?: string }[] } }[] };
};

// Czy zdarzenie pochodzi z lokalnego serwera (adres żądania, nazwa pliku w stosie albo treść błędu wskazuje localhost/127.x).
export function isLocalOriginEvent(event: SentryLikeEvent): boolean {
  const request = event.request as { url?: string; headers?: Record<string, string> } | undefined;
  const texts = [request?.url || '', request?.headers?.Referer || '', request?.headers?.referer || '', event.message || ''];
  for (const value of event.exception?.values || []) {
    texts.push(value.value || '');
    for (const frame of value.stacktrace?.frames || []) texts.push(frame.filename || '', frame.abs_path || '');
  }
  return texts.some(text => LOCAL_ORIGIN.test(text));
}

export function beforeSend<T extends SentryLikeEvent>(event: T): T | null {
  if (isExpectedNotFound(event)) return null;
  // Do produkcyjnego DSN nigdy nie wysyłamy zdarzeń z lokalnych hostów. Testowy DSN (CI sentry-browser) może je dostać.
  if ((process.env.NEXT_PUBLIC_SENTRY_DSN || PRODUCTION_DSN) === PRODUCTION_DSN && isLocalOriginEvent(event)) return null;
  return sanitizeEvent(event);
}

export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || PRODUCTION_DSN,
  // Tylko wdrożenia Vercel (VERCEL_ENV → NEXT_PUBLIC_VERCEL_ENV w next.config) lub jawne NEXT_PUBLIC_SENTRY_ENABLED=true.
  // Lokalny `next build`/`next start` też ma NODE_ENV=production — nie raportuje. NEXT_PUBLIC_SENTRY_DISABLED=1 wyłącza zawsze
  // (Playwright webServer, CI). W przeglądarce dodatkowo sprawdzamy host (instrumentation-client.ts).
  enabled: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false'
    && process.env.NEXT_PUBLIC_SENTRY_DISABLED !== '1'
    && (Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL) || process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true'),
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  sendDefaultPii: false,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  enableLogs: false,
  maxBreadcrumbs: 0,
  ignoreErrors: [EXPECTED_404],
  beforeSend,
};
