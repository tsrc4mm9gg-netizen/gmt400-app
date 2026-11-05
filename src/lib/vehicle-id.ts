import type { VehicleProfile } from './vehicle-profile';

/**
 * Stabilny identyfikator konfiguracji auta.
 * Historia serwisowa pozostaje przypisana do tej samej konfiguracji,
 * dopóki nie zmienią się dane istotne dla pojazdu.
 */
export function vehicleIdFromProfile(profile: VehicleProfile): string {
  const parts = [
    profile.brand,
    profile.platform,
    profile.model,
    profile.year,
    profile.engine,
    profile.drive,
    profile.transmission,
    profile.vin ?? '',
  ];
  return parts.join('|').toLowerCase();
}
