import { NextResponse } from 'next/server';
import { RPO_CATALOG, decodeRpo } from '@/lib/rpo-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const query = searchParams.get('q')?.trim() ?? '';
 const category = searchParams.get('category')?.trim() ?? '';
 const limit = Math.min(Number(searchParams.get('limit') ?? 50) || 50, 200);

 if (!query && !category) {
 return NextResponse.json({ query, category: null, count: RPO_CATALOG.length, results: [] });
 }

 const decoded = query ? decodeRpo(query) : null;
 const lower = query.toLowerCase();
 const upper = query.toUpperCase();
 const tokenSet = new Set(decoded?.tokens ?? []);

 const results = RPO_CATALOG.filter(entry => {
 const categoryOk = !category || entry.category === category;
 if (!categoryOk) return false;
 if (!query) return true;
 return tokenSet.has(entry.code) || entry.code.includes(upper) || entry.description.toLowerCase().includes(lower) || entry.original.toLowerCase().includes(lower);
 }).slice(0, limit);

 return NextResponse.json({
 query: query || null,
 category: category || null,
 tokens: decoded?.tokens ?? [],
 invalidTokens: decoded?.invalid ?? [],
 ratioConflict: decoded?.ratioConflict ?? false,
 count: results.length,
 results
 });
}
