import Link from 'next/link';

const TOOLS = [
 { href: '/narzedzia/rpo', title: 'Kody RPO', description: 'Sprawdź, co oznaczają kody z tabliczki pojazdu. Wpisz kilka kodów naraz albo szukaj po nazwie wyposażenia.', icon: '📋' },
 { href: '/narzedzia/diagnostyka', title: 'Kody błędów OBD', description: 'Wpisz kod, np. P0300, albo objaw, np. „misfire”. Zobacz możliwe przyczyny i pierwsze czynności.', icon: '🔧' },
 { href: '/narzedzia/kalkulatory', title: 'Kalkulator opon', description: 'Porównaj obecne i nowe opony. Sprawdź wpływ na prędkość i przełożenie osi.', icon: '🛞' },
 { href: '/narzedzia/czesci', title: 'Dobór części', description: 'Sprawdź, czy część pasuje do Twojego modelu, rocznika, silnika i skrzyni biegów.', icon: '🔩' }
];

export default function ToolsPage() {
 return (
 <main className="mx-auto max-w-4xl p-4">
 <h1 className="text-2xl font-semibold text-slate-900">Narzędzia GMT400</h1>
 <p className="mt-1 text-sm text-slate-600">Wybierz narzędzie. Wszystkie wyniki są pomocnicze — przed zakupem części lub serwisem potwierdź dane w instrukcji właściwego rocznika.</p>

 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 {TOOLS.map(tool => (
 <Link key={tool.href} href={tool.href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow-md">
 <div className="text-3xl">{tool.icon}</div>
 <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-blue-700">{tool.title}</h2>
 <p className="mt-2 text-sm text-slate-600">{tool.description}</p>
 <span className="mt-3 inline-block text-sm font-medium text-blue-700">Otwórz →</span>
 </Link>
 ))}
 </div>
 </main>
 );
}
