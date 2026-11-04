import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Części eksploatacyjne GMT400 — filtry, płyny, żarówki, wycieraczki',
  description: 'Uniwersalne części eksploatacyjne do wszystkich modeli GMT400: filtry, oleje, płyny, żarówki, wycieraczki. Bezpośrednie linki do sprawdzonych produktów.',
  alternates: { canonical: 'https://www.gmt400.pl/eksploatacja' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

type Product = {
  name: string;
  asin: string;
  note: string;
  fitment?: string;
};

const categories: { name: string; items: Product[] }[] = [
  {
    name: 'Filtry',
    items: [
      { name: 'ACDelco PF52 — filtr oleju', asin: 'B000C9SU1A', note: 'Oryginalny filtr GM', fitment: '4.3/5.0/5.7/7.4 V8 1988–2000' },
      { name: 'ACDelco A1300C — filtr powietrza', asin: 'B000C9SU1A', note: 'Do Vortec 1996+', fitment: '5.7/7.4 Vortec' },
      { name: 'ACDelco GF626 — filtr paliwa', asin: 'B000C9SU1A', note: 'Filtr w linii', fitment: '1996–1999' },
    ],
  },
  {
    name: 'Płyny',
    items: [
      { name: 'MANNOL Dexron III ATF 1L', asin: 'B002K4OWDK', note: 'Spełnia GM Dexron III', fitment: '4L60-E, 4L80-E' },
      { name: 'MANNOL DOT3 płyn hamulcowy', asin: 'B0CSLG7FRR', note: 'Siedepunkt >215°C', fitment: 'Wszystkie GMT400' },
    ],
  },
  {
    name: 'Oświetlenie',
    items: [
      { name: 'Bosch H4 Pure Light 12V', asin: 'B005JU5UEW', note: 'Oryginalna jakość Bosch', fitment: 'Reflektory 12V' },
      { name: 'Osram Cool Blue Intense H4', asin: 'B00CJOBKAY', note: '+100% jasności', fitment: 'Reflektory 12V' },
    ],
  },
  {
    name: 'Wycieraczki',
    items: [
      { name: 'Bosch 18A Icon 18"', asin: 'B005JU5UEW', note: 'ClearMax 365, all-weather', fitment: 'Przednie 18"' },
    ],
  },
];

function productLink(asin: string) {
  return `https://www.amazon.de/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export default function EksploatacjaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ label: 'Części eksploatacyjne' }]} />
      <h1 className="mt-4 text-2xl font-bold text-white">Części eksploatacyjne</h1>
      <p className="mt-2 text-sm text-neutral-400">
        Uniwersalne części do wszystkich modeli GMT400. Linki prowadzą bezpośrednio do produktów na Amazon.de.
        Linki mogą być afiliacyjne — nie płacisz więcej.
      </p>

      {categories.map((cat) => (
        <section key={cat.name} className="mt-8">
          <h2 className="text-lg font-semibold text-silver-300">{cat.name}</h2>
          <ul className="mt-3 space-y-3">
            {cat.items.map((item) => (
              <li key={item.name} className="rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-3">
                <a
                  href={productLink(item.asin)}
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
        <Link href="/polecane" className="text-silver-400 hover:underline">Zobacz wszystkie polecane produkty →</Link>
      </p>
    </div>
  );
}
