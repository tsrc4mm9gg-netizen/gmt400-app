import Link from 'next/link';
import RpoAxleDecoder from '../../RpoAxleDecoder';
export const metadata = { title: 'Dekoder RPO przełożenia osi — GMT400.pl', description: 'Lokalna interpretacja sześciu kodów RPO przełożenia tylnej osi GM, źródła i ostrzeżenia o nieustalonej konfiguracji.' };
export default function Page() { return <main className="mx-auto min-h-screen max-w-4xl bg-black p-4 text-white"><nav aria-label="Narzędzia pojazdu" className="mb-6 flex flex-wrap gap-4 text-amber-400"><Link className="underline" href="/?tab=vin">VIN/RPO</Link><Link className="underline" href="/narzedzia/dane-pojazdu">Dane NHTSA i EPA</Link></nav><h1 className="mb-6 text-2xl">Dekoder RPO — przełożenie osi</h1><RpoAxleDecoder/></main>; }
