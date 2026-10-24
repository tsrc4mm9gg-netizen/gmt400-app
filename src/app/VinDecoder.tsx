'use client';
import { useState } from 'react';
import { badgeText, NOT_COUNTABLE_REASON, sortByHits } from '@/lib/vin-hits.mjs';
import Link from 'next/link';
import { decodeVin, profileFromVin, vinHistoryLinks, VIN_SOURCES, UNKNOWN, type VinDecodeResult, type VinField, type VinSourceKey } from '@/lib/vin-decode.mjs';
import { decodeRpo, findRpo } from '@/lib/rpo-catalog';
import { EMPTY_VEHICLE_PROFILE, isValidVehicleProfile, normalizeRpoCodes, type VehicleProfile } from '@/lib/vehicle-profile';
import { useStoredVehicleProfile, writeProfile } from '@/lib/vehicle-profile-store';

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

/** vPIC podaje GVWR jako „Class 2E: 6,001 - 7,000 lb (2,722 - 3,175 kg)” — kg na początek, lb w nawias. */
function vpicValue(key: string, value: string) {
  if (key !== 'GVWR') return value;
  const m = value.match(/^(.*?)([\d,]+\s*-\s*[\d,]+\s*lb)\s*\(([^)]*kg)\)/i);
  return m ? `${m[1]}${m[3]} (${m[2]})` : value;
}

/** Krótkie podsumowanie na górze: tylko pola z tabel (albo „nieznane – sprawdź”). */
function summaryOf(r: Extract<VinDecodeResult, { ok: true }>) {
  const f = Object.fromEntries(r.fields.map(x => [x.pos, x])) as Record<string, VinField>;
  const p = profileFromVin(r);
  const v = (pos: string) => f[pos]?.value ?? UNKNOWN;
  const series = p?.model ?? [f['5']?.value, f['6']?.value].filter(Boolean).join(', ');
  return [
    ['Marka', p?.brand ?? v('3')],
    ['Seria / model', series || UNKNOWN],
    ['Rok modelowy', v('10')],
    ['Silnik', v('8')],
    ['Nadwozie', v('7')],
    ['Fabryka', v('11')],
  ] as [string, string][];
}

const sectionCls = 'min-w-0 border border-white/10 bg-neutral-950';
const summaryCls = 'flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-3 text-base font-semibold text-white hover:text-red-300 [&::-webkit-details-marker]:hidden';
const Chevron = () => <span aria-hidden="true" className="text-red-400 transition group-open:rotate-90">›</span>;

