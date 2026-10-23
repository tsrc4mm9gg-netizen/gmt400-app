import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import KnowledgeCategory from '../KnowledgeCategory';
import Breadcrumbs from '../ui/Breadcrumbs';
const TITLES: Record<string, string> = { poradniki: 'Poradniki' };
type Props = { params: Promise<{ section: string }> };
export function generateStaticParams() { return Object.keys(TITLES).map(section => ({ section })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  if (!Object.hasOwn(TITLES, section)) return { title: 'Nie znaleziono kategorii — GMT400', robots: { index: false, follow: false } };
  return { title: `${TITLES[section]} — GMT400`, alternates: { canonical: `https://www.gmt400.pl/${section}` } };
}
async function Category({ params }: Props) {
  const { section } = await params;
  if (!Object.hasOwn(TITLES, section)) notFound();
  return <div className="mx-auto min-h-screen max-w-5xl bg-black px-5 py-10 pb-28 text-white"><Breadcrumbs items={[{ href: '/baza', label: 'Baza wiedzy' }, { label: TITLES[section] }]} /><h1 className="mt-4 text-3xl font-bold text-white">{TITLES[section]}</h1><KnowledgeCategory section={section} /></div>;
}
export default function CategoryPage(props: Props) {
  return <Suspense fallback={<p className="bg-black p-8 text-white" role="status">Ładowanie kategorii…</p>}><Category {...props} /></Suspense>;
}
