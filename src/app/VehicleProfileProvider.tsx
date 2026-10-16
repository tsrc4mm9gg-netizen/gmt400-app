'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
export type VehicleProfile = { brand: string; model: string; year: string; engine: string; drive: string; transmission: string };
const KEY = 'gmt400_vehicle_profile_v1';
const EMPTY: VehicleProfile = { brand: '', model: '', year: '', engine: '', drive: '', transmission: '' };
const MODELS: Record<string, string[]> = { Chevrolet: ['C/K', 'Tahoe', 'Suburban'], GMC: ['Sierra', 'Yukon', 'Suburban'] };
function parseProfile(raw: string | null): VehicleProfile | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (value?.version !== 1 || !value.profile || typeof value.profile !== 'object') return null;
    const p = value.profile;
    if (!Object.keys(EMPTY).every(key => typeof p[key] === 'string' && p[key].length <= 80)) return null;
    if (!MODELS[p.brand]?.includes(p.model)) return null;
    if (p.year && !/^\d{4}$/.test(p.year)) return null;
    if (!['', '2WD', '4WD'].includes(p.drive)) return null;
    return Object.fromEntries(Object.keys(EMPTY).map(key => [key, p[key]])) as VehicleProfile;
  } catch { return null; }
}
const Context = createContext<{ profile: VehicleProfile | null; ready: boolean }>({ profile: null, ready: false });
export const useVehicleProfile = () => useContext(Context);
export default function VehicleProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VehicleProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<VehicleProfile>({ ...EMPTY });
  const [message, setMessage] = useState('');
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try { setProfile(parseProfile(localStorage.getItem(KEY))); }
    catch { setMessage('Pamięć przeglądarki jest niedostępna. Profil może działać tylko do zamknięcia strony.'); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === KEY || event.key === null) setProfile(parseProfile(event.newValue)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    const syncSlot = () => { const next = document.getElementById('vehicle-profile-launcher'); setSlot(previous => previous === next ? previous : next); };
    const observer = new MutationObserver(syncSlot);
    observer.observe(document.body, { childList: true, subtree: true });
    syncSlot();
    return () => observer.disconnect();
  }, []);
  const update = (key: keyof VehicleProfile, value: string) => setDraft(p => ({ ...p, [key]: value.slice(0, 80) }));
  const close = () => { dialog.current?.close(); trigger.current?.focus({ preventScroll: true }); };
  const open = () => { setDraft({ ...(profile || EMPTY) }); dialog.current?.showModal(); };
  const save = () => {
    const clean = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, value.trim()])) as VehicleProfile;
    if (!parseProfile(JSON.stringify({ version: 1, profile: clean }))) { setMessage('Wybierz markę i model. Rocznik powinien mieć cztery cyfry albo pozostać pusty.'); return; }
    try { localStorage.setItem(KEY, JSON.stringify({ version: 1, profile: clean })); setMessage('Profil zapisany lokalnie w tej przeglądarce.'); }
    catch { setMessage('Nie udało się zapisać profilu na stałe. Ustawienia będą działać tylko w tej sesji.'); }
    setProfile(clean); close();
  };
  const clear = () => {
    try { localStorage.removeItem(KEY); setMessage('Profil usunięty. Dziennik i pozostałe ustawienia pozostały bez zmian.'); }
    catch { setMessage('Nie udało się usunąć zapisu z pamięci. Profil wyłączono tylko w tej sesji.'); }
    setProfile(null); setDraft({ ...EMPTY }); close();
  };
  const launcher = <button ref={trigger} type="button" disabled={!ready} onClick={open} className="gmt-profile-trigger" aria-haspopup="dialog">{profile ? `Moje auto: ${profile.brand} ${profile.model}${profile.year ? ' ' + profile.year : ''}` : 'Ustaw profil auta'}</button>;
  return <Context.Provider value={{ profile, ready }}>
    {children}
    {slot ? createPortal(launcher, slot) : <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 24px' }}>{launcher}</div>}
    <dialog ref={dialog} onClose={() => trigger.current?.focus({ preventScroll: true })} className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-xl border border-amber-400 bg-neutral-950 p-5 text-white backdrop:bg-black/80" aria-labelledby="vehicle-profile-title">
      <div className="flex items-start justify-between gap-3"><h2 id="vehicle-profile-title" className="text-xl text-amber-400">Moje auto — wspólny profil</h2><button type="button" onClick={close} aria-label="Zamknij profil" className="px-3 py-1">×</button></div>
      <p className="my-3 text-sm text-neutral-400">Dane wpisujesz samodzielnie. Nie ustalamy skrzyni ani innych opcji na podstawie przypuszczeń. Nieznane pola pozostaw puste.</p>
      <form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-3">
        <label className="block">Marka<select required value={draft.brand} onChange={event => setDraft({ ...EMPTY, brand: event.target.value })} className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"><option value="">Wybierz markę</option>{Object.keys(MODELS).map(brand => <option key={brand}>{brand}</option>)}</select></label>
        <label className="block">Model<select required disabled={!draft.brand} value={draft.model} onChange={event => update('model', event.target.value)} className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"><option value="">Wybierz model</option>{(MODELS[draft.brand] || []).map(model => <option key={model}>{model}</option>)}</select></label>
        <label className="block">Rocznik<input inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={draft.year} onChange={event => update('year', event.target.value)} placeholder="Nieustalony" className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3" /></label>
        <label className="block">Silnik<input maxLength={80} value={draft.engine} onChange={event => update('engine', event.target.value)} placeholder="Wpisz potwierdzoną wersję lub kod RPO" className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3" /></label>
        <label className="block">Napęd<select value={draft.drive} onChange={event => update('drive', event.target.value)} className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"><option value="">Nieustalony</option><option>2WD</option><option>4WD</option></select></label>
        <label className="block">Skrzynia biegów<input maxLength={80} value={draft.transmission} onChange={event => update('transmission', event.target.value)} placeholder="Nieustalona — wpisz po potwierdzeniu" className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3" /></label>
        <p className="text-xs text-neutral-400">Profil jest dostępny dla filtrów usterek, kodów OBD, poradników i schematów z Notion. Widok Wszystkie nie ogranicza materiałów. Katalog statycznych części i specyfikacje nie są jeszcze filtrowane.</p>
        <p className="text-xs text-neutral-400">Bez konta i wysyłania profilu na serwer. Zapis nie jest kopią zapasową i nie przenosi się na inne urządzenia.</p>
        <p role="status" className="text-sm text-amber-400">{message}</p>
        <div className="flex flex-wrap gap-3"><button type="submit" className="rounded bg-amber-400 px-4 py-3 font-semibold text-black">Zapisz profil</button><button type="button" onClick={close} className="rounded border border-white/20 px-4 py-3">Anuluj</button>{profile && <button type="button" onClick={clear} className="px-3 py-3 text-neutral-400">Usuń profil</button>}</div>
      </form>
    </dialog>
  </Context.Provider>;
}
