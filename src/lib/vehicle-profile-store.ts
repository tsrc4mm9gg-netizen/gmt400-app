'use client';
import { useMemo, useSyncExternalStore } from 'react';
import { VEHICLE_PROFILE_STORAGE_KEY, parseVehicleProfile, serializeVehicleProfile, type VehicleProfile } from './vehicle-profile';

/**
 * Wspólne, bezpieczne dla hydratacji źródło profilu auta (localStorage).
 * Serwer i pierwszy render klienta widzą null; po hydratacji React odczytuje localStorage.
 * Gdy localStorage jest niedostępny (np. tryb prywatny / zablokowana pamięć), profil żyje w pamięci karty.
 */
export const VEHICLE_PROFILE_EVENT = 'gmt400-profile-change';
export const LEGACY_VEHICLE_PROFILE_KEY = 'gmt400_vehicle_profile_v1';
let memoryRaw: string | null = null;
let memoryActive = false;

export function storageAvailable(): boolean {
  try {
    const probe = '__gmt400_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch { return false; }
}

export function readProfileRaw(): string | null {
  if (memoryActive) return memoryRaw;
  try { return window.localStorage.getItem(VEHICLE_PROFILE_STORAGE_KEY); } catch { return null; }
}

const notify = () => { try { window.dispatchEvent(new Event(VEHICLE_PROFILE_EVENT)); } catch { /* brak window */ } };

/** Zapisuje profil. Zwraca false, gdy zapis trwały się nie udał (profil działa tylko w tej karcie). */
export function writeProfile(profile: VehicleProfile): boolean {
  const raw = serializeVehicleProfile(profile);
  let persisted = true;
  try { window.localStorage.setItem(VEHICLE_PROFILE_STORAGE_KEY, raw); memoryActive = false; memoryRaw = null; }
  catch { persisted = false; memoryActive = true; memoryRaw = raw; }
  notify();
  return persisted;
}

/** Usuwa profil. Zwraca false, gdy nie udało się usunąć wszystkich zapisów. */
export function clearProfile(): boolean {
  let ok = true;
  for (const key of [VEHICLE_PROFILE_STORAGE_KEY, LEGACY_VEHICLE_PROFILE_KEY]) { try { window.localStorage.removeItem(key); } catch { ok = false; } }
  memoryActive = !ok; memoryRaw = null;
  notify();
  return ok;
}

export function subscribeProfile(callback: () => void): () => void {
  const onStorage = (event: StorageEvent) => { if (event.key === VEHICLE_PROFILE_STORAGE_KEY || event.key === null) callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(VEHICLE_PROFILE_EVENT, callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(VEHICLE_PROFILE_EVENT, callback); };
}

const noopSubscribe = () => () => {};

/** Profil auta zapisany w przeglądarce (null na serwerze i podczas hydratacji). */
export function useStoredVehicleProfile(): VehicleProfile | null {
  const raw = useSyncExternalStore(subscribeProfile, readProfileRaw, () => null);
  return useMemo(() => parseVehicleProfile(raw), [raw]);
}

/** true dopiero po hydratacji na kliencie. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
