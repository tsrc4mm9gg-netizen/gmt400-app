'use client';
import { useEffect, useState } from 'react';
export const SEARCH_SESSION_KEY = 'gmt400_search_session_v1';
export function useSearchSession() {
  const [query, setQuery] = useState('');
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(SEARCH_SESSION_KEY);
      if (raw) {
        let value: unknown;
        try { value = JSON.parse(raw); } catch { value = null; }
        const record = value as { version?: unknown; query?: unknown } | null;
        if (record?.version === 1 && typeof record.query === 'string' && record.query.length <= 120) setQuery(record.query);
        else window.sessionStorage.removeItem(SEARCH_SESSION_KEY);
      }
      setStorageAvailable(true);
    } catch { setStorageAvailable(false); }
    setReady(true);
  }, []);
  const updateQuery = (value: string) => {
    const next = value.slice(0, 120);
    setQuery(next);
    try {
      if (next) window.sessionStorage.setItem(SEARCH_SESSION_KEY, JSON.stringify({ version: 1, query: next }));
      else window.sessionStorage.removeItem(SEARCH_SESSION_KEY);
      setStorageAvailable(true);
    } catch { setStorageAvailable(false); }
  };
  return { query, updateQuery, ready, storageAvailable };
}
