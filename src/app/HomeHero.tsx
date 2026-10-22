'use client';

import { usePathname } from 'next/navigation';
import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';
import { useModelSelection } from './ModelSelectionContext';

export default function HomeHero() {
  const pathname = usePathname();
  const { bodyId, filters } = useModelSelection();

  if (pathname !== '/') return null;

  return (
    <>
      <ModelHero />
      {bodyId && (
        <div className="mx-4 mb-3 rounded-lg border border-red-600/30 bg-red-950/30 px-3 py-2 text-xs text-neutral-300">
          Wybrano: <span className="text-white">{bodyId}</span>
          {filters.year && ` · ${filters.year}`}
          {filters.engine && ` · ${filters.engine}`}
          {filters.drivetrain && ` · ${filters.drivetrain.toUpperCase()}`}
        </div>
      )}
      <CategoryGrid />
    </>
  );
}
