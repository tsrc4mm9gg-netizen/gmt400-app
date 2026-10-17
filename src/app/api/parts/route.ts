import { NextResponse } from 'next/server';
import { findParts, PART_FITMENTS } from '@/lib/parts-compatibility';
export const dynamic = 'force-dynamic';
const CATALOGS = [
 { title:'Filtry powietrza — FRAM', vehicle:'Chevrolet K1500 Suburban 1999, 4x4', drivetrain:'4x4', url:'https://www.fram.com/engine-air-filters/chevrolet/k1500-suburban/1999' },
 { title:'Filtry oleju — katalog WIX w Summit Racing', vehicle:'Chevrolet K1500 Suburban 1999, 5.7 V8, 4x4', drivetrain:'4x4', url:'https://www.summitracing.com/search/brand/wix-filters/part-type/oil-filters/year/1999/make/chevrolet/model/k1500-suburban/engine-size/5-7l-350' },
 { title:'Filtry oleju — RockAuto', vehicle:'Chevrolet C1500 Suburban 1999, 5.7 V8, 2WD', drivetrain:'2wd', url:'https://www.rockauto.com/en/catalog/chevrolet,1999,c1500+suburban,5.7l+v8,1352988,engine,oil+filter,5340' }
];
export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const model = searchParams.get('model')?.trim() || undefined;
 const engine = searchParams.get('engine')?.trim() || undefined;
 const transmission = searchParams.get('transmission')?.trim() || undefined;
 const drivetrain = searchParams.get('drivetrain')?.trim().toLowerCase() || undefined;
 const yearText = searchParams.get('year')?.trim();
 const year = yearText ? Number(yearText) : undefined;
 if (searchParams.has('year') && (!yearText || !/^\d{4}$/.test(yearText) || !Number.isInteger(year) || year! < 1988 || year! > 2000)) return NextResponse.json({ error:'Rok musi być liczbą całkowitą z zakresu 1988–2000.' }, { status:400 });
 if ([model, engine, transmission].some(value => value && value.length > 80)) return NextResponse.json({ error:'Parametry tekstowe mogą mieć najwyżej 80 znaków.' }, { status:400 });
 if (drivetrain && !['2wd', '4x4'].includes(drivetrain)) return NextResponse.json({ error:'Napęd musi mieć wartość 2wd lub 4x4.' }, { status:400 });
 const allResults = findParts({ model, year, engine, transmission }).map(item => ({ ...item, confidence:'verify' as const, fitmentVerified:false }));
 const results = allResults.filter(item => item.matched);
 const normalize = (value: string | undefined) => (value ?? '').toLowerCase().replace(/\s+/g, '');
 const coveredVehicle = normalize(model) === 'suburban1500' && year === 1999 && ['5.7lv8', '5.7l', '5.7'].includes(normalize(engine));
 const externalCatalogs = coveredVehicle ? CATALOGS.filter(item => !drivetrain || item.drivetrain === drivetrain).map(item => ({ ...item, kind:'external-catalog-link', fitmentVerified:false })) : [];
 return NextResponse.json({
  query:{ model:model ?? null, year:year ?? null, engine:engine ?? null, transmission:transmission ?? null, drivetrain:drivetrain ?? null },
  matchedCount:results.length, results, allResults, matchStatus:'reference-only', externalCatalogs,
  coverage:{ localRecords:PART_FITMENTS.length, completePartsCatalog:false, message:'Baza lokalna zawiera tylko ogólne wpisy o podzespołach i pakietach. Odnośniki zewnętrzne są osobną pomocą, nie wynikami dopasowania części.' },
  disclaimer:'Katalogi zewnętrzne nie są zintegrowanym API ani potwierdzeniem pasowania. Podane odnośniki dotyczą Chevrolet; sprawdź markę, napęd, silnik i numer części w katalogu dostawcy. Dla GMC nie zakładaj identycznego zastosowania.'
 });
}
