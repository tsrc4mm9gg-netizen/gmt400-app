import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Usterki Tahoe, Suburban, Silverado (GMT400) — objawy i naprawa',
  description: 'Typowe usterki Tahoe, Suburban, Silverado, Sierra i Yukona (GMT400, 1988–2000): objawy, przyczyny i rozwiązania z zakresem modeli i roczników.',
  alternates: { canonical: 'https://www.gmt400.pl/usterki' },
};

// ISR: lista jest w HTML od pierwszego żądania (dla wyszukiwarek), odświeżana co 15 min. Gdy Notion nie odpowiada, strona pobiera dane w przeglądarce.
export const revalidate = 900;

export default async function Page() {
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Usterka');
  return <>
    <Encyclopedia initialTab="usterki" initialItems={items} />
    {list.length > 0 && <JsonLd data={itemListJsonLd('Usterki Chevrolet/GMC GMT400', 'https://www.gmt400.pl/usterki', list)} />}
  </>;
}
