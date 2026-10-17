import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const INCH_TO_MM = 25.4;

function tireDiameterMm(widthMm: number, aspectRatio: number, rimInches: number) {
 return rimInches * INCH_TO_MM + 2 * (widthMm * aspectRatio / 100);
}

export async function GET(request: Request) {
 const { searchParams } = new URL(request.url);
 const tool = searchParams.get('tool');

 if (tool === 'tire') {
 const width = Number(searchParams.get('width'));
 const aspect = Number(searchParams.get('aspect'));
 const rim = Number(searchParams.get('rim'));
 const oldWidth = Number(searchParams.get('oldWidth') ?? width);
 const oldAspect = Number(searchParams.get('oldAspect') ?? aspect);
 const oldRim = Number(searchParams.get('oldRim') ?? rim);
 const speed = Number(searchParams.get('speed') ?? 0);
 const axleRatio = Number(searchParams.get('axleRatio') ?? 0);

 if (![width, aspect, rim, oldWidth, oldAspect, oldRim].every(Number.isFinite) || width <= 0 || aspect <= 0 || rim <= 0 || oldWidth <= 0 || oldAspect <= 0 || oldRim <= 0) {
 return NextResponse.json({ error: 'Podaj prawidłowe wymiary opon: width, aspect, rim.' }, { status: 400 });
 }

 const newDiameter = tireDiameterMm(width, aspect, rim);
 const oldDiameter = tireDiameterMm(oldWidth, oldAspect, oldRim);
 const diameterChangePercent = (newDiameter / oldDiameter - 1) * 100;
 const effectiveAxleRatio = axleRatio > 0 ? axleRatio * (newDiameter / oldDiameter) : null;
 const speedAtSameEngine = speed > 0 && axleRatio > 0 ? speed * (newDiameter / oldDiameter) : null;

 return NextResponse.json({
 tool: 'tire',
 input: { width, aspect, rim, oldWidth, oldAspect, oldRim, speed, axleRatio },
 newTireDiameterMm: Number(newDiameter.toFixed(1)),
 oldTireDiameterMm: Number(oldDiameter.toFixed(1)),
 diameterChangePercent: Number(diameterChangePercent.toFixed(2)),
 effectiveAxleRatio: effectiveAxleRatio ? Number(effectiveAxleRatio.toFixed(3)) : null,
 indicatedSpeedAtSameEngineRpm: speedAtSameEngine ? Number(speedAtSameEngine.toFixed(1)) : null,
 note: 'Obliczenie geometryczne. Nie zastępuje kontroli prześwitu, nośności opon, ET, rozstawu śrub ani homologacji.'
 });
 }

 if (tool === 'gear-ratio') {
 const tireDiameterInches = Number(searchParams.get('tireDiameterInches'));
 const engineRpm = Number(searchParams.get('engineRpm'));
 const transmissionRatio = Number(searchParams.get('transmissionRatio'));
 const axleRatio = Number(searchParams.get('axleRatio'));

 if (![tireDiameterInches, engineRpm, transmissionRatio, axleRatio].every(Number.isFinite) || tireDiameterInches <= 0 || engineRpm <= 0 || transmissionRatio <= 0 || axleRatio <= 0) {
 return NextResponse.json({ error: 'Podaj dodatnie wartości: tireDiameterInches, engineRpm, transmissionRatio, axleRatio.' }, { status: 400 });
 }

 const speedMph = (engineRpm * tireDiameterInches) / (transmissionRatio * axleRatio * 336.13);
 const speedKmh = speedMph * 1.609344;

 return NextResponse.json({
 tool: 'gear-ratio',
 input: { tireDiameterInches, engineRpm, transmissionRatio, axleRatio },
 speedMph: Number(speedMph.toFixed(1)),
 speedKmh: Number(speedKmh.toFixed(1)),
 note: 'Obliczenie teoretyczne bez poślizgu konwertera i rzeczywistej średnicy opony pod obciążeniem.'
 });
 }

 if (tool === 'compression-ratio') {
 const cylinderVolumeCc = Number(searchParams.get('cylinderVolumeCc'));
 const combustionChamberCc = Number(searchParams.get('combustionChamberCc'));
 const pistonDomeCc = Number(searchParams.get('pistonDomeCc') ?? 0);
 const gasketVolumeCc = Number(searchParams.get('gasketVolumeCc') ?? 0);

 if (![cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc].every(Number.isFinite) || cylinderVolumeCc <= 0 || combustionChamberCc < 0) {
 return NextResponse.json({ error: 'Podaj prawidłowe wartości objętości w cm³.' }, { status: 400 });
 }

 const clearanceVolume = combustionChamberCc + pistonDomeCc + gasketVolumeCc;
 if (clearanceVolume <= 0) {
 return NextResponse.json({ error: 'Objętość przestrzeni spalania musi być większa od zera.' }, { status: 400 });
 }

 const ratio = (cylinderVolumeCc + clearanceVolume) / clearanceVolume;
 return NextResponse.json({
 tool: 'compression-ratio',
 input: { cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc },
 compressionRatio: Number(ratio.toFixed(2)),
 clearanceVolumeCc: Number(clearanceVolume.toFixed(2)),
 note: 'Obliczenie uproszczone. Rzeczywisty stopień sprężania zależy od ustawienia tłoków, uszczelki i wypełnienia komory spalania.'
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
