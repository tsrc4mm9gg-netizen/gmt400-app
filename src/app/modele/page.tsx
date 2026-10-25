import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Modele GMT400',
  description: 'Katalog modeli GMT400: C/K, Sierra, Tahoe, Yukon, Suburban, Blazer — rodziny, odmiany i roczniki.',
  alternates: { canonical: 'https://www.gmt400.pl/modele' },
};

// ISR: lista jest w HTML od pierwszego żądania (dla wyszukiwarek), odświeżana co 15 min. Gdy Notion nie odpowiada, strona pobiera dane w przeglądarce.
export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Model');
  return <>
    <Encyclopedia initialTab="modele" initialItems={items} />
    {list.length > 0 && <JsonLd data={itemListJsonLd('Modele GMT400', 'https://www.gmt400.pl/modele', list)} />}
  </>;
}
