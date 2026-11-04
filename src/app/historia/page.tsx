import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Historia GMT400 rok po roku — Z71, zmiany, silniki',
  description: 'Krótka historia generacji GMT400 (1988–2000): najważniejsze zmiany, Z71, silniki Vortec i OBD-II.',
  alternates: { canonical: 'https://www.gmt400.pl/historia' },
};

const YEARS = [
  { year: '1988', note: 'Start generacji GMT400. C/K z silnikami TBI.' },
  { year: '1992', note: 'Suburban na platformie GMT400. Blazer/Tahoe 2-drzwi.' },
  { year: '1994', note: 'Pojawia się 6.5 TD w wybranych wersjach.' },
  { year: '1995', note: 'Tahoe 4-drzwi. Koniec K5 Blazer.' },
  { year: '1996', note: 'Vortec (L31 5.7, L29 7.4). OBD-II. Zmiana przedniego pasa.' },
  { year: '1998', note: 'AutoTrac (opcjonalny) w 4x4. Denali (Yukon).' },
  { year: '1999', note: 'Ostatni pełny rok Suburban/Tahoe GMT400.' },
  { year: '2000', note: 'Koniec generacji. Silverado/Sierra przechodzą na GMT800.' },
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

      <section className="mt-6">
        <ul className="space-y-3">
          {YEARS.map(item => (
            <li key={item.year} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <span className="font-semibold text-silver-300">{item.year}</span>
              <p className="mt-1 text-sm text-neutral-300">{item.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Z71</h2>
        <p className="mt-2 text-sm text-neutral-300">
          Z71 to fabryczny pakiet terenowy. Zwykle obejmuje mocniejsze zawieszenie, osłony podwozia, inne opony i czasem inne przełożenie mostu. Kod Z71 sprawdzisz na naklejce RPO w schowku.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Silniki</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li><strong>4.3 V6</strong> — najoszczędniejszy, najsłabszy</li>
          <li><strong>5.0 V8</strong> — kompromis, rzadki</li>
          <li><strong>5.7 TBI</strong> — 1988–1995, prosty w naprawie</li>
          <li><strong>5.7 Vortec (L31)</strong> — 1996+, najpopularniejszy</li>
          <li><strong>7.4 Vortec (L29)</strong> — do holowania, duże zużycie</li>
          <li><strong>6.5 TD</strong> — diesel, wytrzymały, wymaga konserwacji</li>
        </ul>
        <Link href="/modele" className="mt-4 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Porównaj modele →
        </Link>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
