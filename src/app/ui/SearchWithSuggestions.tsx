'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Suggestion = {
  type: 'usterka' | 'diy' | 'kod' | 'czesc' | 'model';
  title: string;
  href: string;
};

const SUGGESTIONS: Suggestion[] = [
  { type: 'usterka', title: 'Nie odpala', href: '/usterki?q=nie+odpala' },
  { type: 'usterka', title: 'Szarpie / gaśnie', href: '/usterki?q=szarpie' },
  { type: 'usterka', title: 'Skrzynia ślizga', href: '/usterki?q=skrzynia' },
  { type: 'usterka', title: 'Przegrzewa się', href: '/usterki?q=przegrzewa' },
  { type: 'usterka', title: 'Check Engine', href: '/kody-obd' },
  { type: 'diy', title: 'Wymiana oleju', href: '/diy?q=olej' },
  { type: 'diy', title: 'Wymiana świec', href: '/diy?q=swiece' },
  { type: 'diy', title: 'Wymiana klocków', href: '/diy?q=klocki' },
  { type: 'diy', title: 'Wymiana filtra ATF', href: '/diy?q=atf' },
  { type: 'kod', title: 'P0300 — wypadanie zapłonu', href: '/kody-obd/p0300' },
  { type: 'kod', title: 'P0171 — uboga mieszanka', href: '/kody-obd/p0171' },
  { type: 'kod', title: 'P0440 — EVAP', href: '/kody-obd/p0440' },
  { type: 'czesc', title: 'Filtr oleju PF52', href: '/eksploatacja' },
  { type: 'czesc', title: 'Świece 41-932', href: '/eksploatacja' },
  { type: 'czesc', title: 'Pompa paliwa EP381', href: '/eksploatacja' },
  { type: 'model', title: 'Tahoe', href: '/modele?q=tahoe' },
  { type: 'model', title: 'Suburban', href: '/modele?q=suburban' },
  { type: 'model', title: 'Silverado', href: '/modele?q=silverado' },
  { type: 'model', title: 'Sierra', href: '/modele?q=sierra' },
  { type: 'model', title: 'Yukon', href: '/modele?q=yukon' },
];

const TYPE_LABELS: Record<Suggestion['type'], string> = {
  usterka: 'Usterka',
  diy: 'DIY',
  kod: 'Kod OBD',
  czesc: 'Część',
  model: 'Model',
};

export default function SearchWithSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filterSuggestions = useCallback((q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = SUGGESTIONS.filter(s =>
      s.title.toLowerCase().includes(lower)
    ).slice(0, 6);
    setSuggestions(filtered);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => filterSuggestions(query), 150);
    return () => clearTimeout(timer);
  }, [query, filterSuggestions]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      router.push(suggestions[selectedIndex].href);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedIndex >= 0) {
      router.push(suggestions[selectedIndex].href);
    } else if (query.trim()) {
      router.push(`/szukaj?q=${encodeURIComponent(query.trim())}`);
    }
    setShowSuggestions(false);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="relative px-4 pb-4">
      <label htmlFor="home-search" className="sr-only">Szukaj w encyklopedii GMT400</label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id="home-search"
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          maxLength={120}
          placeholder="Szukaj: kod, objaw, część…"
          autoComplete="off"
          className="min-h-14 min-w-0 flex-1 rounded-xl border-2 border-silver-600 bg-neutral-900 px-4 text-lg text-white placeholder:text-neutral-500 focus:border-silver-500 focus:outline-none focus:ring-2 focus:ring-silver-600/40"
        />
        <button type="submit" className="min-h-14 shrink-0 rounded-xl bg-silver-600 px-5 text-lg font-bold text-neutral-950 shadow-lg shadow-silver-600/30 hover:bg-silver-500">
          Szukaj
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute left-4 right-4 top-full z-50 mt-1 max-h-80 overflow-auto rounded-xl border border-white/10 bg-neutral-900 shadow-xl"
        >
          {suggestions.map((s, i) => (
            <button
              key={s.href + s.title}
              type="button"
              onClick={() => { router.push(s.href); setShowSuggestions(false); }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-neutral-800 ${i === selectedIndex ? 'bg-neutral-800' : ''}`}
            >
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                {TYPE_LABELS[s.type]}
              </span>
              <span className="text-white">{s.title}</span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
