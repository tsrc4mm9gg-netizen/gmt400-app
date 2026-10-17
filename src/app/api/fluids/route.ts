import { NextResponse } from 'next/server';
import { findFluids } from '@/lib/fluids';

export const dynamic = 'force-static';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const system = searchParams.get('system') ?? undefined;
 const powertrain = searchParams.get('powertrain') ?? undefined;
 const transmission = searchParams.get('transmission') ?? undefined;

 const results = findFluids({ system, powertrain, transmission });

 return NextResponse.json({
 query: { system: system ?? null, powertrain: powertrain ?? null, transmission: transmission ?? null },
 count: results.length,
 results,
 disclaimer: 'Pojemności i specyfikacje są referencyjne. Przed serwisem potwierdź je w instrukcji właściwego rocznika i modelu oraz na pojeździe.'
 });
}
