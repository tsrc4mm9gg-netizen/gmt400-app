import Link from 'next/link';

/** Krótkie FAQ na stronie głównej — tylko odpowiedzi zgodne z tym, co strona faktycznie robi (bez obietnic bez pokrycia). */
const FAQ = [
  {
    q: 'Jak sprawdzić, czy usterka pasuje do mojego GMT400?',
    a: 'Ustaw profil auta (model, rocznik, silnik, napęd). Listy DIY i usterek pokażą wtedy najpierw wpisy pasujące do Twojej konfiguracji.',
    href: '/moj-samochod',
  },
  {
    q: 'Gdzie znaleźć instrukcję wymiany konkretnej części?',
    a: 'W sekcji DIY albo przez wyszukiwarkę w nagłówku.',
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
    q: 'Co oznacza kod OBD w moim Tahoe / Suburban?',
    a: 'W sekcji Kody OBD wyszukasz kod i zobaczysz jego znaczenie oraz możliwe przyczyny.',
    href: '/kody-obd',
  },
  {
    q: 'Czy mogę używać strony offline?',
    a: 'Częściowo. Odwiedzone poradniki DIY i opisy usterek oraz strony zapisane przyciskiem „Zapisz offline” otwierają się bez internetu. Reszta strony wymaga sieci.',
    href: '/diy',
  },
];

export default function HomeFAQ() {
  return (
    <section aria-labelledby="home-faq-title" className="px-4 pt-6">
      <h2 id="home-faq-title" className="text-xl font-bold text-white">Częste pytania</h2>
      <ul className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/15 bg-neutral-900">
        {FAQ.map(item => (
          <li key={item.q}>
            <details className="group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-500 [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span aria-hidden="true" className="shrink-0 text-silver-300 transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="px-4 pb-3">
                <p className="text-sm text-neutral-300">{item.a}</p>
                <Link href={item.href} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-silver-300 underline-offset-2 hover:underline">
                  Przejdź →
                </Link>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
