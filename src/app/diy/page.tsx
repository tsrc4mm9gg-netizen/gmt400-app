import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
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

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Porada');
  return <>
    <Encyclopedia initialTab="diy" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <AffiliateBox
        title="Przydatne przy naprawach DIY"
        items={[
          { name: 'Klucz dynamometryczny', search: 'torque wrench' },
          { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Multimetr', search: 'digital multimeter' },
        ]}
      />
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Poradniki DIY GMT400', 'https://www.gmt400.pl/diy', list)} />}
  </>;
}
