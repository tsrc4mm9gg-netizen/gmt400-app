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

 async function calculate() {
 setError('');
 setResult(null);
 const params = new URLSearchParams({
 tool: 'tire', width, aspect, rim, oldWidth, oldAspect, oldRim, axleRatio, speed
 });
 const response = await fetch(`/api/calculators?${params.toString()}`);
 const data = await response.json();
 if (!response.ok) setError(data.error ?? 'Nie udało się wykonać obliczenia.');
 else setResult(data);
 }

 return (
 <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <h2 className="text-xl font-semibold text-slate-900">Kalkulator opon i przełożenia</h2>
 <p className="mt-1 text-sm text-slate-600">Porównaj średnicę opon, wpływ na wskazanie prędkości i efektywne przełożenie osi.</p>

 <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
 <label className="text-sm">Szerokość nowa<input className="mt-1 w-full rounded border px-2 py-1" value={width} onChange={event => setWidth(event.target.value)} /></label>
 <label className="text-sm">Profil nowy<input className="mt-1 w-full rounded border px-2 py-1" value={aspect} onChange={event => setAspect(event.target.value)} /></label>
 <label className="text-sm">Felga nowa<input className="mt-1 w-full rounded border px-2 py-1" value={rim} onChange={event => setRim(event.target.value)} /></label>
 <label className="text-sm">Przełożenie osi<input className="mt-1 w-full rounded border px-2 py-1" value={axleRatio} onChange={event => setAxleRatio(event.target.value)} /></label>
 <label className="text-sm">Szerokość stara<input className="mt-1 w-full rounded border px-2 py-1" value={oldWidth} onChange={event => setOldWidth(event.target.value)} /></label>
 <label className="text-sm">Profil stary<input className="mt-1 w-full rounded border px-2 py-1" value={oldAspect} onChange={event => setOldAspect(event.target.value)} /></label>
 <label className="text-sm">Felga stara<input className="mt-1 w-full rounded border px-2 py-1" value={oldRim} onChange={event => setOldRim(event.target.value)} /></label>
 <label className="text-sm">Prędkość mph<input className="mt-1 w-full rounded border px-2 py-1" value={speed} onChange={event => setSpeed(event.target.value)} /></label>
 </div>

 <button onClick={calculate} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Oblicz</button>

 {error && <p className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

 {result && (
 <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-800">
 <p>Nowa średnica: <strong>{result.newTireDiameterMm} mm</strong></p>
 <p>Stara średnica: <strong>{result.oldTireDiameterMm} mm</strong></p>
 <p>Zmiana średnicy: <strong>{result.diameterChangePercent}%</strong></p>
 <p>Efektywne przełożenie: <strong>{result.effectiveAxleRatio ?? '—'}</strong></p>
 <p>Wskazanie przy tym samym obrotach: <strong>{result.indicatedSpeedAtSameEngineRpm ?? '—'} mph</strong></p>
 <p className="mt-2 text-xs text-slate-500">{result.note}</p>
 </div>
 )}
 </section>
 );
}
