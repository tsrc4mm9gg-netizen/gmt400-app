import type { Metadata } from 'next';
import Link from 'next/link';
import { OBD_CODES, searchObdCodes } from '@/lib/obd-codes';
import RandomCodeLink from './random-code-link';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';

export const metadata: Metadata = {
  title: 'Kody OBD GMT400 — P0300, P0171 i inne | Tahoe, Suburban, Silverado',
  description: 'Baza kodów OBD-II dla Chevrolet Tahoe, Suburban, Silverado i GMC GMT400 (1996+). Znaczenie kodu, typowe przyczyny i co sprawdzić najpierw.',
  alternates: { canonical: 'https://www.gmt400.pl/kody-obd' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/kody-obd',
    title: 'Kody OBD GMT400',
    description: 'Objaśnienia kodów diagnostycznych dla Tahoe, Suburban i Silverado.',
  },
};

const systemFilters = ['Paliwo', 'Powietrze', 'Zapłon', 'Chłodzenie', 'Emisje', 'Skrzynia biegów'];

const systemCounts = Object.fromEntries(
  systemFilters.map(system => [
    system,
    OBD_CODES.filter(code => code.systems.includes(system)).length
  ])
);

const TIPS = [
  { title: 'Przed odczytem', tip: 'Upewnij się, że akumulator jest naładowany (min. 12V). Słaby akumulator może powodować fałszywe kody.' },
  { title: 'Podczas odczytu', tip: 'Zapisz wszystkie kody przed czyszczeniem. Niektóre kody wymagają kilku cykli jazdy, aby się potwierdzić.' },
  { title: 'Po odczycie', tip: 'Nie czyść kodów przed naprawą. Sprawdź dane live (wartości czujników). Potwierdź diagnozę pomiarami.' },
];

const faqItems = [
  {
    question: 'Jak odczytać kody OBD w GMT400?',
    answer: 'W modelach 1996+ (OBD-II) użyj skanera OBD2 podłączonego do gniazda 16-pin. W starszych (1988–1995, OBD-I) zwrzyj piny A–B w złączu ALDL 12-pin i odczytaj migającą lampkę Check Engine.',
  },
  {
    question: 'Co oznacza kod P0300?',
    answer: 'P0300 to losowe/wielo-cylindrowe wypadanie zapłonu. Przyczyny: zużyte świece, przewody, cewka, problemy z paliwem lub kompresją. Sprawdź najpierw świece i przewody.',
  },
  {
    question: 'Czy kody OBD zawsze oznaczają usterkę?',
    answer: 'Nie. Kody wskazują na problem wykryty przez komputer, ale nie zawsze oznaczają uszkodzoną część. Mogą być spowodowane luźnym złączem, niskim napięciem akumulatora lub tymczasowym problemem. Zawsze potwierdź diagnozę pomiarami.',
  },
  {
    question: 'Jak wyczyścić kody OBD?',
    answer: 'Skanerem OBD2 (opcja Clear Codes) lub przez odłączenie akumulatora na 15 minut. Uwaga: wyczyszczenie kodów bez naprawy usterki spowoduje ich powrót. Niektóre kody wymagają kilku cykli jazdy, aby się potwierdzić.',
  },
];

export default function ObdCodesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => {
    const query = q || '';
    const results = searchObdCodes(query);
    const activeSystemCount = systemCounts[query];
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Breadcrumbs className="mb-2" items={[{ label: 'Kody OBD' }]} />
        <header className="mb-6">
          <p className="text-sm uppercase tracking-wide text-silver-400">Diagnostyka</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Kody OBD-II GMT400 (1996+)</h1>
          <p className="mt-3 max-w-2xl text-neutral-300">Baza kodów diagnostycznych z objaśnieniem, typowymi przyczynami i kolejnością sprawdzania. Kody są informacyjne — przed wymianą części potwierdź usterkę pomiarami i danymi live.</p>
          <p className="mt-3 max-w-2xl text-neutral-300">Wybierz system, aby zawęzić listę kodów.</p>
          <nav aria-label="Filtry systemów" className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {systemFilters.map(system => {
                const isActive = query === system;
                return (
                  <li key={system}>
                    <Link href={`/kody-obd?q=${encodeURIComponent(system)}`} aria-current={isActive ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded border px-4 py-2 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 ${isActive ? 'border-silver-600 bg-silver-600 font-semibold text-neutral-950' : 'border-white/20 bg-neutral-950 text-silver-400'}`}>{system} — {systemCounts[system]}<span className="sr-only">kodów</span>{isActive && <span className="sr-only">(aktywny filtr)</span>}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-silver-300">Wskazówki odczytu kodów</h2>
          <div className="mt-3 space-y-3">
            {TIPS.map(item => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
                <h3 className="font-semibold text-silver-200">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-silver-300">Części do kodów OBD</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
            <li>Świece (P0300): <PartLink partNumber="41-932" /></li>
            <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
            <li>Cewka zapłonowa: <PartLink partNumber="D577" /></li>
            <li>Filtr powietrza (P0171): <PartLink partNumber="A1300C" /></li>
            <li>Czujnik O2: sprawdź numer na starej części</li>
          </ul>
        </section>

        <AffiliateBox
          title="Do odczytu kodów"
          items={[
            { name: 'Skaner OBD2 Bluetooth', search: 'OBD2 scanner Bluetooth' },
            { name: 'Skaner OBD2 z wyświetlaczem', search: 'OBD2 scanner handheld' },
          ]}
        />
        <section aria-labelledby="obd-generations" className="mb-6 rounded-xl border border-white/10 bg-neutral-900/60 p-4">
          <h2 id="obd-generations" className="text-xl font-semibold text-white">OBD-I czy OBD-II?</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-silver-400">OBD-I (1988–1995)</h3>
              <ul className="mt-2 list-disc pl-5 text-neutral-300">
                <li>Złącze ALDL 12-pin</li>
                <li>Odczyt: zwarcie pinów A–B, miganie lampki „Check Engine”</li>
                <li>Kod 12 = tryb diagnostyczny</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-silver-400">OBD-II (1996+)</h3>
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
          <button type="submit" className="min-h-12 rounded bg-silver-600 px-5 font-semibold text-neutral-950">Filtruj</button>
          <RandomCodeLink />
        </form>
        {query && <p className="mb-4 text-sm text-neutral-400">Aktywny filtr: <strong className="text-neutral-200">{query}</strong>{typeof activeSystemCount === 'number' && <> · {activeSystemCount} kodów</>} · <Link href="/kody-obd" className="text-silver-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Wyczyść filtr</Link></p>}
        <p className="mb-4 text-sm text-neutral-400">Wyświetlanie {results.length} z {OBD_CODES.length} kodów.</p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.map(item => (
            <li key={item.code} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <Link href={`/kody-obd/${item.code.toLowerCase()}`} className="inline-flex min-h-11 items-center text-lg font-semibold text-silver-400 underline">{item.code}</Link>
              <p className="mt-1 text-neutral-200">{item.title}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-neutral-400">{item.systems.join(' · ')}</p>
            </li>
          ))}
        </ul>
        {!results.length && query && <p className="rounded border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">Brak wyników dla filtra: <strong className="text-neutral-200">{query}</strong>. <Link href="/kody-obd" className="text-silver-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Wyczyść filtr</Link>, aby zobaczyć wszystkie kody.</p>}
        {!results.length && !query && <p className="rounded border border-white/10 bg-neutral-900/60 p-4 text-neutral-300">Brak wyników. Spróbuj samego kodu, np. „P0300”, albo krótszej frazy.</p>}
        <FAQ items={faqItems} />
      </div>
    );
  });
}
