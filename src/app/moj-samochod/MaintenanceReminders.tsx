'use client';

import { useEffect, useId, useState } from 'react';
import AccordionSection from '../ui/AccordionSection';
import { useServiceHistory } from '@/lib/service-history-store';

type Reminder = { id: string; name: string; intervalKm: number; lastKm: number; lastDate: string };
const STORAGE_KEY = 'gmt400-reminders';
const KM_KEY = 'gmt400-current-km';
const DEFAULTS = [
  ['Olej + filtr', 8000], ['Filtr powietrza', 20000], ['Filtr paliwa', 40000],
  ['Świece zapłonowe', 50000], ['ATF (skrzynia)', 60000],
  ['Płyn chłodniczy', 80000], ['Płyn hamulcowy', 40000],
] as const;
const validKm = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
function validReminders(value: unknown): value is Reminder[] {
  if (!Array.isArray(value)) return false;
  const ids = new Set<string>();
  return value.every(r => {
    if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !r.id || ids.has(r.id) || typeof r.name !== 'string' || !r.name.trim() || !validKm(r.intervalKm) || r.intervalKm === 0 || !validKm(r.lastKm) || typeof r.lastDate !== 'string') return false;
    ids.add(r.id);
    return true;
  });
}
function parseKm(value: string): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const number = Number(value);
  return validKm(number) ? number : null;
}
const field = 'min-h-11 w-full rounded-lg border border-white/30 bg-neutral-950 px-3 py-2 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-400';
const button = 'min-h-11 rounded-lg border border-white/30 px-4 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-400 disabled:opacity-50';

export default function MaintenanceReminders({ vehicleId }: { vehicleId: string }) {
  const id = useId();
  const { addRecord } = useServiceHistory(vehicleId);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentKm, setCurrentKm] = useState(0);
  const [kmInput, setKmInput] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editKm, setEditKm] = useState('');
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved: unknown = raw === null ? DEFAULTS.map(([name, intervalKm], i) => ({ id: String(i), name, intervalKm, lastKm: 0, lastDate: '' })) : JSON.parse(raw);
      if (!validReminders(saved)) throw new Error('Invalid reminders');
      const rawKm = localStorage.getItem(KM_KEY);
      const km = rawKm === null ? 0 : parseKm(rawKm);
      if (km === null) throw new Error('Invalid mileage');
      setReminders(saved);
      setCurrentKm(km);
    } catch {
      setBlocked(true);
      setError('Nie można bezpiecznie odczytać danych. Zapisywanie zostało zablokowane; istniejące dane nie zostały usunięte ani nadpisane.');
    }
    setReady(true);
  }, []);

  function updateKm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blocked) return;
    setNotice('');
    const km = parseKm(kmInput);
    if (km === null) { setError('Podaj przebieg jako nieujemną liczbę całkowitą.'); return; }
    try { localStorage.setItem(KM_KEY, String(km)); }
    catch { setError('Nie udało się zapisać przebiegu w przeglądarce. Spróbuj ponownie.'); return; }
    setCurrentKm(km);
    setKmInput('');
    setError('');
    setNotice('Przebieg został zapisany.');
  }

  function markDone(event: React.FormEvent<HTMLFormElement>, reminder: Reminder) {
    event.preventDefault();
    if (blocked) return;
    setNotice('');
    const km = parseKm(editKm);
    if (km === null) { setError('Podaj przebieg wykonania jako nieujemną liczbę całkowitą.'); return; }
    const date = new Date();
    const lastDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const updated = reminders.map(r => r.id === reminder.id ? { ...r, lastKm: km, lastDate } : r);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); }
    catch { setError('Nie udało się zapisać przeglądu. Wpis pozostaje otwarty do ponowienia zapisu.'); return; }
    setReminders(updated);
    addRecord({ title: reminder.name, date: lastDate, mileageKm: km, notes: 'Zapis automatyczny z przypomnienia' });
    setEditing(null);
    setEditKm('');
    setError('');
    setNotice(`Zapisano wykonanie: ${reminder.name}.`);
  }

  if (!ready) return null;
  return (
    <div className="mt-6">
      <AccordionSection title="Przypomnienia przeglądów" defaultOpen>
        <div className="space-y-4">
          <p id={`${id}-help`} className="text-sm text-neutral-300">Dane są zapisywane tylko w tej przeglądarce. Interwały są orientacyjne — sprawdź w instrukcji. Przed zapisem wykonania sprawdź przebieg i datę na urządzeniu.</p>
          <p id={`${id}-error`} role="alert" className="text-sm text-red-300">{error}</p>
          <p role="status" className="text-sm text-silver-200">{notice}</p>
          <form onSubmit={updateKm} noValidate className="flex flex-wrap items-end gap-3" aria-describedby={`${id}-help ${id}-error`}>
            <label className="min-w-0 flex-1" htmlFor={`${id}-km`}>Aktualny przebieg (km)
              <input id={`${id}-km`} type="text" inputMode="numeric" value={kmInput} onChange={e => setKmInput(e.target.value)} disabled={blocked} className={field} />
            </label>
            <button type="submit" disabled={blocked} className={button}>Zapisz przebieg</button>
          </form>
          <p className="text-sm text-neutral-300">Zapisany przebieg: {currentKm.toLocaleString('pl-PL')} km</p>
          <ul className="space-y-3">
            {reminders.map((r, index) => {
              const inputId = `${id}-service-${index}`;
              const hasHistory = r.lastDate !== '' || r.lastKm > 0;
              const remaining = r.lastKm + r.intervalKm - currentKm;
              const status = !hasHistory ? 'Brak danych o wykonaniu.' : remaining <= 0 ? `Termin osiągnięty lub przekroczony o ${Math.abs(remaining).toLocaleString('pl-PL')} km.` : `Do kolejnego terminu: ${remaining.toLocaleString('pl-PL')} km.`;
              return (
                <li key={r.id} className="rounded-lg border border-white/20 bg-neutral-950 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-white">{r.name} <span className="text-sm font-normal text-neutral-300">co {r.intervalKm.toLocaleString('pl-PL')} km</span></p>
                    <button type="button" disabled={blocked} aria-expanded={editing === r.id} aria-controls={`${inputId}-form`} aria-label={`${editing === r.id ? 'Anuluj edycję' : 'Oznacz wykonanie'}: ${r.name}`} className={button} onClick={() => { setEditing(editing === r.id ? null : r.id); setEditKm(String(currentKm)); setError(''); setNotice(''); }}>{editing === r.id ? 'Anuluj' : 'Oznacz wykonane'}</button>
                  </div>
                  <p className="mt-2 text-sm text-neutral-300">{hasHistory ? `Ostatnio: ${r.lastKm.toLocaleString('pl-PL')} km (${r.lastDate || 'brak daty'}). ` : ''}{status}</p>
                  <form id={`${inputId}-form`} hidden={editing !== r.id} onSubmit={event => markDone(event, r)} noValidate aria-describedby={`${id}-error`}>
                    <label htmlFor={inputId} className="mt-3 block text-sm text-neutral-200">Przebieg wykonania — {r.name} (km)</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <input id={inputId} type="text" inputMode="numeric" value={editing === r.id ? editKm : ''} onChange={event => setEditKm(event.target.value)} disabled={blocked} className={field} />
                      <button type="submit" disabled={blocked} aria-label={`Zapisz wykonanie: ${r.name}`} className={button}>Zapisz wykonanie</button>
                    </div>
                  </form>
                </li>
              );
            })}
          </ul>
        </div>
      </AccordionSection>
    </div>
  );
}
