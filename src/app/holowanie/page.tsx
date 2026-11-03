import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Holowanie i ładowność GMT400 — według rocznika i wersji',
  description: 'Przybliżone ładowności i możliwości holowania GMT400 (Tahoe, Suburban, C/K). Wartości zależą od silnika, przełożenia mostu i wyposażenia.',
  alternates: { canonical: 'https://www.gmt400.pl/holowanie' },
};

const DATA = [
  { model: 'Suburban 1500', years: '1992–1999', tow: 'ok. 5000–6500 lb', note: '5.7 TBI/Vortec, zależnie od przełożenia' },
  { model: 'Suburban 2500', years: '1992–1999', tow: 'ok. 7500–10000 lb', note: '5.7 / 7.4 / 6.5 TD' },
  { model: 'Tahoe 1500', years: '1995–2000', tow: 'ok. 5000–6000 lb', note: 'głównie 5.7 Vortec' },
  { model: 'C/K 1500', years: '1988–1998', tow: 'ok. 4000–7000 lb', note: 'zależnie od silnika i mostu' },
  { model: 'C/K 2500/3500', years: '1988–2000', tow: 'ok. 6000–10000+ lb', note: '7.4 i 6.5 TD wyżej' },
];

export default function TowingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/baza', label: 'Baza wiedzy' }, { label: 'Holowanie' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">Holowanie</p>
        <h1 className="mt-1 text-3xl font-bold">Holowanie i ładowność GMT400</h1>
        <p className="mt-3 text-neutral-300">
          Wartości są przybliżone i zależą od silnika, przełożenia mostu, skrzyni, wyposażenia i rocznika. Zawsze sprawdź naklejkę w schowku lub instrukcję swojego auta.
        </p>
      </header>

      <section className="mt-6">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-300">
              <tr>
                <th className="p-3">Model</th>
                <th className="p-3">Lata</th>
                <th className="p-3">Holowanie</th>
                <th className="p-3">Uwagi</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map(row => (
                <tr key={row.model} className="border-t border-white/10">
                  <td className="p-3 font-medium">{row.model}</td>
                  <td className="p-3 text-neutral-300">{row.years}</td>
                  <td className="p-3 text-silver-300">{row.tow}</td>
                  <td className="p-3 text-neutral-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Źródła: instrukcje GM i dane fabryczne. Wartości orientacyjne.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Co wpływa na ładowność</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-neutral-300">
          <li>Przełożenie mostu (3.42 / 3.73 / 4.10)</li>
          <li>Silnik (5.7 Vortec holuje lepiej niż starszy TBI)</li>
          <li>Skrzynia (4L80-E wytrzymuje więcej niż 4L60-E)</li>
          <li>Pakiet chłodzenia i hak</li>
        </ul>
        <Link href="/narzedzia/rpo" className="mt-3 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Sprawdź kody RPO swojego auta →
        </Link>
      </section>
    </div>
  );
}
