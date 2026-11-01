import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import VinDecoder from '../VinDecoder';

export const metadata: Metadata = {
  title: 'Dekoder VIN GMT400 — Tahoe, Suburban, Silverado 1988–2000',
  description: 'Rozkoduj 17-znakowy VIN Chevroleta lub GMC GMT400 (Tahoe, Suburban, Silverado, Sierra, Yukon). Rocznik, silnik, nadwozie, fabryka i kody RPO. Darmowy dekoder po polsku.',
  alternates: { canonical: 'https://www.gmt400.pl/vin' },
  openGraph: {
    title: 'Dekoder VIN GMT400',
    description: 'Sprawdź rocznik, silnik i nadwozie swojego Tahoe, Suburban lub Silverado po VIN.',
  },
};

export default function VinPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Sprawdź VIN' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Sprawdź swój VIN</h1>
      <p className="mb-5 mt-2 text-neutral-300">Wpisz albo wklej VIN — zobaczysz rocznik, silnik, nadwozie i fabrykę. Szczegóły każdej pozycji i źródła są niżej w rozwijanych sekcjach. Wynik możesz zapisać w <Link href="/moj-samochod" className="text-silver-400 underline">Mój samochód</Link>.</p>
      <VinDecoder withRpo prefillFromUrl />
    </div>
  );
}
