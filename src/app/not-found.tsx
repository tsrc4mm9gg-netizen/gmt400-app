import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-400">Błąd 404</p>
      <h1 className="mt-3 text-3xl font-bold text-amber-400 sm:text-4xl">Nie znaleziono strony</h1>
      <p className="mt-4 max-w-xl text-neutral-300">
        Adres może być nieaktualny, błędnie wpisany albo materiał mógł zostać przeniesiony.
        Skorzystaj z wyszukiwania lub przejdź do jednej z głównych sekcji.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-md bg-amber-400 px-5 py-3 font-semibold text-black underline-offset-4 hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Wróć na stronę główną
        </Link>
        <Link
          href="/szukaj"
          className="inline-flex min-h-11 items-center rounded-md border border-amber-400 px-5 py-3 font-semibold text-amber-400 underline-offset-4 hover:bg-amber-400 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
        >
          Szukaj materiałów
        </Link>
      </div>

      <nav aria-label="Nawigacja pomocnicza" className="mt-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm">
          <li>
            <Link
              href="/baza"
              className="rounded text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Baza wiedzy
            </Link>
          </li>
          <li>
            <Link
              href="/kody-obd"
              className="rounded text-amber-400 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              Kody OBD
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
