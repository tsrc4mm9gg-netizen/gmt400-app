import type { Metadata } from 'next';
import Link from 'next/link';

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
      { 
        name: 'ACDelco PF52 — filtr oleju', 
        asin: 'B000C9SU1A', 
        note: 'Oryginalny filtr GM do GMT400 (1988–2000)',
        fitment: 'Pasuje do: 4.3 V6, 5.0 V8, 5.7 V8, 7.4 V8'
      },
      { 
        name: 'ACDelco A1300C — filtr powietrza', 
        search: 'ACDelco A1300C', 
        note: 'Do silników Vortec 1996+',
        fitment: '5.7/7.4 Vortec 1996–1999'
      },
      { 
        name: 'ACDelco GF626 — filtr paliwa', 
        search: 'ACDelco GF626', 
        note: 'Filtr paliwa w linii',
        fitment: '1996–1999'
      },
    ],
  },
  {
    name: 'Płyny — specyfikacje GMT400',
    items: [
      { 
        name: 'MANNOL Dexron III ATF (1L)', 
        asin: 'B002K4OWDK', 
        note: 'Spełnia GM Dexron III',
        fitment: 'Do skrzyń 4L60-E i 4L80-E'
      },
      { 
        name: 'Olej silnikowy 5W-30', 
        search: '5W-30 engine oil', 
        note: 'Sprawdź specyfikację w instrukcji',
        fitment: 'Typowo do silników benzynowych GMT400'
      },
      { 
        name: 'Płyn chłodniczy DEX-COOL', 
        search: 'DEX-COOL coolant', 
        note: 'Oryginalny płyn GM od 1996',
        fitment: 'Vortec 1996+'
      },
    ],
  },
  {
    name: 'Części eksploatacyjne',
    items: [
      { 
        name: 'Świece ACDelco 41-932', 
        search: 'ACDelco 41-932', 
        note: 'Do silników Vortec',
        fitment: '5.0/5.7/7.4 Vortec 1996–1999'
      },
      { 
        name: 'Termostat ACDelco 131-113', 
        search: 'ACDelco 131-113', 
        note: 'Termostat 195°F (91°C)',
        fitment: 'C/K 1500 1996–1999 5.0/5.7'
      },
      { 
        name: 'Pompa wody ACDelco 252-711', 
        search: 'ACDelco 252-711', 
        note: 'Pompa wody (GM 88926225)',
        fitment: '4.3/5.0/5.7 Vortec 1996–1999'
      },
    ],
  },
  {
    name: 'Diagnostyka',
    items: [
      { 
        name: 'Skaner OBD2 Bluetooth (ELM327)', 
        asin: 'B0DGXVWWP2', 
        note: 'Do odczytu kodów błędów',
        fitment: 'Działa z GMT400 OBD-II (1996+)'
      },
      { 
        name: 'Multimetr cyfrowy', 
        search: 'digital multimeter', 
        note: 'Do pomiarów elektrycznych'
      },
    ],
  },
  {
    name: 'Narzędzia',
    items: [
      { name: 'Klucz dynamometryczny', search: 'torque wrench', note: 'Do dokręcania z momentem' },
      { name: 'Zestaw kluczy nasadowych', search: 'socket set metric', note: 'Podstawowe narzędzia' },
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Polecane produkty</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Linki do sklepów mogą być afiliacyjne — nie płacisz więcej, a wspierasz GMT400.pl.
      </p>

      {categories.map((cat) => (
        <section key={cat.name} className="mt-8">
          <h2 className="text-lg font-semibold text-silver-300">{cat.name}</h2>
          <ul className="mt-3 space-y-3">
            {cat.items.map((item) => (
              <li key={item.name} className="rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-3">
                <a
                  href={productLink(item)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="inline-flex items-center gap-1 font-medium text-silver-200 hover:text-white hover:underline"
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
        </section>
      ))}

      <p className="mt-8 text-xs text-neutral-500">
        <Link href="/" className="text-silver-400 hover:underline">← Wróć na stronę główną</Link>
      </p>
    </div>
  );
}
