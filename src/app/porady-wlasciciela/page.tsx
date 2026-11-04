import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import OwnerTipsList from './OwnerTipsList';

export const metadata: Metadata = {
  title: 'Porady właściciela GMT400 — z instrukcji GM 1988–1999',
  description: 'Praktyczne porady dla właściciela Chevrolet/GMC C/K, Tahoe, Yukon i Suburban 1988–1999: 4×4, przyczepa, opony, łańcuchy, pilot, PassLock, bezpieczniki, kody ALDL i test kompresji — każda ze stroną instrukcji GM.',
  alternates: { canonical: 'https://www.gmt400.pl/porady-wlasciciela' },
};

const faqItems = [
  {
    question: 'Jak używać napędu 4×4 w GMT400?',
    answer: '4H (wysoki): do jazdy po śliskiej nawierzchni, żwirze, śniegu. 4L (niski): do ciężkiego terenu, holowania. Nie używaj 4×4 na suchej asfaltowej nawierzchni — może uszkodzić skrzynię rozdzielczą. Przełączaj przy niskiej prędkości.',
  },
  {
    question: 'Jakie opony do GMT400?',
    answer: 'Rozmiar zależy od modelu i rocznika. Typowe: 245/75R16, 265/75R16. Sprawdź naklejkę w drzwiach. Zimowe: minimum 4 mm bieżnika. Łańcuchy: sprawdź, czy mieszczą się w nadkolach.',
  },
  {
    question: 'Co to jest PassLock?',
    answer: 'System immobilizera w GMT400 (1998+). Wymaga klucza z chipem. Przy problemach z uruchomieniem: sprawdź baterię w pilocie, spróbuj drugiego klucza, odłącz akumulator na 15 minut. Reset może wymagać skanera.',
  },
  {
    question: 'Gdzie są bezpieczniki w GMT400?',
    answer: 'Skrzynka pod maską (silnik) i pod deską rozdzielczą (kabina). Schemat jest na pokrywie skrzynki lub w instrukcji. Najczęstsze problemy: bezpiecznik pompy paliwa, zapłonu, oświetlenia.',
  },
];

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
        <FAQ items={faqItems} />
      </div>
    </div>
  );
}
