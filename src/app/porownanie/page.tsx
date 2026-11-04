import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '../ui/Breadcrumbs';
import AccordionSection from '../ui/AccordionSection';

export const metadata: Metadata = {
  title: 'Porównanie modeli GMT400 — Tahoe vs Suburban vs Silverado',
  description: 'Porównaj modele GMT400: Tahoe, Suburban, Silverado, Sierra, Yukon. Różnice w pojemności, silnikach, ładowności i przeznaczeniu.',
  alternates: { canonical: 'https://www.gmt400.pl/porownanie' },
};

const MODELS = [
  {
    name: 'Tahoe',
    type: 'SUV',
    length: 'Krótki',
    seats: '5–6',
    cargo: 'Średnia',
    engines: '4.3, 5.7, 6.5 TD',
    towing: 'Do 3.5 t',
    bestFor: 'Miasto, rodzina',
    pros: ['Kompaktowy', 'Zwrotny', 'Dobry do miasta'],
    cons: ['Mniej miejsca', 'Krótszy'],
  },
  {
    name: 'Suburban',
    type: 'SUV',
    length: 'Długi',
    seats: '6–9',
    cargo: 'Duża',
    engines: '5.7, 7.4, 6.5 TD',
    towing: 'Do 4.5 t',
    bestFor: 'Rodzina, holowanie',
    pros: ['Dużo miejsca', 'Dobra ładowność', 'Komfort'],
    cons: ['Długi', 'Większe zużycie'],
  },
  {
    name: 'Silverado / Sierra',
    type: 'Pickup',
    length: 'Różna',
    seats: '3–6',
    cargo: 'Skrzynia',
    engines: '4.3, 5.0, 5.7, 7.4, 6.5 TD',
    towing: 'Do 5 t',
    bestFor: 'Praca, holowanie',
    pros: ['Skrzynia ładunkowa', 'Duża ładowność', 'Uniwersalny'],
    cons: ['Otwarta skrzynia', 'Mniej komfortu'],
  },
  {
    name: 'Yukon',
    type: 'SUV',
    length: 'Krótki',
    seats: '5–6',
    cargo: 'Średnia',
    engines: '5.7, 6.5 TD',
    towing: 'Do 3.5 t',
    bestFor: 'Miasto, rodzina',
    pros: ['Jak Tahoe', 'GMC', 'Dobre wyposażenie'],
    cons: ['Mniej miejsca', 'Rzadszy'],
  },
];

const ENGINES = [
  { name: '4.3 V6', power: '~160 KM', fuel: '10–14 L', best: 'Miasto, oszczędność' },
  { name: '5.0 V8', power: '~175 KM', fuel: '12–16 L', best: 'Kompromis' },
  { name: '5.7 TBI', power: '~210 KM', fuel: '13–18 L', best: 'Prosta naprawa' },
  { name: '5.7 Vortec', power: '~255 KM', fuel: '12–17 L', best: 'Najpopularniejszy' },
  { name: '7.4 Vortec', power: '~290 KM', fuel: '16–22 L', best: 'Holowanie' },
  { name: '6.5 TD', power: '~180 KM', fuel: '10–14 L', best: 'Diesel, moment' },
];

export default function PorownaniePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-28 text-white">
      <Breadcrumbs items={[{ href: '/modele', label: 'Modele' }, { label: 'Porównanie' }]} />
      <header className="mt-4">
        <h1 className="text-3xl font-bold text-silver-400">Porównanie modeli GMT400</h1>
        <p className="mt-2 text-neutral-300">
          Wybierz model dopasowany do Twoich potrzeb. Porównaj pojemność, silniki i przeznaczenie.
        </p>
      </header>

      <section className="mt-6">
        <h2 className="text-xl font-semibold text-silver-300">Modele</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left font-medium text-silver-400">Model</th>
                <th className="p-3 text-left font-medium text-silver-400">Typ</th>
                <th className="p-3 text-left font-medium text-silver-400">Miejsca</th>
                <th className="p-3 text-left font-medium text-silver-400">Bagaż</th>
                <th className="p-3 text-left font-medium text-silver-400">Holowanie</th>
                <th className="p-3 text-left font-medium text-silver-400">Najlepszy do</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map(m => (
                <tr key={m.name} className="border-b border-white/5">
                  <td className="p-3 font-medium text-white">{m.name}</td>
                  <td className="p-3 text-neutral-300">{m.type}</td>
                  <td className="p-3 text-neutral-300">{m.seats}</td>
                  <td className="p-3 text-neutral-300">{m.cargo}</td>
                  <td className="p-3 text-neutral-300">{m.towing}</td>
                  <td className="p-3 text-silver-300">{m.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-6">
        {MODELS.map(m => (
          <AccordionSection key={m.name} title={m.name}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium text-silver-300">Zalety</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
                  {m.pros.map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-silver-300">Wady</h4>
                <ul className="mt-2 list-inside list-disc text-sm text-neutral-300">
                  {m.cons.map(c => <li key={c}>{c}</li>)}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-400">Silniki: {m.engines}</p>
          </AccordionSection>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-silver-300">Silniki</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-left font-medium text-silver-400">Silnik</th>
                <th className="p-3 text-left font-medium text-silver-400">Moc</th>
                <th className="p-3 text-left font-medium text-silver-400">Zużycie</th>
                <th className="p-3 text-left font-medium text-silver-400">Najlepszy do</th>
              </tr>
            </thead>
            <tbody>
              {ENGINES.map(e => (
                <tr key={e.name} className="border-b border-white/5">
                  <td className="p-3 font-medium text-white">{e.name}</td>
                  <td className="p-3 text-neutral-300">{e.power}</td>
                  <td className="p-3 text-neutral-300">{e.fuel}</td>
                  <td className="p-3 text-silver-300">{e.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h2 className="text-lg font-semibold text-silver-300">Który wybrać?</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-300">
          <li><strong className="text-white">Miasto, rodzina:</strong> Tahoe lub Yukon z 5.7 Vortec</li>
          <li><strong className="text-white">Duża rodzina, bagaż:</strong> Suburban z 5.7 lub 7.4</li>
          <li><strong className="text-white">Praca, holowanie:</strong> Silverado/Sierra z 7.4 lub 6.5 TD</li>
          <li><strong className="text-white">Oszczędność:</strong> Tahoe z 4.3 V6 lub 6.5 TD</li>
          <li><strong className="text-white">Prosta naprawa:</strong> Modele 1988–1995 z TBI</li>
        </ul>
      </section>

      <p className="mt-6 text-sm text-neutral-400">
        <Link href="/modele" className="text-silver-400 hover:underline">← Wszystkie modele</Link>
      </p>
    </div>
  );
}
