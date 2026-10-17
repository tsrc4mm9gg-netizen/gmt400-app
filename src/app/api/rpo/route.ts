import { NextResponse } from 'next/server';
import { RPO_CATALOG, decodeRpo } from '@/lib/rpo-catalog';
export const dynamic = 'force-dynamic';
export async function GET(request:Request) {
 const p = new URL(request.url).searchParams;
 const query = p.get('q')?.trim() ?? '', category = p.get('category')?.trim() ?? '';
 const rawLimit = p.get('limit');
 const limit = rawLimit === null ? 50 : /^\d+$/.test(rawLimit) ? Number(rawLimit) : NaN;
 if (!Number.isInteger(limit) || limit < 1 || limit > 200) return NextResponse.json({ error:'Limit musi być liczbą całkowitą od 1 do 200.' }, { status:400 });
 if (query.length > 1200 || category.length > 80) return NextResponse.json({ error:'Zapytanie jest zbyt długie.' }, { status:400 });
 if (!query && !category) return NextResponse.json({ query, category:null, count:RPO_CATALOG.length, results:[] });
 const decoded = query ? decodeRpo(query) : null;
 const lower = query.toLowerCase(), upper = query.toUpperCase();
 const tokenSet = new Set(decoded?.tokens ?? []);
 const results = RPO_CATALOG.filter(entry => (!category || entry.category === category) && (!query || tokenSet.has(entry.code) || entry.code.includes(upper) || entry.description.toLowerCase().includes(lower) || entry.original.toLowerCase().includes(lower))).slice(0, limit);
 return NextResponse.json({ query:query || null, category:category || null, tokens:decoded?.tokens ?? [], invalidTokens:decoded?.invalid ?? [], ratioConflict:decoded?.ratioConflict ?? false, count:results.length, results });
}
