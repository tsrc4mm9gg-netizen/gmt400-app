import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import PartLink from '../ui/PartLink';
import AccordionSection from '../ui/AccordionSection';
import TorqueBrowser from './TorqueBrowser';
import { TORQUE_ROWS } from '@/lib/torque-gm';

export const metadata = {
  title: 'Momenty dokręcania GMT400 (C/K, Suburban, Tahoe, Yukon) — z instrukcji GM',
  description: 'Momenty dokręcania śrub i nakrętek GMT400 1988–2000 według układów: silnik, paliwo, skrzynia, mosty, układ kierowniczy, hamulce, elektryka, klimatyzacja i nadwozie — w Nm i lb-ft, z silnikiem, rocznikiem i stroną instrukcji GM.',
  alternates: { canonical: 'https://www.gmt400.pl/momenty-dokrecania' },
};

const COMMON_TORQUES = [
  { name: 'Śruba koła (nakrętka)', torque: '140 Nm (100 lb-ft)', note: 'Wszystkie modele' },
  { name: 'Świeca zapłonowa', torque: '15–20 Nm (11–15 lb-ft)', note: 'Vortec' },
  { name: 'Miska olejowa', torque: '12 Nm (9 lb-ft)', note: 'Silnik' },
  { name: 'Pokrywa zaworów', torque: '10 Nm (7 lb-ft)', note: 'Silnik' },
  { name: 'Filtr oleju', torque: 'Ręcznie + 3/4 obrotu', note: 'Nie kluczem' },
];

const TIPS = [
  { title: 'Przed dokręcaniem', tip: 'Sprawdź, czy klucz dynamometryczny jest skalibrowany. Oczyść gwinty. Użyj odpowiedniego smaru (jeśli wymagany).' },
  { title: 'Podczas dokręcania', tip: 'Dokręcaj w odpowiedniej kolejności (np. głowica — od środka). Nie dokręcaj na siłę — jeśli śruba nie wchodzi, sprawdź gwint.' },
  { title: 'Po dokręceniu', tip: 'Sprawdź moment po przejechaniu kilku km (niektóre śruby się luzują). Nie dokręcaj ponownie bez potrzeby.' },
];

const faqItems = [
  {
    question: 'Dlaczego momenty dokręcania są ważne?',
    answer: 'Zbyt słabe dokręcenie może spowodować poluzowanie śruby i uszkodzenie. Zbyt mocne może zerwać gwint lub uszkodzić część. Klucz dynamometryczny zapewnia prawidłową siłę dokręcenia.',
  },
  {
    question: 'Jak przeliczyć lb-ft na Nm?',
    answer: '1 lb-ft = 1.356 Nm. Przykład: 100 lb-ft = 136 Nm. W tabelach podajemy obie jednostki. Zawsze sprawdzaj, którą jednostkę używa Twój klucz.',
  },
  {
    question: 'Czy wszystkie śruby wymagają klucza dynamometrycznego?',
    answer: 'Krytyczne połączenia (głowica, koła, zawieszenie, hamulce) wymagają klucza dynamometrycznego. Mniej krytyczne można dokręcać ręcznie, ale lepiej użyć klucza dla pewności.',
  },
  {
    question: 'Co oznacza dokręcanie kątowe?',
    answer: 'Niektóre śruby (np. głowicy) dokręca się najpierw do określonego momentu, a potem o dodatkowy kąt (np. +90°). Wymaga to specjalnego narzędzia lub zaznaczenia pozycji. Procedura jest w instrukcji.',
  },
];

export default function MomentyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 pb-28 text-white sm:py-10">
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

      <div className="mt-6">
        <AccordionSection title="Wskazówki dokręcania" defaultOpen>
          <div className="space-y-3">
            {TIPS.map(item => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-neutral-800 p-3">
                <h3 className="font-semibold text-silver-200">{item.title}</h3>
                <p className="mt-1 text-sm text-neutral-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </AccordionSection>

        <AccordionSection title="Najczęstsze momenty">
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-800 text-neutral-300">
                <tr>
                  <th className="p-3">Połączenie</th>
                  <th className="p-3">Moment</th>
                  <th className="p-3">Uwagi</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_TORQUES.map(row => (
                  <tr key={row.name} className="border-t border-white/10">
                    <td className="p-3 font-medium">{row.name}</td>
                    <td className="p-3 text-silver-300">{row.torque}</td>
                    <td className="p-3 text-neutral-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Wartości orientacyjne. Sprawdź w pełnej tabeli poniżej lub w instrukcji.</p>
        </AccordionSection>

        <AccordionSection title="Uszczelki i części">
          <ul className="space-y-2 text-neutral-300">
            <li className="flex items-center gap-2">Uszczelka miski ATF: <PartLink partNumber="TOS18663" /></li>
            <li className="flex items-center gap-2">Filtr oleju: <PartLink partNumber="PF52" /></li>
            <li className="flex items-center gap-2">Świece zapłonowe: <PartLink partNumber="41-932" /></li>
          </ul>
        </AccordionSection>

        <AccordionSection title="Przydatne przy dokręcaniu">
          <AffiliateBox
            title=""
            items={[
              { name: 'Klucz dynamometryczny 1/2"', search: 'torque wrench 1/2 inch' },
              { name: 'Klucz dynamometryczny 3/8"', search: 'torque wrench 3/8 inch' },
              { name: 'Zestaw kluczy nasadowych', search: 'socket set metric' },
              { name: 'Klucz dynamometryczny kątowy', search: 'angle torque wrench' },
            ]}
          />
        </AccordionSection>
      </div>

      <TorqueBrowser />

      <div className="mt-6">
        <AccordionSection title="Częste pytania">
          <FAQ items={faqItems} />
        </AccordionSection>
      </div>
    </div>
  );
}
