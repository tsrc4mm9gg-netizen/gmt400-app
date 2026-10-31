'use client';
import { useEffect, useState } from 'react';

export const SAVED_CACHE = 'gmt400-saved';
type State = 'unsupported' | 'idle' | 'saving' | 'saved' | 'error';

/** „Zapisz offline”: zapisuje tę stronę (i jej obrazy) w pamięci przeglądarki — działa potem bez internetu (przez service worker). */
export default function SaveOfflineButton({ title }: { title: string }) {
  const [state, setState] = useState<State>('unsupported');
  useEffect(() => {
    if (typeof caches === 'undefined' || !('serviceWorker' in navigator)) return;
    let alive = true;
    caches.open(SAVED_CACHE).then(c => c.match(location.pathname)).then(hit => { if (alive) setState(hit ? 'saved' : 'idle'); }).catch(() => alive && setState('idle'));
    return () => { alive = false; };
  }, []);
  if (state === 'unsupported') return null;

  const save = async () => {
    setState('saving');
    try {
      const cache = await caches.open(SAVED_CACHE);
      const page = location.pathname;
      const res = await fetch(page, { credentials: 'same-origin', cache: 'reload' });
      if (!res.ok) throw new Error(String(res.status));
      await cache.put(page, res);
      // Obrazy, skrypty i style tej strony — żeby po otwarciu bez internetu wyglądała tak samo.
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('main img')).map(i => i.currentSrc || i.src).slice(0, 30);
      const assets = [...Array.from(document.scripts).map(s => s.src), ...Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')).map(l => l.href)];
      await Promise.all([...imgs, ...assets].filter(src => src && src.startsWith(location.origin)).map(src => cache.add(src).catch(() => {})));
      const list = JSON.parse(localStorage.getItem('gmt400_saved_offline') || '[]') as { url: string; title: string }[];
      localStorage.setItem('gmt400_saved_offline', JSON.stringify([{ url: page, title }, ...list.filter(x => x.url !== page)].slice(0, 100)));
      setState('saved');
    } catch { setState('error'); }
  };
  const remove = async () => {
    const page = location.pathname;
    try {
      await (await caches.open(SAVED_CACHE)).delete(page);
      const list = JSON.parse(localStorage.getItem('gmt400_saved_offline') || '[]') as { url: string }[];
      localStorage.setItem('gmt400_saved_offline', JSON.stringify(list.filter(x => x.url !== page)));
    } catch { /* nic */ }
    setState('idle');
  };

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="save-offline" data-state={state}>
      {state === 'saved' ? (
        <>
          <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-silver-500/50 bg-silver-950/60 px-3 text-sm font-semibold text-silver-100">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            Zapisano offline
          </span>
          <button type="button" onClick={remove} className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm text-neutral-400 underline-offset-4 hover:text-white hover:underline">Usuń z offline</button>
        </>
      ) : (
        <button type="button" onClick={save} disabled={state === 'saving'} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 bg-[linear-gradient(180deg,#2a2a2f,#151517)] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-silver-400 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M5 19.5h14" /></svg>
          {state === 'saving' ? 'Zapisywanie…' : 'Zapisz offline'}
        </button>
      )}
      {state === 'error' ? <span role="alert" className="text-sm text-danger-300">Nie udało się zapisać — spróbuj ponownie przy połączeniu z internetem.</span> : null}
    </div>
  );
}
