'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { decodeVin, profileFromVin } from '@/lib/vin-decode.mjs';
import VinHistoryHits, { type PreloadedHits } from '../../VinHistoryHits';
import AuctionDataView from './AuctionData';
import type { AuctionData } from '@/lib/apibara.mjs';

/**
 * Formularz VIN → walidacja w przeglądarce (17 znaków, bez I/O/Q, cyfra kontrolna) → PROŚBA do administratora.
 * Wyniki (linki do aukcji + liczniki NHTSA) przychodzą z serwera dopiero po zatwierdzeniu prośby; kod prośby jest w localStorage.
 */
const STORAGE_KEY = 'gmt400_vin_request';
const POLL_MS = 30_000;
type Saved = { code: string; id: string; vin: string; createdAt: string };
type Status = { status: 'pending' | 'approved' | 'rejected'; id: string; vin: string; createdAt: string; results?: PreloadedHits & { auction?: AuctionData } };

const fmtTime = (iso: string) => { try { return new Date(iso).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Warsaw' }); } catch { return iso; } };
const post = (url: string, body: unknown) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store' });
const btn = 'inline-flex min-h-12 items-center justify-center border border-white/20 px-4 py-3 text-base font-semibold text-white transition hover:border-silver-400 hover:bg-white/5';

export default function VinHistoryTool() {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [note, setNote] = useState('');
  const [ready, setReady] = useState(false);
  const savedRef = useRef<Saved | null>(null);
  const clean = input.replace(/[\s-]/g, '');

  const forget = useCallback(() => { try { localStorage.removeItem(STORAGE_KEY); } catch { /* tryb prywatny */ } savedRef.current = null; setSaved(null); setStatus(null); setNote(''); }, []);
  const refresh = useCallback(async () => {
    const s = savedRef.current;
    if (!s) return;
    try {
      const r = await post('/api/vin-requests/status', { code: s.code });
      if (r.status === 404) { forget(); setErrors(['Nie znaleziono tej prośby — wyślij nową.']); return; }
      const d = await r.json().catch(() => null);
      if (!r.ok || !d?.status) { setNote(d?.error || 'Nie udało się odświeżyć statusu. Spróbuj ponownie za chwilę.'); return; }
      setNote(''); setStatus(d);
    } catch { setNote('Brak połączenia — status odświeżymy, gdy wróci.'); }
  }, [forget]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? JSON.parse(raw) as Saved : null;
      if (s?.code && /^[A-Za-z0-9_-]{22}$/.test(s.code)) { savedRef.current = s; setSaved(s); void refresh(); }
    } catch { /* uszkodzony zapis — ignorujemy */ }
    setReady(true);
  }, [refresh]);

  // Dopóki prośba czeka, odświeżamy status co 30 s (tylko gdy karta jest widoczna).
  const pending = saved && (!status || status.status === 'pending');
  useEffect(() => {
    if (!pending) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') void refresh(); }, POLL_MS);
    return () => clearInterval(t);
  }, [pending, refresh]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = decodeVin(input);
    if (!r.ok) { setErrors(r.errors); return; }
    if (!r.check.ok) { setErrors([`Cyfra kontrolna (9. znak) się nie zgadza${r.check.expected ? ` — dla tego VIN powinna wynosić ${r.check.expected}` : ''}. Sprawdź, czy nie ma literówki.`]); return; }
    setErrors([]); setBusy(true);
    try {
      const res = await post('/api/vin-requests', { vin: r.vin });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.code) { setErrors([d?.error || 'Nie udało się wysłać prośby. Spróbuj ponownie za chwilę.']); return; }
      const s: Saved = { code: d.code, id: d.id, vin: d.vin, createdAt: d.createdAt };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* bez localStorage kod trzeba zapisać ręcznie */ }
      savedRef.current = s; setSaved(s); setStatus({ status: 'pending', id: d.id, vin: d.vin, createdAt: d.createdAt }); setInput('');
    } catch { setErrors(['Brak połączenia z serwerem. Spróbuj ponownie.']); } finally { setBusy(false); }
  };

  if (!ready) return <div className="min-w-0 border border-white/10 bg-neutral-950 p-4 text-sm text-neutral-400" aria-busy="true">Ładowanie…</div>;

  if (saved) {
    const st = status?.status ?? 'loading';
    const p = status?.vin ? profileFromVin(decodeVin(status.vin)) : null;
    const label = p ? [p.year, p.brand, p.model ?? p.platform].filter(Boolean).join(' ') : '';
    return (
      <div className="min-w-0 space-y-3">
        <div className="border border-white/10 bg-neutral-950 p-4" data-testid="history-vin-request" data-status={st}>
          <p className="min-w-0 break-all text-sm text-neutral-300" data-testid="history-vin-summary"><span className="font-mono tracking-wider text-white">{saved.vin}</span>{label && <> · {label}</>} · <Link href="/vin" className="text-silver-400 underline">pełne dekodowanie</Link></p>
          <p className="mt-1 text-xs text-neutral-400">Prośba <span className="font-mono text-neutral-200">{saved.id}</span> · wysłana {fmtTime(saved.createdAt)}</p>
          {st === 'loading' && <p role="status" className="mt-3 text-sm text-neutral-300">Sprawdzam status prośby…</p>}
          {st === 'pending' && <p role="status" className="mt-3 border border-silver-500/60 bg-white/5 p-3 text-base font-semibold text-white" data-testid="history-vin-pending">Prośba wysłana — czekaj na zatwierdzenie administratora.</p>}
          {st === 'pending' && <p className="mt-2 text-xs text-neutral-400">Ta strona sprawdza status co 30 sekund. Kod prośby zapamiętaliśmy w tej przeglądarce — możesz wrócić później.</p>}
          {st === 'rejected' && <p role="status" className="mt-3 border border-white/20 bg-white/5 p-3 text-base font-semibold text-white" data-testid="history-vin-rejected">Administrator odrzucił tę prośbę. Wyniki dla tego VIN nie zostały udostępnione.</p>}
          {st === 'approved' && <p role="status" className="mt-3 border border-silver-500 bg-white/5 p-3 text-base font-semibold text-white" data-testid="history-vin-approved">Prośba zatwierdzona — poniżej historia tego VIN.</p>}
          {note && <p className="mt-2 text-xs text-neutral-300" role="status" data-testid="history-vin-note">{note}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {st !== 'approved' && st !== 'loading' && <button type="button" onClick={() => void refresh()} className={btn}>Odśwież status</button>}
            <button type="button" onClick={forget} className={btn}>{st === 'approved' ? 'Sprawdź inny VIN' : st === 'rejected' ? 'Nowa prośba' : 'Anuluj i wpisz inny VIN'}</button>
          </div>
        </div>
        {errors.length > 0 && <div role="alert" className="border border-danger-600/50 bg-danger-600/10 p-4 text-danger-100" data-testid="history-vin-errors">{errors.map(e => <p key={e}>{e}</p>)}</div>}
        {st === 'approved' && status?.results && <AuctionDataView data={status.results.auction} />}
        {st === 'approved' && status?.results && <VinHistoryHits key={status.vin} vin={status.vin} variant="page" preloaded={status.results} />}
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-3">
      <form onSubmit={submit} className="border border-white/10 bg-neutral-950 p-4" noValidate>
        <label htmlFor="history-vin" className="mb-2 block text-sm text-neutral-300">Numer VIN pojazdu</label>
        <input id="history-vin" aria-describedby="history-vin-hint" type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" autoCorrect="off" spellCheck={false} enterKeyHint="go"
          placeholder="np. 1GCEK14K…" value={input} maxLength={20}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onPaste={e => { const t = e.clipboardData.getData('text'); if (!t) return; e.preventDefault(); setInput(t.replace(/[\s-]/g, '').toUpperCase().slice(0, 20)); }}
          className="mb-1 min-h-14 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-lg uppercase tracking-wider text-white focus:border-silver-600 focus:outline-none" />
        <p id="history-vin-hint" className="mb-3 text-xs text-neutral-400">{clean.length === 17 ? '17 znaków — gotowe.' : `Wpisano ${clean.length} z 17 znaków.`} Litery I, O i Q nie występują w VIN.</p>
        <button type="submit" disabled={busy} className="min-h-12 w-full bg-silver-600 py-3 text-base font-semibold text-neutral-950 transition hover:bg-silver-500 disabled:opacity-60">{busy ? 'WYSYŁAM…' : 'SPRAWDŹ HISTORIĘ'}</button>
        <p className="mt-2 text-xs text-neutral-400" data-testid="history-vin-privacy">To jest prośba do administratora: po kliknięciu wysyłamy VIN na nasz serwer i zapisujemy go razem z czasem prośby oraz skrótem adresu IP (limit nadużyć). Wyniki pojawią się dopiero po zatwierdzeniu. Do NHTSA trafia wyłącznie marka, rocznik i model — nie VIN.</p>
      </form>
      {errors.length > 0 && (
        <div role="alert" className="border border-danger-600/50 bg-danger-600/10 p-4 text-danger-100" data-testid="history-vin-errors">
          {errors.map(e => <p key={e}>{e}</p>)}
        </div>
      )}
    </div>
  );
}
