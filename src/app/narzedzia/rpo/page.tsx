'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useVehicleProfile } from '../../VehicleProfileProvider';
import { RPO_AGGREGATOR, RPO_CATALOG, RPO_CATEGORIES, RPO_DOCS, RPO_VEHICLES, decodeRpo, rpoFit, rpoVehicleFor, type RpoEntry, type RpoFit } from '@/lib/rpo-catalog';

const YEARS = Array.from({ length: 13 }, (_, i) => String(1988 + i));
const LIMIT = 120;
const FIT_LABEL: Record<RpoFit, string> = {
  listed: 'Jest w dokumentach GM dla tego modelu i rocznika',
  'other-years': 'Dla tego modelu tylko w innych rocznikach',
  'other-vehicle': 'Brak w dokumentach dla tego modelu',
  'no-data': '',
};
const STATUS_LABEL = { verified: '', disputed: 'Opis sporny w źródłach', internal: 'Kod wewnętrzny / zakładowy GM' } as const;

type Result = { kind: 'entry'; entry: RpoEntry } | { kind: 'unknown'; code: string; suggestion: string | null; hint: string | null };

function search(query: string, category: string): { results: Result[]; mode: 'decode' | 'search' | 'browse' | 'none'; ratioConflict: boolean } {
  const q = query.trim();
  const inCategory = (entry: RpoEntry) => !category || entry.category === category;
  if (!q) {
    if (!category) return { results: [], mode: 'none', ratioConflict: false };
    return { results: RPO_CATALOG.filter(inCategory).map(entry => ({ kind: 'entry', entry })), mode: 'browse', ratioConflict: false };
  }
  const decoded = decodeRpo(q);
  const codeLike = decoded.results.every(r => r.entry || r.hint || /^[A-Z0-9]{3}$/.test(r.code)) && decoded.results.some(r => r.entry || r.hint || /\d/.test(r.code));
  if (codeLike) {
    const results: Result[] = decoded.results.flatMap((r): Result[] => r.entry ? (inCategory(r.entry) ? [{ kind: 'entry', entry: r.entry }] : []) : [{ kind: 'unknown', code: r.code, suggestion: r.suggestion, hint: r.hint }]);
    return { results, mode: 'decode', ratioConflict: decoded.ratioConflict };
  }
  const lower = q.toLowerCase();
  const results: Result[] = RPO_CATALOG.filter(entry => inCategory(entry) && (entry.code.includes(q.toUpperCase()) || entry.description.toLowerCase().includes(lower) || entry.original.toLowerCase().includes(lower))).map(entry => ({ kind: 'entry', entry }));
  return { results, mode: 'search', ratioConflict: false };
}

