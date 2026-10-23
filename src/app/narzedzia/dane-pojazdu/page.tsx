import Link from 'next/link';
import OfficialVehicleData from '../../OfficialVehicleData';
export const metadata = { title: 'Oficjalne dane VIN, NHTSA i EPA — GMT400.pl', description: 'Dekoder vPIC, kampanie bezpieczeństwa, zgłoszenia właścicieli i spalanie EPA Chevrolet/GMC 1988–2000.' };
export default function Page() { return <main className="max-w-4xl mx-auto p-4 bg-black text-white min-h-screen"><nav aria-label="Narzędzia pojazdu" className="flex flex-wrap gap-4"><Link href="/?tab=vin" className="text-red-400 underline">Powrót do VIN/RPO</Link><Link href="/narzedzia/rpo" className="text-red-400 underline">Dekoder i katalog RPO</Link></nav><h1 className="text-2xl mt-6">Oficjalne dane pojazdu</h1><OfficialVehicleData/></main>; }
