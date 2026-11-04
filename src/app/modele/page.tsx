import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import AffiliateBox from '../ui/AffiliateBox';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Modele GMT400 — Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer (1988–2000)',
  description: 'Katalog modeli Chevrolet i GMC GMT400: Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer, C/K. Rodziny, odmiany, roczniki i typowe konfiguracje.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/modele',
    title: 'Modele GMT400',
    description: 'Tahoe, Suburban, Silverado i inne modele GMT400 1988–2000.',
  },
};

export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Model');
  return <>
    <Encyclopedia initialTab="modele" initialItems={items} />
    <div className="mx-auto max-w-3xl px-4">
      <AffiliateBox
        title="Przydatne przy każdym modelu"
        items={[
          { name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' },
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Klucz dynamometryczny', search: 'torque wrench' },
        ]}
      />
    </div>
    {list.length > 0 && <JsonLd data={itemListJsonLd('Modele GMT400', 'https://www.gmt400.pl/modele', list)} />}
  </>;
}
