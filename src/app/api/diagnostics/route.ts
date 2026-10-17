import { NextResponse } from 'next/server';
import { DIAGNOSTIC_CODES, findDiagnosticCodes } from '@/lib/diagnostics';

export const dynamic = 'force-static';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const query = searchParams.get('q')?.trim() ?? '';
 const system = searchParams.get('system')?.trim() ?? '';

 if (query) {
 const results = findDiagnosticCodes(query);
 return NextResponse.json({ query, count: results.length, results });
 }

 if (system) {
 const results = DIAGNOSTIC_CODES.filter(item => item.system.toLowerCase() === system.toLowerCase());
 return NextResponse.json({ query: null, system, count: results.length, results });
 }

 return NextResponse.json({ query: null, system: null, count: DIAGNOSTIC_CODES.length, results: DIAGNOSTIC_CODES });
}
