'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { findRpo } from '@/lib/rpo-catalog';
import { parseStickerText, suggestKnown, type StickerVin } from '@/lib/rpo-sticker.mjs';

type Phase = 'idle' | 'working' | 'review' | 'error';
export type ScanResult = { codes: string[] };

const ICON_BTN = 'relative flex! size-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-silver-500/60 bg-neutral-900 text-silver-200 transition hover:bg-neutral-800 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-silver-300';
const CHIP_BASE = 'inline-flex items-center gap-1 rounded-full border py-0 pl-3 pr-0.5 font-mono text-sm';

export const suggest = (code: string) => suggestKnown(code, c => Boolean(findRpo(c)));
/** Kody z pola: tokeny dokładnie 3-znakowe (A–Z, 0–9) — to one są pokazywane jako chipy. */
export const codeTokens = (query: string) => query.toUpperCase().split(/[\s,;|/]+/).filter(t => /^[A-Z0-9]{3}$/.test(t));

/** Odczyt zdjęcia naklejki (OCR w przeglądarce). Wynik trafia do pola kodów przez onCodes — nic nie jest wysyłane na serwer. */
export function useStickerScan(onCodes: (codes: string[]) => void) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState({ percent: 0, label: '' });
  const [ignored, setIgnored] = useState<string[]>([]);
  const [vin, setVin] = useState<StickerVin | null>(null);
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [read, setRead] = useState(0);
  const runId = useRef(0);
  const previewUrl = useRef<string | null>(null);
  const cb = useRef(onCodes);
  useEffect(() => { cb.current = onCodes; });
  useEffect(() => () => { runId.current++; if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }, []);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const id = ++runId.current;
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = URL.createObjectURL(file);
    setPreview(previewUrl.current);
    setPhase('working');
    setProgress({ percent: 1, label: 'Przygotowuję zdjęcie…' });
    try {
      const { preprocessImage, recognizeSticker } = await import('./sticker-ocr');
      const canvases = await preprocessImage(file);
      let text = '';
      try { text = await recognizeSticker(canvases, (percent, label) => { if (id === runId.current) setProgress({ percent, label }); }); }
      finally { canvases.forEach(c => { c.width = c.height = 0; }); }
      if (id !== runId.current) return;
      const parsed = parseStickerText(text, code => Boolean(findRpo(code)));
      // Błędny odczyt, który jest „sobowtórem” już odczytanego znanego kodu (np. PO6 obok P06), pomijamy — to ten sam kod.
      const have = new Set(parsed.codes.filter(c => c.known).map(c => c.code));
      const codes = parsed.codes.filter(c => c.known || !have.has(suggest(c.code) ?? '')).map(c => c.code);
      setIgnored(parsed.ignored.filter(t => !parsed.codes.some(c => c.code === t)));
      setVin(parsed.vin);
      setRaw(text.trim());
      setRead(codes.length);
      setPhase('review');
      cb.current(codes);
    } catch {
      if (id === runId.current) setPhase('error');
    }
  }
  return { phase, progress, ignored, vin, raw, preview, read, handleFile };
}
export type StickerScanState = ReturnType<typeof useStickerScan>;

const CameraIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></svg>;
const ImageIcon = () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 9" /></svg>;

/** Dwa przyciski-ikony w jednym rzędzie z polem kodów: aparat (capture=environment) i wybór gotowego zdjęcia. */
export function ScanButtons({ scan }: { scan: StickerScanState }) {
  const busy = scan.phase === 'working';
  const input = (id: string, capture: boolean, label: string, testid: string, icon: React.ReactNode) => (
    <label className={`${ICON_BTN} ${busy ? 'opacity-50' : ''}`} title={label}>
      {icon}
      <span className="sr-only">{label}</span>
      <input id={id} data-testid={testid} aria-label={label} type="file" accept="image/*" disabled={busy} {...(capture ? { capture: 'environment' as const } : {})} className="absolute inset-0 size-full cursor-pointer opacity-0"
        onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void scan.handleFile(file); }} />
    </label>
  );
  return <>
    {input('rpo-photo-camera', true, 'Zrób zdjęcie naklejki', 'rpo-scan-camera', <CameraIcon />)}
    {input('rpo-photo-file', false, 'Wybierz zdjęcie z galerii', 'rpo-scan-file', <ImageIcon />)}
  </>;
}

