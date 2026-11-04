import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import AccordionSection from '../ui/AccordionSection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Historia GMT400 rok po roku — Z71, zmiany, silniki, kolory',
  description: 'Krótka historia generacji GMT400 (1988–2000): najważniejsze zmiany, Z71, silniki Vortec, OBD-II i kolory lakierów.',
  alternates: { canonical: 'https://www.gmt400.pl/historia' },
};

const YEARS = [
  { year: '1988', note: 'Start generacji GMT400. C/K z silnikami TBI. Nowy design, prostokątne reflektory.' },
  { year: '1989', note: 'Drobne zmiany. Wprowadzenie nowych opcji wyposażenia.' },
  { year: '1990', note: 'Pojawia się 454 SS (5.7 V8, 2WD, krótka skrzynia).' },
  { year: '1991', note: 'Zmiany w zawieszeniu. Nowe opcje audio.' },
  { year: '1992', note: 'Suburban na platformie GMT400. Blazer/Tahoe 2-drzwi.' },
  { year: '1993', note: '4L60-E zastępuje 700R4. Nowa elektronika skrzyni.' },
  { year: '1994', note: 'Pojawia się 6.5 TD w wybranych wersjach. Airbag kierowcy.' },
  { year: '1995', note: 'Tahoe 4-drzwi. Koniec K5 Blazer. Airbag pasażera.' },
  { year: '1996', note: 'Vortec (L31 5.7, L29 7.4). OBD-II. Zmiana przedniego pasa. Nowy design reflektorów.' },
  { year: '1997', note: 'Drobne zmiany. Nowe kolory lakierów.' },
  { year: '1998', note: 'AutoTrac (opcjonalny) w 4x4. Denali (Yukon). Nowe fotele.' },
  { year: '1999', note: 'Ostatni pełny rok Suburban/Tahoe GMT400. Nowe kolory.' },
  { year: '2000', note: 'Koniec generacji. Silverado/Sierra przechodzą na GMT800.' },
];

const COLORS = [
  { name: 'Summit White', code: '50', years: '1988–2000' },
  { name: 'Onyx Black', code: '41', years: '1988–2000' },
  { name: 'Victory Red', code: '74', years: '1988–2000' },
  { name: 'Dark Green Metallic', code: '43', years: '1996–1999' },
  { name: 'Light Pewter Metallic', code: '14', years: '1996–1999' },
  { name: 'Indigo Blue Metallic', code: '25', years: '1996–1999' },
  { name: 'Sunset Orange', code: '67', years: '1998–1999' },
];

const TIPS = [
  { title: 'TBI vs Vortec', tip: 'TBI (1988–1995) jest prostszy w naprawie, ale mniej wydajny. Vortec (1996+) ma więcej mocy i lepsze zużycie paliwa, ale wymaga OBD-II.' },
  { title: 'Który rocznik wybrać', tip: '1996–1999 (Vortec) są najpopularniejsze. 1988–1995 (TBI) są prostsze w naprawie. Unikaj egzemplarzy z dużą korozją.' },
  { title: 'Co sprawdzić przy zakupie', tip: 'Sprawdź VIN, kody RPO, stan karoserii, silnika, skrzyni. Poproś o historię serwisową. Sprawdź, czy nie ma wycieków.' },
];

