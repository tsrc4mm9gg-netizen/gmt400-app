'use client';
import { useState } from 'react';

export default function Calculators() {
 const [width, setWidth] = useState('265');
 const [aspect, setAspect] = useState('75');
 const [rim, setRim] = useState('16');
 const [oldWidth, setOldWidth] = useState('235');
 const [oldAspect, setOldAspect] = useState('75');
 const [oldRim, setOldRim] = useState('16');
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
 const params = new URLSearchParams({ tool: 'tire', width, aspect, rim, oldWidth, oldAspect, oldRim, axleRatio, speed });
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
 <main className="mx-auto max-w-4xl p-4">
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h1 className="text-2xl font-semibold text-slate-900">Kalkulator opon i przełożenia</h1>
 <p className="mt-1 text-sm text-slate-600">Porównaj średnicę opon, wpływ na rzeczywistą prędkość i efektywne przełożenie osi.</p>

 <form onSubmit={calculate} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
 <label className="text-sm">Szerokość nowa<input className="mt-1 w-full rounded border px-2 py-1" value={width} onChange={event => setWidth(event.target.value)} /></label>
 <label className="text-sm">Profil nowy<input className="mt-1 w-full rounded border px-2 py-1" value={aspect} onChange={event => setAspect(event.target.value)} /></label>
 <label className="text-sm">Felga nowa<input className="mt-1 w-full rounded border px-2 py-1" value={rim} onChange={event => setRim(event.target.value)} /></label>
 <label className="text-sm">Przełożenie osi<input className="mt-1 w-full rounded border px-2 py-1" value={axleRatio} onChange={event => setAxleRatio(event.target.value)} /></label>
 <label className="text-sm">Szerokość stara<input className="mt-1 w-full rounded border px-2 py-1" value={oldWidth} onChange={event => setOldWidth(event.target.value)} /></label>
 <label className="text-sm">Profil stary<input className="mt-1 w-full rounded border px-2 py-1" value={oldAspect} onChange={event => setOldAspect(event.target.value)} /></label>
 <label className="text-sm">Felga stara<input className="mt-1 w-full rounded border px-2 py-1" value={oldRim} onChange={event => setOldRim(event.target.value)} /></label>
 <label className="text-sm">Wskazanie licznika, mph<input className="mt-1 w-full rounded border px-2 py-1" value={speed} onChange={event => setSpeed(event.target.value)} /></label>
 </form>

 <button type="submit" disabled={loading} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Obliczam…' : 'Oblicz'}</button>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

 {result && (
 <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-800">
 <p>Nowa średnica: <strong>{result.newTireDiameterMm} mm</strong></p>
 <p>Stara średnica: <strong>{result.oldTireDiameterMm} mm</strong></p>
 <p>Zmiana średnicy: <strong>{result.diameterChangePercent}%</strong></p>
 <p>Efektywne przełożenie osi: <strong>{result.effectiveAxleRatio ?? '—'}</strong></p>
 <p>Rzeczywista prędkość przy tym wskazaniu: <strong>{result.actualSpeedAtIndicatedSpeed ?? '—'} mph</strong></p>
 <p className="mt-2 text-xs text-slate-500">{result.note}</p>
 </div>
 )}
 </section>
 </main>
 );
}
