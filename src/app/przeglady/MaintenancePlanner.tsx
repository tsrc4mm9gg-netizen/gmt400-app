'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useHydrated, useStoredVehicleProfile } from '@/lib/vehicle-profile-store';
import { vehicleProfileShort, type VehicleProfile } from '@/lib/vehicle-profile';
import {
  CHECK, MI_KM, NORMAL_DEFINITION, NO_DATA, SCHEDULE_SOURCES, SEVERE_DEFINITION,
  buildIcs, formatNumber, getSchedule, intervalText, isIsoDate, itemStatus, transmissionKind,
  type ItemState, type ScheduleItem,
} from '@/lib/maintenance-schedule.mjs';

export const PRZEGLADY_STORAGE_KEY = 'gmt400_przeglady_v1';
type Done = Record<string, { km?: number; date?: string }>;
type CarState = { unit: 'km' | 'mi'; odo: string; lastKm: string; lastDate: string; kmPerYear: string; severe: boolean; emissions: 'LD' | 'HD'; done: Done };
const EMPTY: CarState = { unit: 'km', odo: '', lastKm: '', lastDate: '', kmPerYear: '', severe: false, emissions: 'LD', done: {} };
const YEARS = ['1995', '1996', '1997', '1998', '1999'];
const field = 'mt-1 block min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white focus:border-silver-600 focus:outline-none';
const btn = 'inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-silver-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-silver-500';
const seg = (on: boolean) => `${btn} ${on ? 'border-silver-400 bg-silver-400 text-neutral-950 hover:border-silver-300' : ''}`;

const STATE_LABEL: Record<ItemState, string> = { zalegle: 'Zaległe', wkrotce: 'Wkrótce', ok: 'OK', brak: 'Brak danych o wykonaniu', info: 'Bez interwału' };
const STATE_CLASS: Record<ItemState, string> = {
  zalegle: 'border-red-500/70 bg-red-950/40 text-red-200',
  wkrotce: 'border-white bg-white text-neutral-950',
  ok: 'border-silver-500/50 bg-silver-950/40 text-silver-200',
  brak: 'border-white/15 bg-white/5 text-neutral-300',
  info: 'border-white/15 bg-white/5 text-neutral-300',
};

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const fmtDate = (iso?: string | null) => (iso ? iso.split('-').reverse().join('.') : '');
const carKey = (p: VehicleProfile | null, year: string) => (p ? `${p.vin || ''}|${p.brand}|${p.model}|${p.year}` : `ogolny|${year}`);
function readAll(): Record<string, CarState> {
  try { const v = JSON.parse(localStorage.getItem(PRZEGLADY_STORAGE_KEY) || '{}'); return v && typeof v === 'object' && v.cars && typeof v.cars === 'object' ? v.cars : {}; } catch { return {}; }
}
function num(v: string): number | null { const n = Number(String(v).replace(/[\s\u00a0]/g, '').replace(',', '.')); return v.trim() && Number.isFinite(n) && n >= 0 ? n : null; }

