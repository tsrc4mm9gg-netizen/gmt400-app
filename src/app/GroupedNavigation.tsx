'use client';
import { useRef, useState, type CSSProperties } from 'react';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'data', label: 'Modele i dane', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'service', label: 'Serwis i części', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips', 'czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', ids: ['kupujacy', 'import', 'kalkulator'] },
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
    afterRender(() => {
      const content = document.getElementById('content');
      const target = content?.querySelector<HTMLElement>('h2, h1') ?? content;
      if (target) reveal(target, true);
    });
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
  return <nav ref={nav} className="gmt-navigation" data-layout={instance === 'menu' ? 'menu' : 'flow'} aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'} style={{ gridColumn: '1 / -1', boxSizing: 'border-box', position: 'static', width: '100%', minWidth: 0, padding: 6, background: '#171717', borderRadius: 10, ...(instance === 'menu' ? { maxHeight: '65dvh', overflowY: 'auto' } : {}) }}>
    <div data-navigation-groups style={grid}>{GROUPS.map(group => <button key={group.id} type="button" data-active={selected?.id === group.id ? 'true' : 'false'} aria-expanded={selected?.id === group.id} aria-controls={`nav-${instance}-items`} onClick={() => chooseGroup(group.id)} style={tile}>{group.label}</button>)}</div>
    <p aria-live="polite" style={{ margin: '10px 0 0', color: '#b8b8bd', fontSize: 12, lineHeight: '18px' }}>{instance === 'menu' ? `Wybierz sekcję: ${selected?.label ?? 'Kategorie'}` : `Aktualnie: ${activeGroup?.label ?? 'Sekcja'} / ${categories.find(category => category.id === active)?.label ?? active}`}</p>
    <div id={`nav-${instance}-items`} hidden={!selected} style={{ marginTop: selected ? 10 : 0, borderTop: selected ? '1px solid #353537' : undefined, paddingTop: selected ? 10 : 0 }}>
      <ul data-navigation-items style={{ ...grid, margin: 0, padding: '2px 0 4px', listStyle: 'none' }}>{entries.map(category => <li key={category.id} style={{ minWidth: 0, height: 48, margin: 0, padding: 0, listStyle: 'none' }}>
        <button type="button" aria-pressed={active === category.id} onClick={() => enter(category.id)} style={{ ...tile, height: 48, borderRadius: 8, fontSize: 13 }}>{category.label}</button>
      </li>)}</ul>
    </div>
  </nav>;
}
