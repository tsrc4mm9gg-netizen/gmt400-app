import Link from 'next/link';
import type { CSSProperties } from 'react';

const TOOLS = [
 { href: '/narzedzia/rpo', title: 'Kody RPO', tag: 'Wyposażenie pojazdu', description: 'Odczytaj kody z tabliczki i sprawdź ich znaczenie po polsku. Możesz wpisać kilka kodów naraz.', example: 'Na przykład: G80, Z71, GU5', icon: 'M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3M9 3h6v4H9zM8 12h8M8 16h6' },
 { href: '/narzedzia/diagnostyka', title: 'Kody błędów OBD', tag: 'Diagnostyka', description: 'Sprawdź znaczenie kodu ze skanera, możliwe przyczyny i pierwsze czynności diagnostyczne.', example: 'Na przykład: P0300 lub P0171', icon: 'M5 4h14v12H5zM9 20h6M12 16v4M8 10h2l1-3 2 6 1-3h2' },
 { href: '/narzedzia/kalkulatory', title: 'Kalkulator opon', tag: 'Opony i przełożenia', description: 'Porównaj obecne i planowane opony. Oblicz zmianę średnicy oraz wpływ na prędkość i przełożenie osi.', example: 'Na przykład: 235/75 R16 → 265/75 R16', icon: 'M4 5h16v14H4zM4 10h16M10 10v9M7 7h1M13 14h4M15 12v4' },
 { href: '/narzedzia/czesci', title: 'Dobór części', tag: 'Wstępna weryfikacja', description: 'Przejrzyj referencyjne informacje według modelu, rocznika, silnika i skrzyni. Przed zakupem potwierdź numer części.', example: 'Wynik nie potwierdza zamienności części.', icon: 'M14 4a6 6 0 0 0-7 8l-4 4a3 3 0 0 0 5 5l4-4a6 6 0 0 0 8-7l-4 3-4-4z' }
];
const s: Record<string, CSSProperties> = {
 page: { boxSizing:'border-box', width:'100%', maxWidth:1000, minWidth:0, margin:'0 auto', padding:'20px 16px calc(100px + env(safe-area-inset-bottom, 0px))', background:'#0a0a0a', color:'#ededed', fontFamily:'var(--font-geist-sans), system-ui, sans-serif' },
 header: { position:'static', display:'block', width:'100%', minWidth:0, margin:'0 0 22px', padding:0, border:0, background:'transparent' },
 back: { display:'inline-flex', alignItems:'center', minHeight:44, margin:'0 0 14px', color:'#fca5a5', fontSize:14, lineHeight:1.5, textDecoration:'underline' },
 eyebrow: { display:'block', margin:'0 0 8px', color:'#dc2626', fontSize:11, fontWeight:700, lineHeight:1.5, letterSpacing:'.1em' },
 title: { display:'block', margin:'0 0 10px', color:'#fafafa', fontSize:'clamp(26px, 5vw, 36px)', fontWeight:750, lineHeight:1.2 },
 intro: { display:'block', maxWidth:650, margin:0, color:'#c7ccd3', fontSize:14, lineHeight:1.65 },
 grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', alignItems:'stretch', gap:14, width:'100%', minWidth:0, margin:0, padding:0 },
 card: { boxSizing:'border-box', position:'relative', display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'flex-start', width:'100%', maxWidth:'100%', minWidth:0, margin:0, padding:20, border:'1px solid #46505d', borderLeft:'3px solid #dc2626', borderRadius:10, background:'#171d25', color:'#ededed', textAlign:'left', textDecoration:'none', whiteSpace:'normal', overflowWrap:'anywhere' },
 icon: { display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto', width:36, height:36, margin:'0 0 10px', border:'1px solid #7a3434', borderRadius:8, background:'#301c1c', color:'#fca5a5' },
 tag: { display:'block', margin:'0 0 5px', color:'#c9b78f', fontSize:11, fontWeight:650, lineHeight:1.5 },
 cardTitle: { display:'block', width:'100%', margin:'0 0 8px', padding:0, color:'#fca5a5', fontSize:21, fontWeight:700, lineHeight:1.3, textWrap:'initial', whiteSpace:'normal' },
 description: { display:'block', width:'100%', maxWidth:'100%', margin:'0 0 8px', color:'#e0e5ec', fontSize:14, lineHeight:1.65, whiteSpace:'normal', overflowWrap:'anywhere' },
 example: { display:'block', width:'100%', maxWidth:'100%', margin:'0 0 12px', color:'#bdc6d2', fontSize:12, lineHeight:1.6 },
 action: { boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', minHeight:44, margin:'auto 0 0', padding:'10px 0 0', borderTop:'1px solid #46505d', color:'#fca5a5', fontSize:14, fontWeight:650, lineHeight:1.5 },
 notice: { boxSizing:'border-box', display:'block', width:'100%', margin:'18px 0 0', padding:'14px 16px', border:'1px solid #343a43', borderRadius:10, background:'#101317' },
 noticeTitle: { display:'block', margin:'0 0 6px', color:'#e2e7ed', fontSize:13, fontWeight:650, lineHeight:1.5 },
 noticeText: { display:'block', maxWidth:'100%', margin:0, color:'#bdc6d2', fontSize:12, lineHeight:1.65 }
};
export default function ToolsPage() {
 return <main style={s.page} data-tools-appearance="inline-v1">
 <header style={s.header}>
 <Link href="/" style={s.back}>← Wróć do encyklopedii</Link>
 <p style={s.eyebrow}>TWÓJ WARSZTAT ONLINE</p>
 <h1 style={s.title}>Narzędzia GMT400</h1>
 <p style={s.intro}>Wybierz, co chcesz sprawdzić. Proste formularze, polskie opisy i informacje w jednym miejscu.</p>
 </header>
 <section style={s.grid} aria-label="Dostępne narzędzia">
 {TOOLS.map(tool => <Link key={tool.href} href={tool.href} style={s.card} data-tool-card>
 <span style={s.icon} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={tool.icon} /></svg></span>
 <span style={s.tag}>{tool.tag}</span>
 <h2 style={s.cardTitle}>{tool.title}</h2>
 <p style={s.description}>{tool.description}</p>
 <p style={s.example}>{tool.example}</p>
 <span style={s.action}>Otwórz narzędzie <span aria-hidden="true">→</span></span>
 </Link>)}
 </section>
 <aside style={s.notice} aria-label="Ważne informacje">
 <h2 style={s.noticeTitle}>Informacje pomocnicze, nie instrukcja naprawy</h2>
 <p style={s.noticeText}>Przed zakupem części lub serwisem potwierdź dane dla konkretnego auta, rocznika i zamontowanych podzespołów. Brak wyniku nie oznacza braku usterki ani niezgodności części.</p>
 </aside>
 </main>;
}
