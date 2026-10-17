import { NextResponse } from 'next/server';
import { RPO_CATALOG } from '@/lib/rpo-catalog';
import { PART_FITMENTS } from '@/lib/parts-compatibility';
import { MAINTENANCE_ITEMS } from '@/lib/maintenance';
import { FLUID_SPECS } from '@/lib/fluids';
import { DIAGNOSTIC_CODES } from '@/lib/diagnostics';
export const dynamic = 'force-dynamic';
export async function GET() {
 return NextResponse.json({
  status:'ok',service:'GMT400 Knowledge API',version:'1.7.0',deployment:{ commitSha:process.env.VERCEL_GIT_COMMIT_SHA || null },
  data:{rpoRecords:RPO_CATALOG.length,uniqueRpoCodes:new Set(RPO_CATALOG.map(item => item.code)).size,rpoCategories:[...new Set(RPO_CATALOG.map(item => item.category))].sort(),partFitments:PART_FITMENTS.length,maintenanceItems:MAINTENANCE_ITEMS.length,fluidSpecifications:FLUID_SPECS.length,diagnosticCodes:DIAGNOSTIC_CODES.length},
  pages:{tools:'/narzedzia',rpo:'/narzedzia/rpo',calculators:'/narzedzia/kalkulatory',diagnostics:'/narzedzia/diagnostyka',parts:'/narzedzia/czesci'},
  endpoints:{rpoSearch:'/api/rpo?q=Z71',rpoCategory:'/api/rpo?category=Osie',parts:'/api/parts?model=Tahoe&year=1997',maintenance:'/api/maintenance?fuel=benzyna&drivetrain=4x4',fluids:'/api/fluids?system=olej&powertrain=5.7l',diagnostics:'/api/diagnostics?q=P0300',calculators:'/api/calculators?tool=tire&width=265&aspect=75&rim=16',units:'/api/units?type=pressure&value=32',vinValidation:'/api/vin/validate?vin=YOUR17CHARVIN'},
  disclaimer:'Dane są referencyjne. Nie zastępują skanera diagnostycznego, instrukcji serwisowej, tabliczki pojazdu ani homologacji.'
 },{headers:{'Cache-Control':'no-store'}});
}
