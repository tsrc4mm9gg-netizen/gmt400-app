import * as Sentry from '@sentry/nextjs';
import { isProductionHost, PRODUCTION_DSN, sentryOptions } from './lib/sentry-options';

// W przeglądarce raportujemy do produkcyjnego Sentry tylko z gmt400.pl / www.gmt400.pl (oraz *.vercel.app).
// Lokalne serwery testowe (127.0.0.1, localhost) nie wysyłają nic. Testowy DSN (CI) nie jest ograniczany hostem.
const hostAllowed = typeof window === 'undefined' || sentryOptions.dsn !== PRODUCTION_DSN || isProductionHost(window.location.hostname);

Sentry.init({ ...sentryOptions, enabled: sentryOptions.enabled && hostAllowed });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
