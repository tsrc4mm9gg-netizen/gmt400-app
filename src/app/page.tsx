import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HomeHero from './HomeHero';

export const metadata: Metadata = {
  title: { absolute: 'GMT400 Encyklopedia — Chevrolet/GMC C/K, Tahoe, Suburban, Yukon 1988–2000' },
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
  return <HomeHero />;
}
