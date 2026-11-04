import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana uszczelki kolektora dolotowego GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić uszczelkę kolektora dolotowego w GMT400 Vortec. Procedura, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-uszczelki-kolektora' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Spuść płyn chłodniczy.' },
  { step: 2, title: 'Zdejmij obudowę filtra', desc: 'Zdejmij obudowę filtra powietrza i przewód dolotowy.' },
  { step: 3, title: 'Odłącz przewody', desc: 'Odłącz przewody paliwowe, złącza elektryczne, linkę gazu. Oznacz je, żeby nie pomylić.' },
  { step: 4, title: 'Odkręć kolektor', desc: 'Odkręć śruby kolektora dolotowego (kolejność od zewnątrz do środka). Zdejmij kolektor.' },
  { step: 5, title: 'Wymień uszczelkę', desc: 'Usuń starą uszczelkę. Wyczyść powierzchnię. Załóż nową uszczelkę (sprawdź orientację).' },
  { step: 6, title: 'Złóż', desc: 'Załóż kolektor. Dokręć śruby momentem (od środka na zewnątrz). Podłącz wszystko. Wlej płyn. Uruchom.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzoną uszczelkę kolektora?',
    answer: 'Objawy: wyciek płynu chłodniczego, biały dym z wydechu, przegrzewanie, mieszanie się płynu z olejem.',
  },
  {
    question: 'Czy to trudna naprawa?',
    answer: 'Tak, to jedna z bardziej złożonych napraw DIY. Wymaga cierpliwości i dokładności. Czas: 4–8 godzin.',
  },
];

export default function WymianaUszczelkiKolektoraPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana uszczelki kolektora' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana uszczelki kolektora dolotowego</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany uszczelki kolektora dolotowego w GMT400 Vortec (1996–2000). Klasyczna usterka.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Wysoka | <strong>Czas:</strong> 4–8 godzin | <strong>Narzędzia:</strong> klucze, klucz dynamometryczny
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

        <AccordionSection title="Schemat — kolektor dolotowy">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z góry silnika Vortec:

    ┌───────────────────────────────────┐
    │                                 │
    │   ┌────────────────────────┐     │
    │   │   KOLEKTOR DOLOTOWY   │     │
    │   │                       │     │
    │   │   [USZCZELKA] ← tu    │     │
    │   │                       │     │
    │   └─────────────────────────┘     │
    │         │         │               │
    │      [GŁOWICA] [GŁOWICA]          │
    │                                 │
    └───────────────────────────────────┘

Uszczelka jest między kolektorem a głowicami.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Uszczelka kolektora dolotowego</li>
              <li>Uszczelniacz (RTV)</li>
              <li>Płyn chłodniczy</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+intake+manifold+gasket&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj uszczelki na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Uszczelka kolektora GMT400', search: 'GMT400 intake gasket' },
                { name: 'Uszczelniacz RTV', search: 'RTV silicone gasket maker' },
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
