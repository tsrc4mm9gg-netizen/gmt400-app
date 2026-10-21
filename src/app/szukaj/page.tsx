import type { Metadata } from 'next';
import SearchPage from './SearchPage';
export const metadata: Metadata = { title: 'Szukaj w bazie wiedzy | GMT400', robots: { index: false, follow: true } };
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.slice(0, 120) : '';
  return <SearchPage query={query} />;
}
