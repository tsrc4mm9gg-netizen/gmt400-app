import { SCHEMATICS } from '@/lib/schematics';

export const metadata = {
 title: 'Schematy — GMT400',
 description: 'Podstawowe schematy i opisy: ALDL 12-pin, OBD-II 16-pin, układ chłodzenia Vortec, napęd 4×4.'
};

export default function SchematyPage() {
 return (
 <main id="main-content" className="mx-auto w-full max-w-5xl px-4 py-10">
 <h1 className="text-3xl font-bold text-amber-400">Schematy — GMT400</h1>
 <p className="mt-2 text-zinc-300">Podstawowe opisy i pinouty. Bez hostowania skanów FSM ani materiałów © GM.</p>
 {SCHEMATICS.map(item => (
 <section key={item.id} className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
 <h2 className="text-xl font-semibold text-amber-300">{item.title}</h2>
 <p className="mt-1 text-sm text-zinc-400">Zakres: {item.scope}</p>
 <p className="mt-2 text-zinc-200">{item.description}</p>
 <table className="mt-4 w-full text-left text-sm">
 <caption className="sr-only">{item.title}</caption>
 <thead>
 <tr className="text-zinc-400">
 <th scope="col" className="py-2 pr-4">Element / pin</th>
 <th scope="col" className="py-2">Opis</th>
 </tr>
 </thead>
 <tbody>
 {item.rows.map(row => (
 <tr key={row.label} className="border-t border-zinc-800">
 <th scope="row" className="py-2 pr-4 font-medium text-zinc-200">{row.label}</th>
 <td className="py-2 text-zinc-300">{row.value}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <p className="mt-3 text-xs text-zinc-500">
 Źródło: <a className="text-amber-400 underline" href={item.source}>{item.sourceTitle}</a>
 </p>
 <p className="mt-1 text-xs text-zinc-500">{item.note}</p>
 </section>
 ))}
 </main>
 );
}
