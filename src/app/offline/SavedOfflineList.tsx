'use client';
import { useEffect, useState } from 'react';

/** Lista poradników zapisanych przyciskiem „Zapisz offline” (z pamięci przeglądarki). Zwykłe linki <a> — bez sieci działa pełne przeładowanie przez service workera. */
export default function SavedOfflineList() {
  const [items, setItems] = useState<{ url: string; title: string }[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('gmt400_saved_offline') || '[]')); } catch { /* nic */ }
  }, []);
  if (!items.length) return null;
  return (
    <section className="mt-6" aria-labelledby="saved-offline-h">
      <h2 id="saved-offline-h" className="text-lg font-semibold">Zapisane offline</h2>
      <ul className="mt-2 divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-950">
        {items.map(i => (
          <li key={i.url}><a href={i.url} className="flex min-h-11 items-center px-4 py-2 text-silver-200 hover:text-white">{i.title}</a></li>
        ))}
      </ul>
    </section>
  );
}
