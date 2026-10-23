import Link from 'next/link';
export default function QuickAccess({ onSelect }: { onSelect: (id: string) => void }) {
  const tile = 'flex min-h-16 flex-col justify-center rounded-lg border border-neutral-600 bg-neutral-900 px-4 py-3 text-left text-white hover:border-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500';
  return <section aria-labelledby="quick-access-title" className="mb-6">
    <h2 id="quick-access-title" className="mb-3 text-lg font-semibold text-white">Od czego zaczynamy?</h2>
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <li><Link href="/swiat-gmt400" className={tile}><span className="font-semibold text-red-300">Poznaj GMT400</span><span className="text-sm text-neutral-300">Historia, design i opowieści właścicieli</span></Link></li>
      <li><button type="button" className={tile + ' w-full'} onClick={() => onSelect('usterki')}><span className="font-semibold">Sprawdź usterkę</span><span className="text-sm text-neutral-300">Objawy i materiały diagnostyczne</span></button></li>
      <li><button type="button" className={tile + ' w-full'} onClick={() => onSelect('serwis')}><span className="font-semibold">Zaplanuj serwis</span><span className="text-sm text-neutral-300">Obsługa Twojego samochodu</span></button></li>
      <li><button type="button" className={tile + ' w-full'} onClick={() => onSelect('kupujacy')}><span className="font-semibold">Kupuję GMT400</span><span className="text-sm text-neutral-300">Przygotowanie do zakupu</span></button></li>
    </ul>
  </section>;
}
