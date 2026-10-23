import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '../../ui/Breadcrumbs';
import { findObdCode, getRelatedObdCodes, OBD_CODES } from '@/lib/obd-codes';

export function generateStaticParams() {
  return OBD_CODES.map(({ code }) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const item = findObdCode(code);
  if (!item) return { title: VALID_CODE.test(code) ? `${code.toUpperCase()} — brak karty kodu | GMT400` : 'Nie znaleziono kodu OBD — GMT400', robots: { index: false } };
  const url = `/kody-obd/${item.code.toLowerCase()}`;
  return {
    title: `${item.code} — ${item.title} | GMT400`,
    description: item.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'pl_PL',
      url,
      title: `${item.code} — ${item.title} | GMT400`,
      description: item.description,
    },
    twitter: {
      card: 'summary',
      title: `${item.code} — ${item.title} | GMT400`,
      description: item.description,
    },
  };
}

const VALID_CODE = /^[pbcu][0-3][0-9a-f]{3}$/i;

function MissingCode({ code }: { code: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs className="mb-4" items={[{ href: '/kody-obd', label: 'Kody OBD' }, { label: code }]} />
      <p className="text-sm uppercase tracking-wide text-red-400">Kod OBD-II</p>
      <h1 className="mt-1 text-3xl font-bold text-white">{code}</h1>
      <section className="mt-6 rounded-xl border border-white/10 bg-neutral-900/60 p-5" data-testid="obd-missing">
        <p className="text-neutral-200">Ten kod nie ma jeszcze osobnej karty w naszej bazie.</p>
        <p className="mt-2 text-sm text-neutral-400">Znaczenie kodu zależy od rocznika, silnika i PCM — sprawdź w swoim aucie / manualu (GM Service Manual, sekcja Diagnostic Trouble Codes).</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/szukaj?q=${encodeURIComponent(code)}`} className="inline-flex min-h-11 items-center rounded bg-red-600 px-4 font-semibold text-white">Szukaj {code} w bazie</Link>
          <Link href="/kody-obd" className="inline-flex min-h-11 items-center rounded border border-white/20 px-4 text-neutral-100">Lista kodów</Link>
        </div>
      </section>
    </div>
  );
}

const severityVisual = {
  critical: { label: 'Waga: wysoka — nie ignoruj', className: 'bg-red-500' },
  warning: { label: 'Waga: średnia — zdiagnozuj', className: 'bg-red-600' },
  info: { label: 'Waga: informacyjna', className: 'bg-sky-400' }
} as const;

export default async function ObdCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const item = findObdCode(code);
  if (!item) {
    if (!VALID_CODE.test(code)) notFound();
    return <MissingCode code={code.toUpperCase()} />;
  }
  const relatedCodes = getRelatedObdCodes(item.code, 3);
  const severity = severityVisual[item.severity];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs className="mb-4" items={[{ href: '/kody-obd', label: 'Kody OBD' }, { label: item.code }]} />
      <header>
        <p className="text-sm uppercase tracking-wide text-red-400">Kod OBD-II</p>
        <h1 className="mt-1 text-3xl font-bold text-white">{item.code} — {item.title}</h1>
        <p className="mt-3 text-neutral-300">{item.description}</p>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-400">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${severity.className}`} aria-hidden="true" />
          <span>{severity.label}</span>
          <span aria-hidden="true">·</span>
          <span>Układ: {item.systems.join(', ')}</span>
        </p>
      </header>
      <section className="mt-8">
        <h2 className="text-xl text-red-400">Typowe przyczyny</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-300">{item.commonCauses.map(cause => <li key={cause}>{cause}</li>)}</ul>
      </section>
      <section className="mt-8">
        <h2 className="text-xl text-red-400">Kolejność diagnostyki</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-neutral-300">{item.diagnosticSteps.map(step => <li key={step}>{step}</li>)}</ol>
      </section>
      {relatedCodes.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl text-red-400">Powiązane kody</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {relatedCodes.map(related => (
              <li key={related.code} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
                <Link href={`/kody-obd/${related.code.toLowerCase()}`} className="inline-flex min-h-11 items-center font-semibold text-red-400 underline">{related.code}</Link>
                <p className="mt-1 text-sm text-neutral-300">{related.title}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="mt-8 rounded-xl border border-red-600/40 bg-neutral-900/60 p-4">
        <h2 className="text-lg text-red-400">Powiązane materiały</h2>
        <p className="mt-2 text-neutral-300">Wyszukaj powiązane poradniki i usterki:</p>
        <Link href={`/szukaj?q=${encodeURIComponent(item.relatedSearch)}`} className="mt-2 inline-block min-h-11 rounded bg-red-600 px-4 py-3 font-semibold text-white">Szukaj: {item.relatedSearch}</Link>
      </section>
      <p className="mt-8 text-sm text-neutral-400">Kod OBD wskazuje obszar problemu, ale nie zastępuje diagnostyki. Nie wymieniaj części wyłącznie na podstawie kodu — potwierdź przyczynę pomiarami.</p>
      <nav aria-label="Nawigacja na końcu strony" className="mt-8">
        <Link href="/kody-obd" className="inline-flex min-h-11 items-center text-red-400 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500">← Wszystkie kody OBD</Link>
      </nav>
    </div>
  );
}
