import Link from 'next/link';
import { SCHEMATICS } from '@/lib/schematics';
import SchematicViewer from './SchematicViewer';
import SchematicPhotos from './SchematicPhotos';
import FuseTable from './FuseTable';
import Breadcrumbs from '../ui/Breadcrumbs';

export const metadata = {
  title: 'Schematy — GMT400',
  description: 'Schematy GMT400: ALDL 12-pin, OBD-II 16-pin, chłodzenie, hamulce i ABS, układ paliwowy, uszczelki kolektora Vortec, punkty masy, tabela płynów, ATF 4L60-E, bezpieczniki, zawieszenie C/K, napęd 4×4.',
  alternates: { canonical: 'https://www.gmt400.pl/schematy' },
};

const titleOf = (id: string) => SCHEMATICS.find(item => item.id === id)?.title ?? id;

export default function SchematyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Schematy' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Schematy — GMT400</h1>
      <p className="mt-2 text-neutral-300">Własne, uproszczone schematy i pinouty. Bez skanów FSM ani materiałów © GM. Przy części schematów są prawdziwe zdjęcia z Wikimedia Commons (autor i licencja pod zdjęciem). Każdy rysunek ma podany model i lata — <strong className="text-white">sprawdź w swoim aucie / manualu</strong>, bo GMT400 ma wiele wariantów.</p>
      <nav aria-label="Spis schematów" className="mt-5">
        <ul className="flex flex-wrap gap-2">
          {SCHEMATICS.map(item => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-neutral-200 hover:border-silver-600 hover:text-white">{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
      {SCHEMATICS.map(item => (
        <section key={item.id} id={item.id} className="mt-8 scroll-mt-24 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
          <h2 className="text-xl font-semibold text-silver-300">{item.title}</h2>
          <p className="mt-1 text-sm text-neutral-400">Zakres: {item.scope}</p>
          {[item.diagram, ...(item.extraDiagrams ?? [])].filter(d => d !== undefined).map(d => (
            <figure key={d.src} className="mt-4">
              <div className="mb-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-silver-600/50 bg-silver-600/10 px-3 py-1 text-silver-200">Model i lata: {d.models}</span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-neutral-200">⚠ Sprawdź w swoim aucie / manualu</span>
              </div>
              <SchematicViewer src={d.src} alt={d.alt} width={d.width} height={d.height} title={item.extraDiagrams?.length ? `${item.title} — ${d.models}` : item.title} />
              <figcaption className="mt-2 text-xs text-neutral-400">Stuknij schemat, aby otworzyć go na pełnym ekranie i powiększyć dwoma palcami. Rysunek poglądowy — nie zastępuje FSM.</figcaption>
            </figure>
          ))}
          {item.fuseTable && <FuseTable />}
          {item.photos && item.photos.length > 0 && <SchematicPhotos photos={item.photos} title={item.title} />}
          <p className="mt-3 text-neutral-200">{item.description}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <caption className="sr-only">{item.title}</caption>
              <thead>
                <tr className="text-neutral-400">
                  <th scope="col" className="py-2 pr-4">Element / pin</th>
                  <th scope="col" className="py-2">Opis</th>
                </tr>
              </thead>
              <tbody>
                {item.rows.map(row => (
                  <tr key={row.label} className="border-t border-white/10 align-top">
                    <th scope="row" className="py-2 pr-4 font-medium text-neutral-200">{row.label}</th>
                    <td className="py-2 text-neutral-300">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {item.related && item.related.length > 0 && (
            <p className="mt-3 text-sm text-neutral-400">Zobacz też:{' '}
              {item.related.map((id, index) => <span key={id}>{index > 0 && ', '}<a href={`#${id}`} className="inline-flex min-h-11 items-center text-silver-400 underline">{titleOf(id)}</a></span>)}
            </p>
          )}
          <p className="mt-2 text-xs text-neutral-500">
            Źródło: <a className="inline-flex min-h-11 items-center text-silver-400 underline" href={item.source} target="_blank" rel="noopener noreferrer">{item.sourceTitle}</a>
          </p>
          <p className="mt-1 text-xs text-neutral-400">{item.note}</p>
        </section>
      ))}
      <p className="mt-8 text-sm text-neutral-400">Schematy dla konkretnego nadwozia znajdziesz też na <Link href="/modele" className="inline-flex min-h-11 items-center text-silver-400 underline">stronach modeli</Link>.</p>
    </div>
  );
}
