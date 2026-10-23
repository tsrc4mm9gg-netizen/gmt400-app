'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { EMPTY_VEHICLE_PROFILE, VEHICLE_CATALOG, VEHICLE_PROFILE_STORAGE_KEY, isValidVehicleProfile, normalizeRpoCodes, parseVehicleProfile, serializeVehicleProfile, vehicleProfileSummary, type VehicleProfile, type VehicleMake, type VehiclePlatform, type VehicleDrivetrain } from '@/lib/vehicle-profile';
export type { VehicleProfile } from '@/lib/vehicle-profile';
const LEGACY_KEY = 'gmt400_vehicle_profile_v1';
const Context = createContext<{ profile: VehicleProfile | null; ready: boolean }>({ profile: null, ready: false });
export const useVehicleProfile = () => useContext(Context);
const control = 'mt-1 block min-h-11 w-full rounded border border-white/20 bg-neutral-900 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500';
const button = 'min-h-11 rounded border border-white/20 px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500';
export default function VehicleProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VehicleProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<VehicleProfile>({ ...EMPTY_VEHICLE_PROFILE });
  const [rpoText, setRpoText] = useState('');
  const [message, setMessage] = useState('');
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    try {
      const stored = parseVehicleProfile(localStorage.getItem(VEHICLE_PROFILE_STORAGE_KEY));
      const next = stored || parseVehicleProfile(localStorage.getItem(LEGACY_KEY));
      setProfile(next);
      if (!stored && next) localStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, serializeVehicleProfile(next));
    } catch { setMessage('Pamięć przeglądarki jest niedostępna. Zapis profilu może się nie udać.'); }
    setReady(true);
    const sync = (event: StorageEvent) => { if (event.key === VEHICLE_PROFILE_STORAGE_KEY || event.key === null) setProfile(parseVehicleProfile(event.newValue)); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  useEffect(() => {
    const sync = () => setSlot(document.getElementById('vehicle-profile-launcher'));
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true }); sync();
    return () => observer.disconnect();
  }, []);
  const update = <K extends keyof VehicleProfile>(key: K, value: VehicleProfile[K]) => setDraft(previous => ({ ...previous, [key]: value }));
  const close = () => dialog.current?.close();
  const open = () => { setDraft(profile ? { ...profile } : { ...EMPTY_VEHICLE_PROFILE }); setRpoText(profile?.rpoCodes.join(', ') || ''); setMessage(''); dialog.current?.showModal(); };
  const save = () => {
    const tokens = rpoText.trim().split(/[\s,;]+/).filter(Boolean);
    if (tokens.some(code => !/^[A-Z0-9]{2,5}$/i.test(code))) { setMessage('Sprawdź RPO: użyj kodów złożonych z 2–5 liter lub cyfr, oddzielonych spacją albo przecinkiem.'); return; }
    const clean = { ...draft, model: draft.model.trim(), engine: draft.engine.trim(), transmission: draft.transmission.trim(), rpoCodes: normalizeRpoCodes(rpoText) };
    if (!isValidVehicleProfile(clean)) { setMessage('Sprawdź markę, model, rocznik 1988–2000 oraz kody RPO.'); return; }
    try { localStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, serializeVehicleProfile(clean)); setMessage('Profil zapisany w tej przeglądarce.'); }
    catch { setMessage('Profil działa w tej sesji, ale nie udało się zapisać go na stałe.'); }
    setProfile(clean); close();
  };
  const clear = () => {
    let failed = false;
    for (const key of [VEHICLE_PROFILE_STORAGE_KEY, LEGACY_KEY]) { try { localStorage.removeItem(key); } catch { failed = true; } }
    setProfile(null); setDraft({ ...EMPTY_VEHICLE_PROFILE }); setRpoText('');
    setMessage(failed ? 'Profil wyłączono, ale nie udało się usunąć wszystkich zapisów z pamięci.' : 'Profil usunięty.'); close();
  };
  const exportProfile = () => {
    if (!profile) return;
    const url = URL.createObjectURL(new Blob([serializeVehicleProfile(profile)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'gmt400-profil-auta.json'; document.body.appendChild(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importProfile = async (file: File) => {
    if (file.size > 32768) { setMessage('Plik jest za duży. Limit: 32 KB.'); return; }
    try { const parsed = parseVehicleProfile(await file.text()); if (!parsed) { setMessage('Nieprawidłowy plik profilu.'); return; } setDraft(parsed); setRpoText(parsed.rpoCodes.join(', ')); setMessage('Profil wczytany. Sprawdź dane i zapisz.'); }
    catch { setMessage('Nie udało się odczytać pliku.'); }
  };
  const platforms = draft.brand ? (Object.keys(VEHICLE_CATALOG[draft.brand]) as VehiclePlatform[]).filter(platform => VEHICLE_CATALOG[draft.brand as VehicleMake][platform].length > 0) : [];
  const models = draft.brand && draft.platform ? VEHICLE_CATALOG[draft.brand][draft.platform] : [];
  const legacyModel = draft.model && !models.includes(draft.model);
  const launcher = <button ref={trigger} type="button" disabled={!ready} onClick={open} className="gmt-profile-trigger" aria-haspopup="dialog">{vehicleProfileSummary(profile)}</button>;
  return <Context.Provider value={{ profile, ready }}>{children}{slot ? createPortal(launcher, slot) : <div className="mx-auto max-w-7xl p-4">{launcher}</div>}
    <dialog ref={dialog} onClose={() => trigger.current?.focus({ preventScroll: true })} aria-labelledby="vehicle-profile-title" aria-describedby="vehicle-profile-help" className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-xl border border-red-600 bg-neutral-950 p-5 text-white backdrop:bg-black/80">
      <header className="flex items-start justify-between gap-3"><h2 id="vehicle-profile-title" className="text-xl text-red-400">Moje auto — profil GMT400</h2><button type="button" onClick={close} aria-label="Zamknij profil" className={button}>×</button></header>
      <p id="vehicle-profile-help" className="my-3 text-sm text-neutral-400">Wpisz potwierdzone dane. Nieznane pola opcjonalne pozostaw puste. Profil jest zapisywany tylko w tej przeglądarce.</p>
      <form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-3">
        <label className="block">Marka<select required value={draft.brand} onChange={event => { setDraft({ ...EMPTY_VEHICLE_PROFILE, brand: event.target.value as VehicleMake }); setRpoText(''); }} className={control}><option value="">Wybierz markę</option>{Object.keys(VEHICLE_CATALOG).map(brand => <option key={brand}>{brand}</option>)}</select></label>
        <label className="block">Rodzina modelu<select required disabled={!draft.brand} value={draft.platform} onChange={event => setDraft(previous => ({ ...previous, platform: event.target.value as VehiclePlatform, model: '' }))} className={control}><option value="">Wybierz rodzinę</option>{platforms.map(platform => <option key={platform}>{platform}</option>)}</select></label>
        <label className="block">Model<select required disabled={!draft.platform} value={draft.model} onChange={event => update('model', event.target.value)} className={control}><option value="">Wybierz model</option>{legacyModel && <option value={draft.model}>{draft.model} — zapis ogólny ze starego profilu</option>}{models.map(model => <option key={model}>{model}</option>)}</select></label>
        <label className="block">Rocznik (opcjonalny)<input inputMode="numeric" pattern="(198[89]|199[0-9]|2000)" maxLength={4} value={draft.year} onChange={event => update('year', event.target.value.replace(/\D/g, '').slice(0, 4))} className={control} /></label>
        <label className="block">Silnik (opcjonalny)<input maxLength={80} value={draft.engine} onChange={event => update('engine', event.target.value)} className={control} /></label>
        <label className="block">Napęd<select value={draft.drive} onChange={event => update('drive', event.target.value as VehicleDrivetrain | '')} className={control}><option value="">Nieustalony</option><option>2WD</option><option>4WD</option></select></label>
        <label className="block">Skrzynia (opcjonalna)<input maxLength={80} value={draft.transmission} onChange={event => update('transmission', event.target.value)} className={control} /></label>
        <label className="block">Kody RPO (opcjonalne)<input maxLength={1000} value={rpoText} onChange={event => setRpoText(event.target.value)} autoCapitalize="characters" autoCorrect="off" spellCheck={false} aria-describedby="rpo-help" placeholder="Z71, GT4, KC4" className={control} /></label>
        <p id="rpo-help" className="text-xs text-neutral-400">Oddziel kody spacją lub przecinkiem. Format sprawdzamy przy zapisie, nie podczas wpisywania.</p>
        <p className="text-xs text-neutral-400">Eksport obejmuje zapisany profil, a nie niezapisane zmiany formularza.</p>
        <p role="status" className="text-sm text-red-400">{message}</p>
        <div className="flex flex-wrap gap-3"><button type="submit" className={`${button} bg-red-600 text-white`}>Zapisz profil</button><button type="button" onClick={close} className={button}>Anuluj</button>{profile && <button type="button" onClick={exportProfile} className={button}>Eksportuj JSON</button>}<button type="button" onClick={() => fileInput.current?.click()} className={button}>Importuj JSON</button>{profile && <button type="button" onClick={clear} className={button}>Usuń profil</button>}</div>
        <input ref={fileInput} type="file" accept="application/json,.json" aria-label="Importuj profil JSON" hidden onChange={event => { const file = event.target.files?.[0]; if (file) void importProfile(file); event.target.value = ''; }} />
      </form>
    </dialog><p role="status" className="sr-only">{message}</p>
  </Context.Provider>;
}
