import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana czujnika ABS GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić czujnik ABS w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-czujnika-abs' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Podnieś auto na podpory. Zdejmij koło. Odłącz minus akumulatora.' },
  { step: 2, title: 'Zlokalizuj czujnik', desc: 'Czujnik ABS jest na zwrotnicy (przód) lub na osi (tył). Ma złącze elektryczne i jest przykręcony śrubą.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne. Może być w nadkolu lub przy ramie.' },
  { step: 4, title: 'Odkręć czujnik', desc: 'Odkręć śrubę mocującą (zwykle 10mm). Wyciągnij czujnik. Może być zapieczony — użyj penetrantu.' },
  { step: 5, title: 'Załóż nowy', desc: 'Wyczyść otwór. Załóż nowy czujnik. Przykręć śrubę. Podłącz złącze.' },
  { step: 6, title: 'Test', desc: 'Załóż koło. Podłącz akumulator. Uruchom silnik. Sprawdź, czy kontrolka ABS gaśnie.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony czujnik ABS?',
    answer: 'Objawy: świecąca kontrolka ABS, kody C0035, C0040, C0045, C0050 (zależnie od koła).',
  },
  {
    question: 'Czy trzeba kasować kody?',
    answer: 'Tak, po wymianie użyj skanera OBD2 do skasowania kodów ABS.',
  },
];

export default function WymianaCzujnikaABSPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana czujnika ABS' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana czujnika ABS</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany czujnika ABS w GMT400. Czujnik znajduje się przy kole.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> podnośnik, klucz 10mm
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

        <AccordionSection title="Schemat — lokalizacja czujnika">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z boku (koło przednie):

    ┌───────────────────────────────────┐
    │                                 │
    │   ┌──────────┐                     │
    │   │ ZWROTNICA│                     │
    │   │          │                     │
    │   │ [CZUJNIK]│ ← tu               │
    │   │    ABS   │                     │
    │   └──────────┘                     │
    │         │                           │
    │      [KOŁO]                          │
    │                                 │
    └───────────────────────────────────┘

Czujnik jest na zwrotnicy, blisko tarczy hamulcowej.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Czujnik ABS (sprawdź które koło)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+ABS+sensor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj czujnika ABS na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Czujnik ABS GMT400', search: 'GMT400 ABS sensor' },
                { name: 'Penetrant', search: 'penetrating oil' },
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
