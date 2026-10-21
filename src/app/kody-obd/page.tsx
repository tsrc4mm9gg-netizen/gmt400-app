import type { Metadata } from 'next';
import Link from 'next/link';
import { OBD_CODES, searchObdCodes } from '@/lib/obd-codes';

export const metadata: Metadata = {
  title: 'Kody OBD-II GMT400 — baza, przyczyny i diagnostyka',
  description: 'Baza kodów OBD-II dla Chevroleta i GMC GMT400: znaczenie kodu, typowe przyczyny, kolejność diagnostyki i powiązane materiały.'
};

export default function ObdCodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => {
    const query = q || '';
    const results = searchObdCodes(query);
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-6">
          <p className="text-sm uppercase tracking-wide text-amber-400">Diagnostyka</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Kody OBD-II GMT400</h1>
          <p className="mt-3 max-w-2xl text-neutral-300">Baza kodów diagnostycznych z objaśnieniem, typowymi przyczynami i kolejnością sprawdzania. Kody są informacyjne — przed wymianą części potwierdź usterkę pomiarami i danymi live.</p>
        </header>
        <form role="search" className="mb-6 flex flex-wrap gap-3">
          <label htmlFor="obd-search" className="sr-only">Szukaj kodu OBD</label>
          <input id="obd-search" name="q" type="search" defaultValue={query} placeholder="np. P0300, EGR, O2, EVAP" className="min-h-12 min-w-0 flex-1 rounded border border-white/20 bg-neutral-900 px-4 py-3 text-white" />
          <button type="submit" className="min-h-12 rounded bg-amber-400 px-5 font-semibold text-black">Szukaj</button>
        </form>
        <p className="mb-4 text-sm text-neutral-400">Znaleziono {results.length} z {OBD_CODES.length} kodów.</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.map(item => (
            <li key={item.code} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <Link href={`/kody-obd/${item.code.toLowerCase()}`} className="text-lg font-semibold text-amber-400 underline">{item.code}</Link>
              <p className="mt-1 text-neutral-200">{item.title}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-neutral-400">{item.systems.join(' · ')}</p>
            </li>
          ))}
        </ul>
        {!results.length && <p className="rounded border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">Brak wyników. Spróbuj samego kodu, np. „P0300”, albo krótszej frazy.</p>}
      </main>
    );
  });
}
