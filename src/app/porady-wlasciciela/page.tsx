import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import OwnerTipsList from './OwnerTipsList';

export const metadata: Metadata = {
  title: 'Porady właściciela GMT400 — z instrukcji GM 1988–1999',
  description: 'Praktyczne porady dla właściciela Chevrolet/GMC C/K, Tahoe, Yukon i Suburban 1988–1999: 4×4, przyczepa, opony, łańcuchy, pilot, PassLock, bezpieczniki, kody ALDL i test kompresji — każda ze stroną instrukcji GM.',
  alternates: { canonical: 'https://www.gmt400.pl/porady-wlasciciela' },
};

export default function OwnerTipsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 px-5 py-8 pb-28 text-white">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ href: '/dla-wlasciciela', label: 'Dla właściciela' }, { label: 'Porady właściciela' }]} />
        <header className="my-6">
          <p className="text-sm uppercase tracking-widest text-silver-300">Tips &amp; tricks — z instrukcji GM</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Porady właściciela GMT400</h1>
          <p className="mt-4 text-lg leading-8 text-neutral-300">Krótkie, praktyczne porady na podstawie instrukcji obsługi (Owner’s Manual 1995–1999) i instrukcji serwisowych GM (1988, 1991, 1998). Opisujemy je własnymi słowami i przy każdej podajemy dokument oraz stronę. Wyposażenie zależy od rocznika i wersji, więc zawsze sprawdź w swoim aucie.</p>
          <p className="mt-3 text-sm leading-6 text-neutral-400">Dłuższe instrukcje krok po kroku (wymiany, naprawy) znajdziesz w <Link href="/poradniki" className="text-silver-300 underline">Poradnikach</Link>. Przepisy PL (LPG, rejestracja, światła) — w <Link href="/dla-wlasciciela" className="text-silver-300 underline">Dla właściciela</Link>.</p>
        </header>
        <OwnerTipsList />
      </div>
    </div>
  );
}
