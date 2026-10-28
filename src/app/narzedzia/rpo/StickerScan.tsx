'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { findRpo } from '@/lib/rpo-catalog';
import { normalizeRpoInput, parseStickerText, suggestKnown, type StickerVin } from '@/lib/rpo-sticker.mjs';

type Phase = 'idle' | 'working' | 'review' | 'error';
type Chip = { code: string; known: boolean };

const PICK = 'relative overflow-hidden inline-flex min-h-12 cursor-pointer items-center justify-center rounded-lg border border-silver-500/60 bg-neutral-900 px-4 py-2 text-base font-medium text-white transition hover:bg-neutral-800 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-silver-300';
const CHIP_BASE = 'inline-flex items-center gap-1 rounded-full border py-0.5 pl-3 pr-1 font-mono text-base';

const suggest = (code: string) => suggestKnown(code, c => Boolean(findRpo(c)));

export default function StickerScan({ onShow }: { onShow: (codes: string[]) => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState({ percent: 0, label: '' });
  const [chips, setChips] = useState<Chip[]>([]);
  const [ignored, setIgnored] = useState<string[]>([]);
  const [vin, setVin] = useState<StickerVin | null>(null);
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState('');
  const runId = useRef(0);
  const previewUrl = useRef<string | null>(null);

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
      setChips(parsed.codes.filter(c => c.known || !have.has(suggest(c.code) ?? '')));
      setIgnored(parsed.ignored.filter(t => !parsed.codes.some(c => c.code === t)));
      setVin(parsed.vin);
      setRaw(text.trim());
      setPhase('review');
    } catch {
      if (id === runId.current) setPhase('error');
    }
  }

  const addCode = (code: string) => setChips(list => list.some(c => c.code === code) ? list : [...list, { code, known: Boolean(findRpo(code)) }]);
  const removeCode = (code: string) => setChips(list => list.filter(c => c.code !== code));
  const replaceCode = (from: string, to: string) => setChips(list => {
    const next = list.map(c => c.code === from ? { code: to, known: Boolean(findRpo(to)) } : c);
    return next.filter((c, i) => next.findIndex(x => x.code === c.code) === i);
  });
  const submitDraft = () => {
    const parts = draft.toUpperCase().split(/[\s,;|/]+/).filter(Boolean);
    if (!parts.length) return;
    const bad = parts.filter(p => !normalizeRpoInput(p));
    parts.forEach(p => { const c = normalizeRpoInput(p); if (c) addCode(c); });
    setDraft('');
    setDraftError(bad.length ? `Kod RPO ma dokładnie 3 znaki (litery lub cyfry) — pominięto: ${bad.join(', ')}.` : '');
  };

  const known = chips.filter(c => c.known).length;
  const input = (id: string, capture: boolean, label: string, testid: string) => (
    <label className={PICK}>
      <span>{label}</span>
      <input id={id} data-testid={testid} type="file" accept="image/*" {...(capture ? { capture: 'environment' as const } : {})} className="absolute inset-0 size-full cursor-pointer opacity-0"
        onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; void handleFile(file); }} />
    </label>
  );

  return <section className="rounded-xl border p-5" aria-labelledby="rpo-scan-h" data-testid="rpo-scan">
    <h2 id="rpo-scan-h" className="text-lg font-semibold text-white">Odczytaj kody ze zdjęcia naklejki</h2>
    <p className="mt-1 text-sm text-neutral-300">Zrób zdjęcie naklejki <strong>Service Parts Identification</strong> (SPID — w schowku na rękawiczki lub w drzwiach) albo wybierz gotowe zdjęcie. Kody zostaną odczytane, a Ty poprawisz je przed pokazaniem opisów. Fotografuj z bliska, prosto, bez odblasków.</p>
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      {input('rpo-photo-camera', true, 'Zrób zdjęcie naklejki', 'rpo-scan-camera')}
      {input('rpo-photo-file', false, 'Wybierz zdjęcie', 'rpo-scan-file')}
    </div>
    <p className="mt-2 text-xs text-neutral-400" data-testid="rpo-scan-privacy">Zdjęcie jest przetwarzane tylko w Twojej przeglądarce — nie wysyłamy go na serwer i nigdzie go nie zapisujemy. Przy pierwszym odczycie pobierze się moduł rozpoznawania tekstu (ok. 9 MB).</p>

    {phase === 'working' && <div className="mt-4" role="status" aria-live="polite" data-testid="rpo-scan-progress">
      <p className="text-sm text-neutral-200">{progress.label} <span className="text-neutral-400">{progress.percent}%</span></p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800" aria-hidden><div className="h-full rounded-full bg-silver-400 transition-all" style={{ width: `${progress.percent}%` }} /></div>
    </div>}

    {phase === 'error' && <p className="mt-4 rounded-lg border border-silver-500/40 p-3 text-sm text-neutral-200" role="alert" data-testid="rpo-scan-error">Nie udało się odczytać tego zdjęcia w Twojej przeglądarce. Spróbuj inne zdjęcie albo wpisz kody ręcznie w polu powyżej.</p>}

    {phase === 'review' && <div className="mt-4 space-y-3" data-testid="rpo-scan-review">
      {preview && <div className="rounded-lg border border-silver-500/40 bg-neutral-950 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Twoje zdjęcie naklejki — porównaj z odczytanymi kodami" className="mx-auto max-h-56 w-auto max-w-full object-contain" />
      </div>}
      <p className="text-sm text-neutral-200" role="status" data-testid="rpo-scan-summary">Odczytano kodów: <strong>{chips.length}</strong> (w bazie: {known}, brak w bazie: {chips.length - known}). OCR bywa omylny — porównaj ze zdjęciem, usuń błędne i dopisz brakujące.</p>
      {chips.length === 0 && <p className="text-sm text-neutral-300" data-testid="rpo-scan-empty">Nie znaleziono żadnych kodów. Zrób zdjęcie z bliska, przy dobrym świetle, albo dopisz kody ręcznie poniżej.</p>}
      <ul className="flex flex-wrap gap-2" aria-label="Odczytane kody RPO" data-testid="rpo-scan-chips">
        {chips.map(chip => { const s = chip.known ? null : suggest(chip.code); return <li key={chip.code} className="flex flex-wrap items-center gap-1">
          <span className={`${CHIP_BASE} ${chip.known ? 'border-silver-400 text-white' : 'border-dashed border-silver-600 text-neutral-300'}`} data-testid="rpo-scan-chip" data-code={chip.code} data-known={chip.known ? '1' : '0'}>
            {chip.code}{!chip.known && <span className="font-sans text-xs text-neutral-400">brak w bazie</span>}
            <button type="button" onClick={() => removeCode(chip.code)} aria-label={`Usuń kod ${chip.code}`} className="inline-flex size-9 items-center justify-center rounded-full text-lg leading-none text-neutral-300 hover:bg-neutral-800">×</button>
          </span>
          {s && <button type="button" onClick={() => replaceCode(chip.code, s)} className="min-h-9 rounded-lg border border-silver-600 px-2 text-sm text-neutral-200" data-testid="rpo-scan-suggest">Czy {s}?</button>}
        </li>; })}
      </ul>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1"><label htmlFor="rpo-scan-add" className="mb-1 block text-sm font-medium text-white">Dodaj kod</label>
          <input id="rpo-scan-add" data-testid="rpo-scan-add" value={draft} onChange={e => { setDraft(e.target.value.toUpperCase()); setDraftError(''); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submitDraft(); } }} placeholder="np. YE9" maxLength={40} autoCapitalize="characters" autoCorrect="off" spellCheck={false} autoComplete="off" className="w-full rounded-lg border px-3 py-2" /></div>
        <button type="button" onClick={submitDraft} data-testid="rpo-scan-add-btn" className="mt-6 min-h-11 rounded-lg border border-silver-500/60 px-4 text-sm font-medium text-white">Dodaj</button>
      </div>
      {draftError && <p className="text-xs text-neutral-300" role="status">{draftError}</p>}
      {ignored.length > 0 && <details className="text-sm">
        <summary className="flex min-h-11 cursor-pointer items-center text-neutral-300">Pominięte fragmenty ({ignored.length}) — dotknij, aby dodać</summary>
        <ul className="mt-1 flex flex-wrap gap-2">{ignored.map(t => <li key={t}><button type="button" onClick={() => addCode(t)} className="min-h-9 rounded-full border border-neutral-600 px-3 font-mono text-sm text-neutral-300">+ {t}</button></li>)}</ul>
      </details>}
      {vin && <p className="rounded-lg border border-silver-500/40 p-3 text-sm text-neutral-200" data-testid="rpo-scan-vin">Na zdjęciu widać VIN: <span className="font-mono font-semibold text-white">{vin.vin}</span>{vin.checkOk ? ' (cyfra kontrolna się zgadza)' : ' (cyfra kontrolna się nie zgadza — sprawdź przepisany numer)'} · <Link href={`/vin?vin=${vin.vin}`} className="underline">Otwórz dekoder VIN</Link></p>}
      <button type="button" onClick={() => onShow(chips.map(c => c.code))} disabled={chips.length === 0} data-testid="rpo-scan-show" className="min-h-12 w-full rounded-lg bg-silver-600 px-4 py-2 font-medium text-neutral-950 disabled:opacity-50 sm:w-auto">Pokaż opisy ({chips.length})</button>
      {raw && <details className="text-xs text-neutral-400"><summary className="flex min-h-11 cursor-pointer items-center">Surowy odczyt OCR</summary><pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg border p-2 font-mono" data-testid="rpo-scan-raw">{raw}</pre></details>}
    </div>}
  </section>;
}
