import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'DIY GMT400 — naprawy Tahoe, Suburban, Silverado krok po kroku',
  description: 'Poradniki DIY dla Chevrolet Tahoe, Suburban, Silverado i GMC GMT400 (1988–2000). Wymiany, obsługa i naprawy z listą narzędzi i części. Sprawdź w swoim aucie.',
  alternates: { canonical: 'https://www.gmt400.pl/diy' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/diy',
    title: 'DIY GMT400 — naprawy krok po kroku',
    description: 'Instrukcje napraw i wymian dla Tahoe, Suburban, Silverado i innych GMT400.',
  },
};

export const revalidate = 900;

const TOOLS_LIST = [
  { category: 'Podstawowe', items: ['Zestaw kluczy nasadowych (metryczne i calowe)', 'Klucz dynamometryczny', 'Śrubokręty (płaskie i krzyżakowe)', 'Szczypce', 'Młotek gumowy'] },
  { category: 'Do podnoszenia', items: ['Podnośnik hydrauliczny', 'Podpory (jack stands) — minimum 2', 'Kliny pod koła'] },
  { category: 'Do płynów', items: ['Lejek', 'Pojemniki na zużyty olej', 'Rękawice nitrylowe', 'Czyściwo / szmaty'] },
  { category: 'Do diagnostyki', items: ['Skaner OBD2', 'Multimetr', 'Szczelinomierz (do świec)', 'Latarka'] },
];

const DIY_TIPS = [
  { title: 'Przygotuj narzędzia', tip: 'Przed rozpoczęciem sprawdź, czy masz wszystkie potrzebne narzędzia. Brak klucza w połowie pracy to strata czasu.' },
  { title: 'Używaj podpór', tip: 'Nigdy nie pracuj pod autem opartym tylko na podnośniku. Zawsze używaj podpór (jack stands).' },
  { title: 'Odłącz akumulator', tip: 'Przy pracach elektrycznych odłącz minus akumulatora. Zapobiega zwarciom i przypadkowemu uruchomieniu.' },
  { title: 'Dokręcaj momentem', tip: 'Krytyczne połączenia (koła, hamulce, zawieszenie) dokręcaj kluczem dynamometrycznym. Wartości są w sekcji Momenty.' },
];

const faqItems = [
  {
    question: 'Czy mogę samodzielnie naprawiać GMT400?',
    answer: 'Tak, GMT400 jest przyjazny dla DIY. Prosta konstrukcja, dostępne części i dużo poradników online ułatwiają naprawy. Większość prac mechanicznych (hamulce, zawieszenie, wymiana oleju, świec) można wykonać w garażu.',
  },
  {
    question: 'Jakie narzędzia są potrzebne do podstawowych napraw?',
    answer: 'Podstawowy zestaw: klucze nasadowe (metryczne i calowe), klucz dynamometryczny, śrubokręty, szczypce, podnośnik i podpory. Do diagnostyki: skaner OBD2, multimetr. Do płynów: lejek, pojemniki, rękawice.',
  },
  {
    question: 'Gdzie znajdę instrukcje napraw?',
    answer: 'Na tej stronie znajdziesz poradniki DIY z krokami, listą narzędzi i części. Dodatkowo warto sprawdzić fora GMT400.com, YouTube (kanały z naprawami) oraz oficjalne manuale GM.',
  },
  {
    question: 'Czy naprawy DIY są bezpieczne?',
    answer: 'Tak, przy zachowaniu zasad bezpieczeństwa. Zawsze używaj podpór pod autem, odłączaj akumulator przy pracach elektrycznych, pracuj w dobrze wentylowanym miejscu. Przy hamulcach i zawieszeniu dokładnie sprawdzaj momenty dokręcania.',
  },
];

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Porada');
  return <>
    <Encyclopedia initialTab="diy" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-silver-300">Lista narzędzi</h2>
        <p className="mt-2 text-sm text-neutral-400">Podstawowy zestaw do większości napraw GMT400.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {TOOLS_LIST.map(cat => (
            <div key={cat.category} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <h3 className="font-semibold text-silver-200">{cat.category}</h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-neutral-300">
                {cat.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-silver-300">Wskazówki przed rozpoczęciem</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {DIY_TIPS.map(item => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-neutral-900 p-4">
              <h3 className="font-semibold text-silver-200">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-silver-300">Części do napraw DIY</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
          <li>Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
          <li>Filtr ATF: <PartLink partNumber="TF289" /></li>
          <li>Pompa wody: <PartLink partNumber="252-711" /></li>
        </ul>
      </section>
      <AffiliateBox
        title="Przydatne przy naprawach DIY"
        items={[
          { name: 'Klucz dynamometryczny', search: 'torque wrench' },
          { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Multimetr', search: 'digital multimeter' },
        ]}
      />
      <FAQ items={faqItems} />
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Poradniki DIY GMT400', 'https://www.gmt400.pl/diy', list)} />}
  </>;
}
