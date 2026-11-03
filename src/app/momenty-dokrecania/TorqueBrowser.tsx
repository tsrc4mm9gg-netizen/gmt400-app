'use client';

import { useMemo, useState } from 'react';
import { SYSTEM_LABEL, TORQUE_DOCS, TORQUE_ROWS, TORQUE_SYSTEMS, foldText, yearsLabel } from '@/lib/torque-gm';

const ENGINES = ['4.3L', '5.0L', '5.7L', '7.4L', '6.2L', '6.5L'];
const INDEX = TORQUE_ROWS.map(r => foldText(`${r.name} ${r.original} ${r.variant} ${r.system} ${SYSTEM_LABEL[r.system] ?? ''}`));
const PAGE = 60;

const field = 'min-h-11 w-full rounded-xl border border-white/15 bg-neutral-900 px-3 text-base text-white focus:border-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-600/40';

export default function TorqueBrowser() {
  const [q, setQ] = useState('');
  const [sys, setSys] = useState('');
  const [eng, setEng] = useState('');
  const [limit, setLimit] = useState(PAGE);

  const hits = useMemo(() => {
    const words = foldText(q).split(/\s+/).filter(Boolean);
    return TORQUE_ROWS.map((r, i) => ({ r, i })).filter(({ r, i }) => {
      if (sys && r.system !== sys) return false;
      if (eng && r.variant && !r.variant.includes(eng.replace('L', '')) ) return false;
      return words.every(w => INDEX[i].includes(w));
    }).map(x => x.r);
  }, [q, sys, eng]);

  const groups = useMemo(() => {
    const shown = hits.slice(0, limit);
    return TORQUE_SYSTEMS.map(s => ({ s, rows: shown.filter(r => r.system === s) })).filter(g => g.rows.length);
  }, [hits, limit]);

  return (
    <section className="mt-6" aria-label="Wyszukiwarka momentów" data-testid="torque-browser">
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        <label className="min-w-0 text-sm text-neutral-300">Szukaj części
          <input type="search" value={q} onChange={e => { setQ(e.target.value); setLimit(PAGE); }} placeholder="np. miska olejowa, kolektor, zawias" className={`${field} mt-1`} data-testid="torque-search" />
        </label>
        <label className="min-w-0 text-sm text-neutral-300">Układ
          <select value={sys} onChange={e => { setSys(e.target.value); setLimit(PAGE); }} className={`${field} mt-1`} data-testid="torque-system">
            <option value="">Wszystkie</option>
            {TORQUE_SYSTEMS.map(s => <option key={s} value={s}>{SYSTEM_LABEL[s] ?? s}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm text-neutral-300">Silnik
          <select value={eng} onChange={e => { setEng(e.target.value); setLimit(PAGE); }} className={`${field} mt-1`} data-testid="torque-engine">
            <option value="">Każdy</option>
            {ENGINES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 text-xs text-neutral-400" aria-live="polite" data-testid="torque-count">
        {hits.length === TORQUE_ROWS.length ? `${hits.length} pozycji` : `Znaleziono ${hits.length} z ${TORQUE_ROWS.length}`}
        {eng ? ' · przy filtrze silnika widać też pozycje bez podanego silnika' : ''}
      </p>
      {hits.length === 0 && <p className="mt-4 text-neutral-300">Brak pozycji. Spróbuj innego słowa (po polsku lub angielsku, np. „hinge”).</p>}
      {groups.map(g => (
        <div key={g.s} className="mt-6">
          <h2 className="text-xl font-semibold text-silver-300">{SYSTEM_LABEL[g.s] ?? g.s}</h2>
          <ul className="mt-2 divide-y divide-white/5 rounded-xl border border-white/10 bg-neutral-950">
            {g.rows.map(r => (
              <li key={`${r.original}-${r.nm}-${r.variant}-${r.years.join()}`} className="grid min-w-0 gap-1 p-3 sm:grid-cols-[1fr_auto] sm:gap-4" data-testid="torque-row">
                <div className="min-w-0">
                  <p className="break-words font-medium text-white">{r.name}</p>
                  <p className="break-words text-xs text-neutral-500">GM: {r.original}</p>
                  <p className="mt-1 text-xs text-neutral-300">
                    {r.variant ? <span className="mr-2 inline-block rounded border border-white/15 px-1.5">{r.variant}</span> : null}
                    {yearsLabel(r.years)}
                    {r.unitRepair ? <span className="ml-2 text-neutral-500">podręcznik podzespołów</span> : null}
                    {r.fromProcedure ? <span className="ml-2 text-neutral-500">z opisu procedury</span> : null}
                  </p>
                  <p className="mt-1 break-words text-xs text-neutral-500">
                    {r.sources.map((s, i) => <span key={s.doc + s.page} title={TORQUE_DOCS[s.doc]}>{i ? '; ' : ''}{s.doc} s. PDF {s.page}</span>)}
                  </p>
                </div>
                <p className="whitespace-nowrap text-lg font-semibold text-white sm:text-right">{r.nm.replace('.', ',')} Nm<span className="block text-xs font-normal text-neutral-400">({r.imperial})</span></p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {hits.length > limit && (
        <button type="button" onClick={() => setLimit(l => l + PAGE * 2)} className="mt-4 min-h-11 w-full rounded-xl border border-silver-600/60 px-4 text-sm font-semibold text-white hover:border-silver-400" data-testid="torque-more">
          Pokaż więcej ({hits.length - limit})
        </button>
      )}
      <details className="mt-8 rounded-xl border border-white/10 bg-neutral-950 p-3 text-sm text-neutral-300">
        <summary className="cursor-pointer font-medium text-white">Skróty dokumentów GM</summary>
        <ul className="mt-2 space-y-1">
          {Object.entries(TORQUE_DOCS).map(([k, v]) => <li key={k}><span className="font-mono text-neutral-400">{k}</span> — {v}</li>)}
        </ul>
      </details>
    </section>
  );
}
