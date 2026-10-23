'use client';
import { useState } from 'react';

export default function Calculators() {
 const [width, setWidth] = useState('235');
 const [aspect, setAspect] = useState('75');
 const [rim, setRim] = useState('16');
 const [newWidth, setNewWidth] = useState('265');
 const [newAspect, setNewAspect] = useState('75');
 const [newRim, setNewRim] = useState('16');
 const [axleRatio, setAxleRatio] = useState('3.73');
 const [speed, setSpeed] = useState('60');
 const [result, setResult] = useState<any>(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);

 async function calculate(event: React.FormEvent) {
 event.preventDefault();
 setLoading(true);
 setError('');
 setResult(null);
 try {
 const params = new URLSearchParams({
 tool: 'tire',
 width: newWidth,
 aspect: newAspect,
 rim: newRim,
 oldWidth: width,
 oldAspect: aspect,
 oldRim: rim,
 axleRatio,
 speed
 });
 const response = await fetch(`/api/calculators?${params.toString()}`);
 const data = await response.json();
 if (!response.ok) throw new Error(data.error ?? 'Nie udało się wykonać obliczenia.');
 setResult(data);
 } catch (exception) {
 setError(exception instanceof Error ? exception.message : 'Nieznany błąd.');
 } finally {
 setLoading(false);
 }
 }

 return (
 <main className="mx-auto max-w-4xl space-y-4 p-4">
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h1 className="text-2xl font-semibold text-slate-900">Czy większe opony zmienią prędkość?</h1>
 <p className="mt-1 text-sm text-slate-600">Porównaj obecne opony z planowanymi. Sprawdzisz, jak zmieni się rzeczywista prędkość i efektywne przełożenie osi.</p>

 <form onSubmit={calculate} className="mt-5 space-y-5">
 <div className="rounded-lg bg-slate-50 p-4">
 <h2 className="text-sm font-semibold text-slate-700">Obecne opony</h2>
 <div className="mt-3 grid grid-cols-3 gap-3">
 <label className="text-sm">Szerokość, mm<input className="mt-1 w-full rounded border px-2 py-2" value={width} onChange={event => setWidth(event.target.value)} /></label>
 <label className="text-sm">Profil, %<input className="mt-1 w-full rounded border px-2 py-2" value={aspect} onChange={event => setAspect(event.target.value)} /></label>
 <label className="text-sm">Felga, cal<input className="mt-1 w-full rounded border px-2 py-2" value={rim} onChange={event => setRim(event.target.value)} /></label>
 </div>
 </div>

 <div className="rounded-lg bg-blue-50 p-4">
 <h2 className="text-sm font-semibold text-blue-900">Planowane opony</h2>
 <div className="mt-3 grid grid-cols-3 gap-3">
 <label className="text-sm">Szerokość, mm<input className="mt-1 w-full rounded border px-2 py-2" value={newWidth} onChange={event => setNewWidth(event.target.value)} /></label>
 <label className="text-sm">Profil, %<input className="mt-1 w-full rounded border px-2 py-2" value={newAspect} onChange={event => setNewAspect(event.target.value)} /></label>
 <label className="text-sm">Felga, cal<input className="mt-1 w-full rounded border px-2 py-2" value={newRim} onChange={event => setNewRim(event.target.value)} /></label>
 </div>
 </div>

 <div className="grid gap-3 sm:grid-cols-2">
 <label className="text-sm">Przełożenie tylnej osi<input className="mt-1 w-full rounded border px-2 py-2" value={axleRatio} onChange={event => setAxleRatio(event.target.value)} /></label>
 <label className="text-sm">Wskazanie licznika, mph<input className="mt-1 w-full rounded border px-2 py-2" value={speed} onChange={event => setSpeed(event.target.value)} /></label>
 </div>

 <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
 {loading ? 'Obliczam…' : 'Porównaj opony'}
 </button>
 </form>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

 {result && (
 <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
 <h2 className="text-lg font-semibold text-slate-900">Wynik</h2>
 <div className="mt-3 grid gap-3 sm:grid-cols-2">
 <div className="rounded-lg bg-white p-3">
 <p className="text-xs text-slate-500">Średnica obecnej opony</p>
 <p className="text-lg font-semibold">{result.oldTireDiameterMm} mm</p>
 </div>
 <div className="rounded-lg bg-white p-3">
 <p className="text-xs text-slate-500">Średnica nowej opony</p>
 <p className="text-lg font-semibold">{result.newTireDiameterMm} mm</p>
 </div>
 <div className="rounded-lg bg-white p-3">
 <p className="text-xs text-slate-500">Zmiana średnicy</p>
 <p className="text-lg font-semibold">{result.diameterChangePercent}%</p>
 </div>
 <div className="rounded-lg bg-white p-3">
 <p className="text-xs text-slate-500">Efektywne przełożenie osi</p>
 <p className="text-lg font-semibold">{result.effectiveAxleRatio ?? '—'}</p>
 </div>
 </div>

 <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-900">
 Przy wskazaniu licznika {speed} mph rzeczywista prędkość wyniesie około <strong>{result.actualSpeedAtIndicatedSpeed ?? '—'} mph</strong>.
 </p>
 <p className="mt-3 text-xs text-slate-500">{result.note}</p>
 </div>
 )}
 </section>
 </main>
 );
}
