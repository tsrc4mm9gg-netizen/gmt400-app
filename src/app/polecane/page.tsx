import type { Metadata } from 'next';
import Link from 'next/link';
import AccordionSection from '../ui/AccordionSection';

export const metadata: Metadata = {
  title: 'Polecane produkty GMT400 — części, narzędzia, diagnostyka',
  description: 'Polecane produkty dla właścicieli GMT400: oleje, filtry, narzędzia, skanery OBD. Linki afiliacyjne — nie płacisz więcej.',
  alternates: { canonical: 'https://www.gmt400.pl/polecane' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

type Product = {
  name: string;
  note: string;
  asin?: string;
  search?: string;
  fitment?: string;
};

const categories: { name: string; items: Product[] }[] = [
  {
    name: 'Filtry — sprawdzone do GMT400',
    items: [
      { name: 'ACDelco PF52 — filtr oleju', asin: 'B000C9SU1A', note: 'Oryginalny filtr GM', fitment: '4.3/5.0/5.7/7.4 V8 1988–2000' },
      { name: 'ACDelco A1300C — filtr powietrza', search: 'ACDelco A1300C', note: 'Do Vortec 1996+', fitment: '5.7/7.4 Vortec' },
      { name: 'ACDelco GF626 — filtr paliwa', search: 'ACDelco GF626', note: 'Filtr w linii', fitment: '1996–1999' },
      { name: 'ACDelco TF289 — filtr ATF', search: 'ACDelco TF289', note: 'Filtr skrzyni + uszczelka', fitment: '4L60-E' },
    ],
  },
  {
    name: 'Płyny — specyfikacje GMT400',
    items: [
      { name: 'MANNOL Dexron III ATF (1L)', asin: 'B002K4OWDK', note: 'Spełnia GM Dexron III', fitment: '4L60-E, 4L80-E' },
      { name: 'Olej 5W-30', search: '5W-30 engine oil', note: 'Silniki benzynowe', fitment: 'GMT400 benzyna' },
      { name: 'Olej 10W-30', search: '10W-30 engine oil', note: 'Cieplejszy klimat', fitment: 'GMT400 benzyna' },
      { name: 'Olej 15W-40', search: '15W-40 diesel oil', note: 'Diesel', fitment: '6.5 TD' },
      { name: 'DEX-COOL płyn chłodniczy', search: 'DEX-COOL coolant', note: 'Oryginalny GM', fitment: 'Vortec 1996+' },
      { name: 'Płyn hamulcowy DOT3', search: 'DOT3 brake fluid', note: 'Siedepunkt >215°C', fitment: 'Wszystkie GMT400' },
    ],
  },
  {
    name: 'Zapłon',
    items: [
      { name: 'Świece ACDelco 41-932', search: 'ACDelco 41-932', note: 'Platynowe', fitment: '5.0/5.7/7.4 Vortec' },
      { name: 'Przewody zapłonowe 9718D', search: 'ACDelco 9718D', note: 'Zestaw przewodów', fitment: 'GMT400 V8' },
      { name: 'Cewka zapłonowa D577', search: 'ACDelco D577', note: 'Cewka', fitment: 'Vortec 1996+' },
    ],
  },
  {
    name: 'Chłodzenie',
    items: [
      { name: 'Termostat ACDelco 131-113', search: 'ACDelco 131-113', note: '195°F (91°C)', fitment: 'C/K 1500 1996–1999' },
      { name: 'Pompa wody ACDelco 252-711', search: 'ACDelco 252-711', note: 'Pompa wody', fitment: '4.3/5.0/5.7 Vortec' },
    ],
  },
  {
    name: 'Hamulce',
    items: [
      { name: 'Klocki hamulcowe 14D52', search: 'ACDelco 14D52', note: 'Semi-metallic, przód', fitment: 'GMT400 przód' },
      { name: 'Płyn hamulcowy DOT3', search: 'DOT3 brake fluid', note: 'MANNOL DOT3', fitment: 'Wszystkie GMT400' },
    ],
  },
  {
    name: 'Paliwo',
    items: [
      { name: 'Pompa paliwa EP381', search: 'fuel pump EP381', note: 'Zamienna', fitment: 'GMT400 1996–1997' },
      { name: 'Filtr paliwa GF626', search: 'ACDelco GF626', note: 'Filtr w linii', fitment: '1996–1999' },
    ],
  },
  {
    name: 'Diagnostyka',
    items: [
      { name: 'Skaner OBD2 Bluetooth', asin: 'B0DGXVWWP2', note: 'Do odczytu kodów', fitment: 'OBD-II (1996+)' },
      { name: 'Skaner OBD2 z wyświetlaczem', search: 'OBD2 scanner handheld', note: 'Nie wymaga telefonu' },
      { name: 'Multimetr cyfrowy', search: 'digital multimeter', note: 'Do pomiarów' },
      { name: 'Manometr paliwa', search: 'fuel pressure gauge', note: 'Ciśnienie paliwa' },
    ],
  },
  {
    name: 'Narzędzia',
    items: [
      { name: 'Klucz dynamometryczny 1/2"', search: 'torque wrench 1/2 inch', note: 'Do kół, zawieszenia' },
      { name: 'Klucz dynamometryczny 3/8"', search: 'torque wrench 3/8 inch', note: 'Do mniejszych śrub' },
      { name: 'Zestaw kluczy nasadowych', search: 'socket set metric', note: 'Podstawowe narzędzia' },
      { name: 'Podnośnik hydrauliczny', search: 'hydraulic floor jack', note: 'Do podnoszenia' },
      { name: 'Podpory (jack stands)', search: 'jack stands', note: 'Bezpieczeństwo' },
    ],
  },
  {
    name: 'Oświetlenie',
    items: [
      { name: 'Bosch H4 Pure Light', search: 'Bosch H4', note: 'Reflektory', fitment: '12V' },
      { name: 'Osram Cool Blue Intense H4', search: 'Osram H4', note: '+100% jasności', fitment: '12V' },
    ],
  },
  {
    name: 'Wycieraczki',
    items: [
      { name: 'Bosch 18" Icon', search: 'Bosch 18A Icon', note: 'ClearMax 365', fitment: 'Przednie 18"' },
      { name: 'Bosch 16" Icon', search: 'Bosch 16A Icon', note: 'ClearMax 365', fitment: 'Przednie 16"' },
    ],
  },
];

function productLink(item: Product) {
  if (item.asin) {
    return `https://www.amazon.de/dp/${item.asin}?tag=${AFFILIATE_TAG}`;
  }
  return `https://www.amazon.de/s?k=${encodeURIComponent(item.search || '')}&tag=${AFFILIATE_TAG}`;
}

export default function PolecanePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-28">
      <h1 className="text-2xl font-bold text-white">Polecane produkty</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Linki do sklepów mogą być afiliacyjne — nie płacisz więcej, a wspierasz GMT400.pl.
      </p>

      <div className="mt-6">
        {categories.map((cat, i) => (
          <AccordionSection key={cat.name} title={cat.name} defaultOpen={i < 3}>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item.name} className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-2">
                  <a
                    href={productLink(item)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1 font-medium text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    {item.name} <span className="text-xs opacity-50">↗</span>
                  </a>
                  <p className="mt-1 text-sm text-neutral-400">{item.note}</p>
                  {item.fitment && (
                    <p className="mt-1 text-xs text-silver-400">{item.fitment}</p>
                  )}
                </li>
              ))}
            </ul>
          </AccordionSection>
        ))}
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        <Link href="/" className="text-silver-400 hover:underline">← Wróć na stronę główną</Link>
      </p>
    </div>
  );
}
