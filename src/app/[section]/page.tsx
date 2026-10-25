import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import KnowledgeCategory from '../KnowledgeCategory';
import Breadcrumbs from '../ui/Breadcrumbs';
import JsonLd from '../ui/JsonLd';
import { getListEntries, itemListJsonLd } from '../../lib/notion-entries';
const TITLES: Record<string, string> = { poradniki: 'Poradniki' };
type Props = { params: Promise<{ section: string }> };
export function generateStaticParams() { return Object.keys(TITLES).map(section => ({ section })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!Object.hasOwn(TITLES, section)) return { title: 'Nie znaleziono kategorii — GMT400', robots: { index: false, follow: false } };
  return { title: `${TITLES[section]} — GMT400`, alternates: { canonical: `https://www.gmt400.pl/${section}` } };
}
// ISR: lista poradników jest w HTML (dla wyszukiwarek), odświeżana co 15 min.
export const revalidate = 900;
async function Category({ params }: Props) {
  const { section } = await params;
  if (!Object.hasOwn(TITLES, section)) notFound();
  const items = await getListEntries();
  const list = (items ?? []).filter(entry => entry.Typ === 'Porada');
  return <div className="mx-auto min-h-screen max-w-5xl bg-black px-5 py-10 pb-28 text-white"><Breadcrumbs items={[{ href: '/baza', label: 'Baza wiedzy' }, { label: TITLES[section] }]} /><h1 className="mt-4 text-3xl font-bold text-white">{TITLES[section]}</h1><KnowledgeCategory section={section} initialItems={items} />{list.length > 0 && <JsonLd data={itemListJsonLd('Poradniki GMT400', `https://www.gmt400.pl/${section}`, list)} />}</div>;
}
export default function CategoryPage(props: Props) {
  return <Category {...props} />;
}
