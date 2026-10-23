import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import VinDecoder from '../VinDecoder';

export const metadata: Metadata = {
  title: 'Sprawdź swój VIN — dekoder GMT400 1988–2000',
  description: 'Wpisz 17-znakowy VIN Chevroleta lub GMC C/K, Suburbana, Tahoe albo Yukona 1988–2000: rocznik, silnik, nadwozie i fabryka ze źródłami GM, a do tego kody RPO z naklejki.',
  alternates: { canonical: 'https://www.gmt400.pl/vin' },
};

export default function VinPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Sprawdź VIN' }]} />
      <h1 className="text-3xl font-bold text-red-400">Sprawdź swój VIN</h1>
      <p className="mb-5 mt-2 text-neutral-300">Wpisz albo wklej VIN — zobaczysz rocznik, silnik, nadwozie i fabrykę. Szczegóły każdej pozycji i źródła są niżej w rozwijanych sekcjach. Wynik możesz zapisać w <Link href="/moj-samochod" className="text-red-400 underline">Mój samochód</Link>.</p>
      <VinDecoder withRpo />
    </div>
  );
}
