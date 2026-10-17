'use client';
import { useState } from 'react';

const MODELS = ['', 'C/K 1500', 'C/K 2500', 'C/K 3500', 'GMC Sierra 1500', 'Tahoe', 'Yukon', 'Suburban 1500', 'Suburban 2500', 'Suburban 3500'];
const ENGINES = ['', '4.3L V6', '5.0L V8', '5.7L V8', '7.4L V8', '6.5L Diesel'];
const TRANSMISSIONS = ['', 'Automatyczna', 'Ręczna'];

export default function PartsPage() {
 const [model, setModel] = useState('');
 const [year, setYear] = useState('');
 const [engine, setEngine] = useState('');
 const [transmission, setTransmission] = useState('');
 const [results, setResults] = useState<any[]>([]);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const [searched, setSearched] = useState(false);

 async function search(event: React.FormEvent) {
 event.preventDefault();
 setLoading(true);
 setError('');
 setResults([]);
 setSearched(true);
 try {
 const params = new URLSearchParams();
 if (model) params.set('model', model);
 if (year) params.set('year', year);
 if (engine) params.set('engine', engine);
 if (transmission) params.set('transmission', transmission);
 const response = await fetch(`/api/parts?${params.toString()}`);
 const data = await response.json();
 if (!response.ok) throw new Error(data.error ?? 'Nie udało się pobrać wyników.');
 setResults(data.results ?? []);
 } catch (exception) {
 setError(exception instanceof Error ? exception.message : 'Nieznany błąd.');
 } finally {
 setLoading(false);
 }
 }

 const confidenceLabel: Record<string, string> = {
 factory: 'Pasuje fabrycznie',
 likely: 'Prawdopodobnie pasuje',
 verify: 'Wymaga weryfikacji'
 };

 const confidenceStyle: Record<string, string> = {
 factory: 'bg-green-100 text-green-800',
 likely: 'bg-blue-100 text-blue-800',
 verify: 'bg-amber-100 text-amber-800'
 };

 return (
 <main className="mx-auto max-w-4xl space-y-4 p-4">
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h1 className="text-2xl font-semibold text-slate-900">Czy ta część pasuje do mojego auta?</h1>
 <p className="mt-1 text-sm text-slate-600">Wybierz model, rocznik, silnik i skrzynię. Wynik wskaże, czy część pasuje fabrycznie, prawdopodobnie pasuje, czy wymaga weryfikacji.</p>

 <form onSubmit={search} className="mt-4 grid gap-3 sm:grid-cols-2">
 <label className="text-sm">Model
 <select value={model} onChange={event => setModel(event.target.value)} className="mt-1 w-full rounded border px-2 py-2">
 {MODELS.map(item => <option key={item} value={item}>{item || 'Wszystkie modele'}</option>)}
 </select>
 </label>
 <label className="text-sm">Rocznik
 <select value={year} onChange={event => setYear(event.target.value)} className="mt-1 w-full rounded border px-2 py-2">
 <option value="">Wszystkie roczniki</option>
 {Array.from({ length: 11 }, (_, index) => 1988 + index).map(year => <option key={year} value={year}>{year}</option>)}
 </select>
 </label>
 <label className="text-sm">Silnik
 <select value={engine} onChange={event => setEngine(event.target.value)} className="mt-1 w-full rounded border px-2 py-2">
 {ENGINES.map(item => <option key={item} value={item}>{item || 'Wszystkie silniki'}</option>)}
 </select>
 </label>
 <label className="text-sm">Skrzynia biegów
 <select value={transmission} onChange={event => setTransmission(event.target.value)} className="mt-1 w-full rounded border px-2 py-2">
 {TRANSMISSIONS.map(item => <option key={item} value={item}>{item || 'Wszystkie skrzynie'}</option>)}
 </select>
 </label>
 <button type="submit" disabled={loading} className="sm:col-span-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
 {loading ? 'Szukam…' : 'Sprawdź dopasowanie'}
 </button>
 </form>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
 {searched && !loading && results.length === 0 && !error && (
 <p className="mt-3 rounded bg-slate-100 p-3 text-sm text-slate-700">Nie znaleziono części dla tych parametrów. Spróbuj innego modelu lub rocznika.</p>
 )}
 </section>

 <div className="space-y-3">
 {results.map((item, index) => (
 <article key={`${item.part}-${index}`} className="rounded-lg border border-slate-200 bg-white p-4">
 <header className="flex flex-wrap items-center gap-2">
 <span className={`rounded px-2 py-0.5 text-xs ${confidenceStyle[item.confidence] ?? 'bg-slate-100 text-slate-700'}`}>
 {confidenceLabel[item.confidence] ?? item.confidence}
 </span>
 <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">{item.category}</span>
 </header>
 <h2 className="mt-2 text-base font-semibold text-slate-900">{item.part}</h2>
 <p className="mt-1 text-sm text-slate-600">Pasuje do: {item.fitsModels.join(', ')}</p>
 <p className="mt-1 text-xs text-slate-500">Lata: {item.yearRange[0]}–{item.yearRange[1]}</p>
 <p className="mt-2 text-sm text-slate-600">{item.notes}</p>
 <a href={item.source} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-blue-700 underline">Źródło: {item.sourceTitle}</a>
 </article>
 ))}
 </div>
 </main>
 );
}
