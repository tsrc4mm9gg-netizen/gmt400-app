import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Polecane produkty GMT400 — części, narzędzia, diagnostyka',
  description: 'Polecane produkty dla właścicieli GMT400: oleje, filtry, narzędzia, skanery OBD. Linki afiliacyjne — nie płacisz więcej.',
  alternates: { canonical: 'https://www.gmt400.pl/polecane' },
};

const AFFILIATE_TAG = 'gmt400pl-20';

const categories = [
  {
    name: 'Diagnostyka',
    items: [
      { name: 'Skaner OBD2', search: 'OBD2+scanner+car', note: 'Do odczytu kodów błędów' },
      { name: 'Multimetr', search: 'digital+multimeter', note: 'Do pomiarów elektrycznych' },
    ],
  },
  {
    name: 'Oleje i płyny',
    items: [
      { name: 'Olej silnikowy 5W-30', search: '5W-30+engine+oil', note: 'Do silników benzynowych' },
      { name: 'ATF Dexron III', search: 'Dexron+III+ATF', note: 'Do skrzyń 4L60-E / 4L80-E' },
      { name: 'Płyn chłodniczy', search: 'coolant+antifreeze', note: 'Do układu chłodzenia' },
    ],
  },
  {
    name: 'Filtry',
    items: [
      { name: 'Filtr oleju', search: 'oil+filter+GMT400', note: 'Wymiana co 5000–8000 km' },
      { name: 'Filtr powietrza', search: 'air+filter+GMT400', note: 'Wymiana co 15 000 km' },
      { name: 'Filtr paliwa', search: 'fuel+filter+GMT400', note: 'Wymiana co 30 000 km' },
    ],
  },
  {
    name: 'Narzędzia',
    items: [
      { name: 'Klucz dynamometryczny', search: 'torque+wrench', note: 'Do dokręcania z momentem' },
      { name: 'Zestaw kluczy nasadowych', search: 'socket+set+metric', note: 'Podstawowe narzędzia' },
    ],
  },
];

function amazonLink(search: string) {
  return `https://www.amazon.de/s?k=${encodeURIComponent(search)}&tag=${AFFILIATE_TAG}`;
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
          <ul className="mt-3 space-y-2">
            {cat.items.map((item) => (
              <li key={item.name} className="rounded-lg border border-white/10 bg-neutral-900/50 px-4 py-3">
                <a
                  href={amazonLink(item.search)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-silver-200 hover:text-white hover:underline"
                >
                  {item.name}
                </a>
                <p className="mt-1 text-xs text-neutral-500">{item.note}</p>
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