export default function RpoPage() {
  const { profile } = useVehicleProfile();
  const profileVehicle = profile ? rpoVehicleFor(profile.brand, profile.platform) : null;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [vehicleChoice, setVehicleChoice] = useState<string | null>(null);
  const [yearChoice, setYearChoice] = useState<string | null>(null);
  const vehicle = vehicleChoice ?? profileVehicle ?? '';
  const year = yearChoice ?? (profile?.year || '');
  const [submitted, setSubmitted] = useState<{ query: string; category: string } | null>(null);
  const outcome = useMemo(() => submitted ? search(submitted.query, submitted.category) : null, [submitted]);
  const shown = outcome ? outcome.results.slice(0, LIMIT) : [];
  const fillFromProfile = () => { if (profile?.rpoCodes.length) { setQuery(profile.rpoCodes.join(' ')); setSubmitted({ query: profile.rpoCodes.join(' '), category }); } };

  return <div className="mx-auto max-w-4xl space-y-4 p-4">
    <section className="rounded-xl border p-5">
      <h1 className="text-2xl font-semibold text-white">Co oznaczają kody RPO?</h1>
      <p className="mt-1 text-sm text-neutral-300">Wklej kody z naklejki <strong>Service Parts Identification</strong> (zwykle w schowku lub na drzwiach), np. <strong>G80 Z71 GU6 L31 M30</strong> — każdy zostanie rozkodowany osobno. Możesz też szukać po nazwie, np. „przełożenie” albo „holowanie”, lub przeglądać kategorię.</p>
      <form onSubmit={event => { event.preventDefault(); setSubmitted({ query, category }); }} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 sm:col-span-2"><label htmlFor="rpo-query" className="mb-1 block text-sm font-medium text-white">Kody RPO lub szukana fraza</label><input id="rpo-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Wpisz kod lub szukaną frazę" autoCapitalize="characters" autoCorrect="off" spellCheck={false} autoComplete="off" className="w-full rounded-lg border px-3 py-2" /></div>
        <div className="min-w-0"><label htmlFor="rpo-category" className="mb-1 block text-sm font-medium text-white">Kategoria kodów RPO</label><select id="rpo-category" value={category} onChange={event => setCategory(event.target.value)} className="w-full rounded-lg border px-3 py-2"><option value="">Wszystkie kategorie</option>{RPO_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
        <div className="grid min-w-0 grid-cols-[1fr_6.5rem] gap-3">
          <div className="min-w-0"><label htmlFor="rpo-vehicle" className="mb-1 block text-sm font-medium text-white">Porównaj z modelem</label><select id="rpo-vehicle" value={vehicle} onChange={event => setVehicleChoice(event.target.value)} className="w-full rounded-lg border px-3 py-2"><option value="">— bez porównania —</option>{RPO_VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}</select></div>
          <div className="min-w-0"><label htmlFor="rpo-year" className="mb-1 block text-sm font-medium text-white">Rocznik</label><select id="rpo-year" value={year} onChange={event => setYearChoice(event.target.value)} className="w-full rounded-lg border px-3 py-2"><option value="">—</option>{YEARS.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
        </div>
        <button type="submit" className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white sm:col-span-2">Sprawdź kody</button>
      </form>
      <p className="mt-3 text-xs text-neutral-400">Baza: <strong>{RPO_CATALOG.length}</strong> kodów wydrukowanych w dokumentach GM dla GMT400 (Chevrolet C/K, Suburban, Tahoe; GMC Sierra, Suburban, Yukon), lata 1988–2000. Kodów spoza dokumentów nie dopisujemy — pokażemy je jako „nieznany – sprawdź”.</p>
      {profile && <p className="mt-2 text-sm text-neutral-300">Twoje auto: <Link href="/moj-samochod" className="underline">{profile.brand} {profile.model}{profile.year ? ' ' + profile.year : ''}</Link>{profile.rpoCodes.length > 0 && <> · <button type="button" onClick={fillFromProfile} className="ml-1 rounded-lg border px-3 py-1 text-sm">Wstaw moje kody RPO ({profile.rpoCodes.length})</button></>}</p>}
    </section>

    {outcome && outcome.mode !== 'none' && <p className="text-sm text-neutral-300" role="status" data-testid="rpo-count">{outcome.mode === 'decode' ? 'Rozkodowane pozycje' : 'Znaleziono wyników'}: <strong>{outcome.results.length}</strong>{outcome.results.length > LIMIT && ` (pokazano ${LIMIT} — zawęź kategorię lub frazę)`}</p>}
    {outcome?.mode === 'none' && <p className="text-sm text-neutral-300" role="status">Wpisz kody albo wybierz kategorię.</p>}
    {outcome?.ratioConflict && <p className="rounded-lg border border-red-600 p-3 text-sm text-red-200" data-testid="rpo-ratio-conflict">Uwaga: podane kody wskazują różne przełożenia tylnego mostu. Auto ma jedno przełożenie — sprawdź naklejkę jeszcze raz.</p>}
    {outcome && (outcome.mode === 'search' || outcome.mode === 'browse') && outcome.results.length === 0 && <p className="text-sm text-neutral-300">Brak kodów pasujących do frazy w tej kategorii.</p>}

    <div className="space-y-3" data-testid="rpo-results">{shown.map((item, index) => item.kind === 'unknown'
      ? <article key={`u-${item.code}-${index}`} data-testid="rpo-unknown" className="rounded-lg border p-4">
          <p className="text-base font-semibold text-white"><span className="mr-2 font-mono text-lg text-red-300">{item.code}</span>nieznany – sprawdź</p>
          <p className="mt-1 text-sm text-neutral-300">{item.hint ?? 'Tego kodu nie ma w dokumentach GM dla GMT400, z których korzystamy. Sprawdź pisownię na naklejce i w instrukcji serwisowej swojego rocznika.'}</p>
          {item.suggestion && <p className="mt-1 text-sm text-neutral-300">Czy chodziło o <button type="button" className="rounded-lg border px-2 py-1 font-mono text-sm" onClick={() => { const next = query.toUpperCase().split(/[\s,;|/]+/).map(t => t === item.code ? item.suggestion : t).join(' '); setQuery(next); setSubmitted({ query: next, category }); }}>{item.suggestion}</button>? Na naklejkach i w skanach litera O bywa mylona z zerem, a I z jedynką.</p>}
        </article>
      : <RpoCard key={`${item.entry.code}-${index}`} entry={item.entry} vehicle={vehicle || null} year={year ? Number(year) : null} />)}
    </div>

    <section className="rounded-xl border p-5" aria-labelledby="rpo-sources">
      <h2 id="rpo-sources" className="text-lg font-semibold text-white">Źródła</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
        <li><strong>GM Service Manual — General Information › RPO Code List</strong> (1998, 1999, 2000; Chevrolet i GMC, także wersje CNG 1997–2000). <a className="underline" href={RPO_DOCS.find(d => d.id === 'SM-1999-Chevrolet')?.url ?? RPO_DOCS[0].url} target="_blank" rel="noopener noreferrer">Przykład: lista RPO 1999</a>.</li>
        <li><strong>GM Heritage Center — Vehicle Information Kits</strong> (order guides Chevrolet Truck 1988–1999, Suburban 1992–1999, Tahoe 1995–1999) — przy każdym kodzie link do właściwego PDF.</li>
        <li><strong>{RPO_AGGREGATOR.label}</strong>: {RPO_AGGREGATOR.urls.map((url, i) => <span key={url}>{i > 0 && ' · '}<a className="underline" href={url} target="_blank" rel="noopener noreferrer">{RPO_VEHICLES[i]}</a></span>)}.</li>
      </ul>
      <p className="mt-2 text-xs text-neutral-400">Polskie opisy to tłumaczenie oryginalnego tekstu GM (oryginał przy każdym kodzie). Kody bez tłumaczenia pokazujemy w brzmieniu GM. Lata = roczniki, w których kod występuje w dokumentach dla danego modelu. Naklejka w Twoim aucie jest nadrzędna — <strong>sprawdź w swoim aucie / manualu</strong>.</p>
    </section>
  </div>;
}

function RpoCard({ entry, vehicle, year }: { entry: RpoEntry; vehicle: string | null; year: number | null }) {
  const fit = rpoFit(entry, vehicle, year);
  return <article className="rounded-lg border p-4" data-testid="rpo-result" data-code={entry.code}>
    <p className="text-base font-medium text-white"><span className="mr-2 font-mono text-lg font-bold text-red-300">{entry.code}</span>{entry.description}</p>
    <div className="mt-2 flex flex-wrap gap-2 text-xs">
      <span className="rounded-full border px-2 py-0.5">{entry.category}</span>
      {entry.status !== 'verified' && <span className="rounded-full border border-red-600 px-2 py-0.5 text-red-200">{STATUS_LABEL[entry.status]}</span>}
      {fit !== 'no-data' && <span data-testid="rpo-fit" data-fit={fit} className={`rounded-full border px-2 py-0.5 ${fit === 'listed' ? 'border-red-500 text-white' : 'text-neutral-300'}`}>{fit === 'listed' ? '✓ ' : ''}{FIT_LABEL[fit]}</span>}
    </div>
    {entry.hasPolish && <p className="mt-2 text-sm text-neutral-300">GM: <span lang="en">{entry.original}</span></p>}
    <p className="mt-2 text-sm text-neutral-300"><span className="font-semibold text-white">Model i lata (dokumenty GM): </span>{entry.applies.map((a, i) => <span key={a.vehicle}>{i > 0 && '; '}{a.vehicle} {a.years}{a.original ? <span lang="en"> („{a.original}”)</span> : null}</span>)}</p>
    <p className="mt-1 text-xs text-neutral-400">Sprawdź w swoim aucie / manualu.</p>
    <details className="mt-2 text-sm">
      <summary className="flex min-h-11 cursor-pointer items-center text-neutral-200">Źródła ({entry.sources.length}){entry.notes ? ' i uwagi' : ''}</summary>
      {entry.notes && <p className="mt-1 text-xs text-neutral-400" lang="en">Uwagi zestawienia: {entry.notes}</p>}
      <ul className="mt-1 space-y-1 text-xs">{entry.sources.map(doc => <li key={doc.id}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="underline">{doc.label}</a></li>)}</ul>
    </details>
  </article>;
}
