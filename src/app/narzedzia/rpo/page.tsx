import Link from 'next/link';
import RpoAxleDecoder from '../../RpoAxleDecoder';
export const metadata = { title: 'Dekoder i katalog RPO — GMT400.pl', description: 'Rozwijany katalog RPO GM: osie, silniki i skrzynie. Źródła, nieznane kody i jawne ograniczenia zastosowania rocznikowego.' };
export default function Page() { return <main className="mx-auto min-h-screen max-w-4xl bg-black p-4 text-white"><nav aria-label="Narzędzia pojazdu" className="mb-6 flex flex-wrap gap-4 text-amber-400"><Link className="underline" href="/?tab=vin">VIN/RPO</Link><Link className="underline" href="/narzedzia/dane-pojazdu">Dane NHTSA i EPA</Link></nav><h1 className="mb-6 text-2xl">Dekoder i katalog RPO</h1><RpoAxleDecoder/></main>; }
