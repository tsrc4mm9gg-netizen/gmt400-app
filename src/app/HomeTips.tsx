import Link from 'next/link';

const TIPS = [
  { title: 'Rdza na ramie', desc: 'Najczęstszy problem przy imporcie. Sprawdź progi i belki.', href: '/diagnoza?objaw=rdza' },
  { title: 'Skrzynia 4L60-E', desc: 'Ślizganie i szarpanie — sprawdź ATF i kody.', href: '/diagnoza?objaw=skrzynia' },
  { title: 'Vortec 5.7 (1996+)', desc: 'Uszczelki kolektora i CSFI.', href: '/diagnoza?objaw=szarpie-gasnie' },
  { title: 'LPG i import', desc: 'Poradniki lokalne dla właścicieli w PL.', href: '/dla-wlasciciela' },
];

export default function HomeTips() {
  return (
    <section aria-labelledby="home-tips-title" className="px-4 pt-6">
      <h2 id="home-tips-title" className="text-xl font-bold text-white">Warto wiedzieć</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2.5">
        {TIPS.map(tip => (
          <li key={tip.title}>
            <Link href={tip.href} className="flex h-full flex-col rounded-2xl border border-white/15 bg-neutral-900 p-3 transition hover:border-silver-500">
              <span className="text-sm font-bold text-white">{tip.title}</span>
              <span className="mt-0.5 text-[11px] text-neutral-300">{tip.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
