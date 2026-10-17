import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';
const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function transliterate(char: string): number | undefined {
 if (/[0-9]/.test(char)) return Number(char);
 const map: Record<string, number> = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9, S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9 };
 return map[char];
}

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const raw = (searchParams.get('vin') ?? '').replace(/[\s-]/g, '').toUpperCase();

 if (raw.length !== 17) {
 return NextResponse.json({ valid: false, error: 'VIN musi mieć dokładnie 17 znaków.' }, { status: 400 });
 }
 if (/[IOQ]/.test(raw)) {
 return NextResponse.json({ valid: false, error: 'VIN nie może zawierać liter I, O ani Q.' }, { status: 400 });
 }

 let sum = 0;
 for (let index = 0; index < 17; index += 1) {
 const value = transliterate(raw[index]);
 if (value === undefined) {
 return NextResponse.json({ valid: false, error: 'VIN zawiera nieprawidłowy znak.' }, { status: 400 });
 }
 sum += value * WEIGHTS[index];
 }
 const remainder = sum % 11;
 const expectedCheckDigit = remainder === 10 ? 'X' : String(remainder);

 const yearIndex = YEAR_CODES.indexOf(raw[9]);
 const modelYear = yearIndex >= 0 ? (yearIndex < 30 ? 1980 + yearIndex : null) : null;

 return NextResponse.json({
 valid: raw[8] === expectedCheckDigit,
 vin: raw,
 worldManufacturerIdentifier: raw.slice(0, 3),
 vehicleAttributes: raw.slice(3, 8),
 checkDigit: raw[8],
 expectedCheckDigit,
 modelYear,
 modelYearNote: 'Kod roku może oznaczać rok z cyklu 1980–2009 lub 2010–2039. Dla GMT400 właściwy jest zakres 1988–1998.',
 plantCode: raw[10],
 serialNumber: raw.slice(11),
 note: 'Walidacja struktury VIN. Nie identyfikuje modelu, wyposażenia ani historii pojazdu.'
 });
}
