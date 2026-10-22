'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { buildKnowledgeIndex, getKnowledgeEntries, searchKnowledge, type KnowledgeEntry } from '../../lib/knowledge-index';
type Entry = KnowledgeEntry;
const control = 'min-h-11 rounded border border-amber-400 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400';
function isEntry(value: unknown): value is Entry {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.Nazwa === 'string' && ['Opis', 'Objawy', 'Rozwiązanie', 'Model', 'Typ'].every(key => record[key] === undefined || typeof record[key] === 'string');
}
export default function SearchPage({ query }: { query: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => { if (active) { setStatus('error'); controller.abort(); } }, 15000);
    void fetch('/api/notion', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('HTTP');
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !('results' in data) || !Array.isArray(data.results)) throw new Error('Invalid response');
      if (active) { setItems(data.results.filter(isEntry)); setStatus('ready'); }
    }).catch(() => { if (active) setStatus('error'); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, []);
  const index = useMemo(() => buildKnowledgeIndex(getKnowledgeEntries(items)), [items]);
  const results = useMemo(() => searchKnowledge(index, query), [index, query]);
  return <main className="mx-auto max-w-4xl px-4 py-8 text-white">
    <nav aria-label="Nawigacja" className="mb-6 flex gap-4"><Link href="/" className="text-amber-400 underline">Strona główna</Link><Link href="/kody-obd" className="text-amber-400 underline">Kody OBD</Link></nav>
    <h1 className="text-3xl">Szukaj w bazie wiedzy</h1>
    <form action="/szukaj" method="get" role="search" className="my-6"><label htmlFor="page-search" className="block">Kod, objaw lub nazwa materiału</label><div className="mt-2 flex flex-wrap gap-3"><input key={query} id="page-search" name="q" type="search" maxLength={120} defaultValue={query} className={`${control} min-w-0 flex-1 bg-neutral-900`} /><button className={`${control} bg-amber-400 text-black`} type="submit">Szukaj</button></div></form>
    <p className="mb-4 text-sm text-neutral-400">Baza OBD i materiały Notion. Ten widok pokazuje wszystkie auta, bez filtra profilu. Dla fraz wielowyrazowych wymagane są wszystkie słowa. Powiązanie z hasłem nie potwierdza zastosowania kodu w konkretnym aucie.</p>
    <p role="status" className="mb-4">Znaleziono: {results.length}. {status === 'loading' ? 'Trwa pobieranie dodatkowych materiałów Notion.' : status === 'error' ? 'Nie udało się pobrać materiałów Notion w wymaganym czasie lub wystąpił błąd. Wyniki obejmują tylko bazę OBD.' : 'Materiały Notion załadowane.'}</p>
    {!query.trim() ? <p>Wpisz frazę, aby zobaczyć wyniki.</p> : <><ul className="space-y-4">{results.map(result => <li key={result.id} className="rounded border border-white/20 p-4"><h2><Link href={result.href || `/baza/${encodeURIComponent(result.id)}`} className="inline-flex min-h-11 items-center text-amber-400 underline focus-visible:outline-2">{result.Nazwa}</Link></h2><p className="mt-2 text-neutral-300">{(result.Opis || result.Objawy || '').slice(0, 250)}</p></li>)}</ul>{status !== 'loading' && !results.length && <p>Brak wyników. Spróbuj krótszej frazy, np. P0300 lub 4L60E.</p>}</>}
  </main>;
}
