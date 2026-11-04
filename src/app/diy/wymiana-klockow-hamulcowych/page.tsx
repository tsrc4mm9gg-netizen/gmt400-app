import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana klocków hamulcowych GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić klocki hamulcowe w GMT400 (Tahoe, Suburban, Silverado). Procedura, lista narzędzi i części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-klockow-hamulcowych' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Podnieś auto na podpory. Zdejmij koło. Poluzuj korek zbiorniczka płynu hamulcowego (nie odkręcaj całkowicie).' },
  { step: 2, title: 'Odkręć zacisk', desc: 'Odkręć śruby zacisku (zwykle 2). Odchyl zacisk do góry lub zdejmij. Nie odłączaj przewodu hamulcowego!' },
  { step: 3, title: 'Wyjmij klocki', desc: 'Wyjmij stare klocki z zacisku. Sprawdź grubość tarcz. Jeśli są rowkowane lub cienkie — wymień.' },
  { step: 4, title: 'Wciśnij tłoczek', desc: 'Użyj ściskacza do tłoczków lub szczypiec. Wciśnij tłoczek do zacisku (płyn wróci do zbiorniczka).' },
  { step: 5, title: 'Załóż nowe klocki', desc: 'Załóż nowe klocki. Posmaruj punkty styku smarem miedziowym (nie na powierzchnię cierna!). Załóż zacisk.' },
  { step: 6, title: 'Dokręć i testuj', desc: 'Przykręć śruby zacisku (moment wg specyfikacji). Załóż koło. Pompuj pedał hamulca kilka razy. Sprawdź poziom płynu.' },
];

const faqItems = [
  {
    question: 'Kiedy wymieniać klocki?',
    answer: 'Gdy grubość okładziny spadnie poniżej 3 mm, słychać piszczenie lub zgrzytanie, lub pedał hamulca jest miękki.',
  },
  {
    question: 'Czy wymieniać tarcze razem z klockami?',
    answer: 'Nie zawsze. Sprawdź grubość i stan tarcz. Jeśli są rowkowane, pęknięte lub poniżej minimalnej grubości — wymień.',
  },
];

export default function WymianaKlockowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana klocków hamulcowych' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana klocków hamulcowych</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany klocków hamulcowych w GMT400. Podstawowa konserwacja, którą można wykonać samodzielnie.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 30–60 minut (oś) | <strong>Narzędzia:</strong> podnośnik, klucze, ściskacz do tłoczków
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

        <AccordionSection title="Schemat — zacisk hamulcowy">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z boku (zacisk przedni):

    ┌───────────────────────────────────┐
    │                                 │
    │   ┌──────────────────┐             │
    │   │    ZACISK     │             │
    │   │  ┌──────────┐   │             │
    │   │  │ KLOCKI  │   │ ← tu        │
    │   │  └──────────┘   │             │
    │   │       │        │             │
    │   │    [TARCZA]     │             │
    │   └───────────────────┘             │
    │                                 │
    └───────────────────────────────────┘

Klocki są wewnątrz zacisku, po obu stronach tarczy.
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Klocki hamulcowe (przód lub tył)</li>
              <li>Smar miedziowy</li>
              <li>Płyn hamulcowy (jeśli niski poziom)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+brake+pads&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj klocków na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Klocki hamulcowe GMT400', search: 'GMT400 brake pads' },
                { name: 'Ściskacz do tłoczków', search: 'brake caliper tool' },
                { name: 'Smar miedziowy', search: 'copper anti seize' },
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
