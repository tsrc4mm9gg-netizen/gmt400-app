'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Pełny dekoder VIN na stronie głównej (pod karuzelą modeli; skrót do niego jest w HomeQuickLinks). */
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
    <section aria-label="Sprawdź VIN" className="px-4 pt-2">
      <form onSubmit={submit} data-testid="home-vin-form" className="rounded-2xl border-2 border-silver-600/70 bg-gradient-to-b from-silver-950/50 to-neutral-950 p-4">
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
    </section>
  );
}
