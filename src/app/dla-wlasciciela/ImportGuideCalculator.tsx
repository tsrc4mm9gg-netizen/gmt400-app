'use client';
import { useId, useState } from 'react';
import { calculateImport, IMPORT_RATES, type Origin, type VehicleKind } from '../../lib/import-calc';

const pln = (n: number) => n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
const field = 'mt-1 block min-h-11 w-full min-w-0 rounded-lg border border-neutral-600 bg-neutral-950 px-3 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500';

export default function ImportGuideCalculator() {
  const id = useId();
  const [price, setPrice] = useState('40000');
  const [transport, setTransport] = useState('0');
  const [capacity, setCapacity] = useState('5700');
  const [kind, setKind] = useState<VehicleKind>('osobowy');
  const [origin, setOrigin] = useState<Origin>('usa-proof');
  const r = calculateImport({ price, transport, capacity, kind, origin });
  return (
    <section aria-labelledby={id + '-t'} data-testid="guide-calc" className="rounded-xl border border-red-700/50 bg-neutral-900 p-4">
      <h3 id={id + '-t'} className="text-lg font-semibold text-white">Kalkulator: cło, akcyza, VAT i suma</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-300">Orientacyjnie, sprawdź w urzędzie. Stawki: stan na {IMPORT_RATES.asOf}. Cena i transport w zł (kurs przeliczenia ustala urząd).</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label htmlFor={id + 'p'} className="text-sm text-neutral-200">Cena zakupu (zł)<input id={id + 'p'} className={field} inputMode="decimal" value={price} onChange={e => setPrice(e.target.value)} /></label>
        <label htmlFor={id + 't'} className="text-sm text-neutral-200">Transport i ubezpieczenie (zł)<input id={id + 't'} className={field} inputMode="decimal" value={transport} onChange={e => setTransport(e.target.value)} /></label>
        <label htmlFor={id + 'c'} className="text-sm text-neutral-200">Pojemność silnika (cm³)<input id={id + 'c'} className={field} inputMode="numeric" value={capacity} onChange={e => setCapacity(e.target.value)} /></label>
        <label htmlFor={id + 'k'} className="text-sm text-neutral-200">Rodzaj pojazdu
          <select id={id + 'k'} className={field} value={kind} onChange={e => setKind(e.target.value as VehicleKind)}>
            <option value="osobowy">Osobowy (8703) — Suburban, Tahoe, Yukon, Blazer</option>
            <option value="pickup-n1">Pickup / N1 (8704) — C/K</option>
            <option value="zabytek-9705">Pojazd kolekcjonerski CN 9705</option>
          </select></label>
        <label htmlFor={id + 'o'} className="text-sm text-neutral-200 sm:col-span-2">Pochodzenie i trasa
          <select id={id + 'o'} className={field} value={origin} onChange={e => setOrigin(e.target.value as Origin)}>
            <option value="usa-proof">USA, dowód pochodzenia USA (auto wyprodukowane w USA)</option>
            <option value="usa-no-proof">USA, bez dowodu pochodzenia (stawka zasadnicza)</option>
            <option value="ue">Zakup w UE (np. DE/NL)</option>
          </select></label>
      </div>
      <div aria-live="polite" className="mt-4">
        {r.valid ? (
          <>
            <dl className="divide-y divide-neutral-800 rounded-lg border border-neutral-700">
              {r.lines.map(l => (
                <div key={l.id} className="flex justify-between gap-3 px-3 py-2 text-sm">
                  <dt className="min-w-0 text-neutral-300">{l.label}</dt>
                  <dd data-testid={'guide-calc-' + l.id} className="shrink-0 font-medium text-white">{pln(l.amount)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 bg-red-950/40 px-3 py-3">
                <dt className="font-semibold text-white">Razem (cena + transport + podatki + minimum urzędowe)</dt>
                <dd data-testid="guide-calc-total" className="shrink-0 text-lg font-bold text-red-300">{pln(r.total)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-sm text-neutral-300">Same cło + akcyza + VAT: <strong data-testid="guide-calc-duties" className="text-white">{pln(r.duties)}</strong></p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-300">{r.notes.map(n => <li key={n}>{n}</li>)}</ul>
          </>
        ) : <p role="status" className="text-sm text-red-300">{r.error}</p>}
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-400">Wynik nie obejmuje tłumaczeń, opłat portowych, agencji celnej, napraw ani LPG. Nie jest wyliczeniem urzędu celnego ani skarbowego.</p>
    </section>
  );
}
