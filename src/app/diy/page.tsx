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

const AFFILIATE_TAG = 'gmt400pl-20';

function amazonSearch(query: string) {
  return `https://www.amazon.de/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}

const FEATURED_GUIDES = [
  { href: '/diy/kodowanie-pilota', title: 'Kodowanie pilota centralnego zamka', desc: 'Jak zaprogramować pilot do GMT400 — procedura z gniazdem OBD2' },
  { href: '/diy/wymiana-pompy-paliwa', title: 'Wymiana pompy paliwa', desc: 'Jak wymienić pompę paliwa w zbiorniku — procedura krok po kroku' },
  { href: '/diy/wymiana-termostatu', title: 'Wymiana termostatu', desc: 'Jak wymienić termostat — prosta naprawa w 30–60 minut' },
  { href: '/diy/wymiana-pompy-wody', title: 'Wymiana pompy wody', desc: 'Jak wymienić pompę wody — procedura z przodu silnika' },
  { href: '/diy/wymiana-klockow-hamulcowych', title: 'Wymiana klocków hamulcowych', desc: 'Jak wymienić klocki hamulcowe — podstawowa konserwacja' },
  { href: '/diy/wymiana-swiec-zaplonowych', title: 'Wymiana świec zapłonowych', desc: 'Jak wymienić świece — odstęp elektrod i procedura' },
];

const TOOLS_LIST = [
  { category: 'Podstawowe', items: [
    { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
    { name: 'Klucz dynamometryczny', search: 'torque wrench' },
    { name: 'Śrubokręty', search: 'screwdriver set' },
    { name: 'Szczypce', search: 'pliers set' },
    { name: 'Młotek gumowy', search: 'rubber mallet' },
  ]},
  { category: 'Do podnoszenia', items: [
    { name: 'Podnośnik hydrauliczny', search: 'hydraulic floor jack' },
    { name: 'Podpory (jack stands)', search: 'jack stands' },
    { name: 'Kliny pod koła', search: 'wheel chocks' },
  ]},
  { category: 'Do płynów', items: [
    { name: 'Lejek', search: 'funnel' },
    { name: 'Pojemniki na zużyty olej', search: 'oil drain pan' },
    { name: 'Rękawice nitrylowe', search: 'nitrile gloves' },
    { name: 'Czyściwo / szmaty', search: 'shop towels' },
  ]},
  { category: 'Do diagnostyki', items: [
    { name: 'Skaner OBD2', search: 'OBD2 scanner' },
    { name: 'Multimetr', search: 'digital multimeter' },
    { name: 'Szczelinomierz', search: 'feeler gauge' },
    { name: 'Latarka', search: 'LED flashlight' },
  ]},
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
      <AccordionSection title="Poradniki krok po kroku" defaultOpen>
        <ul className="space-y-2">
          {FEATURED_GUIDES.map(g => (
            <li key={g.href}>
              <Link href={g.href} className="block rounded-lg border border-white/10 bg-neutral-800 p-3 hover:border-silver-500">
                <h3 className="font-semibold text-silver-200">{g.title}</h3>
                <p className="mt-1 text-sm text-neutral-400">{g.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </AccordionSection>

      <AccordionSection title="Lista narzędzi">
        <p className="mb-3 text-sm text-neutral-400">Podstawowy zestaw do większości napraw GMT400. Kliknij, aby zobaczyć na Amazonie.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOOLS_LIST.map(cat => (
            <div key={cat.category} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
              <h3 className="font-semibold text-silver-200">{cat.category}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {cat.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href={amazonSearch(item.search)}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline"
                    >
                      {item.name} <span className="text-xs opacity-50">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Wskazówki przed rozpoczęciem">
        <div className="grid gap-3 sm:grid-cols-2">
          {DIY_TIPS.map(item => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
              <h3 className="font-semibold text-silver-200">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
            </div>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection title="Części do napraw DIY">
        <ul className="list-inside list-disc space-y-2 text-neutral-300">
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
          <li>Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
          <li>Filtr ATF: <PartLink partNumber="TF289" /></li>
          <li>Pompa wody: <PartLink partNumber="252-711" /></li>
        </ul>
      </AccordionSection>

      <AccordionSection title="Przydatne przy naprawach DIY">
        <AffiliateBox
          title=""
          items={[
            { name: 'Klucz dynamometryczny', search: 'torque wrench' },
            { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
            { name: 'Skaner OBD2', search: 'OBD2 scanner' },
            { name: 'Multimetr', search: 'digital multimeter' },
          ]}
        />
      </AccordionSection>

      <AccordionSection title="Częste pytania">
        <FAQ items={faqItems} />
      </AccordionSection>
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Poradniki DIY GMT400', 'https://www.gmt400.pl/diy', list)} />}
  </>;
}
