export function sanitizeEvent<T extends { user?: unknown; request?: unknown; extra?: unknown; breadcrumbs?: unknown }>(event: T): T {
  delete event.user;
  delete event.request;
  delete event.extra;
  delete event.breadcrumbs;
  return event;
}

export const sentryOptions = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'https://d98d3250958bf8200baa65a90fbc4582@o4512280021499904.ingest.de.sentry.io/4512280030675024',
  enabled: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_ENABLED !== 'false',
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  sendDefaultPii: false,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  enableLogs: false,
  maxBreadcrumbs: 0,
  beforeSend: sanitizeEvent,
};
