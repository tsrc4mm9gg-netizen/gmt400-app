import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const numeric = /^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i;
function num(value:string | null, fallback?:number) { if (value === null) return fallback ?? NaN; const text = value.trim(); return numeric.test(text) ? Number(text.replace(',', '.')) : NaN; }
function reply(value:Record<string, unknown>) { const finite = (item:unknown):boolean => typeof item === 'number' ? Number.isFinite(item) : item !== null && typeof item === 'object' ? Object.values(item).every(finite) : true; return finite(value) ? NextResponse.json(value) : NextResponse.json({ error:'Wynik przekracza zakres obliczeń. Sprawdź dane wejściowe.' }, { status:400 }); }
export async function GET(request:Request) {
 const { searchParams:p } = new URL(request.url);
 const tool = p.get('tool');
 if (tool === 'tire') {
  const width = num(p.get('width')), aspect = num(p.get('aspect')), rim = num(p.get('rim'));
  const oldWidth = num(p.get('oldWidth'), width), oldAspect = num(p.get('oldAspect'), aspect), oldRim = num(p.get('oldRim'), rim);
  const speed = num(p.get('speed'), 0), axleRatio = num(p.get('axleRatio'), 0);
  if (![width, aspect, rim, oldWidth, oldAspect, oldRim, speed, axleRatio].every(Number.isFinite) || [width, aspect, rim, oldWidth, oldAspect, oldRim].some(value => value <= 0) || speed < 0 || (p.has('axleRatio') && axleRatio <= 0)) return NextResponse.json({ error:'Podaj dodatnie wymiary opon i przełożenie osi oraz nieujemną prędkość. Nie pozostawiaj przekazanych pól pustych.' }, { status:400 });
  const newDiameter = rim * 25.4 + 2 * width * aspect / 100;
  const oldDiameter = oldRim * 25.4 + 2 * oldWidth * oldAspect / 100;
  const ratio = newDiameter / oldDiameter;
  return reply({ tool, input:{ width, aspect, rim, oldWidth, oldAspect, oldRim, speed, axleRatio }, newTireDiameterMm:Number(newDiameter.toFixed(1)), oldTireDiameterMm:Number(oldDiameter.toFixed(1)), diameterChangePercent:Number(((ratio - 1) * 100).toFixed(2)), effectiveAxleRatio:axleRatio > 0 ? Number((axleRatio / ratio).toFixed(3)) : null, actualSpeedAtIndicatedSpeed:Number((speed * ratio).toFixed(1)), note:'Obliczenie geometryczne. Efektywne przełożenie maleje przy większej oponie. Nie zastępuje kontroli prześwitu, nośności opon, ET, rozstawu śrub ani homologacji.' });
 }
 if (tool === 'gear-ratio') {
  const tireDiameterInches = num(p.get('tireDiameterInches')), engineRpm = num(p.get('engineRpm')), transmissionRatio = num(p.get('transmissionRatio')), axleRatio = num(p.get('axleRatio'));
  if (![tireDiameterInches, engineRpm, transmissionRatio, axleRatio].every(value => Number.isFinite(value) && value > 0)) return NextResponse.json({ error:'Podaj dodatnie wartości: tireDiameterInches, engineRpm, transmissionRatio, axleRatio.' }, { status:400 });
  const speedMph = engineRpm * tireDiameterInches / (transmissionRatio * axleRatio * 336.13);
  return reply({ tool, input:{ tireDiameterInches, engineRpm, transmissionRatio, axleRatio }, speedMph:Number(speedMph.toFixed(1)), speedKmh:Number((speedMph * 1.609344).toFixed(1)), note:'Obliczenie teoretyczne bez poślizgu konwertera i rzeczywistej średnicy opony pod obciążeniem.' });
 }
 if (tool === 'compression-ratio') {
  const cylinderVolumeCc = num(p.get('cylinderVolumeCc')), combustionChamberCc = num(p.get('combustionChamberCc')), pistonDomeCc = num(p.get('pistonDomeCc'), 0), gasketVolumeCc = num(p.get('gasketVolumeCc'), 0);
  if (![cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc].every(Number.isFinite) || cylinderVolumeCc <= 0 || combustionChamberCc <= 0 || gasketVolumeCc < 0) return NextResponse.json({ error:'Objętości cylindra i komory muszą być dodatnie, objętość uszczelki nieujemna. Dla zagłębienia tłoka podaj ujemne pistonDomeCc.' }, { status:400 });
  const clearance = combustionChamberCc + gasketVolumeCc - pistonDomeCc;
  if (!Number.isFinite(clearance) || clearance <= 0) return NextResponse.json({ error:'Objętość przestrzeni spalania musi być skończona i większa od zera.' }, { status:400 });
  return reply({ tool, input:{ cylinderVolumeCc, combustionChamberCc, pistonDomeCc, gasketVolumeCc }, compressionRatio:Number(((cylinderVolumeCc + clearance) / clearance).toFixed(2)), clearanceVolumeCc:Number(clearance.toFixed(2)), note:'Obliczenie uproszczone. pistonDomeCc to objętość wypukłości tłoka; dla zagłębienia podaj wartość ujemną. Nie uwzględnia osobno wysokości tłoka względem bloku.' });
 }
 if (tool !== null) return NextResponse.json({ error:'Nieznany kalkulator. Dostępne: tire, gear-ratio, compression-ratio.' }, { status:400 });
 return NextResponse.json({ tools:['tire', 'gear-ratio', 'compression-ratio'], examples:{ tire:'/api/calculators?tool=tire&width=265&aspect=75&rim=16&oldWidth=235&oldAspect=75&oldRim=16&speed=60&axleRatio=3.73', gearRatio:'/api/calculators?tool=gear-ratio&tireDiameterInches=31.6&engineRpm=2000&transmissionRatio=1&axleRatio=3.73', compressionRatio:'/api/calculators?tool=compression-ratio&cylinderVolumeCc=716&combustionChamberCc=64' } });
}
