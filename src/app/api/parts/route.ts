import { NextResponse } from 'next/server';
import { findParts } from '@/lib/parts-compatibility';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const model = searchParams.get('model') ?? undefined;
 const yearRaw = searchParams.get('year');
 const year = yearRaw ? Number(yearRaw) : undefined;
 const engine = searchParams.get('engine') ?? undefined;
 const transmission = searchParams.get('transmission') ?? undefined;

 if (yearRaw && (!Number.isInteger(year) || (year as number) < 1988 || (year as number) > 1998)) {
 return NextResponse.json({ error: 'Rok musi być liczbą całkowitą z zakresu 1988–1998.' }, { status: 400 });
 }

 const results = findParts({ model, year, engine, transmission });
 const matched = results.filter(result => result.matched);

 return NextResponse.json({
 query: { model: model ?? null, year: year ?? null, engine: engine ?? null, transmission: transmission ?? null },
 matchedCount: matched.length,
 results: matched,
 allResults: results,
 disclaimer: 'Wyniki są referencyjne. Przed zakupem potwierdź numer części, rocznik, silnik, skrzynię i stan pojazdu.'
 });
}
