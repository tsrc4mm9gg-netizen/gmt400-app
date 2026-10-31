'use client';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useVehicleProfile } from '../VehicleProfileProvider';
import VinDecoder from '../VinDecoder';
import FuseTable from '../schematy/FuseTable';
import { ILLUSTRATED_TIPS, ILLUSTRATED_TIPS_MANUAL } from '../AdditionalTips';
import { decodeVin, profileFromVin } from '@/lib/vin-decode.mjs';
import { FUSE_YEARS } from '@/lib/fuses.mjs';
import { knowledgeFit, partFit, scopeTextFit, type Fit } from '@/lib/my-car.mjs';
import { PART_FITMENTS } from '@/lib/parts-compatibility';
import { RPO_CATALOG, findRpo, rpoFit, rpoVehicleFor, type RpoEntry } from '@/lib/rpo-catalog';
import { storageAvailable } from '@/lib/vehicle-profile-store';
import { MAX_GARAGE_CARS, activateCar, addCar, removeActiveCar, removeGarageCar, saveActiveCar, useGarageOthers } from '@/lib/garage-store';
import { CategoryIcon } from '../ui/CategoryIcon';
import {
  EMPTY_VEHICLE_PROFILE, GMT400_YEAR_RANGE, VEHICLE_CATALOG, isValidVehicleProfile, normalizeRpoCodes,
  type VehicleMake, type VehiclePlatform, type VehicleProfile,
} from '@/lib/vehicle-profile';

type Entry = { id: string; Nazwa: string; Typ: string; Model?: string; Modele?: string[]; Lata?: string; applicability?: { model?: string[]; years?: string[] } };

const YEARS = Array.from({ length: GMT400_YEAR_RANGE[1] - GMT400_YEAR_RANGE[0] + 1 }, (_, i) => String(GMT400_YEAR_RANGE[0] + i));
const PLATFORM_LABEL: Record<VehiclePlatform, string> = { 'C/K': 'C/K (pickup)', Sierra: 'Sierra (pickup)', Tahoe: 'Tahoe', Yukon: 'Yukon', Suburban: 'Suburban' };
const TRANSMISSION_BY_RPO: Record<string, string> = { M30: '4L60E', MT1: '4L80E' };
const RPO_BY_TRANSMISSION: Record<string, string> = { '4L60E': 'M30', '4L80E': 'MT1' };
const field = 'mt-1 block min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white focus:border-silver-600 focus:outline-none';
const btn = 'inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-silver-600';
const chip = 'inline-flex max-w-full items-center rounded-full border px-3 py-1 text-xs';
const CHECK = 'sprawdź w swoim aucie / manualu';

const yearNum = (profile: VehicleProfile | null) => (profile?.year ? Number(profile.year) : null);
const vehicleName = (p: Pick<VehicleProfile, 'brand' | 'platform'>) => rpoVehicleFor(p.brand, p.platform);

function rpoOptions(p: Pick<VehicleProfile, 'brand' | 'platform' | 'year'>, category: 'Silniki' | 'Skrzynie') {
  const vehicle = vehicleName(p);
  const year = p.year ? Number(p.year) : null;
  const list = RPO_CATALOG.filter(e => e.category === category && e.status !== 'internal');
  const listed = vehicle && year ? list.filter(e => rpoFit(e, vehicle, year) === 'listed') : [];
  return listed.length ? listed : list;
}

