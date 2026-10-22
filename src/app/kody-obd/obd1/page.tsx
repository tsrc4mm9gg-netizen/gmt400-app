import { OBD1_CODES } from '@/lib/obd1-codes';

export const metadata = {
 title: 'Kody OBD-I (1988–1995) — GMT400',
 description: 'Tabela kodów OBD-I dla GMT400 1988–1995 oraz instrukcja odczytu przez ALDL.'
};

export default function Obd1Page() {
 return (
 <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-10">
 <h1 className="text-3xl font-bold text-amber-400">Kody OBD-I (1988–1995)</h1>
 <p className="mt-2 text-zinc-300">Kod wskazuje obwód, a nie konkretną część. Sprawdź w swoim aucie / manualu — GMT400 ma wiele wariantów (rocznik, GVWR, silnik, skrzynia, RPO).</p>
 <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
 <h2 className="text-xl font-semibold text-amber-300">Jak odczytać kody</h2>
 <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-200">
 <li>Wyłącz zapłon.</li>
 <li>Znajdź złącze ALDL pod deską rozdzielczą.</li>
 <li>Zewrzyj piny A i B (np. spinaczem).</li>
 <li>Włącz zapłon (silnik NIE pracuje).</li>
 <li>Lampka SES zacznie migać kody: kod 12 (1 błysk, pauza, 2 błyski) = tryb diagnostyczny.</li>
 <li>Kody powtarzają się 3 razy każdy.</li>
 </ol>
 </section>
 <section className="mt-8">
 <h2 className="text-xl font-semibold text-amber-300">Tabela kodów</h2>
 <table className="mt-4 w-full text-left text-sm">
 <caption className="sr-only">Kody OBD-I 1988–1995</caption>
 <thead>
 <tr className="text-zinc-400">
 <th scope="col" className="py-2 pr-4">Kod</th>
 <th scope="col" className="py-2 pr-4">Opis</th>
 <th scope="col" className="py-2">Możliwe przyczyny</th>
 </tr>
 </thead>
 <tbody>
 {OBD1_CODES.map(item => (
 <tr key={item.code} className="border-t border-zinc-800">
 <th scope="row" className="py-2 pr-4 font-medium text-amber-300">{item.code}</th>
 <td className="py-2 pr-4 text-zinc-200">{item.description}</td>
 <td className="py-2 text-zinc-300">{item.causes.join(', ')}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </section>
 <p className="mt-6 text-xs text-zinc-500">
 Źródła: RepairPal GM OBD-I chart, Tradecraft Specialties, Wards Specialty Performance, Straight Talk Automotive.
 </p>
 </main>
 );
}
