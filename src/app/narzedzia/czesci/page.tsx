'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
const MODELS = ['', 'C/K 1500', 'C/K 2500', 'C/K 3500', 'GMC Sierra 1500', 'Tahoe', 'Yukon', 'Suburban 1500', 'Suburban 2500', 'Suburban 3500'];
const ENGINES = ['', '4.3L V6', '5.0L V8', '5.7L V8', '7.4L V8', '6.5L Diesel'];
type Query = { model:string; year:string; engine:string; transmission:string; drivetrain:string };
type Entry = { part:string; category:string; fitsModels:string[]; yearRange:[number,number]; notes:string };
type Catalog = { title:string; vehicle:string; url:string; drivetrain:string };
type ResponseData = { results:Entry[]; externalCatalogs:Catalog[]; coverage:{ localRecords:number; message:string }; disclaimer:string };
const panel: CSSProperties = { boxSizing:'border-box', width:'100%', minWidth:0, padding:20, margin:'0 0 16px', border:'1px solid rgba(255,255,255,.14)', borderRadius:10, background:'#1a1a1d', color:'#ededed' };
const control: CSSProperties = { boxSizing:'border-box', display:'block', width:'100%', minWidth:0, minHeight:44, marginTop:6, padding:'10px 12px', border:'1px solid rgba(255,255,255,.22)', borderRadius:7, background:'#0d0d0e', color:'#fafafa', fontSize:16 };
export default function PartsPage() {
 const [query, setQuery] = useState<Query>({ model:'', year:'', engine:'', transmission:'', drivetrain:'' });
 const [data, setData] = useState<ResponseData | null>(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const pending = useRef<AbortController | null>(null);
 useEffect(() => () => pending.current?.abort(), []);
 const fields: { key:keyof Query; label:string; options:string[]; empty:string }[] = [
  { key:'model', label:'Model', options:MODELS, empty:'Wszystkie modele' },
  { key:'year', label:'Rocznik', options:['', ...Array.from({ length:13 }, (_, index) => String(1988 + index))], empty:'Wszystkie roczniki' },
  { key:'engine', label:'Silnik', options:ENGINES, empty:'Wszystkie silniki' },
  { key:'transmission', label:'Skrzynia biegów', options:['', 'Automatyczna', 'Ręczna'], empty:'Wszystkie skrzynie' },
  { key:'drivetrain', label:'Napęd', options:['', '2wd', '4x4'], empty:'Nieustalony — pokaż obie wersje katalogów' }
 ];
 async function search(event:FormEvent) {
  event.preventDefault(); pending.current?.abort();
  const controller = new AbortController(); pending.current = controller;
  setLoading(true); setError(''); setData(null);
  try {
   const params = new URLSearchParams();
   for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
   const response = await fetch('/api/parts?' + params.toString(), { signal:controller.signal });
   const result = await response.json();
   if (!response.ok) throw new Error(result.error ?? 'Nie udało się pobrać informacji.');
   if (!controller.signal.aborted) setData(result);
  } catch (exception) { if (!controller.signal.aborted) setError(exception instanceof Error ? exception.message : 'Błąd połączenia.'); }
  finally { if (!controller.signal.aborted) setLoading(false); }
 }
 return <div style={{ boxSizing:'border-box', width:'100%', maxWidth:1000, margin:'0 auto', padding:'20px 16px 120px', color:'#ededed' }}>
  <Link href="/narzedzia" style={{ display:'inline-flex', alignItems:'center', minHeight:44, marginBottom:16, color:'var(--accent-soft)' }}>← Wszystkie narzędzia</Link>
  <section style={panel}>
   <h1 style={{ margin:'0 0 12px', color:'#fafafa', fontSize:26 }}>Sprawdź informacje o częściach</h1>
   <p style={{ color:'#d0d5dc', lineHeight:1.65 }}>To pomoc w szukaniu, nie pełny katalog części. Zobacz wpisy lokalne oraz dostępne odnośniki do katalogów dostawców. Żaden wynik nie potwierdza automatycznie pasowania.</p>
   <form onSubmit={search} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap:14 }}>
    {fields.map(field => <div key={field.key} style={{ minWidth:0 }}><label htmlFor={'parts-' + field.key}>{field.label}</label><select id={'parts-' + field.key} aria-label={field.label} value={query[field.key]} onChange={event => setQuery(previous => ({ ...previous, [field.key]:event.target.value }))} style={control}>{field.options.map(value => <option key={value} value={value}>{value ? value === '2wd' ? '2WD — C1500' : value === '4x4' ? '4x4 — K1500' : value : field.empty}</option>)}</select></div>)}
    <button type="submit" disabled={loading} style={{ gridColumn:'1 / -1', minHeight:48, border:0, borderRadius:8, padding:12, background:'var(--accent)', color:'var(--accent-ink)', fontSize:16, fontWeight:700 }}>{loading ? 'Sprawdzam…' : 'Szukaj informacji'}</button>
   </form>
   {error && <p role="alert" style={{ marginTop:16, color:'var(--accent-soft)' }}>{error}</p>}
   {data && <p role="status" style={{ marginTop:16, color:'#d0d5dc' }}>{data.results.length ? 'Wpisy lokalne: ' + data.results.length + '.' : 'Brak danych lokalnych dla wybranego auta. Nie oznacza to, że część nie pasuje.'}{data.externalCatalogs.length ? ' Dostępne odnośniki do katalogów zewnętrznych: ' + data.externalCatalogs.length + '.' : ' Dla tego wyboru nie dodano jeszcze odnośników katalogowych.'}</p>}
  </section>
  {data && data.externalCatalogs.length > 0 && <section aria-label="Katalogi zewnętrzne" style={panel}>
   <h2 style={{ margin:'0 0 10px', color:'var(--accent-soft)', fontSize:20 }}>Sprawdź części w katalogach dostawców</h2>
   <p style={{ color:'#d0d5dc' }}>Odnośniki dotyczą Chevrolet. Przy nieustalonym napędzie pokazujemy osobno wersję C1500 i K1500 — wybierz właściwą. Nie pobieramy tu numerów części, cen ani stanów magazynowych.</p>
   {data.externalCatalogs.map(catalog => <a key={catalog.url} href={catalog.url} target="_blank" rel="noopener noreferrer" style={{ display:'block', marginTop:12, padding:16, border:'1px solid rgba(255,255,255,.22)', borderRadius:8, background:'#0d0d0e', color:'var(--accent-soft)', textDecoration:'none', overflowWrap:'anywhere' }}><span style={{ display:'block', fontWeight:700 }}>{catalog.title} ↗</span><span style={{ display:'block', marginTop:6, color:'#d0d5dc', fontSize:13 }}>{catalog.vehicle}</span><span style={{ display:'block', marginTop:6, fontSize:13 }}>Otwórz katalog i sprawdź zastosowanie</span></a>)}
  </section>}
  {data?.results.map((item, index) => <article key={item.part + index} style={panel}><p style={{ color:'var(--accent-soft)', fontSize:13 }}>Wpis lokalny — pasowanie niepotwierdzone</p><h2 style={{ color:'#fafafa', fontSize:20 }}>{item.part}</h2><p>Modele wymienione we wpisie: {item.fitsModels.join(', ')}</p><p>Zakres lat we wpisie: {item.yearRange[0]}–{item.yearRange[1]}.</p><p>{item.notes}</p></article>)}
  {data && <aside style={panel}><p style={{ margin:0, color:'#bdc6d2', fontSize:13 }}>{data.coverage.message} {data.disclaimer}</p></aside>}
 </div>;
}
