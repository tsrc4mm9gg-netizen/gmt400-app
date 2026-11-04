import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana włącznika świateł stop GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić włącznik świateł stop w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-wlacznika-stop' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Włącznik jest przy pedale hamulca.' },
  { step: 2, title: 'Zlokalizuj włącznik', desc: 'Włącznik jest na wsporniku pedału hamulca, pod deską. Ma złącze elektryczne.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne od włącznika.' },
  { step: 4, title: 'Wyjmij włącznik', desc: 'Odkręć nakrętkę lub wyciągnij włącznik z uchwytu.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy włącznik. Wyreguluj (powinien klikać przy naciśnięciu pedału). Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Sprawdź, czy światła stop działają przy naciśnięciu pedału.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony włącznik?',
    answer: 'Objawy: światła stop nie działają, światła stop świecą cały czas, tempomat nie działa.',
  },
  {
    question: 'Czy to prosta naprawa?',
    answer: 'Tak, wymiana zajmuje 10–15 minut. Dostęp jest pod deską przy pedale hamulca.',
  },
];

export default function WymianaWlacznikaStopPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana włącznika świateł stop' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana włącznika świateł stop</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany włącznika świateł stop w GMT400. Włącznik znajduje się przy pedale hamulca.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 10–15 minut | <strong>Narzędzia:</strong> klucze
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

        <AccordionSection title="Schemat — lokalizacja włącznika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z wnętrza (pod deską):

    ┌───────────────────────────────────┐
    │                                 │
    │   [DESKA]                       │
    │                                 │
    │   ┌──────────┐                     │
    │   │WŁĄCZNIK │ ← tu             │
    │   │  STOP   │                     │
    │   └──────────┘                     │
    │         │                           │
    │   [PEDAŁ HAMULCA]               │
    │                                 │
    └───────────────────────────────────┘

Włącznik jest na wsporniku pedału hamulca.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Włącznik świateł stop</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+brake+light+switch&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj włącznika na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Włącznik świateł stop', search: 'GMT400 brake light switch' },
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
