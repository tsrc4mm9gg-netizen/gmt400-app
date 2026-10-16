'use client';
import { useState } from 'react';
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
  return <nav className="col-span-full w-full" aria-label={instance === 'menu' ? 'Menu główne' : 'Skróty sekcji'}>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{GROUPS.map(group => <button key={group.id} type="button" aria-expanded={shown === group.id} aria-controls={`nav-${instance}-items`} onClick={() => setExpanded(shown === group.id ? '' : group.id)} className={`rounded px-3 py-3 text-sm ${shown === group.id ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-white'}`}>{group.label}</button>)}</div>
    <div id={`nav-${instance}-items`} className="mt-3">{selected && <>
      <p className="mb-2 text-xs text-neutral-400">{selected.label}</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{selected.ids.map(id => categories.find(category => category.id === id)).filter((category): category is Category => Boolean(category)).map(category => <li key={category.id} className="rounded bg-neutral-900 p-2">
        <button type="button" aria-pressed={active === category.id} onClick={() => { setExpanded(undefined); onSelect(category.id); }} className={`w-full rounded px-2 py-3 text-sm ${active === category.id ? 'bg-amber-400 text-black' : 'text-white hover:bg-neutral-800'}`}>{category.label}</button>
        {ROUTES[category.id] && <a href={ROUTES[category.id]} className="mt-1 block px-2 py-1 text-xs text-amber-400 underline" aria-label={`Otwórz ${category.label} jako osobną stronę`}>Otwórz osobno ↗</a>}
      </li>)}</ul>
    </>}</div>
  </nav>;
}
