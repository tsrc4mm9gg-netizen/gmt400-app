'use client';

import { useEffect, useRef } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    Sentry.captureException(error);
    heading.current?.focus();
  }, [error]);

  return (
    <html lang="pl">
      <body style={{ margin: 0, background: '#0d0d0e', color: '#fafafa', fontFamily: 'system-ui, sans-serif' }}>
        <main aria-labelledby="global-error-title" style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px', lineHeight: 1.6 }}>
          <h1 ref={heading} id="global-error-title" tabIndex={-1}>Nie udało się uruchomić strony</h1>
          <p>Wystąpił nieoczekiwany błąd. Możesz spróbować ponownie lub otworzyć stronę główną.</p>
          <button type="button" onClick={reset} style={{ minHeight: 44, padding: '12px 20px', marginRight: 16 }}>Spróbuj ponownie</button>
          <a href="/" style={{ display: 'inline-block', minHeight: 44, padding: '12px 0', color: '#f4f4f5', boxSizing: 'border-box' }}>Strona główna</a>
        </main>
      </body>
    </html>
  );
}
