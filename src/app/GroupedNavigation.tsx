'use client';
import { useState } from 'react';
import styles from './GroupedNavigation.module.css';
type Category = { id: string; label: string };
const GROUPS = [
  { id: 'garage', label: 'Moje GMT400', ids: ['mojeauto', 'dziennik', 'paliwo'] },
  { id: 'repair', label: 'Naprawa i diagnostyka', ids: ['usterki', 'kody', 'diy', 'schematy', 'vin', 'serwis', 'tips'] },
  { id: 'data', label: 'Modele i dane', ids: ['modele', 'specyfikacje', 'historia', 'porownaj'] },
  { id: 'parts', label: 'Części i modyfikacje', ids: ['czesci', 'tuning'] },
  { id: 'purchase', label: 'Zakup i import', ids: ['kupujacy', 'import', 'kalkulator'] },
];
const ROUTES: Record<string, string> = { modele: '/modele', usterki: '/usterki', kody: '/kody-obd', diy: '/poradniki', schematy: '/schematy' };
export default function GroupedNavigation({ categories, active, onSelect, instance }: { categories: Category[]; active: string; onSelect: (id: string) => void; instance: 'menu' | 'sections' }) {
  const [expanded, setExpanded] = useState<string | undefined>();
  const shown = expanded ?? GROUPS.find(group => group.ids.includes(active))?.id ?? 'data';
  const selected = GROUPS.find(group => group.id === shown);
  const entries = selected?.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)) ?? [];
  return <nav className={styles.root} data-variant={instance} aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'}>
    <div className={styles.groups}>{GROUPS.map(group => <button key={group.id} type="button" className={styles.group} aria-expanded={shown === group.id} aria-controls={`nav-${instance}-items`} onClick={() => setExpanded(shown === group.id ? '' : group.id)}>
      <span>{group.label}</span><span className={styles.chevron} aria-hidden="true">⌄</span>
    </button>)}</div>
    <div id={`nav-${instance}-items`} className={styles.panel} hidden={!selected}>
      <ul className={styles.items}>{entries.map(category => <li key={category.id} className={styles.item}>
        <button type="button" className={styles.section} aria-pressed={active === category.id} onClick={() => { setExpanded(undefined); onSelect(category.id); }}>{category.label}</button>
        {ROUTES[category.id] && <a href={ROUTES[category.id]} className={styles.link} aria-label={`Otwórz ${category.label} jako osobną stronę`} title="Otwórz osobną stronę"><span aria-hidden="true">↗</span></a>}
      </li>)}</ul>
    </div>
  </nav>;
}
