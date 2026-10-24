import type { Metadata } from 'next';
import Breadcrumbs from '../../ui/Breadcrumbs';
import VinHistoryTool from './VinHistoryTool';

export const metadata: Metadata = {
  title: 'Historia VIN — akcje serwisowe, skargi NHTSA i archiwa aukcji — GMT400.pl',
  description: 'Wpisz VIN Chevroleta lub GMC GMT400 1988–2000: liczba akcji serwisowych i skarg w oficjalnej bazie NHTSA oraz linki do archiwów aukcji i raportów historii. Bez kopiowania cudzych zdjęć.',
  alternates: { canonical: 'https://www.gmt400.pl/narzedzia/historia-vin' },
};

export default function VinHistoryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 text-white sm:py-10">
      <Breadcrumbs className="mb-2" items={[{ href: '/narzedzia', label: 'Narzędzia' }, { label: 'Historia VIN' }]} />
      <h1 className="text-3xl font-bold text-red-400">Historia VIN</h1>
      <p className="mb-5 mt-2 text-neutral-300">Sama historia: ile akcji serwisowych i skarg właścicieli ma ten rocznik i model w oficjalnej bazie NHTSA, plus linki do archiwów aukcji i raportów dla dokładnego VIN. To ta sama lista, co w sekcji „Zdjęcia i historia tego VIN” na stronie Sprawdź VIN.</p>
      <VinHistoryTool />
    </div>
  );
}
