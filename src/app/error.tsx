'use client';

import { useEffect, useRef } from 'react';

export default function ErrorPage({ reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-xl flex-col justify-center gap-5 px-6 py-24 text-white" aria-labelledby="page-error-title">
      <p className="text-sm uppercase tracking-widest text-amber-400">GMT400</p>
      <h1 ref={heading} id="page-error-title" tabIndex={-1} className="text-3xl font-semibold focus:outline-2 focus:outline-offset-4 focus:outline-amber-400">
        Nie udało się wyświetlić strony
      </h1>
      <p className="leading-relaxed text-neutral-300">
        Wystąpił nieoczekiwany błąd. Spróbuj ponownie. Jeśli problem się powtarza, wróć na stronę główną.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-400 px-5 py-3 font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">
          Spróbuj ponownie
        </button>
        <a href="/" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-500 px-5 py-3 text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">
          Strona główna
        </a>
      </div>
    </main>
  );
}
