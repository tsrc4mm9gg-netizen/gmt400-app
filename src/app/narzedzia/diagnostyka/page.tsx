'use client';
import { useState } from 'react';

export default function Diagnostics() {
 const [query, setQuery] = useState('');
 const [results, setResults] = useState<any[]>([]);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 async function search(event: React.FormEvent) {
 event.preventDefault();
 setLoading(true);
 setError('');
 setResults([]);
 try {
 const response = await fetch(`/api/diagnostics?q=${encodeURIComponent(query)}`);
 const data = await response.json();
 if (!response.ok) throw new Error(data.error ?? 'Nie udało się pobrać wyników.');
 setResults(data.results ?? []);
 } catch (exception) {
 setError(exception instanceof Error ? exception.message : 'Nieznany błąd.');
 } finally {
 setLoading(false);
 }
 }

 return (
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h2 className="text-xl font-semibold text-slate-900">Wyszukiwarka kodów OBD</h2>
 <p className="mt-1 text-sm text-slate-600">Wpisz kod, np. P0300, albo słowo kluczowe, np. EVAP lub misfire.</p>

 <form onSubmit={search} className="mt-4 flex flex-col gap-3 sm:flex-row">
 <input
 value={query}
 onChange={event => setQuery(event.target.value)}
 placeholder="np. P0300"
 className="w-full rounded-lg border border-slate-300 px-3 py-2"
 />
 <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
 {loading ? 'Szukam…' : 'Szukaj'}
 </button>
 </form>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

 <div className="mt-4 space-y-4">
 {results.map(item => (
 <article key={item.code} className="rounded-lg border border-slate-200 p-4">
 <header className="flex flex-wrap items-center gap-2">
 <span className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">{item.code}</span>
 <span className="text-sm font-semibold text-slate-900">{item.title}</span>
 <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{item.severity}</span>
 </header>
 <p className="mt-2 text-sm text-slate-700">{item.description}</p>

 <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Możliwe przyczyny</h3>
 <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
 {item.commonCauses.map((cause: string) => <li key={cause}>{cause}</li>)}
 </ul>

 <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Pierwsze sprawdzenia</h3>
 <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
 {item.firstChecks.map((check: string) => <li key={check}>{check}</li>)}
 </ul>

 <p className="mt-3 text-xs text-slate-500">{item.notes}</p>
 </article>
 ))}
 </div>
 </section>
 );
}
