export type ServiceRecord = {
  id: string;
  vehicleId: string;
  date: string;
  mileageKm: number;
  title: string;
  costPln?: number;
  notes?: string;
};

export const SERVICE_HISTORY_STORAGE_KEY = 'gmt400_service_history_v1';
export const SERVICE_HISTORY_EVENT = 'gmt400-service-history-change';
export const MAX_SERVICE_RECORDS = 500;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidMileage(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

export function isValidCost(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function normalizeServiceRecord(input: unknown): ServiceRecord | null {
  if (!input || typeof input !== 'object') return null;
  const value = input as Record<string, unknown>;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const vehicleId = typeof value.vehicleId === 'string' ? value.vehicleId.trim() : '';
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  if (!id || !vehicleId || !title || !isValidIsoDate(value.date) || !isValidMileage(value.mileageKm)) return null;
  const record: ServiceRecord = { id, vehicleId, date: value.date, mileageKm: value.mileageKm, title };
  if (value.costPln !== undefined && value.costPln !== null) {
    if (!isValidCost(value.costPln)) return null;
    record.costPln = value.costPln;
  }
  if (value.notes !== undefined && value.notes !== null) {
    if (typeof value.notes !== 'string') return null;
    const notes = value.notes.trim();
    if (notes) record.notes = notes;
  }
  return record;
}

export function parseServiceHistory(raw: string | null | undefined): ServiceRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || (parsed as { version?: unknown }).version !== 1) return [];
    const records = (parsed as { records?: unknown }).records;
    if (!Array.isArray(records)) return [];
    const seen = new Set<string>();
    return records
      .map(normalizeServiceRecord)
      .filter((record): record is ServiceRecord => {
        if (!record || seen.has(record.id)) return false;
        seen.add(record.id);
        return true;
      })
      .slice(0, MAX_SERVICE_RECORDS);
  } catch {
    return [];
  }
}

export function serializeServiceHistory(records: ServiceRecord[]): string {
  return JSON.stringify({ version: 1, records: records.slice(0, MAX_SERVICE_RECORDS) });
}

export function sortServiceHistory(records: ServiceRecord[]): ServiceRecord[] {
  return [...records].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    if (a.mileageKm !== b.mileageKm) return b.mileageKm - a.mileageKm;
    return a.title.localeCompare(b.title, 'pl');
  });
}

export function filterServiceHistory(records: ServiceRecord[], vehicleId: string): ServiceRecord[] {
  return sortServiceHistory(records.filter(record => record.vehicleId === vehicleId));
}

export function upsertServiceRecord(records: ServiceRecord[], input: unknown): { records: ServiceRecord[]; record: ServiceRecord | null } {
  const record = normalizeServiceRecord(input);
  if (!record) return { records, record: null };
  const withoutDuplicate = records.filter(item => item.id !== record.id);
  return { records: sortServiceHistory([record, ...withoutDuplicate]).slice(0, MAX_SERVICE_RECORDS), record };
}

export function removeServiceRecord(records: ServiceRecord[], id: string): ServiceRecord[] {
  return records.filter(record => record.id !== id);
}

export function exportServiceHistory(records: ServiceRecord[], vehicleId?: string): string {
  const selected = vehicleId ? filterServiceHistory(records, vehicleId) : sortServiceHistory(records);
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), records: selected }, null, 2);
}
