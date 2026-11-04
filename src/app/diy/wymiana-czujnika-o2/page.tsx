import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana czujnika tlenu O2 GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić czujnik tlenu (O2) w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-czujnika-o2' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Podnieś auto na podpory.' },
  { step: 2, title: 'Zlokalizuj czujnik', desc: 'Czujnik O2 jest w kolektorze wydechowym lub w rurze wydechowej. Ma złącze elektryczne.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne od czujnika.' },
  { step: 4, title: 'Wykręć czujnik', desc: 'Użyj klucza do sond lambda (22mm). Wykręć czujnik. Może być zapieczony — użyj penetrantu.' },
  { step: 5, title: 'Wkręć nowy', desc: 'Posmaruj gwint pastą antyzapieczającą. Wkręć nowy czujnik. Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Skasuj kody OBD. Sprawdź, czy nie wracają.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony czujnik O2?',
    answer: 'Objawy: zwiększone spalanie, kody P0130–P0167, nierówna praca silnika, czarny dym.',
  },
  {
    question: 'Ile czujników O2 ma GMT400?',
    answer: 'Zależy od rocznika. Starsze (do 1995): 1–2. Nowsze (1996+): 2–4 (przed i za katalizatorem).',
  },
];

export default function WymianaCzujnikaO2Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana czujnika O2' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana czujnika tlenu (O2)</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany czujnika tlenu w GMT400. Czujnik znajduje się w układzie wydechowym.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucz do sond, penetrant
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

        <AccordionSection title="Schemat — lokalizacja czujnika O2">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z boku (układ wydechowy):

    ┌───────────────────────────────────┐
    │                                 │
    │   [SILNIK]                      │
    │      │                          │
    │   [KOLEKTOR]                     │
    │      │                          │
    │   [O2] ← przed katalizatorem    │
    │      │                          │
    │   [KATALIZATOR]                  │
    │      │                          │
    │   [O2] ← za katalizatorem       │
    │      │                          │
    │   [TŁUMIK]                       │
    │                                 │
    └───────────────────────────────────┘

Czujniki O2 są przed i za katalizatorem.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Czujnik tlenu O2</li>
              <li>Pasta antyzapieczająca</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+O2+sensor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj czujnika O2 na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Czujnik O2 GMT400', search: 'GMT400 O2 sensor' },
                { name: 'Klucz do sond lambda', search: 'O2 sensor socket' },
                { name: 'Pasta antyzapieczająca', search: 'anti seize compound' },
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
