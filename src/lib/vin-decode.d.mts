export type VinSourceKey = 'cfr' | 'om94' | 'om95' | 'om96' | 'om97' | 'om98' | 'om99' | 'vpic' | 'gmsm98' | 'gmsm99' | 'gmsm00' | 'gmsms10' | 'gmstd' | 'lmc' | 'jegs';
export type VinSource = { short: string; title: string; url: string };
export const VIN_SOURCES: Record<VinSourceKey, VinSource>;
export const YEAR_CODES: Record<string, number>;
export const UNKNOWN: string;
export type SourceTier = 'gm' | 'secondary' | 'unknown';
export type PositionTable = { from: number; to: number; tier: SourceTier; sources: VinSourceKey[]; codes: Record<string, string>; note?: string };
export const POSITION_TABLES: Record<number, PositionTable[]>;
export type EngineInfo = { code: string; engine: string; rpo?: string; fuel?: string; scope: string; tier: SourceTier; sources: VinSourceKey[] };
export const ENGINE_TABLES: { from: number; to: number; tier: SourceTier; sources: VinSourceKey[]; scope: string; codes: Record<string, { engine: string; rpo?: string; fuel?: string }> }[];
export type VinField = { pos: string; code: string; label: string; value: string | null; tier: SourceTier; sources: VinSourceKey[]; note?: string };
export function normalizeVin(value: unknown): string;
export function expectedCheckDigit(vin: string): string | null;
export type VinDecodeResult =
  | { vin: string; ok: false; errors: string[] }
  | { vin: string; ok: true; errors: []; wmi: string; vds: string; check: { value: string; expected: string | null; ok: boolean }; yearCode: string; year: number | null; yearInRange: boolean; engine: EngineInfo | null; engineNote?: string; plantCode: string; serial: string; fields: VinField[] };
export function decodeVin(input: unknown): VinDecodeResult;
export type VinProfilePatch = { brand?: 'Chevrolet' | 'GMC'; year?: string; drive?: '2WD' | '4WD'; engine?: string; platform?: 'C/K' | 'Suburban' | 'Tahoe' | 'Yukon'; model?: string };
export function profileFromVin(result: VinDecodeResult | null | undefined): VinProfilePatch | null;
export function vinHistoryLinks(vin: string): { label: string; href: string }[];
export function lbRangeToKg(text: string): string;
