'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ImageLightbox from '../ImageLightbox';
import { BUYER_CHECK, BUYER_ITEM_IDS, BUYER_PL_LINKS, BUYER_SECTIONS, BUYER_SOURCE, BUYER_STORAGE_KEY, readChecked } from '@/lib/buyer-checklist.mjs';

const chip = 'inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-neutral-900 px-3 text-sm font-semibold text-silver-300 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';

export default function BuyerChecklist() {
  const [checked, setChecked] = useState<Record<string, true>>({});
  const [ready, setReady] = useState(false);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    try { setChecked(readChecked(window.localStorage.getItem(BUYER_STORAGE_KEY))); } catch { /* brak localStorage */ }
    setReady(true);
  }, []);

  const save = (next: Record<string, true>) => {
    setChecked(next);
    try { window.localStorage.setItem(BUYER_STORAGE_KEY, JSON.stringify({ version: 1, checked: next })); } catch { /* tryb prywatny */ }
  };
  const toggle = (id: string) => {
    const next = { ...checked };
    if (next[id]) delete next[id]; else next[id] = true;
    save(next);
  };
  const done = BUYER_ITEM_IDS.filter(id => checked[id]).length;

  return (
    <div className="mt-5 space-y-4" data-testid="buyer-checklist" data-ready={ready ? '1' : '0'}>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/15 bg-neutral-950 p-3">
        <p className="text-sm text-neutral-200" aria-live="polite" data-testid="buyer-progress">Sprawdzone: <strong className="text-white">{done}</strong> z {BUYER_ITEM_IDS.length}</p>
        <button type="button" onClick={() => save({})} disabled={!done} className={`${chip} ml-auto disabled:opacity-40`} data-testid="buyer-reset">Wyczyść listę</button>
      </div>
      <p className="rounded-xl border border-silver-600/50 bg-neutral-950 p-3 text-sm text-neutral-300">{BUYER_CHECK}</p>

      <nav aria-label="Sekcje poradnika" className="flex flex-wrap gap-2">
        {BUYER_SECTIONS.map(sec => <a key={sec.id} href={`#${sec.id}`} className={chip}>{sec.title}</a>)}
        <a href="#procedury" className={chip}>Procedury i opłaty</a>
      </nav>

      {BUYER_SECTIONS.map(sec => {
        const secDone = sec.items.filter(i => checked[i.id]).length;
        return (
          <section key={sec.id} id={sec.id} aria-labelledby={`h-${sec.id}`} className="scroll-mt-20 rounded-2xl border border-white/15 bg-neutral-950 p-3 sm:p-4" data-testid="buyer-section">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`h-${sec.id}`} className="text-xl font-bold text-silver-400">{sec.title}</h2>
              <span className="text-xs text-neutral-400">{secDone}/{sec.items.length}</span>
            </div>
            {sec.image && (
              <button type="button" onClick={() => setZoom(sec.image!)} className="mt-3 block w-full overflow-hidden rounded-xl border border-white/10 bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500" aria-label={`Powiększ: ${sec.image.alt}`}>
                <img src={sec.image.src} alt={sec.image.alt} width={1200} height={840} loading="lazy" className="h-auto w-full" />
              </button>
            )}
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {sec.items.map(item => {
                const on = !!checked[item.id];
                return (
                  <li key={item.id} style={{ maxWidth: 'none' }} className={`rounded-xl border p-2 ${on ? 'border-silver-500/70 bg-neutral-900' : 'border-white/10 bg-black'}`} data-testid="buyer-item" data-id={item.id} data-checked={on ? '1' : '0'}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3">
                      <input type="checkbox" checked={on} onChange={() => toggle(item.id)} className="mt-0.5 h-6 w-6 shrink-0 accent-silver-400" style={{ minWidth: 24 }} data-testid="buyer-check" />
                      <span className={`text-sm leading-6 ${on ? 'text-neutral-400' : 'text-neutral-100'}`}>{item.text}</span>
                    </label>
                    <p className="mt-1 pl-9 text-xs text-neutral-400">
                      {item.page && <>Źródło: <a href={BUYER_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline decoration-silver-500 underline-offset-2 hover:text-white">instrukcja GM 1999</a>, {item.page}.</>}
                      {item.link && <Link href={item.link[0]} className="inline-flex min-h-11 items-center font-semibold text-silver-300 underline underline-offset-2">{item.link[1]} →</Link>}
                    </p>
                  </li>
                );
              })}
            </ul>
            {sec.links && sec.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sec.links.map(([href, label]) => <Link key={href} href={href} className={chip}>{label} →</Link>)}
              </div>
            )}
          </section>
        );
      })}

      <section id="procedury" aria-labelledby="h-procedury" className="scroll-mt-20 rounded-2xl border border-white/15 bg-neutral-950 p-3 sm:p-4" data-testid="buyer-procedures">
        <h2 id="h-procedury" className="text-xl font-bold text-silver-400">Procedury i opłaty w Polsce</h2>
        <p className="mt-2 text-sm text-neutral-300">Kwot i procedur nie powtarzamy tutaj — aktualne opłaty z datami i linkami do przepisów są w poradnikach poniżej.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {BUYER_PL_LINKS.map(([href, label]) => <Link key={href} href={href} className={chip}>{label} →</Link>)}
        </div>
      </section>

      <p className="text-xs text-neutral-400" data-testid="buyer-sources">Źródło kontroli: <a href={BUYER_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">{BUYER_SOURCE.label}</a> (kopia w folderze „Dokumenty GMT400”). Sprawdź w swoim aucie.</p>
      {zoom && <ImageLightbox src={zoom.src} alt={zoom.alt} onClose={() => setZoom(null)} />}
    </div>
  );
}
