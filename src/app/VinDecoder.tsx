'use client';
import { useState } from 'react';
import Link from 'next/link';
import { decodeVin, vinHistoryLinks, VIN_SOURCES, UNKNOWN, type VinDecodeResult, type VinField, type VinSourceKey } from '@/lib/vin-decode.mjs';

const linkCls = 'inline-flex min-h-11 items-center text-red-400 underline break-words';
const Src = ({ k, short }: { k: VinSourceKey; short?: boolean }) => (
  <a href={VIN_SOURCES[k].url} target="_blank" rel="noopener noreferrer" title={VIN_SOURCES[k].title} className={linkCls}>{short ? VIN_SOURCES[k].short : VIN_SOURCES[k].title}</a>
);
const TIER = {
  gm: { text: 'dokument GM / NHTSA', cls: 'border-green-600/40 bg-green-600/10 text-green-200' },
  secondary: { text: 'źródło wtórne — sprawdź', cls: 'border-white/20 bg-white/5 text-neutral-200' },
  unknown: { text: UNKNOWN, cls: 'border-red-600/50 bg-red-600/10 text-red-200' },
} as const;

/** Pola z NHTSA vPIC, które pokazujemy (nazwa API → etykieta). */
const VPIC_FIELDS: [string, string][] = [
  ['Make', 'Marka'], ['Model', 'Model'], ['ModelYear', 'Rok modelowy'], ['Series', 'Seria'], ['Series2', 'Seria (2)'], ['Trim', 'Wersja'],
  ['BodyClass', 'Nadwozie'], ['Doors', 'Drzwi'], ['DriveType', 'Napęd'], ['GVWR', 'GVWR'], ['BrakeSystemType', 'Hamulce'],
  ['DisplacementL', 'Pojemność [l]'], ['EngineCylinders', 'Cylindry'], ['EngineConfiguration', 'Układ silnika'], ['FuelTypePrimary', 'Paliwo'],
  ['FuelInjectionType', 'Wtrysk'], ['EngineModel', 'Model silnika'], ['TransmissionStyle', 'Skrzynia'], ['PlantCity', 'Fabryka — miasto'],
  ['PlantState', 'Fabryka — stan'], ['PlantCountry', 'Fabryka — kraj'], ['Manufacturer', 'Producent'], ['VehicleType', 'Typ pojazdu'],
];
type Vpic = { state: 'idle' } | { state: 'loading' } | { state: 'error'; message: string } | { state: 'done'; data: Record<string, string>; fetchedAt: string };

