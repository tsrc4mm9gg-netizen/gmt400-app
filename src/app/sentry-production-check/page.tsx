import * as Sentry from '@sentry/nextjs';

export default function SentryProductionCheck() {
  Sentry.setTag('verification', 'production-end-to-end');
  Sentry.captureException(new Error('GMT400 temporary production Sentry verification'));

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col justify-center gap-4 px-6 py-24 text-white">
      <h1 className="text-2xl font-semibold">Test monitoringu</h1>
      <p>Wygenerowano jednorazowy, oznaczony błąd testowy dla Sentry.</p>
    </main>
  );
}
