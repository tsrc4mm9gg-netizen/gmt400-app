'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useStoredVehicleProfile } from '../../lib/vehicle-profile-store';
import { EMPTY_VEHICLE_PROFILE, VEHICLE_CATALOG, type VehicleProfile } from '../../lib/vehicle-profile';
import { collectExclusions, flowHasVersionIndependent, matchVehicle, nodeAvailability, replayPath, resolveFact, visibleSafety, visibleStop, type Facts, type Flow } from '../../lib/diagnosis-flow';

const OUTCOME_LABEL: Record<string, string> = {
  obserwacja: 'Obserwacja',
  'nieprawidłowy-wynik-testu': 'Nieprawidłowy wynik testu',
  'wskazanie-przyczyny': 'Wskazanie przyczyny',
  'konieczny-kolejny-test': 'Konieczny kolejny test',
  nierozstrzygnięte: 'Nierozstrzygnięte',
};
const COVERAGE_LABEL = {
  pasuje: 'Ścieżka pasuje do tej wersji auta.',
  częściowo: 'Ścieżka pasuje częściowo. Brakujące dane:',
  brak: 'Brak ścieżki dla tej wersji auta.',
} as const;
const UNAVAILABLE_TEXT = {
  'brak-wersji': 'Ten krok wymaga potwierdzonej wersji auta.',
  'brak-pasującego-źródła': 'Brak pasującego źródła dla tej wersji auta. To sprawdzenie nie jest dostępne.',
  'brak-danych-wersji': 'Brakuje danych o wersji auta potrzebnych do tego kroku. Uzupełnij wersję auta.',
  'źródło-bez-ustalonej-stosowalności': 'Brak udokumentowanego dopasowania źródła do tej wersji auta. To sprawdzenie nie jest dostępne.',
  'źródło-dla-innej-wersji': 'Źródło tego kroku dotyczy innej wersji auta niż wybrana. To sprawdzenie nie jest dostępne.',
} as const;
const btn = 'min-h-11 rounded-full border border-white/20 bg-neutral-950 px-4 py-2 text-left text-sm font-semibold text-white transition hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500 disabled:cursor-not-allowed disabled:opacity-50';
const select = 'min-h-11 w-full rounded-xl border border-white/20 bg-neutral-950 px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';

type Override = Partial<Pick<VehicleProfile, 'model' | 'year' | 'drive' | 'engine' | 'transmission'>>;
type Mode = 'wybór' | 'z-wersją' | 'bez-wersji';

const ALL_MODELS = [...new Set(Object.values(VEHICLE_CATALOG).flatMap(platforms => Object.values(platforms).flat()))];
const YEARS = Array.from({ length: 13 }, (_, i) => String(1988 + i));
const OTHER = 'inny / nie wiem';

const summary = (p: VehicleProfile) => [p.brand, p.model, p.year, p.engine, p.drive, p.transmission].filter(Boolean).join(' · ');

const PARAM = 'sciezka';
function readPending(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = new URLSearchParams(window.location.search).get(PARAM);
  return raw ? raw.split(',').filter(Boolean) : [];
}
function writeUrl(answers: string[]) {
  const url = new URL(window.location.href);
  if (answers.length) url.searchParams.set(PARAM, answers.join(',')); else url.searchParams.delete(PARAM);
  window.history.replaceState(null, '', url.pathname + url.search);
}

/**
 * Prowadzenie krok po kroku według ścieżki z rejestru. Logika przejść i bramek jest w src/lib/diagnosis-flow.ts.
 * Bez potwierdzonej wersji auta działają tylko kroki jawnie oznaczone jako niezależne od wersji.
 */
