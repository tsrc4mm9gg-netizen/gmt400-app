import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stories } from '../../../lib/gmt400-stories';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return stories.map(story => ({ slug: story.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find(item => item.slug === slug);
  if (!story) return { title: 'Nie znaleziono materiału', robots: { index: false, follow: false } };
  return { title: story.title + ' — Świat GMT400', description: story.description, alternates: { canonical: 'https://www.gmt400.pl/swiat-gmt400/' + story.slug } };
}
const linkStyle = 'inline-flex min-h-11 items-center rounded px-2 text-silver-300 underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-silver-500';
export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = stories.find(item => item.slug === slug);
  if (!story) notFound();
  return <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white"><article className="mx-auto max-w-3xl">
    <nav aria-label="Nawigacja artykułu"><Link href="/swiat-gmt400" className={linkStyle}>Wszystkie historie</Link><Link href="/" className={linkStyle}>Encyklopedia</Link></nav>
    <header className="my-8"><p className="text-sm text-silver-300">Opracowanie po polsku · nie jest pełnym tłumaczeniem</p><h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{story.title}</h1><p className="mt-4 text-lg leading-8 text-neutral-300">{story.description}</p></header>
    {story.sections.map(section => <section key={section.title} className="my-8"><h2 className="text-2xl font-semibold">{section.title}</h2><p className="mt-3 whitespace-pre-line text-base leading-8 text-neutral-200">{section.text}</p></section>)}
    <footer className="mt-10 rounded-xl border border-neutral-700 p-5"><h2 className="text-xl font-semibold">Źródło opracowania</h2><p className="mt-3 break-words leading-7 text-neutral-300">{story.sourceAuthor} · {story.sourcePublisher} · publikacja źródłowa: <time dateTime={story.sourceDate}>{story.sourceDate}</time></p><a href={story.sourceUrl} className={linkStyle}>{story.sourceTitle} — oryginał w języku angielskim</a><p className="mt-3 text-sm leading-6 text-neutral-300">Dobór i opracowanie: GMT400.pl. Nie kopiujemy fotografii źródłowych ani pełnego tekstu. Relacje i opinie przypisujemy ich autorom.</p></footer>
  </article></div>;
}
