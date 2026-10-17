'use client';
import { useState } from 'react';

const CATEGORIES = ['', 'Osie', 'Silniki', 'Skrzynie', 'Wyposażenie', 'Nadwozie', 'Klimatyzacja', 'Masy', 'Lusterka i wnętrze', 'Zawieszenie', 'Osprzęt', 'Napęd', 'Emisja', 'Koła', 'Pakiety', 'Kolory i tapicerki', 'Hamulce'];

export default function RpoPage() {
 const [query, setQuery] = useState('');
 const [category, setCategory] = useState('');
 const [data, setData] = useState<any>(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 async function search(event: React.FormEvent) {
 event.preventDefault();
 setLoading(true);
 setError('');
 setData(null);
 try {
 const params = new URLSearchParams();
 if (query.trim()) params.set('q', query.trim());
 if (category) params.set('category', category);
 params.set('limit', '100');
 const response = await fetch(`/api/rpo?${params.toString()}`);
 const json = await response.json();
 if (!response.ok) throw new Error(json.error ?? 'Nie udało się pobrać wyników.');
 setData(json);
 } catch (exception) {
 setError(exception instanceof Error ? exception.message : 'Nieznany błąd.');
 } finally {
 setLoading(false);
 }
 }

 const results: any[] = data?.results ?? [];

 return (
 <main className="mx-auto max-w-4xl space-y-4 p-4">
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h1 className="text-2xl font-semibold text-slate-900">Wyszukiwarka kodów RPO</h1>
 <p className="mt-1 text-sm text-slate-600">Wpisz jeden lub kilka kodów oddzielonych spacją albo przecinkiem, np. G80 Z71 GU5. Możesz też szukać po opisie.</p>

 <form onSubmit={search} className="mt-4 grid gap-3 sm:grid-cols-[1fr_200px_auto]">
 <input value={query} onChange={event => setQuery(event.target.value)} placeholder="np. G80 Z71" className="rounded-lg border border-slate-300 px-3 py-2" />
 <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
 {CATEGORIES.map(item => <option key={item} value={item}>{item || 'Wszystkie kategorie'}</option>)}
 </select>
 <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Szukam…' : 'Szukaj'}</button>
 </form>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
 {data?.ratioConflict && <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-800">Uwaga: podane kody wskazują różne przełożenia tylnej osi. Sprawdź tabliczkę pojazdu.</p>}
 {data?.invalidTokens?.length > 0 && <p className="mt-3 rounded bg-slate-100 p-3 text-sm text-slate-700">Pominięto nieprawidłowe wpisy: {data.invalidTokens.join(', ')}</p>}
 </section>

 {data && <p className="text-sm text-slate-600">Znaleziono wyników: <strong>{results.length}</strong></p>}

 <div className="space-y-3">
 {results.map((item, index) => (
 <article key={`${item.code}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
 <header className="flex flex-wrap items-center gap-2">
 <span className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">{item.code}</span>
 <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{item.category}</span>
 </header>
 <p className="mt-2 text-sm font-medium text-slate-900">{item.description}</p>
 <p className="mt-1 text-xs text-slate-500">Oryginał: {item.original}</p>
 <p className="mt-2 text-xs text-slate-600">{item.notes}</p>
 <a href={item.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-blue-700 underline">{item.sourceTitle}</a>
 </article>
 ))}
 </div>
 </main>
 );
}
