'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';

type Selection = {
  bodyId: string | null;
  filters: { year?: string; engine?: string; drivetrain?: string };
};

export default function HomeHero() {
  const pathname = usePathname();
  const [selection, setSelection] = useState<Selection>({ bodyId: null, filters: {} });

  if (pathname !== '/') return null;

  return (
    <>
      <ModelHero onSelectionChange={setSelection} />
      {selection.bodyId && (
        <div className="mx-4 mb-3 rounded-lg border border-red-600/30 bg-red-950/30 px-3 py-2 text-xs text-neutral-300">
          Wybrano: <span className="text-white">{selection.bodyId}</span>
          {selection.filters.year && ` · ${selection.filters.year}`}
          {selection.filters.engine && ` · ${selection.filters.engine}`}
          {selection.filters.drivetrain && ` · ${selection.filters.drivetrain.toUpperCase()}`}
        </div>
      )}
      <CategoryGrid />
    </>
  );
}
