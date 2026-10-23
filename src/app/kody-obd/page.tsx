import type { Metadata } from 'next';
import Link from 'next/link';
import { OBD_CODES, searchObdCodes } from '@/lib/obd-codes';
import RandomCodeLink from './random-code-link';

export const metadata: Metadata = {
  title: 'Kody OBD-II GMT400 (1996+) — baza, przyczyny i diagnostyka',
  description: 'Baza kodów OBD-II dla Chevroleta i GMC GMT400: znaczenie kodu, typowe przyczyny, kolejność diagnostyki i powiązane materiały.'
};

const systemFilters = ['Paliwo', 'Powietrze', 'Zapłon', 'Chłodzenie', 'Emisje', 'Skrzynia biegów'];

const systemCounts = Object.fromEntries(
  systemFilters.map(system => [
    system,
    OBD_CODES.filter(code => code.systems.includes(system)).length
  ])
);

export default function ObdCodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => {
    const query = q || '';
    const results = searchObdCodes(query);
    const activeSystemCount = systemCounts[query];
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-wide text-red-400">Diagnostyka</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Kody OBD-II GMT400 (1996+)</h1>
          <p className="mt-3 max-w-2xl text-neutral-300">Baza kodów diagnostycznych z objaśnieniem, typowymi przyczynami i kolejnością sprawdzania. Kody są informacyjne — przed wymianą części potwierdź usterkę pomiarami i danymi live.</p>
          <p className="mt-3 max-w-2xl text-neutral-300">Wybierz system, aby zawęzić listę kodów.</p>
          <nav aria-label="Filtry systemów" className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {systemFilters.map(system => {
                const isActive = query === system;
                return (
                  <li key={system}>
                    <Link href={`/kody-obd?q=${encodeURIComponent(system)}`} aria-current={isActive ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded border px-4 py-2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 ${isActive ? 'border-red-600 bg-red-600 font-semibold text-white' : 'border-white/20 bg-neutral-950 text-red-400'}`}>{system} — {systemCounts[system]}<span className="sr-only">kodów</span>{isActive && <span className="sr-only">(aktywny filtr)</span>}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
        <section aria-labelledby="obd-generations" className="mb-6 rounded-xl border border-white/10 bg-neutral-900/60 p-4">
          <h2 id="obd-generations" className="text-xl font-semibold text-white">OBD-I czy OBD-II?</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-red-400">OBD-I (1988–1995)</h3>
              <ul className="mt-2 list-disc pl-5 text-neutral-300">
                <li>Złącze ALDL 12-pin</li>
                <li>Odczyt: zwarcie pinów A–B, miganie lampki „Check Engine”</li>
                <li>Kod 12 = tryb diagnostyczny</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-400">OBD-II (1996+)</h3>
              <ul className="mt-2 list-disc pl-5 text-neutral-300">
                <li>Gniazdo diagnostyczne 16-pin</li>
                <li>Odczyt skanerem OBD-II</li>
                <li>Kody P0xxx</li>
              </ul>
            </div>
          </div>
        </section>
        <form role="search" className="mb-6 flex flex-wrap gap-3">
          <label htmlFor="obd-search" className="sr-only">Szukaj kodu OBD</label>
          <input id="obd-search" name="q" type="search" defaultValue={query} placeholder="Szukaj kodu lub systemu, np. P0300" className="min-h-12 min-w-0 flex-1 rounded border border-white/20 bg-neutral-900 px-4 py-3 text-white" />
          <button type="submit" className="min-h-12 rounded bg-red-600 px-5 font-semibold text-white">Filtruj</button>
          <RandomCodeLink />
        </form>
        {query && <p className="mb-4 text-sm text-neutral-400">Aktywny filtr: <strong className="text-neutral-200">{query}</strong>{typeof activeSystemCount === 'number' && <> · {activeSystemCount} kodów</>} · <Link href="/kody-obd" className="text-red-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Wyczyść filtr</Link></p>}
        <p className="mb-4 text-sm text-neutral-400">Wyświetlanie {results.length} z {OBD_CODES.length} kodów.</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.map(item => (
            <li key={item.code} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <Link href={`/kody-obd/${item.code.toLowerCase()}`} className="text-lg font-semibold text-red-400 underline">{item.code}</Link>
              <p className="mt-1 text-neutral-200">{item.title}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-neutral-400">{item.systems.join(' · ')}</p>
            </li>
          ))}
        </ul>
        {!results.length && query && <p className="rounded border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">Brak wyników dla filtra: <strong className="text-neutral-200">{query}</strong>. <Link href="/kody-obd" className="text-red-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">Wyczyść filtr</Link>, aby zobaczyć wszystkie kody.</p>}
        {!results.length && !query && <p className="rounded border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">Brak wyników. Spróbuj samego kodu, np. „P0300”, albo krótszej frazy.</p>}
      </main>
    );
  });
}
