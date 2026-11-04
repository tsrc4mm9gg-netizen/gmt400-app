import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
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

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Usterka');
  return <>
    <Encyclopedia initialTab="usterki" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <AffiliateBox
        title="Przydatne przy diagnostyce"
        items={[
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Multimetr', search: 'digital multimeter' },
          { name: 'Manometr paliwa', search: 'fuel pressure gauge' },
          { name: 'Termometr laserowy', search: 'infrared thermometer' },
        ]}
      />
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Usterki Chevrolet/GMC GMT400', 'https://www.gmt400.pl/usterki', list)} />}
  </>;
}
