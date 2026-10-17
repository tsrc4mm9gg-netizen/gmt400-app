import { NextResponse } from 'next/server';
import { DIAGNOSTIC_CODES } from '@/lib/diagnostics';
export const dynamic = 'force-dynamic';
const normalize = (text:string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').trim();
export async function GET(request:Request) {
 const p = new URL(request.url).searchParams;
 const query = p.get('q')?.trim() ?? '', system = p.get('system')?.trim().toUpperCase() ?? '';
 if (query.length > 500 || (system && !['OBD-I', 'OBD-II'].includes(system))) return NextResponse.json({ error:'Nieprawidłowe zapytanie lub system. Dostępne systemy: OBD-I, OBD-II.' }, { status:400 });
 const tokens = normalize(query).split(/\s+/).filter(Boolean);
 const results = DIAGNOSTIC_CODES.filter(item => {
  if (system && item.system !== system) return false;
  const text = normalize([item.code, item.title, item.description, ...item.commonCauses, ...item.firstChecks].join(' '));
  return tokens.every(token => text.includes(token));
 });
 return NextResponse.json({ query:query || null, system:system || null, count:results.length, results });
}
