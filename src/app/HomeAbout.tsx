import Link from 'next/link';

export default function HomeAbout() {
  return (
    <section aria-labelledby="home-about-title" className="px-4 pt-8">
      <h2 id="home-about-title" className="text-xl font-bold text-white">O projekcie</h2>
      <p className="mt-2 text-sm text-neutral-300">
        GMT400.pl to darmowa polska encyklopedia dla właścicieli Chevrolet i GMC GMT400 (Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer 1988–2000). 
        Znajdziesz tu usterki, DIY, dekoder VIN, kody OBD i poradniki lokalne (LPG, import, światła, żółte tablice).
      </p>
      <p className="mt-2 text-sm text-neutral-300">
        Strona jest rozwijana i rozbudowywana. Treści mają charakter pomocniczy i nie zastępują dokumentacji serwisowej ani diagnozy mechanika.
      </p>
      <Link href="/baza" className="mt-3 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
        Przejdź do bazy wiedzy →
      </Link>
    </section>
  );
}
