import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana czujnika MAP GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić czujnik MAP w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-czujnika-map' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Odłącz minus akumulatora. Czujnik MAP jest na kolektorze dolotowym.' },
  { step: 2, title: 'Zlokalizuj czujnik', desc: 'Czujnik MAP jest na górze kolektora dolotowego. Ma złącze elektryczne i wąż podciśnieniowy.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne i wąż podciśnieniowy.' },
  { step: 4, title: 'Wyjmij czujnik', desc: 'Odkręć śruby lub wyciągnij czujnik (zależnie od typu).' },
  { step: 5, title: 'Załóż nowy', desc: 'Załóż nowy czujnik. Podłącz złącze i wąż.' },
  { step: 6, title: 'Test', desc: 'Podłącz akumulator. Uruchom silnik. Skasuj kody OBD. Sprawdź, czy nie wracają.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony czujnik MAP?',
    answer: 'Objawy: kody P0106–P0108, nierówna praca silnika, zwiększone spalanie, problemy z przyspieszaniem.',
  },
  {
    question: 'Czym różni się MAP od MAF?',
    answer: 'MAP mierzy ciśnienie w kolektorze. MAF mierzy przepływ powietrza. GMT400 używa MAP.',
  },
];

export default function WymianaCzujnikaMAPPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana czujnika MAP' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana czujnika MAP</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany czujnika MAP w GMT400. Czujnik znajduje się na kolektorze dolotowym.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 15–30 minut | <strong>Narzędzia:</strong> klucze
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
              <li>Czujnik MAP</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+MAP+sensor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj czujnika MAP na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Czujnik MAP GMT400', search: 'GMT400 MAP sensor' },
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
