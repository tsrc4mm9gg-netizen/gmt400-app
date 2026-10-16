'use client';
import { useEffect, useState } from 'react';
export default function VinHistorySummary({ vin }: { vin: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    setLoading(true); setError(''); setData(null);
    fetch('/api/vin-history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vin }), signal: controller.signal })
      .then(async response => {
        const json = await response.json();
        if (!response.ok || json.status !== 'ok') throw new Error(json.message || json.error || 'Wyszukiwanie nie zostało ukończone.');
        if (active) setData(json);
      })
      .catch(e => { if (active) setError(e.name === 'AbortError' ? 'Przekroczono czas wyszukiwania. Nie potwierdzono braku wyników.' : e.message); })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [vin, attempt]);
  const safe = (url: string) => /^https?:\/\//i.test(url) ? url : '#';
  const results = (data?.results || []).filter((r: any) => [r.title, r.description, r.url].join(' ').toUpperCase().includes(vin));
  const sources = new Set(results.map((r: any) => r.url));
  const images = (data?.images || []).filter((image: any) => sources.has(image.sourceUrl) && safe(image.url) !== '#');
  return <section className="space-y-4" aria-live="polite">
    <p className="text-sm text-neutral-400">Pełny VIN: <span className="font-mono text-white">{vin}</span></p>
    {loading && <p role="status">Wyszukuję publiczne informacje i zdjęcia…</p>}
    {error && <div role="alert"><p>{error}</p><button type="button" className="underline" onClick={() => setAttempt(n => n + 1)}>Ponów wyszukiwanie</button></div>}
    {data && <>
      <p>Znaleziono {results.length} wyników zawierających pełny VIN w tytule, opisie wyszukiwarki lub adresie. Treść stron nie została zweryfikowana.</p>
      {results.map((r: any, i: number) => <div key={i} className="bg-neutral-900 p-3">
        {r.category === 'damage' && <p className="text-amber-400">Opis zawiera słowa dotyczące szkody — sprawdź źródło. Nie jest to potwierdzenie wypadku.</p>}
        <a className="text-amber-400 underline" href={safe(r.url)} target="_blank" rel="noopener noreferrer">{r.title || r.url}</a><p className="text-sm text-neutral-400">{r.description}</p>
      </div>)}
      <h4 className="font-semibold text-amber-400">PODSUMOWANIE ZDJĘĆ I GRAFIK</h4>
      <p>Znaleziono {images.length} potencjalnych obrazów w {new Set(images.map((image: any) => image.sourceUrl)).size} stronach źródłowych. Zdjęcia nie zostały potwierdzone jako przedstawiające ten egzemplarz; mogą pochodzić z innych elementów strony.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{images.map((image: any, i: number) => <figure key={i} className="bg-neutral-900 p-2">
        <a href={safe(image.sourceUrl)} target="_blank" rel="noopener noreferrer"><img src={image.url} alt="Niezweryfikowany obraz ze strony znalezionej po VIN" loading="lazy" referrerPolicy="no-referrer" className="w-full h-36 object-contain" /></a>
        <figcaption className="text-xs text-neutral-400"><a className="underline" href={safe(image.sourceUrl)} target="_blank" rel="noopener noreferrer">{image.sourceTitle || 'Źródło zdjęcia'}</a></figcaption>
      </figure>)}</div>
      <p className="text-xs text-neutral-500">Brak wyników nie potwierdza bezwypadkowości. Publiczne wyszukiwanie może być niepełne lub ograniczone przez dostawcę.</p>
    </>}
    <a className="text-amber-400 underline" href={'https://duckduckgo.com/?q=' + encodeURIComponent('"' + vin + '"')} target="_blank" rel="noopener noreferrer">Sprawdź pełny VIN ręcznie</a>
  </section>;
}