function downloadIcs(ics: string) {
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) { window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`; return; }
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = 'gmt400-przeglady.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MaintenancePlanner() {
  const hydrated = useHydrated();
  const profile = useStoredVehicleProfile();
  const [generalYear, setGeneralYear] = useState('1996');
  const key = carKey(profile, generalYear);
  const [cars, setCars] = useState<Record<string, CarState>>({});
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const today = localToday();

  useEffect(() => { setCars(readAll()); setLoaded(true); }, []);
  const st: CarState = { ...EMPTY, ...(cars[key] || {}) };
  const update = (patch: Partial<CarState>) => {
    setCars(prev => {
      const next = { ...prev, [key]: { ...EMPTY, ...(prev[key] || {}), ...patch } };
      try { localStorage.setItem(PRZEGLADY_STORAGE_KEY, JSON.stringify({ version: 1, cars: next })); } catch { /* prywatny tryb — działa bez zapisu */ }
      return next;
    });
  };

  const year = profile?.year || generalYear;
  const schedule = useMemo(() => getSchedule({ year, engine: profile?.engine, transmission: profile?.transmission, drive: profile?.drive, emissions: st.emissions }), [year, profile?.engine, profile?.transmission, profile?.drive, st.emissions]);
  const source = schedule.source ? SCHEDULE_SOURCES[schedule.source] : null;
  const factor = st.unit === 'mi' ? MI_KM : 1;
  const odoRaw = num(st.odo);
  const odoKm = odoRaw == null ? null : Math.round(odoRaw * factor);
  const lastKmRaw = num(st.lastKm);
  const globalBase = { km: lastKmRaw == null ? undefined : Math.round(lastKmRaw * factor), date: isIsoDate(st.lastDate) ? st.lastDate : undefined };
  const kmPerYear = num(st.kmPerYear);
  const mode = st.severe ? 'severe' : 'normal';

  const rows = schedule.items.map(item => {
    const rule = item[mode];
    const base = st.done[item.id] || globalBase;
    return { item, rule, status: itemStatus(rule, base, odoKm, today, kmPerYear), own: Boolean(st.done[item.id]) };
  });
  const counts = rows.reduce((acc, r) => ({ ...acc, [r.status.state]: (acc[r.status.state] || 0) + 1 }), {} as Record<string, number>);

  const markDone = (item: ScheduleItem) => {
    if (odoKm == null && !item[mode]?.months) { setMessage('Wpisz najpierw obecny stan licznika.'); return; }
    update({ done: { ...st.done, [item.id]: { km: odoKm ?? undefined, date: today } } });
    setMessage(`Zapisano: ${item.label} — wykonane ${fmtDate(today)}${odoKm != null ? ` przy ${formatNumber(odoKm)} km` : ''}.`);
  };
  const undo = (item: ScheduleItem) => { const d = { ...st.done }; delete d[item.id]; update({ done: d }); setMessage(`Cofnięto oznaczenie: ${item.label}.`); };

  const addToCalendar = () => {
    const tomorrow = new Date(Date.parse(`${today}T00:00:00Z`) + 86400000).toISOString().slice(0, 10);
    const events = rows.filter(r => r.rule && r.status.reminderDate).map(r => {
      const date = r.status.reminderDate! < tomorrow ? tomorrow : r.status.reminderDate!;
      const at = r.status.dueKm != null ? ` przy ${formatNumber(r.status.dueKm)} km` : '';
      return {
        uid: `${key.replace(/[^A-Za-z0-9]/g, '')}-${r.item.id}-${date}`,
        date,
        summary: `GMT400: ${r.item.label}`,
        description: `Termin${at}${r.status.dueDate ? ` / do ${fmtDate(r.status.dueDate)}` : ''}. Interwał: ${intervalText(r.rule)}. Źródło: ${source?.label || 'GM'}, ${r.item.page || ''}. ${CHECK}\nhttps://www.gmt400.pl/przeglady`,
      };
    });
    if (!events.length) { setMessage('Brak terminów do kalendarza — wpisz stan licznika oraz datę i przebieg ostatniego serwisu (dla pozycji liczonych tylko w km podaj też średni roczny przebieg).'); return; }
    downloadIcs(buildIcs(events));
    setMessage(`Przygotowano plik kalendarza: ${events.length} ${events.length === 1 ? 'przypomnienie' : 'przypomnień'} (alarm 7 dni wcześniej i w dniu terminu).`);
  };

  if (!hydrated || !loaded) return <p className="mt-6 text-neutral-400" aria-busy="true">Ładowanie harmonogramu…</p>;

  return (
    <div className="mt-6 space-y-5" data-testid="przeglady">
      {profile ? (
        <section className="rounded-xl border border-silver-500/40 bg-neutral-900 p-4" data-testid="przeglady-car">
          <p className="text-xs uppercase tracking-wide text-silver-400">Aktywne auto</p>
          <p className="mt-1 text-lg font-bold">{vehicleProfileShort(profile)}</p>
          <p className="mt-1 text-sm text-neutral-300">Silnik: {profile.engine || 'nie podano'} · Skrzynia: {profile.transmission ? `${profile.transmission} (${transmissionKind(profile.transmission) === 'manual' ? 'manualna' : transmissionKind(profile.transmission) === 'auto' ? 'automatyczna' : 'nieznany typ'})` : 'nie podano'} · Napęd: {profile.drive || 'nie podano'}</p>
          <Link href="/moj-samochod" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-silver-300 underline">Zmień dane w Moje auto</Link>
        </section>
      ) : (
        <section className="rounded-xl border border-white/15 bg-neutral-900 p-4" data-testid="przeglady-no-car">
          <p className="font-semibold">Nie masz zapisanego auta.</p>
          <p className="mt-1 text-sm text-neutral-300">Zapisz auto w Moje auto, a harmonogram dopasujemy do rocznika, silnika, skrzyni i napędu. Poniżej widok ogólny — wszystkie pozycje (2WD i 4WD, automat i manual) dla wybranego rocznika.</p>
          <Link href="/moj-samochod" className={`${btn} mt-3 border-silver-500/60`}>Zapisz auto</Link>
          <fieldset className="mt-4">
            <legend className="text-sm text-neutral-300">Rocznik (widok ogólny)</legend>
            <div className="mt-1 flex flex-wrap gap-2">{YEARS.map(y => <button key={y} type="button" aria-pressed={generalYear === y} onClick={() => setGeneralYear(y)} className={seg(generalYear === y)}>{y}</button>)}</div>
          </fieldset>
        </section>
      )}

      {schedule.notice && <p role="note" className="rounded-xl border border-white/30 bg-white/5 p-3 text-sm text-white" data-testid="przeglady-notice">{schedule.notice}</p>}

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h2 className="text-lg font-bold text-silver-300">Warunki jazdy</h2>
        <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Harmonogram">
          <button type="button" aria-pressed={!st.severe} onClick={() => update({ severe: false })} className={seg(!st.severe)}>Normalny</button>
          <button type="button" aria-pressed={st.severe} onClick={() => update({ severe: true })} className={seg(st.severe)}>Ciężkie warunki</button>
        </div>
        <p className="mt-2 text-sm text-neutral-300">{st.severe ? SEVERE_DEFINITION : NORMAL_DEFINITION}</p>
        {schedule.basisYear === 1995 && !schedule.diesel && (
          <fieldset className="mt-3">
            <legend className="text-sm text-neutral-300">Klasa emisji (instrukcja 1995) — zależy od GVWR na etykiecie certyfikacyjnej</legend>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button type="button" aria-pressed={st.emissions === 'LD'} onClick={() => update({ emissions: 'LD' })} className={seg(st.emissions === 'LD')}>Light Duty</button>
              <button type="button" aria-pressed={st.emissions === 'HD'} onClick={() => update({ emissions: 'HD' })} className={seg(st.emissions === 'HD')}>Heavy Duty</button>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Klasę emisji podaje etykieta emisji pod maską (Vehicle Emission Control Information). Instrukcja: s. 7-4.</p>
          </fieldset>
        )}
      </section>

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-4">
        <h2 className="text-lg font-bold text-silver-300">Licznik i ostatni serwis</h2>
        <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Jednostka licznika">
          <button type="button" aria-pressed={st.unit === 'km'} onClick={() => update({ unit: 'km' })} className={seg(st.unit === 'km')}>Licznik w km</button>
          <button type="button" aria-pressed={st.unit === 'mi'} onClick={() => update({ unit: 'mi' })} className={seg(st.unit === 'mi')}>Licznik w milach</button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-neutral-300">Obecny stan licznika ({st.unit === 'mi' ? 'mile' : 'km'})
            <input inputMode="numeric" className={field} value={st.odo} onChange={e => update({ odo: e.target.value })} data-testid="przeglady-odo" placeholder="np. 245000" />
          </label>
          <label className="block text-sm text-neutral-300">Przebieg przy ostatnim serwisie ({st.unit === 'mi' ? 'mile' : 'km'})
            <input inputMode="numeric" className={field} value={st.lastKm} onChange={e => update({ lastKm: e.target.value })} data-testid="przeglady-last-km" />
          </label>
          <label className="block text-sm text-neutral-300">Data ostatniego serwisu
            <input type="date" className={field} value={st.lastDate} max={today} onChange={e => update({ lastDate: e.target.value })} data-testid="przeglady-last-date" />
          </label>
          <label className="block text-sm text-neutral-300">Średni przebieg roczny (km, opcjonalnie)
            <input inputMode="numeric" className={field} value={st.kmPerYear} onChange={e => update({ kmPerYear: e.target.value })} data-testid="przeglady-km-year" placeholder="np. 10000" />
          </label>
        </div>
        <p className="mt-2 text-xs text-neutral-400">Ostatni serwis przyjmujemy dla wszystkich pozycji, których nie oznaczysz osobno jako wykonane. Dane zostają tylko w tej przeglądarce (localStorage) — nic nie wysyłamy.</p>
        <button type="button" onClick={addToCalendar} className={`${btn} mt-3 w-full border-silver-400 bg-silver-400 text-neutral-950 hover:border-silver-300 sm:w-auto`} data-testid="przeglady-ics">Dodaj przypomnienie do kalendarza</button>
        <p aria-live="polite" className="mt-2 min-h-5 text-sm text-silver-200" data-testid="przeglady-message">{message}</p>
      </section>

      {schedule.items.length > 0 && (
        <section aria-labelledby="przeglady-lista">
          <h2 id="przeglady-lista" className="text-lg font-bold text-silver-300">Pozycje — {st.severe ? 'ciężkie warunki' : 'harmonogram normalny'}{schedule.emissions === 'HD' ? ' (Heavy Duty)' : schedule.emissions === 'D' ? ' (diesel)' : ''}</h2>
          <p className="mt-1 text-sm text-neutral-400" data-testid="przeglady-summary">Zaległe: {counts.zalegle || 0} · Wkrótce: {counts.wkrotce || 0} · OK: {counts.ok || 0}</p>
          <ul className="mt-3 space-y-3">
            {rows.map(({ item, rule, status, own }) => (
              <li key={item.id} className="rounded-xl border border-white/10 bg-neutral-900 p-3" data-testid="przeglady-item" data-state={status.state} data-id={item.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-neutral-400">{item.group}</p>
                    <h3 className="font-bold text-white">{item.label}</h3>
                  </div>
                  <span className={`inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-bold ${STATE_CLASS[status.state]}`} data-testid="przeglady-state">{STATE_LABEL[status.state]}</span>
                </div>
                <p className="mt-1 text-sm text-silver-200">{rule ? intervalText(rule) : item.info || NO_DATA}</p>
                {rule && item.info && <p className="mt-1 text-sm text-neutral-300">{item.info}</p>}
                {(status.dueKm != null || status.dueDate) && (
                  <p className="mt-1 text-sm text-neutral-300">Następnie: {status.dueKm != null && <>przy {formatNumber(status.dueKm)} km{status.kmLeft != null && ` (${status.kmLeft <= 0 ? `po terminie o ${formatNumber(-status.kmLeft)} km` : `zostało ${formatNumber(status.kmLeft)} km`})`}</>}{status.dueKm != null && status.dueDate && ' lub '}{status.dueDate && <>do {fmtDate(status.dueDate)}</>}</p>
                )}
                {own && <p className="mt-1 text-xs text-neutral-400">Oznaczone jako wykonane: {fmtDate(st.done[item.id].date)}{st.done[item.id].km != null && `, ${formatNumber(st.done[item.id].km!)} km`}</p>}
                {item.note && <p className="mt-1 text-xs text-neutral-400">{item.note}</p>}
                <p className="mt-1 text-xs text-neutral-500">Źródło: {source?.label}, rozdz. 7 {item.page}</p>
                {rule && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => markDone(item)} className={btn} data-testid="przeglady-done">Oznacz wykonane</button>
                    {own && <button type="button" onClick={() => undo(item)} className={btn}>Cofnij</button>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-sm text-neutral-300" data-testid="przeglady-sources">
        <h2 className="text-lg font-bold text-silver-300">Źródła</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {Object.entries(SCHEDULE_SOURCES).map(([k, s]) => (
            <li key={k} className={k === schedule.source ? 'text-white' : ''}><a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline">{s.label}</a> — rozdz. 7 „Maintenance Schedule”; kopia w „Dokumenty GMT400”: {s.drive}</li>
          ))}
        </ul>
        <p className="mt-2">Silniki diesla 1996–1999: instrukcja odsyła do „Diesel Engine Supplement” — {NO_DATA}. Roczniki 1988–1994 i 2000: {NO_DATA} (pokazujemy najbliższą instrukcję jako odniesienie). Wymiana płynu hamulcowego i oleju skrzyni rozdzielczej: {NO_DATA}.</p>
        <p className="mt-2 font-semibold text-white">{CHECK}</p>
      </section>
    </div>
  );
}
