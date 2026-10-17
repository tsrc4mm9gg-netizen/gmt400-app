import { NextResponse } from 'next/server';
import { findMaintenance, normalizeMaintenanceValue } from '@/lib/maintenance';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const fuel = normalizeMaintenanceValue(searchParams.get('fuel') ?? undefined);
 const drivetrain = normalizeMaintenanceValue(searchParams.get('drivetrain') ?? undefined);
 const transmission = normalizeMaintenanceValue(searchParams.get('transmission') ?? undefined);
 const severeRaw = searchParams.get('severeService');
 const accepted: Record<string, { value: string; allowed: string[] }> = {
  fuel: { value: fuel, allowed: ['benzyna', 'diesel'] },
  drivetrain: { value: drivetrain, allowed: ['rwd', '4x4'] },
  transmission: { value: transmission, allowed: ['reczna', 'automatyczna'] }
 };
 for (const [parameter, filter] of Object.entries(accepted)) {
  if (filter.value && !filter.allowed.includes(filter.value)) return NextResponse.json({ error: 'Nieprawidłowy parametr: ' + parameter, parameter, allowed: filter.allowed }, { status: 400 });
 }
 if (severeRaw !== null && !['true', 'false'].includes(severeRaw)) return NextResponse.json({ error: 'Parametr severeService musi mieć wartość true lub false.' }, { status: 400 });
 const severeService = severeRaw === 'true';
 const results = findMaintenance({ fuel, drivetrain, transmission, severeService });
 return NextResponse.json({
 query: { fuel: fuel || null, drivetrain: drivetrain || null, transmission: transmission || null, severeService },
 count: results.length, results, scheduleStatus: 'unverified',
 disclaimer: 'To lista czynności do weryfikacji, nie potwierdzony harmonogram serwisowy. Interwały pozostają nieustalone; tryb trudnych warunków nie generuje niezweryfikowanych wartości.'
 });
}
