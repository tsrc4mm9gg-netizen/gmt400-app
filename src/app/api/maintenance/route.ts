import { NextResponse } from 'next/server';
import { findMaintenance } from '@/lib/maintenance';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const fuel = searchParams.get('fuel') ?? undefined;
 const drivetrain = searchParams.get('drivetrain') ?? undefined;
 const transmission = searchParams.get('transmission') ?? undefined;
 const severeService = searchParams.get('severeService') === 'true';

 const results = findMaintenance({ fuel, drivetrain, transmission, severeService });

 return NextResponse.json({
 query: { fuel: fuel ?? null, drivetrain: drivetrain ?? null, transmission: transmission ?? null, severeService },
 count: results.length,
 results,
 disclaimer: 'Interwały są referencyjne. Zawsze stosuj instrukcję serwisową właściwego rocznika i modelu oraz stan techniczny pojazdu.'
 });
}
