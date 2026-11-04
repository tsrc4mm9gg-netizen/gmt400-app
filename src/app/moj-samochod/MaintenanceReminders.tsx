'use client';

import { useState, useEffect } from 'react';
import AccordionSection from '../ui/AccordionSection';

type Reminder = {
  id: string;
  name: string;
  intervalKm: number;
  lastKm: number;
  lastDate: string;
};

const DEFAULT_REMINDERS: Omit<Reminder, 'id' | 'lastKm' | 'lastDate'>[] = [
  { name: 'Olej + filtr', intervalKm: 8000 },
  { name: 'Filtr powietrza', intervalKm: 20000 },
  { name: 'Filtr paliwa', intervalKm: 40000 },
  { name: 'Świece zapłonowe', intervalKm: 50000 },
  { name: 'ATF (skrzynia)', intervalKm: 60000 },
  { name: 'Płyn chłodniczy', intervalKm: 80000 },
  { name: 'Płyn hamulcowy', intervalKm: 40000 },
];

const STORAGE_KEY = 'gmt400-reminders';
const KM_KEY = 'gmt400-current-km';

function loadReminders(): Reminder[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_REMINDERS.map((r, i) => ({
    ...r,
    id: String(i),
    lastKm: 0,
    lastDate: '',
  }));
}

function saveReminders(reminders: Reminder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch {}
}

function loadKm(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Number(localStorage.getItem(KM_KEY)) || 0;
  } catch {}
  return 0;
}

function saveKm(km: number) {
  try {
    localStorage.setItem(KM_KEY, String(km));
  } catch {}
}

export default function MaintenanceReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [currentKm, setCurrentKm] = useState(0);
  const [kmInput, setKmInput] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editKm, setEditKm] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReminders(loadReminders());
    setCurrentKm(loadKm());
    setReady(true);
  }, []);

  function updateKm() {
    const km = Number(kmInput);
    if (km > 0) {
      setCurrentKm(km);
      saveKm(km);
      setKmInput('');
    }
  }

  function markDone(id: string) {
    const km = Number(editKm) || currentKm;
    const updated = reminders.map(r =>
      r.id === id ? { ...r, lastKm: km, lastDate: new Date().toISOString().split('T')[0] } : r
    );
    setReminders(updated);
    saveReminders(updated);
    setEditing(null);
    setEditKm('');
  }

  function getStatus(r: Reminder): { status: 'ok' | 'soon' | 'overdue'; remaining: number } {
    if (r.lastKm === 0) return { status: 'soon', remaining: r.intervalKm };
    const nextKm = r.lastKm + r.intervalKm;
    const remaining = nextKm - currentKm;
    if (remaining < 0) return { status: 'overdue', remaining };
    if (remaining < r.intervalKm * 0.2) return { status: 'soon', remaining };
    return { status: 'ok', remaining };
  }

  if (!ready) return null;

  const overdue = reminders.filter(r => getStatus(r).status === 'overdue');
  const soon = reminders.filter(r => getStatus(r).status === 'soon');

  return (
    <div className="mt-6">
      <AccordionSection title="Przypomnienia przeglądów" defaultOpen>
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex-1">
              <span className="text-sm text-neutral-400">Aktualny przebieg (km)</span>
              <input
                type="number"
                value={kmInput}
                onChange={e => setKmInput(e.target.value)}
                placeholder={currentKm > 0 ? String(currentKm) : 'np. 150000'}
                className="mt-1 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 py-2 text-white"
              />
            </label>
            <button
              type="button"
              onClick={updateKm}
              className="rounded-lg bg-silver-600 px-4 py-2 font-medium text-neutral-950 hover:bg-silver-500"
            >
              Zapisz
            </button>
          </div>

          {currentKm > 0 && (
            <p className="text-sm text-neutral-400">
              Zapisany przebieg: <strong className="text-white">{currentKm.toLocaleString()} km</strong>
            </p>
          )}

          {(overdue.length > 0 || soon.length > 0) && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-950/30 p-3">
              {overdue.length > 0 && (
                <p className="text-sm text-amber-300">
                  <strong>Przeterminowane:</strong> {overdue.map(r => r.name).join(', ')}
                </p>
              )}
              {soon.length > 0 && (
                <p className="mt-1 text-sm text-amber-200">
                  <strong>Wkrótce:</strong> {soon.map(r => r.name).join(', ')}
                </p>
              )}
            </div>
          )}

          <ul className="space-y-2">
            {reminders.map(r => {
              const { status, remaining } = getStatus(r);
              const statusColors = {
                ok: 'border-green-500/30 bg-green-950/20',
                soon: 'border-amber-500/30 bg-amber-950/20',
                overdue: 'border-red-500/30 bg-red-950/20',
              };
              return (
                <li key={r.id} className={`rounded-lg border p-3 ${statusColors[status]}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white">{r.name}</span>
                      <span className="ml-2 text-xs text-neutral-400">co {r.intervalKm.toLocaleString()} km</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditing(editing === r.id ? null : r.id)}
                      className="text-sm text-silver-400 hover:text-silver-300"
                    >
                      {editing === r.id ? 'Anuluj' : 'Oznacz wykonane'}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">
                    {r.lastKm > 0 ? (
                      <>
                        Ostatnio: {r.lastKm.toLocaleString()} km ({r.lastDate})
                        {status === 'overdue' && <span className="ml-2 text-red-400">— spóźnione o {Math.abs(remaining).toLocaleString()} km</span>}
                        {status === 'soon' && <span className="ml-2 text-amber-400">— za {remaining.toLocaleString()} km</span>}
                        {status === 'ok' && <span className="ml-2 text-green-400">— za {remaining.toLocaleString()} km</span>}
                      </>
                    ) : (
                      <span className="text-neutral-500">Brak danych — oznacz wykonane</span>
                    )}
                  </p>
                  {editing === r.id && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        value={editKm}
                        onChange={e => setEditKm(e.target.value)}
                        placeholder={currentKm > 0 ? String(currentKm) : 'Przebieg'}
                        className="w-32 rounded border border-white/15 bg-neutral-950 px-2 py-1 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => markDone(r.id)}
                        className="rounded bg-silver-600 px-3 py-1 text-sm font-medium text-neutral-950 hover:bg-silver-500"
                      >
                        Zapisz
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-neutral-500">
            Dane są zapisywane tylko w tej przeglądarce. Interwały są orientacyjne — sprawdź w instrukcji.
          </p>
        </div>
      </AccordionSection>
    </div>
  );
}