/** Pasek postępu / błąd / kompaktowe podsumowanie odczytu + chipy kodów z pola (edycja zmienia to samo pole). */
export function ScanPanel({ scan, query, onRemove, onReplace, onAdd }: { scan: StickerScanState; query: string; onRemove: (code: string) => void; onReplace: (from: string, to: string) => void; onAdd: (code: string) => void }) {
  const { phase, progress, ignored, vin, raw, preview, read } = scan;
  const tokens = Array.from(new Set(codeTokens(query)));
  const known = tokens.filter(c => findRpo(c)).length;
  return <>
    {phase === 'working' && <div className="mt-3" role="status" aria-live="polite" data-testid="rpo-scan-progress">
      <p className="text-sm text-neutral-200">{progress.label} <span className="text-neutral-400">{progress.percent}%</span></p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800" aria-hidden><div className="h-full rounded-full bg-silver-400 transition-all" style={{ width: `${progress.percent}%` }} /></div>
    </div>}
    {phase === 'error' && <p className="mt-3 rounded-lg border border-silver-500/40 p-3 text-sm text-neutral-200" role="alert" data-testid="rpo-scan-error">Nie udało się odczytać tego zdjęcia w Twojej przeglądarce. Spróbuj inne zdjęcie albo wpisz kody ręcznie w polu powyżej.</p>}
    {phase === 'review' && <div className="mt-3 space-y-2 rounded-lg border border-silver-500/40 bg-neutral-950/60 p-3" data-testid="rpo-scan-review">
      <p className="text-sm text-neutral-200" role="status" data-testid="rpo-scan-summary">Ze zdjęcia odczytano kodów: <strong>{read}</strong>. Kody są w polu wyżej — OCR bywa omylny, usuń błędne (×) lub dopisz brakujące w polu.</p>
      {read === 0 && tokens.length === 0 && <p className="text-sm text-neutral-300" data-testid="rpo-scan-empty">Nie znaleziono żadnych kodów. Zrób zdjęcie z bliska, przy dobrym świetle, albo wpisz kody ręcznie.</p>}
      {tokens.length > 0 && <ul className="flex flex-wrap gap-1.5" aria-label="Kody RPO w polu" data-testid="rpo-scan-chips" data-known={known}>
        {tokens.map(code => { const isKnown = Boolean(findRpo(code)); const s = isKnown ? null : suggest(code); return <li key={code} className="flex flex-wrap items-center gap-1">
          <span className={`${CHIP_BASE} ${isKnown ? 'border-silver-400 text-white' : 'border-dashed border-silver-600 text-neutral-300'}`} data-testid="rpo-scan-chip" data-code={code} data-known={isKnown ? '1' : '0'}>
            {code}{!isKnown && <span className="font-sans text-xs text-neutral-400">brak w bazie</span>}
            <button type="button" onClick={() => onRemove(code)} aria-label={`Usuń kod ${code}`} className="inline-flex size-9 items-center justify-center rounded-full text-lg leading-none text-neutral-300 hover:bg-neutral-800">×</button>
          </span>
          {s && <button type="button" onClick={() => onReplace(code, s)} className="min-h-9 rounded-lg border border-silver-600 px-2 text-sm text-neutral-200" data-testid="rpo-scan-suggest">Czy {s}?</button>}
        </li>; })}
      </ul>}
      {vin && <p className="rounded-lg border border-silver-500/40 p-3 text-sm text-neutral-200" data-testid="rpo-scan-vin">Na zdjęciu widać VIN: <span className="font-mono font-semibold text-white">{vin.vin}</span>{vin.checkOk ? ' (cyfra kontrolna się zgadza)' : ' (cyfra kontrolna się nie zgadza — sprawdź przepisany numer)'} · <Link href={`/vin?vin=${vin.vin}`} className="underline">Otwórz dekoder VIN</Link></p>}
      {ignored.length > 0 && <details className="text-sm">
        <summary className="flex min-h-11 cursor-pointer items-center text-neutral-300">Pominięte fragmenty ({ignored.length}) — dotknij, aby dodać</summary>
        <ul className="mt-1 flex flex-wrap gap-2">{ignored.map(t => <li key={t}><button type="button" onClick={() => onAdd(t)} className="min-h-9 rounded-full border border-neutral-600 px-3 font-mono text-sm text-neutral-300">+ {t}</button></li>)}</ul>
      </details>}
      {(preview || raw) && <details className="text-xs text-neutral-400" data-testid="rpo-scan-photo">
        <summary className="flex min-h-11 cursor-pointer items-center">Zdjęcie i surowy odczyt OCR</summary>
        {preview && <div className="rounded-lg border border-silver-500/40 bg-neutral-950 p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Twoje zdjęcie naklejki — porównaj z odczytanymi kodami" className="mx-auto max-h-48 w-auto max-w-full object-contain" />
        </div>}
        {raw && <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg border p-2 font-mono" data-testid="rpo-scan-raw">{raw}</pre>}
      </details>}
    </div>}
  </>;
}