/* ---------- Formularz: VIN albo model + rocznik ---------- */
function CarForm({ initial, onDone, onCancel, mode = 'edit' }: { initial: VehicleProfile | null; onDone: (persisted: boolean) => void; onCancel?: () => void; mode?: 'edit' | 'add' }) {
  const [draft, setDraft] = useState<VehicleProfile>(initial ?? EMPTY_VEHICLE_PROFILE);
  const [rpoText, setRpoText] = useState((initial?.rpoCodes ?? []).join(' '));
  const [vinNote, setVinNote] = useState('');
  const [error, setError] = useState('');
  const set = (patch: Partial<VehicleProfile>) => setDraft(d => ({ ...d, ...patch }));
  const brand = draft.brand as VehicleMake | '';
  const platforms = brand ? (Object.keys(VEHICLE_CATALOG[brand]) as VehiclePlatform[]).filter(p => VEHICLE_CATALOG[brand][p].length) : [];
  const models = brand && draft.platform ? VEHICLE_CATALOG[brand][draft.platform as VehiclePlatform] ?? [] : [];
  const engines = useMemo(() => rpoOptions(draft, 'Silniki'), [draft]);
  const gearboxes = useMemo(() => rpoOptions(draft, 'Skrzynie'), [draft]);
  const engineKnown = !draft.engine || engines.some(e => e.code === draft.engine);
  const gearboxValue = RPO_BY_TRANSMISSION[draft.transmission] ?? draft.transmission;
  const gearboxKnown = !gearboxValue || gearboxes.some(e => e.code === gearboxValue);

  const onVin = (vin: string | null, year: number | null) => {
    if (!vin) { setVinNote(''); return; }
    const r = decodeVin(vin);
    const fromVin = profileFromVin(r) ?? {};
    const patch: Partial<VehicleProfile> = { vin };
    const notes: string[] = [];
    if (fromVin.brand) { patch.brand = fromVin.brand; notes.push(`marka ${fromVin.brand}`); }
    if (fromVin.brand && fromVin.platform && fromVin.model && (VEHICLE_CATALOG[fromVin.brand][fromVin.platform] ?? []).includes(fromVin.model)) {
      patch.platform = fromVin.platform; patch.model = fromVin.model; notes.push(`model ${fromVin.model}`);
    } else { patch.platform = fromVin.brand && fromVin.brand !== draft.brand ? '' : draft.platform; patch.model = fromVin.brand && fromVin.brand !== draft.brand ? '' : draft.model; notes.push('nadwozia/modelu nie odczytano – wybierz ręcznie'); }
    if (fromVin.drive) { patch.drive = fromVin.drive; notes.push(`napęd ${fromVin.drive}`); }
    if (year && year >= GMT400_YEAR_RANGE[0] && year <= GMT400_YEAR_RANGE[1]) { patch.year = String(year); notes.push(`rocznik ${year}`); }
    else notes.push('rocznik spoza GMT400 1988–2000 – wybierz ręcznie');
    if (fromVin.engine) { patch.engine = fromVin.engine; notes.push(`silnik ${fromVin.engine}${r.ok && r.engine ? ` (${r.engine.engine})` : ''}`); }
    else notes.push(r.ok && r.engine ? `silnik ${r.engine.engine} (bez kodu RPO – wybierz z listy)` : 'silnika nie odczytano – wybierz ręcznie');
    if (r.ok && !r.check.ok) notes.push('uwaga: cyfra kontrolna się nie zgadza – sprawdź przepisany VIN');
    set(patch);
    setVinNote(`Z VIN: ${notes.join(', ')}. Sprawdź pola poniżej i zapisz.`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const profile: VehicleProfile = { ...draft, rpoCodes: normalizeRpoCodes(rpoText) };
    if (!profile.vin) delete profile.vin;
    if (!isValidVehicleProfile(profile) || !profile.year) { setError('Wybierz markę, nadwozie, model i rocznik.'); return; }
    setError('');
    onDone(mode === 'add' ? addCar(profile) : saveActiveCar(profile));
  };

  return (
    <div data-testid="my-car-form" className="mt-6 grid gap-4 lg:grid-cols-2">
      <div className="min-w-0 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-silver-300">1. Masz VIN? (opcjonalnie)</h2>
        <p className="mb-3 mt-1 text-sm text-neutral-400">Odczytamy markę, napęd, model, rocznik i silnik z tabel GM (każde pole ze źródłem) i wypełnimy profil. Dekodowanie działa w przeglądarce — VIN zostaje na tym urządzeniu.</p>
        <VinDecoder onDecoded={onVin} />
        {vinNote && <p data-testid="my-car-vin-note" role="status" className="rounded-lg border border-silver-600/40 bg-silver-600/10 p-3 text-sm text-silver-100">{vinNote}</p>}
      </div>
      <form onSubmit={submit} aria-label="Dane auta" className="min-w-0 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
        <h2 className="text-xl font-semibold text-silver-300">2. Model i rocznik</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block min-w-0 text-sm text-neutral-300">Marka
            <select className={field} value={draft.brand} onChange={e => set({ brand: e.target.value as VehicleMake | '', platform: '', model: '' })}>
              <option value="">Wybierz</option><option>Chevrolet</option><option>GMC</option>
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300">Nadwozie
            <select className={field} value={draft.platform} disabled={!brand} onChange={e => set({ platform: e.target.value as VehiclePlatform | '', model: '' })}>
              <option value="">Wybierz</option>{platforms.map(p => <option key={p} value={p}>{PLATFORM_LABEL[p]}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300">Model
            <select className={field} value={draft.model} disabled={!models.length} onChange={e => { const model = e.target.value; set({ model, drive: /^K/.test(model) ? '4WD' : /^C/.test(model) ? '2WD' : draft.drive }); }}>
              <option value="">Wybierz</option>{models.map(m => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300">Rocznik
            <select className={field} value={draft.year} onChange={e => set({ year: e.target.value })}>
              <option value="">Wybierz</option>{YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300">Napęd
            <select className={field} value={draft.drive} onChange={e => set({ drive: e.target.value as VehicleProfile['drive'] })}>
              <option value="">Nie wiem</option><option value="2WD">2WD</option><option value="4WD">4WD</option>
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300">Silnik (kod RPO)
            <select className={field} value={draft.engine} onChange={e => set({ engine: e.target.value })}>
              <option value="">Nie wiem</option>
              {!engineKnown && <option value={draft.engine}>{draft.engine} (zapisane)</option>}
              {engines.map(e => <option key={e.code} value={e.code}>{e.code} — {e.description}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300 sm:col-span-2">Skrzynia (kod RPO)
            <select className={field} value={gearboxValue} onChange={e => set({ transmission: TRANSMISSION_BY_RPO[e.target.value] ?? e.target.value })}>
              <option value="">Nie wiem</option>
              {!gearboxKnown && <option value={gearboxValue}>{gearboxValue} (zapisane)</option>}
              {gearboxes.map(e => <option key={e.code} value={e.code}>{e.code} — {e.description}</option>)}
            </select>
          </label>
          <label className="block min-w-0 text-sm text-neutral-300 sm:col-span-2">Kody RPO z naklejki (opcjonalnie)
            <input className={field} value={rpoText} onChange={e => setRpoText(e.target.value.toUpperCase())} placeholder="np. G80 Z71 L31" autoCapitalize="characters" autoComplete="off" spellCheck={false} />
          </label>
        </div>
        <p className="mt-2 text-xs text-neutral-400">Listy silników i skrzyń pochodzą z dokumentów GM dla wybranego auta i rocznika (<Link href="/narzedzia/rpo" className="text-silver-400 underline">dekoder RPO</Link>). Napęd podpowiadamy z litery modelu (C = 2WD, K = 4WD).</p>
        {error && <p role="alert" className="mt-3 text-sm text-danger-300">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="submit" className={`${btn} border-silver-600 bg-silver-600 hover:bg-silver-500`}>Zapisz moje auto</button>
          {onCancel && <button type="button" onClick={onCancel} className={btn}>Anuluj</button>}
        </div>
      </form>
    </div>
  );
}

/* ---------- Wspólne elementy ---------- */
const FIT_LABEL: Record<Fit, string> = { match: 'pasuje do Twojego auta', general: 'ogólne dla GMT400', unknown: 'zakres do sprawdzenia', outside: 'poza zakresem' };
const FitChip = ({ fit }: { fit: Fit }) => (
  <span data-testid="my-car-fit" data-fit={fit} className={`${chip} ${fit === 'match' ? 'border-silver-600/60 bg-silver-600/15 text-silver-100' : 'border-white/15 bg-white/5 text-neutral-200'}`}>{FIT_LABEL[fit]}</span>
);
const ScopeLine = ({ scope }: { scope: string }) => (
  <p className="mt-1 break-words text-xs text-neutral-400">Model i lata: {scope || 'brak opisu zakresu'} — {CHECK}</p>
);

function Section({ id, title, children, lead }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-6 min-w-0 scroll-mt-24 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
      <h2 id={`${id}-h`} className="text-xl font-semibold text-silver-300">{title}</h2>
      {lead && <p className="mt-1 text-sm text-neutral-400">{lead}</p>}
      {children}
    </section>
  );
}

type Row = { key: string; href: string; title: string; scope: string; fit: Fit; extra?: string; external?: boolean };
function Rows({ rows, testId, empty, limit = 8 }: { rows: Row[]; testId: string; empty: string; limit?: number }) {
  const [all, setAll] = useState(false);
  const shown = rows.filter(r => r.fit === 'match' || r.fit === 'general').sort((a, b) => (a.fit === b.fit ? 0 : a.fit === 'match' ? -1 : 1));
  const unknown = rows.filter(r => r.fit === 'unknown');
  const outside = rows.filter(r => r.fit === 'outside').length;
  const item = (r: Row) => (
    <li key={r.key} data-testid={testId} data-fit={r.fit} className="min-w-0 rounded-lg border border-white/10 bg-black/40 p-3">
      {r.external
        ? <a href={r.href} target="_blank" rel="noopener noreferrer" className="break-words font-semibold text-white underline-offset-4 hover:text-silver-300 hover:underline">{r.title}</a>
        : <Link href={r.href} className="break-words font-semibold text-white underline-offset-4 hover:text-silver-300 hover:underline">{r.title}</Link>}
      <div className="mt-2 flex flex-wrap gap-2"><FitChip fit={r.fit} /></div>
      <ScopeLine scope={r.scope} />
      {r.extra && <p className="mt-1 break-words text-xs text-neutral-400">{r.extra}</p>}
    </li>
  );
  return (
    <div className="mt-3">
      {shown.length ? <ul className="grid gap-2 sm:grid-cols-2">{(all ? shown : shown.slice(0, limit)).map(item)}</ul> : <p className="text-sm text-neutral-300">{empty}</p>}
      {shown.length > limit && <button type="button" onClick={() => setAll(v => !v)} className={`${btn} mt-3`}>{all ? 'Pokaż mniej' : `Pokaż wszystkie (${shown.length})`}</button>}
      {unknown.length > 0 && (
        <details className="mt-3 rounded-lg border border-white/10 p-3">
          <summary className="min-h-11 cursor-pointer content-center text-sm text-neutral-200">Zakres niejednoznaczny – do sprawdzenia ({unknown.length})</summary>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">{unknown.map(item)}</ul>
        </details>
      )}
      {outside > 0 && <p className="mt-2 text-xs text-neutral-500">Pominięto {outside} spoza zakresu Twojego auta (inny model, rocznik lub silnik).</p>}
    </div>
  );
}

function useKnowledge() {
  const [state, setState] = useState<{ items: Entry[]; status: 'loading' | 'ok' | 'error' }>({ items: [], status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const ctrl = new AbortController();
    let live = true;
    const timer = setTimeout(() => ctrl.abort(), 15000);
    fetch('/api/notion', { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { results?: Entry[] }) => { if (live) setState({ items: Array.isArray(d.results) ? d.results : [], status: 'ok' }); })
      .catch(() => { if (live) setState(s => ({ ...s, status: 'error' })); })
      .finally(() => clearTimeout(timer));
    return () => { live = false; clearTimeout(timer); ctrl.abort(); };
  }, [attempt]);
  return { ...state, retry: () => { setState({ items: [], status: 'loading' }); setAttempt(a => a + 1); } };
}

const knowledgeScope = (e: Entry) => [((e.applicability?.model?.length ? e.applicability.model : e.Modele) ?? []).join(', ') || e.Model || '', (e.applicability?.years?.length ? e.applicability.years.join(', ') : e.Lata) ?? ''].filter(Boolean).join(' · ');

function KnowledgeRows({ items, type, profile, testId, empty }: { items: Entry[]; type: string; profile: VehicleProfile; testId: string; empty: string }) {
  const rows = useMemo(() => {
    const liters = profile.engine ? findRpo(profile.engine)?.original.match(/(\d\.\d)L/)?.[1] : undefined;
    return items.filter(e => e.Typ === type).map<Row>(e => {
      const f = knowledgeFit(e, profile, liters);
      return { key: e.id, href: `/baza/${encodeURIComponent(e.id)}`, title: e.Nazwa, scope: knowledgeScope(e), fit: f.fit, extra: f.engines.length ? `Silnik w tytule: ${f.engines.join(', ')}` : undefined };
    });
  }, [items, type, profile]);
  return <Rows rows={rows} testId={testId} empty={empty} />;
}

/* ---------- RPO auta ---------- */
const RPO_FIT_LABEL = { listed: 'w dokumentach GM dla Twojego auta i rocznika', 'other-years': 'w dokumentach GM dla innych roczników', 'other-vehicle': 'w dokumentach GM dla innego modelu', 'no-data': 'brak dokumentu dla tego auta/rocznika' } as const;
function RpoList({ codes, profile }: { codes: string[]; profile: VehicleProfile }) {
  const vehicle = vehicleName(profile);
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {codes.map(code => {
        const entry: RpoEntry | undefined = findRpo(code);
        return (
          <li key={code} data-testid="my-car-rpo" data-code={code} className="min-w-0 rounded-lg border border-white/10 bg-black/40 p-3 text-sm">
            <p className="break-words"><span className="font-mono font-bold text-white">{code}</span> — {entry ? entry.description : <span className="text-silver-200">nieznany – sprawdź</span>}</p>
            {entry && <p className="mt-1 text-xs text-neutral-400">{entry.category} · {RPO_FIT_LABEL[rpoFit(entry, vehicle, yearNum(profile))]} — {CHECK}</p>}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Strona ---------- */
export default function MyCar() {
  const { profile, ready } = useVehicleProfile();
  const others = useGarageOthers();
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [confirmForget, setConfirmForget] = useState(false);
  const [notice, setNotice] = useState('');
  const [storageOk, setStorageOk] = useState(true);
  useEffect(() => { setStorageOk(storageAvailable()); }, []);

  if (!ready) return <p data-testid="my-car-loading" className="mt-6 text-neutral-400">Wczytywanie zapisanego auta…</p>;

  const storageNote = !storageOk && <p data-testid="my-car-storage-note" role="status" className="mt-4 rounded-lg border border-white/15 bg-white/5 p-3 text-sm text-neutral-200">Pamięć przeglądarki jest niedostępna (np. tryb prywatny lub zablokowane dane witryn). Auto zadziała tylko do zamknięcia tej karty.</p>;
  const done = (persisted: boolean) => { setEditing(false); setAdding(false); setNotice(persisted ? 'Zapisano auto w tej przeglądarce.' : 'Auto ustawione tylko w tej karcie – pamięć przeglądarki jest niedostępna.'); };

  if (!profile || editing || adding) {
    return (
      <>
        {storageNote}
        {!profile && <p className="mt-6 text-neutral-300">Nie masz jeszcze zapisanego auta. Wystarczy model i rocznik – VIN jest opcjonalny.</p>}
        {adding && <p className="mt-6 text-neutral-300" data-testid="my-car-adding">Dodajesz kolejne auto. Po zapisie stanie się aktywne, a obecne zostanie w Twoim garażu.</p>}
        <CarForm key={adding ? 'add' : 'edit'} mode={adding ? 'add' : 'edit'} initial={adding ? null : profile} onDone={done} onCancel={profile ? () => { setEditing(false); setAdding(false); } : undefined} />
        <PrivacyNote />
      </>
    );
  }
  const forget = () => {
    const { ok, next } = removeActiveCar();
    setConfirmForget(false);
    setNotice(next ? `Usunięto auto z tej przeglądarki. Aktywne jest teraz: ${next.brand} ${next.model}${next.year ? ' ' + next.year : ''}.` : ok ? 'Zapomniano auto. Dane usunięto z tej przeglądarki.' : 'Auto wyłączono, ale nie udało się usunąć wszystkich zapisów z pamięci.');
  };
  return <>
    <CarView profile={profile} notice={notice} storageNote={storageNote} onEdit={() => { setNotice(''); setEditing(true); }} confirmForget={confirmForget} setConfirmForget={setConfirmForget} onForget={forget}
      garage={<Garage profile={profile} others={others} onAdd={() => { setNotice(''); setAdding(true); }} onNotice={setNotice} />} />
    <PrivacyNote />
  </>;
}

function PrivacyNote() {
  return (
    <p data-testid="my-car-privacy" className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4 text-sm text-neutral-300">
      <strong className="text-silver-200">Prywatność:</strong> auta (także VIN) zapisujemy tylko na tym urządzeniu, w pamięci tej przeglądarki — bez konta i bez wysyłania na nasz serwer. VIN dekodujemy w przeglądarce; do bazy NHTSA trafia tylko wtedy, gdy sam klikniesz pobranie danych lub historii w dekoderze. Wyczyszczenie danych witryny usuwa zapisane auta.
    </p>
  );
}

const carLabel = (p: VehicleProfile) => `${p.brand} ${p.model} · ${p.year || 'rocznik ?'}`;

/** Garaż: kilka aut w tej przeglądarce, jedno aktywne (to ono filtruje Usterki, DIY, szukajkę i RPO). */
function Garage({ profile, others, onAdd, onNotice }: { profile: VehicleProfile; others: VehicleProfile[]; onAdd: () => void; onNotice: (text: string) => void }) {
  const [confirm, setConfirm] = useState<number | null>(null);
  const full = others.length + 1 >= MAX_GARAGE_CARS;
  return (
    <section data-testid="my-car-garage" aria-labelledby="my-car-garage-h" className="mt-4 min-w-0 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
      <h2 id="my-car-garage-h" className="text-lg font-semibold text-silver-300">Twój garaż ({others.length + 1})</h2>
      <ul className="mt-3 space-y-2">
        <li className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-silver-500/50 bg-silver-600/10 px-3 py-2" style={{ maxWidth: 'none' }} data-testid="my-car-garage-active">
          <span className="min-w-0 flex-1 break-words font-semibold text-white">{carLabel(profile)}</span>
          <span className={`${chip} border-silver-400/60 text-silver-100`}>Aktywne</span>
        </li>
        {others.map((car, index) => (
          <li key={`${index}-${carLabel(car)}`} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 px-3 py-2" style={{ maxWidth: 'none' }} data-testid="my-car-garage-item">
            <span className="min-w-0 flex-1 break-words text-neutral-100">{carLabel(car)}</span>
            {confirm === index
              ? <span className="flex flex-wrap items-center gap-2" role="group" aria-label={`Potwierdź usunięcie: ${carLabel(car)}`}>
                  <button type="button" className={`${btn} border-silver-600 bg-silver-600 text-neutral-950 hover:bg-silver-500`} onClick={() => { removeGarageCar(index); setConfirm(null); onNotice(`Usunięto z garażu: ${carLabel(car)}.`); }}>Tak, usuń</button>
                  <button type="button" className={btn} onClick={() => setConfirm(null)}>Nie</button>
                </span>
              : <>
                  <button type="button" className={btn} onClick={() => { activateCar(index); onNotice(`Aktywne auto: ${carLabel(car)}. Listy i szukajka pokazują teraz materiały dla niego.`); }} aria-label={`Ustaw jako aktywne: ${carLabel(car)}`}>Ustaw jako aktywne</button>
                  <button type="button" className={btn} onClick={() => setConfirm(index)} aria-label={`Usuń z garażu: ${carLabel(car)}`}>Usuń</button>
                </>}
          </li>
        ))}
      </ul>
      {full
        ? <p className="mt-3 text-sm text-neutral-400">Garaż mieści {MAX_GARAGE_CARS} aut. Usuń jedno, żeby dodać kolejne.</p>
        : <button type="button" onClick={onAdd} className={`${btn} mt-3`} data-testid="my-car-add">+ Dodaj kolejne auto</button>}
    </section>
  );
}

function CarView({ profile, notice, storageNote, onEdit, confirmForget, setConfirmForget, onForget, garage }: { profile: VehicleProfile; notice: string; storageNote: React.ReactNode; onEdit: () => void; confirmForget: boolean; setConfirmForget: (v: boolean) => void; onForget: () => void; garage?: React.ReactNode }) {
  const knowledge = useKnowledge();
  const year = profile.year;
  const vin = profile.vin ? decodeVin(profile.vin) : null;
  const engine = profile.engine ? findRpo(profile.engine) : undefined;
  const gearbox = findRpo(RPO_BY_TRANSMISSION[profile.transmission] ?? profile.transmission);
  const fuseYear = (FUSE_YEARS as readonly string[]).includes(year);
  const fuseOwnModel = profile.platform === 'C/K' || profile.platform === 'Sierra' || (profile.platform === 'Suburban' && year === '1999');
  const tips = ILLUSTRATED_TIPS.map<Row>(t => ({ key: t.id, href: '/baza?tab=tips', title: t.title, scope: t.scope, fit: scopeTextFit(t.scope, profile).fit, extra: `Źródło: Owner’s Manual 1999 Suburban/Tahoe — ${t.reference}` }));
  const parts = PART_FITMENTS.map<Row>(p => ({ key: p.part, href: p.source, external: true, title: p.part, scope: `${p.fitsModels.join(', ')} · ${p.yearRange[0]}–${p.yearRange[1]}`, fit: partFit(p, profile).fit, extra: `${p.sourceTitle} (${p.confidence === 'factory' ? 'dane fabryczne' : 'do potwierdzenia'}). ${p.notes}` }));
  const nav = [['bezpieczniki', 'Bezpieczniki'], ['usterki', 'Usterki'], ['diy', 'DIY i porady'], ['porady', 'Porady ilustrowane'], ['czesci', 'Części'], ['model', 'Model'], ['rpo', 'Kody RPO']];
  return (
    <>
      {storageNote}
      {notice && <p role="status" data-testid="my-car-notice" className="mt-4 rounded-lg border border-silver-600/40 bg-silver-600/10 p-3 text-sm text-silver-100">{notice}</p>}
      <section data-testid="my-car-summary" aria-labelledby="my-car-summary-h" className="mt-6 min-w-0 rounded-2xl border border-silver-500/50 bg-[linear-gradient(160deg,#26262b_0%,#0b0b0d_55%,#060607_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_30px_rgba(0,0,0,0.5)] sm:p-5">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#e5e7eb,#9ca3af)] text-neutral-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"><CategoryIcon name="car" className="h-7 w-7" /></span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-silver-300">Twoje auto · aktywne</p>
            <h2 id="my-car-summary-h" className="mt-1 break-words text-2xl font-bold text-white">{profile.brand} {profile.model} · {year || 'rocznik ?'}</h2>
          </div>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div className="min-w-0"><dt className="text-neutral-400">Silnik</dt><dd className="break-words text-neutral-100">{profile.engine ? `${profile.engine}${engine ? ` — ${engine.description}` : ''}` : 'nie podano'}</dd></div>
          <div className="min-w-0"><dt className="text-neutral-400">Skrzynia</dt><dd className="break-words text-neutral-100">{profile.transmission ? `${profile.transmission}${gearbox ? ` — ${gearbox.description}` : ''}` : 'nie podano'}</dd></div>
          <div className="min-w-0"><dt className="text-neutral-400">Napęd</dt><dd className="text-neutral-100">{profile.drive || 'nie podano'}</dd></div>
          <div className="min-w-0"><dt className="text-neutral-400">VIN</dt><dd className="break-all font-mono text-neutral-100">{profile.vin ? `${profile.vin}${vin?.ok ? (vin.check.ok ? ' ✓ cyfra kontrolna OK' : ' · cyfra kontrolna się nie zgadza — sprawdź VIN') : ''}` : 'nie podano'}</dd></div>
        </dl>
        <p className="mt-3 text-xs text-neutral-400">Zapisane tylko na tym urządzeniu. Dane z formularza – {CHECK}.</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Treści dopasowane do auta" data-testid="my-car-filter-links">
          {[['/usterki', 'Usterki dla tego auta'], ['/diy', 'DIY dla tego auta'], ['/szukaj', 'Szukaj objawu'], ['/narzedzia/rpo', 'Kody RPO']].map(([href, label]) => <li key={href}><Link href={href} className={`${btn} border-silver-500/40`}>{label}</Link></li>)}
        </ul>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onEdit} className={btn}>Zmień auto</button>
          {!confirmForget
            ? <button type="button" onClick={() => setConfirmForget(true)} className={btn}>Zapomnij auto</button>
            : <span className="flex flex-wrap items-center gap-3" role="group" aria-label="Potwierdź usunięcie">
                <span className="text-sm text-neutral-200">Usunąć auto z tej przeglądarki?</span>
                <button type="button" onClick={onForget} className={`${btn} border-silver-600 bg-silver-600 hover:bg-silver-500`}>Tak, zapomnij</button>
                <button type="button" onClick={() => setConfirmForget(false)} className={btn}>Nie</button>
              </span>}
        </div>
      </section>
      {garage}
      <nav aria-label="Sekcje dla Twojego auta" className="mt-4">
        <ul className="flex flex-wrap gap-2">{nav.map(([id, label]) => <li key={id}><a href={`#${id}`} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-neutral-200 hover:border-silver-600 hover:text-white">{label}</a></li>)}</ul>
      </nav>

      <Section id="bezpieczniki" title={`Bezpieczniki — ${year}`}>
        {fuseYear ? (
          <>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className={`${chip} border-silver-600/50 bg-silver-600/10 text-silver-200`}>Tabela z instrukcji GM: rocznik {year}</span>
              <span className={`${chip} border-white/15 bg-white/5 text-neutral-200`}>{CHECK.replace(/^s/, 'S')}</span>
            </div>
            {!fuseOwnModel && <p data-testid="my-car-fuse-warning" className="mt-2 text-sm text-neutral-300">Tabele pochodzą z instrukcji C/K Pickup (1994–1998) i Suburban (1999). Twoje nadwozie może mieć inną obsadę – porównaj z pokrywą skrzynki.</p>}
            <details data-testid="my-car-fuses" className="mt-3 rounded-lg border border-white/10 p-3">
              <summary className="min-h-11 cursor-pointer content-center font-semibold text-white">Pokaż tabelę bezpieczników dla rocznika {year}</summary>
              <FuseTable initialYear={year} />
            </details>
          </>
        ) : <p className="mt-2 text-sm text-neutral-300">Dla rocznika {year} nie mamy tabeli z instrukcji GM (mamy 1994–1999). Zobacz <Link href="/schematy#fuse-locations" className="text-silver-400 underline">położenie skrzynek bezpieczników</Link> i {CHECK}.</p>}
      </Section>

      {knowledge.status !== 'ok' ? (
        <Section id="usterki" title="Usterki, DIY i opisy modelu">
          {knowledge.status === 'loading'
            ? <p className="mt-2 text-sm text-neutral-400" role="status">Wczytywanie bazy wiedzy…</p>
            : <p className="mt-2 text-sm text-neutral-300" role="alert">Nie udało się wczytać bazy wiedzy. <button type="button" onClick={knowledge.retry} className="ml-1 min-h-11 text-silver-400 underline">Spróbuj ponownie</button></p>}
        </Section>
      ) : (
        <>
          <Section id="usterki" title="Usterki" lead="Z bazy wiedzy, według modelu i lat opisanych przy materiale.">
            <KnowledgeRows items={knowledge.items} type="Usterka" profile={profile} testId="my-car-fault" empty="Brak usterek z zakresem obejmującym Twoje auto." />
          </Section>
          <Section id="diy" title="DIY i porady" lead="Procedury i porady z bazy wiedzy.">
            <KnowledgeRows items={knowledge.items} type="Porada" profile={profile} testId="my-car-diy" empty="Brak porad z zakresem obejmującym Twoje auto." />
          </Section>
        </>
      )}

      <Section id="porady" title="Porady ilustrowane" lead="Z Owner’s Manual 1999 Suburban/Tahoe.">
        <Rows rows={tips} testId="my-car-tip" empty="Te porady dotyczą Tahoe/Suburban 1999 – dla Twojego auta brak pasujących." />
        <p className="mt-2 text-xs text-neutral-500"><a href={ILLUSTRATED_TIPS_MANUAL} target="_blank" rel="noopener noreferrer" className="text-silver-400 underline">Instrukcja (PDF, GM)</a></p>
      </Section>

      <Section id="czesci" title="Części — zgodność" lead="Referencje społecznościowe; zawsze potwierdź numer części i RPO.">
        <Rows rows={parts} testId="my-car-part" empty="Brak części z zakresem obejmującym Twoje auto." />
        <p className="mt-2 text-sm"><Link href="/narzedzia/czesci" className="text-silver-400 underline">Pełna wyszukiwarka zgodności części</Link></p>
      </Section>

      {knowledge.status === 'ok' && (
        <Section id="model" title="Opis modelu w bazie">
          <KnowledgeRows items={knowledge.items} type="Model" profile={profile} testId="my-car-model" empty="Brak opisów modelu z zakresem obejmującym Twoje auto." />
        </Section>
      )}

      <Section id="rpo" title="Kody RPO Twojego auta" lead="Naklejka Service Parts Identification (zwykle w schowku). Kody rozkodowujemy tylko według dokumentów GM.">
        {profile.rpoCodes.length ? <RpoList codes={profile.rpoCodes} profile={profile} /> : <p className="mt-2 text-sm text-neutral-300">Nie dodano kodów RPO. Dodasz je przyciskiem „Zmień auto”.</p>}
        <p className="mt-3"><Link href="/narzedzia/rpo" data-testid="my-car-rpo-link" className={`${btn} border-silver-600`}>Otwórz dekoder RPO</Link></p>
      </Section>
    </>
  );
}
