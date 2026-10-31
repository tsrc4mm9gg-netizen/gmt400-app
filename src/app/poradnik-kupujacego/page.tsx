import Breadcrumbs from '../ui/Breadcrumbs';
import BuyerChecklist from './BuyerChecklist';

export const metadata = {
  title: 'Poradnik kupującego GMT400 — lista kontrolna',
  description: 'Co sprawdzić przed zakupem Chevroleta/GMC GMT400: rdza, rama, silnik, skrzynia, 4WD, elektryka, VIN i dokumenty. Kontrole z instrukcji GM ze stronami, odhaczanie zostaje w przeglądarce.',
  alternates: { canonical: 'https://www.gmt400.pl/poradnik-kupujacego' },
};

export default function PoradnikKupujacegoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Poradnik kupującego' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Poradnik kupującego</h1>
      <p className="mt-2 max-w-3xl text-neutral-300">Lista kontrolna na oględziny GMT400. Każdy punkt pochodzi z instrukcji obsługi GM (podajemy stronę) albo prowadzi do istniejącej diagnozy, usterek lub DIY. Odhaczone punkty zostają tylko w tej przeglądarce.</p>
      <BuyerChecklist />
    </div>
  );
}
