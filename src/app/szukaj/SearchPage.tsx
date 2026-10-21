'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { OBD_CODES } from '../../lib/obd-codes';
type Entry = { id?: string; Nazwa: string; Opis?: string; Objawy?: string; Rozwiązanie?: string; Model?: string; Typ?: string };
const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l');
const control = 'min-h-11 rounded border border-amber-400 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';
export default function SearchPage({ query }: { query: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const controller = new AbortController();
    void fetch('/api/notion', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('HTTP');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('results' in data) || !Array.isArray(data.results)) throw new Error('Invalid response');
      const entries: Entry[] = data.results.filter((entry: unknown): entry is Entry => !!entry && typeof entry === 'object' && 'Nazwa' in entry && typeof entry.Nazwa === 'string');
      setItems(entries); setStatus('ready');
    }).catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, []);
  const results = useMemo(() => {
    const tokens = normalize(query.trim()).split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    const entries = [
      ...OBD_CODES.map(code => ({ key: `obd:${code.code}`, title: `${code.code} — ${code.title}`, description: code.description, text: [code.code, code.title, code.description, ...code.commonCauses].join(' '), href: `/kody-obd/${code.code.toLowerCase()}` })),
      ...items.filter(item => item.id).map(item => ({ key: item.id!, title: item.Nazwa, description: item.Opis || item.Objawy || '', text: [item.Nazwa, item.Opis, item.Objawy, item.Rozwiązanie, item.Model, item.Typ].filter(Boolean).join(' '), href: `/baza/${encodeURIComponent(item.id!)}` }))
    ];
    return entries.filter(entry => tokens.every(token => normalize(entry.text).includes(token)));
  }, [items, query]);
  return <main className="mx-auto max-w-4xl px-4 py-8 text-white">
    <nav aria-label="Nawigacja" className="mb-6 flex gap-4"><Link href="/" className="text-amber-400 underline">Strona główna</Link><Link href="/kody-obd" className="text-amber-400 underline">Kody OBD</Link></nav>
    <h1 className="text-3xl">Szukaj w bazie wiedzy</h1>
    <form action="/szukaj" method="get" role="search" className="my-6"><label htmlFor="page-search" className="block">Kod, objaw lub nazwa materiału</label><div className="mt-2 flex flex-wrap gap-3"><input id="page-search" name="q" type="search" maxLength={120} defaultValue={query} className={`${control} min-w-0 flex-1 bg-neutral-900`} /><button className={`${control} bg-amber-400 text-black`} type="submit">Szukaj</button></div></form>
    <p className="mb-4 text-sm text-neutral-400">Baza OBD i materiały Notion. Ten widok pokazuje wszystkie auta, bez filtra profilu. Dla fraz wielowyrazowych wymagane są wszystkie słowa.</p>
    <p role="status" className="mb-4">{status === 'loading' ? 'Ładowanie materiałów Notion — kody OBD są już dostępne.' : status === 'error' ? 'Nie udało się pobrać materiałów Notion. Wyniki obejmują tylko bazę OBD.' : `Znaleziono: ${results.length}`}</p>
    {!query.trim() ? <p>Wpisz frazę, aby zobaczyć wyniki.</p> : <><ul className="space-y-4">{results.map(result => <li key={result.key} className="rounded border border-white/20 p-4"><h2><Link href={result.href} className="inline-flex min-h-11 items-center text-amber-400 underline focus-visible:outline-2">{result.title}</Link></h2><p className="mt-2 text-neutral-300">{result.description.slice(0, 250)}</p></li>)}</ul>{status !== 'loading' && !results.length && <p>Brak wyników. Spróbuj krótszej frazy, np. P0300 lub 4L60E.</p>}</>}
  </main>;
}
