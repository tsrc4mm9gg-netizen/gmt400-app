import Link from 'next/link';
import type { Block, Guide } from '../../lib/guides/types';
import { getSource, KIND_LABEL } from '../../lib/guides/sources';
import { BODY_STYLES } from '../../lib/body-styles';
import { GUIDES, getGuide } from '../../lib/guides';
import Breadcrumbs from '../ui/Breadcrumbs';
import JsonLd from '../ui/JsonLd';
import Src from './Src';
import LightsWiringSvg from './LightsWiringSvg';
import ImportGuideCalculator from './ImportGuideCalculator';

const linkStyle = 'inline-flex min-h-11 items-center rounded px-2 text-silver-300 underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500';

const TONE: Record<string, { box: string; label: string }> = {
  warn: { box: 'border-danger-500/70 bg-danger-950/40', label: 'Uwaga' },
  conflict: { box: 'border-silver-400 border-dashed bg-silver-950/50', label: 'Rozbieżność źródeł' },
  info: { box: 'border-neutral-600 bg-neutral-900', label: 'Informacja' },
  legal: { box: 'border-neutral-400 bg-neutral-900', label: 'Przepisy' },
};

function collectSources(g: Guide): string[] {
  const ids = new Set<string>();
  const add = (a?: string[]) => a?.forEach(i => ids.add(i));
  g.sections.forEach(s => s.blocks.forEach(b => {
    if (b.t === 'p' || b.t === 'callout') add(b.src);
    if (b.t === 'list' || b.t === 'check') b.items.forEach(i => add(i.src));
    if (b.t === 'table') b.rows.forEach(r => add(r.src));
    if (b.t === 'reports') b.items.forEach(i => ids.add(i.src));
  }));
  g.faq.forEach(f => add(f.src));
  return [...ids].filter(i => getSource(i));
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case 'p':
      return <p className="leading-7 text-neutral-200">{b.text}<Src ids={b.src} /></p>;
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul';
      return <Tag className={`${b.ordered ? 'list-decimal' : 'list-disc'} space-y-3 pl-5 leading-7 text-neutral-200 marker:text-silver-400`}>{b.items.map((i, k) => <li key={k}>{i.text}<Src ids={i.src} /></li>)}</Tag>;
    }
    case 'check':
      return (
        <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4">
          <h4 className="font-semibold text-white">{b.title}</h4>
          <ul className="mt-3 space-y-3">{b.items.map((i, k) => (
            <li key={k} className="flex gap-3 leading-7 text-neutral-200"><span aria-hidden="true" className="mt-1.5 inline-block h-5 w-5 shrink-0 rounded border-2 border-silver-500" /><span className="min-w-0">{i.text}<Src ids={i.src} /></span></li>
          ))}</ul>
        </div>
      );
    case 'table':
      return (
        <div className="min-w-0">
          <table className="block w-full border-collapse text-left text-sm md:table">
            <caption className="mb-2 block text-left text-sm font-semibold text-neutral-300 md:table-caption">{b.caption}</caption>
            <thead className="sr-only md:not-sr-only md:table-header-group"><tr className="md:table-row">{[...b.head, 'Źródła'].map(h => <th key={h} scope="col" className="border-b border-neutral-600 px-3 py-2 text-xs uppercase tracking-wide text-neutral-300 md:table-cell">{h}</th>)}</tr></thead>
            <tbody className="block md:table-row-group">{b.rows.map((r, i) => (
              <tr key={i} className="mb-3 block rounded-lg border border-neutral-700 bg-neutral-900 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:bg-transparent">
                {r.cells.map((c, k) => (
                  <td key={k} className={`block min-w-0 break-words px-3 py-2 align-top leading-6 md:table-cell ${k === 0 ? 'font-semibold text-white' : 'text-neutral-200'}`}>
                    <span className="block text-xs uppercase tracking-wide text-neutral-400 md:hidden">{b.head[k]}</span>{c}
                  </td>
                ))}
                <td className="block min-w-0 px-3 pb-2 align-top md:table-cell md:py-2">
                  {r.src.length ? <Src ids={r.src} /> : <span className="text-xs text-neutral-400">brak źródła (nie dotyczy / nie znaleziono)</span>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      );
    case 'callout': {
      const t = TONE[b.tone];
      return (
        <aside className={`rounded-xl border-2 p-4 ${t.box}`} data-tone={b.tone}>
          <p className="text-xs font-bold uppercase tracking-widest text-silver-300"><span aria-hidden="true">▲ </span>{t.label}</p>
          <h4 className="mt-1 font-semibold text-white">{b.title}</h4>
          <p className="mt-2 leading-7 text-neutral-200">{b.text}</p>
          <Src ids={b.src} />
        </aside>
      );
    }
    case 'reports':
      return (
        <div className="rounded-xl border border-neutral-700 p-4">
          <h4 className="font-semibold text-white">{b.title}</h4>
          <ul className="mt-3 space-y-4">{b.items.map((i, k) => (
            <li key={k} className="border-l-4 border-silver-600 pl-3">
              <p className="text-xs uppercase tracking-wide text-neutral-400">Relacja użytkownika · {i.where} · {i.date}</p>
              <p className="mt-1 leading-7 text-neutral-200">{i.text}</p>
              <Src ids={[i.src]} />
            </li>
          ))}</ul>
          <p className="mt-3 text-xs text-neutral-400">To pojedyncze relacje z forów — nie dane urzędowe i nie gwarancja wyniku u Ciebie.</p>
        </div>
      );
    case 'svg':
      return <LightsWiringSvg />;
    case 'calc':
      return <ImportGuideCalculator />;
  }
}

const SITE = 'https://www.gmt400.pl';
/** „24.10.2026” → „2026-10-24” (data weryfikacji treści = dateModified). */
const isoDate = (pl: string) => pl.split('.').reverse().join('-');

function guideJsonLd(g: Guide) {
  const url = `${SITE}/dla-wlasciciela/${g.slug}`;
  const org = { '@type': 'Organization', name: 'GMT400', url: SITE };
  return [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.seoDescription ?? g.description,
      inLanguage: 'pl-PL', dateModified: isoDate(g.asOf), mainEntityOfPage: url, url, author: org, publisher: org,
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Dla właściciela', item: `${SITE}/dla-wlasciciela` },
        { '@type': 'ListItem', position: 3, name: g.short, item: url },
      ],
    },
    // FAQ z tej samej treści, którą widać na stronie (sekcja „FAQ”).
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: g.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

export default function GuideView({ guide }: { guide: Guide }) {
  const bodies = guide.bodies.map(id => BODY_STYLES.find(b => b.id === id)).filter(Boolean) as typeof BODY_STYLES;
  const sources = collectSources(guide);
  const related = guide.related.map(getGuide).filter(Boolean) as Guide[];
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white">
      {guideJsonLd(guide).map((d, i) => <JsonLd key={i} data={d} />)}
      <article className="mx-auto max-w-3xl" data-testid="guide-article">
        <Breadcrumbs items={[{ href: '/dla-wlasciciela', label: 'Dla właściciela' }, { label: guide.short }]} />
        <header className="my-6">
          <p className="text-sm uppercase tracking-widest text-silver-300">Najważniejsze dla właściciela w PL</p>
          <h1 className="mt-3 break-words text-3xl font-semibold leading-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-300">{guide.description}</p>
          <p className="mt-4 text-sm font-semibold text-silver-300" data-testid="guide-asof">Stan na: {guide.asOf}</p>
          <ul aria-label="Dotyczy" className="mt-4 flex flex-wrap gap-2 text-sm">
            <li className="rounded-full border border-neutral-600 px-3 py-1 text-neutral-200">Lata: {guide.years}</li>
            {guide.engines && <li className="rounded-full border border-neutral-600 px-3 py-1 text-neutral-200">{guide.engines}</li>}
            {bodies.map(b => <li key={b.id} data-body={b.id} className="rounded-full border border-silver-700/60 bg-silver-950/30 px-3 py-1 text-neutral-100">{b.name} {b.from}–{b.to}</li>)}
          </ul>
        </header>

        <section aria-labelledby="summary-title" data-testid="guide-summary" className="rounded-xl border-2 border-silver-600/70 bg-silver-950/30 p-5">
          <h2 id="summary-title" className="text-xl font-semibold">W skrócie</h2>
          <ul className="mt-3 list-disc space-y-3 pl-5 leading-7 text-neutral-100 marker:text-silver-400">{guide.summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </section>

        <p className="mt-4 rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-sm leading-6 text-neutral-300">
          Sprawdź w swoim aucie / manualu (VIN, RPO, tabliczka). Przepisy się zmieniają — sprawdź w urzędzie. Wartości w zł i jednostki metryczne; przy każdej liczbie jest źródło z datą. Czego nie dało się zweryfikować, zaznaczono wprost.
        </p>

        <nav aria-label="Spis treści" className="mt-6"><ul className="flex flex-wrap gap-2">{guide.sections.map(s => <li key={s.id}><a href={'#' + s.id} className="inline-flex min-h-11 items-center rounded-full border border-neutral-600 px-4 text-sm text-neutral-100 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">{s.title}</a></li>)}</ul></nav>

        <div className="mt-6 space-y-4">
          {guide.sections.map(s => (
            <details key={s.id} id={s.id} open={s.open} className="group scroll-mt-6 rounded-xl border border-neutral-700 bg-neutral-900/60">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-lg font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">{s.title}</span><span aria-hidden="true" className="shrink-0 text-silver-400 transition group-open:rotate-90">›</span>
              </summary>
              <div className="min-w-0 space-y-4 px-4 pb-5">{s.blocks.map((b, i) => <BlockView key={i} b={b} />)}</div>
            </details>
          ))}
        </div>

        <section aria-labelledby="mistakes-title" className="mt-8 rounded-xl border border-silver-700/50 p-5">
          <h2 id="mistakes-title" className="text-xl font-semibold">Najczęstsze błędy</h2>
          <ul className="mt-3 space-y-3 leading-7 text-neutral-200">{guide.mistakes.map((m, i) => <li key={i} className="flex gap-3"><span aria-hidden="true" className="text-silver-400">✕</span><span className="min-w-0">{m}</span></li>)}</ul>
        </section>

        <section aria-labelledby="faq-title" className="mt-8">
          <h2 id="faq-title" className="text-xl font-semibold">FAQ</h2>
          <div className="mt-3 space-y-3">{guide.faq.map((f, i) => (
            <details key={i} className="rounded-xl border border-neutral-700 bg-neutral-900">
              <summary className="flex min-h-12 cursor-pointer items-center px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">{f.q}</summary>
              <div className="px-4 pb-4 leading-7 text-neutral-200">{f.a}<Src ids={f.src} /></div>
            </details>
          ))}</div>
        </section>

        <section aria-labelledby="sources-title" className="mt-8">
          <details className="rounded-xl border border-neutral-700 bg-neutral-900/60" data-testid="guide-sources">
            <summary id="sources-title" className="flex min-h-12 cursor-pointer items-center px-4 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Źródła ({sources.length}) i daty</summary>
            <ul className="space-y-3 px-4 pb-4 text-sm leading-6">{sources.map(id => { const s = getSource(id)!; return (
              <li key={id} className="min-w-0 break-words text-neutral-300"><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-silver-300 underline">{s.label}</a> — {KIND_LABEL[s.kind]}, stan na: {s.date}</li>
            ); })}</ul>
          </details>
        </section>

        <nav aria-label="Powiązane poradniki" className="mt-8"><h2 className="text-xl font-semibold">Zobacz też</h2>
          <ul className="mt-2 flex flex-wrap gap-x-4">{related.map(r => <li key={r.slug}><Link href={'/dla-wlasciciela/' + r.slug} className={linkStyle}>{r.short}</Link></li>)}<li><Link href="/dla-wlasciciela" className={linkStyle}>Wszystkie poradniki PL</Link></li></ul>
        </nav>
        <p className="mt-6 text-xs text-neutral-500">Poradnik informacyjny, nie porada prawna ani podatkowa. {GUIDES.length} poradniki w serii „Najważniejsze dla właściciela w PL”.</p>
      </article>
    </div>
  );
}
