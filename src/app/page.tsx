import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HomeHero from './HomeHero';
import JsonLd from './ui/JsonLd';

export const metadata: Metadata = {
  title: { absolute: 'GMT400: Tahoe, Suburban, Silverado 1988–2000 — usterki, VIN, poradniki' },
  description: 'Polska encyklopedia Chevroleta i GMC GMT400 (Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer, 1988–2000): dekoder VIN, usterki, DIY oraz poradniki o LPG, imporcie z USA, światłach i żółtych tablicach.',
  openGraph: { type: 'website', locale: 'pl_PL', siteName: 'GMT400', title: 'GMT400: Tahoe, Suburban, Silverado 1988–2000 — usterki, VIN, poradniki', description: 'Dekoder VIN, usterki, DIY i poradniki dla właściciela Chevroleta/GMC GMT400 w Polsce: LPG, import z USA, światła, żółte tablice.', url: 'https://www.gmt400.pl/' },
  alternates: { canonical: 'https://www.gmt400.pl/' },
};

// Stare linki typu /?tab=diy kierujemy do nowych podstron, żeby strona główna została krótka.
const LEGACY_TABS: Record<string, string> = {
  vin: '/vin',
  modele: '/modele',
  diy: '/diy',
  diy_content: '/diy',
  diycontent: '/diy',
  usterki: '/usterki',
  kody: '/kody-obd',
  schematy: '/schematy',
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const tab = typeof params.tab === 'string' ? params.tab : '';
  if (tab) redirect(LEGACY_TABS[tab] ?? `/baza?tab=${encodeURIComponent(tab)}`);
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'GMT400', url: 'https://www.gmt400.pl/', inLanguage: 'pl-PL', potentialAction: { '@type': 'SearchAction', target: 'https://www.gmt400.pl/szukaj?q={search_term_string}', 'query-input': 'required name=search_term_string' } }} />
      <HomeHero />
    </>
  );
}
