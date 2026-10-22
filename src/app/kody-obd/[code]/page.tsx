import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findObdCode, OBD_CODES } from '@/lib/obd-codes';

export function generateStaticParams() {
  return OBD_CODES.map(({ code }) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const item = findObdCode(code);
  if (!item) return { title: 'Nie znaleziono kodu OBD — GMT400' };
  return {
    title: `${item.code} — ${item.title} | GMT400`,
    description: item.description
  };
}

export default async function ObdCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const item = findObdCode(code);
  if (!item) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Nawigacja" className="mb-4">
        <Link href="/kody-obd" className="text-amber-400 underline">← Wszystkie kody OBD</Link>
      </nav>
      <header>
        <p className="text-sm uppercase tracking-wide text-amber-400">Kod OBD-II</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{item.code} — {item.title}</h1>
        <p className="mt-3 text-neutral-300">{item.description}</p>
        <p className="mt-3 text-sm text-neutral-400">Waga: {item.severity === 'critical' ? 'wysoka — nie ignoruj' : item.severity === 'warning' ? 'średnia — zdiagnozuj' : 'informacyjna'} · Układ: {item.systems.join(', ')}</p>
      </header>
      <section className="mt-8">
        <h2 className="text-xl text-amber-400">Typowe przyczyny</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-300">{item.commonCauses.map(cause => <li key={cause}>{cause}</li>)}</ul>
      </section>
      <section className="mt-8">
        <h2 className="text-xl text-amber-400">Kolejność diagnostyki</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-neutral-300">{item.diagnosticSteps.map(step => <li key={step}>{step}</li>)}</ol>
      </section>
      <section className="mt-8 rounded-xl border border-amber-400/40 bg-neutral-900/60 p-4">
        <h2 className="text-lg text-amber-400">Powiązane materiały</h2>
        <p className="mt-2 text-neutral-300">Wyszukaj powiązane poradniki i usterki:</p>
        <Link href={`/szukaj?q=${encodeURIComponent(item.relatedSearch)}`} className="mt-2 inline-block min-h-11 rounded bg-amber-400 px-4 py-3 font-semibold text-black">Szukaj: {item.relatedSearch}</Link>
      </section>
      <p className="mt-8 text-sm text-neutral-400">Kod OBD wskazuje obszar problemu, ale nie zastępuje diagnostyki. Nie wymieniaj części wyłącznie na podstawie kodu — potwierdź przyczynę pomiarami.</p>
      <nav aria-label="Nawigacja na końcu strony" className="mt-8">
        <Link href="/kody-obd" className="inline-flex min-h-11 items-center text-amber-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">← Wszystkie kody OBD</Link>
      </nav>
    </main>
  );
}
