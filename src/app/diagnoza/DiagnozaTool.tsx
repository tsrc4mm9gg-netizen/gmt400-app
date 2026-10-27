'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { IconTile } from '../ui/CategoryIcon';
import { SYMPTOMS, rankCauses, type Answers, type Cause, type DiagLink, type Symptom } from '../../lib/diagnosis';
import { buildMeta, type EntryMeta, type MetaMap } from '../../lib/diagnosis-meta';

const TYPE_LABEL: Record<string, string> = { Usterka: 'Usterka', Porada: 'DIY / porada', 'Kod błędu': 'Kod błędu' };
const PATH = '/diagnoza';

/** Odczyt stanu z adresu: ?objaw=nie-odpala&silnik=benzyna — link można wysłać znajomemu, a „wstecz” wraca do wyboru objawu. */
function readUrl(): { symptomId: string | null; answers: Answers } {
  const params = new URLSearchParams(window.location.search);
  const symptom = SYMPTOMS.find(s => s.id === params.get('objaw'));
  if (!symptom) return { symptomId: null, answers: {} };
  const answers: Answers = {};
  for (const q of symptom.questions) {
    const value = params.get(q.id);
    if (value && q.options.some(o => o.id === value)) answers[q.id] = value;
  }
  return { symptomId: symptom.id, answers };
}
function urlFor(symptomId: string | null, answers: Answers): string {
  if (!symptomId) return PATH;
  const params = new URLSearchParams({ objaw: symptomId });
  for (const [k, v] of Object.entries(answers)) if (v) params.set(k, v);
  return `${PATH}?${params.toString()}`;
}

function LinkRow({ link, meta, metaState, withSteps = false }: { link: DiagLink; meta: MetaMap | null; metaState: 'ok' | 'loading' | 'error'; withSteps?: boolean }) {
  const base = 'group flex min-h-11 flex-col justify-center rounded-xl border border-white/12 bg-neutral-950/70 px-3 py-2 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';
  if ('href' in link) {
    return (
      <li style={{ maxWidth: 'none' }}>
        <Link href={link.href} data-testid="cause-link" className={base}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-silver-300">{link.kind}</span>
          <span className="text-sm font-semibold text-white">{link.label}</span>
        </Link>
      </li>
    );
  }
  const entry: EntryMeta | undefined = meta?.[link.id];
  if (entry) {
    const steps = withSteps ? entry.steps ?? [] : [];
    return (
      <li style={{ maxWidth: 'none' }} className={steps.length ? 'sm:col-span-2' : undefined} data-testid={steps.length ? 'step-card' : undefined}>
        <Link href={`/baza/${link.id}`} data-testid="cause-link" className={base}>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-silver-300">{TYPE_LABEL[entry.type] ?? entry.type}</span>
          <span className="text-sm font-semibold leading-snug text-white [overflow-wrap:anywhere]">{entry.title}</span>
          <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-neutral-300">
            <span className="rounded-full border border-white/15 px-2 py-0.5">Model: {entry.models}</span>
            {entry.years && <span className="rounded-full border border-white/15 px-2 py-0.5">Lata: {entry.years}</span>}
          </span>
        </Link>
        {steps.length > 0 && (
          <div className="mt-2 rounded-xl border border-white/10 bg-black/30 p-3" data-testid="step-list">
            <p className="!m-0 text-[11px] font-semibold uppercase tracking-wider text-silver-300">Kroki kontroli — skrót z wpisu</p>
            <ol className="mt-2 list-none space-y-1.5 !p-0">
              {steps.map((step, i) => (
                <li key={i} style={{ maxWidth: 'none' }} className="flex gap-2 text-sm leading-snug text-neutral-100">
                  <span aria-hidden="true" className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-silver-500/60 text-[11px] font-bold text-silver-200">{i + 1}</span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">{step}</span>
                </li>
              ))}
            </ol>
            {entry.tools && <p className="mt-2 !mb-0 text-xs leading-relaxed text-neutral-300" data-testid="step-tools"><span className="font-semibold text-silver-200">Narzędzia wg wpisu:</span> {entry.tools}</p>}
            <Link href={`/baza/${link.id}`} data-testid="step-full-link" className="mt-2 inline-flex min-h-11 items-center rounded-xl border border-white/15 px-3 text-sm font-semibold text-silver-100 hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Pełny wpis i procedura →</Link>
          </div>
        )}
      </li>
    );
  }
  if (metaState === 'loading') return <li style={{ maxWidth: 'none' }} className=" min-h-11 rounded-xl border border-dashed border-white/12 px-3 py-2 text-sm text-neutral-400" aria-busy="true">Ładowanie wpisu…</li>;
  if (metaState === 'error') return <li style={{ maxWidth: 'none' }}><Link href={`/baza/${link.id}`} data-testid="cause-link" className={base}><span className="text-sm font-semibold text-white">Wpis w bazie wiedzy</span></Link></li>;
  return null; // wpis usunięty lub zastąpiony nowszym — nie linkujemy do nieistniejącej strony
}

