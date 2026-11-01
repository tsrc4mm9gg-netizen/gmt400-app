import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Modele GMT400 — Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer (1988–2000)',
  description: 'Katalog modeli Chevrolet i GMC GMT400: Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer, C/K. Rodziny, odmiany, roczniki i typowe konfiguracje.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
  openGraph: {
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
    {list.length > 0 && <JsonLd data={itemListJsonLd('Modele GMT400', 'https://www.gmt400.pl/modele', list)} />}
  </>;
}
