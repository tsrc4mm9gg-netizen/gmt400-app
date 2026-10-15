'use client';

import { useState, useEffect, useMemo } from 'react';

type Item = {
  Nazwa: string;
  Typ: string;
  Model: string;
  Opis?: string;
  Objawy?: string;
  Rozwiązanie?: string;
  Lata?: string;
};

const modelImages: Record<string, string> = {
  'Tahoe': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/1997_Chevrolet_Tahoe.jpg/800px-1997_Chevrolet_Tahoe.jpg',
  'Suburban': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/1999_Chevrolet_Suburban.jpg/800px-1999_Chevrolet_Suburban.jpg',
  'C/K': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/1995_Chevrolet_C1500.jpg/800px-1995_Chevrolet_C1500.jpg',
  'Yukon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/1998_GMC_Yukon.jpg/800px-1998_GMC_Yukon.jpg',
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('modele');
  const [selectedModel, setSelectedModel] = useState('Wszystkie');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/notion')
      .then(r => r.json())
      .then(data => {
        setItems(data.results || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const models = useMemo(() => items.filter(i => i.Typ === 'Model'), [items]);
  const issues = useMemo(() => items.filter(i => i.Typ === 'Usterka'), [items]);
  const codes = useMemo(() => items.filter(i => i.Typ === 'Kod błędu'), [items]);
  const tips = useMemo(() => items.filter(i => i.Typ === 'Porada'), [items]);

  const uniqueModels = ['Wszystkie', ...Array.from(new Set(models.map(m => m.Model).filter(Boolean)))];

  const filterByModel = (list: Item[]) => {
    if (selectedModel === 'Wszystkie') return list;
    return list.filter(i => i.Model === selectedModel || i.Model === 'Wszystkie');
  };

  const filteredModels = useMemo(() =>
    models.filter(m =>
      m.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (m.Opis || '').toLowerCase().includes(query.toLowerCase())
    ), [models, query]);

  const filteredIssues = useMemo(() => {
    let result = filterByModel(issues);
    return result.filter(i =>
      i.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (i.Objawy || '').toLowerCase().includes(query.toLowerCase()) ||
      (i.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [issues, query, selectedModel]);

  const filteredCodes = useMemo(() => {
    let result = filterByModel(codes);
    return result.filter(c =>
      c.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (c.Opis || '').toLowerCase().includes(query.toLowerCase()) ||
      (c.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [codes, query, selectedModel]);

  const filteredTips = useMemo(() => {
    let result = filterByModel(tips);
    return result.filter(t =>
      t.Nazwa.toLowerCase().includes(query.toLowerCase()) ||
      (t.Rozwiązanie || '').toLowerCase().includes(query.toLowerCase())
    );
  }, [tips, query, selectedModel]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">Ładowanie bazy...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">GMT<span className="text-amber-400">400</span></h1>
          <input
            type="search"
            placeholder="Szukaj..."
            className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 text-sm w-full sm:w-80 focus:outline-none focus:border-amber-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <section className="bg-gradient-to-b from-neutral-900 to-neutral-950 py-12 px-4 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">Encyklopedia GMT400</h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">Chevrolet C/K, Tahoe, Suburban, Yukon (1988–2000)</p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {uniqueModels.map(m => (
            <button
              key={m}
              onClick={() => setSelectedModel(m)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedModel === m ? 'bg-amber-400 text-black' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['modele', 'usterki', 'kody', 'porady'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                tab === t ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-neutral-400'
              }`}
            >
              {t === 'modele' ? 'Modele' : t === 'usterki' ? 'Usterki' : t === 'kody' ? 'Kody błędów' : 'Porady DIY'}
            </button>
          ))}
        </div>

        {tab === 'modele' && (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredModels.map((m, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-400 transition">
                {modelImages[m.Model] && (
                  <img src={modelImages[m.Model]} alt={m.Nazwa} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-amber-400 font-semibold text-lg">{m.Nazwa}</h3>
                  <p className="text-sm text-neutral-500 mb-2">{m.Lata} • {m.Model}</p>
                  <p className={`text-neutral-300 text-sm ${
                    expanded === idx ? '' : 'line-clamp-3'
                  }`}>{m.Opis}</p>
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="mt-3 text-amber-400 text-sm font-medium"
                  >
                    {expanded === idx ? 'Zwiń' : 'Rozwiń więcej'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'usterki' && (
          <div className="space-y-4">
            {filteredIssues.map((i, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-amber-400">{i.Nazwa}</h3>
                  <span className="text-xs bg-neutral-800 px-2 py-1 rounded">{i.Model}</span>
                </div>
                {i.Objawy && <p className="text-sm text-neutral-400 mb-2"><strong>Objawy:</strong> {i.Objawy}</p>}
                {i.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{i.Rozwiązanie}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'kody' && (
          <div className="space-y-4">
            {filteredCodes.map((c, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 mb-1">{c.Nazwa}</h3>
                {c.Opis && <p className="text-sm text-neutral-400 mb-2">{c.Opis}</p>}
                {c.Rozwiązanie && <p className="text-neutral-300 text-sm whitespace-pre-line">{c.Rozwiązanie}</p>}
              </div>
            ))}
          </div>
        )}

        {tab === 'porady' && (
          <div className="space-y-4">
            {filteredTips.map((t, idx) => (
              <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                <h3 className="font-semibold text-amber-400 mb-2">{t.Nazwa}</h3>
                <p className="text-neutral-300 text-sm whitespace-pre-line">{t.Rozwiązanie}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-neutral-800 py-8 text-center text-neutral-500 text-sm">
        GMT400.pl • Dane z Notion • info@gmt400.pl
      </footer>
    </div>
  );
}
