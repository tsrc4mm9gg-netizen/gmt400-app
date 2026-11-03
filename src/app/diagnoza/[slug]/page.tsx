import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '../../ui/Breadcrumbs';
import JsonLd from '../../ui/JsonLd';
import { DIAG_GUIDES, getDiagGuide } from '../../../lib/diagnosis-guides';

export const dynamicParams = false;
export function generateStaticParams() {
  return DIAG_GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getDiagGuide(slug);
  if (!g) return {};
  const url = `https://www.gmt400.pl/diagnoza/${g.slug}`;
  return {
    title: `${g.title} | GMT400`,
    description: g.summary,
    alternates: { canonical: url },
    openGraph: { type: 'article', locale: 'pl_PL', siteName: 'GMT400', url, title: g.title, description: g.summary },
  };
}

export default async function DiagGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getDiagGuide(slug);
  if (!g) notFound();
  const others = DIAG_GUIDES.filter(x => x.slug !== g.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: g.title,
    description: g.summary,
    inLanguage: 'pl-PL',
    url: `https://www.gmt400.pl/diagnoza/${g.slug}`,
    isBasedOn: g.sources.map(s => s.doc),
  };
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white">
      <article className="mx-auto max-w-3xl" data-testid="diag-guide">
        <Breadcrumbs items={[{ href: '/diagnoza', label: 'Diagnoza' }, { label: g.title }]} />
        <header className="my-6">
          <p className="text-sm uppercase tracking-widest text-silver-300">Poradnik diagnostyczny — z instrukcji serwisowych GM</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{g.title}</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-300">{g.summary}</p>
          <p className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/70 px-4 py-3 text-sm leading-6 text-neutral-300"><span className="font-semibold text-silver-200">Zakres: </span>{g.scope}</p>
        </header>

        {g.sections.map(sec => (
          <section key={sec.heading} className="mt-8">
            <h2 className="text-xl font-semibold text-silver-100">{sec.heading}</h2>
            {sec.intro && <p className="mt-2 leading-7 text-neutral-300">{sec.intro}</p>}
            {sec.items && (
              <ul className="mt-3 space-y-2 leading-7 text-neutral-200">
                {sec.items.map(it => <li key={it} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-silver-400" /><span>{it}</span></li>)}
              </ul>
            )}
            {sec.table && (
              <div className="mt-3 overflow-x-auto rounded-xl border border-neutral-800">
                <table className="w-full min-w-[22rem] text-left text-sm" data-testid="guide-table">
                  <caption className="px-4 py-3 text-left text-neutral-400">{sec.table.caption}</caption>
                  <thead className="bg-neutral-900 text-silver-200"><tr>{sec.table.cols.map(c => <th key={c} scope="col" className="px-4 py-2 font-semibold">{c}</th>)}</tr></thead>
                  <tbody>
                    {sec.table.rows.map(r => <tr key={r[0]} className="border-t border-neutral-800">{r.map((cell, i) => i === 0 ? <th key={i} scope="row" className="px-4 py-2 font-normal text-neutral-300">{cell}</th> : <td key={i} className="px-4 py-2 font-medium text-white">{cell}</td>)}</tr>)}
                  </tbody>
                </table>
                {sec.table.note && <p className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-400">{sec.table.note}</p>}
              </div>
            )}
            {sec.warn && <p role="note" className="mt-3 rounded-xl border border-danger-800 bg-danger-950/40 px-4 py-3 text-sm leading-6 text-danger-100"><span className="font-semibold">Uwaga: </span>{sec.warn}</p>}
          </section>
        ))}

        <section className="mt-10 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4" aria-labelledby="zrodla">
          <h2 id="zrodla" className="text-base font-semibold text-silver-200">Źródła</h2>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-neutral-400">
            {g.sources.map(s => <li key={s.doc}>{s.doc}, {s.pages}.</li>)}
          </ul>
          <p className="mt-2 text-xs leading-5 text-neutral-500">Opis własnymi słowami na podstawie wskazanych stron; wartości i kolejność kontroli według GM. Zawsze sprawdź wersję silnika i rocznik swojego auta.</p>
        </section>

        <nav className="mt-8" aria-label="Pozostałe poradniki diagnostyczne">
          <h2 className="text-base font-semibold text-silver-200">Inne poradniki diagnostyczne</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {others.map(o => <li key={o.slug}><Link href={`/diagnoza/${o.slug}`} className="flex min-h-11 items-center rounded-xl border border-neutral-800 px-4 py-2 text-sm text-silver-200 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-silver-500">{o.title}</Link></li>)}
          </ul>
          <Link href="/diagnoza" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-silver-600 px-4 text-sm font-semibold text-silver-100 hover:bg-neutral-900">← Wróć do diagnozy objawów</Link>
        </nav>
      </article>
      <JsonLd data={jsonLd} />
    </div>
  );
}
