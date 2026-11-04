import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AffiliateBox from '../ui/AffiliateBox';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Przerwa świec GMT400 — 4.3, 5.7, 7.4',
  description: 'Typowa przerwa elektrod świec w GMT400. Wartości fabryczne mogą się różnić między silnikami i źródłami.',
  alternates: { canonical: 'https://www.gmt400.pl/swiece' },
};

const SYMPTOMS = [
  { symptom: 'Trudny rozruch', cause: 'Zużyte świece, zbyt duża przerwa, słaba cewka' },
  { symptom: 'Wypadanie zapłonu', cause: 'Uszkodzona świeca, przewód, cewka' },
  { symptom: 'Wyższe zużycie paliwa', cause: 'Zużyte świece, zła przerwa' },
  { symptom: 'Nierówna praca', cause: 'Zużyte świece, problemy z przewodami' },
];

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
  {
    question: 'Jakie przewody zapłonowe do GMT400?',
    answer: 'ACDelco 9718D to standardowy zestaw do V8. Sprawdź długość i kolejność podłączenia. Zużyte przewody powodują wypadanie zapłonu i problemy z rozruchem.',
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
                <th className="p-3">Świece</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">4.3 V6</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3"><PartLink partNumber="41-932" /></td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">5.7 Vortec (L31)</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3"><PartLink partNumber="41-932" /></td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">7.4 Vortec (L29)</td>
                <td className="p-3 text-silver-300">ok. 1.5 mm (0.060")</td>
                <td className="p-3"><PartLink partNumber="41-932" /></td>
              </tr>
              <tr className="border-t border-white/10">
                <td className="p-3 font-medium">6.5 TD</td>
                <td className="p-3 text-silver-300">świece żarowe</td>
                <td className="p-3 text-neutral-400">nie zapłonowe</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Wartości orientacyjne. W razie wątpliwości sprawdź naklejkę w komorze silnika lub instrukcję serwisową swojego rocznika.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Objawy zużytych świec</h2>
        <div className="mt-3 space-y-3">
          {SYMPTOMS.map(item => (
            <div key={item.symptom} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <h3 className="font-semibold text-silver-200">{item.symptom}</h3>
              <p className="mt-1 text-sm text-neutral-300">{item.cause}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Jak sprawdzić świece</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-neutral-300">
          <li>Odłącz przewody zapłonowe (zapamiętaj kolejność)</li>
          <li>Wykręć świece kluczem 5/8" (16 mm)</li>
          <li>Sprawdź stan elektrod (kolor, zużycie)</li>
          <li>Sprawdź przerwę szczelinomierzem (1.5 mm)</li>
          <li>W razie potrzeby wymień na nowe</li>
          <li>Dokręć momentem 15–20 Nm</li>
        </ol>
        <Link href="/momenty-dokrecania" className="mt-4 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Momenty dokręcania →
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Części zapłonu</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Świece platynowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe V8: <PartLink partNumber="9718D" /></li>
          <li>Cewka zapłonowa Vortec: <PartLink partNumber="D577" /></li>
          <li>Rozdzielacz (TBI 1988–1995): sprawdź numer na starej części</li>
        </ul>
      </section>

      <AffiliateBox
        title="Przydatne przy wymianie świec"
        items={[
          { name: 'Świece ACDelco 41-932', search: 'ACDelco 41-932' },
          { name: 'Przewody zapłonowe 9718D', search: 'ACDelco 9718D' },
          { name: 'Szczelinomierz', search: 'feeler gauge spark plug' },
          { name: 'Klucz do świec', search: 'spark plug socket 5/8' },
        ]}
      />

      <FAQ items={faqItems} />
    </div>
  );
}
