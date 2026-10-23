import { ENGINES, type EngineSpec } from './verified-specs';

// Typowe opcje silnikowe wg [W1]/[W2] (docs/factual-corrections.md). Dostępność zależy od rocznika,
// serii (1500/2500/3500), GVWR i rynku — zawsze potwierdź kodem RPO z naklejki w schowku.
const BY_BODY: Record<string, string[]> = {
  'tahoe-4d': ['L05', 'L31'],
  'tahoe-2d': ['L05', 'L31', 'L56'],
  yukon: ['L05', 'L31', 'L56'],
  suburban: ['L05', 'L31', 'L19', 'L29', 'L56', 'L65'],
  'ck-reg': ['LB4', 'L35', 'L03', 'L30', 'L05', 'L31', 'L19', 'L29', 'LH6', 'L49', 'L56'],
  'ck-ext': ['LB4', 'L35', 'L03', 'L30', 'L05', 'L31', 'L19', 'L29', 'LH6', 'L49', 'L56'],
  k1500: ['LB4', 'L35', 'L03', 'L30', 'L05', 'L31', 'LH6', 'L49', 'L56'],
  sierra: ['LB4', 'L35', 'L03', 'L30', 'L05', 'L31', 'L19', 'L29', 'LH6', 'L49', 'L56'],
  dually: ['L05', 'L31', 'L19', 'L29', 'LH6', 'L65'],
};

const overlaps = (years: string, from: number, to: number) => {
  const [a, b] = years.split(/[–-]/).map(value => Number(value.trim()));
  return Number.isFinite(a) && (Number.isFinite(b) ? b : a) >= from && a <= to;
};

export function enginesForBody(id: string, from: number, to: number): EngineSpec[] {
  const codes = BY_BODY[id] || [];
  return ENGINES.filter(engine => codes.some(code => engine.rpo.includes(code)) && overlaps(engine.years, from, to));
}
