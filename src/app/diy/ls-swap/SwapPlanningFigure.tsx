const figures: Record<string, { title: string; summary: string; labels: string[]; type: 'fitment' | 'electrical' | 'fuel' }> = {
  'mocowania-i-miska': {
    title: 'Punkty kontroli przymiarki: 2WD i 4WD',
    summary: 'Porównanie obszarów, które trzeba zmierzyć i sprawdzić przy przymiarce zespołu napędowego. Ilustracja nie pokazuje rzeczywistej geometrii, wymiarów ani zgodności części.',
    labels: ['Pozycja silnika i skrzyni', 'Miska, smok i prześwit', 'Osprzęt oraz klimatyzacja', 'Kolektory i elementy ramy'],
    type: 'fitment',
  },
  elektryka: {
    title: 'Mapa planowania integracji elektrycznej',
    summary: 'Przepływ planowania od identyfikacji auta i dawcy do kontroli diagnostyki. To nie jest schemat połączeń, pinout ani instrukcja obejścia zabezpieczeń.',
    labels: ['Identyfikacja auta i dawcy', 'Schematy właściwych roczników', 'Plan obwodów i zabezpieczeń', 'PCM, skrzynia i konfiguracja', 'Diagnostyka oraz odbiór'],
    type: 'electrical',
  },
  paliwo: {
    title: 'Mapa kontroli układu paliwowego',
    summary: 'Zakres weryfikacji doboru i testów. Grafika nie wskazuje średnic, ciśnień uniwersalnych ani trasy prowadzenia przewodów.',
    labels: ['Specyfikacja silnika i listwy', 'Pompa i regulator', 'Przewody oraz złącza', 'Test szczelności i pomiar'],
    type: 'fuel',
  },
};

const textAttrs = { fill: '#f4f4f5', fontFamily: 'system-ui, sans-serif' };
const mutedText = { fill: '#cbd5e1', fontFamily: 'system-ui, sans-serif' };
const panel = '#18181b';
const stroke = '#52525b';
const amber = '#fbbf24';

function Fitment({ labels }: { labels: string[] }) {
  return <svg viewBox="0 0 760 410" role="img" className="block h-auto w-full" xmlns="http://www.w3.org/2000/svg">
    <title>Punkty kontroli przymiarki dla 2WD i 4WD</title>
    <desc>Autorska infografika porównuje obszary przymiarki. Nie przedstawia wymiarów ani rzeczywistej geometrii pojazdu.</desc>
    <rect width="760" height="410" rx="20" fill="#09090b"/>
    <text x="32" y="42" fontSize="15" fill={amber} fontFamily="system-ui, sans-serif">OBS / GMT400 · SCHEMAT PLANISTYCZNY</text>
    {[{x:24,title:'2WD',sub:'Rama C'}, {x:390,title:'4WD',sub:'Rama K · przedni napęd'}].map((col,i)=><g key={col.title}>
      <rect x={col.x} y="64" width="346" height="314" rx="16" fill={panel} stroke={stroke}/>
      <text x={col.x+22} y="100" fontSize="24" fontWeight="700" {...textAttrs}>{col.title}</text>
      <text x={col.x+22} y="124" fontSize="14" {...mutedText}>{col.sub}</text>
      <path d={`M${col.x+50} 244 H${col.x+296} M${col.x+78} 226 V290 M${col.x+268} 226 V290`} stroke="#a1a1aa" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <path d={`M${col.x+105} 193 H${col.x+241} L${col.x+225} 248 H${col.x+123} Z`} fill="#3f3f46" stroke="#d4d4d8" strokeWidth="2"/>
      <path d={`M${col.x+136} 248 V269 H${col.x+212} V248`} fill="#713f12" stroke={amber} strokeWidth="2"/>
      {i===1 && <><circle cx={col.x+299} cy="274" r="28" fill="#27272a" stroke={amber} strokeWidth="3"/><path d={`M${col.x+102} 267 H${col.x+269}`} stroke={amber} strokeWidth="2" strokeDasharray="6 5"/><text x={col.x+299} y="278" textAnchor="middle" fontSize="10" {...textAttrs}>FRONT</text></>}
      <text x={col.x+22} y="316" fontSize="14" {...mutedText}>{labels[0]}</text>
      <text x={col.x+22} y="339" fontSize="14" {...mutedText}>{labels[1]}</text>
      <text x={col.x+22} y="362" fontSize="14" {...mutedText}>{i===1 ? labels[3] : labels[2]}</text>
    </g>)}
  </svg>;
}

