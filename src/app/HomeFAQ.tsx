import Link from 'next/link';

const FAQ = [
  {
    q: 'Jak sprawdzić, czy usterka pasuje do mojego GMT400?',
    a: 'Ustaw profil auta (rocznik, model, silnik). Na listach DIY i usterek zobaczysz, co pasuje do Twojej konfiguracji.',
    href: '/moj-samochod',
  },
  {
    q: 'Gdzie znaleźć instrukcję wymiany konkretnej części?',
    a: 'W sekcji DIY lub przez wyszukiwarkę. Wiele procedur ma listę narzędzi i części.',
    href: '/diy',
  },
  {
    q: 'Czy strona ma informacje o LPG i imporcie z USA?',
    a: 'Tak. W sekcji „Dla właściciela” są poradniki o LPG, imporcie, światłach i żółtych tablicach.',
    href: '/dla-wlasciciela',
  },
  {
    q: 'Jak rozkodować VIN GMT400?',
    a: 'Wpisz 17-znakowy VIN w dekoderze. Dostaniesz rocznik, silnik, nadwozie i fabrykę.',
    href: '/vin',
  },
  {
    q: 'Jakie płyny i momenty dokręcania są typowe dla GMT400?',
    a: 'W bazie wiedzy znajdziesz tabele płynów i momentów dla popularnych silników i układów.',
    href: '/baza',
  },
  {
    q: 'Co oznacza kod OBD w moim Tahoe / Suburban?',
    a: 'W sekcji Kody OBD możesz wyszukać kod i zobaczyć możliwe przyczyny oraz co sprawdzić najpierw.',
    href: '/kody-obd',
  },
  {
    q: 'Czy mogę używać strony offline?',
    a: 'Tak. Strona działa jako PWA — po dodaniu do ekranu głównego część treści jest dostępna bez internetu.',
    href: '/',
  },
];

export default function HomeFAQ() {
  return (
    <section aria-labelledby="home-faq-title" className="px-4 pt-8">
      <h2 id="home-faq-title" className="text-xl font-bold text-white">Częste pytania</h2>
      <ul className="mt-3 space-y-3">
        {FAQ.map((item, i) => (
          <li key={i} className="rounded-2xl border border-white/15 bg-neutral-900 p-4">
            <p className="font-semibold text-white">{item.q}</p>
            <p className="mt-1 text-sm text-neutral-300">{item.a}</p>
            {item.href && (
              <Link href={item.href} className="mt-2 inline-block text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
                Przejdź →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
