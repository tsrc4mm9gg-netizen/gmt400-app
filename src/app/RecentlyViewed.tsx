'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RECENT_EVENT, RECENT_SHOWN, clearRecent, readRecent, type RecentItem } from '@/lib/recent-viewed';

export { trackRecent } from '@/lib/recent-viewed';

/** „Ostatnio oglądane”: 3–5 ostatnio otwartych wpisów i modeli z localStorage. Brak danych = brak sekcji (także na serwerze). */
export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readRecent());
    sync();
    window.addEventListener(RECENT_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(RECENT_EVENT, sync); window.removeEventListener('storage', sync); };
  }, []);

  if (!items.length) return null;

  return (
    <section className="mx-4 mb-6" aria-label="Ostatnio oglądane" data-testid="recently-viewed">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-wide text-silver-300" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Ostatnio oglądane</h2>
        <button type="button" onClick={clearRecent} data-testid="recently-viewed-clear" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-silver-300 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Wyczyść historię</button>
      </div>
      <ul className="flex flex-col gap-2">
        {items.slice(0, RECENT_SHOWN).map(item => (
          <li key={item.id}>
            <Link
              href={item.href}
              data-testid="recently-viewed-item"
              className="flex min-h-12 items-center gap-3 rounded-lg border border-white/20 bg-neutral-900/80 px-4 py-2 text-sm text-neutral-100 hover:border-silver-500 hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500"
            >
              <span className="shrink-0 rounded-full border border-silver-600/50 px-2 py-0.5 text-xs uppercase tracking-wider text-silver-300">{item.type}</span>
              <span className="min-w-0 flex-1 truncate">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
