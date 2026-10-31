import Breadcrumbs from '../ui/Breadcrumbs';
import MaintenancePlanner from './MaintenancePlanner';

export const metadata = {
  title: 'Harmonogram przeglądów — GMT400',
  description: 'Interwały serwisowe GMT400 z instrukcji obsługi GM 1995–1999: olej, ATF, płyn chłodniczy, świece, filtry, mosty. Harmonogram normalny i ciężkie warunki, przypomnienia w kalendarzu.',
  alternates: { canonical: 'https://www.gmt400.pl/przeglady' },
};

export default function PrzegladyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Mój samochód', href: '/moj-samochod' }, { label: 'Harmonogram przeglądów' }]} />
      <h1 className="text-3xl font-bold text-silver-400">Harmonogram przeglądów</h1>
      <p className="mt-2 text-neutral-300">Interwały wyłącznie z instrukcji obsługi GM (Owner’s Manual 1995–1999, rozdział 7 „Maintenance Schedule”). Kilometry przeliczone z mil i zaokrąglone — oryginał w milach podajemy obok. Stan licznika i daty zostają tylko w tej przeglądarce. Sprawdź w swoim aucie.</p>
      <MaintenancePlanner />
    </div>
  );
}
