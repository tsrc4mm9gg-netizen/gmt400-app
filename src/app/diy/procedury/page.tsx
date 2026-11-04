import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AffiliateBox from '../../ui/AffiliateBox';

export const metadata: Metadata = {
  title: 'Procedury DIY GMT400 — wymiana termostatu, pompy wody, czujnika',
  description: 'Konkretne procedury naprawcze dla GMT400: wymiana termostatu, pompy wody, czujnika położenia wału. Krok po kroku z uwagami.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/procedury' },
};

const PROCEDURES = [
  {
    id: 'termostat',
    title: 'Wymiana termostatu',
    difficulty: 'łatwa',
    time: '30–60 min',
    tools: 'klucz 10/13, pojemnik na płyn, nowy termostat + uszczelka',
    steps: [
      'Silnik musi być zimny. Odkręć korek zbiornika wyrównawczego.',
      'Zlokalizuj obudowę termostatu (przy pompie wody, zwykle górny wąż chłodnicy).',
      'Odkręć śruby obudowy i zdejmij ją. Wyjmij stary termostat.',
      'Oczyść powierzchnie. Załóż nowy termostat strzałką w stronę silnika (lub zgodnie z oznaczeniem).',
      'Załóż nową uszczelkę, dokręć śruby równomiernie.',
      'Uzupełnij płyn chłodniczy i odpowietrz układ (grzejnik na max, silnik pracuje).',
    ],
    warning: 'Nie otwieraj układu na gorącym silniku — ryzyko poparzenia.',
    products: [
      { name: 'Termostat ACDelco 131-113', search: 'ACDelco 131-113' },
      { name: 'Płyn chłodniczy DEX-COOL', search: 'DEX-COOL coolant' },
    ],
  },
  {
    id: 'pompa-wody',
    title: 'Wymiana pompy wody',
    difficulty: 'średnia',
    time: '2–4 h',
    tools: 'klucze, ściągacz paska, nowa pompa + uszczelka, płyn',
    steps: [
      'Odłącz akumulator. Zdejmij pasek wielorowkowy.',
      'Odłącz węże od pompy. Odkręć śruby mocujące wentylator i pompę.',
      'Wyjmij starą pompę. Oczyść powierzchnię bloku.',
      'Załóż nową uszczelkę i pompę. Dokręć śruby momentem z instrukcji.',
      'Załóż pasek, uzupełnij płyn, odpowietrz.',
    ],
    warning: 'Sprawdź stan paska i rolek — często warto wymienić razem.',
    products: [
      { name: 'Pompa wody ACDelco 252-711', search: 'ACDelco 252-711' },
      { name: 'Płyn chłodniczy DEX-COOL', search: 'DEX-COOL coolant' },
      { name: 'Pasek wielorowkowy', search: 'serpentine belt Chevy Tahoe' },
    ],
  },
  {
    id: 'czujnik-walu',
    title: 'Wymiana czujnika położenia wału (CKP)',
    difficulty: 'łatwa–średnia',
    time: '30–90 min',
    tools: 'klucz nasadowy, nowy czujnik',
    steps: [
      'Czujnik jest zwykle przy kole pasowym lub w bloku (zależnie od rocznika).',
      'Odłącz wtyczkę. Odkręć śrubę mocującą.',
      'Wyjmij stary czujnik. Załóż nowy — nie dociskaj na siłę.',
      'Dokręć śrubę i podłącz wtyczkę.',
      'Wymaż kody błędów i sprawdź rozruch.',
    ],
    warning: 'W niektórych rocznikach dostęp jest utrudniony — może być potrzebne podniesienie auta.',
    products: [
      { name: 'Czujnik położenia wału (CKP)', search: 'crankshaft position sensor Chevy Tahoe' },
      { name: 'Skaner OBD2', search: 'OBD2 scanner' },
    ],
  },
];

export default function ProceduresPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Procedury' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Konkretne procedury</h1>
        <p className="mt-3 text-neutral-300">
          Krok po kroku. Wartości momentów i pojemności sprawdź w swoim roczniku.
        </p>
      </header>

      <div className="mt-6 space-y-6">
        {PROCEDURES.map(proc => (
          <article key={proc.id} id={proc.id} className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
            <h2 className="text-xl font-semibold text-silver-300">{proc.title}</h2>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-neutral-400">
              <span>Trudność: {proc.difficulty}</span>
              <span>Czas: {proc.time}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-300"><strong>Narzędzia:</strong> {proc.tools}</p>
            <ol className="mt-3 list-inside list-decimal space-y-1.5 text-sm text-neutral-300">
              {proc.steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            {proc.warning && (
              <p className="mt-3 rounded-lg bg-red-950/40 p-3 text-sm text-red-300">{proc.warning}</p>
            )}
            <AffiliateBox title="Czego potrzebujesz" items={proc.products} />
          </article>
        ))}
      </div>

      <Link href="/diy" className="mt-6 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
        ← Wszystkie DIY
      </Link>
    </div>
  );
}
