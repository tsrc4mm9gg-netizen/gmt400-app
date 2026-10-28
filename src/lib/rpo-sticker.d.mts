export type StickerCode = { code: string; known: boolean };
export type StickerVin = { vin: string; checkOk: boolean };
export const MAX_CODES: number;
export function extractVin(text: string): StickerVin | null;
export function parseStickerText(text: string, isKnown: (code: string) => boolean): { codes: StickerCode[]; ignored: string[]; vin: StickerVin | null };
export function normalizeRpoInput(value: string): string | null;
export function suggestKnown(code: string, isKnown: (code: string) => boolean): string | null;
