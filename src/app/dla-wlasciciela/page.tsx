import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '../../lib/guides';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import AccordionSection from '../ui/AccordionSection';

export const metadata: Metadata = {
  title: 'Najważniejsze dla właściciela w PL — poradniki GMT400',
  description: 'LPG, sprowadzenie i rejestracja z USA/UE, światła na europejskie i żółte tablice — poradniki dla właściciela GMT400 w Polsce, każda liczba ze źródłem i datą.',
  alternates: { canonical: 'https://www.gmt400.pl/dla-wlasciciela' },
};

const TIPS = [
  { title: 'Przed zakupem', tip: 'Sprawdź VIN, historię serwisową, stan karoserii. Porównaj ceny w USA i Polsce. Uwzględnij koszty transportu i rejestracji.' },
  { title: 'Przy rejestracji', tip: 'Przygotuj dokumenty: dowód, umowa, tłumaczenia. Sprawdź wymagania dotyczące świateł. Rozważ żółte tablice (powyżej 25 lat).' },
  { title: 'Po rejestracji', tip: 'Zamontuj LPG (jeśli planujesz). Wymień światła na europejskie. Zaplanuj przegląd i wymianę płynów.' },
];

const faqItems = [
  {
    question: 'Czy warto montować LPG w GMT400?',
    answer: 'Tak, przy dużym przebiegu. GMT400 pali 12–18L/100km benzyny. LPG obniża koszty o 40–50%. Instalacja sekwencyjna: 3000–5000 zł. Zwrot po 20000–30000 km. Wymaga dobrej instalacji i regularnej regulacji.',
  },
  {
    question: 'Ile kosztuje sprowadzenie GMT400 z USA?',
    answer: 'Transport: 3000–6000 zł (kontener). Cło: 10% wartości. VAT: 23%. Akcyza: 3.1% (do 2000 cm³) lub 18.6% (powyżej). Rejestracja: ~500 zł. Razem: 15000–30000 zł ponad cenę auta.',
  },
  {
    question: 'Jakie światła do rejestracji w Polsce?',
    answer: 'Europejskie (E-mark) lub homologowane. Amerykańskie reflektory nie przejdą przeglądu. Wymiana: 500–1500 zł. Kierunkowskazy muszą być pomarańczowe (nie czerwone).',
  },
  {
    question: 'Czy GMT400 może mieć żółte tablice?',
    answer: 'Tak, jeśli ma powyżej 25 lat (rocznik 2000 lub starszy). Żółte tablice (pojazd zabytkowy) dają ulgi: brak przeglądów, niższe OC. Wymaga opinii rzeczoznawcy.',
  },
];

export default function GuidesHub() {
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: 'Poradniki PL' }]} />
        <header className="my-6">
          <p className="text-sm uppercase tracking-widest text-silver-300">Najważniejsze dla właściciela w PL</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Poradniki dla właściciela GMT400 w Polsce</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-300">Cztery tematy, o które pytacie najczęściej. Każda kwota i przepis ma źródło z datą; rozbieżności i braki oznaczamy wprost. Przepisy się zmieniają — sprawdź w urzędzie.</p>
        </header>

        <AccordionSection title="Wskazówki dla właściciela w PL" defaultOpen>
          <div className="space-y-3">
            {TIPS.map(item => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <h3 className="font-semibold text-silver-200">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {GUIDES.map(g => (
            <li key={g.slug}>
              <Link href={'/dla-wlasciciela/' + g.slug} className="block h-full rounded-xl border-2 border-silver-700/50 bg-neutral-900 p-5 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
                <h2 className="text-xl font-semibold">{g.short}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-300">{g.description}</p>
                <p className="mt-3 text-xs text-silver-300">Stan na: {g.asOf} · {g.years}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/porady-wlasciciela" className="mt-6 block rounded-xl border-2 border-silver-700/50 bg-neutral-900 p-5 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
          <h2 className="text-xl font-semibold">Porady właściciela (tips &amp; tricks) →</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-300">4×4, przyczepa, opony i łańcuchy, pilot i PassLock, bezpieczniki, kody ALDL, test kompresji — z instrukcji GM, ze stroną źródła i filtrem wg Twojego auta.</p>
        </Link>

        <div className="mt-6">
          <AccordionSection title="Przydatne dla właściciela">
            <AffiliateBox
              title=""
              items={[
                { name: 'Skaner OBD2', search: 'OBD2 scanner' },
                { name: 'Klucz dynamometryczny', search: 'torque wrench' },
                { name: 'Zestaw kluczy', search: 'socket set metric' },
              ]}
            />
          </AccordionSection>

          <AccordionSection title="Częste pytania">
            <FAQ items={faqItems} />
          </AccordionSection>
        </div>
      </div>
    </div>
  );
}
