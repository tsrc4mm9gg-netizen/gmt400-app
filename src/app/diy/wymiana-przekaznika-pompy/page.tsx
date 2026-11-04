import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana przekaźnika pompy paliwa GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić przekaźnik pompy paliwa w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-przekaznika-pompy' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Przekaźnik jest w skrzynce bezpieczników pod maską.' },
  { step: 2, title: 'Zlokalizuj skrzynkę', desc: 'Skrzynka bezpieczników jest pod maską, przy akumulatorze lub przy ścianie grodziowej.' },
  { step: 3, title: 'Znajdź przekaźnik', desc: 'Sprawdź schemat na pokrywie skrzynki. Przekaźnik pompy paliwa jest oznaczony (FUEL PUMP).' },
  { step: 4, title: 'Wyjmij przekaźnik', desc: 'Wyciągnij przekaźnik z gniazda. Sprawdź, czy styki nie są przepalone.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy przekaźnik. Upewnij się, że jest wciśnięty do końca.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Włącz zapłon — pompa powinna zabuczeć. Uruchom silnik.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony przekaźnik?',
    answer: 'Objawy: pompa nie buczy przy włączeniu zapłonu, auto nie odpala, gaśnie w czasie jazdy.',
  },
  {
    question: 'Czy to tania naprawa?',
    answer: 'Tak, przekaźnik kosztuje kilka–kilkanaście złotych. Wymiana zajmuje 5 minut.',
  },
];

export default function WymianaPrzekaznikaPompyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana przekaźnika pompy paliwa' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana przekaźnika pompy paliwa</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany przekaźnika pompy paliwa w GMT400. Tania i szybka naprawa.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 5–10 minut | <strong>Narzędzia:</strong> brak
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

        <AccordionSection title="Schemat — lokalizacja przekaźnika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z góry (pod maską):

    ┌───────────────────────────────────┐
    │                                 │
    │   [AKUMULATOR]                  │
    │                                 │
    │   ┌─────────────────┐             │
    │   │ SKRZYNKA BEZP. │ ← tu    │
    │   │               │             │
    │   └─────────────────┘             │
    │                                 │
    └───────────────────────────────────┘

Przekaźnik jest w skrzynce bezpieczników pod maską.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Przekaźnik pompy paliwa</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+fuel+pump+relay&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj przekaźnika na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Przekaźnik pompy paliwa', search: 'GMT400 fuel pump relay' },
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
