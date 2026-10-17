'use client';
import Link from 'next/link';
import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
const MODELS = ['', 'C/K 1500', 'C/K 2500', 'C/K 3500', 'GMC Sierra 1500', 'Tahoe', 'Yukon', 'Suburban 1500', 'Suburban 2500', 'Suburban 3500'];
const ENGINES = ['', '4.3L V6', '5.0L V8', '5.7L V8', '7.4L V8', '6.5L Diesel'];
type Entry = { part: string; category: string; fitsModels: string[]; yearRange: [number, number]; notes: string };
const panel: CSSProperties = { boxSizing:'border-box', width:'100%', minWidth:0, padding:20, margin:'0 0 16px', border:'1px solid #343a43', borderRadius:10, background:'#171d25', color:'#ededed' };
const control: CSSProperties = { boxSizing:'border-box', display:'block', width:'100%', minWidth:0, minHeight:44, marginTop:6, padding:'10px 12px', border:'1px solid #596371', borderRadius:7, background:'#101317', color:'#fafafa', fontSize:16 };
export default function PartsPage() {
 const [model, setModel] = useState('');
 const [year, setYear] = useState('');
 const [engine, setEngine] = useState('');
 const [transmission, setTransmission] = useState('');
 const [results, setResults] = useState<Entry[]>([]);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const [searched, setSearched] = useState(false);
 const pending = useRef<AbortController | null>(null);
 async function search(event: FormEvent) {
  event.preventDefault();
  pending.current?.abort();
  const controller = new AbortController();
  pending.current = controller;
  setLoading(true); setError(''); setResults([]); setSearched(true);
  try {
   const params = new URLSearchParams();
   for (const [key, value] of Object.entries({ model, year, engine, transmission })) if (value) params.set(key, value);
   const response = await fetch('/api/parts?' + params.toString(), { signal: controller.signal });
   const data = await response.json();
   if (!response.ok) throw new Error(data.error ?? 'Nie udało się pobrać wyników.');
   if (!controller.signal.aborted) setResults(data.results ?? []);
  } catch (exception) {
   if (!controller.signal.aborted) setError(exception instanceof Error ? exception.message : 'Błąd połączenia. Spróbuj ponownie.');
  } finally { if (!controller.signal.aborted) setLoading(false); }
 }
 return <main style={{ boxSizing:'border-box', width:'100%', maxWidth:1000, margin:'0 auto', padding:'20px 16px 120px', color:'#ededed' }}>
  <Link href="/narzedzia" style={{ display:'inline-flex', alignItems:'center', minHeight:44, marginBottom:16, color:'#f2cf85' }}>← Wszystkie narzędzia</Link>
  <section style={panel}>
   <h1 style={{ margin:'0 0 12px', color:'#fafafa', fontSize:26, lineHeight:1.25 }}>Sprawdź informacje o częściach</h1>
   <p style={{ margin:'0 0 16px', color:'#d0d5dc', lineHeight:1.65 }}>Wybierz dane auta. Baza jest niewielka i referencyjna — dopasowanie filtrów nie potwierdza, że dany podzespół pasuje do Twojego egzemplarza.</p>
   <form onSubmit={search} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap:14 }}>
    <label>Model<select id="parts-model" aria-label="Model" value={model} onChange={event => setModel(event.target.value)} style={control}>{MODELS.map(value => <option key={value} value={value}>{value || 'Wszystkie modele'}</option>)}</select></label>
    <label>Rocznik<select id="parts-year" aria-label="Rocznik" value={year} onChange={event => setYear(event.target.value)} style={control}><option value="">Wszystkie roczniki</option>{Array.from({ length:13 }, (_, index) => 1988 + index).map(value => <option key={value} value={value}>{value}</option>)}</select></label>
    <label>Silnik<select id="parts-engine" aria-label="Silnik" value={engine} onChange={event => setEngine(event.target.value)} style={control}>{ENGINES.map(value => <option key={value} value={value}>{value || 'Wszystkie silniki'}</option>)}</select></label>
    <label>Skrzynia biegów<select id="parts-transmission" aria-label="Skrzynia biegów" value={transmission} onChange={event => setTransmission(event.target.value)} style={control}>{['', 'Automatyczna', 'Ręczna'].map(value => <option key={value} value={value}>{value || 'Wszystkie skrzynie'}</option>)}</select></label>
    <button type="submit" disabled={loading} style={{ gridColumn:'1 / -1', minHeight:48, border:0, borderRadius:8, padding:12, background:'#e7b95e', color:'#111111', fontSize:16, fontWeight:700, opacity:loading ? .65 : 1 }}>{loading ? 'Sprawdzam…' : 'Szukaj informacji'}</button>
   </form>
   {error && <p role="alert" style={{ margin:'16px 0 0', color:'#ffb4b4' }}>{error}</p>}
   {searched && !loading && !error && <p role="status" style={{ margin:'16px 0 0', color:'#d0d5dc' }}>{results.length ? 'Liczba wpisów zgodnych z filtrami: ' + results.length : 'Brak danych dla wybranych parametrów. Nie oznacza to, że część nie pasuje. Nie zmieniaj rocznika auta, aby uzyskać wynik.'}</p>}
  </section>
  {results.map((item, index) => <article key={item.part + index} style={panel}>
   <p style={{ margin:'0 0 8px', color:'#f2cf85', fontSize:13 }}>Wymaga weryfikacji — pasowanie niepotwierdzone</p>
   <h2 style={{ margin:'0 0 10px', color:'#fafafa', fontSize:20 }}>{item.part}</h2>
   <p style={{ color:'#d0d5dc' }}>Kategoria: {item.category}</p>
   <p style={{ color:'#d0d5dc' }}>Modele wymienione we wpisie: {item.fitsModels.join(', ')}</p>
   <p style={{ color:'#d0d5dc' }}>Zakres lat podany we wpisie: {item.yearRange[0]}–{item.yearRange[1]} — niezweryfikowany dla konkretnego numeru części.</p>
   <p style={{ color:'#d0d5dc', overflowWrap:'anywhere' }}>{item.notes}</p>
   <p style={{ margin:0, color:'#bdc6d2', fontSize:12 }}>Obecny wpis nie zawiera zweryfikowanego źródła dopasowania konkretnego numeru części.</p>
  </article>)}
 </main>;
}
