import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana zaworu EGR GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić zawór EGR w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-zaworu-egr' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora.' },
  { step: 2, title: 'Zlokalizuj zawór', desc: 'Zawór EGR jest na kolektorze dolotowym lub wydechowym. Ma złącze elektryczne lub podciśnieniowe.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne lub wąż podciśnieniowy.' },
  { step: 4, title: 'Odkręć zawór', desc: 'Odkręć śruby mocujące (zwykle 2). Wyciągnij zawór. Wyczyść kanały w kolektorze.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nową uszczelkę. Przykręć zawór. Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Skasuj kody OBD. Sprawdź, czy nie wracają.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony zawór EGR?',
    answer: 'Objawy: kody P0401, P0402, P1404, nierówna praca na biegu jałowym, stukanie silnika.',
  },
  {
    question: 'Czy można wyczyścić zamiast wymieniać?',
    answer: 'Tak, często wystarczy czyszczenie. Użyj preparatu do czyszczenia EGR i wyczyść kanały w kolektorze.',
  },
];

export default function WymianaZaworuEGRPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana zaworu EGR' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana zaworu EGR</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany zaworu EGR w GMT400. Zawór znajduje się na kolektorze.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucze, preparat do czyszczenia
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

        <AccordionSection title="Schemat — lokalizacja zaworu EGR">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z góry silnika:

    ┌───────────────────────────────────┐
    │                                 │
    │   [KOLEKTOR DOL.]              │
    │                                 │
    │      ┌──────────┐                 │
    │      │ ZAWÓR EGR│ ← tu        │
    │      └──────────┘                 │
    │                                 │
    └───────────────────────────────────┘

Zawór EGR jest na kolektorze dolotowym.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Zawór EGR</li>
              <li>Uszczelka zaworu EGR</li>
              <li>Preparat do czyszczenia EGR</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+EGR+valve&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj zaworu EGR na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Zawór EGR GMT400', search: 'GMT400 EGR valve' },
                { name: 'Preparat do czyszczenia EGR', search: 'EGR cleaner' },
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
