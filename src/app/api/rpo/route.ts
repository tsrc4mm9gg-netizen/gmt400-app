import { NextResponse } from 'next/server';
import { RPO_CATALOG, decodeRpo } from '@/lib/rpo-catalog';

export const dynamic = 'force-static';

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const query = searchParams.get('q')?.trim() ?? '';
 const category = searchParams.get('category')?.trim() ?? '';
 const limit = Math.min(Number(searchParams.get('limit') ?? 50) || 50, 200);

 if (!query && !category) {
 return NextResponse.json({ query, category: category || null, count: RPO_CATALOG.length, results: [] });
 }

 if (query) {
 const decoded = decodeRpo(query);
 const exact = decoded.matches.filter(match => match.entries.length > 0);
 const normalizedQuery = query.toUpperCase();
 const searchResults = RPO_CATALOG.filter(entry =>
 entry.code.includes(normalizedQuery) ||
 entry.description.toLowerCase().includes(query.toLowerCase()) ||
 entry.original.toLowerCase().includes(query.toLowerCase())
 ).slice(0, limit);

 return NextResponse.json({
 query,
 tokens: decoded.tokens,
 invalidTokens: decoded.invalid,
 ratioConflict: decoded.ratioConflict,
 exactMatches: exact,
 results: searchResults,
 count: searchResults.length
 });
 }

 const results = RPO_CATALOG.filter(entry => entry.category === category).slice(0, limit);
 return NextResponse.json({ query: null, category, results, count: results.length });
}
