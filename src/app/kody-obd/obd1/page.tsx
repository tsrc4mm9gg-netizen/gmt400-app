import { OBD1_DOCS, OBD1_DOUBTS, OBD1_GROUPS, OBD1_NOTE, OBD1_READING, type Obd1Cite } from '@/lib/obd1-codes';

export const metadata = {
 title: 'Kody OBD-I (1988–1995) — GMT400',
 description: 'Kody OBD-I GMT400 1988–1995 z instrukcji GM: benzyna ECM (TBI), benzyna PCM z 4L60-E/4L80-E, diesel 6.5 — oraz odczyt przez ALDL.'
};

const cite = (items: readonly Obd1Cite[]) => items.map(item => `${OBD1_DOCS[item.doc]}, s. ${item.page}`).join('; ');

export default function Obd1Page() {
 const total = OBD1_GROUPS.reduce((sum, group) => sum + group.codes.length, 0);
 return (
 <div className="mx-auto w-full max-w-5xl px-4 py-10">
 <h1 className="text-3xl font-bold text-silver-400">Kody OBD-I (1988–1995)</h1>
 <p className="mt-2 text-zinc-300">{OBD1_NOTE}</p>
 <p className="mt-2 text-sm text-zinc-400">{OBD1_GROUPS.length} listy, {total} pozycji, spisanych z instrukcji serwisowych GM (opis własnymi słowami, źródło przy każdej liście). Ten sam numer może znaczyć co innego w zależności od rocznika i silnika — wybierz właściwą listę.</p>
 <nav aria-label="Listy kodów" className="mt-4 flex flex-wrap gap-2 text-sm">
 {OBD1_GROUPS.map(group => <a key={group.id} href={`#${group.id}`} className="rounded-full border border-zinc-700 px-3 py-1 text-silver-300 hover:border-zinc-500">{group.title.split(' — ')[0]}</a>)}
 </nav>
 <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
 <h2 className="text-xl font-semibold text-silver-300">Jak odczytać kody</h2>
 <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-200">
 {OBD1_READING.steps.map(step => <li key={step}>{step}</li>)}
 </ol>
 <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-300">
 {OBD1_READING.facts.map(fact => <li key={fact}>{fact}</li>)}
 </ul>
 <p className="mt-3 text-xs text-zinc-500">Źródło: {cite(OBD1_READING.sources)}.</p>
 </section>
 {OBD1_GROUPS.map(group => (
 <section key={group.id} id={group.id} className="mt-10 scroll-mt-24">
 <h2 className="text-xl font-semibold text-silver-300">{group.title}</h2>
 <p className="mt-2 text-sm text-zinc-300">{group.applies}</p>
 <p className="mt-1 text-sm text-zinc-400">{group.intro}</p>
 <div className="mt-4 overflow-x-auto">
 <table className="w-full min-w-[20rem] text-left text-sm">
 <caption className="sr-only">{group.title}</caption>
 <thead>
 <tr className="text-zinc-400">
 <th scope="col" className="py-2 pr-4">Kod</th>
 <th scope="col" className="py-2 pr-4">Znaczenie</th>
 <th scope="col" className="py-2">Skrzynia / uwagi</th>
 </tr>
 </thead>
 <tbody>
 {group.codes.map(item => (
 <tr key={item.code} className="border-t border-zinc-800 align-top">
 <th scope="row" className="py-2 pr-4 font-medium text-silver-300">{item.code}</th>
 <td className="py-2 pr-4 text-zinc-200">{item.name}</td>
 <td className="py-2 text-zinc-300">{[item.trans ? `kod skrzyni: ${item.trans}` : '', item.detail ?? ''].filter(Boolean).join(' · ') || '—'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <p className="mt-3 text-xs text-zinc-500">Źródła ({group.years}): {cite(group.sources)}. Sprawdź w swoim aucie / manualu.</p>
 </section>
 ))}
 <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
 <h2 className="text-lg font-semibold text-silver-300">Czego tu nie ma</h2>
 <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
 {OBD1_DOUBTS.map(doubt => <li key={doubt}>{doubt}</li>)}
 </ul>
 </section>
 </div>
 );
}
