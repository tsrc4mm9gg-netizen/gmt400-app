import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana silnika dmuchawy GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić silnik dmuchawy ogrzewania w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-silnika-dmuchawy' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Silnik dmuchawy jest pod deską, po stronie pasażera.' },
  { step: 2, title: 'Zlokalizuj silnik', desc: 'Połóż się pod deską po stronie pasażera. Silnik dmuchawy jest w obudowie, ma złącze elektryczne.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne od silnika dmuchawy.' },
  { step: 4, title: 'Odkręć silnik', desc: 'Odkręć śruby mocujące (zwykle 3). Wyciągnij silnik z obudowy.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy silnik. Przykręć śruby. Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Włącz zapłon. Sprawdź, czy dmuchawa działa na wszystkich prędkościach.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony silnik dmuchawy?',
    answer: 'Objawy: brak nawiewu, nawiew działa tylko na niektórych prędkościach, piszczenie lub zgrzytanie z deski.',
  },
  {
    question: 'Czy to rezystor czy silnik?',
    answer: 'Jeśli dmuchawa działa tylko na najwyższej prędkości — to rezystor. Jeśli nie działa wcale — to silnik lub bezpiecznik.',
  },
];

export default function WymianaSilnikaDmuchawyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana silnika dmuchawy' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana silnika dmuchawy</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany silnika dmuchawy ogrzewania w GMT400. Silnik znajduje się pod deską.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucze, latarka
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

        <AccordionSection title="Schemat — lokalizacja silnika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z wnętrza (pod deską, strona pasażera):

    ┌───────────────────────────────────┐
    │                                 │
    │   [DESKA ROZDZIELCZA]          │
    │                                 │
    │   ┌────────────────────────┐     │
    │   │   OBUDOWA DMUCHAWY    │     │
    │   │                       │     │
    │   │   [SILNIK] ← tu       │     │
    │   │                       │     │
    │   └────────────────────────┘     │
    │                                 │
    └───────────────────────────────────┘

Silnik jest pod deską, po stronie pasażera.
Dostęp od dołu (leżąc na podłodze).
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Silnik dmuchawy</li>
              <li>Rezystor dmuchawy (opcjonalnie)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+blower+motor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj silnika dmuchawy na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Silnik dmuchawy GMT400', search: 'GMT400 blower motor' },
                { name: 'Rezystor dmuchawy', search: 'GMT400 blower resistor' },
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