function Electrical({ labels }: { labels: string[] }) {
  const boxes = [
    {x:24,y:94,w:210,h:88,label:labels[0],sub:'VIN · RPO · sterownik'},
    {x:274,y:94,w:210,h:88,label:labels[1],sub:'Rocznik i wariant'},
    {x:524,y:94,w:210,h:88,label:labels[2],sub:'Zasilanie · masy · sygnały'},
    {x:150,y:252,w:210,h:88,label:labels[3],sub:'PCM · skrzynia · kalibracja'},
    {x:400,y:252,w:210,h:88,label:labels[4],sub:'MIL · OBD · wskaźniki'},
  ];
  return <svg viewBox="0 0 760 390" role="img" className="block h-auto w-full" xmlns="http://www.w3.org/2000/svg">
    <title>Mapa planowania integracji elektrycznej</title>
    <desc>Proces rozpoczyna się od identyfikacji pojazdów i schematów, następnie obejmuje plan obwodów oraz konfigurację PCM i końcową diagnostykę. Nie pokazuje połączeń ani pinów.</desc>
    <rect width="760" height="390" rx="20" fill="#09090b"/>
    <text x="30" y="42" fontSize="15" fill={amber} fontFamily="system-ui, sans-serif">INTEGRACJA · PLAN KONTROLI · BEZ PINOUTÓW</text>
    <path d="M234 138 H268 M484 138 H518 M629 188 V220 H255 V246 M360 296 H394" fill="none" stroke={amber} strokeWidth="3" strokeDasharray="7 5"/>
    {boxes.map((b,i)=><g key={b.label}>
      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="14" fill={panel} stroke={i===4?amber:stroke} strokeWidth={i===4?2:1.5}/>
      <circle cx={b.x+22} cy={b.y+24} r="13" fill={amber}/>
      <text x={b.x+22} y={b.y+29} textAnchor="middle" fontSize="13" fontWeight="700" fill="#18181b" fontFamily="system-ui, sans-serif">{i+1}</text>
      <text x={b.x+18} y={b.y+52} fontSize="14" fontWeight="650" {...textAttrs}>{b.label}</text>
      <text x={b.x+18} y={b.y+73} fontSize="12" {...mutedText}>{b.sub}</text>
    </g>)}
  </svg>;
}

function Fuel({ labels }: { labels: string[] }) {
  return <svg viewBox="0 0 760 340" role="img" className="block h-auto w-full" xmlns="http://www.w3.org/2000/svg">
    <title>Mapa kontroli układu paliwowego</title>
    <desc>Od specyfikacji dawcy przechodzi się do pompy i regulatora, sprawdzenia przewodów oraz pomiaru szczelności. Nie wskazuje prowadzenia instalacji.</desc>
    <rect width="760" height="340" rx="20" fill="#09090b"/>
    <text x="30" y="42" fontSize="15" fill={amber} fontFamily="system-ui, sans-serif">UKŁAD PALIWOWY · DOBÓR I WERYFIKACJA</text>
    <path d="M100 160 H660" stroke="#71717a" strokeWidth="5" strokeLinecap="round"/>
    {labels.map((label,i)=>{
      const x=100+i*186;
      return <g key={label}>
        <circle cx={x} cy="160" r="35" fill="#27272a" stroke={i===3?amber:'#a1a1aa'} strokeWidth="3"/>
        <text x={x} y="168" textAnchor="middle" fontSize="20" fontWeight="700" fill={amber} fontFamily="system-ui, sans-serif">{i+1}</text>
        <rect x={x-82} y="218" width="164" height="78" rx="12" fill={panel} stroke={stroke}/>
        <text x={x} y="248" textAnchor="middle" fontSize="13" fontWeight="600" {...textAttrs}>{label}</text>
        <text x={x} y="273" textAnchor="middle" fontSize="11" {...mutedText}>{['odczytaj dane','dobierz elementy','sprawdź zgodność','zmierz i skontroluj'][i]}</text>
      </g>;
    })}
  </svg>;
}

export default function SwapPlanningFigure({ etap }: { etap: string }) {
  const diagram = figures[etap];
  if (!diagram) return null;
  const id = `swap-figure-${etap}`;
  return <figure aria-labelledby={`${id}-caption`} className="rounded-2xl border border-white/10 bg-neutral-950 p-3 sm:p-5">
    <div className="overflow-x-auto" role="region" aria-label={`${diagram.title} — grafika przewijana poziomo na małym ekranie`} tabIndex={0}>
      <div className="min-w-[620px]">{diagram.type==='fitment' ? <Fitment labels={diagram.labels}/> : diagram.type==='electrical' ? <Electrical labels={diagram.labels}/> : <Fuel labels={diagram.labels}/>}</div>
    </div>
    <figcaption id={`${id}-caption`} className="mt-3 text-sm leading-relaxed text-neutral-300"><span className="font-semibold">{diagram.title}.</span> Autorska grafika poglądowa GMT400. Nie jest rysunkiem wymiarowym, schematem połączeń ani potwierdzeniem dopasowania części.</figcaption>
    <details className="mt-3 text-sm text-neutral-300"><summary className="min-h-11 cursor-pointer rounded py-3 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">Opis grafiki tekstem</summary><p className="mt-2">{diagram.summary}</p><ol className="mt-3 list-decimal space-y-1 pl-5">{diagram.labels.map(label=><li key={label}>{label}</li>)}</ol></details>
  </figure>;
}
