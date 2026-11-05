'use client';

import { useId, useState } from 'react';
import { useServiceHistory } from '@/lib/service-history-store';
import type { ServiceRecord } from '@/lib/service-history';

const field = 'mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-neutral-950 px-3 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-400';
const button = 'inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold text-white hover:border-silver-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-silver-400';

export default function ServiceHistory({ vehicleId }: { vehicleId: string }) {
  const id = useId();
  const { records, addRecord, deleteRecord, exportJson } = useServiceHistory(vehicleId);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice('');
    const mileageKm = Number(mileage);
    if (!title.trim()) return setError('Podaj nazwę wykonanej pracy.');
    if (!date) return setError('Podaj datę wykonania.');
    if (!Number.isSafeInteger(mileageKm) || mileageKm < 0) return setError('Podaj przebieg jako nieujemną liczbę całkowitą.');
    const costPln = cost.trim() ? Number(cost.replace(',', '.')) : undefined;
    if (costPln !== undefined && (!Number.isFinite(costPln) || costPln < 0)) return setError('Koszt musi być nieujemną liczbą.');
    const ok = addRecord({ title: title.trim(), date, mileageKm, costPln, notes: notes.trim() || undefined });
    if (!ok) return setError('Nie udało się zapisać wpisu. Dane mogą być dostępne tylko do zamknięcia karty.');
    setError('');
    setNotice('Dodano wpis do historii serwisowej.');
    setTitle('');
    setDate('');
    setMileage('');
    setCost('');
    setNotes('');
  };

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `historia-serwisowa-${vehicleId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section aria-labelledby={`${id}-h`} className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4 sm:p-5">
      <h2 id={`${id}-h`} className="text-xl font-semibold text-silver-300">Historia serwisowa</h2>
      <p className="mt-1 text-sm text-neutral-400">Wpisy są przypisane do aktywnego auta i zapisywane wyłącznie w tej przeglądarce.</p>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-silver-200">{notice}</p>
      <p role="alert" className="mt-2 min-h-5 text-sm text-danger-300">{error}</p>

      <form onSubmit={submit} noValidate className="mt-3 grid gap-3 sm:grid-cols-2" aria-describedby={`${id}-h`}>
        <label className="block text-sm text-neutral-300 sm:col-span-2">Nazwa pracy
          <input className={field} value={title} onChange={event => setTitle(event.target.value)} required />
        </label>
        <label className="block text-sm text-neutral-300">Data
          <input className={field} type="date" value={date} onChange={event => setDate(event.target.value)} required />
        </label>
        <label className="block text-sm text-neutral-300">Przebieg (km)
          <input className={field} type="text" inputMode="numeric" value={mileage} onChange={event => setMileage(event.target.value)} required />
        </label>
        <label className="block text-sm text-neutral-300">Koszt (PLN, opcjonalnie)
          <input className={field} type="text" inputMode="decimal" value={cost} onChange={event => setCost(event.target.value)} />
        </label>
        <label className="block text-sm text-neutral-300">Notatka (opcjonalnie)
          <input className={field} value={notes} onChange={event => setNotes(event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" className={`${button} border-silver-600 bg-silver-600 text-neutral-950 hover:bg-silver-500`}>Dodaj wpis</button>
          <button type="button" onClick={download} className={button} disabled={!records.length}>Eksportuj JSON</button>
        </div>
      </form>

      {records.length ? (
        <ul className="mt-4 space-y-2">
          {records.map((record: ServiceRecord) => (
            <li key={record.id} className="rounded-lg border border-white/10 bg-black/40 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-white">{record.title}</p>
                  <p className="mt-1 text-sm text-neutral-300">{record.date} · {record.mileageKm.toLocaleString('pl-PL')} km{record.costPln !== undefined ? ` · ${record.costPln.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })}` : ''}</p>
                  {record.notes && <p className="mt-1 break-words text-sm text-neutral-400">{record.notes}</p>}
                </div>
                {confirmId === record.id ? (
                  <span role="group" aria-label={`Potwierdź usunięcie: ${record.title}`} className="flex gap-2">
                    <button type="button" className={`${button} border-danger-500 text-danger-200`} onClick={() => { deleteRecord(record.id); setConfirmId(null); setNotice('Usunięto wpis historii.'); }}>Usuń</button>
                    <button type="button" className={button} onClick={() => setConfirmId(null)}>Anuluj</button>
                  </span>
                ) : (
                  <button type="button" className={button} aria-label={`Usuń wpis: ${record.title}`} onClick={() => setConfirmId(record.id)}>Usuń</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-neutral-300">Brak wpisów dla tego auta.</p>
      )}
    </section>
  );
}
