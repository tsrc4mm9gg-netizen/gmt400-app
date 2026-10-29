'use client';
import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }), cache: 'no-store' });
      if (r.ok) { window.location.reload(); return; }
      setError((await r.json().catch(() => null))?.error || 'Logowanie nie powiodło się.');
    } catch { setError('Brak połączenia z serwerem.'); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="border border-white/10 bg-neutral-950 p-4" data-testid="admin-login">
      <label htmlFor="admin-password" className="mb-2 block text-sm text-neutral-300">Hasło administratora</label>
      <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} maxLength={200}
        className="mb-3 min-h-14 w-full border border-white/10 bg-neutral-900 px-4 py-3 text-lg text-white focus:border-silver-600 focus:outline-none" />
      <button type="submit" disabled={busy || !password} className="min-h-12 w-full bg-silver-600 py-3 text-base font-semibold text-neutral-950 transition hover:bg-silver-500 disabled:opacity-60">{busy ? 'LOGUJĘ…' : 'ZALOGUJ'}</button>
      {error && <p role="alert" className="mt-3 border border-danger-600/50 bg-danger-600/10 p-3 text-danger-100" data-testid="admin-login-error">{error}</p>}
    </form>
  );
}