/** Dekoder VIN GMT400: każda pozycja z tabel GM (lub oznaczonego źródła wtórnego), vPIC na żądanie i linki do historii. */
export default function VinDecoder({ onDecoded }: { onDecoded?: (vin: string | null, year: number | null, result?: VinDecodeResult) => void }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<VinDecodeResult | null>(null);
  const [vpic, setVpic] = useState<Vpic>({ state: 'idle' });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = decodeVin(input);
    setResult(r);
    setVpic({ state: 'idle' });
    onDecoded?.(r.ok ? r.vin : null, r.ok ? r.year : null, r);
  };
  const fetchVpic = async () => {
    if (!result?.ok || !result.year) return;
    setVpic({ state: 'loading' });
    try {
      const res = await fetch('/api/official-vehicle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'vin', vin: result.vin, year: result.year }), cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json?.data) { setVpic({ state: 'error', message: json?.error ?? `HTTP ${res.status}` }); return; }
      const data: Record<string, string> = {};
      for (const [k, v] of Object.entries(json.data as Record<string, unknown>)) if (typeof v === 'string' && v.trim() && v !== 'Not Applicable') data[k] = v.trim();
      setVpic({ state: 'done', data, fetchedAt: json.fetchedAt ?? '' });
    } catch { setVpic({ state: 'error', message: 'Brak połączenia z NHTSA — spróbuj ponownie.' }); }
  };
  return (
    <div data-testid="vin-decoder" className="min-w-0">
      <form onSubmit={submit} className="mb-6 border border-white/10 bg-neutral-950 p-4">
        <label htmlFor="vin-input" className="mb-2 block text-sm text-neutral-300">Numer VIN (17 znaków) — znajdziesz go u góry deski po stronie kierowcy, pod szybą</label>
        <input id="vin-input" aria-label="Numer VIN do dekodowania" type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" spellCheck={false}
          placeholder="np. 1GCEK19R…" value={input} onChange={e => setInput(e.target.value.toUpperCase())} maxLength={20}
          className="mb-4 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-lg tracking-wider focus:border-red-600 focus:outline-none" />
        <button type="submit" className="min-h-11 w-full bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500">DEKODUJ VIN</button>
        <p className="mt-2 text-xs text-neutral-400">Dekodowanie odbywa się w przeglądarce. VIN trafia do NHTSA tylko, gdy klikniesz „Pobierz dane z NHTSA vPIC”.</p>
      </form>
      {result && !result.ok && (
        <div role="alert" className="mb-6 border border-red-600/50 bg-red-600/10 p-4 text-red-100" data-testid="vin-errors">
          {result.errors.map(e => <p key={e}>{e}</p>)}
        </div>
      )}
      {result && result.ok && (
        <div className="min-w-0 space-y-4" data-testid="vin-result">
          <div className={`border p-4 ${result.check.ok ? 'border-green-600/40 bg-green-600/10' : 'border-red-600/50 bg-red-600/10'}`} data-testid="vin-check">
            <p className="font-semibold text-white">{result.check.ok ? '✓ Cyfra kontrolna się zgadza' : '✗ Cyfra kontrolna się nie zgadza'}</p>
            <p className="text-sm text-neutral-200">Poz. 9 = <strong className="font-mono">{result.check.value}</strong>, wyliczona = <strong className="font-mono">{result.check.expected}</strong>. {result.check.ok ? 'VIN jest poprawnie zapisany (to nie potwierdza historii auta).' : 'Najczęściej to literówka — porównaj VIN z tabliczką na desce, naklejką na drzwiach i dowodem.'}</p>
          </div>
          <div className="min-w-0 border border-red-600/30 bg-neutral-950 p-4">
            <h3 className="mb-1 text-lg font-bold text-red-400">CO OZNACZA KAŻDA POZYCJA VIN</h3>
            <p className="mb-3 text-xs text-neutral-400">Chevrolet/GMC C/K, Suburban, Tahoe/Yukon 1988–2000. Przy każdej pozycji: źródło i jego rodzaj. Brak tabeli = „{UNKNOWN}”.</p>
            <ul className="divide-y divide-white/10" data-testid="vin-fields">
              {result.fields.map(f => <FieldRow key={f.pos} f={f} />)}
            </ul>
            <details className="mt-3 text-xs text-neutral-300"><summary className="min-h-11 cursor-pointer content-center font-semibold text-white">Pełne nazwy źródeł</summary>
              <ul className="mt-1 space-y-0.5">{(Object.keys(VIN_SOURCES) as VinSourceKey[]).map(k => <li key={k}><Src k={k} /></li>)}</ul>
            </details>
            <p className="mt-2 text-xs text-neutral-400">Budowa VIN, cyfra kontrolna i kod roku: <Src k="cfr" />. Pozycja 7 w ciężarówkach GM to nadwozie (w osobówkach GM — system pasów/poduszek).</p>
            <p className="mt-2 rounded border border-white/10 bg-white/5 p-2 text-xs text-neutral-300">⚠ Dokładny silnik i wyposażenie potwierdza naklejka Service Parts Identification (kody RPO) w schowku lub na drzwiach — sprawdź w swoim aucie / manualu.</p>
          </div>
          <div className="min-w-0 border border-white/10 bg-neutral-950 p-4" data-testid="vin-vpic">
            <h3 className="mb-2 text-lg font-bold text-red-400">DANE Z NHTSA vPIC</h3>
            <p className="text-sm text-neutral-300">Oficjalna baza NHTSA — dodatkowe pola (seria, nadwozie, pojemność, wtrysk, fabryka). vPIC też bywa niepełny dla starszych aut.</p>
            {result.year ? (
              <button type="button" onClick={fetchVpic} disabled={vpic.state === 'loading'} data-testid="vin-vpic-fetch" className="mt-3 min-h-11 w-full border border-red-600 px-4 py-2 font-semibold text-red-200 transition hover:bg-red-600/20 disabled:opacity-60 sm:w-auto">
                {vpic.state === 'loading' ? 'Pobieram…' : 'Pobierz dane z NHTSA vPIC'}
              </button>
            ) : <p className="mt-2 text-sm text-neutral-400">Najpierw musi się zgadzać rok modelowy (1988–2000).</p>}
            {vpic.state === 'error' && <p role="alert" className="mt-3 text-sm text-red-200">{vpic.message}</p>}
            {vpic.state === 'done' && (
              <div className="mt-3" role="status">
                {vpic.data.ErrorText && !/^0\b/.test(vpic.data.ErrorText) && <p className="mb-2 text-sm text-red-200">vPIC: {vpic.data.ErrorText}</p>}
                <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2" data-testid="vin-vpic-data">
                  {VPIC_FIELDS.filter(([k]) => vpic.data[k]).map(([k, label]) => (
                    <div key={k} className="min-w-0 border-b border-white/5 py-1"><dt className="text-xs text-neutral-400">{label}</dt><dd className="break-words text-neutral-100">{vpic.data[k]}</dd></div>
                  ))}
                </dl>
                <p className="mt-2 text-xs text-neutral-400">Źródło: <Src k="vpic" /> (DecodeVinValues).</p>
              </div>
            )}
            <p className="mt-2 flex flex-wrap gap-x-4"><Link href="/narzedzia/dane-pojazdu" className={linkCls}>Kampanie serwisowe i dane EPA</Link><Link href="/narzedzia/rpo" className={linkCls}>Dekoder kodów RPO z naklejki</Link></p>
          </div>
          <div className="min-w-0 border border-white/10 bg-neutral-950 p-4" data-testid="vin-history">
            <h3 className="mb-2 text-lg font-bold text-red-400">ZDJĘCIA I HISTORIA TEGO VIN</h3>
            <p className="text-sm text-neutral-300">Linki otwierają wyszukiwanie w zewnętrznych serwisach. Nie pobieramy ani nie kopiujemy cudzych zdjęć i raportów — wyniki zależą od tych serwisów.</p>
            <ul className="mt-2 grid gap-x-4 sm:grid-cols-2">
              {vinHistoryLinks(result.vin).map(l => <li key={l.label} className="min-w-0"><a href={l.href} target="_blank" rel="noopener noreferrer nofollow" className={linkCls}>{l.label} ↗</a></li>)}
            </ul>
            <p className="mt-2 text-xs text-neutral-400">Pełna analiza historii: <Link href="/narzedzia/historia-vin" className="text-red-400 underline">Historia VIN</Link>.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldRow({ f }: { f: VinField }) {
  const testId = f.pos === '8' ? 'vin-engine' : f.pos === '10' ? 'vin-year' : `vin-pos-${f.pos.split('–')[0]}`;
  const tier = TIER[f.value === null ? 'unknown' : f.tier];
  return (
    <li className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 py-2" data-testid={testId}>
      <span className="text-xs text-neutral-400">poz. {f.pos}<span className="block break-all font-mono text-base font-bold text-red-300">{f.code}</span></span>
      <span className="min-w-0">
        <strong className="block text-white">{f.label}</strong>
        <span className="text-sm text-neutral-200">{f.value ?? UNKNOWN}</span>
        {f.note && <span className="block text-xs text-neutral-400">{f.note}</span>}
        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs">
          <span className={`rounded border px-1.5 py-0.5 ${tier.cls}`}>{tier.text}</span>
          {f.sources.map(k => <Src key={k} k={k} short />)}
        </span>
      </span>
    </li>
  );
}
