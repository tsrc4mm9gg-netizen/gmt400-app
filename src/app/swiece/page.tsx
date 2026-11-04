import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';

export const metadata: Metadata = {
  title: 'Przerwa świec GMT400 — 4.3, 5.7, 7.4',
  description: 'Typowa przerwa elektrod świec w GMT400. Wartości fabryczne mogą się różnić między silnikami i źródłami.',
  alternates: { canonical: 'https://www.gmt400.pl/swiece' },
};

const faqItems = [
  {
    question: 'Jakie świece do GMT400 Vortec?',
    answer: 'ACDelco 41-932 (platynowe) są zalecane do silników Vortec 1996+. Przerwa: ok. 1.5 mm (0.060"). Można też użyć NGK lub Bosch o podobnych parametrach.',
  },
  {
    question: 'Jak często wymieniać świece?',
    answer: 'Platynowe (41-932): co 100000 km. Standardowe: co 30000–50000 km. Sprawdź przerwę przy wymianie. Zużyte świece powodują wypadanie zapłonu i wyższe zużycie paliwa.',
  },
  {
    question: 'Jak sprawdzić przerwę świec?',
    answer: 'Użyj szczelinomierza (feeler gauge). Wsuń blaszkę 1.5 mm między elektrody. Powinna wchodzić z lekkim oporem. Zbyt duża przerwa = słaba iskra. Zbyt mała = szybkie zużycie.',
  },
  {
    question: 'Czy można używać świec irydowych?',
    answer: 'Tak, ale nie są konieczne. Platynowe (41-932) są wystarczające dla GMT400. Irydowe mogą działać dłużej, ale są droższe. Ważniejsze jest regularne sprawdzanie przerwy.',
  },
];

export default function SparkPlugsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/baza', label: 'Baza wiedzy' }, { label: 'Świece' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">Zapłon</p>
        <h1 className="mt-1 text-3xl font-bold">Przerwa świec w GMT400</h1>
        <p className="mt-3 text-neutral-300">
          W dokumentach GM dla silników 4.3 i 7.4 pojawiają się różne wartości przerwy. Poniżej najczęstsze wartości fabryczne.
        </p>
      </header>

      <section className="mt-6">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="p-3">Silnik</th>
                <th className="p-3">Typowa przerwa</th>
                <th className="p-3">Uwagi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">4.3 V6</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3 text-neutral-400">Vortec</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">5.7 Vortec (L31)</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3 text-neutral-400">najczęstsza</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">7.4 Vortec (L29)</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3 text-neutral-400">sprawdź w instrukcji</td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">6.5 TD</td>
                <td className="p-3 text-silver-300">świece żarowe</td>
                <td className="p-3 text-neutral-400">nie świece zapłonowe</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Wartości orientacyjne. W razie wątpliwości sprawdź naklejkę w komorze silnika lub instrukcję serwisową swojego rocznika.
        </p>
      </section>

      <FAQ items={faqItems} />
    </div>
  );
}
