'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'data', label: 'Modele i dane', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'service', label: 'Serwis i części', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips', 'czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', ids: ['kupujacy', 'import', 'kalkulator'] },
];
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, width: '100%', minWidth: 0 };
const tile: CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0, height: 72, padding: '10px 12px', margin: 0, border: '1px solid #353537', borderRadius: 10, background: '#232325', color: '#eeeeef', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: '20px', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'anywhere', cursor: 'pointer' };
function reveal(target: HTMLElement) {
  const headerBottom = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 0);
  window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerBottom - 16), behavior: 'instant' });
}
export default function GroupedNavigation({ categories, active, onSelect, instance }: { categories: Category[]; active: string; onSelect: (id: string) => void; instance: 'menu' | 'sections' }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = GROUPS.find(group => group.id === expanded);
  const entries = selected?.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)) ?? [];
  useEffect(() => {
    if (!expanded) return;
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      const nav = navRef.current;
      if (!panel || !nav) return;
      if (instance === 'menu') nav.scrollTo({ top: nav.scrollTop + panel.getBoundingClientRect().top - nav.getBoundingClientRect().top, behavior: 'instant' });
      else reveal(panel);
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded, instance]);
  function enter(id: string) {
    setExpanded(null);
    onSelect(id);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const content = document.getElementById('content');
      const target = content?.querySelector<HTMLElement>('h2, h1') ?? content;
      if (!target) return;
      reveal(target);
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }));
  }
  return <nav ref={navRef} aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'} style={{ gridColumn: '1 / -1', display: 'block', width: '100%', minWidth: 0, boxSizing: 'border-box', ...(instance === 'menu' ? { maxHeight: '60dvh', overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 2 } : {}) }}>
    <div data-navigation-groups style={grid}>{GROUPS.map(group => <button key={group.id} type="button" aria-expanded={expanded === group.id} aria-controls={`nav-${instance}-items`} onClick={() => setExpanded(expanded === group.id ? null : group.id)} style={{ ...tile, ...(expanded === group.id ? { background: '#f4b900', color: '#111111', borderColor: '#f4b900' } : {}) }}>{group.label}</button>)}</div>
    <div ref={panelRef} id={`nav-${instance}-items`} hidden={!selected} style={{ marginTop: selected ? 12 : 0, borderTop: selected ? '1px solid #353537' : undefined, paddingTop: selected ? 12 : 0 }}>
      {selected && <p style={{ margin: '0 0 10px', color: '#b8b8bd', fontSize: 12, lineHeight: '18px' }}>{selected.label}</p>}
      <ul data-navigation-items style={{ ...grid, margin: 0, padding: 0, listStyle: 'none' }}>{entries.map(category => <li key={category.id} style={{ minWidth: 0, height: 52, margin: 0, padding: 0, listStyle: 'none' }}>
        <button type="button" aria-pressed={active === category.id} onClick={() => enter(category.id)} style={{ ...tile, height: 52, borderRadius: 8, fontSize: 13, borderColor: active === category.id ? '#b48b2b' : '#343436', background: active === category.id ? '#302a1c' : '#1e1e20', color: active === category.id ? '#f5c445' : '#dedee2' }}>{category.label}</button>
      </li>)}</ul>
    </div>
  </nav>;
}
