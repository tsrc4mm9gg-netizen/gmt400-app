import type { Metadata } from 'next';
import Encyclopedia from '../Encyclopedia';
import { getListEntries } from '../../lib/notion-entries';

export const metadata: Metadata = {
  title: 'Baza wiedzy',
  description: 'Wszystkie sekcje encyklopedii GMT400: modele, usterki, kody, DIY, VIN/RPO, części, serwis i więcej.',
  alternates: { canonical: 'https://www.gmt400.pl/baza' },
};

// Strona statyczna (build): domyślna zakładka „Modele” jest w HTML; gdy Notion nie odpowiada w buildzie, strona pobiera dane w przeglądarce.
export const dynamic = 'force-static';
export const revalidate = false;

export default async function BazaPage() {
  return <Encyclopedia initialItems={await getListEntries()} />;
}
