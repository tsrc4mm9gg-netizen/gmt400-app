export type VehicleMake = 'Chevrolet' | 'GMC';
export type VehiclePlatform = 'C/K' | 'Tahoe' | 'Suburban' | 'Yukon' | 'Sierra';
export type VehicleDrivetrain = '2WD' | '4WD';
export interface VehicleProfile {
  brand: VehicleMake | '';
  platform: VehiclePlatform | '';
  model: string;
  year: string;
  engine: string;
  drive: VehicleDrivetrain | '';
  transmission: string;
  rpoCodes: string[];
  /** Opcjonalny VIN (17 znaków) — tylko w tej przeglądarce. */
  vin?: string;
}
export const VEHICLE_PROFILE_VERSION = 2;
export const VEHICLE_PROFILE_STORAGE_KEY = 'gmt400_vehicle_profile_v2';
export const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;
export const GMT400_YEAR_RANGE = [1988, 2000] as const;
export const VEHICLE_CATALOG: Record<VehicleMake, Record<VehiclePlatform, string[]>> = {
  Chevrolet: { 'C/K': ['C1500', 'K1500', 'C2500', 'K2500', 'C3500', 'K3500'], Tahoe: ['Tahoe 2-door', 'Tahoe 4-door'], Suburban: ['Suburban 1500', 'Suburban 2500'], Yukon: [], Sierra: [] },
  GMC: { 'C/K': ['C1500', 'K1500', 'C2500', 'K2500', 'C3500', 'K3500'], Sierra: ['Sierra 1500', 'Sierra 2500', 'Sierra 3500'], Suburban: ['Suburban 1500', 'Suburban 2500'], Yukon: ['Yukon 2-door', 'Yukon 4-door'], Tahoe: [] }
};
export const EMPTY_VEHICLE_PROFILE: VehicleProfile = { brand: '', platform: '', model: '', year: '', engine: '', drive: '', transmission: '', rpoCodes: [] };
const LEGACY_MODELS: Record<VehicleMake, string[]> = { Chevrolet: ['C/K', 'Tahoe', 'Suburban'], GMC: ['Sierra', 'Yukon', 'Suburban'] };
export function normalizeRpoCodes(value: string): string[] {
  return [...new Set(value.toUpperCase().split(/[\s,;]+/).filter(code => /^[A-Z0-9]{2,5}$/.test(code)))].sort();
}
export function isValidVehicleProfile(value: unknown): value is VehicleProfile {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  if (p.brand !== 'Chevrolet' && p.brand !== 'GMC') return false;
  if (typeof p.platform !== 'string' || !Object.prototype.hasOwnProperty.call(VEHICLE_CATALOG[p.brand], p.platform)) return false;
  if (!['model', 'year', 'engine', 'drive', 'transmission'].every(key => typeof p[key] === 'string' && (p[key] as string).length <= 80)) return false;
  const model = p.model as string;
  const platform = p.platform as VehiclePlatform;
  const models = VEHICLE_CATALOG[p.brand][platform];
  if (!models.length || (!models.includes(model) && !(model === platform && LEGACY_MODELS[p.brand].includes(model)))) return false;
  if (p.year !== '' && !/^(19(8[89]|9\d)|2000)$/.test(p.year as string)) return false;
  if (!['', '2WD', '4WD'].includes(p.drive as string)) return false;
  if (p.vin !== undefined && !(typeof p.vin === 'string' && (p.vin === '' || VIN_PATTERN.test(p.vin)))) return false;
  return Array.isArray(p.rpoCodes) && p.rpoCodes.length <= 100 && p.rpoCodes.every(code => typeof code === 'string' && /^[A-Z0-9]{2,5}$/.test(code));
}
export function parseVehicleProfile(raw: string | null): VehicleProfile | null {
  if (!raw || raw.length > 32768) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || !('profile' in parsed)) return null;
    const value: unknown = parsed.profile;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    let candidate: unknown = value;
    if (parsed.version === 1) {
      const old = value as Record<string, unknown>;
      if (old.brand !== 'Chevrolet' && old.brand !== 'GMC') return null;
      if (typeof old.model !== 'string' || !LEGACY_MODELS[old.brand].includes(old.model)) return null;
      candidate = { ...old, platform: old.model, rpoCodes: [] };
    } else if (parsed.version !== VEHICLE_PROFILE_VERSION) return null;
    if (!isValidVehicleProfile(candidate)) return null;
    return { brand: candidate.brand, platform: candidate.platform, model: candidate.model, year: candidate.year, engine: candidate.engine, drive: candidate.drive, transmission: candidate.transmission, rpoCodes: [...new Set(candidate.rpoCodes)], ...(candidate.vin ? { vin: candidate.vin } : {}) };
  } catch { return null; }
}
export function serializeVehicleProfile(profile: VehicleProfile): string {
  return JSON.stringify({ version: VEHICLE_PROFILE_VERSION, profile });
}
export function vehicleProfileSummary(profile: VehicleProfile | null): string {
  if (!profile?.brand || !profile.model) return 'Ustaw profil auta';
  return [`${profile.brand} ${profile.model}`, profile.year, profile.engine, profile.drive, profile.rpoCodes.length ? `RPO: ${profile.rpoCodes.join(', ')}` : ''].filter(Boolean).join(' · ');
}
export function vehicleProfileShort(profile: VehicleProfile | null): string {
  if (!profile?.brand || !profile.model) return '';
  const model = profile.model.replace(/ (\d)-door$/, ' $1d');
  return [model, profile.year].filter(Boolean).join(' · ');
}
