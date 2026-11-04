import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana rozrusznika GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić rozrusznik w GMT400 (Tahoe, Suburban, Silverado). Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-rozrusznika' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Podnieś auto na podpory lub najedź na kanał.' },
  { step: 2, title: 'Zlokalizuj rozrusznik', desc: 'Rozrusznik jest z dołu silnika, po stronie kierowcy lub pasażera (zależnie od silnika).' },
  { step: 3, title: 'Odłącz przewody', desc: 'Odłącz gruby przewód z akumulatora i cienki przewód sterujący.' },
  { step: 4, title: 'Odkręć rozrusznik', desc: 'Odkręć śruby mocujące (zwykle 2–3). Wyciągnij rozrusznik.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy rozrusznik. Przykręć śruby. Podłącz przewody.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Sprawdź, czy rozrusznik kręci płynnie.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony rozrusznik?',
    answer: 'Objawy: klikanie przy próbie uruchomienia, rozrusznik nie kręci, kręci wolno, zgrzytanie.',
  },
  {
    question: 'Czy to rozrusznik czy akumulator?',
    answer: 'Sprawdź napięcie akumulatora (min. 12.4V). Jeśli OK, a rozrusznik nie kręci — to rozrusznik lub przekaźnik.',
  },
];

export default function WymianaRozrusznikaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana rozrusznika' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana rozrusznika</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany rozrusznika w GMT400. Rozrusznik znajduje się z dołu silnika.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> podnośnik, klucze
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

        <AccordionSection title="Schemat — lokalizacja rozrusznika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z dołu silnika:

    ┌───────────────────────────────────┐
    │                                 │
    │   [SILNIK]                      │
    │                                 │
    │   ┌──────────┐                     │
    │   │ROZRUSZNIK│ ← tu             │
    │   └──────────┘                     │
    │         │                           │
    │      [KOŁO ZAMACHOWE]              │
    │                                 │
    └───────────────────────────────────┘

Rozrusznik jest z dołu, przy kole zamachowym.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Rozrusznik</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+starter&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj rozrusznika na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Rozrusznik GMT400', search: 'GMT400 starter' },
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
