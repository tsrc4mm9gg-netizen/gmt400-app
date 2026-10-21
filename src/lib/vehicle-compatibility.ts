import { GMT400_YEAR_RANGE, type VehicleProfile } from './vehicle-profile';

export interface ContentCompatibility {
  makes?: string[];
  platforms?: string[];
  models?: string[];
  years?: [number, number] | number[];
  engines?: string[];
  drivetrains?: string[];
  rpoCodes?: string[];
}

const normalize = (value: string) => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');

export function matchesVehicleProfile(profile: VehicleProfile | null, compatibility?: ContentCompatibility): boolean {
  if (!compatibility) return true;
  if (!profile?.brand || !profile.model) return true;

  if (compatibility.makes?.length && !compatibility.makes.some(make => normalize(make) === normalize(profile.brand))) return false;
  if (compatibility.platforms?.length && profile.platform && !compatibility.platforms.some(platform => normalize(platform) === normalize(profile.platform))) return false;
  if (compatibility.models?.length && !compatibility.models.some(model => normalize(model) === normalize(profile.model))) return false;

  if (compatibility.years?.length) {
    const year = Number(profile.year);
    if (profile.year && Number.isFinite(year)) {
      const ranges = compatibility.years.map(value => Array.isArray(value) ? value : [value, value]);
      if (!ranges.some(([from, to]) => year >= from && year <= to)) return false;
    }
  }

  if (compatibility.engines?.length && profile.engine && !compatibility.engines.some(engine => normalize(engine) === normalize(profile.engine))) return false;
  if (compatibility.drivetrains?.length && profile.drive && !compatibility.drivetrains.some(drive => normalize(drive) === normalize(profile.drive))) return false;

  if (compatibility.rpoCodes?.length && profile.rpoCodes.length) {
    const hasRequiredRpo = compatibility.rpoCodes.some(code => profile.rpoCodes.includes(code.toUpperCase()));
    if (!hasRequiredRpo) return false;
  }

  return true;
}

export function isWithinGmt400Years(year: string): boolean {
  const value = Number(year);
  return Number.isFinite(value) && value >= GMT400_YEAR_RANGE[0] && value <= GMT400_YEAR_RANGE[1];
}
