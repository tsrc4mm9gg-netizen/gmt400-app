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
}

export const VEHICLE_PROFILE_VERSION = 2;
export const VEHICLE_PROFILE_STORAGE_KEY = 'gmt400_vehicle_profile_v2';
export const GMT400_YEAR_RANGE = [1988, 2000] as const;

export const VEHICLE_CATALOG: Record<VehicleMake, Record<VehiclePlatform, string[]>> = {
  Chevrolet: {
    'C/K': ['C1500', 'K1500', 'C2500', 'K2500', 'C3500', 'K3500'],
    Tahoe: ['Tahoe 2-door', 'Tahoe 4-door'],
    Suburban: ['Suburban 1500', 'Suburban 2500'],
    Yukon: [],
    Sierra: []
  },
  GMC: {
    'C/K': ['C1500', 'K1500', 'C2500', 'K2500', 'C3500', 'K3500'],
    Sierra: ['Sierra 1500', 'Sierra 2500', 'Sierra 3500'],
    Suburban: ['Suburban 1500', 'Suburban 2500'],
    Yukon: ['Yukon 2-door', 'Yukon 4-door'],
    Tahoe: []
  }
};

export const EMPTY_VEHICLE_PROFILE: VehicleProfile = {
  brand: '',
  platform: '',
  model: '',
  year: '',
  engine: '',
  drive: '',
  transmission: '',
  rpoCodes: []
};

export function normalizeRpoCodes(value: string): string[] {
  return [...new Set(value
    .toUpperCase()
    .split(/[\s,;]+/)
    .map(code => code.trim())
    .filter(code => /^[A-Z0-9]{2,5}$/.test(code))
  )].sort();
}

export function isValidVehicleProfile(value: unknown): value is VehicleProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Partial<VehicleProfile>;
  const validBrand = profile.brand === '' || profile.brand === 'Chevrolet' || profile.brand === 'GMC';
  const validDrive = profile.drive === '' || profile.drive === '2WD' || profile.drive === '4WD';
  const validYear = profile.year === '' || /^(19(8[89]|9\d)|2000)$/.test(profile.year);
  const validRpo = Array.isArray(profile.rpoCodes) && profile.rpoCodes.every(code => typeof code === 'string' && /^[A-Z0-9]{2,5}$/.test(code));
  return validBrand && validDrive && validYear && validRpo
    && typeof profile.model === 'string' && profile.model.length <= 80
    && typeof profile.engine === 'string' && profile.engine.length <= 80
    && typeof profile.transmission === 'string' && profile.transmission.length <= 80;
}

export function parseVehicleProfile(raw: string | null): VehicleProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VEHICLE_PROFILE_VERSION || !isValidVehicleProfile(parsed.profile)) return null;
    return parsed.profile;
  } catch {
    return null;
  }
}

export function serializeVehicleProfile(profile: VehicleProfile): string {
  return JSON.stringify({ version: VEHICLE_PROFILE_VERSION, profile });
}

export function vehicleProfileSummary(profile: VehicleProfile | null): string {
  if (!profile?.brand || !profile.model) return 'Ustaw profil auta';
  const parts = [
    `${profile.brand} ${profile.model}`,
    profile.year,
    profile.engine,
    profile.drive,
    profile.rpoCodes.length ? `RPO: ${profile.rpoCodes.join(', ')}` : ''
  ].filter(Boolean);
  return parts.join(' · ');
}
