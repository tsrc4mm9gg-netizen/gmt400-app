'use client';
import { useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import QuickAccess from './QuickAccess';
import styles from './HomePresentation.module.css';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', icon: 'M3 10l9-7 9 7v11h-6v-7H9v7H3z', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'data', label: 'Modele i dane', icon: 'M4 4h7v16H4zM13 4h7v16h-7zM6 8h3M15 8h3M6 12h3M15 12h3', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'service', label: 'Serwis i części', icon: 'M14 4a6 6 0 0 0-7 8L3 16a3 3 0 0 0 5 5l4-4a6 6 0 0 0 8-7l-4 3-4-4z', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips', 'czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', icon: 'M5 7h14l2 14H3zM8 7V5a4 4 0 0 1 8 0v2', ids: ['kupujacy', 'import', 'kalkulator'] },
];
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, minWidth: 0, width: '100%' };
const tile: CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0, height: 60, padding: '8px 12px', margin: 0, border: '1px solid #353537', borderRadius: 10, background: '#232325', color: '#eeeeef', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: '20px', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'anywhere', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' };
function afterRender(action: () => void) { requestAnimationFrame(() => requestAnimationFrame(action)); }
function reveal(target: HTMLElement, focus = false) {
  const header = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 0);
  window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header - 16), behavior: 'instant' });
  if (focus) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
}
export default function GroupedNavigation({ categories, active, onSelect, instance }: { categories: Category[]; active: string; onSelect: (id: string) => void; instance: 'menu' | 'sections' }) {
  const [menuGroup, setMenuGroup] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);
  const activeGroup = GROUPS.find(group => group.ids.includes(active));
  const selected = instance === 'menu' ? GROUPS.find(group => group.id === menuGroup) ?? activeGroup : activeGroup;
  const entries = selected?.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)) ?? [];
  function enter(id: string) {
    onSelect(id);
    afterRender(() => { const content = document.getElementById('content'); const target = content?.querySelector<HTMLElement>('h2, h1') ?? content; if (target) reveal(target, true); });
  }
  function chooseGroup(id: string) {
    const group = GROUPS.find(entry => entry.id === id);
    if (!group) return;
    if (instance === 'menu') { setMenuGroup(id); return; }
    const first = group.ids.find(section => categories.some(category => category.id === section));
    if (!first) return;
    onSelect(activeGroup?.id === id ? active : first);
    afterRender(() => { if (nav.current) reveal(nav.current); });
  }
  return <nav ref={nav} className={`gmt-navigation ${styles.root}`} data-layout={instance === 'menu' ? 'menu' : 'flow'} aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'} style={{ gridColumn: '1 / -1', boxSizing: 'border-box', position: 'static', width: '100%', minWidth: 0, padding: 6, background: '#171717', borderRadius: 10, ...(instance === 'menu' ? { maxHeight: '65dvh', overflowY: 'auto' } : {}) }}>
    {instance === 'sections' ? <QuickAccess onSelect={enter} /> : <Link href="/swiat-gmt400" className="mb-4 flex min-h-12 items-center rounded-lg border border-red-600 px-3 py-2 text-red-300 underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500">Świat GMT400 — historie i ciekawostki</Link>}
    <p style={{ margin: '0 0 10px', color: '#aeb6c2', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kategorie główne</p>
    <div data-navigation-groups style={grid}>{GROUPS.map(group => <button key={group.id} type="button" data-active={selected?.id === group.id ? 'true' : 'false'} aria-expanded={selected?.id === group.id} aria-controls={`nav-${instance}-items`} onClick={() => chooseGroup(group.id)} style={{ ...tile, flexDirection: 'column', gap: 5, padding: '6px 10px' }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={group.icon} /></svg>
      <span>{group.label}</span>
    </button>)}</div>
    <div id={`nav-${instance}-items`} role="group" aria-labelledby={`nav-${instance}-title`} hidden={!selected} className="gmt-subsection-panel" style={{ marginTop: selected ? 16 : 0, padding: selected ? 12 : 0, background: '#101317', border: selected ? '1px solid #2a3038' : undefined, borderRadius: 10 }}>
      <h3 id={`nav-${instance}-title`} style={{ margin: '0 0 6px', color: '#e1e5eb', fontSize: 13, fontWeight: 600, lineHeight: '20px' }}>Sekcje w kategorii: {selected?.label ?? 'Kategorie'}</h3>
      <p aria-live="polite" style={{ margin: '0 0 12px', color: '#a7adb7', fontSize: 12, lineHeight: '18px' }}>{instance === 'menu' ? `Wybierz sekcję: ${selected?.label ?? 'Kategorie'}` : `Aktualnie: ${activeGroup?.label ?? 'Sekcja'} / ${categories.find(category => category.id === active)?.label ?? active}`}</p>
      <ul data-navigation-items style={{ ...grid, margin: 0, padding: '2px 0 4px', listStyle: 'none' }}>{entries.map(category => <li key={category.id} style={{ minWidth: 0, height: 48, margin: 0, padding: 0, listStyle: 'none' }}>
        <button type="button" aria-pressed={active === category.id} onClick={() => enter(category.id)} style={{ ...tile, height: 48, borderRadius: 7, fontSize: 13 }}>{category.label}</button>
      </li>)}</ul>
    </div>
    <Link href="/narzedzia" prefetch={false} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 48, marginTop: 12, padding: '8px 12px', borderRadius: 8, background: '#ef4444', color: '#111111', fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>Narzędzia: RPO, OBD, opony i części</Link>
    {['vin', 'usterki', 'paliwo', 'mojeauto', 'kupujacy'].includes(active) && <div style={{ marginTop: 12, padding: 12, border: '1px solid #554a30', borderRadius: 8 }}>
      <Link href="/narzedzia/dane-pojazdu" prefetch={false} style={{ display: 'flex', alignItems: 'center', minHeight: 44, color: '#fca5a5', fontSize: 14, lineHeight: '20px', textDecoration: 'underline' }}>Oficjalne dane VIN, NHTSA i EPA</Link>
      <p style={{ margin: '4px 0 0', color: '#a7adb7', fontSize: 12, lineHeight: '18px' }}>Dekoder VIN, kampanie bezpieczeństwa, zgłoszenia właścicieli i spalanie. Dostęp także bez wpisywania VIN; wybierz model i rocznik w narzędziu.</p>
    </div>}
  </nav>;
}
