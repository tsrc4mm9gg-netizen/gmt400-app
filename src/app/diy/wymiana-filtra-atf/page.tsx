import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana filtra ATF i płynu skrzyni GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić filtr ATF i płyn w skrzyni 4L60E/4L80E w GMT400. Procedura, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-filtra-atf' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Podnieś auto na podpory. Przygotuj pojemnik na ATF (ok. 5–7 litrów). Odłącz minus akumulatora.' },
  { step: 2, title: 'Spust ATF', desc: 'Odkręć korek spustowy miski olejowej skrzyni (jeśli jest) lub poluzuj śruby miski i pozwól płynowi spłynąć.' },
  { step: 3, title: 'Zdejmij miskę', desc: 'Odkręć śruby miski olejowej. Zdejmij miskę ostrożnie. Wylej resztę płynu.' },
  { step: 4, title: 'Wymień filtr', desc: 'Wyciągnij stary filtr (może być wciśnięty). Załóż nowy filtr. Wymień uszczelkę miski.' },
  { step: 5, title: 'Załóż miskę', desc: 'Załóż miskę z nową uszczelką. Dokręć śruby momentem (od środka na zewnątrz).' },
  { step: 6, title: 'Wlej ATF', desc: 'Wlej ATF (Dexron III) do poziomu. Uruchom silnik, przełącz biegi P-R-N-D. Sprawdź poziom na ciepło.' },
];

const faqItems = [
  {
    question: 'Jak często wymieniać filtr ATF?',
    answer: 'Co 50 000–100 000 km lub co 3–5 lat. Częściej przy ciężkiej eksploatacji (holowanie, jazda w mieście).',
  },
  {
    question: 'Jaki płyn ATF?',
    answer: 'Dexron III (lub kompatybilny). Nie używaj Dexron VI w starszych skrzyniach bez sprawdzenia kompatybilności.',
  },
];

export default function WymianaFiltraATFPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana filtra ATF' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana filtra ATF i płynu skrzyni</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany filtra ATF i płynu w skrzyni 4L60E/4L80E w GMT400.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 1–2 godziny | <strong>Narzędzia:</strong> podnośnik, klucze, pojemnik
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

        <AccordionSection title="Schemat — miska olejowa skrzyni">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z dołu (skrzynia 4L60E):

    ┌───────────────────────────────────┐
    │                                 │
    │   ┌─────────────────────────┐   │
    │   │   MISKA OLEJOWA       │   │
    │   │                       │   │
    │   │   [FILTR] ← wewnątrz  │   │
    │   │                       │   │
    │   └─────────────────────────┘   │
    │                                 │
    └───────────────────────────────────┘

Filtr jest wewnątrz miski, wciśnięty w pompę.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Filtr ATF (z uszczelką miski)</li>
              <li>Płyn ATF Dexron III (5–7 litrów)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+4L60E+filter+kit&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj filtra ATF na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Filtr ATF 4L60E', search: '4L60E filter kit' },
                { name: 'Płyn Dexron III', search: 'Dexron III ATF' },
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
