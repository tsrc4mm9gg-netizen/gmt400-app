'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/** Zwarty początek strony głównej: VIN (pole + przycisk), potem Usterki i DIY. */
export default function HomeStart() {
  const router = useRouter();
  const [vin, setVin] = useState('');
  const len = vin.replace(/[\s-]/g, '').length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = vin.replace(/[\s-]/g, '').toUpperCase();
    router.push(clean ? `/vin?vin=${encodeURIComponent(clean)}` : '/vin');
  };
  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();
    setVin(text.replace(/[\s-]/g, '').toUpperCase().slice(0, 20));
  };

  return (
    <section aria-labelledby="home-title" className="px-4 pt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-silver-300">Encyklopedia · Chevrolet / GMC 1988–2000</p>
      <h1 id="home-title" className="mt-1 text-3xl font-bold leading-tight tracking-wide text-white">
        GMT<span className="text-silver-600">400</span>
        <span className="mt-1 block text-base font-medium tracking-normal text-neutral-300">Tahoe, Suburban, Silverado, Sierra, Yukon, Blazer — usterki, DIY i poradniki po polsku</span>
      </h1>

      <form onSubmit={submit} data-testid="home-vin-form" className="mt-4 rounded-2xl border-2 border-silver-600/70 bg-gradient-to-b from-silver-950/50 to-neutral-950 p-4">
        <label htmlFor="home-vin-input" className="block text-lg font-bold text-white">Sprawdź swój VIN</label>
        <p className="mt-0.5 text-xs text-neutral-300">Rocznik, silnik, nadwozie i fabryka z 17 znaków — plus kody RPO.</p>
        <input
          id="home-vin-input"
          name="vin"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          maxLength={20}
          value={vin}
          onChange={e => setVin(e.target.value.toUpperCase())}
          onPaste={onPaste}
          placeholder="np. 1GCEK19R…"
          aria-describedby="home-vin-hint"
          className="mt-3 min-h-14 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 font-mono text-lg uppercase tracking-wider text-white placeholder:text-neutral-500 focus:border-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-600/40"
        />
        <p id="home-vin-hint" className="mt-1 text-xs text-neutral-400">{len === 0 ? 'VIN jest na desce przy szybie kierowcy i w dowodzie (pole E).' : len === 17 ? '17 znaków — gotowe.' : `Wpisano ${len} z 17 znaków.`}</p>
        <button type="submit" data-testid="home-vin-cta" className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-silver-600 px-4 text-base font-bold text-neutral-950 shadow-lg shadow-silver-600/30 transition hover:bg-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-400">
          Dekoduj VIN <span aria-hidden="true" className="ml-2">›</span>
        </button>
      </form>

      <ul className="mt-3 grid grid-cols-2 gap-3" data-testid="home-main-entries">
        <li>
          <Link href="/usterki" className="group flex h-full min-h-28 flex-col rounded-2xl border border-white/15 bg-neutral-900 p-4 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-silver-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17.5v.01" /></svg>
            <span className="mt-2 text-lg font-bold text-white">Usterki</span>
            <span className="mt-0.5 text-xs text-neutral-300">Objawy i diagnostyka: skrzynia, silnik, ABS, zawieszenie</span>
          </Link>
        </li>
        <li>
          <Link href="/diy" className="group flex h-full min-h-28 flex-col rounded-2xl border border-white/15 bg-neutral-900 p-4 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 text-silver-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z" /></svg>
            <span className="mt-2 text-lg font-bold text-white">DIY</span>
            <span className="mt-0.5 text-xs text-neutral-300">Naprawy krok po kroku z numerami części i momentami</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
