import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const VIN_POSITIONS = {
 worldManufacturer: [0, 2],
 attributes: [3, 8],
 checkDigit: 8,
 modelYear: 9,
 plant: 10,
 serial: [11, 16]
} as const;

const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const raw = (searchParams.get('vin') ?? '').replace(/[\s-]/g, '').toUpperCase();

 if (raw.length !== 17) {
 return NextResponse.json({ valid: false, error: 'VIN musi mieć dokładnie 17 znaków.' }, { status: 400 });
 }
 if (/[IOQ]/.test(raw)) {
 return NextResponse.json({ valid: false, error: 'VIN nie może zawierać liter I, O ani Q.' }, { status: 400 });
 }

 const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
 const transliteration: Record<string, number> = {};
 'ABCDEFGH'.split('').forEach((letter, index) => transliteration[letter] = index + 1);
 'JKLMN'.split('').forEach((letter, index) => transliteration[letter] = index + 1);
 'P'.split('').forEach(letter => transliteration[letter] = 7);
 'RSTUVW'.split('').forEach((letter, index) => transliteration[letter] = index + 2);
 'XYZ'.split('').forEach((letter, index) => transliteration[letter] = index + 1);
 '123456789'.split('').forEach(digit => transliteration[digit] = Number(digit));
 transliteration['0'] = 0;

 let sum = 0;
 for (let index = 0; index < 17; index += 1) {
 const value = transliteration[raw[index]];
 if (value === undefined) {
 return NextResponse.json({ valid: false, error: 'VIN zawiera nieprawidłowy znak.' }, { status: 400 });
 }
 sum += value * weights[index];
 }
 const remainder = sum % 11;
 const expectedCheckDigit = remainder === 10 ? 'X' : String(remainder);

 const yearCode = raw[VIN_POSITIONS.modelYear];
 const yearIndex = YEAR_CODES.indexOf(yearCode);
 const modelYear = yearIndex >= 0 ? 1980 + yearIndex : null;

 return NextResponse.json({
 valid: raw[VIN_POSITIONS.checkDigit] === expectedCheckDigit,
 vin: raw,
 worldManufacturerIdentifier: raw.slice(...VIN_POSITIONS.worldManufacturer),
 vehicleAttributes: raw.slice(...VIN_POSITIONS.attributes),
 checkDigit: raw[VIN_POSITIONS.checkDigit],
 expectedCheckDigit,
 modelYear,
 plantCode: raw[VIN_POSITIONS.plant],
 serialNumber: raw.slice(...VIN_POSITIONS.serial),
 note: 'Walidacja struktury VIN. Nie identyfikuje modelu, wyposażenia ani historii pojazdu.'
 });
}
