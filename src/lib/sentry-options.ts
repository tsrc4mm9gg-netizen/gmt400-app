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

export function beforeSend<T extends { user?: unknown; request?: unknown; extra?: unknown; breadcrumbs?: unknown; exception?: { values?: { type?: string; value?: string }[] }; message?: string }>(event: T): T | null {
  if (isExpectedNotFound(event)) return null;
  return sanitizeEvent(event);
}

export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://d98d3250958bf8200baa65a90fbc4582@o4512280021499904.ingest.de.sentry.io/4512280030675024',
  // Tylko wdrożenia Vercel (lub jawne NEXT_PUBLIC_SENTRY_ENABLED=true). Lokalny `next start` też ma NODE_ENV=production,
  // ale nie ma NOTION_TOKEN — bez tego warunku jego błędy trafiały do Sentry jako „production”.
  enabled: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false'
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
