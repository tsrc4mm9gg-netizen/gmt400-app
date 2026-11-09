import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SwapPlanningFigure from '../SwapPlanningFigure';
import { SWAP_BASE, SWAP_STAGES, SWAP_PARTS, SWAP_SOURCES } from '../../../../lib/ls-swap';

type Props = { params: Promise<{ etap: string }> };
export function generateStaticParams() { return SWAP_STAGES.map(stage => ({ etap: stage.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { etap } = await params;
  const stage = SWAP_STAGES.find(item => item.slug === etap);
  return stage ? { title: `${stage.title} — LS swap GMT400`, description: stage.goal, alternates: { canonical: `https://www.gmt400.pl${SWAP_BASE}/${stage.slug}` }, robots: { index: false, follow: true } } : {};
}
const linkClass = 'rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400';
export default async function StagePage({ params }: Props) {
  const { etap } = await params;
  const index = SWAP_STAGES.findIndex(item => item.slug === etap);
  if (index < 0) notFound();
  const stage = SWAP_STAGES[index];
  const previous = SWAP_STAGES[index - 1];
  const next = SWAP_STAGES[index + 1];
  const parts = SWAP_PARTS.filter(part => part.stage === etap);
  return <article className="mx-auto max-w-4xl space-y-8 px-4 py-8 text-neutral-200">
    <nav aria-label="Ścieżka poradnika" className="text-sm"><Link className={linkClass} href={SWAP_BASE}>LS swap — wszystkie etapy</Link></nav>
    <header className="space-y-3"><p className="text-sm text-amber-400">Etap {index + 1} z 11 · wersja robocza</p><h1 className="text-3xl font-bold text-silver-200">{stage.title}</h1><p>{stage.goal}</p></header>
    <aside aria-labelledby="warning-title" className="rounded-xl border border-amber-400/40 bg-neutral-900 p-5"><h2 id="warning-title" className="font-semibold text-amber-400">Ograniczenia i pułapki</h2><p className="mt-2">{stage.warning}</p></aside>
    <section aria-labelledby="needed-title"><h2 id="needed-title" className="text-2xl font-semibold">Potrzebne rzeczy</h2><ul className="mt-4 list-disc space-y-2 pl-5">{stage.needed.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section aria-labelledby="drive-title"><h2 id="drive-title" className="text-2xl font-semibold">2WD i 4WD</h2><dl className="mt-4 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-white/10 bg-neutral-800 p-4"><dt className="font-semibold text-amber-400">2WD</dt><dd className="mt-2">{stage.twoWD}</dd></div><div className="rounded-xl border border-white/10 bg-neutral-800 p-4"><dt className="font-semibold text-amber-400">4WD</dt><dd className="mt-2">{stage.fourWD}</dd></div></dl></section>
    <SwapPlanningFigure etap={etap} />
    <section aria-labelledby="steps-title"><h2 id="steps-title" className="text-2xl font-semibold">{etap === 'faq' ? 'Pytania i odpowiedzi' : 'Kolejność i punkty kontroli'}</h2><ol className="mt-4 list-decimal space-y-4 pl-6">{stage.steps.map(item => <li key={item} className="pl-2">{item}</li>)}</ol></section>
    {parts.length > 0 && <section aria-labelledby="parts-title"><h2 id="parts-title" className="text-2xl font-semibold">Numery części i ceny historyczne</h2><p id="parts-note" className="mt-3 text-sm text-neutral-300">Dane z materiałów roboczych, nie aktualne oferty. Niepotwierdzony numer nie jest rekomendacją zakupu. Tabelę można przewijać poziomo.</p><div role="region" aria-labelledby="parts-title" aria-describedby="parts-note" tabIndex={0} className="mt-4 overflow-x-auto rounded-xl border border-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"><table className="w-full min-w-[720px] text-left text-sm"><caption className="sr-only">Części dla etapu {stage.title}; ceny z materiałów właściciela z 9.11.2026</caption><thead className="bg-neutral-800"><tr>{['Produkt / numer', 'Napęd', 'Cena historyczna', 'Data materiału / ceny', 'Status'].map(title => <th key={title} scope="col" className="p-3">{title}</th>)}</tr></thead><tbody>{parts.map(part => <tr key={part.number} className="border-t border-white/10"><th scope="row" className="p-3 font-normal">{part.name}<br/><code>{part.number}</code></th><td className="p-3">{part.drive}</td><td className="p-3">{part.price}</td><td className="p-3">{part.date}</td><td className="p-3">{part.status}</td></tr>)}</tbody></table></div></section>}
    <section aria-labelledby="done-title" className="rounded-xl border border-white/10 bg-neutral-800 p-5"><h2 id="done-title" className="text-xl font-semibold">Kiedy przejść dalej</h2><p className="mt-3">{stage.done}</p></section>
    <section aria-labelledby="sources-title"><h2 id="sources-title" className="text-xl font-semibold">Źródła i status</h2><ul className="mt-3 space-y-3">{SWAP_SOURCES.filter(source => stage.sources.includes(source.id)).map(source => <li key={source.id}><a href={source.href} className={linkClass}>{source.name}</a><p className="mt-1 text-sm text-neutral-400">{source.status}</p></li>)}</ul></section>
    <nav aria-label="Nawigacja między etapami" className="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6">{previous && <Link className={linkClass} href={`${SWAP_BASE}/${previous.slug}`}>Poprzedni: {previous.title}</Link>}<Link className={linkClass} href={SWAP_BASE}>Plan prac</Link>{next && <Link className={linkClass} href={`${SWAP_BASE}/${next.slug}`}>Następny: {next.title}</Link>}</nav>
  </article>;
}
