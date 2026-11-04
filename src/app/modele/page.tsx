import type { Metadata } from 'next';
import Link from 'next/link';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AccordionSection from '../ui/AccordionSection';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Modele GMT400 — Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer (1988–2000)',
  description: 'Katalog modeli Chevrolet i GMC GMT400: Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer, C/K. Rodziny, odmiany, roczniki i typowe konfiguracje.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/modele',
    title: 'Modele GMT400',
    description: 'Tahoe, Suburban, Silverado i inne modele GMT400 1988–2000.',
  },
};

export const revalidate = 900;

const TIPS = [
  { title: 'Tahoe vs Suburban', tip: 'Tahoe jest krótszy (2- lub 4-drzwiowy), Suburban dłuższy z więcej miejscem. Oba dzielą większość części mechanicznych.' },
  { title: 'Który silnik', tip: '5.7 Vortec (L31) jest najpopularniejszy — dobry kompromis. 7.4 do holowania. 4.3 V6 oszczędniejszy, ale słabszy. 6.5 diesel wytrzymały, ale wymaga konserwacji.' },
  { title: 'Który rocznik', tip: '1996–1999 (Vortec) najpopularniejsze. 1988–1995 (TBI) prostsze w naprawie. Unikaj egzemplarzy z dużą korozją.' },
];

const faqItems = [
  {
    question: 'Czym różni się Tahoe od Suburbana?',
    answer: 'Tahoe to krótszy SUV (2- lub 4-drzwiowy), Suburban to dłuższa wersja z więcej miejscem na bagaż i pasażerów. Oba bazują na tej samej platformie GMT400 i dzielą większość części mechanicznych.',
  },
  {
    question: 'Który silnik jest najlepszy w GMT400?',
    answer: '5.7 Vortec (L31) jest najpopularniejszy — dobry kompromis między mocą a zużyciem paliwa. 7.4 (L29) daje więcej mocy do holowania, ale pali więcej. 4.3 V6 jest oszczędniejszy, ale słabszy. 6.5 diesel jest wytrzymały, ale wymaga dobrej konserwacji.',
  },
  {
    question: 'Czy części pasują między modelami?',
    answer: 'Większość części mechanicznych (hamulce, zawieszenie, silnik, skrzynia) jest wspólna dla całej rodziny GMT400. Różnice dotyczą głównie nadwozia, wnętrza i wyposażenia. Zawsze sprawdzaj numer części przed zakupem.',
  },
  {
    question: 'Które roczniki są najlepsze?',
    answer: '1996–1999 (Vortec) są najpopularniejsze — nowocześniejsza elektronika, lepsze osiągi. 1988–1995 (TBI) są prostsze w naprawie. Unikaj egzemplarzy z dużą korozją, niezależnie od rocznika.',
  },
];

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Model');
  return <>
    <Encyclopedia initialTab="modele" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <div className="mb-4">
        <Link
          href="/porownanie"
          className="inline-flex items-center gap-2 rounded-xl border border-silver-600/50 bg-silver-950/30 px-4 py-3 text-silver-300 hover:border-silver-500 hover:bg-silver-950/50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Porównaj modele — Tahoe vs Suburban vs Silverado
        </Link>
      </div>

      <AccordionSection title="Wskazówki wyboru modelu" defaultOpen>
        <div className="space-y-3">
          {TIPS.map(item => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
              <h3 className="font-semibold text-silver-200">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Uniwersalne części do GMT400">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
          <li>Świece Vortec: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
          <li>Filtr powietrza Vortec: <PartLink partNumber="A1300C" /></li>
        </ul>
      </AccordionSection>

      <AccordionSection title="Przydatne przy każdym modelu">
        <AffiliateBox
          title=""
          items={[
            { name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' },
            { name: 'Skaner OBD2', search: 'OBD2 scanner' },
            { name: 'Klucz dynamometryczny', search: 'torque wrench' },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="Częste pytania">
        <FAQ items={faqItems} />
      </AccordionSection>
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Modele GMT400', 'https://www.gmt400.pl/modele', list)} />}
  </>;
}
