import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana paska klinowego GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić pasek klinowy w GMT400. Procedura, schemat prowadzenia, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-paska-klinowego' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Zrób zdjęcie schematu prowadzenia paska (naklejka na masce lub silniku).' },
  { step: 2, title: 'Poluzuj napinacz', desc: 'Użyj klucza lub dźwigni do poluzowania napinacza. Zdejmij pasek z koła napinacza.' },
  { step: 3, title: 'Zdejmij pasek', desc: 'Zdejmij pasek ze wszystkich kół. Sprawdź stan kół (luzy, hałasy).' },
  { step: 4, title: 'Załóż nowy pasek', desc: 'Załóż nowy pasek zgodnie ze schematem. Zaczynaj od dołu, kończ na napinaczu.' },
  { step: 5, title: 'Zwolnij napinacz', desc: 'Zwolnij napinacz. Sprawdź, czy pasek jest prawidłowo na wszystkich kołach.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Sprawdź, czy pasek nie piszczy i nie spada.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać zużyty pasek?',
    answer: 'Objawy: pęknięcia, postrzępienia, piszczenie przy uruchamianiu, ślizganie się.',
  },
  {
    question: 'Jak często wymieniać pasek?',
    answer: 'Co 60 000–100 000 km lub co 4–6 lat. Sprawdzaj przy każdej wymianie oleju.',
  },
];

export default function WymianaPaskaKlinowegoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana paska klinowego' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana paska klinowego</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany paska klinowego w GMT400. Pasek napędza alternator, pompę wody i inne osprzęt.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 15–30 minut | <strong>Narzędzia:</strong> klucz do napinacza
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

        <AccordionSection title="Schemat — prowadzenie paska">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z przodu silnika (przykład Vortec):

    ┌───────────────────────────────────┐
    │                                 │
    │   [ALT]                         │
    │     │                           │
    │   [NAP] ← napinacz              │
    │     │                           │
    │   [POMPA] ← pompa wody          │
    │     │                           │
    │   [WAŁ] ← koło wału            │
    │                                 │
    └───────────────────────────────────┘

Dokładny schemat jest na naklejce pod maską.
Zrób zdjęcie przed zdjęciem paska!
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Pasek klinowy (sprawdź długość)</li>
              <li>Napinacz (opcjonalnie)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+serpentine+belt&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj paska na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Pasek klinowy GMT400', search: 'GMT400 serpentine belt' },
                { name: 'Napinacz paska', search: 'GMT400 belt tensioner' },
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
