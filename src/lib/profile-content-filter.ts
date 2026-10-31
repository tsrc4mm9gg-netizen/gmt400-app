import { isGeneralEntry, isSpecificToBody } from './model-images';
import { matchVehicle, type Applicability } from './vehicle-compatibility';
import type { VehicleProfile } from './vehicle-profile';

const EMPTY: Applicability = { brand: [], model: [], years: [], engine: [], drive: [], transmission: [] };
type Filterable = { Nazwa?: string; Model?: string; Modele?: string[]; applicability?: Applicability };

/**
 * Ta sama reguła co na listach Usterki/DIY: wybrane nadwozie (selection/bodyId) zostawia wpisy ogólne i dla tego
 * nadwozia, a profil auta odrzuca tylko wpisy „Poza zakresem” (ogólne i nieustalone zostają, żeby nic nie znikało bez powodu).
 */
export function fitsActiveCar(entry: Filterable, profile: VehicleProfile | null, bodyId: string | null): boolean {
  if (bodyId && !(isGeneralEntry(entry) || isSpecificToBody(entry as never, bodyId))) return false;
  if (profile && matchVehicle(profile, entry.applicability || EMPTY).status === 'outside_scope') return false;
  return true;
}
