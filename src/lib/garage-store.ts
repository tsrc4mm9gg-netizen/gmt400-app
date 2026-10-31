'use client';
import { useSyncExternalStore } from 'react';
import { clearProfile, readProfileRaw, writeProfile } from './vehicle-profile-store';
import { isValidVehicleProfile, parseVehicleProfile, type VehicleProfile } from './vehicle-profile';

/**
 * Garaż: kilka aut zapisanych tylko w tej przeglądarce (localStorage), bez konta.
 * Aktywne auto zostaje pod dotychczasowym kluczem profilu (gmt400_vehicle_profile_v2), więc wszystkie filtry
 * (Usterki, DIY, szukajka objawów, RPO, plakietka) działają bez zmian. Tutaj trzymamy tylko pozostałe auta.
 */
export const GARAGE_STORAGE_KEY = 'gmt400_garage_v1';
export const GARAGE_EVENT = 'gmt400-garage-change';
export const MAX_GARAGE_CARS = 5;
const SELECTION_KEY = 'gmt400_model_selection';

let memory: string | null = null;
const EMPTY: VehicleProfile[] = [];
let cacheRaw: string | null | undefined;
let cacheValue: VehicleProfile[] = EMPTY;

function readRaw(): string | null {
  try { return window.localStorage.getItem(GARAGE_STORAGE_KEY); } catch { return memory; }
}
export function parseGarage(raw: string | null): VehicleProfile[] {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as { version?: number; cars?: unknown[] };
    if (data?.version !== 1 || !Array.isArray(data.cars)) return EMPTY;
    return data.cars.map(car => parseVehicleProfile(JSON.stringify({ version: 2, profile: car }))).filter((car): car is VehicleProfile => !!car && isValidVehicleProfile(car)).slice(0, MAX_GARAGE_CARS - 1);
  } catch { return EMPTY; }
}
function readOthers(): VehicleProfile[] {
  const raw = readRaw();
  if (raw !== cacheRaw) { cacheRaw = raw; cacheValue = parseGarage(raw); }
  return cacheValue;
}
function writeOthers(cars: VehicleProfile[]): boolean {
  const raw = cars.length ? JSON.stringify({ version: 1, cars: cars.slice(0, MAX_GARAGE_CARS - 1) }) : null;
  let ok = true;
  try { if (raw) window.localStorage.setItem(GARAGE_STORAGE_KEY, raw); else window.localStorage.removeItem(GARAGE_STORAGE_KEY); } catch { ok = false; }
  memory = raw;
  try { window.dispatchEvent(new Event(GARAGE_EVENT)); } catch { /* brak window */ }
  return ok;
}
/** Wybór nadwozia z sesji (karuzela/model) ma podążać za nowym aktywnym autem. */
function resetSelection() { try { window.sessionStorage.removeItem(SELECTION_KEY); } catch { /* brak sessionStorage */ } }
const active = () => parseVehicleProfile(readProfileRaw());

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === null || event.key === GARAGE_STORAGE_KEY) callback(); };
  window.addEventListener('storage', onStorage);
  window.addEventListener(GARAGE_EVENT, callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(GARAGE_EVENT, callback); };
}
/** Pozostałe (nieaktywne) auta w garażu. */
export function useGarageOthers(): VehicleProfile[] {
  return useSyncExternalStore(subscribe, readOthers, () => EMPTY);
}

/** Zapis edytowanego aktywnego auta. */
export function saveActiveCar(profile: VehicleProfile): boolean { resetSelection(); return writeProfile(profile); }
/** Nowe auto staje się aktywne; dotychczasowe trafia do garażu. */
export function addCar(profile: VehicleProfile): boolean {
  const current = active();
  if (current) writeOthers([current, ...readOthers()]);
  resetSelection();
  return writeProfile(profile);
}
/** Ustawia auto z garażu jako aktywne (zamiana miejscami z dotychczasowym). */
export function activateCar(index: number): boolean {
  const others = [...readOthers()];
  const [target] = others.splice(index, 1);
  if (!target) return false;
  const current = active();
  writeOthers(current ? [current, ...others] : others);
  resetSelection();
  return writeProfile(target);
}
export function removeGarageCar(index: number): boolean {
  const others = [...readOthers()];
  if (!others[index]) return false;
  others.splice(index, 1);
  return writeOthers(others);
}
/** Usuwa aktywne auto; jeśli w garażu jest kolejne, staje się aktywne. */
export function removeActiveCar(): { ok: boolean; next: VehicleProfile | null } {
  const [next, ...rest] = readOthers();
  resetSelection();
  if (next) { writeOthers(rest); return { ok: writeProfile(next), next }; }
  return { ok: clearProfile(), next: null };
}
