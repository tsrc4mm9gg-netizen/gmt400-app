import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import FAQ from '../ui/FAQ';
import AffiliateBox from '../ui/AffiliateBox';
import PartLink from '../ui/PartLink';

export const metadata: Metadata = {
  title: 'Punkty zmiany biegów 4L60-E i 4L80-E — GMT400',
  description: 'Jak działają punkty zmiany biegów w skrzyniach 4L60-E i 4L80-E w GMT400. PCM steruje zmianami na podstawie obciążenia, prędkości i pozycji gazu.',
  alternates: { canonical: 'https://www.gmt400.pl/skrzynie' },
};

const faqItems = [
  {
    question: 'Czym różni się 4L60-E od 4L80-E?',
    answer: '4L60-E jest lżejsza i częstsza w modelach 1500. 4L80-E jest mocniejsza, przeznaczona do 2500/3500 i diesla. 4L80-E ma niższe przełożenie 1. biegu (2.48 vs 3.06) i jest bardziej wytrzymała.',
  },
  {
    question: 'Jakie są objawy zużytej skrzyni 4L60-E?',
    answer: 'Opóźnione zmiany biegów, szarpanie, ślizganie, przegrzewanie, wycieki ATF. Najczęstsze problemy: zużyte sprzęgła, uszkodzony solenoid, problemy z pompą. Regularna wymiana ATF przedłuża żywotność.',
  },
  {
    question: 'Ile kosztuje naprawa 4L60-E?',
    answer: 'Regeneracja: 2000–4000 zł. Wymiana na używaną: 1000–2000 zł. Nowa: 5000–8000 zł. Koszt zależy od zakresu uszkodzeń. Regularna wymiana ATF może zapobiec drogim naprawom.',
  },
  {
    question: 'Jak często wymieniać ATF?',
    answer: 'Co 50000–80000 km przy normalnej eksploatacji. Przy ciężkich warunkach (holowanie, góry) co 30000–50000 km. Użyj Dexron III lub nowszego. Wymiana filtra co drugą wymianę płynu.',
  },
  {
    question: 'Czy można wymienić 4L60-E na 4L80-E?',
    answer: 'Tak, ale wymaga to przeróbek: inna skrzynia rozdzielcza, inny wał napędowy, inna elektronika. Koszt przeróbki: 5000–10000 zł. Warto rozważyć przy ciężkim holowaniu.',
  },
];

export default function TransmissionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/baza', label: 'Baza wiedzy' }, { label: 'Skrzynie biegów' }]} />
      <header className="mt-4">
        <p className="text-sm uppercase tracking-wide text-silver-400">Skrzynie automatyczne</p>
        <h1 className="mt-1 text-3xl font-bold">Punkty zmiany biegów 4L60-E i 4L80-E</h1>
        <p className="mt-3 text-neutral-300">
          W GMT400 skrzynie 4L60-E i 4L80-E nie mają stałych punktów zmiany biegów. Steruje nimi sterownik PCM na podstawie obciążenia silnika, prędkości pojazdu i pozycji pedału gazu.
        </p>
      </header>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Jak to działa</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Lekki gaz = wczesne zmiany (oszczędność paliwa)</li>
          <li>Pełny gaz = późniejsze zmiany (bliżej obrotów maksymalnych)</li>
          <li>Jazda pod górę lub z przyczepą = PCM opóźnia zmiany</li>
          <li>Zimny silnik = inne mapy zmian</li>
        </ul>
        <p className="mt-3 text-sm text-neutral-400">
          Typowe pełne gazu w seryjnym GMT400 to ok. 4500–5200 obr/min, zależnie od silnika i rocznika. Nie ma jednej uniwersalnej wartości.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">4L60-E vs 4L80-E</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="font-semibold text-silver-300">4L60-E</h3>
            <p className="mt-1 text-sm text-neutral-300">Najczęstsza w 1500. Przełożenia: 3.06 / 1.63 / 1.00 / 0.70</p>
            <p className="mt-2 text-xs text-neutral-400">Moment: do ~450 Nm. Holowanie: do ~5000 lb.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="font-semibold text-silver-300">4L80-E</h3>
            <p className="mt-1 text-sm text-neutral-300">W 2500/3500 i dieslu. Przełożenia: 2.48 / 1.48 / 1.00 / 0.75</p>
            <p className="mt-2 text-xs text-neutral-400">Moment: do ~600 Nm. Holowanie: do ~10000 lb.</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Części eksploatacyjne</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Filtr ATF: <PartLink partNumber="TF289" /></li>
          <li>Uszczelka miski: <PartLink partNumber="TOS18663" /></li>
          <li>Płyn ATF: Dexron III (np. MANNOL)</li>
          <li>Solenoid zmiany: sprawdź numer na starej części</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Co sprawdzić przy problemach ze zmianami</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Poziom i stan ATF (kolor, zapach, poziom)</li>
          <li>Kody błędów (P0700, P0751–P0758 itp.)</li>
          <li>Czujnik prędkości (VSS)</li>
          <li>Czujnik położenia przepustnicy (TPS)</li>
          <li>Filtr ATF (wymiana co 100000 km)</li>
        </ul>
        <Link href="/diagnoza?objaw=skrzynia" className="mt-4 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
          Diagnoza skrzyni →
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Wskazówki eksploatacyjne</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-neutral-300">
          <li>Rozgrzewaj skrzynię przed jazdą (szczególnie zimą)</li>
          <li>Unikaj holowania na zimnej skrzyni</li>
          <li>Sprawdzaj poziom ATF co 10000 km</li>
          <li>Wymieniaj filtr ATF co drugą wymianę płynu</li>
          <li>Przy ciężkim holowaniu rozważ dodatkową chłodnicę ATF</li>
        </ul>
      </section>

      <AffiliateBox
        title="Przydatne przy obsłudze skrzyni"
        items={[
          { name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' },
          { name: 'Filtr ATF TF289', search: 'ACDelco TF289' },
          { name: 'Uszczelka miski ATF', search: 'Fel-Pro TOS18663' },
        ]}
      />

      <FAQ items={faqItems} />
    </div>
  );
}