const faqItems = [
  {
    question: 'Czym różni się TBI od Vortec?',
    answer: 'TBI (1988–1995) to prostszy układ wtrysku z jedną lub dwiema dyszami. Vortec (1996+) ma wtrysk wielopunktowy, więcej mocy i lepsze zużycie paliwa. Vortec wymaga OBD-II.',
  },
  {
    question: 'Co to jest Z71?',
    answer: 'Z71 to fabryczny pakiet terenowy. Obejmuje mocniejsze zawieszenie, osłony podwozia, inne opony i czasem inne przełożenie mostu. Kod Z71 sprawdzisz na naklejce RPO w schowku.',
  },
  {
    question: 'Które roczniki mają OBD-II?',
    answer: 'OBD-II jest w modelach 1996+. Starsze (1988–1995) mają OBD-I z złączem ALDL 12-pin. OBD-II używa gniazda 16-pin i skanera.',
  },
  {
    question: 'Czy części pasują między rocznikami?',
    answer: 'Większość części mechanicznych pasuje w całej generacji. Różnice dotyczą elektroniki (TBI vs Vortec), nadwozia (zmiana pasa 1996) i wyposażenia. Zawsze sprawdzaj numer części.',
  },
];

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/modele', label: 'Modele' }, { label: 'Historia' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">Historia</p>
        <h1 className="mt-1 text-3xl font-bold">GMT400 rok po roku</h1>
        <p className="mt-3 text-neutral-300">
          Najważniejsze zmiany w generacji GMT400 (1988–2000). Z71 to pakiet terenowy (zawieszenie, osłony, opony).
        </p>
      </header>

      <div className="mt-6">
        <AccordionSection title="Wskazówki dla kupujących" defaultOpen>
          <div className="space-y-3">
            {TIPS.map(item => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <h3 className="font-semibold text-silver-200">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Historia rok po roku">
          <ul className="space-y-2">
            {YEARS.map(item => (
              <li key={item.year} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <span className="font-semibold text-silver-300">{item.year}</span>
                <p className="mt-1 text-sm text-neutral-300">{item.note}</p>
              </li>
            ))}
          </ul>
        </AccordionSection>

        <AccordionSection title="Kolory lakierów">
          <p className="mb-3 text-sm text-neutral-400">Popularne kolory GMT400. Kod koloru znajdziesz na naklejce RPO.</p>
          <ul className="space-y-2">
            {COLORS.map(c => (
              <li key={c.code} className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-800 px-3 py-2">
                <span className="text-neutral-200">{c.name}</span>
                <span className="text-sm text-neutral-400">{c.code} · {c.years}</span>
              </li>
            ))}
          </ul>
        </AccordionSection>

        <AccordionSection title="Z71 — pakiet terenowy">
          <p className="text-sm text-neutral-300">
            Z71 to fabryczny pakiet terenowy. Zwykle obejmuje mocniejsze zawieszenie, osłony podwozia, inne opony i czasem inne przełożenie mostu. Kod Z71 sprawdzisz na naklejce RPO w schowku.
          </p>
          <ul className="mt-3 list-inside list-disc text-sm text-neutral-300">
            <li>Mocniejsze amortyzatory</li>
            <li>Osłony podwozia</li>
            <li>Opony AT (All-Terrain)</li>
            <li>Czasem inne przełożenie mostu (3.73 lub 4.10)</li>
            <li>Naklejki Z71</li>
          </ul>
        </AccordionSection>

        <AccordionSection title="Silniki">
          <ul className="list-inside list-disc space-y-2 text-neutral-300">
            <li><strong>4.3 V6</strong> — najoszczędniejszy, najsłabszy (~160 KM)</li>
            <li><strong>5.0 V8</strong> — kompromis, rzadki (~175 KM)</li>
            <li><strong>5.7 TBI</strong> — 1988–1995, prosty w naprawie (~210 KM)</li>
            <li><strong>5.7 Vortec (L31)</strong> — 1996+, najpopularniejszy (~255 KM)</li>
            <li><strong>7.4 Vortec (L29)</strong> — do holowania, duże zużycie (~290 KM)</li>
            <li><strong>6.5 TD</strong> — diesel, wytrzymały, wymaga konserwacji (~180 KM)</li>
          </ul>
          <Link href="/modele" className="mt-3 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
            Porównaj modele →
          </Link>
        </AccordionSection>

        <AccordionSection title="Częste pytania">
          <FAQ items={faqItems} />
        </AccordionSection>
      </div>
    </div>
  );
}
