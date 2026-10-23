'use client';
import { useState } from 'react';
import Link from 'next/link';
import { decodeVin, VIN_SOURCES, type VinDecodeResult } from '@/lib/vin-decode.mjs';

const Src = ({ k }: { k: keyof typeof VIN_SOURCES }) => (
  <a href={VIN_SOURCES[k].url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-red-400 underline">{VIN_SOURCES[k].title}</a>
);

/** Dekoder VIN oparty wyłącznie na 49 CFR 565 (budowa, cyfra kontrolna, rok) i tabelach kodów silnika z OM GM. */
export default function VinDecoder({ onDecoded }: { onDecoded?: (vin: string | null, year: number | null) => void }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<VinDecodeResult | null>(null);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = decodeVin(input);
    setResult(r);
    onDecoded?.(r.ok ? r.vin : null, r.ok ? r.year : null);
  };
  return (
    <div data-testid="vin-decoder">
      <form onSubmit={submit} className="mb-6 border border-white/10 bg-neutral-950 p-4">
        <label htmlFor="vin-input" className="mb-2 block text-sm text-neutral-300">Numer VIN (17 znaków) — znajdziesz go u góry deski po stronie kierowcy, pod szybą</label>
        <input id="vin-input" aria-label="Numer VIN do dekodowania" type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" spellCheck={false}
          placeholder="np. 1GCEK19R…" value={input} onChange={e => setInput(e.target.value.toUpperCase())} maxLength={20}
          className="mb-4 w-full border border-white/10 bg-neutral-900 px-4 py-3 font-mono text-lg tracking-wider focus:border-red-600 focus:outline-none" />
        <button type="submit" className="min-h-11 w-full bg-red-600 py-3 font-semibold text-white transition hover:bg-red-500">DEKODUJ VIN</button>
        <p className="mt-2 text-xs text-neutral-400">Dekodowanie odbywa się w przeglądarce — VIN nie jest nigdzie wysyłany.</p>
      </form>
      {result && !result.ok && (
        <div role="alert" className="mb-6 border border-red-600/50 bg-red-600/10 p-4 text-red-100" data-testid="vin-errors">
          {result.errors.map(e => <p key={e}>{e}</p>)}
        </div>
      )}
      {result && result.ok && (
        <div className="space-y-4" data-testid="vin-result">
          <div className={`border p-4 ${result.check.ok ? 'border-green-600/40 bg-green-600/10' : 'border-red-600/50 bg-red-600/10'}`} data-testid="vin-check">
            <p className="font-semibold text-white">{result.check.ok ? '✓ Cyfra kontrolna się zgadza' : '✗ Cyfra kontrolna się nie zgadza'}</p>
            <p className="text-sm text-neutral-200">Poz. 9 = <strong className="font-mono">{result.check.value}</strong>, wyliczona = <strong className="font-mono">{result.check.expected}</strong>. {result.check.ok ? 'VIN jest poprawnie zapisany (to nie potwierdza historii auta).' : 'Najczęściej to literówka — porównaj VIN z tabliczką na desce, naklejką na drzwiach i dowodem.'}</p>
          </div>
          <div className="border border-red-600/30 bg-neutral-950 p-4">
            <h3 className="mb-3 text-lg font-bold text-red-400">CO OZNACZA KAŻDA CZĘŚĆ VIN</h3>
            <ul className="divide-y divide-white/10">
              <Row pos="1–3" val={result.wmi} label="Producent (WMI)" text="Kod producenta nadany przez NHTSA. Pełną nazwę i kraj podaje vPIC." />
              <Row pos="4–8" val={result.vds} label="Opis pojazdu" text="Model, nadwozie, GVWR, silnik — według tabel GM. Pozycję 8 (silnik) rozpisujemy niżej." />
              <Row pos="8" val={result.engine?.code ?? result.vin[7]} label="Silnik" text={result.engine ? `${result.engine.engine}${result.engine.rpo ? ` — RPO ${result.engine.rpo}` : ''}${result.engine.fuel ? `, ${result.engine.fuel}` : ''}` : (result.engineNote ?? '')} testId="vin-engine" />
              <Row pos="9" val={result.check.value} label="Cyfra kontrolna" text={result.check.ok ? 'Zgadza się z wyliczeniem.' : `Powinno być ${result.check.expected}.`} />
              <Row pos="10" val={result.yearCode} label="Rok modelowy" text={result.year ? `${result.year}` : 'Poza zakresem GMT400 (1988–2000) albo VIN po 2009 r.'} testId="vin-year" />
              <Row pos="11" val={result.plantCode} label="Fabryka" text="Kod zakładu GM — nazwę podaje vPIC (nie zgadujemy bez tabeli GM)." />
              <Row pos="12–17" val={result.serial} label="Numer seryjny" text="Kolejny numer z produkcji." />
            </ul>
            {result.engine && <p className="mt-3 text-xs text-neutral-400">Kod silnika wg: {result.engine.sources.map((k, i) => <span key={k}>{i > 0 && ' · '}<Src k={k as keyof typeof VIN_SOURCES} /></span>)}. Zakres tabeli: {result.engine.scope}.</p>}
            <p className="mt-2 text-xs text-neutral-400">Budowa VIN, cyfra kontrolna i kod roku: <Src k="cfr" />.</p>
            <p className="mt-2 rounded border border-white/10 bg-white/5 p-2 text-xs text-neutral-300">⚠ Dokładny silnik i wyposażenie potwierdza naklejka Service Parts Identification (kody RPO) w schowku lub na drzwiach — sprawdź w swoim aucie / manualu.</p>
          </div>
          <div className="border border-white/10 bg-neutral-950 p-4">
            <h3 className="mb-2 text-lg font-bold text-red-400">PEŁNE DANE Z NHTSA</h3>
            <p className="text-sm text-neutral-300">Producent, model, seria, fabryka i GVWR z oficjalnej bazy NHTSA vPIC:</p>
            <p className="mt-1 flex flex-wrap gap-x-4"><Link href="/narzedzia/dane-pojazdu" className="inline-flex min-h-11 items-center text-red-400 underline">Oficjalne dane pojazdu (vPIC, kampanie, EPA)</Link><Src k="vpic" /></p>
            <p className="mt-1 flex flex-wrap gap-x-4"><Link href="/narzedzia/rpo" className="inline-flex min-h-11 items-center text-red-400 underline">Dekoder kodów RPO z naklejki</Link></p>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ pos, val, label, text, testId }: { pos: string; val: string; label: string; text: string; testId?: string }) {
  return (
    <li className="grid grid-cols-[4rem_1fr] gap-3 py-2" data-testid={testId}>
      <span className="text-xs text-neutral-400">poz. {pos}<span className="block font-mono text-base font-bold text-red-300">{val}</span></span>
      <span><strong className="block text-white">{label}</strong><span className="text-sm text-neutral-300">{text}</span></span>
    </li>
  );
}
