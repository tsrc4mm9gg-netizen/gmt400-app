import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import TorqueBrowser from './TorqueBrowser';
import { TORQUE_ROWS } from '@/lib/torque-gm';

export const metadata = {
  title: 'Momenty dokręcania GMT400 (C/K, Suburban, Tahoe, Yukon) — z instrukcji GM',
  description: 'Momenty dokręcania śrub i nakrętek GMT400 1988–2000 według układów: silnik, paliwo, skrzynia, mosty, układ kierowniczy, hamulce, elektryka, klimatyzacja i nadwozie — w Nm i lb-ft, z silnikiem, rocznikiem i stroną instrukcji GM.',
  alternates: { canonical: 'https://www.gmt400.pl/momenty-dokrecania' },
};

export default function MomentyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Mój samochód', href: '/moj-samochod' }, { label: 'Momenty dokręcania' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Momenty dokręcania (1988–2000)</h1>
      <p className="mt-2 text-neutral-300">
        {TORQUE_ROWS.length} wartości wyłącznie z instrukcji serwisowych i naprawczych GM, z numerem strony pliku PDF. Najpierw Nm, w nawiasie
        jednostka z instrukcji (lb-ft lub lb-in). Gdy ta sama nazwa części ma w dokumentach kilka wartości, każdą przypisaliśmy do konkretnego
        podzespołu, wersji i rocznika (linia „Dotyczy”) na podstawie stron instrukcji. Wartości, których nie da się jednoznacznie
        przypisać, oraz te dotyczące zespołów spoza GMT400 nie są publikowane. Momenty kół i świec znajdziesz też w <Link href="/pojemnosci" className="text-silver-300 underline">Pojemnościach i płynach</Link>.
      </p>
      <p className="mt-2 rounded-xl border border-silver-600/40 bg-silver-950/30 p-3 text-sm text-neutral-200">
        Sprawdź w swoim aucie: wersja silnika, skrzyni i mostu oraz rocznik muszą się zgadzać. Część wartości pochodzi z podręczników
        podzespołów (Unit Repair) — dotyczą danego zespołu, montowanego także w innych autach GM. Przy śrubach dokręcanych kątowo lub
        jednorazowych postępuj według procedury z instrukcji.
      </p>
      <AffiliateBox
        title="Przydatne przy dokręcaniu"
        items={[
          { name: 'Klucz dynamometryczny', search: 'torque wrench' },
          { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
          { name: 'Klucz dynamometryczny 1/2"', search: 'torque wrench 1/2 inch' },
        ]}
      />
      <TorqueBrowser />
    </div>
  );
}
