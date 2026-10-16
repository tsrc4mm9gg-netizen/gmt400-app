'use client';
import { useState, type CSSProperties } from 'react';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'data', label: 'Modele i dane', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'service', label: 'Serwis i części', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips', 'czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', ids: ['kupujacy', 'import', 'kalkulator'] },
];
const ROUTES: Record<string, string> = { modele: '/modele', usterki: '/usterki', kody: '/kody-obd', diy: '/poradniki', schematy: '/schematy' };
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, width: '100%', minWidth: 0 };
const tile: CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0, height: 72, padding: '10px 12px', margin: 0, border: '1px solid #353537', borderRadius: 10, background: '#232325', color: '#eeeeef', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: '20px', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'anywhere', cursor: 'pointer' };
export default function GroupedNavigation({ categories, active, onSelect, instance }: { categories: Category[]; active: string; onSelect: (id: string) => void; instance: 'menu' | 'sections' }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const selected = GROUPS.find(group => group.id === expanded);
  const entries = selected?.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)) ?? [];
  return <nav aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'} style={{ gridColumn: '1 / -1', display: 'block', width: '100%', minWidth: 0, boxSizing: 'border-box', ...(instance === 'menu' ? { maxHeight: '60dvh', overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 2 } : {}) }}>
    <div data-navigation-groups style={grid}>{GROUPS.map(group => <button key={group.id} type="button" aria-expanded={expanded === group.id} aria-controls={`nav-${instance}-items`} onClick={() => setExpanded(expanded === group.id ? null : group.id)} style={{ ...tile, ...(expanded === group.id ? { background: '#f4b900', color: '#111111', borderColor: '#f4b900' } : {}) }}>{group.label}</button>)}</div>
    <div id={`nav-${instance}-items`} hidden={!selected} style={{ marginTop: selected ? 12 : 0, borderTop: selected ? '1px solid #353537' : undefined, paddingTop: selected ? 12 : 0 }}>
      <ul data-navigation-items style={{ ...grid, margin: 0, padding: 0, listStyle: 'none' }}>{entries.map(category => <li key={category.id} style={{ display: 'flex', alignItems: 'stretch', minWidth: 0, height: 52, boxSizing: 'border-box', overflow: 'hidden', border: active === category.id ? '1px solid #b48b2b' : '1px solid #343436', borderRadius: 8, background: active === category.id ? '#302a1c' : '#1e1e20' }}>
        <button type="button" aria-pressed={active === category.id} onClick={() => onSelect(category.id)} style={{ ...tile, flex: '1 1 0', width: 'auto', height: '100%', padding: '6px 8px', border: 0, borderRadius: 0, background: 'transparent', fontSize: 13, color: active === category.id ? '#f5c445' : '#dedee2' }}>{category.label}</button>
        {ROUTES[category.id] && <a href={ROUTES[category.id]} aria-label={`Otwórz ${category.label} jako osobną stronę`} title="Otwórz osobną stronę" style={{ display: 'flex', flex: '0 0 44px', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #ffffff12', color: '#b8b8bd' }}><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12L12 4M4 4h8v8" /></svg></a>}
      </li>)}</ul>
    </div>
  </nav>;
}