function CauseCard({ cause, rank, matched, meta, metaState }: { cause: Cause; rank: number; matched: string[]; meta: MetaMap | null; metaState: 'ok' | 'loading' | 'error' }) {
  const firstExcerpt = cause.links.map(l => ('id' in l ? meta?.[l.id]?.excerpt : undefined)).find(Boolean);
  // Kroki pokazujemy dla maks. dwóch wpisów przyczyny (pierwszych, które mają jawnie ponumerowane kroki) — reszta to zwykłe linki.
  const stepIds = new Set(cause.links.flatMap(l => ('id' in l && meta?.[l.id]?.steps?.length ? [l.id] : [])).slice(0, 2));
  const rows = cause.links.map((link, i) => <LinkRow key={i} link={link} meta={meta} metaState={metaState} withSteps={'id' in link && stepIds.has(link.id)} />);
  const visible = cause.links.filter(l => 'href' in l || metaState !== 'ok' || meta?.[l.id]);
  const shown: typeof rows = [];
  const hidden: typeof rows = [];
  let count = 0;
  cause.links.forEach((l, i) => {
    if (!('href' in l) && metaState === 'ok' && !meta?.[l.id]) return;
    const isStep = 'id' in l && stepIds.has(l.id);
    (isStep || count++ < 2 ? shown : hidden).push(rows[i]);
  });
  const stepCount = stepIds.size;
  return (
    <li data-testid={`cause-${cause.id}`} style={{ maxWidth: 'none' }} className="rounded-3xl border border-white/15 bg-neutral-900">
      <details className="group" open={rank === 1} data-testid="cause-card">
        <summary data-testid="cause-toggle" className="flex min-h-14 cursor-pointer list-none items-start gap-3 rounded-3xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="icon-tile !h-9 !w-9 !rounded-xl text-sm font-bold">{rank}</span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold leading-snug text-white">{cause.title}</span>
            {matched.length > 0 && (
              <span className="mt-1 flex flex-wrap gap-1.5 text-[11px]" data-testid="cause-match">
                {matched.map(label => <span key={label} className="rounded-full border border-silver-500/60 bg-white/5 px-2 py-0.5 font-semibold text-silver-200">Pasuje: {label}</span>)}
              </span>
            )}
            {firstExcerpt && <span className="mt-2 line-clamp-2 block text-xs leading-relaxed text-neutral-300 group-open:line-clamp-none">Wg wpisu: {firstExcerpt}</span>}
            <span className="mt-2 block text-xs font-semibold text-silver-300">
              <span className="group-open:hidden">Pokaż {stepCount > 0 ? 'kroki kontroli i wpisy' : 'wpisy'}</span>
              <span className="hidden group-open:inline">Zwiń</span>
            </span>
          </span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1.5 h-5 w-5 shrink-0 text-silver-300 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div className="px-4 pb-4" data-testid="cause-body">
          {visible.length > 0 ? (
            <>
              <ul className="grid gap-2 sm:grid-cols-2">{shown}</ul>
              {hidden.length > 0 && (
                <details className="mt-2">
                  <summary className="flex min-h-11 cursor-pointer items-center rounded-xl border border-white/15 px-3 text-sm font-semibold text-silver-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Pokaż pozostałe wpisy ({hidden.length})</summary>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">{hidden}</ul>
                </details>
              )}
            </>
          ) : (
            <p className="!mb-0 rounded-xl border border-dashed border-white/15 p-3 text-sm text-neutral-300">Wpisy dla tej przyczyny są chwilowo niedostępne w bazie.</p>
          )}
          <p className="mt-3 !mb-0 text-[11px] text-neutral-400">Kroki to dosłowny skrót numerowanej listy z wpisu — gdy wpis nie ma takiej listy, pokazujemy tylko link. Zakres modeli i roczników jest przy każdym wpisie — sprawdź w swoim aucie / manualu.</p>
        </div>
      </details>
    </li>
  );
}

