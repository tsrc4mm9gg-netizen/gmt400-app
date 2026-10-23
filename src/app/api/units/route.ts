import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const CONVERSIONS = { length:{ from:'mile', to:'km', factor:1.609344 }, volume:{ from:'US gallon', to:'litr', factor:3.785411784 }, pressure:{ from:'psi', to:'bar', factor:0.0689475729 }, mass:{ from:'funt', to:'kg', factor:0.45359237 }, torque:{ from:'ft-lb', to:'N·m', factor:1.35581795 } } as const;
export async function GET(request:Request) {
 const p = new URL(request.url).searchParams;
 const type = p.get('type');
 if (!type || !Object.prototype.hasOwnProperty.call(CONVERSIONS, type)) return NextResponse.json({ error:'Nieprawidłowy typ. Dostępne: length, volume, pressure, mass, torque.' }, { status:400 });
 const reverseRaw = p.get('reverse');
 if (reverseRaw !== null && !['true', 'false'].includes(reverseRaw)) return NextResponse.json({ error:'Parametr reverse musi mieć wartość true lub false.' }, { status:400 });
 const text = p.get('value')?.trim() ?? '';
 const value = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(text) ? Number(text.replace(',', '.')) : NaN;
 if (!Number.isFinite(value)) return NextResponse.json({ error:'Parametr value musi być skończoną liczbą.' }, { status:400 });
 const reverse = reverseRaw === 'true';
 const item = CONVERSIONS[type as keyof typeof CONVERSIONS];
 const result = reverse ? value / item.factor : value * item.factor;
 if (!Number.isFinite(result)) return NextResponse.json({ error:'Wynik przekracza zakres obliczeń.' }, { status:400 });
 return NextResponse.json({ type, input:{ value, unit:reverse ? item.to : item.from }, output:{ value:Number(result.toFixed(6)), unit:reverse ? item.from : item.to }, note:'Przelicznik techniczny. Nie zastępuje danych z tabliczki pojazdu ani instrukcji serwisowej.' });
}
