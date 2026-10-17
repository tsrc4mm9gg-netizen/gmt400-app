import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const CONVERSIONS = {
 length: { milesToKm: 1.609344, kmToMiles: 0.621371 },
 volume: { usGallonsToLiters: 3.785411784, litersToUsGallons: 0.264172052 },
 pressure: { psiToBar: 0.0689475729, barToPsi: 14.5037738 },
 mass: { poundsToKg: 0.45359237, kgToPounds: 2.20462262 },
 torque: { ftLbToNm: 1.35581795, nmToFtLb: 0.737562149 }
} as const;

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const type = searchParams.get('type');
 const value = Number(searchParams.get('value'));

 if (!type || !(type in CONVERSIONS)) {
 return NextResponse.json({ error: 'Nieprawidłowy typ. Dostępne: length, volume, pressure, mass, torque.' }, { status: 400 });
 }
 if (!Number.isFinite(value)) {
 return NextResponse.json({ error: 'Parametr value musi być liczbą.' }, { status: 400 });
 }

 const conversions = CONVERSIONS[type as keyof typeof CONVERSIONS];
 const [fromKey, toKey] = Object.keys(conversions) as [keyof typeof conversions, keyof typeof conversions];
 const result = conversions[toKey] * value;

 return NextResponse.json({
 type,
 input: { value, unit: fromKey },
 output: { value: Number(result.toFixed(6)), unit: toKey },
 note: 'Przelicznik techniczny. Nie zastępuje danych z tabliczki pojazdu ani instrukcji serwisowej.'
 });
}
