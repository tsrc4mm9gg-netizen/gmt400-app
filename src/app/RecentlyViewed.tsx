'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type RecentItem = {
  id: string;
  title: string;
  href: string;
  type: string;
};

const STORAGE_KEY = 'gmt400-recent';

export function trackRecent(item: RecentItem) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const next = [item, ...list.filter(x => x.id !== item.id)].slice(0, 8);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  if (!items.length) return null;

  return (
    <section className="mx-4 mb-6" aria-label="Ostatnio oglądane">
      <h2 className="mb-3 text-lg font-semibold tracking-wide text-silver-300" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Ostatnio oglądane
      </h2>
      <div className="flex flex-col gap-2">
        {items.slice(0, 5).map(item => (
          <Link
            key={item.id}
            href={item.href}
            className="flex min-h-12 items-center rounded-lg border border-white/15 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-200 hover:border-silver-500 hover:bg-neutral-800"
          >
            <span className="mr-2 text-xs uppercase tracking-wider text-silver-500">{item.type}</span>
            <span className="truncate">{item.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
