import Link from 'next/link';

/** Kompaktowy kafel pod karuzelą → lista kontrolna kupującego. */
export default function HomeBuyerGuide() {
  return (
    <div className="px-4 pt-2">
      <Link href="/poradnik-kupujacego" data-testid="home-buyer-guide" className="flex min-h-11 items-center justify-between gap-3 rounded-2xl border border-white/15 bg-neutral-900 px-4 py-2.5 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-white">Poradnik kupującego</span>
          <span className="block truncate text-xs text-neutral-400">Lista kontrolna: rdza, rama, silnik, skrzynia, 4WD, VIN</span>
        </span>
        <span aria-hidden="true" className="text-silver-400">→</span>
      </Link>
    </div>
  );
}
