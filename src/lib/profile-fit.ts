// „Pasuje do Twojego auta”: materiał wprost opisuje model, silnik, napęd lub skrzynię z profilu
// (co najmniej jedno pole zgodne, żadne sprzeczne). Służy tylko do sortowania i plakietki —
// ukrywanie pozostaje w matchVehicle (bez zmian).
import { ENGINES } from './verified-specs';
import { matchVehicle, type Applicability } from './vehicle-compatibility';
import { matchesYearRules } from './year-range.mjs';
import type { VehicleProfile } from './vehicle-profile';

type Fit = 'match' | 'conflict' | 'none';
type Engine = { code: string; litres: string; diesel?: boolean; vortec?: boolean; tbi?: boolean };

const ENGINE_BY_CODE = new Map<string, Engine>();
for (const engine of ENGINES) for (const code of engine.rpo.match(/\bL[A-Z0-9]{2}\b/g) || []) {
  ENGINE_BY_CODE.set(code, { code, litres: engine.name.match(/\d\.\d/)?.[0] || '', diesel: /diesel/i.test(engine.name), vortec: /vortec/i.test(engine.name), tbi: /tbi/i.test(engine.name) });
}
// Pojemność w calach sześciennych → litry (oznaczenia handlowe GM).
const CUBIC: Record<string, string> = { '262': '4.3', '305': '5.0', '350': '5.7', '454': '7.4' };
const GENERAL = /^(wszystkie|wszystkie modele|ogolne|ogólne|all)$/i;
const norm = (value: string) => value.trim().toLowerCase();
const meaningful = (values: string[] | undefined) => (values || []).filter(value => value.trim() && !GENERAL.test(value.trim()));
const combine = (fits: Fit[]): Fit => fits.includes('match') ? 'match' : fits.length && fits.every(fit => fit === 'conflict') ? 'conflict' : 'none';

export function profileEngine(profile: Pick<VehicleProfile, 'engine' | 'rpoCodes'>): Engine | null {
  const text = (profile.engine || '').toUpperCase();
  for (const code of [...(text.match(/\bL[A-Z0-9]{2}\b/g) || []), ...(profile.rpoCodes || [])]) {
    const known = ENGINE_BY_CODE.get(code);
    if (known) return known;
  }
  const litres = text.match(/\b\d[.,]\d\b/)?.[0].replace(',', '.') || CUBIC[text.match(/\b(262|305|350|454)\b/)?.[1] || ''];
  if (!litres) return null;
  const diesel = /DIESEL|\bTD\b/.test(text) || litres === '6.2' || litres === '6.5' ? true : /BENZYN|VORTEC|TBI/.test(text) || ['4.3', '5.0', '5.7', '7.4'].includes(litres) ? false : undefined;
  return { code: '', litres, diesel, vortec: /VORTEC/.test(text) || undefined, tbi: /TBI/.test(text) || undefined };
}

function engineFit(value: string, engine: Engine): Fit {
  const text = value.toUpperCase();
  const codes = text.match(/\bL[A-Z0-9]{2}\b/g);
  if (codes) return engine.code ? (codes.includes(engine.code) ? 'match' : 'conflict') : 'none';
  const diesel = /\bTD\b|DIESEL/.test(text) ? true : /BENZYN/.test(text) ? false : undefined;
  if (diesel !== undefined && engine.diesel !== undefined && diesel !== engine.diesel) return 'conflict';
  const litres = text.match(/\d\.\d/)?.[0];
  if (litres) return engine.litres ? (litres === engine.litres ? 'match' : 'conflict') : 'none';
  if (diesel === undefined || engine.diesel === undefined) return 'none';
  if (/\bV8\b/.test(text) && engine.litres === '4.3') return 'conflict';
  if (/\bV6\b/.test(text) && engine.litres && engine.litres !== '4.3') return 'conflict';
  if (/VORTEC|CSFI/.test(text)) return engine.vortec ? 'match' : engine.tbi ? 'conflict' : 'none';
  if (/\bTBI\b/.test(text)) return engine.tbi ? 'match' : engine.vortec ? 'conflict' : 'none';
  return 'match';
}

