import type { Metadata } from 'next';
import Link from 'next/link';
import { SWAP_BASE, SWAP_STAGES, SWAP_SOURCES } from '../../../lib/ls-swap';

export const metadata: Metadata = { title: 'LS swap do GMT400 — plan i 11 etapów', description: 'Modułowy plan zamiany Vortec 5.7 na LS z osobnymi uwagami 2WD i 4WD.', alternates: { canonical: 'https://www.gmt400.pl/diy/ls-swap' }, robots: { index: true, follow: true } };

export default function SwapHub() {
  return <article className="mx-auto max-w-5xl space-y-8 px-4 py-8 text-neutral-200">
    <header className="space-y-3"><p className="text-sm text-amber-400">Projekt zaawansowany · Vortec 5.7 L31 → LS</p><h1 className="text-3xl font-bold text-silver-200">LS swap do GMT400</h1><p>Wybierz etap. Każdy ma listę potrzebnych rzeczy, punkty kontroli i osobne uwagi dla 2WD oraz 4WD.</p><p className="rounded-xl border border-amber-400/40 bg-neutral-900 p-4 text-sm">Wersja robocza. Przegląd materiałów: 10.11.2026. To baza planowania, nie kompletna instrukcja warsztatowa. Grafiki techniczne, dopasowanie produktów oraz bieżące formalności wymagają dalszej weryfikacji.</p></header>
    <section aria-labelledby="prepare-title"><h2 id="prepare-title" className="text-xl font-semibold">Przed zakupem</h2><p className="mt-3">Zapisz VIN, RPO, silnik, skrzynię, napęd oraz dane dawcy. Ustal wymagania formalne przed pracami, mimo że osobny moduł legalizacji znajduje się dalej w planie.</p></section>
    <nav aria-label="Etapy poradnika LS swap"><ol className="grid gap-4 sm:grid-cols-2">{SWAP_STAGES.map((stage, i) => <li key={stage.slug}><Link href={`${SWAP_BASE}/${stage.slug}`} className="block h-full rounded-xl border border-white/10 bg-neutral-800 p-5 hover:border-amber-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"><p className="text-sm text-amber-400">Etap {i + 1} z 11</p><h2 className="mt-2 text-xl font-semibold text-silver-200">{stage.title}</h2><p className="mt-2 text-sm text-neutral-300">{stage.goal}</p></Link></li>)}</ol></nav>
    <section aria-labelledby="sources-title"><h2 id="sources-title" className="text-2xl font-semibold">Rejestr źródeł</h2><ul className="mt-4 space-y-4">{SWAP_SOURCES.map(source => <li key={source.id}><a href={source.href} className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">{source.name}</a><p className="mt-1 text-sm text-neutral-400">{source.status}</p></li>)}</ul></section>
    <p className="text-sm text-neutral-400">Relacje właścicieli nie są gwarancją pasowania. Nie kopiujemy cudzych zdjęć ani schematów. Ceny w tabelach są historyczne. Zweryfikowane produkty zostaną podłączone z afiliacją właściciela; nie zastępujemy ich wynikami wyszukiwania.</p>
  </article>;
}
