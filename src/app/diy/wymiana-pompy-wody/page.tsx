import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana pompy wody GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić pompę wody w GMT400 (Tahoe, Suburban, Silverado). Procedura, lista narzędzi i części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-pompy-wody' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Spuść płyn chłodniczy.' },
  { step: 2, title: 'Zdejmij pasek', desc: 'Poluzuj napinacz paska klinowego. Zdejmij pasek z koła pompy wody.' },
  { step: 3, title: 'Odłącz węże', desc: 'Odłącz dolny wąż chłodnicy od pompy. Odłącz wąż od obudowy termostatu (jeśli przeszkadza).' },
  { step: 4, title: 'Odkręć pompę', desc: 'Odkręć śruby pompy wody (zwykle 4–6). Wyjmij pompę. Wyczyść powierzchnię uszczelniającą.' },
  { step: 5, title: 'Załóż nową', desc: 'Załóż nową uszczelkę (lub użyj uszczelniacza). Przykręć pompę. Podłącz węże. Załóż pasek.' },
  { step: 6, title: 'Wlej płyn i testuj', desc: 'Wlej płyn chłodniczy. Odpowietrz układ. Uruchom silnik i sprawdź szczelność.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzoną pompę wody?',
    answer: 'Objawy: wyciek płynu z przodu silnika, przegrzewanie, hałas (piszczenie, zgrzytanie) z okolic pompy.',
  },
  {
    question: 'Czy wymienić pasek przy okazji?',
    answer: 'Tak, jeśli pasek jest stary lub popękany. To dobra okazja.',
  },
];

export default function WymianaPompyWodyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana pompy wody' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana pompy wody</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany pompy wody w GMT400. Pompa znajduje się z przodu silnika, napędzana paskiem klinowym.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 1–2 godziny | <strong>Narzędzia:</strong> klucze, pojemnik na płyn
        </p>
      </div>

      <div className="mt-6">
        <AccordionSection title="Procedura krok po kroku" defaultOpen>
          <ol className="space-y-4">
            {STEPS.map(s => (
              <li key={s.step} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-silver-600 text-sm font-bold text-neutral-950">{s.step}</span>
                  <h3 className="font-semibold text-silver-200">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-neutral-300">{s.desc}</p>
              </li>
            ))}
          </ol>
        </AccordionSection>

        <AccordionSection title="Schemat — lokalizacja pompy">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z przodu silnika:

    ┌───────────────────────────────────┐
    │                                 │
    │   [WENTYLATOR]                  │
    │        │                        │
    │   ┌────┴────┐                   │
    │   │  POMPA   │ ← tu            │
    │   │   WODY   │                   │
    │   └──────────┘                   │
    │        │                        │
    │   [PASEK KLINOWY]               │
    └───────────────────────────────────┘

Pompa jest za wentylatorem, napędzana paskiem.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Pompa wody</li>
              <li>Uszczelka pompy</li>
              <li>Płyn chłodniczy</li>
              <li>Pasek klinowy (opcjonalnie)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+water+pump&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj pompy wody na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Pompa wody GMT400', search: 'GMT400 water pump' },
                { name: 'Płyn DEX-COOL', search: 'DEX-COOL coolant' },
                { name: 'Pasek klinowy', search: 'GMT400 serpentine belt' },
              ]}
            />
          </div>
        </AccordionSection>

        <AccordionSection title="Częste pytania">
          <FAQ items={faqItems} />
        </AccordionSection>
      </div>

      <p className="mt-6 text-sm text-neutral-400">
        <Link href="/diy" className="text-silver-400 hover:underline">← Wróć do DIY</Link>
      </p>
    </div>
  );
}
