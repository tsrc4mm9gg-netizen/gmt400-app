'use client';
import { useState } from 'react';
const EXAMPLES = ['P0300', 'P0171', 'EVAP', 'misfire'];
export default function Diagnostics() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  async function search(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError(''); setResults([]); setSearched(true);
    try {
      const response = await fetch(`/api/diagnostics?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Nie udało się pobrać wyników.');
      setResults(data.results ?? []);
    } catch (exception) { setError(exception instanceof Error ? exception.message : 'Nieznany błąd.'); }
    finally { setLoading(false); }
  }
  const severityLabel: Record<string, string> = { information: 'Informacja', moderate: 'Umiarkowana pilność', high: 'Wysoka pilność' };
  const severityStyle: Record<string, string> = { information: 'bg-blue-100 text-blue-800', moderate: 'bg-danger-950/60 text-danger-300', high: 'bg-danger-950/60 text-danger-300' };
  return <div className="mx-auto max-w-4xl space-y-4 p-4">
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Co oznacza kod błędu?</h1>
      <p className="mt-1 text-sm text-slate-600">Wpisz kod ze skanera, np. <strong>P0300</strong>, albo opis problemu, np. <strong>misfire</strong> lub <strong>EVAP</strong>.</p>
      <form onSubmit={search} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <label htmlFor="diagnostics-query" className="mb-1 block text-sm font-medium text-slate-900">Kod błędu lub objaw</label>
          <input id="diagnostics-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Wpisz kod błędu lub objaw" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Szukam…' : 'Sprawdź kod'}</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">{EXAMPLES.map(example => <button key={example} type="button" onClick={() => setQuery(example)} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200">{example}</button>)}</div>
      {error && <p className="mt-3 rounded bg-danger-950/60 p-3 text-sm text-danger-300">{error}</p>}
      {searched && !loading && results.length === 0 && !error && <p className="mt-3 rounded bg-slate-100 p-3 text-sm text-slate-700">Nie znaleziono kodu. Sprawdź pisownię albo wyszukaj objaw, np. „misfire”.</p>}
    </section>
    <div className="space-y-4">{results.map(item => <article key={item.code} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">{item.code}</span>
        <span className="text-base font-semibold text-slate-900">{item.title}</span>
        <span className={`rounded px-2 py-0.5 text-xs ${severityStyle[item.severity] ?? 'bg-slate-100 text-slate-700'}`}>{severityLabel[item.severity] ?? item.severity}</span>
      </header>
      <p className="mt-3 text-sm text-slate-700">{item.description}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div><h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Możliwe przyczyny</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{item.commonCauses.map((cause: string) => <li key={cause}>{cause}</li>)}</ul></div>
        <div><h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Co sprawdzić najpierw</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">{item.firstChecks.map((check: string) => <li key={check}>{check}</li>)}</ul></div>
      </div>
      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{item.notes}</p>
    </article>)}</div>
  </div>;
}
