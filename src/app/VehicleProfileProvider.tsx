'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  EMPTY_VEHICLE_PROFILE,
  VEHICLE_CATALOG,
  VEHICLE_PROFILE_STORAGE_KEY,
  isValidVehicleProfile,
  normalizeRpoCodes,
  parseVehicleProfile,
  serializeVehicleProfile,
  vehicleProfileSummary,
  type VehicleDrivetrain,
  type VehicleMake,
  type VehiclePlatform,
  type VehicleProfile
} from '@/lib/vehicle-profile';

export type { VehicleProfile } from '@/lib/vehicle-profile';

const Context = createContext<{ profile: VehicleProfile | null; ready: boolean }>({ profile: null, ready: false });

export const useVehicleProfile = () => useContext(Context);

export default function VehicleProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<VehicleProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<VehicleProfile>({ ...EMPTY_VEHICLE_PROFILE });
  const [message, setMessage] = useState('');
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = parseVehicleProfile(localStorage.getItem(VEHICLE_PROFILE_STORAGE_KEY));
      const legacy = parseVehicleProfile(localStorage.getItem('gmt400_vehicle_profile_v1'));
      const next = stored || (legacy ? { ...legacy, platform: legacy.model as VehiclePlatform, rpoCodes: [] } : null);
      setProfile(next);
      if (!stored && next) localStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, serializeVehicleProfile(next));
    } catch {
      setMessage('Pamięć przeglądarki jest niedostępna. Profil może działać tylko do zamknięcia strony.');
    }
    setReady(true);

    const sync = (event: StorageEvent) => {
      if (event.key === VEHICLE_PROFILE_STORAGE_KEY || event.key === null) setProfile(parseVehicleProfile(event.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    const syncSlot = () => {
      const next = document.getElementById('vehicle-profile-launcher');
      setSlot(previous => previous === next ? previous : next);
    };
    const observer = new MutationObserver(syncSlot);
    observer.observe(document.body, { childList: true, subtree: true });
    syncSlot();
    return () => observer.disconnect();
  }, []);

  const update = <K extends keyof VehicleProfile>(key: K, value: VehicleProfile[K]) => setDraft(previous => ({ ...previous, [key]: value }));
  const close = () => {
    dialog.current?.close();
    trigger.current?.focus({ preventScroll: true });
  };
  const open = () => {
    setDraft(profile ? { ...profile } : { ...EMPTY_VEHICLE_PROFILE });
    dialog.current?.showModal();
  };

  const save = () => {
    const clean: VehicleProfile = {
      ...draft,
      model: draft.model.trim().slice(0, 80),
      engine: draft.engine.trim().slice(0, 80),
      transmission: draft.transmission.trim().slice(0, 80),
      rpoCodes: normalizeRpoCodes(draft.rpoCodes.join(' '))
    };

    if (!clean.brand || !clean.model) {
      setMessage('Wybierz markę i model. Pozostałe pola mogą pozostać puste.');
      return;
    }
    if (!isValidVehicleProfile(clean)) {
      setMessage('Sprawdź rocznik 1988–2000 oraz kody RPO.');
      return;
    }

    try {
      localStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, serializeVehicleProfile(clean));
      setMessage('Profil zapisany lokalnie w tej przeglądarce.');
    } catch {
      setMessage('Nie udało się zapisać profilu na stałe. Ustawienia będą działać tylko w tej sesji.');
    }
    setProfile(clean);
    close();
  };

  const clear = () => {
    try {
      localStorage.removeItem(VEHICLE_PROFILE_STORAGE_KEY);
      setMessage('Profil usunięty.');
    } catch {
      setMessage('Nie udało się usunąć zapisu z pamięci. Profil wyłączono tylko w tej sesji.');
    }
    setProfile(null);
    setDraft({ ...EMPTY_VEHICLE_PROFILE });
    close();
  };

  const exportProfile = () => {
    if (!profile) return;
    const blob = new Blob([serializeVehicleProfile(profile)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gmt400-profil-auta.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importProfile = async (file: File) => {
    try {
      const parsed = parseVehicleProfile(await file.text());
      if (!parsed) {
        setMessage('Nieprawidłowy plik profilu.');
        return;
      }
      setDraft(parsed);
      setMessage('Profil wczytany. Sprawdź dane i zapisz.');
    } catch {
      setMessage('Nie udało się odczytać pliku profilu.');
    }
  };

  const platforms = draft.brand ? Object.keys(VEHICLE_CATALOG[draft.brand]) as VehiclePlatform[] : [];
  const models = draft.brand && draft.platform ? VEHICLE_CATALOG[draft.brand][draft.platform] : [];
  const launcher = (
    <button
      ref={trigger}
      type="button"
      disabled={!ready}
      onClick={open}
      className="gmt-profile-trigger"
      aria-haspopup="dialog"
    >
      {vehicleProfileSummary(profile)}
    </button>
  );

  return (
    <Context.Provider value={{ profile, ready }}>
      {children}
      {slot ? createPortal(launcher, slot) : <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 16px 24px' }}>{launcher}</div>}
      <dialog
        ref={dialog}
        onClose={() => trigger.current?.focus({ preventScroll: true })}
        className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[85dvh] overflow-y-auto rounded-xl border border-amber-400 bg-neutral-950 p-5 text-white backdrop:bg-black/80"
        aria-labelledby="vehicle-profile-title"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id="vehicle-profile-title" className="text-xl text-amber-400">Moje auto — profil GMT400</h2>
          <button type="button" onClick={close} aria-label="Zamknij profil" className="px-3 py-1">×</button>
        </div>
        <p className="my-3 text-sm text-neutral-400">Wybierz tylko dane, które potwierdzasz. Nieznane pola pozostaw puste — nie ograniczamy wtedy treści na podstawie przypuszczeń.</p>
        <form onSubmit={event => { event.preventDefault(); save(); }} className="space-y-3">
          <label className="block">Marka
            <select
              required
              value={draft.brand}
              onChange={event => setDraft({ ...EMPTY_VEHICLE_PROFILE, brand: event.target.value as VehicleMake })}
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            >
              <option value="">Wybierz markę</option>
              {Object.keys(VEHICLE_CATALOG).map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </label>
          <label className="block">Platforma
            <select
              required
              disabled={!draft.brand}
              value={draft.platform}
              onChange={event => setDraft({ ...draft, platform: event.target.value as VehiclePlatform, model: '' })}
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            >
              <option value="">Wybierz platformę</option>
              {platforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
            </select>
          </label>
          <label className="block">Model
            <select
              required
              disabled={!draft.platform || !models.length}
              value={draft.model}
              onChange={event => update('model', event.target.value)}
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            >
              <option value="">Wybierz model</option>
              {models.map(model => <option key={model} value={model}>{model}</option>)}
            </select>
          </label>
          <label className="block">Rocznik
            <input
              inputMode="numeric"
              pattern="(19(8[89]|9\d)|2000)"
              maxLength={4}
              value={draft.year}
              onChange={event => update('year', event.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="1988–2000 lub puste"
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            />
          </label>
          <label className="block">Silnik
            <input
              maxLength={80}
              value={draft.engine}
              onChange={event => update('engine', event.target.value)}
              placeholder="np. 5.7L V8 albo kod RPO"
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            />
          </label>
          <label className="block">Napęd
            <select
              value={draft.drive}
              onChange={event => update('drive', event.target.value as VehicleDrivetrain | '')}
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            >
              <option value="">Nieustalony</option>
              <option value="2WD">2WD</option>
              <option value="4WD">4WD</option>
            </select>
          </label>
          <label className="block">Skrzynia biegów
            <input
              maxLength={80}
              value={draft.transmission}
              onChange={event => update('transmission', event.target.value)}
              placeholder="Nieustalona — wpisz po potwierdzeniu"
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            />
          </label>
          <label className="block">Kody RPO
            <input
              value={draft.rpoCodes.join(', ')}
              onChange={event => update('rpoCodes', normalizeRpoCodes(event.target.value))}
              placeholder="np. Z71, GT4, KC4"
              className="mt-1 block w-full rounded border border-white/20 bg-neutral-900 p-3"
            />
          </label>
          <p className="text-xs text-neutral-400">Profil będzie używany przez wyszukiwarkę, kody OBD, poradniki i schematy. Treści bez metadanych pozostają dostępne dla wszystkich pojazdów.</p>
          <p className="text-xs text-neutral-400">Dane nie są wysyłane na serwer. Eksport JSON służy jako ręczna kopia profilu.</p>
          <p role="status" className="text-sm text-amber-400">{message}</p>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded bg-amber-400 px-4 py-3 font-semibold text-black">Zapisz profil</button>
            <button type="button" onClick={close} className="rounded border border-white/20 px-4 py-3">Anuluj</button>
            {profile && <button type="button" onClick={exportProfile} className="rounded border border-white/20 px-4 py-3">Eksportuj JSON</button>}
            <button type="button" onClick={() => fileInput.current?.click()} className="rounded border border-white/20 px-4 py-3">Importuj JSON</button>
            {profile && <button type="button" onClick={clear} className="px-3 py-3 text-neutral-400">Usuń profil</button>}
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={event => {
                const file = event.target.files?.[0];
                if (file) void importProfile(file);
                event.target.value = '';
              }}
            />
          </div>
        </form>
      </dialog>
    </Context.Provider>
  );
}
