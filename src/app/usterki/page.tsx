import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Usterki GMT400 — Tahoe, Suburban, Silverado 1988–2000 | objawy i naprawa',
  description: 'Typowe usterki Chevrolet Tahoe, Suburban, Silverado i GMC Sierra/Yukon (GMT400 1988–2000). Objawy, przyczyny, co sprawdzić najpierw i rozwiązania krok po kroku.',
  alternates: { canonical: 'https://www.gmt400.pl/usterki' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/usterki',
    title: 'Usterki GMT400 — Tahoe, Suburban, Silverado',
    description: 'Objawy, przyczyny i naprawa typowych usterek GMT400. Sprawdź, co warto zbadać jako pierwsze.',
  },
};

export const revalidate = 900;

const faqItems = [
  {
    question: 'Jakie są najczęstsze usterki GMT400?',
    answer: 'Najczęstsze problemy to: zużyte łożyska kół (piasty), wycieki oleju z miski, problemy z pompą paliwa, zużyte amortyzatory, problemy z elektroniką (czujniki, moduły) oraz korozja progów i podłogi. W modelach z 4L60-E częste są problemy ze skrzynią.',
  },
  {
    question: 'Czy GMT400 jest trudny w naprawie?',
    answer: 'GMT400 jest stosunkowo łatwy w naprawie dzięki prostej konstrukcji i dostępności części. Większość napraw mechanicznych (hamulce, zawieszenie, silnik) można wykonać samodzielnie. Elektronika wymaga czasem diagnostyki skanerem OBD.',
  },
  {
    question: 'Gdzie kupić części do GMT400 w Polsce?',
    answer: 'Części dostępne są w Allegro, Amazon.de, sklepach z częściami amerykańskimi oraz u importerów. Numery GM (ACDelco) są uniwersalne — można je zamawiać z USA lub Europy.',
  },
  {
    question: 'Ile kosztuje naprawa typowej usterki?',
    answer: 'Koszty zależą od usterki: wymiana piasty ~300-600 zł (część + robocizna), pompa paliwa ~500-1000 zł, amortyzatory ~400-800 zł za komplet. Samodzielna naprawa obniża koszty o 50-70%.',
  },
];

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Usterka');
  return <>
    <Encyclopedia initialTab="usterki" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-silver-300">Części do najczęstszych usterek</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Pompa paliwa: <PartLink partNumber="EP381" /></li>
          <li>Filtr paliwa: <PartLink partNumber="GF626" /></li>
          <li>Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
        </ul>
      </section>
      <AffiliateBox
        title="Przydatne przy diagnostyce"
        items={[
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Multimetr', search: 'digital multimeter' },
          { name: 'Manometr paliwa', search: 'fuel pressure gauge' },
          { name: 'Termometr laserowy', search: 'infrared thermometer' },
        ]}
      />
      <FAQ items={faqItems} />
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Usterki Chevrolet/GMC GMT400', 'https://www.gmt400.pl/usterki', list)} />}
  </>;
}