export default function FlowRunner({ flow }: { flow: Flow }) {
  const garage = useStoredVehicleProfile();
  const [override, setOverride] = useState<Override>({});
  const [mode, setMode] = useState<Mode>('wybór');
  const [facts, setFacts] = useState<Facts>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const pending = useRef<string[]>(readPending());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const profile = useMemo<VehicleProfile | null>(() => {
    const merged = { ...EMPTY_VEHICLE_PROFILE, ...(garage ?? {}), ...override };
    return merged.model ? merged : null;
  }, [garage, override]);
  const signature = JSON.stringify(profile ? [profile.model, profile.year, profile.drive, profile.engine, profile.transmission] : null);
  const firstSignature = useRef(signature);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Zmiana wersji auta po potwierdzeniu unieważnia odpowiedzi, dane i wnioski.
  useEffect(() => {
    if (signature === firstSignature.current) return;
    firstSignature.current = signature;
    if (modeRef.current !== 'wybór') { setMode('wybór'); setAnswers([]); setFacts({}); }
  }, [signature]);

  const activeProfile = mode === 'z-wersją' ? profile : null;
  const coverage = useMemo(() => matchVehicle(profile, flow), [profile, flow]);
  const replay = useMemo(() => replayPath(flow, activeProfile, facts, answers), [flow, activeProfile, facts, answers]);
  const exclusions = useMemo(() => collectExclusions(flow, replay.path), [flow, replay.path]);
  const node = flow.nodes[replay.currentId];
  const availability = node && mode !== 'wybór' && !replay.stopped ? nodeAvailability(node, activeProfile, facts, flow) : null;

  useEffect(() => { if (mode !== 'wybór') writeUrl(replay.path.map(s => s.answerId)); }, [mode, replay.path]);
  useEffect(() => { if (mode !== 'wybór') headingRef.current?.focus({ preventScroll: true }); }, [mode, replay.currentId, replay.stopped]);

  if (!node) return null;

  const start = (next: Mode) => {
    setMode(next);
    setFacts({});
    setAnswers(pending.current);
    pending.current = [];
  };
  const backToVersion = () => { setMode('wybór'); setAnswers([]); setFacts({}); };
  const choose = (answerId: string) => setAnswers([...replay.path.map(s => s.answerId), answerId]);
  const back = () => setAnswers(replay.path.slice(0, -1).map(s => s.answerId));

  if (mode === 'wybór') {
    const engines = [...new Set(flow.scope.flatMap(s => s.engines ?? []))];
    const transmissions = [...new Set(flow.scope.flatMap(s => s.transmissions ?? []))];
    const ENGINE_LABEL: Record<string, string> = { L31: 'L31 (Vortec 5.7, 8. znak VIN: R)' };
    const field = (key: keyof Override, label: string, options: string[], withOther = false, labels: Record<string, string> = {}) => (
      <label className="block text-sm text-neutral-200" key={key}>
        <span className="mb-1 block font-semibold text-white">{label}</span>
        <select className={select} data-testid={`flow-field-${key}`} value={profile ? (profile[key] as string) : ''} onChange={e => setOverride(o => ({ ...o, [key]: e.target.value }))}>
          <option value="">Wybierz</option>
          {options.map(o => <option key={o} value={o}>{labels[o] ?? o}</option>)}
          {withOther && <option value={OTHER}>Inny / nie wiem</option>}
        </select>
      </label>
    );
    const source = !profile ? 'Nie ustawiono auta w garażu. Wybierz wersję ręcznie.' : Object.keys(override).length ? 'Wersja wybrana ręcznie. To nie jest weryfikacja auta.' : 'Dane z garażu, do potwierdzenia. To nie jest weryfikacja auta.';
    return (
      <section aria-label="Potwierdź auto" data-testid="flow-confirm" className="mt-4 rounded-3xl border border-white/15 bg-neutral-900 p-4 pb-28">
        <h2 ref={headingRef} tabIndex={-1} className="!m-0 text-lg font-bold text-white">Potwierdź auto</h2>
        <p className="mt-2 text-sm text-neutral-200" data-testid="flow-vehicle">{profile ? summary(profile) : 'Brak wybranej wersji auta.'}</p>
        <p className="mt-1 text-xs text-neutral-400">{source}</p>
        <div className="mt-3 grid gap-3">
          {field('model', 'Model', ALL_MODELS)}
          {field('year', 'Rok', YEARS)}
          {field('drive', 'Napęd', ['2WD', '4WD'])}
          {engines.length > 0 && field('engine', 'Silnik', engines, true, ENGINE_LABEL)}
          {engines.length > 0 && <p className="-mt-1 text-xs text-neutral-400" data-testid="flow-engine-hint">Ścieżka dotyczy silnika 5.7 Vortec oznaczonego L31. Jeśli w Twoim VIN-ie 8. znak to R, wybierz L31.</p>}
          {transmissions.length > 0 && field('transmission', 'Skrzynia', transmissions, true)}
        </div>
        <p className="mt-3 text-sm font-semibold text-white" data-testid="flow-coverage">
          {!profile ? 'Wybierz wersję auta, aby sprawdzić dopasowanie ścieżki.' : <>{COVERAGE_LABEL[coverage.status]} {coverage.status === 'częściowo' && coverage.missing.join(', ')}</>}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {profile && coverage.status === 'pasuje' && <button type="button" className={btn} data-testid="flow-confirm-yes" onClick={() => start('z-wersją')}>Potwierdzam wersję auta, dalej</button>}
          {coverage.status !== 'pasuje' && flowHasVersionIndependent(flow) && <button type="button" className={btn} data-testid="flow-version-free" onClick={() => start('bez-wersji')}>Tylko obserwacje niezależne od wersji</button>}
          <Link href="/moj-samochod" className={`${btn} inline-flex items-center`}>Ustaw auto w profilu</Link>
        </div>
      </section>
    );
  }

  const safety = visibleSafety(node);
  const stopText = replay.stopped ? visibleStop(node) : null;
  const unavailable = availability && !availability.available ? availability : null;

  return (
    <section aria-label={flow.title} data-testid="flow-step" className="mt-4 rounded-3xl border border-white/15 bg-neutral-900 p-4 pb-28">
      <h2 ref={headingRef} tabIndex={-1} className="!m-0 text-lg font-bold text-white" data-testid="flow-title">
        {replay.stopped ? 'Zatrzymaj się na tym kroku' : unavailable ? (unavailable.reason === 'brak-danych' ? 'Potrzebna dana do kroku' : 'Krok niedostępny') : node.title}
      </h2>
      <p className="mt-1 text-xs text-neutral-400" data-testid="flow-mode">{mode === 'bez-wersji' ? 'Bez potwierdzonej wersji: tylko obserwacje niezależne od wersji.' : `Wersja: ${profile ? summary(profile) : ''}`}</p>
      {exclusions.length > 0 && <p className="mt-2 text-sm text-neutral-200" data-testid="flow-excluded">Co już wykluczono: {exclusions.join(', ')}</p>}
      {replay.stopped ? (
        <div data-testid="flow-stop" className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100">
          {stopText ?? 'Dalsze kroki tej ścieżki są zatrzymane.'}
        </div>
      ) : unavailable ? (
        <div data-testid="flow-unavailable" className="mt-3 space-y-3">
          {unavailable.reason === 'brak-danych' ? (
            unavailable.missing.map(req => (
              <div key={req.key} role="group" aria-label={req.label}>
                <p className="!m-0 text-sm font-bold text-white">{req.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {req.options.map(o => (
                    <button key={o.id} type="button" className={btn} aria-pressed={facts[req.key] === o.id} onClick={() => setFacts(f => ({ ...f, [req.key]: o.id }))}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              <p className="text-sm text-neutral-200">{UNAVAILABLE_TEXT[unavailable.reason]}{unavailable.missingVersion.length > 0 && ` (${unavailable.missingVersion.join(', ')})`}</p>
              {(unavailable.reason === 'brak-wersji' || unavailable.reason === 'brak-danych-wersji') && <button type="button" className={btn} data-testid="flow-to-version" onClick={backToVersion}>Wybierz wersję auta</button>}
            </>
          )}
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-neutral-200">{node.text}</p>
          {safety && <p className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100" data-testid="flow-safety">{safety}</p>}
          {node.kind === 'result' ? (
            <div data-testid="flow-result" className="mt-3 space-y-2 text-sm text-neutral-200">
              <p className="!m-0 font-bold text-white">{OUTCOME_LABEL[node.outcome]}</p>
              {node.excluded.length > 0 && <p className="!m-0">Wykluczono: {node.excluded.join(', ')}</p>}
              {node.notChecked.length > 0 && <p className="!m-0">Nie sprawdzono: {node.notChecked.join(', ')}</p>}
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {node.answers.map(a => <button key={a.id} type="button" className={btn} data-testid={`flow-answer-${a.id}`} onClick={() => choose(a.id)}>{a.label}</button>)}
            </div>
          )}
          {(node.details || node.sources.length > 0) && (
            <details className="mt-3 text-xs text-neutral-400" data-testid="flow-details">
              <summary className="cursor-pointer font-semibold text-neutral-300">Szczegóły i źródło</summary>
              {node.details && <p className="mt-2 !mb-0">{node.details}</p>}
              {node.sources.length > 0 && (
                <ul className="mt-2 list-none space-y-1 !p-0" data-testid="flow-sources">
                  {node.sources.map(s => <li key={s.url}>Źródło: {s.label} ({s.kind}, stosowalność {s.applicability})</li>)}
                </ul>
              )}
            </details>
          )}
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {replay.path.length > 0 && <button type="button" className={btn} onClick={back} data-testid="flow-back">Wstecz</button>}
        <button type="button" className={btn} onClick={backToVersion} data-testid="flow-change-version">Zmień wersję auta</button>
      </div>
    </section>
  );
}

export { resolveFact };
