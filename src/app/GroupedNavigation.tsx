'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'data', label: 'Modele i dane', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'service', label: 'Serwis i części', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips', 'czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', ids: ['kupujacy', 'import', 'kalkulator'] },
];
const grid: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, minWidth: 0, width: '100%' };
const tile: CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minWidth: 0, height: 72, padding: '10px 12px', margin: 0, border: '1px solid #353537', borderRadius: 10, background: '#232325', color: '#eeeeef', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 500, lineHeight: '20px', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'anywhere', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' };
const chosen: CSSProperties = { background: '#f4b900', color: '#111111', borderColor: '#f4b900' };
export default function GroupedNavigation({ categories, active, onSelect, instance }: { categories: Category[]; active: string; onSelect: (id: string) => void; instance: 'menu' | 'sections' }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const items = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ pinned: false, covered: false, top: 0, left: 0, width: 0, height: 0 });
  const activeGroup = GROUPS.find(group => group.ids.includes(active));
  const selected = GROUPS.find(group => group.id === expanded);
  const highlighted = expanded ?? activeGroup?.id;
  const entries = selected?.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)) ?? [];
  useEffect(() => {
    setExpanded(previous => previous === null ? null : GROUPS.find(group => group.ids.includes(active))?.id ?? null);
  }, [active]);
  useEffect(() => {
    if (instance !== 'sections') return;
    let raf = 0;
    const measure = () => {
      const root = wrapper.current;
      const panel = nav.current;
      if (!root || !panel) return;
      const r = root.getBoundingClientRect();
      const header = document.querySelector('header');
      const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 6;
      const next = { pinned: r.top <= top, covered: Boolean(header?.querySelector('nav[aria-label="Menu główne"]')), top, left: r.left, width: r.width, height: panel.offsetHeight };
      setFrame(previous => Object.keys(next).every(key => previous[key as keyof typeof previous] === next[key as keyof typeof next]) ? previous : next);
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    if (wrapper.current) resize.observe(wrapper.current);
    if (nav.current) resize.observe(nav.current);
    const header = document.querySelector('header');
    if (header) resize.observe(header);
    const mutation = new MutationObserver(schedule);
    if (header) mutation.observe(header, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    measure();
    return () => { cancelAnimationFrame(raf); resize.disconnect(); mutation.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('resize', schedule); };
  }, [instance]);
  function browse(id: string) {
    setExpanded(previous => previous === id ? null : id);
    if (items.current) items.current.scrollTop = 0;
    if (instance === 'sections' && !frame.pinned) requestAnimationFrame(() => {
      const r = wrapper.current?.getBoundingClientRect();
      const top = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 0) + 6;
      if (r) window.scrollTo({ top: Math.max(0, window.scrollY + r.top - top), behavior: 'instant' });
    });
  }
  function enter(id: string) {
    onSelect(id);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const content = document.getElementById('content');
      const target = content?.querySelector<HTMLElement>('h2, h1') ?? content;
      if (!target) return;
      const header = Math.max(0, document.querySelector('header')?.getBoundingClientRect().bottom ?? 0);
      const navigation = document.querySelector<HTMLElement>('nav[aria-label="Skróty sekcji"]');
      const height = navigation?.offsetHeight ?? 0;
      window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - header - height - 22), behavior: 'instant' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }));
  }
  return <div ref={wrapper} style={{ gridColumn: '1 / -1', width: '100%', minWidth: 0, ...(instance === 'sections' && frame.pinned ? { height: frame.height } : {}) }}>
    <style>{'.gmt-navigation button:focus{outline:none}.gmt-navigation button:focus-visible{outline:2px solid #f5c445;outline-offset:-4px}'}</style>
    <nav ref={nav} className="gmt-navigation" aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'} aria-hidden={instance === 'sections' && frame.covered ? true : undefined} data-pinned={instance === 'sections' && frame.pinned ? 'true' : 'false'} style={{ boxSizing: 'border-box', display: 'block', width: '100%', minWidth: 0, padding: 6, background: '#171717', borderRadius: 10, ...(instance === 'sections' && frame.pinned ? { position: 'fixed', top: frame.top, left: frame.left, width: frame.width, zIndex: 40, boxShadow: '0 8px 18px #0008' } : {}), ...(instance === 'sections' && frame.covered ? { visibility: 'hidden', pointerEvents: 'none' } : {}), ...(instance === 'menu' ? { maxHeight: '65dvh', overflowY: 'auto' } : {}) }}>
      <div data-navigation-groups style={grid}>{GROUPS.map(group => <button key={group.id} type="button" data-active={highlighted === group.id ? 'true' : 'false'} aria-expanded={expanded === group.id} aria-controls={`nav-${instance}-items`} onClick={() => browse(group.id)} style={{ ...tile, ...(highlighted === group.id ? chosen : {}) }}>{group.label}</button>)}</div>
      <p aria-live="polite" style={{ margin: '8px 0 0', color: '#b8b8bd', fontSize: 12, lineHeight: '18px' }}>Aktualnie: {activeGroup?.label ?? 'Sekcja'} / {categories.find(category => category.id === active)?.label ?? active}</p>
      <div id={`nav-${instance}-items`} hidden={!selected} style={{ marginTop: selected ? 10 : 0, borderTop: selected ? '1px solid #353537' : undefined, paddingTop: selected ? 10 : 0 }}>
        <div ref={items} style={{ maxHeight: 'min(22dvh, 180px)', overflowY: 'auto', overscrollBehaviorY: 'contain', padding: 2 }}>
          <ul data-navigation-items style={{ ...grid, margin: 0, padding: 0, listStyle: 'none' }}>{entries.map(category => <li key={category.id} style={{ minWidth: 0, height: 52, margin: 0, padding: 0, listStyle: 'none' }}>
            <button type="button" aria-pressed={active === category.id} onClick={() => enter(category.id)} style={{ ...tile, height: 52, borderRadius: 8, fontSize: 13, ...(active === category.id ? chosen : {}) }}>{category.label}</button>
          </li>)}</ul>
        </div>
      </div>
    </nav>
  </div>;
}
