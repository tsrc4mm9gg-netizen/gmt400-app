'use client';
import { useState } from 'react';
import Link from 'next/link';
import { decodeVin, profileFromVin } from '@/lib/vin-decode.mjs';
import VinHistoryHits from '../../VinHistoryHits';

/** Formularz VIN → walidacja w przeglądarce (17 znaków, bez I/O/Q, cyfra kontrolna) → wspólny komponent historii. */
export default function VinHistoryTool() {
  const [input, setInput] = useState('');
  const [vin, setVin] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [label, setLabel] = useState('');
  const clean = input.replace(/[\s-]/g, '');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = decodeVin(input);
    if (!r.ok) { setErrors(r.errors); setVin(null); return; }
    if (!r.check.ok) { setErrors([`Cyfra kontrolna (9. znak) się nie zgadza${r.check.expected ? ` — dla tego VIN powinna wynosić ${r.check.expected}` : ''}. Sprawdź, czy nie ma literówki.`]); setVin(null); return; }
    const p = profileFromVin(r);
    setErrors([]);
    setLabel([p?.year, p?.brand, p?.model ?? p?.platform].filter(Boolean).join(' '));
    setVin(r.vin);
  };
  return (
    <div className="min-w-0 space-y-3">
      <form onSubmit={submit} className="border border-white/10 bg-neutral-950 p-4" noValidate>
        <label htmlFor="history-vin" className="mb-2 block text-sm text-neutral-300">Numer VIN pojazdu</label>
        <input id="history-vin" aria-describedby="history-vin-hint" type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go"
          placeholder="np. 1GCEK14K…" value={input} maxLength={20}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onPaste={e => { const t = e.clipboardData.getData('text'); if (!t) return; e.preventDefault(); setInput(t.replace(/[\s-]/g, '').toUpperCase().slice(0, 20)); }}
          className="mb-1 min-h-14 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-lg uppercase tracking-wider text-white focus:border-red-600 focus:outline-none" />
        <p id="history-vin-hint" className="mb-3 text-xs text-neutral-400">{clean.length === 17 ? '17 znaków — gotowe.' : `Wpisano ${clean.length} z 17 znaków.`} Litery I, O i Q nie występują w VIN.</p>
        <button type="submit" className="min-h-12 w-full bg-red-600 py-3 text-base font-semibold text-white transition hover:bg-red-500">SPRAWDŹ HISTORIĘ</button>
        <p className="mt-2 text-xs text-neutral-400">VIN sprawdzamy w przeglądarce. Do naszego serwera trafia tylko po kliknięciu, a do NHTSA wysyłamy wyłącznie markę, rocznik i model — nie VIN. Niczego nie zapisujemy.</p>
      </form>
      {errors.length > 0 && (
        <div role="alert" className="border border-red-600/50 bg-red-600/10 p-4 text-red-100" data-testid="history-vin-errors">
          {errors.map(e => <p key={e}>{e}</p>)}
        </div>
      )}
      {vin && (
        <>
          <p className="min-w-0 break-all text-sm text-neutral-300" data-testid="history-vin-summary"><span className="font-mono tracking-wider text-white">{vin}</span>{label && <> · {label}</>} · <Link href="/vin" className="text-red-400 underline">pełne dekodowanie</Link></p>
          <VinHistoryHits key={vin} vin={vin} variant="page" />
        </>
      )}
    </div>
  );
}
