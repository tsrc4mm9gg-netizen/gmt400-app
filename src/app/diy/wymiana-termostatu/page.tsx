import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana termostatu GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić termostat w GMT400 (Tahoe, Suburban, Silverado). Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-termostatu' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Przygotuj pojemnik na płyn chłodniczy.' },
  { step: 2, title: 'Spust płynu', desc: 'Odkręć korek spustowy chłodnicy (na dole). Spuść płyn do pojemnika. Odkręć korek zbiorniczka wyrównawczego.' },
  { step: 3, title: 'Zlokalizuj termostat', desc: 'Termostat jest w obudowie na górze silnika, przy połączeniu z górnym wężem chłodnicy. Odłącz wąż.' },
  { step: 4, title: 'Wymień termostat', desc: 'Odkręć śruby obudowy (zwykle 2). Wyjmij stary termostat i uszczelkę. Wyczyść powierzchnię. Załóż nowy termostat (sprężyna do silnika) i nową uszczelkę.' },
  { step: 5, title: 'Złóż', desc: 'Przykręć obudowę. Podłącz wąż. Wlej płyn chłodniczy. Odpowietrz układ (uruchom silnik z otwartym korkiem).' },
  { step: 6, title: 'Test', desc: 'Uruchom silnik i poczekaj aż się nagrzeje. Sprawdź, czy górny wąż chłodnicy robi się ciepły. Sprawdź szczelność.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony termostat?',
    answer: 'Objawy: silnik się przegrzewa, temperatura nie rośnie (termostat zablokowany otwarty), ogrzewanie nie działa.',
  },
  {
    question: 'Jaki termostat kupić?',
    answer: 'Standardowy termostat GMT400 otwiera się przy ~91°C (195°F). Sprawdź numer części dla swojego rocznika i silnika.',
  },
];

export default function WymianaTermostatuPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana termostatu' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana termostatu</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany termostatu w GMT400. Prosta naprawa, którą można wykonać w 30–60 minut.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucze, pojemnik na płyn
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

        <AccordionSection title="Schemat — lokalizacja termostatu">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z góry silnika (Vortec):

    ┌───────────────────────────────────┐
    │                                 │
    │   [KOLEKTOR DOL.]              │
    │                                 │
    │      ┌──────────┐                 │
    │      │TERMOSTAT│ ← tu        │
    │      └──────────┘                 │
    │         │                       │
    │         └── wąż do chłodnicy     │
    └────────────────────────────────────┘

Termostat jest w obudowie przy górnym wężu chłodnicy.
Sprężyna termostatu skierowana DO SILNIKA.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Termostat (195°F / 91°C)</li>
              <li>Uszczelka termostatu</li>
              <li>Płyn chłodniczy (DEX-COOL lub uniwersalny)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+thermostat&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj termostatu na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Termostat GMT400', search: 'GMT400 thermostat' },
                { name: 'Płyn DEX-COOL', search: 'DEX-COOL coolant' },
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