export default function DiagnozaTool({ initialMeta }: { initialMeta: MetaMap | null }) {
  const [symptomId, setSymptomId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [meta, setMeta] = useState<MetaMap | null>(initialMeta);
  const [metaError, setMetaError] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Stan z adresu (po montażu — serwer zawsze renderuje wybór objawów) i obsługa przycisku „wstecz”.
  useEffect(() => {
    const apply = () => { const s = readUrl(); setSymptomId(s.symptomId); setAnswers(s.answers); };
    apply();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, []);

  // Gdy serwer nie miał danych Notion (np. chwilowa awaria), pobieramy je w przeglądarce.
  useEffect(() => {
    if (initialMeta) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    fetch('/api/notion', { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(data => { if (!Array.isArray(data.results)) throw new Error('bad'); setMeta(buildMeta(data.results)); setMetaError(false); })
      .catch(() => setMetaError(true))
      .finally(() => clearTimeout(timeout));
    return () => { clearTimeout(timeout); controller.abort(); };
  }, [initialMeta]);

  const symptom: Symptom | undefined = useMemo(() => SYMPTOMS.find(s => s.id === symptomId), [symptomId]);
  const ranked = useMemo(() => (symptom ? rankCauses(symptom, answers) : []), [symptom, answers]);
  const metaState: 'ok' | 'loading' | 'error' = meta ? 'ok' : metaError ? 'error' : 'loading';

  const choose = useCallback((id: string | null) => {
    setSymptomId(id);
    setAnswers({});
    window.history.pushState(null, '', urlFor(id, {}));
    if (id) requestAnimationFrame(() => { headingRef.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); });
  }, []);
  const answer = useCallback((qid: string, oid: string) => {
    setAnswers(prev => {
      const next = { ...prev, [qid]: prev[qid] === oid ? undefined : oid };
      window.history.replaceState(null, '', urlFor(symptomId, next));
      return next;
    });
  }, [symptomId]);

  return (
    <div data-testid="diagnoza-tool" className="mx-auto w-full max-w-5xl px-4 pb-16 pt-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-silver-300">Diagnoza objawów · Chevrolet / GMC 1988–2000</p>
      <h1 ref={headingRef} tabIndex={-1} className="mt-1 text-3xl font-bold leading-tight text-white outline-none">Co się dzieje z moim autem?</h1>

      {!symptom && (
        <section aria-label="Wybór objawu" data-testid="symptom-picker">
          <p className="mt-2 max-w-prose text-sm text-neutral-300">Wybierz, co najbardziej pasuje. Zadamy 1–2 krótkie pytania i pokażemy możliwe przyczyny z linkami do usterek i poradników.</p>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {SYMPTOMS.map(s => (
              <li key={s.id} style={{ maxWidth: 'none' }}>
                <button type="button" data-testid={`symptom-${s.id}`} onClick={() => choose(s.id)} className="group flex h-full min-h-28 w-full flex-col items-start rounded-3xl border border-white/15 bg-neutral-900 p-4 text-left transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 active:scale-[0.99]">
                  <IconTile name={s.icon} />
                  <span className="mt-3 text-base font-bold leading-tight text-white">{s.label}</span>
                  <span className="mt-0.5 text-xs text-neutral-300">{s.hint}</span>
                </button>
              </li>
            ))}
            <li style={{ maxWidth: 'none' }}>
              <Link href="/szukaj" data-testid="symptom-other" className="group flex h-full min-h-28 flex-col rounded-3xl border border-dashed border-white/25 bg-neutral-950 p-4 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">
                <IconTile name="search" />
                <span className="mt-3 text-base font-bold leading-tight text-white">Inny objaw</span>
                <span className="mt-0.5 text-xs text-neutral-300">Szukaj w całej bazie wiedzy</span>
              </Link>
            </li>
          </ul>
          <p className="mt-6 max-w-prose text-xs text-neutral-400">To wskazówka, nie diagnoza. Kolejność przyczyn wynika z Twoich odpowiedzi i z kolejności kontroli w naszych wpisach — nie ze statystyki awarii. Sprawdź w swoim aucie / manualu.</p>
        </section>
      )}

      {symptom && (
        <section aria-label={`Objaw: ${symptom.label}`} data-testid="symptom-panel">
          <div className="mt-3 flex items-center gap-3 rounded-3xl border border-white/15 bg-neutral-900 p-3">
            <IconTile name={symptom.icon} />
            <div className="min-w-0 flex-1">
              <p className="!m-0 text-[11px] font-semibold uppercase tracking-wider text-silver-300">Wybrany objaw</p>
              <p className="!m-0 text-lg font-bold text-white" data-testid="symptom-selected">{symptom.label}</p>
            </div>
            <button type="button" data-testid="symptom-change" onClick={() => choose(null)} className="min-h-11 shrink-0 rounded-xl border border-white/20 bg-neutral-950 px-4 text-sm font-semibold text-silver-100 transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500">Zmień</button>
          </div>

          <div className="mt-4 space-y-4" data-testid="questions">
            {symptom.questions.map(q => (
              <div key={q.id} role="group" aria-labelledby={`q-${q.id}`} data-testid={`question-${q.id}`} className="min-w-0 rounded-3xl border border-white/15 bg-neutral-900 p-4">
                <p id={`q-${q.id}`} className="!m-0 text-sm font-bold text-white">{q.label} <span className="font-normal text-neutral-400">(możesz pominąć)</span></p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {q.options.map(o => {
                    const on = answers[q.id] === o.id;
                    return (
                      <button key={o.id} type="button" aria-pressed={on} data-testid={`option-${q.id}-${o.id}`} onClick={() => answer(q.id, o.id)}
                        className={`min-h-11 rounded-full border px-4 py-2 text-left text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 ${on ? 'border-white bg-white text-neutral-950' : 'border-white/20 bg-neutral-950 text-neutral-100 hover:border-silver-500'}`}>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-6 text-xl font-bold text-white" aria-live="polite" data-testid="results-heading">
            Możliwe przyczyny <span className="font-normal text-neutral-400" data-testid="results-count">({ranked.length})</span>
          </h2>
          <p className="mt-1 max-w-prose text-xs text-neutral-400">
            {Object.values(answers).some(Boolean) ? 'Kolejność: najpierw przyczyny pasujące do Twoich odpowiedzi.' : 'Odpowiedz na pytania powyżej, aby uporządkować przyczyny. Bez odpowiedzi pokazujemy wszystko w kolejności kontroli.'} To wskazówka, nie diagnoza.
          </p>
          <ol className="mt-3 space-y-3" data-testid="cause-list">
            {ranked.map((r, i) => <CauseCard key={r.cause.id} cause={r.cause} rank={i + 1} matched={r.matched} meta={meta} metaState={metaState} />)}
          </ol>
          {ranked.length === 0 && <p className="mt-3 rounded-3xl border border-dashed border-white/20 p-4 text-sm text-neutral-300">Dla takich odpowiedzi nie mamy jeszcze przyczyn w bazie. Zmień odpowiedź lub <Link href="/szukaj" className="underline">użyj wyszukiwarki</Link>.</p>}

          {symptom.gaps.length > 0 && (
            <aside data-testid="gaps" className="mt-4 rounded-3xl border border-dashed border-white/25 bg-neutral-950 p-4">
              <p className="!mb-1 text-sm font-bold text-white">Brak wpisu w bazie</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-300">{symptom.gaps.map(g => <li key={g}>{g}</li>)}</ul>
              <p className="mt-2 !mb-0 text-xs text-neutral-400">Nie zgadujemy przyczyn bez źródła — ta luka jest zapisana do uzupełnienia.</p>
            </aside>
          )}
        </section>
      )}
    </div>
  );
}
