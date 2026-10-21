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

export type VehicleSelection = {
  brand: string;
  model: string;
  year: string;
  engine: string;
  drive: string;
  transmission: string;
};

export type Applicability = {
  brand: string[];
  model: string[];
  years: string[];
  engine: string[];
  drive: string[];
  transmission: string[];
};

export type MatchResult = {
  status: 'within_scope' | 'general' | 'unknown' | 'outside_scope';
  reasons: string[];
};

const normalize = (value: string) => value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
const general = (value: string) => ['wszystkie', 'wszystkie modele', 'ogolne', 'all'].includes(normalize(value));
const canonical = (field: string, value: string) => {
  const text = normalize(value);
  if (field === 'drive' && ['4x4', '4×4', '4wd'].includes(text.replace(/\s/g, ''))) return '4wd';
  return text;
};
const comparable = (field: string, value: string) => {
  const text = canonical(field, value);
  if (field === 'brand') return ['chevrolet', 'gmc'].includes(text);
  if (field === 'model') return ['c/k', 'suburban', 'tahoe', 'sierra', 'yukon'].includes(text);
  if (field === 'drive') return ['2wd', '4wd'].includes(text);
  if (field === 'engine') return /^[a-z][0-9]{2}$/.test(text);
  return /^4l(?:60|80)e$/.test(text);
};

export function matchVehicle(profile: VehicleSelection, rules: Applicability): MatchResult {
  const unknown: string[] = [];
  const outside: string[] = [];
  let explicit = 0;
  let wildcards = 0;
  const fields = [['brand', 'Marka'], ['model', 'Model'], ['engine', 'Silnik'], ['drive', 'Napęd'], ['transmission', 'Skrzynia']] as const;

  for (const [field, label] of fields) {
    const values = rules[field] || [];
    if (!values.length) { unknown.push(label + ': brak zakresu w materiale'); continue; }
    if (values.some(general)) { wildcards++; continue; }
    if (!profile[field]) { unknown.push(label + ': nieuzupełniony profil'); continue; }
    if (values.some(value => canonical(field, value) === canonical(field, profile[field]))) explicit++;
    else if (comparable(field, profile[field]) && values.every(value => comparable(field, value))) outside.push(label + ': poza opisanym zakresem');
    else unknown.push(label + ': niejednoznaczne oznaczenia wymagają sprawdzenia');
  }

  if (!rules.years?.length) unknown.push('Rocznik: brak zakresu w materiale');
  else if (rules.years.some(general)) wildcards++;
  else if (!/^\d{4}$/.test(profile.year)) unknown.push('Rocznik: nieustalony w profilu');
  else {
    const checks = rules.years.map(value => {
      const text = value.trim();
      if (/^\d{4}$/.test(text)) return text === profile.year;
      const range = text.match(/^(\d{4})\s*[-–—]\s*(\d{4})$/);
      if (!range || Number(range[1]) > Number(range[2])) return null;
      return Number(profile.year) >= Number(range[1]) && Number(profile.year) <= Number(range[2]);
    });
    if (checks.includes(true)) explicit++;
    else if (checks.includes(null)) unknown.push('Rocznik: nierozpoznany zapis zakresu');
    else outside.push('Rocznik: poza opisanym zakresem');
  }

  if (outside.length) return { status: 'outside_scope', reasons: outside };
  if (unknown.length) return { status: 'unknown', reasons: unknown };
  if (!explicit && wildcards === 6) return { status: 'general', reasons: ['Materiał opisany jako ogólny dla wszystkich parametrów.'] };
  return { status: 'within_scope', reasons: ['Profil mieści się w metadanych materiału. Nie potwierdza to poprawności porady ani dopasowania części.'] };
}

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
