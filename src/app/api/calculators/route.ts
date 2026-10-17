import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const INCH_TO_MM = 25.4;
const tireDiameterMm = (widthMm: number, aspect: number, rimInches: number) => rimInches * INCH_TO_MM + 2 * (widthMm * aspect / 100);
const num = (value: string | null, fallback?: number) => value === null || value.trim() === '' ? (fallback ?? NaN) : Number(value);

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const tool = searchParams.get('tool');

 if (tool === 'tire') {
 const width = num(searchParams.get('width'));
 const aspect = num(searchParams.get('aspect'));
 const rim = num(searchParams.get('rim'));
 const oldWidth = num(searchParams.get('oldWidth'), width);
 const oldAspect = num(searchParams.get('oldAspect'), aspect);
 const oldRim = num(searchParams.get('oldRim'), rim);
 const speed = num(searchParams.get('speed'), 0);
 const axleRatio = num(searchParams.get('axleRatio'), 0);

 if (![width, aspect, rim, oldWidth, oldAspect, oldRim, speed, axleRatio].every(Number.isFinite) || [width, aspect, rim, oldWidth, oldAspect, oldRim].some(value => value <= 0)) {
 return NextResponse.json({ error: 'Podaj prawidłowe wymiary opon: width, aspect, rim.' }, { status: 400 });
 }

 const newDiameter = tireDiameterMm(width, aspect, rim);
 const oldDiameter = tireDiameterMm(oldWidth, oldAspect, oldRim);
 const ratio = newDiameter / oldDiameter;

 return NextResponse.json({
 tool: 'tire',
 input: { width, aspect, rim, oldWidth, oldAspect, oldRim, speed, axleRatio },
 newTireDiameterMm: Number(newDiameter.toFixed(1)),
 oldTireDiameterMm: Number(oldDiameter.toFixed(1)),
 diameterChangePercent: Number(((ratio - 1) * 100).toFixed(2)),
 effectiveAxleRatio: axleRatio > 0 ? Number((axleRatio / ratio).toFixed(3)) : null,
 actualSpeedAtIndicatedSpeed: speed > 0 ? Number((speed * ratio).toFixed(1)) : null,
 note: 'Obliczenie geometryczne. Efektywne przełożenie maleje przy większej oponie. Nie zastępuje kontroli prześwitu, nośności opon, ET, rozstawu śrub ani homologacji.'
 });
 }

 if (tool === 'gear-ratio') {
 const tireDiameterInches = num(searchParams.get('tireDiameterInches'));
 const engineRpm = num(searchParams.get('engineRpm'));
 const transmissionRatio = num(searchParams.get('transmissionRatio'));
 const axleRatio = num(searchParams.get('axleRatio'));

 if (![tireDiameterInches, engineRpm, transmissionRatio, axleRatio].every(value => Number.isFinite(value) && value > 0)) {
 return NextResponse.json({ error: 'Podaj dodatnie wartości: tireDiameterInches, engineRpm, transmissionRatio, axleRatio.' }, { status: 400 });
 }

 const speedMph = (engineRpm * tireDiameterInches) / (transmissionRatio * axleRatio * 336.13);
 return NextResponse.json({
 tool: 'gear-ratio',
 input: { tireDiameterInches, engineRpm, transmissionRatio, axleRatio },
 speedMph: Number(speedMph.toFixed(1)),
 speedKmh: Number((speedMph * 1.609344).toFixed(1)),
 note: 'Obliczenie teoretyczne bez poślizgu konwertera i rzeczywistej średnicy opony pod obciążeniem.'
 });
 }

 if (tool === 'compression-ratio') {
 const cylinderVolumeCc = num(searchParams.get('cylinderVolumeCc'));
 const combustionChamberCc = num(searchParams.get('combustionChamberCc'));
 const pistonDomeCc = num(searchParams.get('pistonDomeCc'), 0);
 const gasketVolumeCc = num(searchParams.get('gasketVolumeCc'), 0);

 if (![cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc].every(Number.isFinite) || cylinderVolumeCc <= 0 || combustionChamberCc < 0) {
 return NextResponse.json({ error: 'Podaj prawidłowe wartości objętości w cm³.' }, { status: 400 });
 }

 const clearance = combustionChamberCc + gasketVolumeCc - pistonDomeCc;
 if (clearance <= 0) {
 return NextResponse.json({ error: 'Objętość przestrzeni spalania musi być większa od zera.' }, { status: 400 });
 }

 return NextResponse.json({
 tool: 'compression-ratio',
 input: { cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc },
 compressionRatio: Number(((cylinderVolumeCc + clearance) / clearance).toFixed(2)),
 clearanceVolumeCc: Number(clearance.toFixed(2)),
 note: 'Obliczenie uproszczone. pistonDomeCc to objętość wypukłości tłoka (zmniejsza przestrzeń spalania); dla zagłębienia podaj wartość ujemną.'
 });
 }

 return NextResponse.json({
 tools: ['tire', 'gear-ratio', 'compression-ratio'],
 examples: {
 tire: '/api/calculators?tool=tire&width=265&aspect=75&rim=16&oldWidth=235&oldAspect=75&oldRim=16&speed=60&axleRatio=3.73',
 gearRatio: '/api/calculators?tool=gear-ratio&tireDiameterInches=31.6&engineRpm=2000&transmissionRatio=1&axleRatio=3.73',
 compressionRatio: '/api/calculators?tool=compression-ratio&cylinderVolumeCc=716&combustionChamberCc=64'
 }
 });
}
