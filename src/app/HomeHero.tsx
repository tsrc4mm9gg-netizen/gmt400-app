'use client';

import { usePathname } from 'next/navigation';
import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';

export default function HomeHero() {
  const pathname = usePathname();
  if (pathname !== '/') return null;

  return (
    <>
      <ModelHero />
      <CategoryGrid />
    </>
  );
}