const PLATFORM_TOKENS: Record<string, string[]> = { 'C/K': ['c/k'], Sierra: ['sierra', 'c/k'], Tahoe: ['tahoe'], Suburban: ['suburban'], Yukon: ['yukon'] };
const KNOWN_MODELS = new Set(['c/k', 'sierra', 'tahoe', 'suburban', 'yukon', 'escalade', 'blazer']);
function modelFit(value: string, profile: Pick<VehicleProfile, 'platform' | 'model'>): Fit {
  const own = PLATFORM_TOKENS[profile.platform || profile.model] || [];
  if (!own.length) return 'none';
  const tokens = value.split(/\s+\/\s+|,\s*/).map(norm).filter(Boolean);
  if (tokens.some(token => own.includes(token))) return 'match';
  return tokens.length && tokens.every(token => KNOWN_MODELS.has(token)) ? 'conflict' : 'none';
}

const driveCode = (value: string) => { const text = norm(value).replace(/[\s×]/g, 'x'); return ['4wd', '4x4'].includes(text) ? '4wd' : ['2wd', '4x2'].includes(text) ? '2wd' : ''; };
const GEAR_CODES = /4L60E|4L80E|4L60|3L80|NV3500|NV4500|NV1500|TH400|700R4|SM465/g;
const gearKind = (text: string) => /AUTOMAT|4L60|4L80|3L80|TH400|700R4/.test(text) ? 'auto' : /MANUAL|NV\d{4}|SM465/.test(text) ? 'manual' : '';
function transmissionFit(value: string, own: string): Fit {
  if (!own) return 'none';
  const text = value.toUpperCase().replace(/[-\s]/g, '');
  const mine = own.toUpperCase().replace(/[-\s]/g, '');
  const codes = text.match(GEAR_CODES);
  const ownCodes = mine.match(GEAR_CODES);
  if (codes) return ownCodes ? (codes.some(code => ownCodes.includes(code)) ? 'match' : 'conflict') : 'none';
  const kind = gearKind(text);
  const ownKind = gearKind(mine);
  return !kind || !ownKind ? 'none' : kind === ownKind ? 'match' : 'conflict';
}

// Zakres lat bywa opisem („1996–1999 (wg SM…)”, „1997–98 C/K…”): bierzemy pierwszy zapis roku/zakresu.
function yearExcluded(year: string, value: string): boolean {
  const status = matchesYearRules(year, [value]);
  if (status !== null) return status === false;
  const found = value.match(/\b(19[89]\d|20[01]\d)(?:\s*[–—-]\s*(\d{4}|\d{2})\b)?/);
  if (!found) return false;
  const from = Number(found[1]);
  const to = found[2] ? Number(found[2].length === 2 ? found[1].slice(0, 2) + found[2] : found[2]) : from;
  const own = Number(year);
  return to >= from && (own < from || own > to);
}

export function fitsProfileExplicitly(profile: VehicleProfile, rules: Applicability | undefined): boolean {
  if (!rules) return false;
  if (matchVehicle(profile, rules).status === 'outside_scope') return false;
  const brands = meaningful(rules.brand);
  if (brands.length && profile.brand && !brands.some(brand => norm(brand) === norm(profile.brand))) return false;
  const years = meaningful(rules.years);
  if (years.length && /^\d{4}$/.test(profile.year) && years.every(value => yearExcluded(profile.year, value))) return false;
  const engine = profileEngine(profile);
  const drive = driveCode(profile.drive);
  const fits: Fit[] = [];
  const models = meaningful(rules.model);
  if (models.length) fits.push(combine(models.map(value => modelFit(value, profile))));
  const engines = meaningful(rules.engine);
  if (engines.length && engine) fits.push(combine(engines.map(value => engineFit(value, engine))));
  const drives = meaningful(rules.drive).map(driveCode).filter(Boolean);
  if (drives.length && drive) fits.push(drives.includes(drive) ? 'match' : 'conflict');
  const gears = meaningful(rules.transmission);
  if (gears.length) fits.push(combine(gears.map(value => transmissionFit(value, profile.transmission))));
  return !fits.includes('conflict') && fits.includes('match');
}

/** Krótka etykieta auta do paska filtrów, np. „K1500 1995 5.7”. */
export function profileChipLabel(profile: VehicleProfile | null): string {
  if (!profile?.brand || !profile.model) return '';
  const engine = profileEngine(profile);
  return [profile.model.replace(/ (\d)-door$/, ' $1d'), profile.year, engine?.litres || profile.engine].filter(Boolean).join(' ');
}
