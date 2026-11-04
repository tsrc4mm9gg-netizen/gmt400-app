import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana alternatora GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić alternator w GMT400 (Tahoe, Suburban, Silverado). Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-alternatora' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Alternator jest z przodu silnika.' },
  { step: 2, title: 'Zdejmij pasek', desc: 'Poluzuj napinacz paska klinowego. Zdejmij pasek z koła alternatora.' },
  { step: 3, title: 'Odłącz przewody', desc: 'Odłącz złącze elektryczne i gruby przewód z alternatora.' },
  { step: 4, title: 'Odkręć alternator', desc: 'Odkręć śruby mocujące (zwykle 2–3). Wyciągnij alternator.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy alternator. Przykręć śruby. Podłącz przewody. Załóż pasek.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Sprawdź napięcie ładowania (13.5–14.5V).' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony alternator?',
    answer: 'Objawy: świecąca kontrolka akumulatora, słabe światła, akumulator się rozładowuje, piszczenie.',
  },
  {
    question: 'Jakie napięcie ładowania?',
    answer: 'Przy pracującym silniku: 13.5–14.5V. Poniżej 13V — alternator nie ładuje.',
  },
];

export default function WymianaAlternatoraPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana alternatora' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana alternatora</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany alternatora w GMT400. Alternator znajduje się z przodu silnika.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucze
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

        <AccordionSection title="Schemat — lokalizacja alternatora">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z przodu silnika:

    ┌───────────────────────────────────┐
    │                                 │
    │   [WENTYLATOR]                  │
    │                                 │
    │   ┌───────────┐                   │
    │   │ALTERNATOR│ ← tu           │
    │   └───────────┘                   │
    │         │                         │
    │   [PASEK KLINOWY]               │
    │                                 │
    └───────────────────────────────────┘

Alternator jest z przodu, napędzany paskiem.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Alternator</li>
              <li>Pasek klinowy (opcjonalnie)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+alternator&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj alternatora na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Alternator GMT400', search: 'GMT400 alternator' },
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
