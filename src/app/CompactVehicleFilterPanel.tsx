'use client';
import { useEffect, useRef, useState } from 'react';
import { useVehicleProfile, type VehicleProfile } from './VehicleProfileProvider';
import { setFilterSheetTarget } from './FilterSheetSlot';
import { useModelSelection } from './ModelSelectionContext';
import { findBody } from '../lib/body-styles';
import { profileChipLabel } from '../lib/profile-fit';
const LABELS = { relevant: 'Dla mojego auta', all: 'Wszystkie', within_scope: 'Zgodne z zakresem', general: 'Ogólne', unknown: 'Nieustalone', outside_scope: 'Poza zakresem' };
type Mode = keyof typeof LABELS;
// Wysokość przyklejonego nagłówka strony: na telefonie pasek (site-header-bar), od lg cały nagłówek.
function headerOffset() {
  for (const id of ['site-header', 'site-header-bar']) {
    const element = document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
    if (element && getComputedStyle(element).position === 'sticky' && getComputedStyle(element).display !== 'contents') return Math.round(element.getBoundingClientRect().height);
  }
  return 0;
}
/** Smukły przyklejony pasek listy: plakietka auta + „Filtry” (arkusz z filtrami sekcji i trybem profilu). */
export default function CompactVehicleFilterPanel({ profile, active, scoped, mode, counts, fitting, onModeChange }: { profile: VehicleProfile | null; active: boolean; scoped: boolean; mode: Mode; counts: Record<Mode, number>; fitting: number; onModeChange: (value: Mode) => void }) {
  const { ready, openEditor } = useVehicleProfile();
  const { bodyId } = useModelSelection();
  const body = findBody(bodyId);
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const root = document.documentElement;
    const measure = () => {
      const offset = headerOffset();
      setTop(offset);
      // Kotwice i przewijanie do elementów nie chowają się pod nagłówkiem i paskiem filtrów.
      root.style.scrollPaddingTop = `${offset + (bar.current?.offsetHeight || 0) + 8}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (bar.current) observer.observe(bar.current);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); root.style.scrollPaddingTop = ''; };
  }, []);
  useEffect(() => () => setFilterSheetTarget(null), []);
  const openSheet = () => { const dialog = sheet.current; if (dialog && !dialog.open) { dialog.showModal(); setOpen(true); } };
  const closeSheet = () => sheet.current?.close();
  const label = ready ? profileChipLabel(profile) || 'Ustaw auto' : 'Profil auta';
  const button = (value: Mode) => <button key={value} type="button" aria-pressed={mode === value} onClick={() => onModeChange(value)} className="min-h-11 rounded-lg border px-3 py-2 text-[0.9375rem] font-semibold" style={{ background: mode === value ? 'var(--surface-hi)' : '#151517', borderColor: mode === value ? 'var(--border-strong)' : 'rgba(255,255,255,.3)', color: mode === value ? 'var(--accent-soft)' : '#fff' }}>{mode === value ? '✓ ' : ''}{LABELS[value]} ({counts[value]})</button>;
  const changed = active && scoped && mode !== 'relevant';
  const activeCount = (body ? 1 : 0) + (changed ? 1 : 0);
  return <>
    <section ref={bar} aria-label="Filtrowanie według profilu auta" data-testid="list-filter-bar" className="sticky z-30 -mx-4 mb-4 border-b border-white/10 bg-black/95 px-4 py-1.5 backdrop-blur-md" style={{ top }}>
      <h3 className="sr-only">Materiały według profilu auta</h3>
      <div className="flex items-center gap-2">
        <button type="button" data-testid="profile-chip" onClick={openEditor} aria-label={profile && ready ? `Moje auto: ${label}. Zmień profil auta` : 'Ustaw auto — profil jest opcjonalny'} className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-white/20 bg-neutral-900 px-4 text-left text-sm font-semibold text-silver-100">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="2"><path d="M3 13l2-5h14l2 5v5h-2M3 13v5h2M3 13h18M7 18h10" /><circle cx="7" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" /></svg>
          <span className="truncate">{label}</span>
        </button>
        <button type="button" data-testid="filters-open" aria-haspopup="dialog" aria-expanded={open} aria-label={activeCount ? `Filtry (aktywne: ${[body ? `model ${body.name}` : '', changed ? `tryb ${LABELS[mode]}` : ''].filter(Boolean).join(', ')})` : 'Filtry'} onClick={openSheet} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-silver-300/60 bg-neutral-800 px-4 text-[0.9375rem] font-semibold text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
          Filtry{activeCount > 0 && <span aria-hidden="true" data-testid="filters-active-count" className="grid h-5 min-w-5 place-items-center rounded-full bg-silver-200 px-1 text-xs font-bold text-neutral-950">{activeCount}</span>}
        </button>
      </div>
      <dialog ref={sheet} aria-label="Filtry" data-testid="filters-sheet" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget || (event.target as Element).closest('a[href]')) closeSheet(); }} className="gmt-filter-sheet">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <h3 className="text-lg font-semibold text-white">Filtry</h3>
          <button type="button" onClick={closeSheet} data-testid="filters-close" className="min-h-11 rounded-full border border-white/20 px-4 text-sm font-semibold text-silver-100">Zamknij</button>
        </div>
        <div ref={setFilterSheetTarget} data-testid="filters-section" className="pt-4 empty:hidden" />
        <section aria-label="Profil auta" className="mt-4 border-t border-white/10 pt-4">
          <h4 className="mb-2 text-sm font-semibold text-silver-200">Profil auta</h4>
          <div id="vehicle-profile-launcher" />
          {!active ? <p className="mt-2 text-xs text-neutral-400">Obecnie nie ograniczamy list według konfiguracji. Profil jest opcjonalny.</p> : !scoped ? <p className="mt-2 text-xs leading-relaxed text-neutral-400">Katalog modeli pokazuje wszystkie rodziny — profil auta nie ukrywa modeli.</p> : <>
            <div className="mt-3 grid grid-cols-2 gap-2">{button('relevant')}{button('all')}</div>
            <p className="mt-2 text-xs leading-relaxed text-neutral-400">„Wszystkie” wyłącza filtrowanie profilem. Wpisy wprost opisujące Twoje auto (model, silnik, napęd lub skrzynia) są na górze listy z plakietką „pasuje do Twojego auta”{fitting ? ` (${fitting})` : ''}.</p>
            <div role="group" aria-label="Zaawansowane zakresy dopasowania" className="mt-4 border-t border-white/10 pt-3">
              <h4 className="mb-2 text-sm font-semibold text-silver-200">Zaawansowane zakresy</h4>
              <div className="grid grid-cols-2 gap-2">{(['within_scope', 'general', 'unknown', 'outside_scope'] as Mode[]).map(button)}</div>
              <p className="mt-3 text-xs leading-relaxed text-neutral-400">Brak metadanych to „Nieustalone”, nie potwierdzenie zgodności. Zgodność z zakresem nie potwierdza technicznej poprawności instrukcji. Liczniki są obliczane przed wyszukiwaniem i dodatkowymi filtrami sekcji.</p>
            </div>
          </>}
        </section>
        <div className="sticky bottom-0 mt-4 border-t border-white/10 bg-neutral-950 pt-3"><button type="button" onClick={closeSheet} className="min-h-11 w-full rounded-full border border-silver-300 bg-silver-600 px-4 font-semibold text-neutral-950">Pokaż wyniki</button></div>
      </dialog>
    </section>
    {active && scoped && mode !== 'all' && counts[mode] === 0 && <div role="status" className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-neutral-900 p-4 text-sm text-neutral-300"><p className="font-semibold text-white">Brak wyników dla Twojego profilu — pokaż wszystko</p><button type="button" data-testid="profile-show-all" className="min-h-11 rounded-full border border-silver-300 bg-silver-600 px-4 font-semibold text-neutral-950" onClick={() => onModeChange('all')}>Pokaż wszystko</button></div>}
  </>;
}
