import { NextResponse } from 'next/server';
export const maxDuration = 15;
export async function GET(request: Request) {
 const code = (new URL(request.url).searchParams.get('currency') || '').toUpperCase();
 if (!['USD', 'EUR'].includes(code)) return NextResponse.json({ error: 'Wybierz USD lub EUR.' }, { status: 400 });
 const source = 'https://api.nbp.pl/api/exchangerates/rates/a/' + code.toLowerCase() + '/?format=json';
 try {
  const response = await fetch(source, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000), next: { revalidate: 3600 } });
  if (!response.ok) throw new Error('provider');
  const data = await response.json(); const row = data?.rates?.[0];
  if (data?.code !== code || data?.table !== 'A' || typeof row?.mid !== 'number' || !Number.isFinite(row.mid) || row.mid <= 0 || typeof row?.no !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row?.effectiveDate || '')) throw new Error('schema');
  return NextResponse.json({ currency: code, rate: row.mid, effectiveDate: row.effectiveDate, tableNumber: row.no, source, fetchedAt: new Date().toISOString(), note: 'Ostatni opublikowany kurs średni NBP. Cache odpowiedzi dostawcy do 1 godziny.' }, { headers: { 'Cache-Control': 'no-store' } });
 } catch { return NextResponse.json({ error: 'Nie udało się pobrać kursu NBP. Możesz wpisać kurs ręcznie; nie podstawiamy kursu zastępczego.' }, { status: 502, headers: { 'Cache-Control': 'no-store' } }); }
}
