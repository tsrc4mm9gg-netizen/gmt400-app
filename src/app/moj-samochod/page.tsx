import Breadcrumbs from '../ui/Breadcrumbs';
import MyCar from './MyCar';

export const metadata = {
  title: 'Mój samochód — GMT400',
  description: 'Zapisz swoje GMT400 (VIN albo model i rocznik) w przeglądarce i zobacz bezpieczniki, usterki, DIY, porady, części i kody RPO dopasowane do auta.',
  alternates: { canonical: 'https://www.gmt400.pl/moj-samochod' },
};

export default function MojSamochodPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ label: 'Mój samochód' }]} />
      <h1 className="text-3xl font-bold text-red-400">Mój samochód</h1>
      <p className="mt-2 max-w-3xl text-neutral-300">Podaj VIN albo wybierz model i rocznik. Dane zostają tylko w tej przeglądarce — bez konta i bez wysyłania na serwer. Na tej podstawie zebraliśmy materiały, których opisany zakres obejmuje Twoje auto.</p>
      <MyCar />
    </div>
  );
}
