import Link from 'next/link';
import styles from './ToolsHub.module.css';

const TOOLS = [
 { href: '/narzedzia/rpo', title: 'Kody RPO', tag: 'Wyposażenie pojazdu', description: 'Odczytaj kody z tabliczki i sprawdź ich znaczenie po polsku. Możesz wpisać kilka kodów naraz.', example: 'Na przykład: G80, Z71, GU5', icon: 'M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3M9 3h6v4H9zM8 12h8M8 16h6' },
 { href: '/narzedzia/diagnostyka', title: 'Kody błędów OBD', tag: 'Diagnostyka', description: 'Sprawdź znaczenie kodu ze skanera, możliwe przyczyny i pierwsze czynności diagnostyczne.', example: 'Na przykład: P0300 lub P0171', icon: 'M5 4h14v12H5zM9 20h6M12 16v4M8 10h2l1-3 2 6 1-3h2' },
 { href: '/narzedzia/kalkulatory', title: 'Kalkulator opon', tag: 'Opony i przełożenia', description: 'Porównaj obecne i planowane opony. Oblicz zmianę średnicy oraz wpływ na prędkość i przełożenie osi.', example: 'Na przykład: 235/75 R16 → 265/75 R16', icon: 'M4 5h16v14H4zM4 10h16M10 10v9M7 7h1M13 14h4M15 12v4' },
 { href: '/narzedzia/czesci', title: 'Dobór części', tag: 'Wstępna weryfikacja', description: 'Przejrzyj referencyjne informacje według modelu, rocznika, silnika i skrzyni. Przed zakupem potwierdź numer części.', example: 'Wynik nie potwierdza zamienności części.', icon: 'M14 4a6 6 0 0 0-7 8l-4 4a3 3 0 0 0 5 5l4-4a6 6 0 0 0 8-7l-4 3-4-4z' }
];

export default function ToolsPage() {
 return (
 <main className={styles.page}>
 <header className={styles.header}>
 <Link href="/" className={styles.back}>← Wróć do encyklopedii</Link>
 <p className={styles.eyebrow}>TWÓJ WARSZTAT ONLINE</p>
 <h1 className={styles.title}>Narzędzia GMT400</h1>
 <p className={styles.intro}>Wybierz, co chcesz sprawdzić. Proste formularze, polskie opisy i informacje w jednym miejscu.</p>
 </header>
 <section className={styles.grid} aria-label="Dostępne narzędzia">
 {TOOLS.map(tool => (
 <Link key={tool.href} href={tool.href} className={styles.card}>
 <span className={styles.icon} aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={tool.icon} /></svg></span>
 <span className={styles.tag}>{tool.tag}</span>
 <h2 className={styles.cardTitle}>{tool.title}</h2>
 <p className={styles.description}>{tool.description}</p>
 <p className={styles.example}>{tool.example}</p>
 <span className={styles.action}>Otwórz narzędzie <span aria-hidden="true">→</span></span>
 </Link>
 ))}
 </section>
 <aside className={styles.notice} aria-label="Ważne informacje">
 <h2 className={styles.noticeTitle}>Informacje pomocnicze, nie instrukcja naprawy</h2>
 <p className={styles.noticeText}>Przed zakupem części lub serwisem potwierdź dane dla konkretnego auta, rocznika i zamontowanych podzespołów. Brak wyniku nie oznacza braku usterki ani niezgodności części.</p>
 </aside>
 </main>
 );
}
