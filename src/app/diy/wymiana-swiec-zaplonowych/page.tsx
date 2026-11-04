import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana świec zapłonowych GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić świece zapłonowe w GMT400 (Tahoe, Suburban, Silverado). Procedura, odstęp elektrod, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-swiec-zaplonowych' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Przygotuj klucz do świec i szczelinomierz.' },
  { step: 2, title: 'Zdejmij przewody', desc: 'Zdejmij przewody zapłonowe ze świec (pociągnij za nasadkę, nie za przewód). Zapamiętaj kolejność lub oznacz.' },
  { step: 3, title: 'Wykręć świece', desc: 'Użyj klucza do świec (5/8" lub 16mm). Wykręć świece. Sprawdź stan elektrod (kolor, zużycie).' },
  { step: 4, title: 'Sprawdź odstęp', desc: 'Sprawdź odstęp elektrod w nowych świecach. Vortec 4.3/5.0/5.7: 0.060" (1.5mm). Diesel 6.5: inny.' },
  { step: 5, title: 'Wkręć nowe', desc: 'Wkręć ręcznie (bez klucza) aż do oporu. Dokręć kluczem o 1/4–1/2 obrotu (lub momentem wg specyfikacji).' },
  { step: 6, title: 'Załóż przewody', desc: 'Załóż przewody na świece (kliknięcie). Podłącz akumulator. Uruchom silnik.' },
];

const faqItems = [
  {
    question: 'Jaki odstęp elektrod?',
    answer: 'Vortec 4.3/5.0/5.7: 0.060" (1.5mm). TBI 5.0/5.7: 0.035" (0.9mm). Sprawdź dla swojego silnika.',
  },
  {
    question: 'Jakie świece kupić?',
    answer: 'AC Delco lub NGK. Numer zależy od silnika. Vortec 5.7: AC Delco 41-932 lub NGK TR55.',
  },
];

export default function WymianaSwiecPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana świec zapłonowych' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana świec zapłonowych</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany świec zapłonowych w GMT400. Prosta konserwacja, która poprawia pracę silnika.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucz do świec, szczelinomierz
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

        <AccordionSection title="Odstęp elektrod">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Odstęp elektrod wg silnika:

┌───────────────────────────────────┐
│ Silnik          │ Odstęp          │
├───────────────────────────────────┤
│ Vortec 4.3     │ 0.060" (1.5mm)  │
│ Vortec 5.0     │ 0.060" (1.5mm)  │
│ Vortec 5.7     │ 0.060" (1.5mm)  │
│ Vortec 7.4     │ 0.060" (1.5mm)  │
│ TBI 5.0/5.7    │ 0.035" (0.9mm)  │
└───────────────────────────────────┘

Sprawdź odstęp szczelinomierzem przed montażem!
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Świece zapłonowe (8 szt. dla V8)</li>
              <li>Przewody zapłonowe (opcjonalnie)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=AC+Delco+41-932+spark+plugs&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj świec na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Świece AC Delco 41-932', search: 'AC Delco 41-932' },
                { name: 'Przewody zapłonowe', search: 'GMT400 spark plug wires' },
                { name: 'Szczelinomierz', search: 'spark plug gap tool' },
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
