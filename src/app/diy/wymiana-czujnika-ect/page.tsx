import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../../ui/Breadcrumbs';
import AccordionSection from '../../ui/AccordionSection';
import AffiliateBox from '../../ui/AffiliateBox';
import FAQ from '../../ui/FAQ';

export const metadata: Metadata = {
  title: 'Wymiana czujnika temperatury ECT GMT400 — instrukcja krok po kroku',
  description: 'Jak wymienić czujnik temperatury płynu (ECT) w GMT400. Procedura, lokalizacja, lista części.',
  alternates: { canonical: 'https://www.gmt400.pl/diy/wymiana-czujnika-ect' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const STEPS = [
  { step: 1, title: 'Przygotowanie', desc: 'Poczekaj aż silnik ostygnie. Odłącz minus akumulatora. Przygotuj pojemnik na płyn.' },
  { step: 2, title: 'Zlokalizuj czujnik', desc: 'Czujnik ECT jest na kolektorze dolotowym lub na głowicy. Ma złącze elektryczne.' },
  { step: 3, title: 'Odłącz złącze', desc: 'Odłącz złącze elektryczne od czujnika.' },
  { step: 4, title: 'Wykręć czujnik', desc: 'Wykręć czujnik kluczem. Przygotuj się na wyciek płynu.' },
  { step: 5, title: 'Wkręć nowy', desc: 'Wkręć nowy czujnik z nową uszczelką. Podłącz złącze.' },
  { step: 6, title: 'Uzupełnij płyn', desc: 'Uzupełnij płyn chłodniczy. Odpowietrz układ. Uruchom silnik.' },
];

const faqItems = [
  {
    question: 'Jak rozpoznać uszkodzony czujnik ECT?',
    answer: 'Objawy: kody P0115–P0119, wentylator nie włącza się, zwiększone spalanie, problemy z uruchamianiem.',
  },
  {
    question: 'Czy trzeba spuszczać płyn?',
    answer: 'Nie cały, ale może wyciekać. Przygotuj pojemnik i uzupełnij po wymianie.',
  },
];

export default function WymianaCzujnikaECTPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/diy', label: 'DIY' }, { label: 'Wymiana czujnika ECT' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">DIY</p>
        <h1 className="mt-1 text-3xl font-bold">Wymiana czujnika temperatury (ECT)</h1>
        <p className="mt-3 text-neutral-300">
          Instrukcja wymiany czujnika temperatury płynu w GMT400. Czujnik znajduje się na silniku.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="text-sm text-amber-200">
          <strong>Trudność:</strong> Łatwa | <strong>Czas:</strong> 15–30 minut | <strong>Narzędzia:</strong> klucze, pojemnik
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
              <li>Czujnik temperatury ECT</li>
              <li>Płyn chłodniczy (do uzupełnienia)</li>
            </ul>
            <a
              href={`https://www.amazon.de/s?k=GMT400+ECT+sensor&tag=${AFFILIATE_TAG}`}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Szukaj czujnika ECT na Amazon.de ↗
            </a>
          </div>
          <div className="mt-4">
            <AffiliateBox
              title=""
              items={[
                { name: 'Czujnik ECT GMT400', search: 'GMT400 ECT sensor' },
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
