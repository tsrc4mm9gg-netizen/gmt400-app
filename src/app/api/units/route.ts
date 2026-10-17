import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CONVERSIONS = {
 length: { from: 'mile', to: 'km', factor: 1.609344 },
 volume: { from: 'US gallon', to: 'litr', factor: 3.785411784 },
 pressure: { from: 'psi', to: 'bar', factor: 0.0689475729 },
 mass: { from: 'funt', to: 'kg', factor: 0.45359237 },
 torque: { from: 'ft-lb', to: 'Nm', factor: 1.35581795 }
} as const;

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const type = searchParams.get('type');
 const reverse = searchParams.get('reverse') === 'true';
 const rawValue = searchParams.get('value');
 const value = rawValue === null || rawValue.trim() === '' ? NaN : Number(rawValue);

 if (!type || !(type in CONVERSIONS)) {
 return NextResponse.json({ error: 'Nieprawidłowy typ. Dostępne: length, volume, pressure, mass, torque.' }, { status: 400 });
 }
 if (!Number.isFinite(value)) {
 return NextResponse.json({ error: 'Parametr value musi być liczbą.' }, { status: 400 });
 }

 const item = CONVERSIONS[type as keyof typeof CONVERSIONS];
 const result = reverse ? value / item.factor : value * item.factor;

 return NextResponse.json({
 type,
 input: { value, unit: reverse ? item.to : item.from },
 output: { value: Number(result.toFixed(6)), unit: reverse ? item.from : item.to },
 note: 'Przelicznik techniczny. Nie zastępuje danych z tabliczki pojazdu ani instrukcji serwisowej.'
 });
}
