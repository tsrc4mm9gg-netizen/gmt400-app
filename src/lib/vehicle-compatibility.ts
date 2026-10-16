export type VehicleSelection = { brand: string; model: string; year: string; engine: string; drive: string; transmission: string };
export type Applicability = { brand: string[]; model: string[]; years: string[]; engine: string[]; drive: string[]; transmission: string[] };
export type MatchResult = { status: 'within_scope' | 'general' | 'unknown' | 'outside_scope'; reasons: string[] };
const normalize = (value: string) => value.trim().toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/\s+/g, ' ');
const general = (value: string) => ['wszystkie', 'wszystkie modele', 'ogolne', 'all'].includes(normalize(value));
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
    if (values.some(value => normalize(value) === normalize(profile[field]))) explicit++;
    else outside.push(label + ': poza opisanym zakresem');
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
