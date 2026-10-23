'use client';
import { useId, useMemo, useState } from 'react';
import { FUSE_COLORS, FUSE_COLORS_SOURCE, FUSE_TABLES, FUSE_YEARS, filterFuseTables, yearsLabel } from '@/lib/fuses.mjs';

/** Wyszukiwalna tabela bezpieczników (kabina + pod maską) z OM GM 1994–1999. */
export default function FuseTable({ initialYear = '' }: { initialYear?: string } = {}) {
  const [year, setYear] = useState(FUSE_YEARS.includes(initialYear) ? initialYear : '');
  const [query, setQuery] = useState('');
  const inputId = useId();
  const tables = useMemo(() => filterFuseTables(FUSE_TABLES, { year, query }), [year, query]);
  const count = tables.reduce((sum, t) => sum + t.rows.length, 0);
  return (
    <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-3 sm:p-4" data-testid="fuse-table">
      <h3 className="text-lg font-semibold text-white">Tabela bezpieczników — wyszukaj obwód</h3>
      <p className="mt-1 text-sm text-neutral-400">{initialYear ? 'Dane z instrukcji obsługi GM (Owner’s Manual), te same co na stronie Schematy.' : <>Te same dane co na schematach powyżej, z instrukcji obsługi GM (Owner&apos;s Manual).</>} Wpisz np. <em>radio</em>, <em>wycieraczki</em>, <em>ABS</em> albo numer gniazda.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">Szukaj w tabeli bezpieczników</label>
        <input id={inputId} type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Szukaj: obwód, nazwa, numer…" autoComplete="off"
          className="min-h-11 flex-1 rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white placeholder:text-neutral-500 focus:border-red-500 focus:outline-none" />
        <label className="flex min-h-11 items-center gap-2 text-sm text-neutral-300">Rocznik
          <select value={year} onChange={e => setYear(e.target.value)} aria-label="Rocznik"
            className="min-h-11 rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white focus:border-red-500 focus:outline-none">
            <option value="">wszystkie</option>
            {FUSE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 text-sm text-neutral-400" aria-live="polite" data-testid="fuse-count">Wyniki: {count}</p>
      {tables.length === 0 && <p className="mt-3 text-neutral-300">Brak pozycji dla tego wyszukiwania. Sprawdź opis na pokrywie skrzynki i w instrukcji.</p>}
      {tables.map(table => (
        <section key={table.id} className="mt-4" aria-label={`${table.box}: ${table.models}`}>
          <h4 className="font-semibold text-red-300">{table.box}</h4>
          <p className="mt-1"><span className="inline-block rounded-full border border-red-600/50 bg-red-600/10 px-3 py-1 text-xs text-red-200">Model i lata: {table.models}</span></p>
          <p className="mt-1 text-xs text-neutral-400">{table.posNote} {table.ampsNote}</p>
          <ul className="mt-2 divide-y divide-white/10 rounded-lg border border-white/10">
            {table.rows.map(row => (
              <li key={row.pos} className="grid grid-cols-[4.5rem_1fr] gap-3 p-3 sm:grid-cols-[6rem_10rem_1fr]">
                <span className="font-mono text-lg font-bold text-red-400">{row.pos}</span>
                <span className="text-sm text-neutral-200 sm:col-auto">
                  <span className="font-semibold text-white">{row.name === row.pos ? '' : row.name}</span>
                  {row.amps !== '—' && <span className="block text-red-200">{row.amps}</span>}
                </span>
                <span className="col-span-2 text-sm text-neutral-300 sm:col-span-1">
                  {row.variants.map(v => (
                    <span key={v.years.join()} className="block">
                      {(table.years.length > 1 && (row.variants.length > 1 || v.years.length < table.years.length)) && <strong className="mr-1 text-neutral-100">{yearsLabel(v.years)}:</strong>}
                      {v.text}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-neutral-400">{table.note}</p>
          <p className="mt-1 text-xs text-neutral-500">Źródła:{' '}
            {table.sources.map((s, i) => <span key={s.url}>{i > 0 && ' · '}<a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-red-400 underline">{s.title}</a></span>)}
          </p>
        </section>
      ))}
      <details className="mt-4 text-sm text-neutral-300">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-white">Kolory bezpieczników wg amperażu</summary>
        <ul className="mt-2 grid grid-cols-2 gap-1 sm:grid-cols-4">{FUSE_COLORS.map(c => <li key={c.amps}><strong className="text-white">{c.amps}</strong> — {c.color}</li>)}</ul>
        <p className="mt-1 text-xs text-neutral-500">{FUSE_COLORS_SOURCE}</p>
      </details>
      <p className="mt-3 text-xs text-neutral-400">Lata 1988–1993 i inne nadwozia (Tahoe, Yukon, Sierra, Blazer) mogą mieć inną obsadę — sprawdź w swoim aucie / manualu. Zawsze wkładaj bezpiecznik o tym samym amperażu.</p>
    </div>
  );
}
