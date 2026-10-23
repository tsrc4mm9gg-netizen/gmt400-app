export type VinSource = { title: string; url: string };
export const VIN_SOURCES: Record<'cfr' | 'om94' | 'om95' | 'om96' | 'om97' | 'om98' | 'om99' | 'vpic', VinSource>;
export const YEAR_CODES: Record<string, number>;
export type EngineInfo = { code: string; engine: string; rpo?: string; fuel?: string; scope: string; sources: string[] };
export const ENGINE_TABLES: { from: number; to: number; sources: string[]; scope: string; codes: Record<string, { engine: string; rpo?: string; fuel?: string }> }[];
export function normalizeVin(value: unknown): string;
export function expectedCheckDigit(vin: string): string | null;
export type VinDecodeResult =
  | { vin: string; ok: false; errors: string[] }
  | { vin: string; ok: true; errors: []; wmi: string; vds: string; check: { value: string; expected: string | null; ok: boolean }; yearCode: string; year: number | null; yearInRange: boolean; engine: EngineInfo | null; engineNote?: string; plantCode: string; serial: string };
export function decodeVin(input: unknown): VinDecodeResult;