/** Dekoder VIN GMT400: jedno pole + przycisk, podsumowanie na górze, szczegóły w rozwijanych sekcjach. */
export default function VinDecoder({ onDecoded, withRpo = false }: { onDecoded?: (vin: string | null, year: number | null, result?: VinDecodeResult) => void; withRpo?: boolean }) {
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
  // Wklejony tekst: usuń spacje/myślniki, wielkie litery (VIN z dowodu bywa z odstępami).
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    setInput(text.replace(/[\s-]/g, '').toUpperCase().slice(0, 20));
  };
  const len = input.replace(/[\s-]/g, '').length;
  return (
    <div data-testid="vin-decoder" className="min-w-0">
      <form onSubmit={submit} className="mb-4 border border-white/10 bg-neutral-950 p-4">
        <label htmlFor="vin-input" className="mb-2 block text-sm text-neutral-300">Numer VIN (17 znaków) — u góry deski po stronie kierowcy, pod szybą, albo w dowodzie rejestracyjnym (pole E)</label>
        <input id="vin-input" aria-label="Numer VIN do dekodowania" aria-describedby="vin-hint" type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go"
          placeholder="np. 1GCEK19R…" value={input} onChange={e => setInput(e.target.value.toUpperCase())} onPaste={onPaste} maxLength={20}
          className="mb-1 min-h-14 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-lg uppercase tracking-wider focus:border-red-600 focus:outline-none" />
        <p id="vin-hint" className="mb-3 text-xs text-neutral-400" data-testid="vin-length">{len === 17 ? '17 znaków — gotowe.' : `Wpisano ${len} z 17 znaków.`} Litery I, O i Q nie występują w VIN.</p>
        <button type="submit" className="min-h-12 w-full bg-red-600 py-3 text-base font-semibold text-white transition hover:bg-red-500">DEKODUJ VIN</button>
        <p className="mt-2 text-xs text-neutral-400">Dekodowanie odbywa się w przeglądarce. VIN trafia do NHTSA tylko, gdy klikniesz „Pobierz dane z NHTSA vPIC”.</p>
      </form>
      {result && !result.ok && (
        <div role="alert" className="mb-6 border border-red-600/50 bg-red-600/10 p-4 text-red-100" data-testid="vin-errors">
          {result.errors.map(e => <p key={e}>{e}</p>)}
        </div>
      )}
      {result && result.ok && (
        <div className="min-w-0 space-y-3" data-testid="vin-result">
          <div className="min-w-0 border border-red-600/40 bg-neutral-950 p-4" data-testid="vin-summary">
            <h3 className="mb-3 text-lg font-bold text-red-400">TWÓJ VIN W SKRÓCIE</h3>
            <p className="mb-3 break-all font-mono text-base tracking-wider text-white">{result.vin}</p>
            <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
              {summaryOf(result).map(([label, value]) => (
                <div key={label} className="min-w-0 border-b border-white/5 pb-1"><dt className="text-xs uppercase tracking-wide text-neutral-400">{label}</dt><dd className={`break-words ${value === UNKNOWN ? 'text-red-200' : 'text-neutral-100'}`}>{value}</dd></div>
              ))}
            </dl>
          </div>
          <div className={`border p-4 ${result.check.ok ? 'border-green-600/40 bg-green-600/10' : 'border-red-600/50 bg-red-600/10'}`} data-testid="vin-check">
            <p className="font-semibold text-white">{result.check.ok ? '✓ Cyfra kontrolna się zgadza' : '✗ Cyfra kontrolna się nie zgadza'}</p>
            <p className="text-sm text-neutral-200">Poz. 9 = <strong className="font-mono">{result.check.value}</strong>, wyliczona = <strong className="font-mono">{result.check.expected}</strong>. {result.check.ok ? 'VIN jest poprawnie zapisany (to nie potwierdza historii auta).' : 'Najczęściej to literówka — porównaj VIN z tabliczką na desce, naklejką na drzwiach i dowodem.'}</p>
          </div>
          <details className={`group ${sectionCls}`} data-testid="vin-positions">
            <summary className={summaryCls}><span>Co oznacza każda pozycja VIN (12)</span><Chevron /></summary>
            <div className="border-t border-white/10 p-4 pt-3">
              <p className="mb-3 text-xs text-neutral-400">Chevrolet/GMC C/K, Suburban, Tahoe/Yukon 1988–2000. Przy każdej pozycji: źródło i jego rodzaj. Brak tabeli = „{UNKNOWN}”. Masy w kg, w nawiasie lb jak w tabeli GM.</p>
              <ul className="divide-y divide-white/10" data-testid="vin-fields">
                {result.fields.map(f => <FieldRow key={f.pos} f={f} />)}
              </ul>
              <p className="mt-2 text-xs text-neutral-400">Budowa VIN, cyfra kontrolna i kod roku: <Src k="cfr" />. Pozycja 7 w ciężarówkach GM to nadwozie (w osobówkach GM — system pasów/poduszek).</p>
              <p className="mt-2 rounded border border-white/10 bg-white/5 p-2 text-xs text-neutral-300">⚠ Dokładny silnik i wyposażenie potwierdza naklejka Service Parts Identification (kody RPO) w schowku lub na drzwiach — sprawdź w swoim aucie / manualu.</p>
            </div>
          </details>
          <details className={`group ${sectionCls}`} data-testid="vin-sources">
            <summary className={summaryCls}><span>Źródła dekodera</span><Chevron /></summary>
            <ul className="space-y-0.5 border-t border-white/10 p-4 pt-3 text-xs text-neutral-300">{(Object.keys(VIN_SOURCES) as VinSourceKey[]).map(k => <li key={k}><Src k={k} /></li>)}</ul>
          </details>
          <details className={`group ${sectionCls}`} data-testid="vin-vpic">
            <summary className={summaryCls}><span>Dane z NHTSA vPIC</span><Chevron /></summary>
            <div className="border-t border-white/10 p-4 pt-3">
              <p className="text-sm text-neutral-300">Oficjalna baza NHTSA — dodatkowe pola (seria, nadwozie, pojemność, wtrysk, fabryka). vPIC też bywa niepełny dla starszych aut.</p>
              {result.year ? (
                <button type="button" onClick={fetchVpic} disabled={vpic.state === 'loading'} data-testid="vin-vpic-fetch" className="mt-3 min-h-12 w-full border border-red-600 px-4 py-2 font-semibold text-red-200 transition hover:bg-red-600/20 disabled:opacity-60 sm:w-auto">
                  {vpic.state === 'loading' ? 'Pobieram…' : 'Pobierz dane z NHTSA vPIC'}
                </button>
              ) : <p className="mt-2 text-sm text-neutral-400">Najpierw musi się zgadzać rok modelowy (1988–2000).</p>}
              {vpic.state === 'error' && <p role="alert" className="mt-3 text-sm text-red-200">{vpic.message}</p>}
              {vpic.state === 'done' && (
                <div className="mt-3" role="status">
                  {vpic.data.ErrorText && !/^0\b/.test(vpic.data.ErrorText) && <p className="mb-2 text-sm text-red-200">vPIC: {vpic.data.ErrorText}</p>}
                  <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2" data-testid="vin-vpic-data">
                    {VPIC_FIELDS.filter(([k]) => vpic.data[k]).map(([k, label]) => (
                      <div key={k} className="min-w-0 border-b border-white/5 py-1"><dt className="text-xs text-neutral-400">{label}</dt><dd className="break-words text-neutral-100">{vpicValue(k, vpic.data[k])}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-2 text-xs text-neutral-400">Źródło: <Src k="vpic" /> (DecodeVinValues).</p>
                </div>
              )}
              <p className="mt-2 flex flex-wrap gap-x-4"><Link href="/narzedzia/dane-pojazdu" className={linkCls}>Kampanie serwisowe i dane EPA</Link><Link href="/narzedzia/rpo" className={linkCls}>Pełny katalog kodów RPO</Link></p>
            </div>
          </details>
          <VinHistory vin={result.vin} key={result.vin} />
          {withRpo && <VinRpoAndSave result={result} />}
        </div>
      )}
    </div>
  );
}

/** Kody RPO z naklejki SPID dekodowane od razu + zapis VIN i RPO w „Mój samochód”. */
function VinRpoAndSave({ result }: { result: Extract<VinDecodeResult, { ok: true }> }) {
  const stored = useStoredVehicleProfile();
  const [rpo, setRpo] = useState('');
  const [saved, setSaved] = useState<'' | 'ok' | 'memory' | 'need-model'>('');
  const decoded = rpo.trim() ? decodeRpo(rpo) : null;
  const save = () => {
    const patch = profileFromVin(result) ?? {};
    const codes = normalizeRpoCodes(rpo);
    const base: VehicleProfile = stored && (!patch.brand || stored.brand === patch.brand) ? stored : { ...EMPTY_VEHICLE_PROFILE };
    const next: VehicleProfile = { ...base, vin: result.vin, rpoCodes: [...new Set([...base.rpoCodes, ...codes])].sort() };
    if (patch.brand) next.brand = patch.brand;
    if (patch.year) next.year = patch.year;
    if (patch.drive) next.drive = patch.drive;
    if (patch.engine) next.engine = patch.engine;
    if (patch.platform && patch.model) { next.platform = patch.platform; next.model = patch.model; }
    const engineFromRpo = codes.find(c => findRpo(c)?.category === 'Silniki');
    if (!next.engine && engineFromRpo) next.engine = engineFromRpo;
    const gear = codes.find(c => c === 'M30' || c === 'MT1');
    if (gear) next.transmission = gear === 'M30' ? '4L60E' : '4L80E';
    if (!isValidVehicleProfile(next)) { setSaved('need-model'); return; }
    setSaved(writeProfile(next) ? 'ok' : 'memory');
  };
  return (
    <div className="min-w-0 border border-white/10 bg-neutral-950 p-4" data-testid="vin-rpo">
      <label htmlFor="vin-rpo-input" className="mb-2 block text-base font-semibold text-white">Dopisz kody RPO z naklejki w schowku <span className="text-sm font-normal text-neutral-400">(opcjonalnie)</span></label>
      <p className="mb-2 text-xs text-neutral-400">Naklejka „Service Parts Identification” — trzyznakowe kody, np. G80 Z71 L31. Oddziel spacją.</p>
      <input id="vin-rpo-input" type="text" value={rpo} onChange={e => { setRpo(e.target.value.toUpperCase()); setSaved(''); }} placeholder="np. G80 Z71 L31" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false}
        className="min-h-12 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-base uppercase tracking-wider focus:border-red-600 focus:outline-none" />
      {decoded && decoded.results.length > 0 && (
        <ul className="mt-3 divide-y divide-white/10 text-sm" data-testid="vin-rpo-results" aria-live="polite">
          {decoded.results.map(r => (
            <li key={r.code} className="py-2" data-testid="vin-rpo-item" data-code={r.code}>
              <span className="font-mono font-bold text-red-300">{r.code}</span>{' '}
              {r.entry ? <span className="text-neutral-100">{r.entry.description} <span className="text-xs text-neutral-400">({r.entry.category}) — <a href={r.entry.sources[0]?.url ?? r.entry.source} target="_blank" rel="noopener noreferrer" className="text-red-400 underline">źródło</a></span></span>
                : <span className="text-red-200">nieznany kod – sprawdź{r.suggestion ? ` (może ${r.suggestion}?)` : ''}{r.hint ? ` — ${r.hint}` : ''}</span>}
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={save} data-testid="vin-save" className="mt-3 min-h-12 w-full bg-red-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-red-500 sm:w-auto">Zapisz VIN{rpo.trim() ? ' i RPO' : ''} w „Mój samochód”</button>
      {saved && (
        <p role="status" data-testid="vin-save-status" className={`mt-2 text-sm ${saved === 'need-model' ? 'text-red-200' : 'text-green-200'}`}>
          {saved === 'ok' && <>Zapisano w tej przeglądarce. <Link href="/moj-samochod" className="text-red-400 underline">Otwórz Mój samochód</Link></>}
          {saved === 'memory' && <>Zapisano tylko w tej karcie (pamięć przeglądarki niedostępna). <Link href="/moj-samochod" className="text-red-400 underline">Otwórz Mój samochód</Link></>}
          {saved === 'need-model' && <>Z VIN nie da się jednoznacznie odczytać modelu. <Link href="/moj-samochod" className="text-red-400 underline">Wybierz model w Mój samochód</Link> i wpisz tam VIN.</>}
        </p>
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

type Hits = { state: 'idle' | 'loading' | 'error' } | { state: 'done'; counts: Record<string, number | null>; notes: Record<string, string>; models: string[]; label: string };

/** „Zdjęcia i historia tego VIN”: linki + liczba wyników tam, gdzie źródło daje ją legalnie (NHTSA API). Pobieramy dopiero po otwarciu sekcji. */
function VinHistory({ vin }: { vin: string }) {
  const [hits, setHits] = useState<Hits>({ state: 'idle' });
  const load = () => {
    if (hits.state !== 'idle') return;
    setHits({ state: 'loading' });
    fetch('/api/vin-hits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ vin }) })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then(d => setHits({ state: 'done', counts: d.counts ?? {}, notes: d.notes ?? {}, models: d.scope?.nhtsaModels ?? [], label: d.scope ? `${d.scope.year} ${d.scope.make}` : '' }))
      .catch(() => setHits({ state: 'error' }));
  };
  const links = vinHistoryLinks(vin);
  const countOf = (l: (typeof links)[number]) => (hits.state === 'done' && l.count ? hits.counts[l.count] : undefined);
  const ordered = hits.state === 'done' ? sortByHits(links, Object.fromEntries(links.map(l => [l.id, countOf(l)]))) : links;
  return (
    <details className={`group ${sectionCls}`} data-testid="vin-history" onToggle={e => { if ((e.currentTarget as HTMLDetailsElement).open) load(); }}>
      <summary className={summaryCls}><span>Zdjęcia i historia tego VIN</span><Chevron /></summary>
      <div className="border-t border-white/10 p-4 pt-3">
        <p className="text-sm text-neutral-300">Linki otwierają wyszukiwanie w zewnętrznych serwisach. Nie pobieramy ani nie kopiujemy cudzych zdjęć i raportów — wyniki zależą od tych serwisów.</p>
        <p className="mt-2 text-xs text-neutral-400" data-testid="vin-hits-note">Liczba przed linkiem = rekordy w oficjalnej bazie NHTSA dla rocznika i modelu (nie tylko tego egzemplarza; akcje obejmują też kampanie na części i akcesoria pasujące do auta); <span className="text-neutral-500">0</span> = baza nic nie zwróciła. „sprawdź” = serwis nie podaje liczby bez captchy lub płatnego dostępu — otwórz link.</p>
        <ul className="mt-2 grid gap-x-4 sm:grid-cols-2" data-testid="vin-history-list">
          {ordered.map(l => {
            const c = countOf(l);
            const text = badgeText(c);
            const zero = text === '0';
            const loading = hits.state === 'loading' && l.count;
            const internal = l.href.startsWith('/');
            const badge = loading
              ? <span className="inline-flex h-7 w-16 shrink-0 animate-pulse items-center justify-center border border-white/10 bg-white/10 text-xs text-neutral-400" aria-label="liczę…">…</span>
              : text !== null
                ? <span className={`inline-flex h-7 w-16 shrink-0 items-center justify-center border text-sm font-bold tabular-nums ${zero ? 'border-white/15 text-neutral-500' : 'border-red-500 bg-red-600 text-white'}`} aria-label={`${text} ${zero ? '— brak rekordów' : 'rekordów'}`} data-testid={`vin-hit-${l.id}`}>{text}</span>
                : <span className="inline-flex h-7 w-16 shrink-0 items-center justify-center border border-dashed border-white/20 text-[11px] uppercase tracking-wide text-neutral-400" aria-label="liczba niedostępna — sprawdź w serwisie" data-testid={`vin-hit-${l.id}`}>{l.count && hits.state !== 'idle' ? '?' : 'sprawdź'}</span>;
            return (
              <li key={l.id} className={`flex min-w-0 items-center gap-3 ${zero ? 'opacity-60' : ''}`}>
                {badge}
                {internal
                  ? <Link href={l.href} className={`${linkCls} min-w-0`}>{l.label}</Link>
                  : <a href={l.href} target="_blank" rel="noopener noreferrer nofollow" className={`${linkCls} min-w-0`}>{l.label} ↗</a>}
              </li>
            );
          })}
        </ul>
        {hits.state === 'done' && hits.models.length > 0 && <p className="mt-2 text-xs text-neutral-400" data-testid="vin-hits-scope">NHTSA {hits.label}: zsumowano nazwy modelu {hits.models.join(', ')} (każda kampania/skarga liczona raz).</p>}
        {hits.state === 'done' && Object.values(hits.notes).length > 0 && <p className="mt-1 text-xs text-neutral-400">{[...new Set(Object.values(hits.notes))].join(' ')}</p>}
        {hits.state === 'error' && <p className="mt-2 text-xs text-neutral-400" role="status">Nie udało się pobrać liczników — to nie znaczy, że wyników nie ma.</p>}
        <details className="mt-2 text-xs text-neutral-400">
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-neutral-300 underline">Dlaczego przy części linków nie ma liczby?</summary>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            {[...new Set(links.filter(l => l.reason).map(l => l.reason as string))].map(r => <li key={r}>{links.filter(l => l.reason === r).map(l => l.label.split(' — ')[0].replace(/^Historia aukcji: |^Archiwum aukcji: /, '').replace(/ \(.*\)$/, '')).join(', ')}: {NOT_COUNTABLE_REASON[r]}</li>)}
          </ul>
        </details>
        <p className="mt-2 text-xs text-neutral-400">Pełna analiza historii: <Link href="/narzedzia/historia-vin" className="text-red-400 underline">Historia VIN</Link>.</p>
      </div>
    </details>
  );
}
