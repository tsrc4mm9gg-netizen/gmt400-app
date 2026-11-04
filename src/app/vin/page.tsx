import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import VinDecoder from '../VinDecoder';

export const metadata: Metadata = {
  title: 'Sprawdź swój VIN — dekoder GMT400 1988–2000',
  description: 'Wpisz 17-znakowy VIN Chevroleta lub GMC C/K, Suburbana, Tahoe albo Yukona 1988–2000: rocznik, silnik, nadwozie i fabryka ze źródłami GM, a do tego kody RPO z naklejki.',
  alternates: { canonical: 'https://www.gmt400.pl/vin' },
};

const faqItems = [
  {
    question: 'Gdzie znajdę VIN w GMT400?',
    answer: 'VIN jest na tabliczce w lewym dolnym rogu przedniej szyby (widoczny z zewnątrz), na słupku drzwi kierowcy, na ramie (pod siedzeniem pasażera) oraz w dokumentach (dowód rejestracyjny, karta pojazdu).',
  },
  {
    question: 'Co oznacza VIN?',
    answer: 'VIN (Vehicle Identification Number) to 17-znakowy kod identyfikujący pojazd. Zawiera informacje o producencie, modelu, roczniku, silniku, fabryce i numerze seryjnym.',
  },
  {
    question: 'Czym są kody RPO?',
    answer: 'RPO (Regular Production Option) to kody wyposażenia fabrycznego. Znajdują się na naklejce w schowku lub na słupku drzwi. Określają silnik, skrzynię, przełożenie mostu, kolor i inne opcje.',
  },
  {
    question: 'Czy dekoder VIN pokazuje historię pojazdu?',
    answer: 'Dekoder pokazuje dane fabryczne (rocznik, silnik, nadwozie). Historia pojazdu (wypadki, przebieg, właściciele) wymaga płatnych raportów z baz typu Carfax lub VinAudit.',
  },
  {
    question: 'Jakie części pasują do mojego VIN?',
    answer: 'Po zdekodowaniu VIN poznasz rocznik i silnik. Większość części eksploatacyjnych (filtry, świece, płyny) pasuje do całej rodziny GMT400. Sprawdź stronę Eksploatacja dla uniwersalnych części.',
  },
];

export default function VinPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Sprawdź VIN' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Sprawdź swój VIN</h1>
      <p className="mb-5 mt-2 text-neutral-300">Wpisz albo wklej VIN — zobaczysz rocznik, silnik, nadwozie i fabrykę. Szczegóły każdej pozycji i źródła są niżej w rozwijanych sekcjach. Wynik możesz zapisać w <Link href="/moj-samochod" className="text-silver-400 underline">Mój samochód</Link>.</p>
      <VinDecoder withRpo prefillFromUrl />

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-silver-300">Uniwersalne części do GMT400</h2>
        <p className="mt-2 text-sm text-neutral-400">Po zdekodowaniu VIN sprawdź, które części pasują do Twojego auta:</p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Filtr oleju: <PartLink partNumber="PF52" /></li>
          <li>Świece Vortec (1996+): <PartLink partNumber="41-932" /></li>
          <li>Przewody zapłonowe: <PartLink partNumber="9718D" /></li>
          <li>Klocki hamulcowe: <PartLink partNumber="14D52" /></li>
        </ul>
        <Link href="/eksploatacja" className="mt-4 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Wszystkie części eksploatacyjne →
        </Link>
      </section>

      <AffiliateBox
        title="Przydatne przy identyfikacji"
        items={[
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Latarka inspekcyjna', search: 'inspection flashlight LED' },
        ]}
      />
      <FAQ items={faqItems} />
    </div>
  );
}
