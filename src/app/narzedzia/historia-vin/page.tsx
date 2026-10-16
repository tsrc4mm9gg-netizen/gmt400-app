'use client';

import { useState } from 'react';

type HistoryResult = {
  title: string;
  url: string;
  description: string;
  category: string;
  vinMatch: string;
};

type HistoryAlert = {
  level: string;
  title: string;
  url: string;
  description: string;
  message: string;
};

type HistoryResponse = {
  status: string;
  vin?: string;
  message?: string;
  manualLinks?: { web: string; images: string };
  results?: HistoryResult[];
  alerts?: HistoryAlert[];
  disclaimer?: string;
  error?: string;
};

const categoryLabels: Record<string, string> = {
  damage: 'Możliwa szkoda / wypadek',
  auction: 'Aukcja lub historia aukcyjna',
  listing: 'Ogłoszenie sprzedaży',
  other: 'Inny wynik',
};

export default function VinHistoryPage() {
  const [vin, setVin] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [error, setError] = useState('');

  async function checkVin(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setData(null);
    setLoading(true);

    try {
      const response = await fetch('/api/vin-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin }),
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Nie udało się sprawdzić VIN.');
      } else {
        setData(json);
        if (json.alerts?.some((alert: HistoryAlert) => alert.level === 'warning')) {
          playAlertSound();
        }
      }
    } catch {
      setError('Błąd połączenia z usługą sprawdzania VIN.');
    } finally {
      setLoading(false);
    }
  }

  function playAlertSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    } catch {
      // Dźwięk jest opcjonalny.
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold">Historia i zdjęcia po numerze VIN</h1>
      <p className="mt-2 text-slate-600">
        Wpisz pełny 17-znakowy numer VIN, aby wyszukać publiczne ślady tego konkretnego pojazdu: ogłoszenia, aukcje oraz informacje o możliwych szkodach.
      </p>

      <form onSubmit={checkVin} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={vin}
          onChange={(event) => setVin(event.target.value.toUpperCase())}
          placeholder="Wpisz 17-znakowy VIN"
          maxLength={20}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 font-mono uppercase"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Sprawdzam…' : 'Sprawdź VIN'}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">{error}</div>
      )}

      {data?.status === 'not_configured' && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">Automatyczne wyszukiwanie nie jest skonfigurowane</p>
          <p className="mt-1 text-amber-800">{data.message}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <a className="underline" href={data.manualLinks?.web} target="_blank" rel="noreferrer">
              Szukaj VIN w internecie
            </a>
            <a className="underline" href={data.manualLinks?.images} target="_blank" rel="noreferrer">
              Szukaj zdjęć po VIN
            </a>
          </div>
        </div>
      )}

      {data?.status === 'search_error' && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
          {data.message}
        </div>
      )}

      {data?.alerts && data.alerts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Ostrzeżenia</h2>
          <div className="mt-3 space-y-3">
            {data.alerts.map((alert, index) => (
              <div
                key={index}
                className={`rounded-lg border p-4 ${
                  alert.level === 'warning'
                    ? 'border-red-300 bg-red-50 text-red-900'
                    : 'border-amber-300 bg-amber-50 text-amber-900'
                }`}
              >
                <p className="font-semibold">{alert.message}</p>
                {alert.title && <p className="mt-1 font-medium">{alert.title}</p>}
                {alert.description && <p className="mt-1 text-sm">{alert.description}</p>}
                <a className="mt-2 inline-block underline" href={alert.url} target="_blank" rel="noreferrer">
                  Otwórz źródło
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {data?.results && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Znalezione wyniki ({data.results.length})</h2>
          {data.results.length === 0 ? (
            <p className="mt-3 text-slate-600">
              Nie znaleziono publicznych wyników dla tego VIN w aktualnie skonfigurowanym źródle wyszukiwania.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {data.results.map((result, index) => (
                <li key={index} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {categoryLabels[result.category] || result.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {result.vinMatch === 'confirmed' ? 'Pełny VIN widoczny w źródle' : 'Możliwe dopasowanie'}
                    </span>
                  </div>
                  <a className="mt-2 block font-semibold text-blue-700 underline" href={result.url} target="_blank" rel="noreferrer">
                    {result.title || result.url}
                  </a>
                  {result.description && <p className="mt-1 text-sm text-slate-600">{result.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {data?.disclaimer && (
        <p className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {data.disclaimer}
        </p>
      )}
    </main>
  );
}
