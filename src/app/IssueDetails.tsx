import type { ReactNode } from 'react';

/** Dzieli akapit na kroki tylko przy kolejnej numeracji „1. … 2. …” (nie łamie „4.3 L35”). */
export function splitSteps(text: string): { pre: string; steps: string[] } | null {
  const re = /(^|\s)(\d{1,2})\.\s/g;
  const marks: { at: number; end: number }[] = [];
  let expected = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (Number(m[2]) === expected) {
      const at = m.index + m[1].length;
      marks.push({ at, end: at + m[2].length + 2 });
      expected += 1;
    }
  }
  if (marks.length < 2) return null;
  const steps = marks.map((mk, i) => text.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : undefined).trim()).filter(Boolean);
  return { pre: text.slice(0, marks[0].at).trim(), steps };
}

const URL_RE = /(https?:\/\/[^\s;,)]+[^\s;,).])/g;

export function linkify(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(URL_RE)) {
    const url = m[0];
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    let label = url;
    try { const u = new URL(url); label = u.hostname.replace(/^www\./, '') + (u.pathname.length > 1 ? '/…' + u.pathname.split('/').filter(Boolean).slice(-1)[0] : ''); } catch { /* zostaw URL */ }
    out.push(<a key={idx} href={url} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-silver-400 underline underline-offset-2 hover:text-silver-300">{label}</a>);
    last = idx + url.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function hasSource(i: { Opis?: string; Rozwiązanie?: string }) {
  return /https?:\/\//.test(`${i.Opis || ''} ${i.Rozwiązanie || ''}`);
}

/** Łączy kolejne linie „1. …”, „2. …” w jeden akapit, żeby powstała jedna lista numerowana. */
export function mergeNumberedLines(text: string): string[] {
  const out: string[] = [];
  let prevNumbered = false;
  for (const line of text.split(/\n+/).map(p => p.trim()).filter(Boolean)) {
    const numbered = /^\d{1,2}\.\s/.test(line);
    if (numbered && prevNumbered && out.length) out[out.length - 1] += ' ' + line;
    else out.push(line);
    prevNumbered = numbered;
  }
  return out;
}

const LABEL_RE = /^(Narzędzia|Krok po kroku(?: \(GM\))?|Momenty(?: \(GM\))?|Momenty dokręcania(?: \(GM\))?|Różnice|Uwaga|Płyny|Części)(:)\s*/;

function Labeled({ text }: { text: string }) {
  const m = LABEL_RE.exec(text);
  if (!m) return <>{linkify(text)}</>;
  const rest = text.slice(m[0].length);
  return <><span className="font-semibold text-silver-400" data-testid="steps-label">{m[1]}:</span>{rest ? ' ' : ''}{linkify(rest)}</>;
}

export function StepsText({ text, className = '' }: { text: string; className?: string }) {
  const paragraphs = mergeNumberedLines(text);
  return (
    <div className={`space-y-2 text-sm text-neutral-300 ${className}`} data-testid="issue-steps">
      {paragraphs.map((p, pi) => {
        const s = splitSteps(p);
        if (!s) return <p key={pi} className={`break-words${p.startsWith('⚠') ? ' border-l-2 border-silver-600/60 pl-3 text-neutral-400' : ''}`}><Labeled text={p} /></p>;
        return (
          <div key={pi} className="space-y-1">
            {s.pre && <p className="break-words"><Labeled text={s.pre} /></p>}
            <ol className="list-decimal space-y-1 pl-5 marker:text-silver-400">
              {s.steps.map((st, si) => <li key={si} className="break-words pl-1">{linkify(st)}</li>)}
            </ol>
          </div>
        );
      })}
    </div>
  );
}

export function IssueMeta({ item, label = 'Przyczyna i źródła' }: { item: { Lata?: string; Opis?: string }; label?: string }) {
  return (
    <>
      {item.Lata && <p className="mb-2 text-xs text-neutral-400 break-words" data-testid="issue-years"><span className="font-semibold uppercase tracking-wide text-neutral-500">Lata / zakres:</span> {item.Lata}</p>}
      {item.Opis && (
        <details className="mb-2 border-l-2 border-silver-600/60 pl-3 text-sm text-neutral-400" data-testid="issue-cause">
          <summary className="min-h-11 cursor-pointer py-2 text-neutral-300 hover:text-white">{label}</summary>
          <p className="pb-2 break-words whitespace-pre-line">{linkify(item.Opis)}</p>
        </details>
      )}
    </>
  );
}
