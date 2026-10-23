'use client';

import ModelHero from './ModelHero';
import CategoryGrid from './CategoryGrid';
import HomeSearch from './HomeSearch';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';

export default function HomeHero() {
  const { bodyId, filters, clearSelection } = useModelSelection();
  const body = findBody(bodyId);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <ModelHero />
      {body && (
        <div className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-lg border border-red-600/30 bg-red-950/30 px-3 py-2 text-sm text-neutral-300">
          <span>
            Materiały dla: <span className="font-semibold text-white">{body.name}</span>
            {filters.year && ` · ${filters.year}`}
            {filters.engine && ` · ${filters.engine}`}
            {filters.drivetrain && ` · ${filters.drivetrain.toUpperCase()}`}
          </span>
          <button type="button" onClick={clearSelection} className="min-h-11 shrink-0 px-2 text-xs text-red-300 underline">Wszystkie modele</button>
        </div>
      )}
      <HomeSearch />
      <CategoryGrid />
    </div>
  );
}
