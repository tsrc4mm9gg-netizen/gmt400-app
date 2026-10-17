import { NextResponse } from 'next/server';
import { RPO_CATALOG } from '@/lib/rpo-catalog';
import { PART_FITMENTS } from '@/lib/parts-compatibility';
import { MAINTENANCE_ITEMS } from '@/lib/maintenance';
import { FLUID_SPECS } from '@/lib/fluids';

export const dynamic = 'force-static';

export async function GET() {
 const rpoCodes = new Set(RPO_CATALOG.map(item => item.code));
 const categories = [...new Set(RPO_CATALOG.map(item => item.category))].sort();

 return NextResponse.json({
 status: 'ok',
 service: 'GMT400 Knowledge API',
 version: '1.0.0',
 data: {
 rpoRecords: RPO_CATALOG.length,
 uniqueRpoCodes: rpoCodes.size,
 rpoCategories: categories,
 partFitments: PART_FITMENTS.length,
 maintenanceItems: MAINTENANCE_ITEMS.length,
 fluidSpecifications: FLUID_SPECS.length
 },
 endpoints: {
 rpoSearch: '/api/rpo?q=Z71',
 rpoCategory: '/api/rpo?category=Osie',
 parts: '/api/parts?model=Tahoe&year=1997',
 maintenance: '/api/maintenance?fuel=benzyna&drivetrain=4x4',
 fluids: '/api/fluids?system=olej&powertrain=5.7l',
 units: '/api/units?type=pressure&value=32',
 vinValidation: '/api/vin/validate?vin=YOUR17CHARVIN'
 },
 disclaimer: 'Dane są referencyjne. Nie zastępują instrukcji serwisowej, tabliczki pojazdu ani homologacji.'
 });
}
