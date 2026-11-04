import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Odpowietrzanie hamulców GMT400 — instrukcja krok po kroku',
  description: 'Jak odpowietrzyć układ hamulcowy w GMT400. Procedura, kolejność kół, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/odpowietrzanie-hamulcow' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Potrzebujesz pomocnika. Przygotuj pojemnik na płyn i wąż. Sprawdź poziom płynu w zbiorniczku.' },
  { step: 2, title: 'Kolejność kół', desc: 'Odpowietrzaj w kolejności: prawy tył → lewy tył → prawy przód → lewy przód.' },
  { step: 3, title: 'Podłącz wąż', desc: 'Podłącz wąż do odpowietrznika. Drugi koniec włóż do pojemnika z płynem.' },
  { step: 4, title: 'Odpowietrzaj', desc: 'Pomocnik naciska pedał i trzyma. Ty otwierasz odpowietrznik. Płyn wypływa. Zamykasz. Pomocnik puszcza pedał. Powtarzaj aż płyn będzie czysty.' },
  { step: 5, title: 'Sprawdź poziom', desc: 'Po każdym kole sprawdzaj poziom płynu w zbiorniczku. Nie dopuść do opróżnienia!' },
  { step: 6, title: 'Test', desc: 'Po odpowietrzeniu wszystkich kół sprawdź pedał hamulca. Powinien być twardy.' },
];

const faqItems = [
  {
    question: 'Kiedy odpowietrzać hamulce?',
    answer: 'Po wymianie płynu, po naprawie układu (wymiana przewodów, zacisków), gdy pedał jest miękki.',
  },
  {
    question: 'Jaki płyn hamulcowy?',
    answer: 'DOT 3 lub DOT 4. Nie mieszaj różnych typów. Sprawdź na korku zbiorniczka.',
  },
];

export default function OdpowietrzanieHamulcowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Odpowietrzanie hamulców' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Odpowietrzanie hamulców</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja odpowietrzania układu hamulcowego w GMT400. Wymaga pomocnika.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Średnia | <strong>Czas:</strong> 30–60 minut | <strong>Narzędzia:</strong> klucz, wąż, pojemnik, pomocnik
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

        <AccordionSection title="Kolejność kół">
          <div className="rounded-lg border border-white/10 bg-neutral-800 p-4">
            <pre className="overflow-x-auto text-sm text-neutral-300">
{`
Widok z góry (kolejność odpowietrzania):

    ┌───────────────────────────────────┐
    │                                 │
    │   [4] LEWY PRZÓD    [3] PRAWY PRZÓD │
    │                                 │
    │              [KABINA]           │
    │                                 │
    │   [2] LEWY TYŁ      [1] PRAWY TYŁ  │
    │                                 │
    └───────────────────────────────────┘

Zaczynaj od koła najdalszego od pompy (prawy tył).
`}
            </pre>
          </div>
        </AccordionSection>

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części i narzędzia</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Płyn hamulcowy DOT 3/DOT 4</li>
              <li>Wąż do odpowietrzania</li>
              <li>Pojemnik</li>
              <li>Pomocnik</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=DOT+3+brake+fluid&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj płynu hamulcowego na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Płyn hamulcowy DOT 3', search: 'DOT 3 brake fluid' },
                { name: 'Zestaw do odpowietrzania', search: 'brake bleeder kit' },
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
