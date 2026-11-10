'use client';

import { useMemo, useState } from 'react';
import type { Applicability } from '../../lib/vehicle-compatibility';
import { useVehicleMaterialFilter, VehicleMatchBadge } from '../VehicleMaterialFilter';

type Entry = { id?: string; Nazwa: string; Typ: string; Model: string; Opis?: string; Rozwiązanie?: string; applicability?: Applicability };
type Topic = { key: string; title: string; entries: Entry[] };
const normalize = (value: string) => value.toLocaleLowerCase('pl').replace(/[–—-]/g, ' ').replace(/\s+/g, ' ').trim();

function group(entries: Entry[]): Topic[] {
  const topics = new Map<string, Topic>();
  for (const entry of entries) {
    const name = normalize(entry.Nazwa);
    const key = /\bls\s+swap\b/.test(name) ? 'ls-swap' : /^felgi i opony/.test(name) ? 'felgi-i-opony' : entry.id || name;
    const title = key === 'ls-swap' ? 'LS swap do GMT400' : key === 'felgi-i-opony' ? 'Felgi i opony' : entry.Nazwa;
    const topic = topics.get(key) || { key, title, entries: [] };
    topic.entries.push(entry);
    topics.set(key, topic);
  }
  return [...topics.values()];
}

export default function DIYTopics({ items }: { items: Entry[] }) {
  const [query, setQuery] = useState('');
  const { visibleItems, panel } = useVehicleMaterialFilter(items, ['Porada']);
  const topics = useMemo(() => group(visibleItems), [visibleItems]);
  const shown = useMemo(() => topics.filter(topic => !query.trim() || normalize(topic.title + ' ' + topic.entries.map(entry => [entry.Nazwa, entry.Opis, entry.Rozwiązanie].join(' ')).join(' ')).includes(normalize(query))), [topics, query]);
  return <>
    {panel}
    <label htmlFor="diy-topic-search" className="mt-4 block text-sm text-neutral-300">Szukaj tematu lub etapu</label>
    <input id="diy-topic-search" type="search" value={query} onChange={event => setQuery(event.target.value)} className="mb-4 mt-2 min-h-11 w-full rounded-xl border border-white/20 bg-neutral-900 px-4 text-neutral-100 focus-visible:outline-2 focus-visible:outline-amber-400" />
    <p role="status" className="mb-4 text-sm text-neutral-400">Pokazano {shown.length} z {topics.length} tematów</p>
    {shown.length === 0 && <p className="text-neutral-300">Brak tematów dla wybranych filtrów.</p>}
    <ul className="space-y-4">
      {shown.map(topic => <li key={topic.key} className="rounded-2xl border border-white/15 bg-neutral-950 p-4">
        {topic.key === 'ls-swap' || topic.key === 'felgi-i-opony' ? <details>
          <summary className="min-h-11 cursor-pointer rounded-lg text-lg font-semibold text-neutral-100 focus-visible:outline-2 focus-visible:outline-amber-400">{topic.title}<span className="ml-2 text-sm font-normal text-neutral-400">Etapy, kategorie i materiały</span></summary>
          <nav aria-label={'Moduły: ' + topic.title} className="mt-4">
            <ul className="space-y-2">
              {topic.entries.filter((entry, index, all) => all.findIndex(other => normalize(other.Nazwa) === normalize(entry.Nazwa)) === index).map((entry, index) => <li key={entry.id || index}>
                {entry.id ? <a href={'/baza/' + encodeURIComponent(entry.id)} className="block min-h-11 rounded-lg border border-white/10 p-3 text-amber-400 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-amber-400">{entry.Nazwa}</a> : <span className="block p-3 text-neutral-300">{entry.Nazwa}</span>}
              </li>)}
            </ul>
          </nav>
        </details> : <>
          <h2 className="text-lg font-semibold text-neutral-100">{topic.entries[0].id ? <a href={'/baza/' + encodeURIComponent(topic.entries[0].id)} className="inline-flex min-h-11 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-amber-400">{topic.title}</a> : topic.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-400">{topic.entries[0].Opis}</p>
          <VehicleMatchBadge item={topic.entries[0]} />
        </>}
      </li>)}
    </ul>
  </>;
}
