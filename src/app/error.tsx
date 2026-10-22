'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">Błąd serwera</p>
      <h1 className="mt-3 text-3xl font-bold text-amber-400 sm:text-4xl">Wystąpił błąd</h1>
      <p role="alert" className="mt-4 max-w-xl text-neutral-300">
        Wystąpił nieoczekiwany problem. Może to być chwilowa usterka — spróbuj ponownie lub wróć do głównej strony serwisu.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-11 items-center rounded-md bg-amber-400 px-5 py-3 font-semibold text-black underline-offset-4 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md border border-amber-400 px-5 py-3 font-semibold text-amber-400 underline-offset-4 hover:bg-amber-400 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Wróć na stronę główną
        </Link>
      </div>

      <nav aria-label="Nawigacja pomocnicza" className="mt-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
          <li>
            <Link href="/szukaj" className="rounded text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Szukaj materiałów</Link>
          </li>
          <li>
            <Link href="/baza" className="rounded text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Baza wiedzy</Link>
          </li>
          <li>
            <Link href="/kody-obd" className="rounded text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Kody OBD</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
