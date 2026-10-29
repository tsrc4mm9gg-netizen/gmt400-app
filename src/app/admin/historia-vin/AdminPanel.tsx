'use client';
import { useCallback, useEffect, useState } from 'react';

const AUCTION_LABEL: Record<string, string> = { ok: 'pobrano (są rekordy)', empty: 'pobrano (0 rekordów)', quota: 'limit zapytań wyczerpany — ponowi się przy odświeżeniu przez użytkownika', error: 'błąd źródła — ponowi się przy odświeżeniu przez użytkownika', unconfigured: 'brak APIBARA_API_KEY na serwerze' };
type Req = { id: string; vin: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string; decidedAt: string | null; auctionState?: string | null };
const LABEL = { pending: 'Oczekuje', approved: 'Zatwierdzona', rejected: 'Odrzucona' } as const;
const fmt = (iso: string) => { try { return new Date(iso).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Warsaw' }); } catch { return iso; } };
const act = 'inline-flex min-h-11 min-w-28 items-center justify-center border px-4 py-2 text-sm font-semibold transition disabled:opacity-50';

export default function AdminPanel() {
  const [items, setItems] = useState<Req[] | null>(null);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/vin-requests', { cache: 'no-store' });
      if (r.status === 401) { window.location.reload(); return; }
      const d = await r.json().catch(() => null);
      if (!r.ok) { setError(d?.error || 'Nie udało się pobrać listy.'); return; }
      setError(''); setItems(d.requests);
    } catch { setError('Brak połączenia z serwerem.'); }
  }, []);
  useEffect(() => { void load(); const t = setInterval(() => { if (document.visibilityState === 'visible') void load(); }, 30_000); return () => clearInterval(t); }, [load]);
  const decide = async (id: string, status: 'approved' | 'rejected') => {
    setBusyId(id);
    try {
      const r = await fetch('/api/admin/vin-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }), cache: 'no-store' });
      if (!r.ok) setError((await r.json().catch(() => null))?.error || 'Nie udało się zapisać decyzji.'); else await load();
    } catch { setError('Brak połączenia z serwerem.'); } finally { setBusyId(''); }
  };
  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }); window.location.reload(); };
  const pending = items?.filter(i => i.status === 'pending').length ?? 0;
  return (
    <div className="space-y-3" data-testid="admin-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-neutral-950 p-4">
        <p className="text-base text-white" data-testid="admin-pending-count">Oczekujące: <strong className="text-silver-300">{pending}</strong>{items && <span className="text-neutral-400"> · razem {items.length}</span>}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => void load()} className={`${act} border-white/20 text-white hover:border-silver-400`}>Odśwież</button>
          <button type="button" onClick={() => void logout()} className={`${act} border-white/20 text-neutral-300 hover:border-silver-400`}>Wyloguj</button>
        </div>
      </div>
      {error && <p role="alert" className="border border-danger-600/50 bg-danger-600/10 p-3 text-danger-100" data-testid="admin-error">{error}</p>}
      {items && items.length === 0 && <p className="border border-white/10 bg-neutral-950 p-4 text-neutral-300" data-testid="admin-empty">Brak próśb.</p>}
      <ul className="space-y-2">
        {items?.map(i => (
          <li key={i.id} className="border border-white/10 bg-neutral-950 p-4" data-testid="admin-request" data-status={i.status}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="break-all font-mono text-lg tracking-wider text-white">{i.vin}</span>
              <span className={`text-sm font-semibold ${i.status === 'pending' ? 'text-silver-300' : 'text-neutral-400'}`}>{LABEL[i.status]}</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">{i.id} · {fmt(i.createdAt)}{i.decidedAt ? ` · decyzja ${fmt(i.decidedAt)}` : ''}</p>
            {i.status === 'approved' && <p className="mt-1 text-xs text-neutral-400" data-testid="admin-auction-state">Dane Apibara: {AUCTION_LABEL[i.auctionState ?? ''] ?? 'jeszcze nie pobrano'}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={busyId === i.id || i.status === 'approved'} onClick={() => void decide(i.id, 'approved')} className={`${act} border-silver-500 bg-silver-600 text-neutral-950 hover:bg-silver-500`}>Zatwierdź</button>
              <button type="button" disabled={busyId === i.id || i.status === 'rejected'} onClick={() => void decide(i.id, 'rejected')} className={`${act} border-white/20 text-white hover:border-silver-400`}>Odrzuć</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
