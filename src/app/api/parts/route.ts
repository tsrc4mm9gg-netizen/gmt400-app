import { NextResponse } from 'next/server';
import { findParts } from '@/lib/parts-compatibility';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const model = searchParams.get('model')?.trim() || undefined;
 const engine = searchParams.get('engine')?.trim() || undefined;
 const transmission = searchParams.get('transmission')?.trim() || undefined;
 const yearRaw = searchParams.get('year');
 const yearText = yearRaw?.trim();
 const year = yearText ? Number(yearText) : undefined;
 if (yearRaw !== null && (!yearText || !/^\d{4}$/.test(yearText) || !Number.isInteger(year) || year! < 1988 || year! > 2000)) return NextResponse.json({ error: 'Rok musi być liczbą całkowitą z zakresu 1988–2000.' }, { status: 400 });
 if ([model, engine, transmission].some(value => value && value.length > 80)) return NextResponse.json({ error: 'Parametry tekstowe mogą mieć najwyżej 80 znaków.' }, { status: 400 });
 const allResults = findParts({ model, year, engine, transmission }).map(item => ({ ...item, confidence: 'verify' as const, fitmentVerified: false }));
 const results = allResults.filter(item => item.matched);
 return NextResponse.json({ query: { model: model ?? null, year: year ?? null, engine: engine ?? null, transmission: transmission ?? null }, matchedCount: results.length, results, allResults, matchStatus: 'reference-only', disclaimer: 'Wyniki to wpisy referencyjne zgodne z filtrami, nie potwierdzenie pasowania części. Obsługa rocznika w formularzu nie rozszerza zakresu zastosowania wpisów. Przed zakupem potwierdź numer części i wyposażenie auta.' });
}
