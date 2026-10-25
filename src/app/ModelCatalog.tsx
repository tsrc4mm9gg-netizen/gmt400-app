'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BODY_STYLES, bodyYears } from '../lib/body-styles';
import { bodyImage, modelHref } from '../lib/model-images';
import { groupModels, modelWarning, normalizeModel, type ModelRecord } from '../lib/model-catalog';
const PHOTOS: Record<string, string> = { tahoe: '/carousel-tahoe-gold.jpg?v=4', suburban: '/carousel-suburban-navy.jpg?v=4', pickups: '/ck-1500-blue.jpg', yukon: '/yukon-white.jpg' };
export default function ModelCatalog({ items, onChoose }: { items: ModelRecord[]; onChoose?: (item: ModelRecord) => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const matches = useMemo(() => items.filter(item => normalizeModel([item.Nazwa, item.Model, item.Lata, item.Opis].filter(Boolean).join(' ')).includes(normalizeModel(query))), [items, query]);
  const groups = useMemo(() => groupModels(matches), [matches]);
  const selectedId = groups.some(group => group.id === selected) ? selected : groups.length === 1 ? groups[0].id : null;
  const shown = query.trim() ? groups : groups.filter(group => group.id === selectedId);
  const technical = items.filter(item => /^silnik\b/.test(normalizeModel(item.Nazwa))).length;
  return <section aria-label="Katalog modeli według rodzin" className="space-y-5">
    <header style={{ position: 'static', background: 'transparent' }}><h2 className="text-2xl text-white">KATALOG MODELI</h2><p className="mt-2 text-sm text-neutral-400">Wpisy o pojazdach: {items.length - technical} · Wpisy techniczne o silnikach: {technical}. Liczby dotyczą opisów, nie liczby różnych modeli.</p></header>
    <nav aria-labelledby="body-pages-title" className="rounded-xl border border-white/10 bg-neutral-950 p-3">
      <h3 id="body-pages-title" className="text-base font-semibold text-white">Strony modeli — zdjęcie, lata, silniki, usterki i DIY</h3>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">{BODY_STYLES.map(body => <li key={body.id}><Link href={modelHref(body)} className="block overflow-hidden rounded-lg border border-white/10 bg-neutral-900 hover:border-red-600/70"><Image src={bodyImage(body)} alt="" width={320} height={180} sizes="(max-width: 640px) 45vw, 300px" loading="lazy" className="aspect-video h-auto w-full object-cover" /><span className="block px-2 py-2 text-sm font-semibold text-neutral-100">{body.name}<span className="block text-xs font-normal text-neutral-400">{bodyYears(body)}</span></span></Link></li>)}</ul>
    </nav>
    <label className="block text-sm">Szukaj rodziny, wersji lub silnika<input type="search" value={query} onChange={event => setQuery(event.target.value)} maxLength={120} className="mt-2 block w-full rounded-lg border border-white/20 bg-neutral-900 p-3 text-white" /></label>
    {query && <button type="button" onClick={() => setQuery('')} className="min-h-11 text-sm text-red-400 underline">Wyczyść wyszukiwanie</button>}
    <p className="text-sm text-neutral-400">Najpierw wybierz rodzinę, potem rozwiń odmianę. Powtarzające się opisy pozostają dostępne pod wspólną odmianą.</p>
    <div className="grid grid-cols-2 gap-3">{groups.map(group => <button key={group.id} type="button" aria-label={group.label} aria-pressed={selectedId === group.id} onClick={() => setSelected(group.id)} className="overflow-hidden rounded-xl border bg-neutral-900 text-left" style={{ borderColor: selectedId === group.id ? '#dc2626' : '#34373d' }}>
      <div className="relative aspect-video w-full bg-neutral-800">{PHOTOS[group.id] ? <Image src={PHOTOS[group.id].split('?')[0]} alt="Ilustracja rodziny pojazdów, nie konkretnej odmiany" fill sizes="(max-width: 768px) 45vw, 360px" loading="lazy" className="object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-neutral-400">{group.technical ? 'DANE TECHNICZNE' : 'WPISY DO SPRAWDZENIA'}</div>}<span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-1 text-xs font-medium text-neutral-100">Ilustracja rodziny</span></div>
      <div className="p-3"><span className="block text-sm font-semibold text-white">{group.label}</span><span aria-hidden="true" className="mt-1 block text-xs text-neutral-400">Wpisy: {group.entries.length} · Grupy opisów: {group.variants.length}</span></div>
    </button>)}</div>
    <p role="status" className="text-sm text-neutral-400">Wszystkie wpisy: {items.length}. Widoczne po wyszukiwaniu: {matches.length}.</p>
    {!groups.length && <p>Brak wpisów przy obecnym wyszukiwaniu lub filtrze modelu.</p>}
    {shown.map(group => <section key={group.id} aria-label={'Odmiany: ' + group.label} className="rounded-xl border border-white/15 bg-neutral-950 p-4">
      <h3 className="mb-2 text-xl text-red-400">{group.label}</h3>
      {group.technical && <p className="mb-3 text-sm text-neutral-400">To opisy silników, nie osobne modele samochodów. Nie przypisujemy ich automatycznie do wybranego auta.</p>}
      {group.variants.map(variant => <details key={variant.label} open={Boolean(query.trim()) || group.variants.length === 1} className="mt-3 rounded-lg border border-white/15 p-3">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-white">{variant.label} · Liczba opisów: {variant.entries.length}</summary>
        {variant.entries.map((item, index) => <article key={item.id || index} className="mt-4 border-t border-white/10 pt-4">
          <h4 className="font-semibold text-white">{item.Nazwa}</h4><p className="mt-1 text-xs text-neutral-400">{item.Model} · {item.Lata || 'Brak podanego zakresu lat'} · Opis {index + 1} z {variant.entries.length}</p>
          {modelWarning(item) && <p className="mt-2 text-sm text-red-300">{modelWarning(item)}</p>}
          {item.Opis && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-300">{item.Opis}</p>}
          <div className="mt-3 flex flex-wrap gap-3">{item.id && <a href={'/baza/' + encodeURIComponent(item.id)} className="inline-flex min-h-11 items-center text-sm text-red-400 underline">Otwórz cały wpis</a>}{onChoose && !group.technical && <button type="button" onClick={() => onChoose(item)} className="min-h-11 text-sm text-neutral-200 underline">Wybierz {item.Nazwa}</button>}</div>
        </article>)}
      </details>)}
    </section>)}
    {items.some(item => item.id) && <details className="rounded-xl border border-white/10 bg-neutral-950 p-3"><summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-white">Wszystkie wpisy o modelach i silnikach ({items.filter(item => item.id).length})</summary><ul className="mt-2 grid gap-x-6 sm:grid-cols-2">{items.filter(item => item.id).map(item => <li key={item.id}><a href={'/baza/' + encodeURIComponent(item.id as string)} className="flex min-h-11 flex-col justify-center py-1 text-sm text-neutral-200 underline decoration-neutral-600 underline-offset-4 hover:text-red-300"><span>{item.Nazwa}</span><span className="text-xs text-neutral-400 no-underline">{[item.Model, item.Lata].filter(Boolean).join(' · ')}</span></a></li>)}</ul></details>}
    {onChoose && <p className="text-xs text-neutral-500">Wybór wersji ustawia filtr katalogu. Nie nadpisuje zapisanego profilu auta. Dane i nazwy pochodzą z Notion i mogą wymagać weryfikacji.</p>}
  </section>;
}
