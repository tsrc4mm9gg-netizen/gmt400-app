import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana czujnika prędkości VSS GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić czujnik prędkości (VSS) w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-czujnika-vss' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Podnieś auto na podpory lub najedź na kanał. Odłącz minus akumulatora.' },
  { step: 2, title: 'Zlokalizuj czujnik', desc: 'Czujnik VSS znajduje się na skrzyni biegów (4L60E/4L80E), z tyłu, po stronie kierowcy lub pasażera.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne od czujnika. Może być zabezpieczone klipsem.' },
  { step: 4, title: 'Wykręć czujnik', desc: 'Użyj klucza 10mm lub nasadki. Wykręć czujnik. Przygotuj pojemnik — może wyciekać ATF.' },
  { step: 5, title: 'Wkręć nowy', desc: 'Wkręć nowy czujnik ręcznie, potem dokręć kluczem (nie za mocno!). Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Sprawdź prędkościomierz i zmianę biegów. Sprawdź szczelność.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony VSS?',
    answer: 'Objawy: prędkościomierz nie działa lub skacze, skrzynia nie zmienia biegów poprawnie, kod P0500 lub P0502.',
  },
  {
    question: 'Czy trzeba spuszczać ATF?',
    answer: 'Nie, ale może wyciekać niewielka ilość. Przygotuj pojemnik.',
  },
];

export default function WymianaVSSPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana czujnika VSS' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana czujnika prędkości (VSS)</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany czujnika prędkości w GMT400. Czujnik znajduje się na skrzyni biegów.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 15–30 minut | <strong>Narzędzia:</strong> klucz 10mm, podnośnik
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

        <AccordionSection title="Schemat — lokalizacja VSS">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z boku (skrzynia 4L60E):

    ┌───────────────────────────────────┐
    │                                 │
    │   [SILNIK]  ┌───────────────────┐   │
    │             │   SKRZYNIA 4L60E  │   │
    │             │                 │   │
    │             │      [VSS] ← tu │   │
    │             └───────────────────┘   │
    │                                 │
    └───────────────────────────────────┘

VSS jest z tyłu skrzyni, na dole lub z boku.
Ma złącze elektryczne z 2 przewodami.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Czujnik prędkości VSS</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+VSS+speed+sensor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj czujnika VSS na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Czujnik VSS GMT400', search: 'GMT400 VSS speed sensor' },
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
