import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AffiliateBox from '../ui/AffiliateBox';

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

const faqItems = [
  {
    question: 'Ile może holować GMT400?',
    answer: 'Zależy od modelu i wyposażenia. Tahoe/Suburban 1500: 5000–6500 lb (2300–3000 kg). 2500/3500: 7500–10000+ lb (3400–4500 kg). Sprawdź naklejkę w schowku lub instrukcję.',
  },
  {
    question: 'Czy potrzebuję specjalnego wyposażenia do holowania?',
    answer: 'Tak: hak holowniczy, wiązka elektryczna, ewentualnie pakiet chłodzenia (dodatkowa chłodnica ATF). Przy ciężkim holowaniu rozważ skrzynię 4L80-E i przełożenie mostu 3.73 lub 4.10.',
  },
  {
    question: 'Jakie przełożenie mostu do holowania?',
    answer: '3.42: uniwersalne, dobre na autostradę. 3.73: lepsze do holowania, wyższe obroty. 4.10: najlepsze do ciężkiego holowania, ale wyższe zużycie paliwa. Sprawdź kod RPO (GU4, GU6, GT4, GT5).',
  },
  {
    question: 'Czy 4L60-E nadaje się do holowania?',
    answer: 'Tak, ale z ograniczeniami. 4L60-E wytrzymuje do ~5000 lb. Przy cięższym holowaniu lepiej 4L80-E. Regularna wymiana ATF jest kluczowa przy holowaniu.',
  },
  {
    question: 'Jakie hamulce do przyczepy?',
    answer: 'Przy przyczepach powyżej 1500 kg wymagane są hamulce. Sterownik hamulców przyczepy montuje się w kabinie. Sprawdź przepisy w swoim kraju.',
  },
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

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Kody RPO przełożeń mostu</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-neutral-300">
          <li><strong>GU4</strong> — 3.08 (rzadkie, oszczędne)</li>
          <li><strong>GU6</strong> — 3.42 (uniwersalne)</li>
          <li><strong>GT4</strong> — 3.73 (do holowania)</li>
          <li><strong>GT5</strong> — 4.10 (ciężkie holowanie)</li>
        </ul>
        <p className="mt-2 text-xs text-neutral-400">Kody RPO znajdziesz na naklejce w schowku lub na słupku drzwi.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Wyposażenie do holowania</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Hak holowniczy (sprawdź klasę: II, III, IV)</li>
          <li>Wiązka elektryczna (7-pin lub 13-pin)</li>
          <li>Sterownik hamulców przyczepy</li>
          <li>Dodatkowa chłodnica ATF (przy ciężkim holowaniu)</li>
          <li>Lusterka holownicze (opcjonalnie)</li>
        </ul>
      </section>

      <AffiliateBox
        title="Przydatne przy holowaniu"
        items={[
          { name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' },
          { name: 'Filtr ATF TF289', search: 'ACDelco TF289' },
          { name: 'Płyn chłodniczy', search: 'coolant antifreeze' },
        ]}
      />

      <FAQ items={faqItems} />
    </div>
  );
}
