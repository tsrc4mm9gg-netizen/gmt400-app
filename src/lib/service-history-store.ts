'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  SERVICE_HISTORY_EVENT,
  SERVICE_HISTORY_STORAGE_KEY,
  exportServiceHistory,
  parseServiceHistory,
  removeServiceRecord,
  serializeServiceHistory,
  upsertServiceRecord,
  type ServiceRecord,
} from './service-history';

let memoryRaw: string | null = null;
let memoryActive = false;

function readRaw(): string | null {
  if (memoryActive) return memoryRaw;
  try {
    return window.localStorage.getItem(SERVICE_HISTORY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeRaw(raw: string): boolean {
  let persisted = true;
  try {
    window.localStorage.setItem(SERVICE_HISTORY_STORAGE_KEY, raw);
    memoryActive = false;
    memoryRaw = null;
  } catch {
    persisted = false;
    memoryActive = true;
    memoryRaw = raw;
  }
  try {
    window.dispatchEvent(new Event(SERVICE_HISTORY_EVENT));
  } catch {
    /* brak window */
  }
  return persisted;
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SERVICE_HISTORY_STORAGE_KEY || event.key === null) callback();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(SERVICE_HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(SERVICE_HISTORY_EVENT, callback);
  };
}

const getServerSnapshot = () => '';

export function useServiceHistory(vehicleId: string) {
  const raw = useSyncExternalStore(subscribe, readRaw, getServerSnapshot);
  const records = useMemo(() => parseServiceHistory(raw).filter(record => record.vehicleId === vehicleId), [raw, vehicleId]);

  const addRecord = useCallback((input: Omit<ServiceRecord, 'id' | 'vehicleId'> & { id?: string }) => {
    const record = upsertServiceRecord(parseServiceHistory(readRaw()), {
      ...input,
      id: input.id ?? `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      vehicleId,
    });
    if (!record.record) return false;
    return writeRaw(serializeServiceHistory(record.records));
  }, [vehicleId]);

  const deleteRecord = useCallback((id: string) => {
    return writeRaw(serializeServiceHistory(removeServiceRecord(parseServiceHistory(readRaw()), id)));
  }, []);

  const exportJson = useCallback(() => exportServiceHistory(parseServiceHistory(readRaw()), vehicleId), [vehicleId]);

  return { records, addRecord, deleteRecord, exportJson };
}
