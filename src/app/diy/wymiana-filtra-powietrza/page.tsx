import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana filtra powietrza GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić filtr powietrza w GMT400. Procedura, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-filtra-powietrza' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Zlokalizuj obudowę', desc: 'Obudowa filtra powietrza jest pod maską, przy silniku. Ma pokrywę z klipsami lub śrubami.' },
  { step: 2, title: 'Otwórz obudowę', desc: 'Odkręć klipsy lub śruby pokrywy. Zdejmij pokrywę.' },
  { step: 3, title: 'Wyjmij filtr', desc: 'Wyciągnij stary filtr. Sprawdź jego stan (brud, uszkodzenia).' },
  { step: 4, title: 'Wyczyść obudowę', desc: 'Wytrzyj wnętrze obudowy wilgotną szmatką. Usuń liście i brud.' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy filtr (sprawdź orientację — strzałka kierunku przepływu).' },
  { step: 6, title: 'Zamknij obudowę', desc: 'Załóż pokrywę. Zatrzaśnij klipsy lub przykręć śruby.' },
];

const faqItems = [
  {
    question: 'Jak często wymieniać filtr?',
    answer: 'Co 15 000–30 000 km lub co rok. Częściej przy jeździe w kurzu.',
  },
  {
    question: 'Czy można czyścić filtr?',
    answer: 'Filtry papierowe — nie. Filtry sportowe (K&N) — tak, specjalnym preparatem.',
  },
];

export default function WymianaFiltraPowietrzaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana filtra powietrza' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana filtra powietrza</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany filtra powietrza w GMT400. Najprostsza konserwacja.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 5–10 minut | <strong>Narzędzia:</strong> brak
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

        <AccordionSection title="Czego potrzebujesz" defaultOpen>
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
            <h3 className="font-semibold text-amber-300">Części</h3>
            <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
              <li>Filtr powietrza</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+air+filter&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj filtra na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Filtr powietrza GMT400', search: 'GMT400 air filter' },
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
