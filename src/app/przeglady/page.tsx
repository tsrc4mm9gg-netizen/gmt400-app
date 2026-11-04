import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import FAQ from '../ui/FAQ';
import MaintenancePlanner from './MaintenancePlanner';

export const metadata = {
  title: 'Harmonogram przeglądów — GMT400',
  description: 'Interwały serwisowe GMT400 z dokumentów GM 1988–1999: olej, ATF, płyn chłodniczy, świece, filtry, mosty. Harmonogram normalny i ciężkie warunki, przypomnienia w kalendarzu.',
  alternates: { canonical: 'https://www.gmt400.pl/przeglady' },
};

const faqItems = [
  {
    question: 'Jak często wymieniać olej w GMT400?',
    answer: 'GM zaleca wymianę co 5000–10000 km (3000–6000 mil) w zależności od warunków jazdy. Przy ciężkich warunkach (miasto, holowanie, kurz) częściej. Zawsze wymieniaj filtr oleju razem z olejem.',
  },
  {
    question: 'Kiedy wymieniać ATF w 4L60-E?',
    answer: 'Co 50000–80000 km przy normalnej eksploatacji. Przy ciężkich warunkach (holowanie, góry) co 30000–50000 km. Wymiana filtra ATF co drugą wymianę płynu.',
  },
  {
    question: 'Jak często wymieniać świece?',
    answer: 'Platynowe (41-932): co 100000 km. Standardowe: co 30000–50000 km. Sprawdź przerwę elektrod przy wymianie (typowa: 1.5 mm dla Vortec).',
  },
  {
    question: 'Co obejmuje przegląd GMT400?',
    answer: 'Podstawowy: olej + filtr, sprawdzenie płynów, opon, hamulców. Rozszerzony: filtry (powietrze, paliwo), świece, ATF, płyn chłodniczy. Pełny: wszystkie powyższe + diagnostyka, zawieszenie, układ wydechowy.',
  },
];

export default function PrzegladyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Mój samochód', href: '/moj-samochod' }, { label: 'Harmonogram przeglądów' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Harmonogram przeglądów</h1>
      <p className="mt-2 text-neutral-300">Interwały wyłącznie z dokumentów GM: instrukcje serwisowe 1988–1994 (sekcja 0B „Scheduled Maintenance Services”) i instrukcje obsługi 1995–1999 (rozdział 7 „Maintenance Schedule”). Kilometry przeliczone z mil i zaokrąglone — oryginał w milach podajemy obok. Stan licznika i daty zostają tylko w tej przeglądarce. Sprawdź w swoim aucie.</p>
      <MaintenancePlanner />
      <AffiliateBox
        title="Przydatne przy przeglądach"
        items={[
          { name: 'ACDelco PF52 — filtr oleju', search: 'ACDelco PF52' },
          { name: 'Olej silnikowy 5W-30', search: '5W-30 engine oil' },
          { name: 'MANNOL Dexron III ATF', search: 'MANNOL Dexron III ATF' },
          { name: 'Płyn chłodniczy DEX-COOL', search: 'DEX-COOL coolant' },
          { name: 'Świece ACDelco 41-932', search: 'ACDelco 41-932' },
        ]}
      />
      <FAQ items={faqItems} />
    </div>
  );
}
