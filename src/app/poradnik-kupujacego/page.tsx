import type { Metadata } from 'next';
import Breadcrumbs from '../ui/Breadcrumbs';
import AffiliateBox from '../ui/AffiliateBox';
import BuyerChecklist from './BuyerChecklist';

export const metadata: Metadata = {
  title: 'Poradnik kupującego GMT400 — co sprawdzić przed zakupem Tahoe / Suburban / Silverado',
  description: 'Lista kontrolna przed zakupem Chevrolet Tahoe, Suburban, Silverado lub GMC GMT400 (1988–2000). Rdza, rama, silnik, skrzynia 4L60-E, 4WD, VIN i dokumenty. Punkty z instrukcji GM.',
  alternates: { canonical: 'https://www.gmt400.pl/poradnik-kupujacego' },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'GMT400',
    url: 'https://www.gmt400.pl/poradnik-kupujacego',
    title: 'Poradnik kupującego GMT400',
    description: 'Co sprawdzić przed zakupem Tahoe, Suburban lub Silverado — lista kontrolna.',
  },
};

export default function PoradnikKupujacegoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Poradnik kupującego' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Poradnik kupującego</h1>
      <p className="mt-2 max-w-3xl text-neutral-300">
        Lista kontrolna na oględziny GMT400 (Tahoe, Suburban, Silverado i inne).
        Każdy punkt pochodzi z instrukcji obsługi GM albo prowadzi do istniejącej diagnozy, usterek lub DIY.
        Odhaczone punkty zostają tylko w tej przeglądarce.
      </p>
      <div className="mt-4 rounded-2xl border border-white/15 bg-neutral-900 p-4 text-sm text-neutral-300">
        <p className="font-semibold text-white">Najpierw sprawdź:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>VIN i zgodność z dokumentami</li>
          <li>Rdzę na ramie i progach</li>
          <li>Pracę skrzyni 4L60-E (ślizganie)</li>
          <li>Stan silnika (olej, wycieki)</li>
          <li>Działanie 4WD / napędu</li>
        </ul>
      </div>
      <AffiliateBox
        title="Przydatne przy oględzinach"
        items={[
          { name: 'Skaner OBD2', search: 'OBD2 scanner' },
          { name: 'Latarka inspekcyjna', search: 'inspection flashlight LED' },
          { name: 'Miernik grubości lakieru', search: 'paint thickness gauge' },
        ]}
      />
      <BuyerChecklist />
    </div>
  );
}
